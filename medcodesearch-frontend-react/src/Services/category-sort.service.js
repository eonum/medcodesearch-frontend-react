/**
 * Sort the categorys numeric
 * @param json
 * @returns {*}
 * @constructor
 */
function CategorySortService(json) {
    var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
    return json.sort(collator.compare)
}

export default CategorySortService
