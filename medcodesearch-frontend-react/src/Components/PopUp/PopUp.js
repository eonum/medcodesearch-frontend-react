import {useNavigate, useParams} from "react-router-dom";
import {Component} from "react";
import {Button, Modal} from "react-bootstrap";

class PopUp extends Component{
    constructor() {
        super();
        this.state = {
            show: false
        }
    }
    handleShow(value) {
        this.setState({
            show: value
        })
        this.props.updateValue(value)
    }
    componentDidMount() {
        this.handleShow(this.props.show)
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevProps.show !== this.props.show) {
            this.handleShow(this.props.show)
        }
    }


    render() {
        return (
            <>
                <Modal show={this.state.show} onHide={() => this.handleShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleShow(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => this.handleShow(false)}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default function(props) {
    const navigation = useNavigate();
    return <PopUp {...props} params={useParams} navigation={navigation}/>;
}
