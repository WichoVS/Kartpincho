class SkyBox {
  materialArray = [];
  skyBoxGeo;
  skyBox;
  constructor(
    _texture_ft,
    _texture_bk,
    _texture_up,
    _texture_dn,
    _texture_rt,
    _texture_lf
  ) {
    let t_ft = new THREE.TextureLoader().load(_texture_ft);
    let t_bk = new THREE.TextureLoader().load(_texture_bk);
    let t_up = new THREE.TextureLoader().load(_texture_up);
    let t_dn = new THREE.TextureLoader().load(_texture_dn);
    let t_rt = new THREE.TextureLoader().load(_texture_rt);
    let t_lf = new THREE.TextureLoader().load(_texture_lf);

    this.materialArray.push(new THREE.MeshBasicMaterial({ map: t_ft }));
    this.materialArray.push(new THREE.MeshBasicMaterial({ map: t_bk }));
    this.materialArray.push(new THREE.MeshBasicMaterial({ map: t_up }));
    this.materialArray.push(new THREE.MeshBasicMaterial({ map: t_dn }));
    this.materialArray.push(new THREE.MeshBasicMaterial({ map: t_rt }));
    this.materialArray.push(new THREE.MeshBasicMaterial({ map: t_lf }));

    for (let i = 0; i < 6; i++) this.materialArray[i].side = THREE.BackSide;

    this.skyBoxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
    this.skyBox = new THREE.Mesh(this.skyBoxGeo, this.materialArray);
    this.skyBox.position.copy(new THREE.Vector3(0, -500, 0));
  }
}
