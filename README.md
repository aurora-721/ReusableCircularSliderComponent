# Javascript circular slider component

## Introduction

This code represents the solution for a reusable circular slider component. The code works on Google Chrome, Firefox and the latest version of Edge.
This code utilizes web components that build on the Shadow DOM.

![Slider Multiple](/pictures/example1.JPG)

## Making the code work

To make the code work run following commands on the command prompt:

### Clone git repository

First clone the git repository

```sh
$ git clone https://github.com/hausos/ReusableCircularSliderComponent.git
```

### Installation

Install the dependencies

```sh
$ npm install
```

### Serve

To serve in the browser - Runs webpack-dev-server

```sh
$ npm start
```

### Build

Compile and build

```sh
$ npm run build
```

## Modifying the code

All the styling and functionality can be changed in the files:

- `index.html`
- `app.css`
- `app.js`

`index-one.html` features all the possible attributes you can change.

![Slider One](/pictures/example2.JPG)

You can implement the HTML component by simply adding the circular-slider component in your HTML file.

```html
<circular-slider
  container="put_element_here"
  options='[
      {
        "color": "#22a823",
        "labelID": "Test",
        "minVal": 500,
        "maxVal": 9000,
        "value": 3400,
        "step": 100,
        "radius": 100
      }
      ]'
  additional_options='{
        "dashedCircleWidth": "30",
        "smallCircleRadius": "18",
        "strokeWidth": "30"
      }'
>
</circular-slider>
```

## Descriptions of the possible attributes

### Container

The container attribute is reserved for the placement of the slider component anywhere else inside your HTML document. If omitted the circular slider will be placed where it was originally written.

### Options

This is an array of objects that is parsed with JSON.
When implementing be careful how you write the object so that the JSON doesn't throw any errors.

| Options | Type    | Default | Description                                                                                                                                                            |
| ------- | ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| color   | string  | #005    | Progress bar color.                                                                                                                                                    |
| labelID | string  | none    | The ID of the location where the change in value of the slider will be displayed. Have a look at `index.html` or `index-one.html` to see how it should be implemented. |
| minVal  | integer | 1       | Minimum value that can be set.                                                                                                                                         |
| maxVal  | integer | 220     | Maximal value that can be set.                                                                                                                                         |
| value   | integer | 51      | The default initial value of the slider when the browser starts.                                                                                                       |
| step    | integer | 1       | The minimal step between two values - e.g. min = 0, max = 100, step = 10 - user can move between multiples of 10 between 0 and 100.                                    |
| radius  | integer | 50      | The slider will adjust to the size of the container automatically. Radius 200 means slider will be touching the boundaries.                                            |

### Additional options

This attribute can be omitted.
You can put an Object of following values if you want to change the default options:

| Options           | Type    | Default | Description                                                           |
| ----------------- | ------- | ------- | --------------------------------------------------------------------- |
| dashedCircleWidth | integer | 20      | Changes the width of the dashed circle underneath.                    |
| smallCircleRadius | integer | 12      | Changes the radius of the small circle handle of the circular slider. |
| strokeWidth       | integer | 20      | Changes the width of the path of the slider                           |

## Modifying the code

If you don't want to use HTML elements or want to modify the code independently, you can import `circularSlider.js` which consists of a class CircularSlider that makes a unique instance of a circular slider component.

To freely use this class you have to provide a div container element where the svg element is going to be created. Store it inside `CircularSlider.svg` which will be present accross all instances of CircularSlider.
For create more than one modify this code:

```javascript
//set div element
const containerElement = document.createElement("div");
containerElement.setAttribute("class", "SVGcontainer");

CircularSlider.svg = containerElement;
this.options.forEach((option) => {
  new CircularSlider(option, this.additionalOptions);
});

this.container.appendChild(containerElement);
```

## More Info

### Author

Aurora Makovac

### License

This project is licensed under the MIT License
