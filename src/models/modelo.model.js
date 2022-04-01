class Modelo {
  mesh;
  body;
  isLoaded = false;
  constructor(_pathMesh, _pathTexture, _v3_shape, _name, _side) {
    this.CargaModelo(_pathMesh, _pathTexture, _v3_shape, _name, _side);
  }

  CargaModelo(_pathMesh, _pathTexture, _v3_shape, _name, _side) {
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
            this.mesh.translateX(0);
            this.mesh.translateY(0);
            this.mesh.translateZ(0);
            this.mesh.scale.set(1, 1, 1);
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
}
