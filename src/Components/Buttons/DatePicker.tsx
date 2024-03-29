import React from 'react'
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from "dateformat";

interface Props {
    selectedCatalog: string,
    selectedDate: string,
    clickDate: { (date: string): void }
}

interface IDatePicker {
    currentDate: string
    showCalendar: boolean
}

/**
 * Creates the Datepicker for MIGEL, AL and Med.
 */
class DatePicker extends React.Component<Props,IDatePicker>{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            currentDate: this.props.selectedDate,
            showCalendar: false
        }
    }

    /**
     * Update the date saved in the state.
     * @param value
     */
    /**
     * Update the date saved in the state.
     * @param value
     */
    handleChange(date) {
        let dateString = dateFormat(date, "dd.mm.yyyy")
        this.setState({showCalendar: false})
        this.setState({currentDate: dateString})
        this.props.clickDate(dateString);
    }

    /**
     * Render the DatePicker.
     * @returns {JSX.Element}
     */
    render() {
        return (
            <ReactDatePicker
                id={"datepicker"}
                className="form-control"
                selected={this.state.showCalendar}
                dateFormat="dd.MM.yyyy"
                placeholderText={this.state.currentDate}
                onChange={val => {this.handleChange(val)}}
            />
        );
    }

}

export default DatePicker;
