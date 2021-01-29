class ListComponents {
    constructor(options) {
        this.options = options;
    }

    writeToList(val) {
        let div_label = document.querySelector("#" + this.options.labelID);
        let place_here = div_label.querySelector('.amount');
        place_here.innerHTML = '$' + val;
    }
}


export default ListComponents;