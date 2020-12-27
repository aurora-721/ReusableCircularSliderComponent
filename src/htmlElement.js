import {
    calculateClosestDeg,
    calculatePathLength,
    calculateMousePosition,
    calculateTouchPosition
  } from './calculateCircleParts';

import ListComponents from './listComponents';
import CircularSlider from './circularSlider';


export class HtmlElementCircularSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        
        // the options component

        this.options = [{
            container: 0,
            color: '#005',
            minVal: 1,
            maxVal: 220,
            step: 50,
            radius: 50
        }];
        
        this.additionalOptions = {
            smallCircleRadius: 12,
            strokeWidth: 20,
            dashedCircleWidth: 20,
        };
        
        this.getAttributesFromHtml();
        

        this.sliderElem = new CircularSlider(this.shadowRoot, this.options, this.additionalOptions);

    }



    connectedCallback() {
        this.sliderElem.eventListeners();
    }

    getAttributesFromHtml() {
        //extract the defined attributes
        if (this.getAttribute('options')) {
            let forParsing = this.getAttribute('options');
            this.options = JSON.parse(forParsing);
        }
    }
}
