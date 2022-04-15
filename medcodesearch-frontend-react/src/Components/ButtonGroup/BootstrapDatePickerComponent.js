import React from 'react'
import { Form } from 'react-bootstrap';
import ConvertDate from "../../Services/ConvertDate";
class BootstrapDatePickerComponent extends React.Component{
    constructor(props) {
        super(props);
        this.updateDate = this.updateDate.bind(this);
    }

    updateDate(value) {
        this.props.setDate(ConvertDate(value));
    }
    render(){

        return(
            <div id={"text"}>
                <div className="row">
                    <div className="col">
                        <Form.Group controlId="dob">
                            <Form.Control
                                type="date"
                                name="dob"
                                placeholder={this.props.activeDate}
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

export default BootstrapDatePickerComponent;