const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="./styles/circularSlider.css" />

    <div class="slider-container">
        <div class="slider">
            <div class="circle">
            </div>
        </div>
        <svg id="circularSliderRoot" width="700" height="700" viewBox="-200 -200 400 400">
            <circle cx="0" cy="0" fill="none" class="dashed-circle" transform="rotate(-90)" style="stroke-width: 20px; stroke-dasharray: 5, 2;"></circle>
            <circle cx="0" cy="0" fill="none" class="invisible-layer" style="stroke-width: 20px; stroke: transparent;"></circle>
            <circle cx="0" cy="-100" fill="#fff" class="small-circle" id="handleslider180" style="transform: rotate(30deg); transition: all 0.5s ease-in-out 0s;"></circle>
        </svg>


        <svg id="circularSliderRoot" width="700" height="700" viewBox="-200 -200 400 400">
            <circle cx="0" cy="0" r="180" fill="none" class="dashed-circle" transform="rotate(-90)" style="stroke-width: 20px; stroke-dasharray: 5, 2;">
            </circle>
            <circle cx="0" cy="0" r="180" fill="none" class="invisible-layer" style="stroke-width: 20px; stroke: transparent;">
            </circle>
            <circle cx="0" cy="0" r="180" fill="none" class="top-slider" transform="rotate(-90)" stroke-dasharray="1193.8052083641214 1193.8052083641214" stroke-dashoffset="628.8052083641214" style="stroke: rgb(93, 59, 109); stroke-width: 20px; transition: stroke-dashoffset 0.5s ease-in-out 0s;">
            </circle>
            <circle cx="0" cy="-180" fill="#fff" class="handle" id="handleslider180" style="transform: rotate(179.909deg); transition: all 0.5s ease-in-out 0s;">
            </circle>
        </svg>

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

        this.circleConf = {
            radius: 12,
            origin: [0, 0],
        };

        this.circleClicked = false;
    }

    changePosOnMouseOver(e) {
        const circle = this.shadowRoot.querySelector('.circle');
        
        let deg = this.calculateMousePosition(e, circle)
        circle.style.transform = "rotate(" + deg + "deg)";
    }

    calculateMousePosition(e, circle) {
        //relative position of cursor calculated, circle radius is subtracted so that the measurement is from the center
        // e.clientX - position of the mouse on the screen
        // circle offset - position of the circle in its initial position
        // circleConf.radius - the dimensions of the small circle
        let mPos = {x: e.clientX - circle.offsetLeft - this.circleConf.radius,
            y: e.clientY - this.options.radius - circle.offsetTop};
        

        //returns string that can be used to rotate the circle
        let atan = Math.atan2(mPos.x, mPos.y);
        let deg = -atan/(Math.PI/180) + 180;
        
        return deg;

        //let posX = this.options.radius* Math.sin(deg*Math.PI/180);
        //let posY = this.options.radius* -Math.cos(deg*Math.PI/180);
        //return "translate(" + posX + "em," +  posY +"em)";
    }

    animateToFixedPosition(e) {
        const circle = this.shadowRoot.querySelector('.circle');
        let mouseDeg = this.calculateMousePosition(e, circle);
        let deg = this.calculateClosestDeg(mouseDeg);

        circle.style.transform = "rotate("+ deg + "deg)";
        circle.style.transition =  "transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)";
    }

    calculateClosestDeg(mouseDeg) {
        // Takes the difference between max and min value and divides it with step - this gives the num of slices
        let circleDivisions = (this.options.maxVal - this.options.minVal) / this.options.step;
        // then 360 is divided with that number
        let angleDeg = 360 / circleDivisions;
        // rounds the angle to the nearest angle
        let numOfAngleDeg = Math.round(mouseDeg/angleDeg);
        let deg = angleDeg * numOfAngleDeg;
        console.log(deg);

        return deg;
    }


    

    connectedCallback() {
        
        this.initCircularSlider();
        
        const circle = this.shadowRoot.querySelector('.circle');

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
            this.animateToFixedPosition(e);

        })

    }

    initCircularSlider() {
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


        // defining the radius of the circle - OLD
        this.shadowRoot.querySelector('.slider').style.width = 2 * this.options.radius + "px";
        this.shadowRoot.querySelector('.slider').style.height = 2 * this.options.radius + "px";
        // defining the position of the circle - OLD
        const circle = this.shadowRoot.querySelector('.circle');
        
        this.shadowRoot.querySelector('.circle').style.width = 2 * this.circleConf.radius + "px";
        this.shadowRoot.querySelector('.circle').style.height = 2 * this.circleConf.radius + "px";
        this.shadowRoot.querySelector('.circle').style.transformOrigin  = this.circleConf.radius + "px " + this.options.radius + "px";



        
        //set default propreties for the circle
        this.shadowRoot.querySelector('.dashed-circle').style.r = this.options.radius;
        this.shadowRoot.querySelector('.invisible-layer').style.r = this.options.radius;
        this.shadowRoot.querySelector('.small-circle').style.cy = -this.options.radius;
        this.shadowRoot.querySelector('.small-circle').style.r = this.circleConf.radius;

        this.shadowRoot.querySelector('.small-circle').style.transform = "rotate(90deg)";

        
    }


}

window.customElements.define('circular-slider', CircularSlider);

