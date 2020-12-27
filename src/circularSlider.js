import {
    calculateClosestDeg,
    calculatePathLength,
    calculateMousePosition,
    calculateTouchPosition
  } from './calculateCircleParts';

  import ListComponents from './listComponents';



class CircularSlider {
    constructor(SVGlocation, options, additionalOptions) {
        this.SVGlocation = SVGlocation;
        this.options = options;
        this.additionalOptions = additionalOptions;

        

        this.loadSliders();

        this.circleClicked = [false, false, false]; //important for events
        this.svg = this.SVGlocation.getElementById('circularSliderRoot');

        this.listComp = new ListComponents();

        this.currentDeg = 0;

    }

    loadSliders() {
        const template = document.createElement('template');

        let input = ``;
        input = `
            <link rel="stylesheet" href="../styles/circularSlider.css" />
            <div class="SVGcontainer">
                <svg xmlns="http://www.w3.org/2000/svg" id="circularSliderRoot" width="700" height="700" viewBox="-200 -200 400 400">`;
        for (let i = 0; i < this.options.length; i++) {
            input += `<circle cx="0" cy="0" r=${this.options[i].radius} fill="none" class="dashed-circle" transform="rotate(-90)" style="stroke-width: 20px; stroke-dasharray: 5, 2;"></circle>
                    <circle cx="0" cy="0" r=${this.options[i].radius} fill="none" class="circle-path" transform="rotate(-90)" stroke-dasharray="110 628.3185307179587" stroke-dashoffset="0" style="stroke: ${this.options[i].color}; stroke-width: 20px;"></circle>
                    <circle cx="0" cy="0" r=${this.options[i].radius} fill="none" class="invisible-layer" style="stroke-width: 20px; stroke: transparent;"></circle>
                    <circle cx="0" cy=${-this.options[i].radius} r=${this.additionalOptions.smallCircleRadius} fill="#fff" class="small-circle" style="transform: rotate(180deg); transition: all 0.5s ease-in-out 0s;"></circle>`;
        }
        input += ` </svg>
            </div>`;

        template.innerHTML = input;

        this.SVGlocation.appendChild(template.content.cloneNode(true));
    }

    
    changePosOnMouseOver(e, circle, path, deg, options) {
        let fixed = calculateClosestDeg(deg, options);

        circle.style.transform = "rotate(" + deg + "deg)";

        path.style.strokeDasharray = calculatePathLength(deg, options);

        return fixed.value;
    }

    animateToFixedPosition(e, circle, path, mouseDeg, options) {
        let fixed = calculateClosestDeg(mouseDeg, options);

        circle.style.transform = "rotate("+ fixed.deg + "deg)";
        circle.style.transition =  "transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)";

        path.style.strokeDasharray = calculatePathLength(fixed.deg, options);
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
                
                //when mouse pressed there are no transitions
                item.style.transition = 'none';
                circlePath[index].style.transition = 'none';
            })
            document.querySelector('html').addEventListener('mousemove', (e) => {
                if(this.circleClicked[index]) {
                    let deg = calculateMousePosition(e, this.svg);
                    let val = this.changePosOnMouseOver(e, item, circlePath[index], deg, this.options[index]);
                    this.listComp.writeToList(val, index);
                }
            })
            document.querySelector('html').addEventListener('touchmove', (e) => {
                if(this.circleClicked[index]) {
                    this.currentDeg = calculateTouchPosition(e, this.svg);
                    let val = this.changePosOnMouseOver(e, item, circlePath[index], this.currentDeg, this.options[index]);
                    this.listComp.writeToList(val, index);
                }
            })
            document.querySelector('html').addEventListener('mouseup', (e) => {
                if(this.circleClicked[index]) {
                    this.circleClicked[index] = false;
                    let deg = calculateMousePosition(e, this.svg);
                    let val = this.animateToFixedPosition(e, item, circlePath[index], deg, this.options[index]);
                    this.listComp.writeToList(val, index);
                    
                }
            })
            document.querySelector('html').addEventListener('touchend', (e) => {
                if(this.circleClicked[index]) {
                    this.circleClicked[index] = false;
                    //let deg = calculateTouchPosition(e, this.svg);
                    let val = this.animateToFixedPosition(e, item, circlePath[index], this.currentDeg, this.options[index]);
                    this.listComp.writeToList(val, index);
                }
            })
            invisibleLayer[index].addEventListener('mouseup', (e) => {
                if (this.circleClicked.every(elem => elem == false)) {
                    let deg = calculateMousePosition(e, this.svg);
                    let val = this.animateToFixedPosition(e, item, circlePath[index], deg, this.options[index]);
                    this.listComp.writeToList(val, index);
                }
            })
            
        })    
    }

}

export default CircularSlider;