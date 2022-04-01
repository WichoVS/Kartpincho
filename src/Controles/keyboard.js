export class KBInputs {
  keys = [];
  constructor() {
    this.initKeys();
  }

  initKeys() {
    //W
    let key = {
      code: 87,
      pressed: false,
    };
    this.keys.push(key);
    //S
    key = {
      code: 83,
      pressed: false,
    };
    this.keys.push(key);
    //A
    key = {
      code: 65,
      pressed: false,
    };
    this.keys.push(key);
    //D
    key = {
      code: 68,
      pressed: false,
    };
    this.keys.push(key);
  }

  setKey(index, valor) {
    this.keys[index].pressed = valor;
  }
}
