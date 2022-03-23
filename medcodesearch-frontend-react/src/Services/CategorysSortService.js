import React from "react";

function CategorysSortService(json) {
    var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
    return json.sort(collator.compare)
}

export default CategorysSortService