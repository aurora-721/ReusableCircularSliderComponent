import CalculateCircleParts from './calculateCircleParts';
import ListComponents from './listComponents';

class CircularSlider {
    constructor(SVGlocation, options, additionalOptions) {
        this.SVGlocation = SVGlocation;
        this.options = options;
        this.additionalOptions = additionalOptions;

        //important for events
        this.circleClicked = []; 
        this.circleClicked.length = this.options.length;
        this.circleClicked.fill(false);

        this.currentDeg = 0;      

        this.listComp = new ListComponents();
        this.circleParts = new CalculateCircleParts();
        
        // load individual sliders
        this.loadSliders();
        this.svg = this.SVGlocation.querySelector("#circularSliderRoot");

        this.setSartingPoints();
    }

    loadSliders() {
        const template = document.createElement('template');

        let input = ``;
        input = `
            <link rel="stylesheet" href="../styles/circularSlider.css" />
            <div class="SVGcontainer">
                <svg xmlns="http://www.w3.org/2000/svg" id="circularSliderRoot" width="700" height="700" viewBox="-200 -200 400 400">`;
        for (let i = 0; i < this.options.length; i++) {
            input += this.loadSlider(i);
        }
        input += `</svg>
            </div>`;

        template.innerHTML = input;

        this.SVGlocation.appendChild(template.content.cloneNode(true));
    }

    loadSlider(i) {
        return `<circle cx="0" cy="0" r=${this.options[i].radius} fill="none" class="dashed-circle" transform="rotate(-90)" style="stroke-width: ${this.additionalOptions.dashedCircleWidth}; stroke-dasharray: 5, 2;"></circle>
                <circle cx="0" cy="0" r=${this.options[i].radius} fill="none" class="circle-path" transform="rotate(-90)" stroke-dasharray="110 628.3185307179587" stroke-dashoffset="0" style="stroke: ${this.options[i].color}; stroke-width: ${this.additionalOptions.strokeWidth};"></circle>
                <circle cx="0" cy="0" r=${this.options[i].radius} fill="none" class="invisible-layer" style="stroke-width: ${this.additionalOptions.dashedCircleWidth}; stroke: transparent;"></circle>
                <circle cx="0" cy=${-this.options[i].radius} r=${this.additionalOptions.smallCircleRadius} fill="#fff" class="small-circle" style="transform: rotate(180deg); transition: all 0.5s ease-in-out 0s;"></circle>`;        
    }

    setSartingPoints() {
        //set starting points of the list and the slider
        const circlePath = this.SVGlocation.querySelectorAll('.circle-path');
        const smallCircle = this.SVGlocation.querySelectorAll('.small-circle');
        this.options.forEach((option, index) => {
            // from value calculates deg, so even if val is not precise it calculates it closest value
            let deg = (option.value - option.minVal) / (option.maxVal - option.minVal) * 360;
            let val = this.animateToFixedPosition(smallCircle[index], circlePath[index], deg, option);
            this.listComp.writeToList(val, option);
        });
    }

    changePosOnMouseOver(e, circle, path, deg, options) {
        let fixed = this.circleParts.calculateClosestDeg(deg, options);

        circle.style.transform = "rotate(" + deg + "deg)";

        path.style.strokeDasharray = this.circleParts.calculatePathLength(deg, options);

        return fixed.value;
    }

    animateToFixedPosition(circle, path, mouseDeg, options) {
        let fixed = this.circleParts.calculateClosestDeg(mouseDeg, options);

        circle.style.transform = "rotate("+ fixed.deg + "deg)";
        circle.style.transition =  "transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)";

        path.style.strokeDasharray = this.circleParts.calculatePathLength(fixed.deg, options);
        path.style.transition = "stroke-dasharray 0.4s cubic-bezier(0.33, 1, 0.68, 1)";

        return fixed.value;
    }


    eventListeners() {
        const smallCircle = this.SVGlocation.querySelectorAll('.small-circle');
        const circlePath = this.SVGlocation.querySelectorAll('.circle-path');
        const invisibleLayer = this.SVGlocation.querySelectorAll('.invisible-layer');
        
        //mouse clicks on circle
        this.SVGlocation.querySelectorAll('.small-circle').forEach((item, index) => {
            item.addEventListener('mousedown', (e) => {
                this.circleClicked[index] = true;
                
                //when mouse pressed there are no transitions
                item.style.transition = 'none';
                circlePath[index].style.transition = 'none';
            })
            
            item.addEventListener('touchstart', (e) => {
                this.circleClicked[index] = true;
                
                // when touch pressed there are no transitions
                item.style.transition = 'none';
                circlePath[index].style.transition = 'none';

            })
            
            document.querySelector('html').addEventListener('mousemove', (e) => {
                if(this.circleClicked[index]) {
                    let deg = this.circleParts.calculateMousePosition(e, this.svg);
                    let val = this.changePosOnMouseOver(e, item, circlePath[index], deg, this.options[index]);
                    this.listComp.writeToList(val, this.options[index]);
                }
            })
            
            document.querySelector('html').addEventListener('touchmove', (e) => {
                if(this.circleClicked[index]) {
                    this.currentDeg = this.circleParts.calculateTouchPosition(e, this.svg);
                    let val = this.changePosOnMouseOver(e, item, circlePath[index], this.currentDeg, this.options[index]);
                    this.listComp.writeToList(val, this.options[index]);
                }
            })

            document.querySelector('html').addEventListener('mouseup', (e) => {
                if(this.circleClicked[index]) {
                    this.circleClicked[index] = false;
                    let deg = this.circleParts.calculateMousePosition(e, this.svg);
                    let val = this.animateToFixedPosition(item, circlePath[index], deg, this.options[index]);
                    this.listComp.writeToList(val, this.options[index]);
                    
                }
            })

            document.querySelector('html').addEventListener('touchend', (e) => {
                if(this.circleClicked[index]) {
                    this.circleClicked[index] = false;
                    //let deg = calculateTouchPosition(e, this.svg);
                    let val = this.animateToFixedPosition(item, circlePath[index], this.currentDeg, this.options[index]);
                    this.listComp.writeToList(val, this.options[index]);
                }
            })

            invisibleLayer[index].addEventListener('mouseup', (e) => {
                if (this.circleClicked.every(elem => elem == false)) {
                    let deg = this.circleParts.calculateMousePosition(e, this.svg);
                    let val = this.animateToFixedPosition(item, circlePath[index], deg, this.options[index]);
                    this.listComp.writeToList(val, this.options[index]);
                }
            })
            
        })    
    }
}

export default CircularSlider;