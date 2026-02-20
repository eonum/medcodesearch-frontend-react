import React, {useState} from 'react'
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from "dateformat";

interface Props {
    selectedCatalog: string,
    selectedDate: string,
    clickDate: { (date: string): void }
}

/**
 * Creates the Datepicker for MIGEL, AL and Med.
 */
function DatePicker({ selectedCatalog, selectedDate, clickDate }: Props) {
    const [currentDate, setCurrentDate] = useState(selectedDate);
    const [showCalendar, setShowCalendar] = useState(false);

    /**
     * Update the date saved in the state.
     * @param date
     */
    function handleChange(date) {
        let dateString = dateFormat(date, "dd.mm.yyyy")
        setShowCalendar(false)
        setCurrentDate(dateString)
        clickDate(dateString);
    }

    return (
        <ReactDatePicker
            id={"datepicker"}
            className="form-control"
            selected={showCalendar}
            dateFormat="dd.MM.yyyy"
            placeholderText={currentDate}
            onChange={val => { handleChange(val) }}
        />
    );
}

export default DatePicker;
