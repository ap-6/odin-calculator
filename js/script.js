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
function runCalculator() {
    let calc_parts = {
        first : "0",
        second : "",
        operator : "",
    }
    let display = document.querySelector("#display-input-bottom");
    let input;
    let numbers = document.querySelectorAll(".btn-color-1, .btn-color-2, .btn-color-3");
    numbers.forEach(element => {
        element.addEventListener("click", () => {
            input = element.textContent;
            processInput(input, calc_parts, display);
            display.textContent = calc_parts.first + 
                    calc_parts.operator + 
                    calc_parts.second;
        });
    });
}

function processInput(input, calc_parts, display) {
    const NUMBERS = "0123456789";
    const OPERATIONS = "÷×+-";
    if (input === "AC") { //reset
        calc_parts.first = "0";
        calc_parts.second = "";
        calc_parts.operator = "";
    }
    else if (NUMBERS.includes(input) && calc_parts.operator === "") { //1st number
        processNumberInput(input, calc_parts, "first");
    } 
    else if (OPERATIONS.includes(input) && calc_parts.second === "") { //operator
        calc_parts.operator = input;
    }
    else if (NUMBERS.includes(input) && calc_parts.operator !== "") { //2nd number
        processNumberInput(input, calc_parts, "second");
    }
    else if (input === "=" && calc_parts.second !== "") {
        processEqualInput(input, calc_parts);
    }

}

function processNumberInput(input, calc_parts, operand) {
    if(input === "0" && calc_parts[operand] === "0") { //prevent 0 spam ex: 000000
        return; 
    }
    else if (input !== "0" && calc_parts[operand] === "0") { //remove default 0
        calc_parts[operand] = input;
    }
    else {
        calc_parts[operand] = calc_parts[operand] + input;
    }
}

function processEqualInput(input, calc_parts) {
    let result
    //console.log("test " + input);
    switch (calc_parts.operator) {
        case "+":
            result = add(+calc_parts.first, +calc_parts.second);
            break;

        case "-":
            result = subtract(+calc_parts.first, +calc_parts.second);
            break;

        case "×":
            result = multiply(+calc_parts.first, +calc_parts.second);
            break;
        
        case "÷":
            result = divide(+calc_parts.first, +calc_parts.second);
            break;

    }
    calc_parts.first = result.toString();
    calc_parts.second = "";
    calc_parts.operator = "";
}

runCalculator();
