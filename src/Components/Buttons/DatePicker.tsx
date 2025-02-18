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
const DatePicker: React.FC<Props> = ({ selectedCatalog, selectedDate, clickDate }) => {
    const [currentDate, setCurrentDate] = useState(selectedDate);
    const [showCalendar, setShowCalendar] = useState(false);

    /**
     * Updates the date on onChange.
     * @param value
     */
    const handleChange = (date: Date) => {
        const dateString = dateFormat(date, "dd.mm.yyyy")
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
            onChange={handleChange}
        />
    );
};

export default DatePicker;
