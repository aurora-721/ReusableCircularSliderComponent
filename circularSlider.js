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
        this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    changeColor() {
        const circle = this.shadowRoot.querySelector('.circle');
        circle.style.backgroundColor = 'red';
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.circle').addEventListener('click', () => {
            this.changeColor()
        })
    }
}

window.customElements.define('circular-slider', CircularSlider);

