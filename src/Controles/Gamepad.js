class GamepadState {
  constructor(index) {
    this.index = index;
    this.btnA = false;
    this.btnB = false;
    this.btnX = false;
    this.btnY = false;
    this.btnLB = false;
    this.btnRB = false;
    this.dPadUp = false;
    this.dPadDown = false;
    this.dPadLeft = false;
    this.dPadRight = false;
    this.btnSelect = false;
    this.btnStart = false;
  }

  GetIndex() {
    return this.index;
  }
  GetBtnA() {
    return this.btnA;
  }
  GetBtnB() {
    return this.btnB;
  }
  GetBtnX() {
    return this.btnX;
  }
  GetBtnY() {
    return this.btnY;
  }
  GetBtnLB() {
    return this.btnLB;
  }
  GetBtnRB() {
    return this.btnRB;
  }
  GetDPadUp() {
    return this.dPadUp;
  }
  GetDPadDown() {
    return this.dPadDown;
  }
  GetDPadLeft() {
    return this.dPadLeft;
  }
  GetDPadRight() {
    return this.dPadRight;
  }
  GetBtnSelect() {
    return this.btnSelect;
  }
  GetBtnStart() {
    return this.btnStart;
  }
  SetBtnA(state) {
    this.btnA = state;
  }
  SetBtnB(state) {
    this.btnB = state;
  }
  SetBtnX(state) {
    this.btnX = state;
  }
  SetBtnY(state) {
    this.btnY = state;
  }
  SetBtnLB(state) {
    this.btnLB = state;
  }
  SetBtnRB(state) {
    this.btnRB = state;
  }
  SetDPadUp(state) {
    this.dPadUp = state;
  }
  SetDPadDown(state) {
    this.dPadDown = state;
  }
  SetDPadLeft(state) {
    this.dPadLeft = state;
  }
  SetDPadRight(state) {
    this.dPadRight = state;
  }
  SetBtnSelect(state) {
    this.btnSelect = state;
  }
  SetBtnStart(state) {
    this.btnStart = state;
  }
}
