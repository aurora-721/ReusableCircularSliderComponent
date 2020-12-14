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
            radius: 10
        };
    }

    changePosition() {
        const circle = this.shadowRoot.querySelector('.circle');
        let deg = 45;

        circle.style.transform = "rotate(" + deg + "deg) translate(" + this.options.radius * Math.cos(deg*Math.PI/180) + "em," +  this.options.radius * Math.sin(deg*Math.PI/180) +"em)";
        
    }

    

    connectedCallback() {
        this.shadowRoot.querySelector('.circle').addEventListener('click', () => {
            this.changePosition()
        })


        //extract the defined attributes
        if (this.getAttribute('color')) {
            this.options.color = this.getAttribute('color');
        }
        if (this.getAttribute('container')) {
            this.options.container = this.getAttribute('container');
        }
        if (this.getAttribute('maxVal')) {
            this.options.maxVal = this.getAttribute('maxVal');
        }
        if (this.getAttribute('minVal')) {
            this.options.minVal = this.getAttribute('minVal');
        }
        if (this.getAttribute('radius')) {
            this.options.radius = this.getAttribute('radius');
        }
        if (this.getAttribute('step')) {
            this.options.step = this.getAttribute('step');
        }

        let deg = 0;
        
        // defining the radius of the circle
        this.shadowRoot.querySelector('.slider').style.width = 2 * this.options.radius + "em";
        this.shadowRoot.querySelector('.slider').style.height = 2 * this.options.radius + "em";
        // defining the position of the circle
        const circle = this.shadowRoot.querySelector('.circle');
        circle.style.transform = "rotate(" + deg + "deg) translate(" + this.options.radius * Math.cos(deg*Math.PI/180) + "em," +  this.options.radius * Math.sin(deg*Math.PI/180) +"em)";
        

        console.log(this.options);

    }
}

window.customElements.define('circular-slider', CircularSlider);

