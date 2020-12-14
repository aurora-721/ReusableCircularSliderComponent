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

    changePosition() {
        const circle = this.shadowRoot.querySelector('.circle');
        let position = 20;

        circle.style.transform = "rotate(" + position + "deg) translate(20px, 20px)";
        
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.circle').addEventListener('click', () => {
            this.changePosition()
        })
    }
}

window.customElements.define('circular-slider', CircularSlider);

