import {toDecimal, toRoman} from "./RomanDecimalConverterService";

function ICDSortService(array){

    array.map((rom) => {
        rom.code = toDecimal(rom.code)
    })
    array = array.slice().sort((a,b) => a.code - b.code);
    array.map((dez) => {
        dez.code = toRoman(dez.code)
    })
    return array
}

export default ICDSortService
