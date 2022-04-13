import React from 'react'
import { Form } from 'react-bootstrap';
class BootstrapDatePickerComponent extends React.Component{

    render(){

        return(
            <div>
                <div className="row">
                    <div className="col">
                        <Form.Group controlId="dob">
                            <Form.Control type="date" name="dob" /*onChange={this.props.setDate(this)}*/ />
                        </Form.Group>
                    </div>
                </div>
            </div>
        )
    }

}

export default BootstrapDatePickerComponent;