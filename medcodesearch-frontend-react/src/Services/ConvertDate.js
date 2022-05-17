/**
 * Convert the date from a text to a integer and gives it back as a date string
 * @param value
 * @returns {*}
 * @constructor
 */
function ConvertDate(value) {
    if (!value.match(/^\d\d.\d\d.\d\d\d\d/)) {
        if (value.match(/^\d\d\d\d-\d\d-\d\d/)) {
            let year = value.slice(0,4)
            let month = value.slice(5,7)
            let day = value.slice(8,12)
            value = day + '.' + month + '.' + year;
        } else {
            function getMonth(slice) {
                switch (slice) {
                    case "jan":
                        return "01"
                    case "feb":
                        return "02"
                    case "mar":
                        return "03"
                    case "apr":
                        return "04"
                    case "mai":
                        return "05"
                    case "jun":
                        return "06"
                    case "jul":
                        return "07"
                    case "aug":
                        return "08"
                    case "sep":
                        return "09"
                    case "oct":
                        return "10"
                    case "nov":
                        return "11"
                    case "dec":
                        return "12"
                    default:
                        return
                }
            }

            let day = value.slice(8, 10);
            let month = getMonth(value.slice(4, 7).toLowerCase());
            let year = value.slice(11, 15);
            value = day + '.' + month + '.' + year;
        }
    }
    return value;
}


export default ConvertDate;