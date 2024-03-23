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
    let calc_parts = {
        first : "0",
        second : "",
        operator : "",
        isContinuedString : false,
    }
    let display_bottom = document.querySelector("#display-input-bottom");
    let display_top = document.querySelector("#display-input-top");
    let numbers = document.querySelectorAll(".btn-color-1, .btn-color-2, .btn-color-3");
    numbers.forEach(element => {
        element.addEventListener("click", () => {
            processInput(calc_parts, element);
            updateDisplay(display_bottom, display_top, calc_parts);
        });
    });
}

function updateDisplay(display_bottom, display_top, calc_parts) {
    display_bottom.textContent = calc_parts.first + 
                                calc_parts.operator + 
                                calc_parts.second;
}

function processInput(calc_parts, element) {
    let input = element.textContent;
    const NUMBERS = "0123456789";
    const OPERATORS = "+-×÷";
    if (input === "AC") { //reset
        processReset(calc_parts);
    }
    else if (input === "C") { //backspace
        processBackSpace(calc_parts);
    }
    else if (NUMBERS.includes(input) && calc_parts.operator === "") { //1st number
        processNumberInput(input, calc_parts, "first");
    } 
    else if (OPERATORS.includes(input) && calc_parts.second === "") { //operator
        calc_parts.operator = input;
        calc_parts.isContinuedString = false;
    }
    else if (NUMBERS.includes(input) && calc_parts.operator !== "") { //2nd number
        processNumberInput(input, calc_parts, "second");
    }
    else if (input === "=" && calc_parts.second !== "") { //equals
        processEqualInput(calc_parts);
    }
    else if (OPERATORS.includes(input) && calc_parts.second !== "") { //stringing operations
        processEqualInput(calc_parts);
        calc_parts.operator = input;
        calc_parts.isContinuedString = false;
    }
}

function processReset(calc_parts) {
    calc_parts.first = "0";
    calc_parts.second = "";
    calc_parts.operator = "";
    calc_parts.isContinuedString = false;
}

function processBackSpace(calc_parts) {
    if (calc_parts.isContinuedString) {
        //backspace right after a calculation was done
        processReset(calc_parts);
    }
    else if (calc_parts.first === "0" && calc_parts.operator === "") {
        //when only 0 is on display
        return;
    }
    else if (calc_parts.operator === "") {
        //backspace for first number
        calc_parts.first = calc_parts.first.slice(0,-1);
    }
    else if (calc_parts.operator !== "" && calc_parts.second === "") {
        //backspace for operator
        calc_parts.operator = "";
    }
    else if (calc_parts.second !== "") {
        //backspace for second number
        calc_parts.second = calc_parts.second.slice(0,-1);
    }
}

function processNumberInput(input, calc_parts, operand, isContinuousString) {
    if (calc_parts.isContinuedString === true) { 
        //edge case: when using result of previous expression and a new number is added,
        //it won't append new number, but replace the old one with it
        calc_parts.first = input;
        calc_parts.isContinuedString = false;
    }
    else if(input === "0" && calc_parts[operand] === "0") { //prevent 0 spam ex: 000000
        return; 
    }
    else if (input !== "0" && calc_parts[operand] === "0") { //remove default 0
        calc_parts[operand] = input;
    }
    else {
        calc_parts[operand] = calc_parts[operand] + input;
    }
}

function processEqualInput(calc_parts) {
    let result;
    
    switch (calc_parts.operator) {
        case "+":
            result = operate(+calc_parts.first, "+", +calc_parts.second);
            break;
        case "-":
            result = operate(+calc_parts.first, "-", +calc_parts.second);
            break;
        case "×":
            result = operate(+calc_parts.first, "*", +calc_parts.second);
            break;
        case "÷":
            result = operate(+calc_parts.first, "/", +calc_parts.second);
            break;
    }
    calc_parts.first = result.toString();
    calc_parts.second = "";
    calc_parts.operator = "";
    calc_parts.isContinuedString = true;
}

runCalculator();
