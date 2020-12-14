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

    changePosition(e) {
        console.log(e);
        const circle = this.shadowRoot.querySelector('.circle');
        const circleRadius = 10;
        console.log(circleRadius);

        let mPos = {x: e.clientX - circle.offsetLeft - circleRadius, y: e.clientY - circle.offsetTop - circleRadius};
        let atan = Math.atan2(mPos.x, mPos.y);
        let deg = -atan/(Math.PI/180) + 180; // final (0-360 positive) degrees from mouse position 
        
        //console.log(circle.offsetLeft, circle.offsetTop);
        console.log(deg)
        

        //circle.style.transform = "translate(" + 0 + "px," + 0 + "px)";
        circle.style.transform = this.calculatePosition(deg);
        
    }

    calculatePosition(deg) {
        let posX = this.options.radius* Math.sin(deg*Math.PI/180);
        let posY = this.options.radius* -Math.cos(deg*Math.PI/180);
        console.log(posX, posY);

        return "translate(" + posX + "em," +  posY +"em)";
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.circle').addEventListener('mousemove', (e) => {
            this.changePosition(e)
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

        
        // defining the radius of the circle
        this.shadowRoot.querySelector('.slider').style.width = 2 * this.options.radius + "em";
        this.shadowRoot.querySelector('.slider').style.height = 2 * this.options.radius + "em";
        // defining the position of the circle
        const circle = this.shadowRoot.querySelector('.circle');


        circle.style.transform = this.calculatePosition(0);

        console.log(this.options);

    }
}

window.customElements.define('circular-slider', CircularSlider);

