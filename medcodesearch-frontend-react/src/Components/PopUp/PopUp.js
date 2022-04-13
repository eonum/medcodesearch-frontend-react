import {useNavigate, useParams} from "react-router-dom";
import {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import deJson from "../../assets/translations/de.json";
import frJson from "../../assets/translations/fr.json";
import itJson from "../../assets/translations/it.json";
import enJson from "../../assets/translations/en.json";

class PopUp extends Component{
    constructor() {
        super();
        this.state = {
            show: false,
            translateJson: ""
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
        this.setState({translateJson: this.findJson(this.props.language)})
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevProps.show !== this.props.show) {
            this.handleShow(this.props.show)
        }
        if(prevProps.language !== this.props.language) {
            this.setState({translateJson: this.findJson(this.props.language)})
        }
    }

    findJson(language) {
        switch (language) {
            case "de":
                return deJson
            case "fr":
                return frJson
            case "it":
                return itJson
            case "en":
                return enJson
        }
    }


    render() {
        return (
            <>
                <Modal className="modal-dialog-centered" show={this.state.show} onHide={() => this.handleShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="pull-left">{this.state.translateJson['LBL_SELECT_LANGUAGE']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.state.translateJson['LBL_CATALOG_LANGUAGE_NOT_AVAILABLE']}</Modal.Body>
                    <Modal.Footer className="modal-footer">
                        <button className="btn btn-default" onClick={() => this.handleShow(false)}>
                            {this.state.translateJson['LBL_BACK']}
                        </button>
                        <button type="button" className="btn btn-default" onClick={() => this.handleShow(false)}>
                            Save Changes
                        </button>
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
