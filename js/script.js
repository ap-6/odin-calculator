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
        lastExpression : "",
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
    if (calcParts.lastExpression !== "" && calcParts.operator === "") { 
        //for chained expressions
        displayBottom.textContent = calcParts.first;
        displayTop.textContent = calcParts.lastExpression;
    }
    else if (calcParts.operator !== "") {
        //during operator and 2nd value input
        displayBottom.textContent = calcParts.second;
        displayTop.textContent = calcParts.first + calcParts.operator;
    }
    else if (calcParts.operator === "") {
        //during 1st value input
        displayBottom.textContent = calcParts.first;
        displayTop.textContent = "";
    }
    
    //truncate long values
    if (displayTop.textContent.length > 12) {
        displayTop.textContent = "..." + displayTop.textContent.slice(-12);
    }
    if (displayBottom.textContent.length > 9) {
        displayBottom.textContent = "..." + displayBottom.textContent.slice(-9);
    }
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
    else if (NUMBERS.includes(input)) { 
        processNumberInput(input, calcParts);
    } 
    else if (OPERATORS.includes(input) && calcParts.second === "") { //operators
        calcParts.operator = input;
        calcParts.isContinuedString = false;
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
    else if (input === "%") { 
        processPercentage(calcParts);
    }
}

function processPercentage(calcParts) {
    let operand = (calcParts.operator === "") ? "first" : "second";
    if (calcParts.second === "" && calcParts.operator !== "") {
        //edge case: percentage after operator but before 2nd number
        return;
    }
    calcParts.lastExpression = ""; //to clear top text if user %'s the result of expression

    calcParts[operand] = processLength(calcParts[operand] / 100);
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
    else if (calcParts.isContinuedString === true) { 
        //edge case: when using result of previous expression and a new decimal is added,
        //it won't append new decimal, but replace the display with "0."
        calcParts.first = "0.";
        calcParts.isContinuedString = false;
    }
    else {
        calcParts[operand] += ".";
    }

}

function processReset(calcParts) {
    calcParts.first = "0";
    calcParts.second = "";
    calcParts.operator = "";
    calcParts.lastExpression = "";
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

function processNumberInput(input, calcParts) {
    let operand = (calcParts.operator === "") ? "first" : "second";
    
    if (calcParts.isContinuedString === true) { 
        //edge case: when using result of previous expression and a new number is added,
        //it won't append new number, but replace the old one with it
        processReset(calcParts);
        calcParts.first = input;
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
    
    calcParts.lastExpression = calcParts.first + calcParts.operator + calcParts.second;
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
    let decimalIndex = result.toString().indexOf(".");
    let lastIndex = result.toString().length - 1;
    let isBigNumber = result.toString().length > 9;
    let isSmallNumber = Math.abs(result) < 1 && Math.abs(result) > 0;

    //scientific notation for long numbers
    if (isBigNumber || isSmallNumber) { 
        return result.toExponential(2);
    }
    //round decimals
    else if (result.toString().includes(".")) { 
        if(lastIndex - decimalIndex > 2) {
            result = result.toFixed(2);
        }
    }

    return result.toString();
}

runCalculator();
