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
            radius: 100
        };

        this.circleClicked = false;
    }

    changePosOnMouseOver(e) {
        const circle = this.shadowRoot.querySelector('.circle');
        const circleRadius = 10;    //this is based on the default style of the small circle and is in px

        //relative position of cursor calculated, circle radius is subtracted so that the measurement is from the center
        let mPos = {x: e.clientX - circle.offsetLeft - circleRadius, y: e.clientY - this.options.radius - circle.offsetTop - circleRadius};
        
        circle.style.transform = this.calculateMousePosition(mPos);
        

        
    }

    calculateMousePosition(mPos) {
        //returns string that can be used to translate circle
        let atan = Math.atan2(mPos.x, mPos.y);
        let deg = -atan/(Math.PI/180) + 180;

        //let posX = this.options.radius* Math.sin(deg*Math.PI/180);
        //let posY = this.options.radius* -Math.cos(deg*Math.PI/180);

        //return "translate(" + posX + "em," +  posY +"em)";
        return "rotate(" + deg + "deg)";
    }

    animateToFixedPosition() {
        //let mPos = {x: e.clientX - circle.offsetLeft - circleRadius, y: e.clientY - circle.offsetTop - circleRadius};
        const circle = this.shadowRoot.querySelector('.circle');

        circle.style.transform = "rotate(0deg)";
        circle.style.transition =  "transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)";



    }
    

    connectedCallback() {
        //mouse clicks on circle
        this.shadowRoot.querySelector('.circle').addEventListener('mousedown', (e) => {
            this.circleClicked = true;
            
            //when mouse pressed there are no transitions
            circle.style.transition = 'none';
        })
        document.querySelector('html').addEventListener('mousemove', (e) => {
            if(this.circleClicked) {
                this.changePosOnMouseOver(e);
            }
        })
        document.querySelector('html').addEventListener('mouseup', (e) => {
            this.circleClicked = false;
            this.animateToFixedPosition();

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
        this.shadowRoot.querySelector('.slider').style.width = 2 * this.options.radius + "px";
        this.shadowRoot.querySelector('.slider').style.height = 2 * this.options.radius + "px";
        // defining the position of the circle
        const circle = this.shadowRoot.querySelector('.circle');


    }
}

window.customElements.define('circular-slider', CircularSlider);

