const isNumericInput = (event) => {
    const key = event.keyCode;
    return ((key >= 48 && key <= 57) || // Allow number line
        (key >= 96 && key <= 105) // Allow number pad
    );
};

const isModifierKey = (event) => {
    const key = event.keyCode;
    return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
        (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
        (key > 36 && key < 41) || // Allow left, up, right, down
        (
            // Allow Ctrl/Command + A,C,V,X,Z
            (event.ctrlKey === true || event.metaKey === true) &&
            (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
        )
};

const enforceFormat = (event) => {
    // Input must be of a valid number format or a modifier key, and not longer than eleven digits
    if (!isNumericInput(event) && !isModifierKey(event)) {
        event.preventDefault();
    }
};

const formatToPhone = (event) => {
    if (isModifierKey(event)) {
        return;
    }

    const input = event.target.value.replace(/\D/g, '').substring(0, 11); // First eleven digits of input only
    const areaCode = input.substring(0, 2);
    const firstDigit = input.substring(2, 3);
    const middle = input.substring(3, 7);
    const last = input.substring(7, 11);

    if (input.length > 7) {
        event.target.value = `(${areaCode}) ${firstDigit} ${middle}-${last}`;
    } else if (input.length > 3) {
        event.target.value = `(${areaCode}) ${firstDigit} ${middle}`;
    } else if (input.length > 2) {
        event.target.value = `(${areaCode}) ${firstDigit}`;
    } else if (input.length > 0) {
        event.target.value = `(${areaCode}`;
    }
};

const inputElement = document.getElementById('phoneNumber');
if (inputElement) {
    inputElement.addEventListener('keydown', enforceFormat);
    inputElement.addEventListener('input', formatToPhone);
}


const formatToCurrency = (event) => {
    if (isModifierKey(event)) {
        return;
    }

    const input = event.target.value.replace(/[^\d]/g, ''); // Remove all non-numeric characters
    if (input === '') {
        event.target.value = ''; // If the input is empty, leave it empty
    } else {
        const number = parseInt(input, 10) / 100; // Convert to a number and divide by 100 to handle cents
        event.target.value = number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); // Format as Brazilian currency
    }
};

const priceNumber = document.getElementById('priceNumber');
if (priceNumber) {
    priceNumber.addEventListener('keydown', enforceFormat);
    priceNumber.addEventListener('input', formatToCurrency);
}


const formatTensToBRL = (event) => {
    if (isModifierKey(event)) {
        return;
    }
    const checkNumber = event.target.value.split(',');
    if (checkNumber[0] === '') {
        event.target.value = '0,00';
    } else {
        const numberBackspace = checkNumber[1].length === 1;
        if (numberBackspace) {
            const input = event.target.value.split(',0');

            if (input[0].length === 1) {
                event.target.value = `0,00`;
            } else {
                const numberSplited = input[0].replace('.', '').replace(',', '').split('');
                numberSplited.pop();
                const joinAllNumber = numberSplited.join('');
                const newNumber = parseInt(joinAllNumber + '00', 10) / 100;
                const numberFormated = newNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                event.target.value = numberFormated.replace('R$ ', '');
            }
        } else {
            const input = event.target.value.split(',00');
            if (input[0].length < 7) {
                const numberJoin = input[0].replace('.', '').replace(',', '') + input[1];
                const newNumber = parseInt(numberJoin + '00', 10) / 100;
                const numberFormated = newNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                event.target.value = numberFormated.replace('R$ ', '');
            } else {
                const numberJoin = input[0].replace('.', '').replace(',', '');
                const newNumber = parseInt(numberJoin + '00', 10) / 100;
                const numberFormated = newNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                event.target.value = numberFormated.replace('R$ ', '');
            }
        }
    }
};

const priceWithoutCents = document.getElementById('input-price');
if (priceWithoutCents) {
    priceWithoutCents.addEventListener('keydown', enforceFormat);
    priceWithoutCents.addEventListener('input', formatTensToBRL);
}