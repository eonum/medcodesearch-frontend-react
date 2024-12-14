import React, {Component} from "react";
import "./ButtonGroup.css"
import {useParams} from "react-router-dom";
import RouterService from "../../Services/router.service";
import Buttons from "./Buttons";
import {
    IVersions,
    IParamTypes,
    INoArgsFunction,
    IUpdateStateByArg,
    ILabelHash
} from "../../interfaces";
import {currentCatalogsByButton, versionizedCatalogs} from "../../Services/catalog-version.service";
import dateFormat from "dateformat"

interface Props {
    params: IParamTypes,
    initialVersions: IVersions,
    currentVersions: IVersions,
    clickedOnLogo: boolean,
    selectedButton: string,
    version: string,
    reSetClickOnLogo: INoArgsFunction,
    reSetButton: INoArgsFunction,
    changeLanguage: IUpdateStateByArg,
    language: string,
    changeSelectedButton: IUpdateStateByArg,
    changeSelectedVersion: IUpdateStateByArg,
    changeSelectedDate: IUpdateStateByArg,
    labels: ILabelHash,
    buttons: string[]
}

interface IButtons {
    selectedButton: string,
    activeVersion: string,
    currentICD: string,
    currentSwissDRG: string,
    currentCHOP: string,
    currentTARMED: string,
    currentReha: string,
    currentSupplements: string,
    selectedDate: string,
}

/**
 * Responsible for all buttons to render
 * @component
 */
class ButtonGroup extends Component<Props,IButtons>{
    /**
     * Sets the default state values and binds the buttons.
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: RouterService.initializeCatalogFromURL(),
            activeVersion: this.props.params.version,
            currentICD: this.props.initialVersions['ICD'].at(-1),
            currentSwissDRG: this.props.initialVersions['SwissDRG'].at(-1),
            currentCHOP: this.props.initialVersions['CHOP'].at(-1),
            currentTARMED: this.props.initialVersions['TARMED'].at(-1),
            currentReha: this.props.initialVersions['Reha'].at(-1),
            currentSupplements: this.props.initialVersions['Supplements'].at(-1),
            selectedDate: dateFormat(new Date(), "dd.mm.yyyy"),
        }
        this.updateOnButtonClick = this.updateOnButtonClick.bind(this);
    }

    /**
     * Updates the button with the new params.
     * @param version
     * @param btn
     * @param isCalendarType
     * @param date
     */
    // TODO: If choosing different version from different button, should old button version jump back to default or stay where it was?
    //  F.e. if clicking from ICD10-GM-2014 to SwissDRG V9.0, should version button of icd stay at GM-2014 or jump back to GM-2022?
    updateOnButtonClick = (version, btn, isCalendarType, date) => {
        // If empty version, get it using btn.
        // Set
        let selectedVersion;
        if (isCalendarType) {
            selectedVersion = ''
        } else {
            selectedVersion = version === '' ? this.getVersionFromButton(btn) : version;
            // Update currentVersion.
            let currentCatalogs = {}
            currentCatalogs['current' + btn] = selectedVersion
            this.setState(currentCatalogs)
        }

        if (date === ''){
            date = dateFormat(new Date(), "dd.mm.yyyy")
        }
        this.props.changeSelectedDate(date);
        this.setState({selectedButton: btn, activeVersion: selectedVersion});
        this.props.changeSelectedVersion(selectedVersion);
        this.props.changeSelectedButton(btn);
    }

    /**
     * Takes a button name and compares it to the selected button to reset the button.
     * @param btn
     */
    reRender(btn) {
        if (this.state.selectedButton === btn) {
            this.props.reSetButton()
        }
    }

    /**
     * Take a button name and return the version of the button.
     * @param btn
     * @returns {string|string|*}
     */
    getVersionFromButton(btn) {
        let currentVersion = versionizedCatalogs.includes(btn) ? this.state[currentCatalogsByButton[btn]] : ""
        return currentVersion
    }

    /**
     * Sets the catalog version of the state.
     */
    setCurrentVersionBySelectedButton() {
        if (versionizedCatalogs.includes(this.props.selectedButton)) {
            let currentCatalogs = {}
            currentCatalogs['current' + this.props.selectedButton] = this.props.version
            this.setState(currentCatalogs)
        }
    }

    /**
     * Calls setCurrentVersionBySelectedButton() if successful mounted.
     */
    componentDidMount() {
        this.setCurrentVersionBySelectedButton()
    }

    /**
     * Calls setCurrentVersionBySelectedButton() if version has changed or resets if clicked on logo.
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.version !== this.props.version) {
            this.setCurrentVersionBySelectedButton()
        }
        if (this.props.clickedOnLogo){
            this.setState({selectedButton: prevProps.catalog})
            this.props.reSetClickOnLogo()
        }
    }

    /**
     * Render the button group.
     * @returns {JSX.Element}
     */
    render() {
        return (
            <Buttons
                selectedCatalog={this.props.params.catalog}
                initialVersions={this.props.initialVersions}
                selectedDate={this.state.selectedDate}
                version={this.getVersionFromButton(this.state.selectedButton)}
                selectedVersion={this.props.params.version}
                reRender={this.props.clickedOnLogo}
                catalog={this.props.selectedButton}
                language={this.props.language}
                changeLanguage={this.props.changeLanguage}
                changeSelectedVersion={this.props.changeSelectedVersion}
                changeSelectedButton={this.props.changeSelectedButton}
                buttons={this.props.buttons}
                labels={this.props.labels}
                updateOnButtonClick={(version, catalog, isCalendar, date) => {
                    this.updateOnButtonClick(version, catalog, isCalendar, date)
                }}
            />
        )
    }

}

function addProps(Component) {
    return props => <Component {...props} params={useParams()}/>;
}

export default addProps(ButtonGroup);

