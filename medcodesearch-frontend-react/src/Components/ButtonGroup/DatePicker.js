import React from 'react'
import { Form } from 'react-bootstrap';
import ConvertDateService from "../../Services/convert-date.service";
import "./DatePicker.css"

/**
 * Creates the Datepicker for MIGEL, AL and Med
 */
class DatePicker extends React.Component{

    constructor(props) {
        super(props);
        this.updateDate = this.updateDate.bind(this);
        this.state = {
            currentDate: this.getDate()
        }
    }

    /**
     * update the date saved in the state
     * @param value
     */
    updateDate(value) {
        this.setState({currentDate: value})
        this.props.setDate(ConvertDateService(value));
    }

    /**
     * Returns the date in the correct format
     * @returns {string}
     */
    getDate() {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            const yyyy = today.getFullYear();
            return yyyy + '-' + mm + '-' + dd;
    }

    /**
     * Render the DatePicker
     * @returns {JSX.Element}
     */
    render() {
        return (
            <div key={"datepicker div 0"} id={"text"}>
                <div key={"datepicker div 1"} className="row">
                    <div key={"datepicker div 2"} className="col">
                        <Form.Group controlId="form">
                            <Form.Control
                                className="datepicker"
                                type="date"
                                name="form"
                                value={this.state.currentDate}
                                onChange={(change => {
                                    this.updateDate(change.target.value)
                                })}
                            />
                        </Form.Group>
                    </div>
                </div>
            </div>
        )
    }

}

export default DatePicker;
