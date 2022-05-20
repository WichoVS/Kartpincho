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
  willActivateItem = false;
  checkpoints;
  gameMode;
  // Items y cosas
  item = "NONE";
  slowDownFactor = 1;
  slowDownTime = 0;
  isDrunk = false;
  drunkTime = 0;
  isStuned = false;
  stunTime = 0;
  shellsThrow = 0;
  shell;
  lives = 3;
  kills = 0;
  // En el render lo uso si está cargado lo agrego al mundo.
  isLoaded = false;
  // Si ya está agregado al mundo y quiero saber si está el jugador.
  // Esto para agregarlo a un array de los jugadores actuales e ir actualizando
  // Las físicas del mismo en la web.
  loaded = false;
  worldReady = false;
  cameraOffset = new THREE.Vector3(0, 3, -10);
  totalPlayers;
  vueltas = 0;
  placement = 1;
  tiempoActual;
  checkpTime;
  flagTrigger = false;
  fastestTime;
  startedRace;
  isKeyboardControl = false;
  controllerIndex = -1;
  imagen;
  manager;
  isGameOver = false;

  constructor(
    _pathModel,
    _pathTexture,
    _name,
    _wheelMaterial,
    _world,
    _mass,
    _totalPlayers,
    _origin,
    _imagen = "",
    _manager,
    _shell,
    _gameMode
  ) {
    this.gameMode = _gameMode;
    this.world = _world;
    this.manager = _manager;
    this.vueltas = 0;
    this.checkpoints = 0;
    this.tiempoActual = 0;
    this.checkpTime = 0;
    this.fastestTime = 0;
    this.totalPlayers = _totalPlayers;
    this.name = _name;
    this.engineForce = 1000;
    this.maxSteerVal = 0.1;
    this.camera = this.CrearCamara();
    this.camera.position.set(0, 2, -10);
    this.camera.lookAt(0, 0, 0);
    this.renderer = this.CrearRenderer();
    this.startedRace = false;
    this.imagen = _imagen;
    this.shell = _shell;
    this.mass = _mass;
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

  AddTimeVuelta(_manager) {
    if (!this.isGameOver) if (_manager.isGameStarted) this.tiempoActual++;
  }

  AddTimeCheckp(_manager) {
    if (!this.isGameOver) if (_manager.isGameStarted) this.checkpTime++;
  }

  AddVuelta(pTotalChecks) {
    if (!this.isGameOver) {
      if (this.startedRace) {
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
        this.startedRace = true;
      }
    }
  }

  TurnLeftOn(valueFactor = 1) {
    if (!this.isGameOver) {
      if (!this.isDrunk) {
        this.vehicle.setSteeringValue(this.maxSteerVal * valueFactor, 2);
        this.vehicle.setSteeringValue(this.maxSteerVal * valueFactor, 3);
      } else {
        this.vehicle.setSteeringValue(-this.maxSteerVal * valueFactor, 2);
        this.vehicle.setSteeringValue(-this.maxSteerVal * valueFactor, 3);
      }
    }
  }

  TurnLeftOff() {
    this.vehicle.setSteeringValue(0, 2);
    this.vehicle.setSteeringValue(0, 3);
  }

  TurnRightOn(valueFactor = 1) {
    if (!this.isGameOver) {
      if (!this.isDrunk) {
        this.vehicle.setSteeringValue(-this.maxSteerVal * valueFactor, 2);
        this.vehicle.setSteeringValue(-this.maxSteerVal * valueFactor, 3);
      } else {
        this.vehicle.setSteeringValue(this.maxSteerVal * valueFactor, 2);
        this.vehicle.setSteeringValue(this.maxSteerVal * valueFactor, 3);
      }
    }
  }

  ResetPosition() {
    console.log("entra");
    this.vehicle.chassisBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.PI / 2
    );
  }

  TurnRightOff() {
    this.vehicle.setSteeringValue(0, 2);
    this.vehicle.setSteeringValue(0, 3);
  }

  AccelerateOn(valueFactor = 1) {
    if (!this.isGameOver) {
      this.vehicle.applyEngineForce(
        -this.engineForce * valueFactor * this.slowDownFactor,
        2
      );
      this.vehicle.applyEngineForce(
        -this.engineForce * valueFactor * this.slowDownFactor,
        3
      );

      if (this.slowDownFactor < 1)
        this.engineForce = Math.max(this.engineForce, 250);
    }
  }

  AccelerateOff() {
    this.vehicle.applyEngineForce(0, 2);
    this.vehicle.applyEngineForce(0, 3);
  }

  BrakeOn(valueFactor = 1) {
    this.vehicle.setBrake(2 * valueFactor, 2);
    this.vehicle.setBrake(2 * valueFactor, 3);
  }

  BrakeOff() {
    this.vehicle.setBrake(0, 2);
    this.vehicle.setBrake(0, 3);
  }

  ReverseOn(valueFactor = 1) {
    if (!this.isGameOver) {
      this.vehicle.applyEngineForce(this.engineForce * valueFactor, 2);
      this.vehicle.applyEngineForce(this.engineForce * valueFactor, 3);
    }
  }

  ReverseOff() {
    this.vehicle.applyEngineForce(0, 2);
    this.vehicle.applyEngineForce(0, 3);
  }

  ActiveItem() {
    if (!this.isGameOver) {
      this.shell.body.force = new CANNON.Vec3(0, 0, 0);
      var localForward = new CANNON.Vec3(0, 0, 1);
      var worldvector = new CANNON.Vec3();
      var fVector = this.vehicle.chassisBody.vectorToWorldFrame(
        localForward,
        worldvector
      );
      var fx = Math.floor(fVector.x * 100) / 100;
      var fy = Math.floor(fVector.y * 100) / 100;
      var fz = Math.floor(fVector.z * 100) / 100;

      var minVel = Math.max(this.vehicle.currentVehicleSpeedKmHour * 15, 1);
      var force = 1000 + minVel;

      this.shellsThrow += 1;
      this.world.add(this.shell.body);
      this.manager.scene.add(this.shell.mesh);
      this.shell.body.position.x = this.mesh.position.x + fx * 2;
      this.shell.body.position.y = this.mesh.position.y + 1.5;
      this.shell.body.position.z = this.mesh.position.z + fz * 2;

      this.shell.body.force = new CANNON.Vec3(
        fx * force,
        fy * force,
        fz * force
      );

      this.shell.owner = this.name;

      this.shell.body.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        THREE.MathUtils.degToRad(270)
      );

      this.shell.body.angularVelocity.set(0, 10, 0);

      /*shell.body.addEventListener("collide", (e) => {
        if(e.body.userData != undefined) {
          let player = pManager.jugadores.find(
            (ele) => ele.name !== e.body.userData.name
          );
          
          if(player != undefined) {
            console.log(player)
            player.isStuned = true;
            player.stunTime = 180;
            this.world.delete(this.shell.body)
            this.manager.scene.delete(this.shell.mesh)
          }
        }
      });*/
    }
  }

  deleteShell() {
    var _shell = this.shell;
    var _world = this.world;
    setTimeout(function () {
      _world.removeBody(_shell.body);
      this.manager.scene.remove(_shell.mesh);
    }, 0);
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
        8;
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
    if (this.gameMode == "Circuito") {
      $(`#${this.name}`).append(`
      <div id="${this.name}UI" class="div-player-ui">
        <div class="player-ui-top">
          <label id="${this.name}vueltas">Vueltas: ${this.vueltas}</label>
          <label id="${this.name}tiempo">Tiempo: ${this.tiempoActual}</label>
          <label id="${this.name}fastest">Vuelta más Rápida: ${this.fastestTime}</label>
          <label id="${this.name}placement">Lugar </label>
        </div>
        <div class="player-ui-bot">
          <div class="row-states">
            <img
              id="${this.name}drunk"
              class="player-state"
              src="../../assets/images/items/DRUNK_ITEM.png"
            />
            <img
              id="${this.name}slowed"
              class="player-state"
              src="../../assets/images/items/SLOW_ITEM.png"
            />
            <img
              id="${this.name}stuned"
              class="player-state"
              src="../../assets/images/items/STUN_ITEM.png"
            />
          </div>
          <div class="row">
            <img
              id="${this.name}Item"
              class="player-item"
              src="../../assets/images/items/${this.item}.png"
            />
          </div>
        </div>
      </div>
    `);
    } else if (this.gameMode == "Eliminación") {
      $(`#${this.name}`).append(`
      <div class="div-player-ui">
        <div class="player-ui-top">
          <label id="${this.name}position">Lugar </label>
        </div>
        <div class="player-ui-bot">
          <div class="row-states">
            <img
              id="${this.name}drunk"
              class="player-state"
              src="../../assets/images/items/DRUNK_ITEM.png"
            />
            <img
              id="${this.name}slowed"
              class="player-state"
              src="../../assets/images/items/SLOW_ITEM.png"
            />
            <img
              id="${this.name}stuned"
              class="player-state"
              src="../../assets/images/items/STUN_ITEM.png"
            />
          </div>
          <div id="livesUI" class="row-lives">
            <img
              id="${this.name}lives1"
              class="player-state"
              src="../../assets/images/lives_icon.png"
              display="none"
            />
            <img
              id="${this.name}lives2"
              class="player-state"
              src="../../assets/images/lives_icon.png"
              display="none"
            />
            <img
              id="${this.name}lives3"
              class="player-state"
              src="../../assets/images/lives_icon.png"
              display="none"
            />
          </div>
          <div class="row">
            <img
              id="${this.name}Item"
              class="player-item"
              src="../../assets/images/items/${this.item}.png"
            />
          </div>
        </div>
      </div>
    `);
    }
  }

  UpdateUIPlayer() {
    if (!this.isGameOver) {
      //#region UI PLAYER & ITEM STATES
      $(`#${this.name}Item`).attr(
        "src",
        `../../assets/images/items/${this.item}.png`
      );
      if(this.mesh != undefined) $(`#${this.name}position`).text(`X: ${Math.round(this.mesh.position.x)} Y: ${Math.round(this.mesh.position.y)} Z: ${Math.round(this.mesh.position.z)} `);
      if (this.gameMode == "Circuito") {
        $(`#${this.name}vueltas`).text(`Vueltas: ${this.vueltas}`);
        $(`#${this.name}tiempo`).text(`Tiempo: ${this.tiempoActual}`);
        $(`#${this.name}fastest`).text(
          `Vuelta más Rápida: ${this.fastestTime}`
        );
        $(`#${this.name}placement`).text(`${this.placement}° Lugar`);
      } else if (this.gameMode == "Eliminación") {
        for (let i = 0; i < 3; i++) {
          $(`#${this.name}lives${i + 1}`).attr("display", "none");
        }

        for (let i = 0; i < this.lives; i++) {
          $(`#${this.name}lives${i + 1}`).attr("display", "block");
        }
      }

      if (this.slowDownTime > 0) {
        this.engineForce = Math.max(this.engineForce, 250);
        $(`#${this.name}slowed`).attr("display", "block");
        this.slowDownTime -= 1;
      } else {
        $(`#${this.name}slowed`).attr("display", "none");
        this.slowDownFactor = 1;
      }

      if (this.drunkTime > 0) {
        $(`#${this.name}drunk`).attr("display", "block");
        this.drunkTime -= 1;
      } else {
        $(`#${this.name}drunk`).attr("display", "none");
        this.isDrunk = false;
      }

      if (this.stunTime > 0) {
        $(`#${this.name}stuned`).attr("display", "block");
        this.vehicle.engineForce = 0;
        this.BrakeOn(500);
        this.stunTime -= 1;
      } else {
        $(`#${this.name}stuned`).attr("display", "none");
        this.isStuned = false;
        this.stunTime = 0;
        if (this.vehicle != undefined) this.BrakeOff();
      }
      //#endregion

      // Shell Mesh position
      if (this.shell.mesh != undefined && this.shell.body != undefined) {
        var adjustedPos = new CANNON.Vec3(
          this.shell.body.position.x + 1,
          this.shell.body.position.y,
          this.shell.body.position.z
        );
        this.shell.mesh.position.copy(adjustedPos);
        this.shell.mesh.quaternion.copy(this.shell.body.quaternion);
      }
    }
  }

  GameOver() {
    for (let i = 0; i < 3; i++) {
      $(`#${this.name}lives${i + 1}`).attr("display", "none");
    }
    $(`${this.name}UI`).attr("gameover", "true");
    this.isGameOver = true;
  }

  Hit() {
    if (this.gameMode == "Eliminación" && this.stunTime <= 90) {
      this.lives -= 1;

      if (this.lives == 0) {
        this.GameOver();
        return true;
      }
      return false;
    }
  }
}
