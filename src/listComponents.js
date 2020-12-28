class ListComponents {
    constructor() {
        this.amounts = document.querySelectorAll('.amount');
    }

    writeToList(val, option) {
        let div_label = document.querySelector("#" + option.labelID);
        let place_here = div_label.querySelector('.amount');
        place_here.innerHTML = '$' + val;
    }
}


export default ListComponents;