/**
 * Sorts the code numeric
 * @param codes
 * @returns {*}
 * @constructor
 */
function CodeSortService(codes) {
    codes = codes.slice().sort((a,b) => a.code - b.code);
    return codes
}

export default CodeSortService