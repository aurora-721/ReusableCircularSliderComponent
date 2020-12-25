import {
    calculateClosestDeg,
    calculatePathLength,
    calculateMousePosition
  } from './calculateCircleParts';


export class CircularSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        
        // the options component

        this.presets = [
        {
            container: 0,
            color: '#005',
            minVal: 1,
            maxVal: 220,
            step: 50,
            radius: 50
        }];
        
        this.circleConf = {
            radius: 12,
        };
        
        this.getAttributesFromHtml();

        this.loadSliders();
     

        this.circleClicked = [false, false, false]; //important for events
        this.svg = this.shadowRoot.getElementById('circularSliderRoot');

    }

    loadSliders() {
        const template = document.createElement('template');

        let input = ``;
        input = `
            <link rel="stylesheet" href="../styles/circularSlider.css" />
                <svg xmlns="http://www.w3.org/2000/svg" id="circularSliderRoot" width="700" height="700" viewBox="-200 -200 400 400">`;
        for (let i = 0; i < this.presets.length; i++) {
            input += `<circle cx="0" cy="0" r=${this.presets[i].radius} fill="none" class="dashed-circle" transform="rotate(-90)" style="stroke-width: 20px; stroke-dasharray: 5, 2;"></circle>
                    <circle cx="0" cy="0" r=${this.presets[i].radius} fill="none" class="circle-path" transform="rotate(-90)" stroke-dasharray="110 628.3185307179587" stroke-dashoffset="0" style="stroke: ${this.presets[i].color}; stroke-width: 20px;"></circle>
                    <circle cx="0" cy="0" r=${this.presets[i].radius} fill="none" class="invisible-layer" style="stroke-width: 20px; stroke: transparent;"></circle>
                    <circle cx="0" cy=${-this.presets[i].radius} r=${this.circleConf.radius} fill="#fff" class="small-circle" style="transform: rotate(180deg); transition: all 0.5s ease-in-out 0s;"></circle>`;
        }
        input += ` </svg>
                <slot name="individualSlider"/>`;

        template.innerHTML = input;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
           
    }

    changePosOnMouseOver(e, circle, path, options) {
        let deg = calculateMousePosition(e, this.svg);

        circle.style.transform = "rotate(" + deg + "deg)";

        path.style.strokeDasharray = calculatePathLength(deg, options);
    }



    animateToFixedPosition(e, circle, path, options) {
        let mouseDeg = calculateMousePosition(e, this.svg);
        let deg = calculateClosestDeg(mouseDeg, options);

        circle.style.transform = "rotate("+ deg + "deg)";
        circle.style.transition =  "transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)";

        path.style.strokeDasharray = calculatePathLength(deg, options);
        path.style.transition = "stroke-dasharray 0.4s cubic-bezier(0.33, 1, 0.68, 1)";
    }


    connectedCallback() {
        const smallCircle = this.shadowRoot.querySelectorAll('.small-circle');
        const circlePath = this.shadowRoot.querySelectorAll('.circle-path');
        const invisibleLayer = this.shadowRoot.querySelectorAll('.invisible-layer');
        
        //mouse clicks on circle
        this.shadowRoot.querySelectorAll('.small-circle').forEach((item, index) => {
            item.addEventListener('mousedown', (e) => {
                this.circleClicked[index] = true;
                
                //when mouse pressed there are no transitions
                item.style.transition = 'none';
                circlePath[index].style.transition = 'none';
            })
            document.querySelector('html').addEventListener('mousemove', (e) => {
                if(this.circleClicked[index]) {
                    this.changePosOnMouseOver(e, item, circlePath[index], this.presets[index]);
                }
            })
            document.querySelector('html').addEventListener('mouseup', (e) => {
                if(this.circleClicked[index]) {
                    this.circleClicked[index] = false;
                    this.animateToFixedPosition(e, item, circlePath[index], this.presets[index]);
                }
            })
            invisibleLayer[index].addEventListener('mouseup', (e) => {
                if (this.circleClicked.every(elem => elem == false)) {
                    this.animateToFixedPosition(e, item, circlePath[index], this.presets[index]);
                }
            })
        })
    }

    getAttributesFromHtml() {
        //extract the defined attributes
        if (this.getAttribute('options')) {
            let forParsing = this.getAttribute('options');
            this.presets = JSON.parse(forParsing);
        }
    }
}
