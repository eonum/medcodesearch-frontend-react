import React from 'react'
import { Form } from 'react-bootstrap';
import ConvertDate from "../../Services/ConvertDate";
import "./DatePicker.css"

class DatePicker extends React.Component{
    constructor(props) {
        super(props);
        this.updateDate = this.updateDate.bind(this);
    }

    updateDate(value) {
        this.props.setDate(ConvertDate(value));
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
                                onChange={(change => {
                                    this.updateDate(change.target.value)
                            })}/>
                        </Form.Group>
                    </div>
                </div>
            </div>
        )
    }

}

export default DatePicker;
