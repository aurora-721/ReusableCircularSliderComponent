import {template} from './template';


export class CircularSlider extends HTMLElement {
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
        };

        this.circleClicked = false;

        this.initCircularSlider();

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
        this.shadowRoot.querySelector('.dashed-circle').setAttribute('r', this.options.radius);
        this.shadowRoot.querySelector('.invisible-layer').setAttribute('r', this.options.radius);
        this.shadowRoot.querySelector('.small-circle').setAttribute('cy', -this.options.radius);
        this.shadowRoot.querySelector('.circle-path').setAttribute('r', this.options.radius);
        this.shadowRoot.querySelector('.small-circle').setAttribute('r', this.circleConf.radius);

        this.shadowRoot.querySelector('.small-circle').style.transform = "rotate(90deg)";

        this.calculatePathLength();
    }


}
