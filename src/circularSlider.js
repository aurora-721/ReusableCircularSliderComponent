import {calculateClosestDeg,
        calculatePathLength,
        calculateMousePosition,
        calculateTouchPosition,
        setAttributes} 
    from './calculateCircleParts';
import ListComponents from './listComponents';

let activeConst = false;

class CircularSlider {
    //bla = false

    constructor(svg, options, additionalOptions) {
        this.svg = svg; 
        this.options = options;
        this.additionalOptions = additionalOptions;
        
        //important for events
        this.circleClicked = false;
        this.currentDeg = 0;      
        
        this.listComp = new ListComponents(this.options);
        
        this.init();
    }
    
    init() {
        this.loadEachSlider();
        this.setStartingPoints();
        this.eventListeners();
    }

    loadEachSlider() {
        const dashedCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        setAttributes(dashedCircle, {"r": this.options.radius,
                                "fill": "none",
                                "class": "dashed-circle",
                                "id": this.options.labelID,
                                "transform": "rotate(-90)",
                                "style": `stroke-width: ${this.additionalOptions.strokeWidth}; stroke-dasharray: 5, 2;`,
                                "cx": "0",
                                "cy": "0"});
        this.svg.appendChild(dashedCircle);

        const circlePath = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        setAttributes(circlePath, {"r": this.options.radius,
                                "fill": "none",
                                "class": "circle-path",
                                "id": this.options.labelID,
                                "transform": "rotate(-90)",
                                "stroke-dasharray": "110 628.3185307179587",
                                "stroke-dashoffset": "0",
                                "style": `stroke: ${this.options.color}; stroke-width: ${this.additionalOptions.strokeWidth};`,
                                "cx": "0",
                                "cy": "0"});
        this.svg.appendChild(circlePath);

        const invisibleLayer = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        setAttributes(invisibleLayer, {"r": this.options.radius,
                                "fill": "none",
                                "class": "invisible-layer",
                                "id": this.options.labelID,
                                "transform": "rotate(-90)",
                                "style": `stroke-width: ${this.additionalOptions.dashedCircleWidth}; stroke: transparent;`,
                                "cx": "0",
                                "cy": "0"});
        this.svg.appendChild(invisibleLayer);

        const smallCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        setAttributes(smallCircle, {"r": this.additionalOptions.smallCircleRadius,
                                "fill": "#fff",
                                "class": "small-circle",
                                "id": this.options.labelID,
                                "transform": "rotate(-90)",
                                "style": `transform: rotate(180deg); transition: all 0.5s ease-in-out 0s;`,
                                "cx": "0",
                                "cy": -this.options.radius});
        this.svg.appendChild(smallCircle);
    }

    setStartingPoints() {
        //set starting points of the list and the slider
        const circlePaths = this.svg.querySelector(`#${this.options.labelID}.circle-path`);
        const smallCircles = this.svg.querySelector(`#${this.options.labelID}.small-circle`);

        // from value calculates deg, so even if val is not precise it calculates it closest value
        let deg = (this.options.value - this.options.minVal) / (this.options.maxVal - this.options.minVal) * 360;
        let val = this.animateToFixedPosition(smallCircles, circlePaths, deg);
        this.listComp.writeToList(val);
    }

    changePosOnMouseOver(circle, path, deg) {
        let fixed = calculateClosestDeg(deg, this.options);

        circle.style.transform = `rotate(${deg}deg)`;

        path.style.strokeDasharray = calculatePathLength(deg, this.options);

        return fixed.value;
    }

    animateToFixedPosition(circle, path, mouseDeg) {
        let fixed = calculateClosestDeg(mouseDeg, this.options);
        
        circle.style.transform = `rotate(${fixed.deg}deg)`;
        circle.style.transition =  "transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)";

        path.style.strokeDasharray = calculatePathLength(fixed.deg, this.options);
        path.style.transition = "stroke-dasharray 0.4s cubic-bezier(0.33, 1, 0.68, 1)";

        return fixed.value;
    }


    eventListeners() {
        const circlePath = this.svg.querySelector(`#${this.options.labelID}.circle-path`);
        const smallCircle = this.svg.querySelector(`#${this.options.labelID}.small-circle`);
        const invisibleLayer = this.svg.querySelector(`#${this.options.labelID}.invisible-layer`);
        
        //mouse clicks on circle
        //this.svg.querySelectorAll('.small-circle').forEach((smallCircle, index) => {
            smallCircle.addEventListener('mousedown', (e) => {
                this.circleClicked = true;
                activeConst = true;

                //when mouse pressed there are no transitions
                smallCircle.style.transition = 'none';
                circlePath.style.transition = 'none';
            })
            
            smallCircle.addEventListener('touchstart', (e) => {
                this.circleClicked = true;
                activeConst = true;

                // when touch pressed there are no transitions
                smallCircle.style.transition = 'none';
                circlePath.style.transition = 'none';

            })
            
            document.querySelector('html').addEventListener('mousemove', (e) => {
                if(this.circleClicked) {
                    let deg = calculateMousePosition(e, this.svg);
                    let val = this.changePosOnMouseOver(smallCircle, circlePath, deg);
                    this.listComp.writeToList(val);
                }
            })
            
            document.querySelector('html').addEventListener('touchmove', (e) => {
                if(this.circleClicked) {
                    this.currentDeg = calculateTouchPosition(e, this.svg);
                    let val = this.changePosOnMouseOver(smallCircle, circlePath, this.currentDeg);
                    this.listComp.writeToList(val);
                }
            })

            document.querySelector('html').addEventListener('mouseup', (e) => {
                if(this.circleClicked) {
                    this.circleClicked = false;
                    activeConst = false;
                    let deg = calculateMousePosition(e, this.svg);
                    let val = this.animateToFixedPosition(smallCircle, circlePath, deg);
                    this.listComp.writeToList(val);
                    
                }
            })

            document.querySelector('html').addEventListener('touchend', (e) => {
                if(this.circleClicked) {
                    this.circleClicked = false;
                    activeConst = false;
                    //let deg = calculateTouchPosition(e, this.svg);
                    let val = this.animateToFixedPosition(smallCircle, circlePath, this.currentDeg);
                    this.listComp.writeToList(val);
                }
            })

            invisibleLayer.addEventListener('mouseup', (e) => {
                if (!activeConst) {
                    let deg = calculateMousePosition(e, this.svg);
                    let val = this.animateToFixedPosition(smallCircle, circlePath, deg);
                    this.listComp.writeToList(val);
                }
            })
    }
}

export default CircularSlider;