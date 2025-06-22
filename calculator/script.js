class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.scientificMode = false;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetDisplay = false;
    }

    delete() {
        if (this.shouldResetDisplay) {
            this.clear();
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentOperand = '';
            this.shouldResetDisplay = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.showError();
                    return;
                }
                computation = prev / current;
                break;
            case 'pow':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        this.currentOperand = this.roundResult(computation).toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetDisplay = true;
    }

    calculate(func) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        let result;
        
        switch (func) {
            case 'sin':
                result = Math.sin(this.toRadians(current));
                break;
            case 'cos':
                result = Math.cos(this.toRadians(current));
                break;
            case 'tan':
                result = Math.tan(this.toRadians(current));
                break;
            case 'log':
                if (current <= 0) {
                    this.showError();
                    return;
                }
                result = Math.log10(current);
                break;
            case 'ln':
                if (current <= 0) {
                    this.showError();
                    return;
                }
                result = Math.log(current);
                break;
            case 'sqrt':
                if (current < 0) {
                    this.showError();
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'pow2':
                result = Math.pow(current, 2);
                break;
            default:
                return;
        }
        
        this.currentOperand = this.roundResult(result).toString();
        this.shouldResetDisplay = true;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    roundResult(result) {
        // Round to 10 decimal places to avoid floating point errors
        return Math.round((result + Number.EPSILON) * 10000000000) / 10000000000;
    }

    toggleMode() {
        this.scientificMode = !this.scientificMode;
        const scientificButtons = document.getElementById('scientificButtons');
        const modeToggle = document.getElementById('modeToggle');
        
        if (this.scientificMode) {
            scientificButtons.classList.add('active');
            modeToggle.textContent = 'Basic';
        } else {
            scientificButtons.classList.remove('active');
            modeToggle.textContent = 'Scientific';
        }
    }

    showError() {
        this.currentOperand = 'Error';
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetDisplay = true;
        
        const calculator = document.querySelector('.calculator');
        calculator.classList.add('error');
        setTimeout(() => {
            calculator.classList.remove('error');
        }, 500);
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = 
            this.currentOperand === '' ? '0' : this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// Initialize calculator
const previousOperandElement = document.getElementById('previousOperand');
const currentOperandElement = document.getElementById('currentOperand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Update display initially
calculator.updateDisplay();

// Override methods to include display updates
const originalMethods = {
    clear: calculator.clear.bind(calculator),
    delete: calculator.delete.bind(calculator),
    appendNumber: calculator.appendNumber.bind(calculator),
    chooseOperation: calculator.chooseOperation.bind(calculator),
    compute: calculator.compute.bind(calculator),
    calculate: calculator.calculate.bind(calculator)
};

calculator.clear = function() {
    originalMethods.clear();
    this.updateDisplay();
};

calculator.delete = function() {
    originalMethods.delete();
    this.updateDisplay();
};

calculator.appendNumber = function(number) {
    originalMethods.appendNumber(number);
    this.updateDisplay();
};

calculator.chooseOperation = function(operation) {
    originalMethods.chooseOperation(operation);
    this.updateDisplay();
};

calculator.compute = function() {
    originalMethods.compute();
    this.updateDisplay();
};

calculator.calculate = function(func) {
    originalMethods.calculate(func);
    this.updateDisplay();
};

// Keyboard support
document.addEventListener('keydown', function(e) {
    const key = e.key;
    let button = null;
    
    if (key >= '0' && key <= '9') {
        calculator.appendNumber(key);
        button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent === key);
    } else if (key === '.') {
        calculator.appendNumber('.');
        button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent === '.');
    } else if (key === '+') {
        calculator.chooseOperation('+');
        button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent === '+');
    } else if (key === '-') {
        calculator.chooseOperation('-');
        button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent === '-');
    } else if (key === '*') {
        calculator.chooseOperation('×');
        button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent === '×');
    } else if (key === '/') {
        e.preventDefault();
        calculator.chooseOperation('÷');
        button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent === '÷');
    } else if (key === 'Enter' || key === '=') {
        calculator.compute();
        button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent === '=');
    } else if (key === 'Escape') {
        calculator.clear();
        button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent === 'AC');
    } else if (key === 'Backspace') {
        calculator.delete();
        button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent === 'DEL');
    }
    
    // Add visual feedback
    if (button) {
        button.classList.add('button-pressed');
        setTimeout(() => {
            button.classList.remove('button-pressed');
        }, 150);
    }
});

// Add click animation to all buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.add('button-pressed');
        setTimeout(() => {
            this.classList.remove('button-pressed');
        }, 150);
    });
});

// Add power operation for xʸ button
document.addEventListener('DOMContentLoaded', function() {
    const powerButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent === 'xʸ');
    if (powerButton) {
        powerButton.onclick = function() {
            calculator.chooseOperation('pow');
        };
    }
});