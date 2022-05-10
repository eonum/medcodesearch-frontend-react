import {useNavigate, useParams} from "react-router-dom";
import {Component} from "react";
import "./PopUp.css"
import {Modal} from "react-bootstrap";
import deJson from "../../assets/translations/de.json";
import {convertCategoryToCatalog, languages} from "../../Services/category-version.service";
import findJson from "../../Services/findJson";

class PopUp extends Component{
    constructor() {
        super();
        this.state = {
            show: false,
            translateJson: deJson,
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
    }

    async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevProps.version !== this.props.version ||
            prevProps.category !== this.props.category) {
            this.setState({availableLanguages: ['de']})
            await this.findAvailableLanguages()
        }
        if(prevProps.show !== this.props.show) {
            this.handleShow(this.props.show)
        }
    }

    async findAvailableLanguages() {
        if(this.props.category === "AL" || this.props.category === "DRUG" || this.props.category === "MiGeL") {
            this.setState({availableLanguages: ["de", "fr", "it"]})
        } else {
            let catalog = convertCategoryToCatalog(this.props.category)
            for(let lang of languages) {
                if(lang !== this.props.language && lang !== 'de') {
                    await fetch(`https://search.eonum.ch/` + lang + "/" + catalog + "/versions")
                        .then((res) => res.json())
                        .then((json) => {
                            if(json.includes(this.props.version)) {
                                this.setState({availableLanguages: [...this.state.availableLanguages, lang]})
                            }
                        })
                }
            }
        }
    }


    handleLanguageClick(language) {
        this.handleShow(false)
        this.props.selectedLanguage(language)
        this.props.selectedVersion(this.props.version)
        this.props.selectedCategory(this.props.category)
    }

    render() {
        console.log(this.props.category)
        console.log(this.props.version)
        return (
            <>
                <Modal size="sm" show={this.state.show} onHide={() => this.handleShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="pull-left">{findJson(this.props.language)['LBL_SELECT_LANGUAGE']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{findJson(this.props.language)['LBL_CATALOG_LANGUAGE_NOT_AVAILABLE']}</Modal.Body>
                    <Modal.Footer>
                            <button className="customButton" onClick={() => this.handleShow(false)}>
                                {findJson(this.props.language)['LBL_BACK']}
                            </button>
                        <div className="float-end">
                        {this.state.availableLanguages.map((language, i) => (
                            <button key={i} className="customButton langBtn" onClick={() => this.handleLanguageClick(language)}>
                                {language}
                            </button>
                        ))}
                        </div>
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
