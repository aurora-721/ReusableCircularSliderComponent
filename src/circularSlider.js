class CircularSlider {
    constructor(SVGlocation, options, additionalOptions) {
        this.SVGlocation = SVGlocation;
        this.options = options;
        this.additionalOptions = additionalOptions;

        this.loadSliders();

    }

    loadSliders() {
        const template = document.createElement('template');

        let input = ``;
        input = `
            <link rel="stylesheet" href="../styles/circularSlider.css" />
            <div class="SVGcontainer">
                <svg xmlns="http://www.w3.org/2000/svg" id="circularSliderRoot" width="700" height="700" viewBox="-200 -200 400 400">`;
        for (let i = 0; i < this.options.length; i++) {
            input += `<circle cx="0" cy="0" r=${this.options[i].radius} fill="none" class="dashed-circle" transform="rotate(-90)" style="stroke-width: 20px; stroke-dasharray: 5, 2;"></circle>
                    <circle cx="0" cy="0" r=${this.options[i].radius} fill="none" class="circle-path" transform="rotate(-90)" stroke-dasharray="110 628.3185307179587" stroke-dashoffset="0" style="stroke: ${this.options[i].color}; stroke-width: 20px;"></circle>
                    <circle cx="0" cy="0" r=${this.options[i].radius} fill="none" class="invisible-layer" style="stroke-width: 20px; stroke: transparent;"></circle>
                    <circle cx="0" cy=${-this.options[i].radius} r=${this.additionalOptions.smallCircleRadius} fill="#fff" class="small-circle" style="transform: rotate(180deg); transition: all 0.5s ease-in-out 0s;"></circle>`;
        }
        input += ` </svg>
            </div>`;

        template.innerHTML = input;

        this.SVGlocation.appendChild(template.content.cloneNode(true));
           
    }

}

export default CircularSlider;