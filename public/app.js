function play(pjs) {

  var halfScreenWidth;
  var threeQuarterScreenHeight;

  var startingCircle = null;
  var startingUpArrow = null;
  var startingSquare = null;

  var stdCircleDiameter;
  var stdCircleRadius;

  var stdSquareWidth;
  var stdSquareHeight;
  var stdSquareWidth;

  var stdTriangleSideLength;

  var colorless = pjs.color(226,221,217);

  var red = pjs.color(240,96,96);
  var blue = pjs.color(14,131,205);
  var yellow = pjs.color(252,208,75);
  var green = pjs.color(42,197,108);
  var purple = pjs.color(158,84,189);
  var orange = pjs.color(243,134,48);
  var grey = pjs.color(64,71,73);

  var activeTouchId = null;

  var lastStop = {};
  var touchCoordinates = {};

  var dragging = false;
  var completedProgram = false;

  var input = null;
  var output = null;

  var inputs;
  var inputsLen;

  var outputs = null;

  // ALL THE AVAILABLE ACTIONS
  var paintRed = null;
  var paintBlue = null;
  var paintYellow = null;
  var darkBorder = null;
  var lightBorder = null;
  var enlarge = null;
  var shrink = null;
  var lowerTransparency = null;
  var stretchVertical = null;
  var stretchHorizontal = null;
  var shiftLeft = null;
  var shiftRight = null;
  var shiftDown = null;
  var shiftUp = null;
  var overlayCircle = null;
  var overlaySquare = null;
  var overlayUpArrow = null;
  var overlayDownArrow = null;
  var overlayLeftArrow = null;
  var overlayRightArrow = null;
  var overlayDiamond = null;

  var actions = [];
  var actionsLen;

  var activeButton = null;
  var activeButtonStartTime = null;
  var activeButtonTriggered = false;

  var activeInput = null;

  var fontColor = pjs.color(50,50,50);

  var actionFont = pjs.createFont('Arial', 13);
  var endpointFont = pjs.createFont('Arial', 16);
  var tutorialFont = pjs.createFont('Arial', 32);

  var programLines = [];
  var program = [];

  var tutorialMode = true;
  var tutorialEnded = false;
  var tutorialStep = 1;

  function Line(x1,y1,x2,y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
  Line.prototype.isTouched = function(x, y) {

  }

  pjs.setup = function() {
    pjs.size(pjs.screenWidth, pjs.screenHeight);
    pjs.smooth();

    halfScreenWidth = pjs.screenWidth / 2;
    threeQuarterScreenHeight = pjs.screenHeight / 4 * 3;

    var inputHeight = pjs.screenWidth / 12;

    stdCircleDiameter = pjs.screenWidth / 18;
    stdCircleRadius = stdCircleDiameter / 2;

    startingCircle = new Circle(pjs.screenWidth/60 + stdCircleRadius, 
      pjs.screenWidth/60 + inputHeight / 2);

    stdSquareWidth = pjs.screenWidth / 18;
    stdSquareHeight = stdSquareWidth;
    halfStdSquareWidth = stdSquareWidth / 2;

    startingSquare = new Square(pjs.screenWidth/60, 
      inputHeight + pjs.screenWidth/30,
      stdSquareWidth, stdSquareHeight);

    stdDiamondSideLength = pjs.screenWidth / 22;
    stdDiamondYDiff = stdDiamondSideLength * Math.sin(Math.PI/4);
    stdDiamondXDiff = stdDiamondYDiff;

    var centeredDiamond = 2 * stdDiamondYDiff - stdSquareHeight;

    startingDiamond = new Diamond(pjs.screenWidth/30 + stdSquareWidth + stdDiamondXDiff,
      pjs.screenWidth / 30 + inputHeight - centeredDiamond / 2,
      stdDiamondXDiff, stdDiamondYDiff);

    stdTriangleSideLength = pjs.screenWidth / 18;
    stdTriangleHeight = stdTriangleSideLength * Math.sin(Math.PI/3);

    startingUpArrow = new Arrow(pjs.screenWidth/ 60,
      inputHeight + pjs.screenWidth / 20 + stdTriangleHeight + 2 * stdDiamondYDiff,
      stdTriangleSideLength, stdTriangleHeight, "up");

    var downLength = stdTriangleSideLength;
    var diamondLength = stdDiamondXDiff * 2;
    var centeredDown = diamondLength - downLength;

    startingDownArrow = new Arrow(pjs.screenWidth / 30 + stdTriangleSideLength + centeredDown / 2,
      inputHeight + pjs.screenWidth / 20 + 2 * stdDiamondYDiff ,
      stdTriangleSideLength, stdTriangleHeight, "down");

    startingLeftArrow = new Arrow(pjs.screenWidth / 60,
      inputHeight + pjs.screenWidth / 15 + stdTriangleHeight + 2 *
      stdDiamondYDiff + stdTriangleSideLength / 2,
      stdTriangleSideLength, stdTriangleHeight, "left");

    var rightLength = stdTriangleHeight;
    var centeredRight = diamondLength - rightLength

    startingRightArrow = new Arrow(pjs.screenWidth / 30 + stdTriangleSideLength * 2 + centeredRight / 2,
      inputHeight + pjs.screenWidth / 15 + stdTriangleHeight + 2 *
      stdDiamondYDiff + stdTriangleSideLength / 2,
      stdTriangleSideLength, stdTriangleHeight, "right");

    inputs = []

    inputs.push(startingCircle);

    inputsLen = inputs.length;

    input = new EndPoint(pjs.screenWidth/ 60 + pjs.screenWidth / 12, "(input)", pjs.screenWidth / 12);
    output = new EndPoint(pjs.screenWidth / 6 * 5 - pjs.screenWidth/60, "(output)", pjs.screenWidth / 6);

    var yRoom = pjs.screenHeight;
    var xRoom = pjs.screenWidth / 3 * 2;

    var firstRowY = yRoom / 7;
    var secondRowY = firstRowY + firstRowY;
    var thirdRowY = secondRowY + firstRowY;
    var fourthRowY = thirdRowY + firstRowY;
    var fifthRowY = fourthRowY + firstRowY;
    var sixthRowY = fifthRowY + firstRowY;

    firstRowY -= pjs.screenWidth / 64;
    secondRowY -= pjs.screenWidth / 64;
    thirdRowY -= pjs.screenWidth / 64;
    fourthRowY -= pjs.screenWidth / 64;
    fifthRowY -= pjs.screenWidth / 64;
    sixthRowY -= pjs.screenWidth / 64;

    var fourRowX = xRoom / 5;
    var sixthWidth = pjs.screenWidth / 6;
    var extraDistanceOnThreeRow = (xRoom - (2*fourRowX+360)) / 2;

    var threeOneX = sixthWidth + extraDistanceOnThreeRow + 120;
    var threeTwoX = sixthWidth + extraDistanceOnThreeRow + fourRowX + 120;
    var threeThreeX = sixthWidth + extraDistanceOnThreeRow + fourRowX * 2 + 120;


    var fourOneX = sixthWidth + fourRowX - 60;
    var fourTwoX = sixthWidth + fourRowX * 2 - 60;
    var fourThreeX = sixthWidth + fourRowX * 3 - 60;
    var fourFourX = sixthWidth + fourRowX * 4 - 60;

    paintRed = new Action(threeOneX, firstRowY, "paintRed");
    paintBlue = new Action(threeTwoX, firstRowY, "paintBlue");
    paintYellow = new Action(threeThreeX, firstRowY, "paintYellow");

    addLightBorder = new Action(fourOneX,secondRowY, "addLightBorder");
    addDarkBorder = new Action(fourTwoX,secondRowY, "addDarkBorder");
    enlarge = new Action(fourThreeX, secondRowY, "enlarge");
    shrink = new Action(fourFourX, secondRowY, "shrink");
    
    overlayCircle = new Action(threeOneX, fifthRowY, "overlayCircle");
    overlaySquare = new Action(threeTwoX, fifthRowY, "overlaySquare");
    overlayDiamond = new Action(threeThreeX, fifthRowY, "overlayDiamond");

    overlayUpArrow = new Action(fourOneX, sixthRowY, "overlayUpArrow");
    overlayDownArrow = new Action(fourTwoX, sixthRowY, "overlayDownArrow");
    overlayLeftArrow = new Action(fourThreeX, sixthRowY, "overlayLeftArrow");
    overlayRightArrow = new Action(fourFourX, sixthRowY, "overlayRightArrow");

    shiftUp = new Action(fourOneX, fourthRowY, "shiftUp");
    shiftDown = new Action(fourTwoX, fourthRowY, "shiftDown");
    shiftLeft = new Action(fourThreeX, fourthRowY, "shiftLeft");
    shiftRight = new Action(fourFourX, fourthRowY, "shiftRight");

    lowerTransparency = new Action(threeOneX, thirdRowY, "lowerTransparency");
    stretchVertical = new Action(threeTwoX, thirdRowY, "stretchVertical");
    stretchHorizontal = new Action(threeThreeX, thirdRowY, "stretchHorizontal");

    actions.push(paintBlue);

    actionsLen = actions.length;

  }

  pjs.draw = function() {

    if (!tutorialMode && !tutorialEnded) {

      inputs.push(startingSquare);
      inputs.push(startingCircle);
      inputs.push(startingDiamond);
      inputs.push(startingUpArrow);
      inputs.push(startingDownArrow);
      inputs.push(startingLeftArrow);
      inputs.push(startingRightArrow);

      inputsLen = inputs.length;

      actions.push(shiftUp);
      actions.push(shiftDown);
      actions.push(shiftLeft);
      actions.push(shiftRight);
      actions.push(paintRed);
      actions.push(paintYellow);
      actions.push(addLightBorder);
      actions.push(addDarkBorder);
      actions.push(enlarge);
      actions.push(shrink);
      actions.push(lowerTransparency);
      actions.push(stretchVertical);
      actions.push(stretchHorizontal);
      actions.push(overlayCircle);
      actions.push(overlayDiamond);
      actions.push(overlayUpArrow);
      actions.push(overlaySquare);
      actions.push(overlayDownArrow);
      actions.push(overlayLeftArrow);
      actions.push(overlayRightArrow);

      actionsLen = actions.length;

      tutorialEnded = true;
    }

    illustrateBackground();

    if (dragging && !completedProgram) {
      illustrateLine(lastStop.x, lastStop.y, touchCoordinates.x, touchCoordinates.y, 15);
      attemptActionTrigger();
    }

    var linesLen = programLines.length;
    for (var i=0; i<linesLen; i++) {
      illustrateLine(programLines[i].x1,programLines[i].y1,programLines[i].x2,programLines[i].y2, 10);
    }

    input.illustrate();
    output.illustrate();

    for (var i=0; i<actionsLen; i++) {
      actions[i].illustrate();
    }

    for (var i=0; i< inputsLen; i++) {
      inputs[i].illustrate();
    }

    if (outputs != null) {
      var outputsLen = outputs.length;
      for (var i=0; i<outputsLen; i++) {
        outputs[i].illustrate();
      }
    }

    if (activeInput != null) {
      pjs.fill(colorless);
      pjs.noStroke();
      switch (activeInput)
      {
      case startingCircle:
        drawCircle();
        break;
      case startingSquare:
        drawSquare();
        break;
      case startingUpArrow:
        drawUpArrow();
        break;
      case startingDiamond:
        drawDiamond();
        break;
      case startingDownArrow:
        drawDownArrow();
        break;
      case startingLeftArrow:
        drawLeftArrow();
        break;
      case startingRightArrow:
        drawRightArrow();
        break;
      default:
        break;
      }

    }

    if (tutorialMode) {
      console.log(tutorialStep);
      pjs.textAlign(pjs.CENTER, pjs.CENTER);
      pjs.textFont(tutorialFont);
      pjs.fill(fontColor);
      switch (tutorialStep) 
      {
      case (1):
        var message = "1) connect the input to the paintBlue function by dragging";
        break;
      case (2):
        var message = "2) now connect the paintBlue function to the output";
        break;
      case (3):
        var message = "3) finally drag the circle into the input area";
        break;
      case (4):
        var message = "4) start a new program by touching the input"
        break;
      default:
        break; 
      }
      pjs.text(message, halfScreenWidth, threeQuarterScreenHeight);
    }

    if (!dragging && activeInput == null) {
      pjs.noLoop();
    }

  };

  function drawCircle() {
    pjs.ellipse(touchCoordinates.x,touchCoordinates.y,stdCircleDiameter, stdCircleDiameter);
  }

  function drawSquare() {
    pjs.rect(touchCoordinates.x - halfStdSquareWidth, touchCoordinates.y - halfStdSquareWidth,
      stdSquareWidth, stdSquareWidth);
  }

  function drawUpArrow() {
    pjs.triangle(touchCoordinates.x, touchCoordinates.y - stdTriangleHeight / 2, 
      touchCoordinates.x - stdTriangleSideLength / 2, touchCoordinates.y + stdTriangleHeight / 2,
      touchCoordinates.x + stdTriangleSideLength / 2, touchCoordinates.y + stdTriangleHeight / 2);
  }

  function drawDownArrow() {
    pjs.triangle(touchCoordinates.x, touchCoordinates.y + stdTriangleHeight / 2,
      touchCoordinates.x - stdTriangleSideLength / 2, touchCoordinates.y - stdTriangleHeight / 2,
      touchCoordinates.x + stdTriangleSideLength / 2, touchCoordinates.y - stdTriangleHeight / 2);
  }

  function drawLeftArrow() {
    pjs.triangle(touchCoordinates.x - stdTriangleHeight / 2, touchCoordinates.y,
      touchCoordinates.x + stdTriangleHeight / 2, touchCoordinates.y - stdTriangleSideLength / 2,
      touchCoordinates.x + stdTriangleHeight / 2, touchCoordinates.y + stdTriangleSideLength / 2);
  }

  function drawRightArrow() {
    pjs.triangle(touchCoordinates.x + stdTriangleHeight / 2, touchCoordinates.y,
      touchCoordinates.x - stdTriangleHeight / 2, touchCoordinates.y - stdTriangleSideLength / 2,
      touchCoordinates.x - stdTriangleHeight / 2, touchCoordinates.y + stdTriangleSideLength / 2);

  }

  function drawDiamond() {
    pjs.quad(touchCoordinates.x, touchCoordinates.y - stdDiamondYDiff, 
      touchCoordinates.x - stdDiamondXDiff, touchCoordinates.y,
      touchCoordinates.x, touchCoordinates.y + stdDiamondYDiff,
      touchCoordinates.x + stdDiamondXDiff, touchCoordinates.y);
  }


  pjs.touchStart = function(e) {

    e.preventDefault();

    if (activeTouchId == null) {

      var currTouch = e.changedTouches[0];

      activeTouchId = currTouch.identifier;
      touchCoordinates.x = currTouch.clientX;
      touchCoordinates.y = currTouch.clientY;

      if (input.isTouched(currTouch.clientX, currTouch.clientY)) {
        lastStop.x = input.centerX;
        lastStop.y = input.centerY;
        programLines = [];
        program = [];
        var actionsLen = actions.length;
        for (var i=0; i<actionsLen; i++) {
          actions[i].activated = 0;
        }
        activeButton = null;
        activeButtonStartTime = null;
        activeButtonTriggered = false;
        dragging = true;
        completedProgram = false;
        outputs = null;
        if (tutorialMode && tutorialStep == 4) {
          tutorialMode = false;
        }
        pjs.loop();
        return;
      }

      var actionsLen = actions.length;
      for (var i=0; i<actionsLen; i++) {
        if (actions[i].isTouched(currTouch.clientX, currTouch.clientY)) {
          if (lastStop.x == actions[i].centerX && lastStop.y == actions[i].centerY) {
            dragging = true;
            pjs.loop();
            return;
          }  
        }
      }

      if (completedProgram) {
        for (var i=0; i<inputsLen; i++) {
          if (inputs[i].isTouched(currTouch.clientX, currTouch.clientY)) {
            activeInput = inputs[i];
            pjs.loop();
            return;
          }
        }
      }

    }

  };

  pjs.touchMove = function(e) {

    e.preventDefault();

    var currTouch = e.changedTouches[0];
    if (currTouch.identifier == activeTouchId) {

      touchCoordinates.x = currTouch.clientX;
      touchCoordinates.y = currTouch.clientY;

      if (!completedProgram) {

        if (output.isTouched(currTouch.clientX, currTouch.clientY)) {
          if (activeButton != output) {
            activeButton = output;
            activeButtonStartTime = pjs.millis();
            activeButtonTriggered = false;
          }
          return;
        }

        var actionLen = actions.length;
        for (var i = 0; i < actionLen; i++) {
          if (actions[i].isTouched(currTouch.clientX, currTouch.clientY)) {
            if (activeButton != actions[i]) {
              activeButton = actions[i];
              activeButtonStartTime = pjs.millis();
              activeButtonTriggered = false;
            }
            return;
          }
        }
        activeButton = null;
        activeButtonStartTime = null;
        activeButtonTriggered = false;
      }
    }

  };

  pjs.touchEnd = function(e) {

    e.preventDefault();

    var touchLen = e.changedTouches.length;
    for (var i=0; i<touchLen; i++) {
      var currTouch = e.changedTouches[i];
      if (currTouch.identifier == activeTouchId) {

        if (activeInput != null) {
          inputShape(activeInput);
        }

        if (activeButton != null) {
          if (!activeButtonTriggered) {
            if (activeButton.isTouched(touchCoordinates.x, touchCoordinates.y)) {
              newestLine = new Line(lastStop.x, lastStop.y, 
                activeButton.centerX, activeButton.centerY);
              programLines.push(newestLine);
              lastStop.x = activeButton.centerX;
              lastStop.y = activeButton.centerY;
              parseActiveButton(activeButton);
              activeButton.activated++;
              if (tutorialMode && tutorialStep == 1) {
                tutorialStep = 2;
              }
            }
          }
        }

        activeButton = null;
        activeButtonStartTime = null;
        activeButtonTriggered = false;
        activeTouchId = null;
        activeInput = null;
        dragging = false;
        return;
      }
    }

  };

  function inputShape(shape) {
    if (touchCoordinates.x >= input.x && touchCoordinates.x <= input.x + input.width) {
      if (touchCoordinates.y >= input.y && touchCoordinates.y <= input.y + input.height) {
        executeProgram(shape, 0, []);
        if (tutorialMode) {
          tutorialStep = 4;
        }
      }
    }
  }

  function executeProgram(shape, pc, results) {
    var color = colorless;
    var progLen = program.length;
    var border = null;
    var alpha = 255;
    var overlayPC = -1;
    var x = 0;
    var y = 0;
    var width;
    var height;
    switch (shape) 
    {
    case startingCircle:
      width = stdCircleDiameter;
      height = stdCircleDiameter;
      break;
    case startingDiamond:
      width = stdDiamondXDiff;
      height = stdDiamondYDiff;
      break;
    case startingUpArrow:
    case startingDownArrow:
    case startingLeftArrow:
    case startingRightArrow:
      width = stdTriangleSideLength;
      height = stdTriangleHeight;
      break;
    case (startingSquare):
      width = stdSquareWidth;
      height = stdSquareHeight;
      break;
    default:
      break;
    }

    for (var i=pc; i<progLen; i++) {
      switch (program[i])
      {
      case "paintRed":
        if (color == colorless || color == red) {
          //color = pjs.color(pjs.red(red), pjs.green(red), pjs.blue(red), alpha);
          color = red;
        }
        else if (color == blue) {
          //color = pjs.color(pjs.red(purple), pjs.green(purple), pjs.blue(purple), alpha);
          color = purple;
        }
        else if (color == yellow) {
          //color = pjs.color(pjs.red(orange), pjs.green(orange), pjs.blue(orange), alpha);
          color = orange;
        }
        else if (color == green || color == grey) {
          //color = pjs.color(pjs.red(grey), pjs.green(grey), pjs.blue(grey), alpha);
          color = grey;
        }
        break;
      case "paintBlue":
        if (color == colorless || color == blue) {
          //color = pjs.color(pjs.red(blue), pjs.green(blue), pjs.blue(blue), alpha);
          color = blue;
        }
        else if (color == red) {
          //color = pjs.color(pjs.red(purple), pjs.green(purple), pjs.blue(purple), alpha);
          color = purple;
        }
        else if (color == yellow) {
          //color = pjs.color(pjs.red(green), pjs.green(green), pjs.blue(green), alpha);
          color = green;
        }
        else if (color == orange || color == grey) {
          //color = pjs.color(pjs.red(grey), pjs.green(grey), pjs.blue(grey), alpha);
          color = grey;
        }
        break;
      case "paintYellow":
        if (color == colorless || color == yellow) {
          //color = pjs.color(pjs.red(yellow), pjs.green(yellow), pjs.blue(yellow), alpha);
          color = yellow;
        }
        else if (color == red) {
          //color = pjs.color(pjs.red(orange), pjs.green(orange), pjs.blue(orange), alpha);
          color = orange;
        }
        else if (color == blue) {
          //color = pjs.color(pjs.red(green), pjs.green(green), pjs.blue(green), alpha);
          color = green;
        }
        else if (color == purple || color == grey) {
          //color = pjs.color(pjs.red(grey), pjs.green(grey), pjs.blue(grey), alpha);
          color = grey;
        }
        break;
      case "enlarge":
        width *= 1.5;
        height *= 1.5;
        break;
      case "shrink":
        width *= .5;
        height *= .5;
        break;
      case "stretchHorizontal":
        width *= 1.5;
        break;
      case "stretchVertical":
        height *= 1.5;
        break;
      case "addLightBorder":
        border = pjs.color(236,236,236, alpha);
        break;
      case "addDarkBorder":
        border = pjs.color(38,37,37,alpha);
        break;
      case "lowerTransparency":
        alpha = .75 * alpha;
        break;
      case "shiftUp":
        y -= .5 * pjs.screenWidth / 18;
        break;
      case "shiftDown":
        y += .5 * pjs.screenWidth / 18;
        break;
      case "shiftLeft":
        x -= .5 * pjs.screenWidth / 18;
        break;
      case "shiftRight":
        x += .5 * pjs.screenWidth / 18;
        break;
      default:
        break;
      }
      if (program[i] == "overlaySquare" ||
        program[i] == "overlayCircle" ||
        program[i] == "overlayDiamond" ||
        program[i] == "overlayLeftArrow" ||
        program[i] == "overlayRightArrow" ||
        program[i] == "overlayDownArrow" ||
        program[i] == "overlayUpArrow")
      {
        overlayPC = i;
        break;
      }
    }
    var currResult;
    switch (shape)
    {
    case startingCircle:
      currResult = new Result("circle", color, alpha, width, height, border, x, y);
      break;
    case startingDiamond:
      currResult = new Result("diamond", color, alpha, width, height, border, x, y);
      break;
    case startingSquare:
      currResult = new Result("square", color, alpha, width, height, border, x, y);
      break;
    case startingUpArrow:
      currResult = new Result("uparrow", color, alpha, width, height, border, x ,y);
      break;
    case startingDownArrow:
      currResult = new Result("downarrow", color, alpha, width, height, border, x, y);
      break;
    case startingLeftArrow:
      currResult = new Result("leftarrow", color, alpha, width, height, border, x, y);
      break;
    case startingRightArrow:
      currResult = new Result("rightarrow", color, alpha, width, height, border, x, y);
      break;
    default:
      break;
    }
    results.push(currResult);
    if (overlayPC != -1) {
      switch (program[overlayPC])
      {
        case "overlayCircle":
          executeProgram(startingCircle, overlayPC + 1, results);
          break;
        case "overlayDiamond":
          executeProgram(startingDiamond, overlayPC + 1, results);
          break;
        case "overlaySquare":
          executeProgram(startingSquare, overlayPC + 1, results);
          break;
        case "overlayUpArrow":
          executeProgram(startingUpArrow, overlayPC + 1, results);
          break;
        case "overlayDownArrow":
          executeProgram(startingDownArrow, overlayPC + 1, results);
          break;
        case "overlayLeftArrow":
          executeProgram(startingLeftArrow, overlayPC + 1, results);
          break;
        case "overlayRightArrow":
          executeProgram(startingRightArrow, overlayPC + 1, results);
          break;
        default:
          break;
      }
    }
    else {
      outputs = results;
    }
  }

  function Result(shape, color, alpha, width, height, border, x, y) {
    this.shape = shape;
    if (alpha < 255) {
      this.color = pjs.color(pjs.red(color), pjs.green(color), pjs.blue(color), alpha);
    }
    else {
      this.color = color;
    }
    this.x = output.centerX + x;
    this.y = output.centerY + y;
    this.width = width;
    this.height = height;
    this.border = border;
  }

  Result.prototype.illustrate = function() {
    pjs.fill(this.color);
    if (this.border != null) {
      pjs.strokeWeight(3);
      pjs.stroke(this.border);
    }
    else {
      pjs.noStroke();
    }
    switch (this.shape) 
    {
    case "circle":
      pjs.ellipse(this.x, this.y, this.width, this.height);
      break;
    case "diamond":
      pjs.quad(this.x, this.y - this.height, this.x + this.width, this.y, 
        this.x, this.y + this.height, this.x - this.width, this.y);
      break;
    case "square":
      pjs.rect(this.x - this.width / 2, this. y - this.height / 2, this.width, this.height);
      break;
    case "uparrow":
      pjs.triangle(this.x - this.width / 2, this.y + this.height / 2,
        this.x, this.y - this.height / 2,
        this.x + this.width / 2, this.y + this.height / 2);
      break;
    case "downarrow":
      pjs.triangle(this.x - this.width / 2, this.y - this.height / 2,
        this.x, this.y + this.height / 2,
        this.x + this.width / 2, this.y - this.height / 2);
      break;
    case "leftarrow":
      pjs.triangle(this.x - this.height / 2, this.y,
        this.x + this.height / 2, this.y - this.width / 2,
        this.x + this.height / 2, this.y + this.width / 2);
      break;
    case "rightarrow":
      pjs.triangle(this.x + this.height / 2, this.y,
        this.x - this.height / 2, this.y - this.width / 2,
        this.x - this.height / 2, this.y + this.width / 2);
      break;
    default:
      break; 
    }
  };


  function illustrateBackground() {
    pjs.background(216,200,184);
    pjs.fill(pjs.color(168,163,157));
    pjs.noStroke();
    pjs.rect(0,0,pjs.screenWidth/6,pjs.screenHeight);
    pjs.rect(pjs.screenWidth/6*5,0,pjs.screenWidth/6,pjs.screenHeight);
  }

  function attemptActionTrigger() {
    if (activeButton != null && !activeButtonTriggered) {
      if (pjs.millis() - activeButtonStartTime > 300) {
        activeButtonTriggered = true;
        newestLine = new Line(lastStop.x, lastStop.y, activeButton.centerX, activeButton.centerY);
        programLines.push(newestLine);
        lastStop.x = activeButton.centerX;
        lastStop.y = activeButton.centerY;
        activeButton.activated++;
        parseActiveButton(activeButton);
        if (tutorialMode && tutorialStep == 1) {
          tutorialStep = 2;
        }
      }
    }
  }

  function parseActiveButton(button) {
    if (button == output) {
      if (tutorialMode) {
        tutorialStep = 3;
      }
      pjs.loop();
      completedProgram = true;
      console.log(tutorialStep);
    }
    else {
      program.push(button.verb);
      console.log(program);
    }
  }

  function EndPoint(x, text, size) {
    this.x = x;
    this.y = pjs.screenWidth/60;
    this.width = size;
      this.height = this.width;
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.cornerRadius = 10;
    this.color = pjs.color(248,241,233);
    this.text = text;
  }
  EndPoint.prototype.illustrate = function() {
    pjs.fill(this.color);
    pjs.noStroke();
    pjs.rect(this.x, this.y, this.width, this.height, this.cornerRadius);
    pjs.fill(pjs.color(50,50,50));
    pjs.textAlign(pjs.CENTER, pjs.CENTER);
    pjs.textFont(endpointFont);
    pjs.text(this.text, this.centerX, this.centerY);
  };
  EndPoint.prototype.isTouched = function(x, y) {
    if (x >= this.x && x <= this.x + this.width) {
      if (y >= this.y && y <= this.y + this.height) {
        return true;
      }
    }
    return false;
  };

  function illustrateLine(x1,y1,x2,y2, weight) {
    pjs.strokeWeight(weight);
    pjs.stroke(100,100,100);
    pjs.line(x1,y1,x2,y2);
  }

  function Action(x, y, verb) {
    this.x = x;
    this.y = y;
    this.width = 120;
    this.height = pjs.screenWidth / 32;
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.cornerRadius = 10;
    this.verb = verb;
    this.activated = 0;
  }
  Action.prototype.illustrate = function() {
    if (this.activated > 0) {
      pjs.strokeWeight(this.activated * 2);
      pjs.stroke(pjs.color(213,232,166))
    }
    else {
      pjs.noStroke();
    }
    pjs.fill(pjs.color(50,50,50));
    pjs.rect(this.x,this.y,this.width,this.height,this.cornerRadius);
    pjs.fill(pjs.color(200,200,200));
    pjs.textAlign(pjs.CENTER, pjs.CENTER);
    pjs.textFont(actionFont);
    pjs.text(this.verb, this.centerX, this.centerY);
  }
  Action.prototype.isTouched = function(x, y) {
    if (x >= this.x && x <= this.x + this.width) {
      if (y >= this.y && y <= this.y + this.height) {
        return true;
      }
    }
    return false;
  }

  function Circle(x, y) {
    this.x = x;
    this.y = y;
    this.width = stdCircleDiameter;
    this.height = stdCircleDiameter;
    this.radius = this.width / 2;
  }
  Circle.prototype.illustrate = function() {
    pjs.noStroke();
    pjs.fill(colorless);
    pjs.ellipse(this.x, this.y, this.width, this.height);
  };
  Circle.prototype.isTouched = function(x, y) {
    if ( (x-this.x)*(x-this.x) + (y-this.y)*(y-this.y) < (this.radius)*(this.radius) ) {
      return true;
    }
    return false;
  };

  function Square(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  Square.prototype.illustrate = function() {
    pjs.noStroke();
    pjs.fill(colorless);
    pjs.rect(this.x, this.y, this.width, this.height);
  };
  Square.prototype.isTouched = function(x,y) {
    if (x >= this.x && x <= this.x + this.width) {
      if (y >= this.y && y <= this.y + this.height) {
        return true;
      }
    }
    return false;
  };

  function Arrow(x1,y1,size,height, direction) {
    if (direction == "up") {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = this.x1 + size;
      this.y2 = this.y1;
      this.x3 = this.x1 + size / 2;
      this.y3 = this.y1 - height;
    }
    else if (direction == "down") {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = this.x1 + size;
      this.y2 = this.y1;
      this.x3 = this.x1 + size /2; 
      this.y3 = this.y1 + height;
    }
    else if (direction == "left") {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = this.x1 + height;
      this.y2 = this.y1 - size / 2;
      this.x3 = this.x1 + height;
      this.y3 = this.y1 + size / 2; 
    }
    else {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = this.x1 - height;
      this.y2 = this.y1 - size / 2;
      this.x3 = this.x1 - height;
      this.y3 = this.y1 + size / 2;
    }
  }
  Arrow.prototype.illustrate = function() {
    pjs.noStroke();
    pjs.fill(colorless);
    pjs.triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
  };
  Arrow.prototype.isTouched = function(x, y) {
    return (insideTriangle(this.x1, this.y1, this.x2, this.y2,
      this.x3, this.y3, x, y));
  };

  function insideTriangle(x1, y1, x2, y2, x3, y3, x0, y0) {
    var alpha = ((y2 - y3) * (x0 - x3) + (x3 - x2) * (y0 - y3)) /
      ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));
    var beta = ((y3 - y1) * (x0 - x3) + (x1 - x3) * (y0 - y3)) /
      ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));
    var gamma = 1 - alpha - beta;
    if (alpha > 0 && beta > 0 && gamma > 0) {
      return true;
    }
    return false;
  }

  function Diamond(x1,y1, xDiff, yDiff) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = this.x1 + xDiff;
    this.y2 = this.y1 + yDiff;
    this.x3 = this.x1;
    this.y3 = this.y1 + 2 * yDiff;
    this.x4 = this.x1 - xDiff;
    this.y4 = this.y1 + yDiff;
  }
  Diamond.prototype.illustrate = function() {
    pjs.noStroke();
    pjs.fill(colorless);
    pjs.quad(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3,this.x4,this.y4);
  };
  Diamond.prototype.isTouched = function(x,y) {
    return insideTriangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, 
      x,y) || insideTriangle(this.x2, this.y2, this.x3, this.y3, this.x4, this.y4, x, y);
  };

}

var canvas = document.getElementById('app');
var processingInstance = new Processing(canvas, play);
