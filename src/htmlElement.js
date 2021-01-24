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
        this.loadSliders();
        this.sliderElem.setStartingPoints();

    }

    loadSliders() {
        const template = document.createElement('template');

        let input = ``;
        input = `
            <link rel="stylesheet" href="../styles/circularSlider.css" />
            <div class="SVGcontainer">
                <svg xmlns="http://www.w3.org/2000/svg" id="circularSliderRoot" width="700" height="700" viewBox="-200 -200 400 400">`;
        for (let i = 0; i < this.options.length; i++) {
            input += this.sliderElem.loadSlider(i);
        }
        input += `</svg>
            </div>`;

        template.innerHTML = input;

        this.container.appendChild(template.content.cloneNode(true));
        this.sliderElem.setSvg = this.container.querySelector("#circularSliderRoot");
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
