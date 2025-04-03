const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let currentValue = '';
let previousValue = '';
let operator = '';
let resetDisplay = false;

// Initialize the calculator
function initialize() {
    display.textContent = '0';
    currentValue = '';
    previousValue = '';
    operator = '';
    resetDisplay = false;
}

// Handle display formatting
function formatDisplay(value) {
    // Prevent display overflow
    if (value.length > 10) {
        return parseFloat(value).toExponential(5);
    }
    return value;
}

// Evaluate the expression
function evaluate() {
    if (!previousValue || !currentValue) return;
    
    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    
    switch(operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Handle division by zero
    if (!isFinite(result)) {
        display.textContent = 'Error';
        initialize();
        return;
    }
    
    result = result.toString();
    currentValue = result;
    display.textContent = formatDisplay(result);
    
    // Reset for next calculation
    previousValue = '';
    operator = '';
    resetDisplay = true;
}

// Event listeners for all buttons
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');

        // Handle trigonometric functions (sin, cos, tan)
        if (value === 'sin' || value === 'cos' || value === 'tan') {
            // Convert current value to number and calculate the trigonometric value
            const number = parseFloat(currentValue);
            if (isNaN(number)) {
                display.textContent = 'Error';
                return;
            }
            let result;
            switch (value) {
                case 'sin':
                    result = Math.sin(number * Math.PI / 180);  // Sin function (degrees)
                    break;
                case 'cos':
                    result = Math.cos(number * Math.PI / 180);  // Cos function (degrees)
                    break;
                case 'tan':
                    result = Math.tan(number * Math.PI / 180);  // Tan function (degrees)
                    break;
            }
            currentValue = result.toFixed(5);  // Limit to 5 decimal places
            display.textContent = formatDisplay(currentValue);
            resetDisplay = true;
        }
        // Handle operators
        else if (button.classList.contains('operator')) {
            // Allow chaining calculations
            if (previousValue && currentValue) {
                evaluate();
            }
            operator = value;
            previousValue = currentValue;
            resetDisplay = true;
        }
        // Handle equal sign
        else if (button.id === 'equal') {
            evaluate();
        }
        // Handle clear button
        else if (button.id === 'clear') {
            initialize();
        } 
        // Handle numbers and symbols
        else {
            if (currentValue === '0' || resetDisplay) {
                currentValue = value;
                resetDisplay = false;
            } else {
                currentValue += value;
            }
            display.textContent = formatDisplay(currentValue);
        } 
    });
});

// Initialize on load
initialize();

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        // Simulate clicking the corresponding number/decimal button
        document.querySelector(`.btn[data-value="${e.key}"]`).click();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        // Simulate clicking the corresponding operator button
        document.querySelector(`.btn[data-value="${e.key}"]`).click();
    } else if (e.key === 'Enter' || e.key === '=') {
        // Simulate clicking the equal button
        document.getElementById('equal').click();
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        // Simulate clicking the clear button
        document.getElementById('clear').click();
    }
});
