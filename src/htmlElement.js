
import CircularSlider from './circularSlider';


export class HtmlElementCircularSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        
        this.container = this.shadowRoot;
        // the options component
        this.options = [{
            container: 0,
            color: '#005',
            minVal: 1,
            maxVal: 220,
            value: 51,
            step: 50,
            radius: 50
        }];
        
        this.additionalOptions = {
            dashedCircleWidth: 20,
            smallCircleRadius: 12,
            strokeWidth: 20,
        };

        
        this.getAttributesFromHtml();
        

        this.sliderElem = new CircularSlider(this.container, this.options, this.additionalOptions);

    }



    connectedCallback() {
        // call event listeners on shadow dom
        this.sliderElem.eventListeners();
    }

    getAttributesFromHtml() {
        //extract the defined attributes
        if (this.getAttribute('options')) {
            let forParsing = this.getAttribute('options');
            this.options = JSON.parse(forParsing);
        }
        // overrides the default container of shadow root
        if (this.getAttribute('container')) {
            this.container = document.querySelector("#" + this.getAttribute('container'));
        }
    }
}
