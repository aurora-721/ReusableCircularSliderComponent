const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="./styles/circularSlider.css" />

    <div class="slider-container">
        <svg id="circularSliderRoot" width="700" height="700" viewBox="-200 -200 400 400">
            <circle cx="0" cy="0" fill="none" class="dashed-circle" transform="rotate(-90)" style="stroke-width: 20px; stroke-dasharray: 5, 2;"></circle>
            <circle cx="0" cy="0" fill="none" class="circle-path" transform="rotate(-90)" stroke-dasharray="110 628.3185307179587" stroke-dashoffset="0" style="stroke: rgb(93, 59, 109); stroke-width: 20px;"></circle>
            <circle cx="0" cy="0" fill="none" class="invisible-layer" style="stroke-width: 20px; stroke: transparent;"></circle>
            <circle cx="0" cy="-100" fill="#fff" class="small-circle" id="handleslider180" style="transform: rotate(30deg); transition: all 0.5s ease-in-out 0s;"></circle>
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

    changePosOnMouseOver(e, circle, path) {
        let deg = this.calculateMousePosition(e);

        circle.style.transform = "rotate(" + deg + "deg)";

        path.style.strokeDasharray = this.calculatePathLength(deg);
    }

    calculateMousePosition(e) {
        //relative position of cursor calculated, circle radius is subtracted so that the measurement is from the center
        // e.clientX - position of the mouse on the screen
        
        let svg = this.shadowRoot.getElementById('circularSliderRoot');
        let CTM = svg.getScreenCTM();
        let dragX = (e.clientX - CTM.e) / CTM.a;
        let dragY = (e.clientY - CTM.f) / CTM.d;
        let mPos = {x: dragX, y: dragY};

        //returns string that can be used to rotate the circle
        let atan = Math.atan2(mPos.x, mPos.y);
        let deg = -atan/(Math.PI/180) + 180;
        
        return deg;

    }

    animateToFixedPosition(e, circle, path) {
        let mouseDeg = this.calculateMousePosition(e);
        let deg = this.calculateClosestDeg(mouseDeg);

        circle.style.transform = "rotate("+ deg + "deg)";
        circle.style.transition =  "transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)";

        path.style.strokeDasharray = this.calculatePathLength(deg);
        path.style.transition = "stroke-dasharray 0.4s cubic-bezier(0.33, 1, 0.68, 1)";
    }

    calculateClosestDeg(mouseDeg) {
        // Takes the difference between max and min value and divides it with step - this gives the num of slices
        let circleDivisions = (this.options.maxVal - this.options.minVal) / this.options.step;
        // then 360 is divided with that number
        let angleDeg = 360 / circleDivisions;
        // rounds the angle to the nearest angle
        let numOfAngleDeg = Math.round(mouseDeg/angleDeg);
        let deg = angleDeg * numOfAngleDeg;

        return deg;
    }

    calculatePathLength(deg) {
        let circumference = 2 * Math.PI * this.options.radius;
        let angle = circumference * deg / 360;
        return angle + " " + circumference;
    }
    

    connectedCallback() {
        
        this.initCircularSlider();
        
        const smallCircle = this.shadowRoot.querySelector('.small-circle');
        const circlePath = this.shadowRoot.querySelector('.circle-path');

        //mouse clicks on circle
        this.shadowRoot.querySelector('.small-circle').addEventListener('mousedown', (e) => {
            this.circleClicked = true;
            
            //when mouse pressed there are no transitions
            smallCircle.style.transition = 'none';
            circlePath.style.transition = 'none';
        })
        document.querySelector('html').addEventListener('mousemove', (e) => {
            if(this.circleClicked) {
                this.changePosOnMouseOver(e, smallCircle, circlePath);
            }
        })
        document.querySelector('html').addEventListener('mouseup', (e) => {
            if(this.circleClicked) {
                this.circleClicked = false;
                this.animateToFixedPosition(e, smallCircle, circlePath);
            }
        })
        this.shadowRoot.querySelector('.invisible-layer').addEventListener('mouseup', (e) => {
            this.animateToFixedPosition(e, smallCircle, circlePath);
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



        
        //set default propreties for the circle
        this.shadowRoot.querySelector('.dashed-circle').style.r = this.options.radius;
        this.shadowRoot.querySelector('.invisible-layer').style.r = this.options.radius;
        this.shadowRoot.querySelector('.small-circle').style.cy = -this.options.radius;
        this.shadowRoot.querySelector('.circle-path').style.r = this.options.radius;
        this.shadowRoot.querySelector('.small-circle').style.r = this.circleConf.radius;

        this.shadowRoot.querySelector('.small-circle').style.transform = "rotate(90deg)";

        this.calculatePathLength();
    }


}

window.customElements.define('circular-slider', CircularSlider);

