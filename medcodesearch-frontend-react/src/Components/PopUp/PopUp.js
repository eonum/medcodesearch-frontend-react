import {useNavigate, useParams} from "react-router-dom";
import {Component} from "react";
import "./PopUp.css"
import {Button, Modal} from "react-bootstrap";
import deJson from "../../assets/translations/de.json";
import frJson from "../../assets/translations/fr.json";
import itJson from "../../assets/translations/it.json";
import enJson from "../../assets/translations/en.json";
import {convertCategoryToCatalog, languages} from "../../Services/category-version.service";

class PopUp extends Component{
    constructor() {
        super();
        this.state = {
            show: false,
            translateJson: "",
            availableLanguages: ['de']
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
        if(prevProps.version !== this.props.version ||
            prevProps.category !== this.props.category) {
            this.setState({availableLanguages: ['de']})
            this.findAvailableLanguages()
        }

        if(prevProps.show !== this.props.show) {
            this.handleShow(this.props.show)
        }
        if(prevProps.language !== this.props.language) {
            this.setState({translateJson: this.findJson(this.props.language)})
        }
    }
    findAvailableLanguages() {
        let catalog = convertCategoryToCatalog(this.props.category)
        for(let lang of languages) {
            if(lang !== this.props.language && lang !== 'de') {
                fetch(`https://search.eonum.ch/` + lang + "/" + catalog + "/versions")
                    .then((res) => res.json())
                    .then((json) => {
                        if(json.includes(this.props.version)) {
                            this.setState({availableLanguages: [...this.state.availableLanguages, lang]})
                        }
                    })
            }
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
                <Modal size="sm" show={this.state.show} onHide={() => this.handleShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="pull-left">{this.state.translateJson['LBL_SELECT_LANGUAGE']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.state.translateJson['LBL_CATALOG_LANGUAGE_NOT_AVAILABLE']}</Modal.Body>
                    <Modal.Footer className="modal-footer">
                        <button className="customButton back" onClick={() => this.handleShow(false)}>
                            {this.state.translateJson['LBL_BACK']}
                        </button>
                        {this.state.availableLanguages.map((language, i) => (
                            <button key={i} className="customButton" onClick={() => this.handleShow(false)}>
                                {language}
                            </button>
                        ))}
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
