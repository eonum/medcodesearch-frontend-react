import React, {Component} from "react";
import ButtonVersionized from "./ButtonVersionized";
import ButtonUnversionized from "./ButtonUnversionized";
import "./CatalogButtons.css"
import {useParams} from "react-router-dom";
import convertDate from "../../Services/convert-date.service";
import RouterService from "../../Services/router.service";
import MobileButton from "./MobileButton";
import ConvertDateService from "../../Services/convert-date.service";
import {IVersions, IButtonLabels} from "../../interfaces";

interface Props {
    params: any,
    initialVersions: IVersions,
    currentVersions: IVersions,
    clickedOnLogo: boolean,
    category: string,
    version: string,
    reSetClickOnLogo: any,
    reSetButton: any,
    selectedLanguage: any,
    language: string,
    selectedButton: any,
    selectedList: any,
    selectedDate: any,
    labels: string[],
    fullLabels: string[],
    buttons: IButtonLabels
}

interface ICatalogButtons {
    selectedButton: string,
    activeList: string,
    lastICD: string,
    lastDRG: string,
    lastCHOP: string,
    lastTARMED: string,
    selectedDate: string,
    showHideCal: false,
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
            selectedButton: RouterService.getCategoryFromURL(),
            activeList: this.props.params.version,
            lastICD: 'ICD10-GM-2022',
            lastDRG: 'V11.0',
            lastCHOP: 'CHOP_2022',
            lastTARMED: 'TARMED_01.09',
            selectedDate: convertDate(new Date().toDateString()),
            showHideCal: false,
            //TODO: i don't think this is good practice...
            buttons: this.props.buttons,
        }
        this.updateButton = this.updateButton.bind(this);
        this.updateDate = this.updateDate.bind(this);
    }

    /**
     * Updates the button with the new params.
     * @param version
     * @param btn
     * @param isCalendarType
     * @param date
     */
    updateButton = (version, btn, isCalendarType, date) => {
        if (version === '') {
            version = this.getVersion(btn);
        }
        switch (btn) {
            case 'ICD':
                this.setState({lastICD: version});
                break;
            case 'SwissDRG':
                this.setState({lastDRG: version});
                break;
            case 'CHOP':
                this.setState({lastCHOP: version});
                break;
            case 'TARMED':
                this.setState({lastTARMED: version});
                break;
            default:
        }
        if (isCalendarType) {
            version = ''
        }
        if (date === ''){
            date = ConvertDateService(new Date().toDateString())
        }
        this.updateDate(date);
        this.setState({selectedButton: btn, activeList: version});
        this.props.selectedList(version);
        this.props.selectedButton(btn);
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
    getVersion(btn) {
        switch (btn){
            case 'ICD':
                return this.state.lastICD;
            case 'SwissDRG':
                return this.state.lastDRG;
            case 'CHOP':
                return this.state.lastCHOP;
            case 'TARMED':
                return this.state.lastTARMED;
            default:
                return '';
        }
    }

    /**
     * Sets the category of the state.
     */
    getVersionCategory() {
        if(this.props.category === "CHOP") {
            this.setState({lastCHOP: this.props.version})
        } else if(this.props.category === "ICD") {
            this.setState({lastICD: this.props.version})
        } else if(this.props.category === "SwissDRG") {
            this.setState({lastDRG: this.props.version})
        } else if(this.props.category === "TARMED") {
            this.setState({lastTARMED: this.props.version})
        }
    }

    /**
     * Calls getVersionCategory(), if successful mounted.
     */
    componentDidMount() {
        this.getVersionCategory()
    }

    /**
     * Calls getVersionCategory() if version has changed.
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.version !== this.props.version) {
            this.getVersionCategory()
        }
        if (this.props.clickedOnLogo){
            this.setState({selectedButton: prevProps.category})
            this.props.reSetClickOnLogo()
        }
    }

    /**
     * Set selected date in state.
     * @param date
     */
    updateDate = (date) => {
        this.setState({selectedDate: date});
        // TODO: What is this call doing?
        this.props.selectedDate(date);
    }

    /**
     * Sets the state of the calendar visibility to 'false' or 'true'.
     * @param state
     */
    showHideCal = (state) => {
        this.setState({showHideCal: state})
    }

    /**
     * Render the button group.
     * @returns {JSX.Element}
     */
    render() {
        return (
            <div key={"catalog_buttons"}>
                <div key={"catalog_buttons_desktop"} className="d-none d-lg-block">
                    <div key={"catalog_buttons_desktop_1"} className={"alignButtons"}>
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
                                            this.showHideCal(false);
                                            this.reRender(button)
                                        }}
                                        category={btn}
                                        initialVersions={this.props.initialVersions[btn]}
                                        currentVersions={this.props.currentVersions[btn]}
                                        language={this.props.language}
                                        version={this.getVersion(btn)}
                                        selectedLanguage={this.props.selectedLanguage}
                                        updateVersion={this.props.selectedList}
                                        updateCategory={this.props.selectedButton}
                                        selectedVersion={this.props.params.version}
                                        selectedCategory={this.props.category}
                                        chooseV={(version) => {
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
                                        updateCategory={this.props.selectedButton}
                                        updateVersion={this.props.selectedList}
                                        selectedLanguage={this.props.selectedLanguage}
                                        language={this.props.language}
                                        showHideCal={this.state.showHideCal}
                                        date={this.state.selectedDate}
                                        name={btn}
                                        label={this.props.labels[index]}
                                        fullLabel={this.props.fullLabels[index]}
                                        select={(btn, date) => {
                                            this.updateButton('', btn, true, date);
                                            this.showHideCal(true);
                                            this.reRender(btn)
                                        }}
                                        active={this.props.category}
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
                        version={this.getVersion(this.state.selectedButton)}
                        selectedVersion={this.props.params.version}
                        reRender={this.props.clickedOnLogo}
                        category={this.props.category}
                        language={this.props.language}
                        selectedLanguage={this.props.selectedLanguage}
                        updateVersion={this.props.selectedList}
                        updateCategory={this.props.selectedButton}
                        buttons={this.props.buttons}
                        labels={this.props.labels}
                        chooseC={(version, category, isCalendar, date) => {
                            this.updateButton(version, category, isCalendar, date)
                        }}
                    />
                </div>
            </div>
        )
    }

}
export default (props) => (
    <CatalogButtons {...props} params={useParams()} />
)

