class Mole {
  isListed = false;
  mesh;
  body;
  isLoaded = false;
  worldReady = false;
  constructor(_pathMesh, _pathTexture, _v3_shape, _name, _side, _x=0,_y=0,_z=0,_xs=1,_ys=1,_zs=1) {
    this.CargaModelo(_pathMesh, _pathTexture, _v3_shape, _name, _side, _x,_y,_z,_xs,_ys,_zs);
  }

  CargaModelo(_pathMesh, _pathTexture, _v3_shape, _name, _side, _x,_y,_z,_xs,_ys,_zs) {
    var mLoader = new THREE.FBXLoader();
    var tLoader = new THREE.TextureLoader();

    mLoader.load(
      _pathMesh,
      (fbx) => {
        let color = tLoader.load(_pathTexture);

        let texture = new THREE.MeshStandardMaterial({
          map: color,
          side: _side,
        });

        fbx.traverse((child) => {
          if (child.isMesh) {
            child.material = texture;
            this.mesh = child;
            this.mesh.name = _name;
            this.mesh.translateX(_x);
            this.mesh.translateY(_y);
            this.mesh.translateZ(_z);
            this.mesh.scale.set(_xs, _ys, _zs);
            this.isLoaded = true;

            if (_v3_shape !== undefined && _v3_shape !== null) {
              this.body = new CANNON.Body({
                type: CANNON.Body.STATIC,
                shape: new CANNON.Box(_v3_shape),
              });
            } 
          }
        });
      },
      undefined,
      (error) => {
        console.log(error);
      }
    );
  }


  UpdateMole() {
    if(this.mesh != undefined && this.body != undefined) {
      this.mesh.position.copy(this.body.position)
      this.mesh.quaternion.copy(this.body.quaternion)
    }
  }
}
