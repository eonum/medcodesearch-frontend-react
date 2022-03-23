const lookup = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1
};

export const MIN_DECIMAL_VALUE = 1;
export const MAX_DECIMAL_VALUE = 3999;
export const MIN_ROMAN_VALUE = toRoman(MIN_DECIMAL_VALUE);
export const MAX_ROMAN_VALUE = toRoman(MAX_DECIMAL_VALUE);

export function isRomanNumberValid(romanNumber) {
    return /^(?=[MDCLXVI])(M{0,3})(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/.test(
        romanNumber
    );
}

export function isDecimalNumberValid(decimalNumber) {
    return (
        /^\d+$/.test(decimalNumber) &&
        decimalNumber >= MIN_DECIMAL_VALUE &&
        decimalNumber <= MAX_DECIMAL_VALUE
    );
}

export function toDecimal(romanNumber) {
    return toDecimalRecursion(romanNumber, 0);
}

export function toDecimalRecursion(romanNumber, decimalValue) {
    for (let key in lookup) {
        const value = lookup[key];
        if (romanNumber.indexOf(key) === 0) {
            decimalValue = value + toDecimalRecursion(romanNumber.substr(key.length), decimalValue);
            return decimalValue;
        }
    }
    return decimalValue;
}

export function toRoman(decimalValue) {
    let romanNumber = "";
    for (let i in lookup) {
        while (decimalValue >= lookup[i]) {
            romanNumber += i;
            decimalValue -= lookup[i];
        }
    }
    return romanNumber;
}
