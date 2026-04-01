import React, {useState} from 'react'
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from "dateformat";
import { parse } from "date-fns";

interface Props {
    selectedCatalog: string,
    selectedDate: string,
    clickDate: { (date: string): void }
}

/**
 * Creates the Datepicker for MIGEL, AL and Med.
 */
function DatePicker({ selectedCatalog, selectedDate, clickDate }: Props) {
    const [currentDate, setCurrentDate] = useState<Date | null>(
        parse(selectedDate, 'dd.MM.yyyy', new Date())
    );

    /**
     * Update the date saved in the state.
     * @param date
     */
    function handleChange(date: Date) {
        setCurrentDate(date)
        clickDate(dateFormat(date, "dd.mm.yyyy"));
    }

    return (
        <ReactDatePicker
            id={"datepicker"}
            className="form-control"
            selected={currentDate}
            dateFormat="dd.MM.yyyy"
            onChange={handleChange}
        />
    );
}

export default DatePicker;
