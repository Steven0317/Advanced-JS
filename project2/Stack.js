/*
*   Basic stack implementation
*   used for kepping track of 
*   directory paths
*/

class Stack {
    
    constructor() {
        this.items = [];
    }

    push(element){
        this.items.push(element);
    }

    pop(){
        if(this.items.length == 0)
            return "Empty Stack";
        return this.items.pop();
    }

    Peek(){
        return this.items[this.items.length - 1];
    }

    isEmpty(){
        return this.items.length == 0;
    }
}

module.exports = Stack;