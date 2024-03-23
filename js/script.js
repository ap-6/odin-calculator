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

function operate (first, operator, second) {
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
function runCalculator() {
    let calcParts = {
        first : "0",
        second : "",
        operator : "",
        isContinuedString : false,
    }
    let displayBottom = document.querySelector("#display-input-bottom");
    let displayTop = document.querySelector("#display-input-top");
    let numbers = document.querySelectorAll(".btn-color-1, .btn-color-2, .btn-color-3");
    numbers.forEach(element => {
        element.addEventListener("click", () => {
            processInput(calcParts, element);
            updateDisplay(displayBottom, displayTop, calcParts);
        });
    });
}

function updateDisplay(displayBottom, displayTop, calcParts) {
    displayBottom.textContent = calcParts.first + 
                                calcParts.operator + 
                                calcParts.second;
}

function processInput(calcParts, element) {
    let input = element.textContent;
    const NUMBERS = "0123456789";
    const OPERATORS = "+-×÷";
    if (input === "AC") { //reset
        processReset(calcParts);
    }
    else if (input === "C") { //backspace
        processBackSpace(calcParts);
    }
    else if (NUMBERS.includes(input) && calcParts.operator === "") { //1st number
        processNumberInput(input, calcParts, "first");
    } 
    else if (OPERATORS.includes(input) && calcParts.second === "") { //operator
        calcParts.operator = input;
        calcParts.isContinuedString = false;
    }
    else if (NUMBERS.includes(input) && calcParts.operator !== "") { //2nd number
        processNumberInput(input, calcParts, "second");
    }
    else if (input === "=" && calcParts.second !== "") { //equals
        processEqualInput(calcParts);
    }
    else if (OPERATORS.includes(input) && calcParts.second !== "") { //stringing operations
        processEqualInput(calcParts);
        calcParts.operator = input;
        calcParts.isContinuedString = false;
    }
    else if (input === ".") {
        processDecimal(calcParts);
    }
}

function processDecimal(calcParts) {
    let operand = (calcParts.operator === "") ? "first" : "second";
    if (calcParts[operand].includes(".")) { 
        //prevents multiple decimals
        return;
    }
    else if (calcParts.second === "" && calcParts.operator !== "") { 
        //for decimal inserts on empty operand
        calcParts.second = "0.";
    }
    else {
        calcParts[operand] += ".";
    }
}

function processReset(calcParts) {
    calcParts.first = "0";
    calcParts.second = "";
    calcParts.operator = "";
    calcParts.isContinuedString = false;
}

function processBackSpace(calcParts) {
    if (calcParts.isContinuedString) {
        //backspace right after a calculation was done
        processReset(calcParts);
    }
    else if (calcParts.first === "0" && calcParts.operator === "") {
        //when only 0 is on display
        return;
    }
    else if (calcParts.operator === "") {
        //backspace for first number
        calcParts.first = calcParts.first.slice(0,-1);
    }
    else if (calcParts.operator !== "" && calcParts.second === "") {
        //backspace for operator
        calcParts.operator = "";
    }
    else if (calcParts.second !== "") {
        //backspace for second number
        calcParts.second = calcParts.second.slice(0,-1);
    }
}

function processNumberInput(input, calcParts, operand) {
    if (calcParts.isContinuedString === true) { 
        //edge case: when using result of previous expression and a new number is added,
        //it won't append new number, but replace the old one with it
        calcParts.first = input;
        calcParts.isContinuedString = false;
    }
    else if(input === "0" && calcParts[operand] === "0") { //prevent 0 spam ex: 000000
        return; 
    }
    else if (input !== "0" && calcParts[operand] === "0") { //remove default 0
        calcParts[operand] = input;
    }
    else {
        calcParts[operand] = calcParts[operand] + input;
    }
}

function processEqualInput(calcParts) {
    let result;
    
    switch (calcParts.operator) {
        case "+":
            result = operate(+calcParts.first, "+", +calcParts.second);
            break;
        case "-":
            result = operate(+calcParts.first, "-", +calcParts.second);
            break;
        case "×":
            result = operate(+calcParts.first, "*", +calcParts.second);
            break;
        case "÷":
            result = operate(+calcParts.first, "/", +calcParts.second);
            break;
    }

    result = processLength(result);

    calcParts.first = result;
    calcParts.second = "";
    calcParts.operator = "";
    calcParts.isContinuedString = true;
}

function processLength(result) {
    if (result === "") {
        return;
    }
    result = +result;
    //round decimals
    if (result.toString().includes(".")) { 
        let decimalIndex = result.toString().indexOf(".");
        let lastIndex = result.toString().length - 1;
        if(lastIndex - decimalIndex > 2) {
            result = result.toFixed(2);
        }
    }
    //scientific notation for long numbers
    if (result.toString().length > 9) { 
        return result.toExponential(2);
    }

    return result.toString();
}

runCalculator();
