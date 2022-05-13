import React from 'react'
import { Form } from 'react-bootstrap';
import ConvertDate from "../../Services/ConvertDate";
import "./DatePicker.css"

class DatePicker extends React.Component{

    called = false;

    constructor(props) {
        super(props);
        this.called = false
        this.updateDate = this.updateDate.bind(this);
    }

    updateDate(value) {
        this.props.setDate(ConvertDate(value));
    }

    getDate() {
        if (!this.called) {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            const yyyy = today.getFullYear();

            this.called = true
            return yyyy + '-' + mm + '-' + dd;
        }
    }

render(){
    return(
            <div key={"datepicker div 0"} id={"text"}>
                <div key={"datepicker div 1"} className="row">
                    <div key={"datepicker div 2"} className="col">
                        <Form.Group controlId="form">
                            <Form.Control
                                className="datepicker"
                                type="date"
                                name="form"
                                value={this.getDate()}
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
