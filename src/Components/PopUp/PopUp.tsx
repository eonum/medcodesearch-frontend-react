import React, {Component} from "react";
import "./PopUp.css"
import {Modal} from "react-bootstrap";
import {convertCatalogToResourceType, languages} from "../../Services/catalog-version.service";
import {fetchURL} from "../../Utils";
import {IUpdateStateByArg} from "../../interfaces";
import {useTranslation} from "react-i18next";

interface Props {
    language: string,
    changeLanguage: IUpdateStateByArg,
    selectedVersion: IUpdateStateByArg,
    changeSelectedButton: IUpdateStateByArg,
    show: boolean
    updatePopUpState: { (boolean_value: boolean): void },
    version: string,
    catalog: string
    translation: any
}

interface IPopUp {
    show: boolean,
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
        this.props.updatePopUpState(value)
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
            prevProps.catalog !== this.props.catalog) {
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
        if(this.props.catalog === "AL" || this.props.catalog === "DRUG" || this.props.catalog === "MIGEL") {
            this.setState({availableLanguages: ["de", "fr", "it"]})
        } else {
            let ressource_type = convertCatalogToResourceType(this.props.catalog)
            for(let lang of languages) {
                if(lang !== this.props.language && lang !== 'de') {
                    await fetch([fetchURL, lang, ressource_type, 'versions'].join("/"))
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
     * Handles the action after click on a disabled language.
     * @param language
     */
    handleLanguageClick(language) {
        this.handleShow(false)
        this.props.changeLanguage(language)
        this.props.selectedVersion(this.props.version)
        this.props.changeSelectedButton(this.props.catalog)
    }

    /**
     * Render the PopUp component
     * @returns {JSX.Element}
     */
    render() {
        const {t} = this.props.translation
        return (
            <>
                <Modal size="sm" show={this.state.show} onHide={() => this.handleShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="pull-left">{t('LBL_SELECT_LANGUAGE')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{t('LBL_CATALOG_LANGUAGE_NOT_AVAILABLE')}</Modal.Body>
                    <Modal.Footer>
                            <button className="PopUpBtn" onClick={() => this.handleShow(false)}>
                                {t('LBL_BACK')}
                            </button>
                        <div className="float-end">
                        {this.state.availableLanguages.map((language, i) => (
                            <button key={i} className="PopUpBtn" onClick={() => this.handleLanguageClick(language)}>
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
function addProps(Component) {
    return props => <Component {...props} translation={useTranslation()}/>;
}

export default addProps(PopUp);
