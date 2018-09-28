export default class Land {

  landCanvas;
  landContext;
  landWidth;
  landHeight;
  landWidthUnitPixels;
  landHeightUnitPixels;
  land = [];
  landTerritory = [];
  maxFoodLand;
  personRadius;
  maxFoodLand;
  landFoodPerTick;

  constructor(config) {
    this.landWidth = config.landWidth;
    this.landHeight = config.landHeight;
    this.landWidthUnitPixels = config.landWidthUnitPixels;
    this.landHeightUnitPixels = config.landHeightUnitPixels;
    this.land = config.land;
    this.personRadius = config.personRadius;
    this.maxFoodLand = config.maxFoodLand;
    this.landFoodPerTick = config.landFoodPerTick;

    for (let x = 0; x <= this.landWidth; x++) {
      this.land[x] = [];
      this.landTerritory[x] = [];
      for (let y = 0; y <= this.landHeight; y++) {
        this.land[x][y] = this.maxFoodLand;
        this.landTerritory[x][y] = 0.5;
      }
    }
  }

  setCanvas(canvas) {
    this.landCanvas = canvas;
    this.landContext = this.landCanvas.getContext('2d');
  }

  getLandWidth() {
    return this.landWidth;
  }

  getLandHeight() {
    return this.landHeight;
  }

  getLandWidthUnitPixels() {
    return this.landWidthUnitPixels;
  }

  getLandHeightUnitPixels() {
    return this.landHeightUnitPixels;
  }

  getCellFood(x, y) {
    return (this.land[x] && this.land[x][y]) ? this.land[x][y] : 0;
  }

  getPersonRadius() {
    return this.personRadius;
  }

  removeFoodFromCell(x, y, quantity) {
    if (this.land[x] && this.land[x][y]) {
      this.land[x][y] -= quantity;
    }
  }

  growFood() {
    for (let y = 0; y < this.landHeight; y++) {
      for (let x = 0; x < this.landWidth; x++) {
        this.land[x][y] += this.landFoodPerTick;
        if (this.land[x][y] > this.maxFoodLand) this.land[x][y] = this.maxFoodLand;
      }
    }
  }

  setTerritory(x, y, teritoryValue) {
    this.landTerritory[x][y] = teritoryValue;
  }

  drawLand(people, showPersonDetails, showChild, pubertyAge, localIndex,
    selectedLandX, selectedLandY, landType
  ) {
    this.landContext.fillStyle = 'rgb(200, 200, 0)';
    this.landContext.fillRect(
      0,
      0,
      this.landWidth * this.landWidthUnitPixels,
      this.landHeight * this.landHeightUnitPixels
    );
    for (let y = 0; y < this.landHeight; y++) {
      for (let x = 0; x < this.landWidth; x++) {
        const startX = x * this.landWidthUnitPixels + 1;
        const endX = this.landWidthUnitPixels - 1;
        const startY = y * this.landHeightUnitPixels + 1;
        const endY = this.landHeightUnitPixels - 1;
        let red = 0;
        let green = 0;
        let blue = 0;
        if (landType === 'food') {
          green = Math.floor(this.land[x][y] / this.maxFoodLand * 255);
          if (green > 255) green  = 255;
        } else if (landType === 'territory') {
          red = Math.floor(this.landTerritory[x][y] * 255);
        }
        this.landContext.fillStyle =  `rgb(${red}, ${green}, ${blue})`;
        this.landContext.fillRect(startX, startY, endX, endY);

        if (x === selectedLandX && y === selectedLandY) {
          this.landContext.fillStyle =  `rgb(150, ${green}, 150)`;
          this.landContext.fillRect(startX, startY, endX, endY);
        }
      }
    }

    people.forEach((person) => {
      const x = Math.floor(person.position.x * this.landWidthUnitPixels);
      const y = Math.floor(person.position.y * this.landHeightUnitPixels);

      this.landContext.beginPath();
      // this.landContext.strokeStyle = 'rgb(0, 0, 155)';
      this.landContext.fillStyle = 'rgb(100, 100, 255)';
      if (person.mate && person.mate.id === showPersonDetails.id) {
        this.landContext.fillStyle = 'rgb(170, 0, 255)';
      }
      if (person.age < pubertyAge) {
        this.landContext.fillStyle = 'rgb(170, 170, 255)';
      }
      if (showPersonDetails.id === person.id) {
        this.landContext.fillStyle = 'rgb(255, 100, 0)';
      }
      if (showChild.id === person.id) {
        this.landContext.fillStyle = 'rgb(255, 255, 0)';
      }
      if (selectedLandX !== null
        && selectedLandY !== null
        && localIndex[selectedLandX][selectedLandY].includes(person.id)
      ) {
        this.landContext.fillStyle = 'rgb(255, 255, 255)';
      }
      this.landContext.arc(x, y, this.personRadius, 0, 2 * Math.PI, false);
      this.landContext.fill();
      this.landContext.closePath();
    });
  }

  landClicked(people, openDetails, setLandSelected, event) {
    const rect = this.landCanvas.getBoundingClientRect();
    const clickX = Math.floor(event.clientX - rect.left);
    const clickY = Math.floor(event.clientY - rect.top);
    let foundPerson = false;
    people.forEach((person) => {
      const personX = person.position.x * this.landWidthUnitPixels;
      const personY = person.position.y * this.landHeightUnitPixels;

      // quick check to see if in the person rectangle.
      if (clickX > personX - this.personRadius
        && clickX < personX + this.personRadius
        && clickY > personY - this.personRadius
        && clickY < personY + this.personRadius
      ) {
        // Now a more detailed check to make sure it is inside the circle.
        this.landContext.beginPath();
        this.landContext.fillStyle = 'rgb(0, 0, 155)';
        this.landContext.arc(personX, personY, this.personRadius, 0, 2 * Math.PI, false);
        this.landContext.fill();
        const inPerson = this.landContext.isPointInPath(clickX, clickY);
        this.landContext.closePath();
        if (inPerson) {
          foundPerson = true;
          openDetails(person);
        }
      }
    });
    if (!foundPerson) {
      setLandSelected(
        Math.floor(clickX / this.landWidthUnitPixels),
        Math.floor(clickY / this.landHeightUnitPixels),
      );
    }
  }

};
