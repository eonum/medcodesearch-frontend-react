import React from 'react'
import { Form } from 'react-bootstrap';
import ConvertDateService from "../../Services/convert-date.service";
import "./DatePicker.css"

interface Props {
    isMobile: boolean,
    selectedCatalog: string,
    activeDate: string,
    setDate: any
}

interface IDatePicker {
    currentDate: string
}

/**
 * Creates the Datepicker for MIGEL, AL and Med.
 */
class DatePicker extends React.Component<Props,IDatePicker>{

    constructor(props) {
        super(props);
        this.updateDate = this.updateDate.bind(this);
        this.state = {
            currentDate: this.getDate()
        }
    }

    /**
     * Update the date saved in the state.
     * @param value
     */
    updateDate(value) {
        this.setState({currentDate: value})
        this.props.setDate(ConvertDateService(value));
    }

    /**
     * Returns the date in the correct format.
     * @returns {string}
     */
    getDate() {
            const TODAY = new Date();
            const DD = String(TODAY.getDate()).padStart(2, '0');
            const MM = String(TODAY.getMonth() + 1).padStart(2, '0'); //January is 0!
            const YYYY = TODAY.getFullYear();
            return YYYY + '-' + MM + '-' + DD;
    }

    /**
     * Render the DatePicker.
     * @returns {JSX.Element}
     */
    render() {
        let view = this.props.isMobile ? '_mobile' : '_desktop';
        return (
            <div key={"datepicker_0"} id={"datepicker_" + this.props.selectedCatalog + view}>
                <div key={"datepicker_1"} className="row">
                    <div key={"datepicker_2"} className="col">
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
