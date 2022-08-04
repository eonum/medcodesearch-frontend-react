import React, {Component} from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import DatePicker from "./DatePicker";
import PopUp from "../PopUp/PopUp";
import {IUpdateStateByArg} from "../../interfaces";

interface Props {
    selectedCatalog: string
    changeSelectedButton: IUpdateStateByArg,
    changeSelectedVersion: IUpdateStateByArg,
    changeLanguage: IUpdateStateByArg,
    language: string,
    showHideCal: boolean,
    selectedDate : string,
    name: string,
    label: string,
    fullLabel: string,
    select: {(btn: string, date: string): void},
    active: string
}

interface IButtonUnversionized {
    disabledCatalog: string,
    showPopUp: boolean
}

/**
 * creates a button with a calender
 * @component
 */
class ButtonUnversionized extends Component<Props,IButtonUnversionized>{
    constructor(props) {
        super(props);
        this.state = {
            disabledCatalog: "",
            showPopUp: false
        }
    }

    /**
     * Updates the state if a catalog gets clicked.
     * @param catalog
     */
    handleCatalogClick(catalog) {
        const button = document.getElementById(catalog);
        if(!button.classList.contains("disabled")) {
            this.props.select(this.props.name, new Date().toLocaleDateString("uk-Uk"))
        } else {
            this.setState({showPopUp: true})
            this.setState({disabledCatalog: catalog})
        }
    }

    /**
     * update the tooltip
     * @param props
     * @returns {JSX.Element}
     */
    renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {this.props.fullLabel}
        </Tooltip>
    );

    /**
     * Returns the class name
     * @returns {string}
     */
    getClassName() {
        let classname = "customButton"
        if(this.props.name.toUpperCase() === this.props.active.toUpperCase()) {
            classname += " activeCatalog"
        }
        if(this.props.language === "en") {
            classname += " disabled"
        }
        return classname
    }

    /**
     * updates the showPopUp state
     * @param value
     */
    updatePopUp = (value) => {
        this.setState({showPopUp: value})
    }

    /**
     * renders the ButtonUnversionized
     * @returns {JSX.Element}
     */
    render(){
        return(
                <div key={"button_unversionized"} id={"cal"}>
                    <PopUp
                        language={this.props.language}
                        version={""}
                        selectedVersion={this.props.changeSelectedVersion}
                        changeLanguage={this.props.changeLanguage}
                        catalog={this.state.disabledCatalog}
                        changeSelectedButton={this.props.changeSelectedButton}
                        show={this.state.showPopUp}
                        updatePopUpState={this.updatePopUp}
                    />
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={this.renderTooltip}
                    >
                    <button
                        id={this.props.name}
                        key={"button_unversionized_" + this.props.name}
                        name={this.props.name}
                        className={this.getClassName()}
                        onClick={() =>{
                            this.handleCatalogClick(this.props.name)
                        }}>
                        {this.props.label}
                    </button>
                    </OverlayTrigger>
                        {this.props.showHideCal && (this.props.active === this.props.name) &&
                        <DatePicker
                            isMobile={false}
                            selectedCatalog={this.props.selectedCatalog}
                            selectedDate= {this.props.selectedDate}
                            setDate={(date) => {
                                this.props.select(this.props.name, date)
                            }}
                        />
                        }
                </div>
                )}

}
export default ButtonUnversionized;
