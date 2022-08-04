import React from 'react'
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
    isMobile: boolean,
    selectedCatalog: string,
    selectedDate: string,
    setDate: { (date: string): void }
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
        this.setState({showCalendar: false})
        this.setState({currentDate: new Date(date).toLocaleDateString("uk-Uk")})
        this.props.setDate(date.toLocaleDateString("uk-Uk"));
    }

    /**
     * Render the DatePicker.
     * @returns {JSX.Element}
     */
    render() {
        // TODO: check if this view variable should be used or deleted...
        // let view = this.props.isMobile ? '_mobile' : '_desktop';
        return (
            <ReactDatePicker
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
