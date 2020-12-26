class ListComponents {
    constructor() {
        this.amounts = document.querySelectorAll('.amount');
    }

    writeToList(val, index) {
        this.amounts[index].innerHTML = '$' + val;
    }
}


export default ListComponents;