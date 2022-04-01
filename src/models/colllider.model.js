class Collider {
  body;
  constructor(position, _v3_shape, world) {
    this.body = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Box(_v3_shape),
    });
    this.body.position = position;
    world.add(this.body);
  }

  Rota(_axis, _angle) {
    //var axis = new CANNON.Vec3(1, 0, 0);
    //var angle = 1.74533; //1 * (Math.PI / 6);
    //body.quaternion.setFromAxisAngle(axis, angle);
    this.body.quaternion.setFromAxisAngle(_axis, _angle);
  }
}
