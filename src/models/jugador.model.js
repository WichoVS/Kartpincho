class Jugador {
  body;
  mesh;
  mass;
  name;
  camera;
  renderer;
  engineForce;
  maxSteerVal;
  wheelBodies = [];
  wheelsVisual = [];
  vehicle;
  checkpoints;
  // En el render lo uso si está cargado lo agrego al mundo.
  isLoaded = false;
  // Si ya está agregado al mundo y quiero saber si está el jugador.
  // Esto para agregarlo a un array de los jugadores actuales e ir actualizando
  // Las físicas del mismo en la web.
  loaded = false;
  worldReady = false;
  cameraOffset = new THREE.Vector3(0, 3, -10);
  totalPlayers;
  vueltas = [];
  tiempoActual;
  flagTrigger = false;
  fastestTime;

  constructor(
    _pathModel,
    _pathTexture,
    _name,
    _wheelMaterial,
    _world,
    _mass,
    _totalPlayers,
    _origin
  ) {
    this.vueltas = 0;
    this.checkpoints = 0;
    this.tiempoActual = 0;
    this.fastestTime = -1;
    this.totalPlayers = _totalPlayers;
    this.name = _name;
    this.engineForce = 1000;
    this.maxSteerVal = 0.1;
    this.camera = this.CrearCamara();
    this.camera.position.set(0, 2, -10);
    this.camera.lookAt(0, 0, 0);
    this.renderer = this.CrearRenderer();
    $("#game").append(
      `<div id="${this.name}" style="position:relative"></div>`
    );
    this.AddUIPlayer();
    $(`#${this.name}`).append(this.renderer.domElement);
    window.addEventListener(
      "resize",
      () => {
        this.OnWindowResize();
      },
      false
    );

    this.CargaModelo(
      _pathModel,
      _pathTexture,
      _name,
      _wheelMaterial,
      _world,
      _mass,
      _origin
    );
  }

  CargaModelo(
    _pathModel,
    _pathTexture,
    _name,
    _wheelMaterial,
    _world,
    _mass,
    _origin
  ) {
    var mLoader = new THREE.FBXLoader();
    var tLoader = new THREE.TextureLoader();

    mLoader.load(
      _pathModel,
      (fbx) => {
        let color = tLoader.load(_pathTexture);
        let texture = new THREE.MeshStandardMaterial({
          map: color,
        });

        fbx.traverse((child) => {
          if (child.isMesh) {
            child.material = texture;
            this.mesh = child;
            this.mesh.name = _name;
            this.mesh.translateX(0);
            this.mesh.translateY(0);
            this.mesh.translateZ(0);
            this.mesh.scale.set(1, 1, 1);
          }
        });

        this.camera.position.copy(this.mesh.position).add(this.cameraOffset);
        this.camera.lookAt(this.mesh.position);
        this.mesh.add(this.camera);

        this.CargaFisicas(_wheelMaterial, _world, _mass, _origin);
      },
      undefined,
      (error) => {
        console.log(error);
      }
    );
  }

  CargaFisicas(_wheelMaterial, _world, _mass, _origin) {
    var chassisShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.35, 1));
    var chassisBody = new CANNON.Body({ mass: _mass });
    chassisBody.userData = { name: this.name };
    chassisBody.addShape(chassisShape);
    chassisBody.linearDamping = 0.15;
    chassisBody.position.copy(_origin);
    chassisBody.angularVelocity.set(0, 0, 0); // initial velocity

    this.vehicle = new CANNON.RaycastVehicle({
      chassisBody: chassisBody,
      indexRightAxis: 0, // x
      indexUpAxis: 1, // y
      indexForwardAxis: 2, // z
    });

    var options = {
      radius: 0.2,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 30,
      suspensionRestLength: 0.3,
      frictionSlip: 5,
      dampingRelaxation: 2.3,
      dampingCompression: 4.4,
      maxSuspensionForce: 100000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
      maxSuspensionTravel: 0.3,
      customSlidingRotationalSpeed: -30,
      useCustomSlidingRotationalSpeed: true,
    };

    var axlewidth = 0.5;
    //TraseraLeft
    options.chassisConnectionPointLocal.set(axlewidth, 0, -0.6);
    this.vehicle.addWheel(options);
    //TraseraRight
    options.chassisConnectionPointLocal.set(-axlewidth, 0, -0.6);
    this.vehicle.addWheel(options);

    //DelanteraLeft
    options.chassisConnectionPointLocal.set(axlewidth, 0, 0.4);
    this.vehicle.addWheel(options);
    //DelanteraRight
    options.chassisConnectionPointLocal.set(-axlewidth, 0, 0.4);
    this.vehicle.addWheel(options);

    this.vehicle.addToWorld(_world);

    this.vehicle.wheelInfos.forEach((wheel) => {
      var shape = new CANNON.Cylinder(
        wheel.radius,
        wheel.radius,
        wheel.radius,
        20
      );
      this.body = new CANNON.Body({ mass: 0, material: _wheelMaterial });
      this.body.type = CANNON.Body.KINEMATIC;
      this.body.collisionFilterGroup = 0;
      var q = new CANNON.Quaternion();
      q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
      this.body.addShape(shape, new CANNON.Vec3(), q);
      this.wheelBodies.push(this.body);
      // wheel visual body
      var geometry = new THREE.CylinderGeometry(
        wheel.radius,
        wheel.radius,
        wheel.radius,
        32
      );
      var material = new THREE.MeshPhongMaterial({
        color: 0xd0901d,
        emissive: 0xaa0000,
        side: THREE.DoubleSide,
        flatShading: true,
      });
      var cylinder = new THREE.Mesh(geometry, material);
      cylinder.geometry.rotateZ(Math.PI / 2);
      this.wheelsVisual.push(cylinder);
    });

    _world.addEventListener("postStep", this.PostStepWheels.bind(this), false);

    this.isLoaded = true;
  }

  PostStepWheels() {
    for (var i = 0; i < this.vehicle.wheelInfos.length; i++) {
      this.vehicle.updateWheelTransform(i);
      var t = this.vehicle.wheelInfos[i].worldTransform;
      // update wheel physics
      this.wheelBodies[i].position.copy(t.position);
      this.wheelBodies[i].quaternion.copy(t.quaternion);
      // update wheel visuals
      this.wheelsVisual[i].position.copy(t.position);
      this.wheelsVisual[i].quaternion.copy(t.quaternion);
    }
  }

  CrearCamara() {
    return new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      30000
    );
  }

  FlagCollisionReset() {
    setTimeout(() => {
      this.flagTrigger = false;
    }, 1000);
  }

  AddTimeVuelta() {
    this.tiempoActual++;
  }

  AddVuelta(pTotalChecks) {
    if (this.fastestTime !== -1) {
      if (this.fastestTime > this.tiempoActual || this.fastestTime == 0) {
        this.fastestTime = this.tiempoActual;
        this.tiempoActual = 0;
      }
      if (this.checkpoints == pTotalChecks) {
        this.vueltas++;
        this.tiempoActual = 0;
        this.checkpoints = 0;
      }
    } else {
      this.fastestTime = 0;
    }
  }

  AddCheckpoint() {
    this.checkpoints++;
  }

  CrearRenderer() {
    let renderer;
    switch (this.totalPlayers) {
      case 1:
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        break;
      case 2:
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight / 2);
        break;
      case 3:
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        break;
      case 4:
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        break;
      default:
        break;
    }
    return renderer;
  }

  OnWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    switch (this.totalPlayers) {
      case 1:
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        break;
      case 2:
        this.renderer.setSize(window.innerWidth, window.innerHeight / 2);
        break;
      case 3:
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        break;
      case 4:
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        break;

      default:
        break;
    }
  }

  AddUIPlayer() {
    $(`#${this.name}`).append(`
      <div class="div-player-ui">
        <div class="player-ui-top">
          <label id="${this.name}vueltas">Vueltas: ${this.vueltas}</label>
          <label id="${this.name}tiempo">Tiempo: ${this.tiempoActual}</label>
          <label id="${this.name}fastest">Vuelta más Rápida: ${this.fastestTime}</label>
        </div>
        <div class="player-ui-bot">
          <img
            class="player-item"
            src="../../assets/images/modosJuego/circuito.png"
            alt=""
          />
        </div>
      </div>
    `);
  }

  UpdateUIPlayer() {
    $(`#${this.name}vueltas`).text(`Vueltas: ${this.vueltas}`);
    $(`#${this.name}tiempo`).text(`Tiempo: ${this.tiempoActual}`);
    $(`#${this.name}fastest`).text(`Vuelta más Rápida: ${this.fastestTime}`);
  }
}
