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

/**
 * Calls the recursion for calculating a roman number into a decimal
 * @param romanNumber
 * @returns {*}
 */
export function toDecimal(romanNumber) {
    return toDecimalRecursion(romanNumber, 0);
}

/**
 * Calculate a roman number into a decimal
 * @param romanNumber
 * @param decimalValue
 * @returns {*}
 */
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

/**
 * Calculate a decimal number into a roman
 * @param decimalValue
 * @returns {string}
 */
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
