import React, {Component} from "react";
import ButtonVersionized from "./ButtonVersionized";
import ButtonUnversionized from "./ButtonUnversionized";
import "./CatalogButtons.css"
import {useParams} from "react-router-dom";
import convertDate from "../../Services/convert-date.service";
import RouterService from "../../Services/router.service";
import MobileButton from "./MobileButton";
import ConvertDateService from "../../Services/convert-date.service";
import {IVersions, IButtonLabels, IParamTypes, INoArgsFunction, IUpdateStateByArg} from "../../interfaces";
import {currentCatalogsByButton, versionizedCatalogs} from "../../Services/catalog-version.service";

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
    labels: string[],
    fullLabels: string[],
    buttons: IButtonLabels
}

interface ICatalogButtons {
    selectedButton: string,
    activeVersion: string,
    currentICD: string,
    currentSwissDRG: string,
    currentCHOP: string,
    currentTARMED: string,
    selectedDate: string,
    showCalendar: boolean,
    buttons: IButtonLabels,
}

/**
 * Responsible for all buttons to render
 * @component
 */
class CatalogButtons extends Component<Props,ICatalogButtons>{
    /**
     * Sets the default state values and binds the buttons.
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: RouterService.getCatalogFromURL(),
            activeVersion: this.props.params.version,
            currentICD: this.props.initialVersions['ICD'].at(-1),
            currentSwissDRG: this.props.initialVersions['SwissDRG'].at(-1),
            currentCHOP: this.props.initialVersions['CHOP'].at(-1),
            currentTARMED: this.props.initialVersions['TARMED'].at(-1),
            selectedDate: convertDate(new Date().toDateString()),
            showCalendar: false,
            buttons: this.props.buttons,
        }
        this.updateButton = this.updateButton.bind(this);
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
    updateButton = (version, btn, isCalendarType, date) => {
        // If empty version, get it using btn.
        // Set
        let selectedVersion;
        if (isCalendarType) {
            selectedVersion = ''
        } else {
            selectedVersion = version === '' ? this.getVersionFromButton(btn) : version;
            // Update currentVersion.
            let currentCatalogs = {}
            currentCatalogs['current' + btn] = version
            this.setState(currentCatalogs)
        }

        if (date === ''){
            date = ConvertDateService(new Date().toDateString())
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
     * Calls getVersionCategory(), if successful mounted.
     */
    componentDidMount() {
        this.setCurrentVersionBySelectedButton()
    }

    /**
     * Calls getVersionCategory() if version has changed.
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.version !== this.props.version) {
            this.setCurrentVersionBySelectedButton()
        }
        if (this.props.clickedOnLogo){
            this.setState({selectedButton: prevProps.category})
            this.props.reSetClickOnLogo()
        }
    }

    /**
     * Sets the state of the calendar visibility to 'false' or 'true'.
     * @param visible
     */
    updateCalendarVisibility = (visible) => {
        this.setState({showCalendar: visible})
    }

    /**
     * Render the button group.
     * @returns {JSX.Element}
     */
    render() {
        return (
            <div key={"catalog_buttons"}>
                <div key={"catalog_buttons_desktop"} className="d-none d-lg-block">
                    <div key={"catalog_buttons_desktop_0"} className={"alignButtons"}>
                        {
                            // Map versionized buttons, this.state.buttons[0] is the array of versionized buttons,
                            // i.e. ["ICD", "CHOP", "SwissDRG", "TARMED"].
                            this.state.buttons[0].map((btn, index) => (
                                <div key={"catalog_button_" + btn}>
                                    <ButtonVersionized
                                        key={btn}
                                        index={index}
                                        activate={(button) => {
                                            this.updateButton('', button, false, '');
                                            this.updateCalendarVisibility(false);
                                            this.reRender(button)
                                        }}
                                        category={btn}
                                        initialVersions={this.props.initialVersions[btn]}
                                        currentVersions={this.props.currentVersions[btn]}
                                        language={this.props.language}
                                        version={this.getVersionFromButton(btn)}
                                        changeLanguage={this.props.changeLanguage}
                                        changeSelectedVersion={this.props.changeSelectedVersion}
                                        changeSelectedButton={this.props.changeSelectedButton}
                                        selectedVersion={this.props.params.version}
                                        selectedCategory={this.props.selectedButton}
                                        updateVersionizedButton={(version) => {
                                            this.updateButton(version, btn, false, '');
                                        }}
                                    />
                                </div>
                            ), this)}
                        {
                            // Map unversionized buttons, this.state.buttons[1] is the array of unversionized buttons,
                            // i.e. ["MIGEL", "AL", "DRUG"].
                            this.state.buttons[1].map((btn, index) => (
                                <div key={"catalog_button_" + btn}>
                                    <ButtonUnversionized
                                        selectedCatalog={this.props.params.catalog}
                                        changeSelectedButton={this.props.changeSelectedButton}
                                        changeSelectedVersion={this.props.changeSelectedVersion}
                                        changeLanguage={this.props.changeLanguage}
                                        language={this.props.language}
                                        showHideCal={this.state.showCalendar}
                                        date={this.state.selectedDate}
                                        name={btn}
                                        label={this.props.labels[index]}
                                        fullLabel={this.props.fullLabels[index]}
                                        select={(btn, date) => {
                                            this.updateButton('', btn, true, date);
                                            this.updateCalendarVisibility(true);
                                            this.reRender(btn)
                                        }}
                                        active={this.props.selectedButton}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
                <div key={"catalog_buttons_mobile"} className="d-lg-none">
                    <MobileButton
                        selectedCatalog={this.props.params.catalog}
                        initialVersions={this.props.initialVersions}
                        currentVersions={this.props.currentVersions}
                        date ={this.state.selectedDate}
                        version={this.getVersionFromButton(this.state.selectedButton)}
                        selectedVersion={this.props.params.version}
                        reRender={this.props.clickedOnLogo}
                        category={this.props.selectedButton}
                        language={this.props.language}
                        changeLanguage={this.props.changeLanguage}
                        changeSelectedVersion={this.props.changeSelectedVersion}
                        changeSelectedButton={this.props.changeSelectedButton}
                        buttons={this.props.buttons}
                        labels={this.props.labels}
                        updateMobileButton={(version, category, isCalendar, date) => {
                            this.updateButton(version, category, isCalendar, date)
                        }}
                    />
                </div>
            </div>
        )
    }

}

function addProps(Component) {
    return props => <Component {...props} params={useParams()}/>;
}

export default addProps(CatalogButtons);

