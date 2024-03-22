function add (a, b) { 
    return a + b;
}

function subtract (a, b) {
    return a - b;
}

function multiply (a, b) {
    return a * b;
}

function divide (a, b) {
    return a / b;
}

function operator (first, operator, second) {
    switch (operator) {
        case "+":
            return add(first, second);
            
        case "-":
            return subtract(first, second);
        
        case "*":
            return multiply(first, second);
        
        case "/":
            return divide(first, second);
    }
}

let first;
let second;
let operator;