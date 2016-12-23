

export default class MapRenderer {

  canvas = null;
  context = null;
  clockSpeed = null;
  itteration = 0;
  width = 0;
  height = 0;

  constructor(canvasId, clockSpeed) {
    this.clockSpeed = clockSpeed;
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.tickTock();
  }

  tickTock() {
    setTimeout(() => {
      this.render();

      this.itteration++;
      this.tickTock();
    }, this.clockSpeed);
  }

  render() {
    this.context.fillStyle = `rgb(255, 555, 255)`;
    this.context.fillRect(0, 0, this.width, this.height);
  }
}
