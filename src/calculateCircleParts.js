class CalculateCircleParts {
    constructor() {

    }

    calculateClosestDeg(mouseDeg, options) {
        // Takes the difference between max and min value and divides it with step - this gives the num of slices
        let circleDivisions = (options.maxVal - options.minVal) / options.step;
        // then 360 is divided with that number
        let angleDeg = 360 / circleDivisions;
        // rounds the angle to the nearest angle
        let numOfAngleDeg = Math.round(mouseDeg/angleDeg);
        let deg = angleDeg * numOfAngleDeg;

        let value = numOfAngleDeg * options.step + options.minVal;

        return {deg, value};
    }


    calculatePathLength(deg, options) {
        let circumference = 2 * Math.PI * options.radius;
        let angle = circumference * deg / 360;
        return angle + " " + circumference;
    }


    calculateMousePosition(e, svg) {
        //relative position of cursor calculated, circle radius is subtracted so that the measurement is from the center
        // e.clientX - position of the mouse on the screen
        
        let CTM = svg.getScreenCTM();
        let dragX = (e.clientX - CTM.e) / CTM.a;
        let dragY = (e.clientY - CTM.f) / CTM.d;
        let mPos = {x: dragX, y: dragY};

        //returns string that can be used to rotate the circle
        let atan = Math.atan2(mPos.x, mPos.y);
        let deg = -atan/(Math.PI/180) + 180;
        
        return deg;
    }

    calculateTouchPosition(e, svg) {
        //relative position of cursor calculated, circle radius is subtracted so that the measurement is from the center
        // e.clientX - position of the mouse on the screen
        
        let touchLocation = e.targetTouches[0];

        let CTM = svg.getScreenCTM();
        let dragX = (touchLocation.pageX - CTM.e) / CTM.a;
        let dragY = (touchLocation.pageY - CTM.f) / CTM.d;
        let mPos = {x: dragX, y: dragY};

        //returns string that can be used to rotate the circle
        let atan = Math.atan2(mPos.x, mPos.y);
        let deg = -atan/(Math.PI/180) + 180;
        
        return deg;
    }

}

export default CalculateCircleParts;