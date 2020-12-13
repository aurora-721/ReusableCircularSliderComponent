const template = document.createElement('template');
template.innerHTML = `
    <style>
        .slider-container {
            background-color: #fff;
            padding: 1em;
            margin: 1em;
        }
        .slider {
            width: 20em;
            height: 20em;
            border-radius: 100%;
            border: 1em solid #bbb;
        }
    </style>
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
        this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('circular-slider', CircularSlider);