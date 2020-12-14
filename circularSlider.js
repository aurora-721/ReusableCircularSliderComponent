const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="./styles/circularSlider.css" />

    <div class="slider-container">
        <div class="slider">
            <div class="circle">
            </div>
        </div>
    </div>
`;


class CircularSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.options = {
            container: 0,
            color: '#000',
            minVal: 0,
            maxVal: 100,
            step: 1,
            radius: 0
        };
    }

    changePosition() {
        const circle = this.shadowRoot.querySelector('.circle');
        let deg = 20;

        circle.style.transform = "rotate(" + deg + "deg) translate(" + this.options.radius * Math.cos(deg*Math.PI/180) + "em," +  this.options.radius * Math.sin(deg*Math.PI/180) +"em)";
        
    }

    

    connectedCallback() {
        this.shadowRoot.querySelector('.circle').addEventListener('click', () => {
            this.changePosition()
        })

        //see if attribute is defined
        if (this.getAttribute('radius')) {
            this.options.radius = this.getAttribute('radius');
            let deg = 0;
            
            // defining the radius of the circle
            this.shadowRoot.querySelector('.slider').style.width = 2 * this.options.radius + "em";
            this.shadowRoot.querySelector('.slider').style.height = 2 * this.options.radius + "em";
            // defining the position of the circle
            const circle = this.shadowRoot.querySelector('.circle');
            circle.style.transform = "rotate(" + deg + "deg) translate(" + this.options.radius * Math.cos(deg*Math.PI/180) + "em," +  this.options.radius * Math.sin(deg*Math.PI/180) +"em)";

        }

    }
}

window.customElements.define('circular-slider', CircularSlider);

