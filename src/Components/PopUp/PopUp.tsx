import {useNavigate} from "react-router-dom";
import React, {Component} from "react";
import "./PopUp.css"
import {Modal} from "react-bootstrap";
import deJson from "../../assets/translations/de.json";
import {convertCategoryToCatalog, languages} from "../../Services/category-version.service";
import getTranslationHash from "../../Services/translation.service";
import {fetchURL} from "../../Utils";

interface Props {
    language: string,
    selectedLanguage: any,
    selectedVersion: any,
    selectedCategory: any,
    show: boolean
    updateValue: any,
    version: string,
    category: string
}

interface IPopUp {
    show: boolean,
    translateJson: object,
    availableLanguages: string[]
}

/**
 * Pop Up appearing if a non available version selected.
 * Points you out to go back or switch language where the version is available.
 */
class PopUp extends Component<Props, IPopUp>{
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            translateJson: deJson,
            availableLanguages: ['de']
        }
    }

    /**
     * updates the value state
     * @param value
     */
    handleShow(value) {
        this.setState({
            show: value
        })
        this.props.updateValue(value)
    }

    /**
     * Responsible for initial state update
     */
    componentDidMount() {
        this.handleShow(this.props.show)
    }

    /**
     * Looks for update and change the state if needed
     * @param prevProps
     * @param prevState
     * @param snapshot
     * @returns {Promise<void>}
     */
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.version !== this.props.version ||
            prevProps.category !== this.props.category) {
            this.setState({availableLanguages: ['de']})
            await this.findAvailableLanguages()
        }
        if(prevProps.show !== this.props.show) {
            this.handleShow(this.props.show)
        }
    }

    /**
     * Fetch the catalog and looks if there are languages for the selected version
     * @returns {Promise<void>}
     */
    async findAvailableLanguages() {
        if(this.props.category === "AL" || this.props.category === "DRUG" || this.props.category === "MiGeL") {
            this.setState({availableLanguages: ["de", "fr", "it"]})
        } else {
            let catalog = convertCategoryToCatalog(this.props.category)
            for(let lang of languages) {
                if(lang !== this.props.language && lang !== 'de') {
                    await fetch([fetchURL, lang, catalog, 'versions'].join("/"))
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

    /**
     * handle the action after click on a disabled language
     * @param language
     */
    handleLanguageClick(language) {
        this.handleShow(false)
        this.props.selectedLanguage(language)
        this.props.selectedVersion(this.props.version)
        this.props.selectedCategory(this.props.category)
    }

    /**
     * Render the PopUp component
     * @returns {JSX.Element}
     */
    render() {
        return (
            <>
                <Modal size="sm" show={this.state.show} onHide={() => this.handleShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="pull-left">{getTranslationHash(this.props.language)['LBL_SELECT_LANGUAGE']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{getTranslationHash(this.props.language)['LBL_CATALOG_LANGUAGE_NOT_AVAILABLE']}</Modal.Body>
                    <Modal.Footer>
                            <button className="customButton" onClick={() => this.handleShow(false)}>
                                {getTranslationHash(this.props.language)['LBL_BACK']}
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

export default PopUp;
