// For displaying the data in the ui
let current = document.getElementById('currentScreen');
let previous = document.getElementById('previousScreen');

// Creating golbal vaiable and assigning it with empty string
let first = '';
let second = '';
let operator = '';
let results = '';
let changeDisplay = '';
let isTrue = true;
// const duplicateFirst = first;

// For inserting numbers
function dataNumber(num) {
    if(results.length && changeDisplay.length) {
        dataClear();
    }
    if(operator.length > 0) {
        if(previous.innerText.length > 0) {
            previous.innerText = parseFloat(first).toString() + operator;
        }
        if(results) {
            second = '';
        }
        second += num; 
        if(second.length >= 3) {
            current.innerText = parseFloat(second).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return;
        }
            current.innerText = parseFloat(second).toString();
            return;
    } else{
        if(isTrue) {
            if(first.length < 1) {
                previous.innerText = '';
            }
            if(results) {
                first = '';
            }
            first += num;
            if(first.length >= 3) {
                current.innerText = first.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return;
        }
                current.innerText = first;
                return;
        }else{
            first = '';
            first += num;
            current.innerText = first;
            return;
        }
    }
    
}

// For inserting decimal
function dataDecimal(dot) {
    if(results && changeDisplay.length > 0) {
        dataClear();
    }
    if(operator.length > 0) {
        if(second.length < 1) {
            second += '0'+ dot;
            current.innerText = second;
            return;
        } else if(second.includes('.')) {
            current.innerText = second;
            return;
        }else{
            second += dot;
            current.innerText = second
            return;
        }
    } else{
        if(first.length < 1) {
            first += '0'+ dot;
            current.innerText = first;
            return;
        } else if(first.includes('.')) {
            current.innerText = first;
            return;
        }else{
            first += dot;
            current.innerText = first;
            return;
        }
    }
}

// For clearing global values
function clearGlobalVariables() {
    first = '';
    second = '';
    operator = '';
    return;
}

// For clearing all data
function dataClear() {
    first = '';
    second = '';
    operator = '';
    results = '';
    changeDisplay = '';
    current.innerText = '0';
    previous.innerText = '';
    isTrue = true;
    return;
}

// For deleting data
function dataDelete() {
    let remainingValue = '';
    if(results) {
        previous.innerText = '';
        return;
    }
    if(operator.length > 0) {
        if(second.length > 0) {
            remainingValue = parseFloat(second).toString().slice(0, -1);
            second = remainingValue;
            current.innerText =  parseFloat(second).toString();
            return;
        }
    } else {
        remainingValue = first.slice(0, -1);
        if(first.length < 2) {
            first = '0';
        } else {
            first = remainingValue;
        }
        current.innerText = parseFloat(first).toString();
        return;
    }
}

// For calculating
function calculate() {
    switch(operator) {
        case '+':
            results = Number(first) + Number(second);
            break;
        case '-':
            results = Number(first) - Number(second);
            break;
        case '*':
            results = Number(first) * Number(second);
            break;
        case '/':
            results = Number(first) / Number(second);
            break;    
    }
    if(results.toString().indexOf('.') > -1) {
        results = parseFloat(parseFloat(results).toFixed(5).toString()).toString();
        return results;
    } else{
        results = results.toString()
        return results;
    }
}

// For inserting operator
function dataOperator(ope) {
    if(results) {
        first = results.toString();
        operator = ope;
        previous.innerText = parseFloat(first).toString() +  operator;
        // current.innerText = first;
        results = '';
        second = '';
        return;
    } else if(operator.length > 0) {
        if(second.length > 0) {
            let newData = calculate();
            first = newData.toString();
            operator = ope;
            previous.innerText = parseFloat(first).toString() +  operator;
            current.innerText = parseFloat(first).toString();
            second = '';
            results = '';
            return;
        } else {
            operator = ope;
            previous.innerText = parseFloat(first).toString() + operator;
            return;
        }
    } else {
        if(first.length < 1) {
            first = '0';
        }
        operator = ope;
        previous.innerText = parseFloat(first).toString() + operator;
        current.innerText = parseFloat(first).toString();
        return;
    }
}

// For displaying the results when user clicks on the '='
function equals(symbol) {
    if(first.length > 0 && operator.length > 0 && second.length > 0) {
    changeDisplay = calculate();
    }
    if(operator.length > 0 && first.length > 0 && second.length < 1) {
        second = parseFloat(first).toString();
        let newResults = calculate();
        previous.innerText = parseFloat(first).toString() + operator + parseFloat(second).toString() + symbol;
        current.innerText = newResults;
        first = newResults;
        return;
    } else if(changeDisplay.length > 0) {
        previous.innerText = parseFloat(first).toString() + operator + parseFloat(second).toString() + symbol;
        current.innerText = changeDisplay;
        first = changeDisplay;
        // second='';
        return;
    } else{
         if(second.length < 1 && first.length > 0 && operator.length) {
            previous.innerText = parseFloat(first).toString() + symbol;
            second = parseFloat(first).toString();
            return;
        } else {
            if(first.length < 1) {
            first = '0';
            }
            previous.innerText = parseFloat(first).toString() + symbol;
            current.innerText = parseFloat(first).toString();
            isTrue = false;
            return;
        }
    }

}

let isClosed = false;

function hideCalc() {
    document.getElementById('calcDisplay').style.visibility='hidden';
    document.getElementById('buttons').style.visibility='hidden';
}

function showCalc() {
    document.getElementById('calcDisplay').style.visibility='visible';
    document.getElementById('buttons').style.visibility='visible';
}

function closeClac() {
    if(isClosed) {
        document.getElementById('calcDisplay').style.visibility='visible';
        document.getElementById('buttons').style.visibility='visible';
        isClosed = false;
    } else{
        document.getElementById('calcDisplay').style.visibility='hidden';
        document.getElementById('buttons').style.visibility='hidden';
        isClosed = true;
    }
}
