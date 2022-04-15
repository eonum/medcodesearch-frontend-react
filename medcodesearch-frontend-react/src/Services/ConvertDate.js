import React from "react";

function ConvertDate(value) {
    let year = value.slice(0,4);
    let month = value.slice(5,7);
    let day = value.slice(8,10);
    value = day + '.' + month + '.' + year;
    return value;
}

export default ConvertDate;