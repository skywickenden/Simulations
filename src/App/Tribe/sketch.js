export default function sketch (p) {
  let rotation = 0;

  const land = [
    [1, 1, 1, 1, 1,],
    [1, 1, 1, 1, 1,],
    [1, 1, 2, 1, 1,],
    [1, 1, 1, 1, 1,],
    [1, 1, 1, 1, 1,],
  ];

  p.setup = function () {
    // p.createCanvas(600, 400, p.WEBGL);
    p.createCanvas(710, 400, p.WEBGL);
    // p.ortho(-p.width / 2, p.width / 2, p.height / 2, -p.height / 2, 0, 500);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    if (props.rotation){
      rotation = props.rotation * Math.PI / 180;
    }
  };

  p.draw = function () {
    p.background(100);

    p.camera(-80, -100, 100, 100);
    p.directionalLight(200, 100, 100, 0.5, 1, -0.75);

    p.noStroke();

    const boxSize = 50;
    const xStart = -200;
    const zStart = 0;
    land.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        p.push();
        p.translate(
          xStart + (rowIndex * (boxSize + 5)),
          100,
          zStart + (columnIndex * (boxSize + 5))
        );
        p.rotateY(rotation);
        p.box(boxSize);
        p.pop();
      });
    });



    p.push();
    p.translate(-100, 40, 100);
    p.sphere(50);
    p.pop();
    //
    // p.push();
    // p.translate(-140, 100, -60);
    // p.rotateY(rotation);
    // p.box(50);
    // p.pop();
  };
};
