class Terreno {
  body;
  mesh;
  isLoaded = false;
  gMaterial;
  constructor(_pathMesh, _pathTexture, _v3_shape, _name, _gMaterial) {
    this.CargaModelo(_pathMesh, _pathTexture, _v3_shape, _name);
    this.gMaterial = _gMaterial;
  }

  CargaModelo(_pathMesh, _pathTexture, _v3_shape, _name) {
    var mLoader = new THREE.FBXLoader();
    var tLoader = new THREE.TextureLoader();

    mLoader.load(
      _pathMesh,
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
            this.isLoaded = true;

            var q = this.mesh.quaternion;
            this.body = new CANNON.Body({
              type: CANNON.Body.STATIC,
              material: this.gMaterial,
              shape: new CANNON.Box(_v3_shape),
              quaternion: new CANNON.Quaternion(q._x, q._y, q._z, q._w),
            });
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
