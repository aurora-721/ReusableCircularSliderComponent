import CircularSlider from './circularSlider';
import {setAttributes} from './calculateCircleParts';

export class HtmlElementCircularSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // The default values of container, options and additionalOptions
        this.container = this.shadowRoot;

        this.svg;

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

        this.loadSliders();
        //this.sliderElem.setStartingPoints();

    }

    loadSliders() {  
        const containerElement = this.initiateSVG(); 

        this.options.forEach((option) => {
            new CircularSlider(this.svg, option, this.additionalOptions);
        });

        containerElement.appendChild(this.svg);
        this.container.appendChild(containerElement);        
    }

    initiateSVG() {
        //set div element
        const containerElement = document.createElement('div');
        containerElement.setAttribute("class", "SVGcontainer");

        //set link element
        const link = document.createElement('link');
        setAttributes(link, {"rel": "stylesheet",
                            "href": "../styles/circularSlider.css",
                            "type": "text/css"});
        containerElement.appendChild(link);
        
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        setAttributes(this.svg, {"xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "-200 -200 400 400",
        "width": "700",
        "height": "700",
        "id": "circularSliderRoot" });

        return containerElement;
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
