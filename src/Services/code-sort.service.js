import {toDecimal, toRoman} from "./roman-decimal-converter.service";

/**
 * Sort the ICD numeric while changing from roman to decimal and back
 * @param array
 * @returns {*}
 * @constructor
 */
export function IcdSortService(array){
    array.map((rom) => {
        rom.code = toDecimal(rom.code)
    })
    array = array.slice().sort((a,b) => a.code - b.code);
    array.map((dez) => {
        dez.code = toRoman(dez.code)
    })
    return array
}

/**
 * Sorts the code numeric
 * @param codes
 * @returns {*}
 * @constructor
 */
export function CodeSortService(codes) {
    codes = codes.slice().sort((a,b) => a.code - b.code);
    return codes
}
