import {toDecimal, toRoman} from "./roman-decimal-converter.service";

/**
 * Sort the ICD numeric while changing from roman to decimal and back
 * @param array
 * @returns {*}
 * @constructor
 */
function IcdSortService(array){
    array.map((rom) => {
        rom.code = toDecimal(rom.code)
    })
    array = array.slice().sort((a,b) => a.code - b.code);
    array.map((dez) => {
        dez.code = toRoman(dez.code)
    })
    return array
}

export default IcdSortService
