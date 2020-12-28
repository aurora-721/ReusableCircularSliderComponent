
import CircularSlider from './circularSlider';


export class HtmlElementCircularSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        

        // The default values of container, options and additionalOptions
        this.container = this.shadowRoot;

        this.options = [{
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
        if (this.getAttribute('additional_options')) {
            let forParsing = this.getAttribute('additional_options');
            console.log(forParsing);
            this.additionalOptions = JSON.parse(forParsing);

        }
    }
}
