export const template = document.createElement('template');

template.innerHTML = `
    <link rel="stylesheet" href="../styles/circularSlider.css" />
        <svg xmlns="http://www.w3.org/2000/svg" id="circularSliderRoot" width="700" height="700" viewBox="-200 -200 400 400">
            <circle cx="0" cy="0" r="100" fill="none" class="dashed-circle" transform="rotate(-90)" style="stroke-width: 20px; stroke-dasharray: 5, 2;"></circle>
            <circle cx="0" cy="0" r="100" fill="none" class="circle-path" transform="rotate(-90)" stroke-dasharray="110 628.3185307179587" stroke-dashoffset="0" style="stroke: rgb(93, 59, 109); stroke-width: 20px;"></circle>
            <circle cx="0" cy="0" r="100" fill="none" class="invisible-layer" style="stroke-width: 20px; stroke: transparent;"></circle>
            <circle cx="0" cy="-100" r="12" fill="#fff" class="small-circle"style="transform: rotate(30deg); transition: all 0.5s ease-in-out 0s;"></circle>
        </svg>
        
`;