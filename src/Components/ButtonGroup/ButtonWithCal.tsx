import React, {Component} from "react";
import convertDate from "../../Services/convert-date.service";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import DatePicker from "./DatePicker";
import PopUp from "../PopUp/PopUp";

interface Props {
    updateCategory: any,
    updateVersion: any,
    selectedLanguage: any,
    language: string,
    showHideCal: boolean,
    date : string,
    name: string,
    label: string,
    fullLabel: string,
    select: any,
    active: string
}

interface IButtonWithCal {
    disabledCategory: string,
    showPopUp: boolean
}

/**
 * creates a button with a calender
 * @component
 */
class ButtonWithCal extends Component<Props,IButtonWithCal>{

    constructor(props) {
        super(props);
        this.state = {
            disabledCategory: "",
            showPopUp: false
        }
    }

    /**
     * If a category get clicked update the state
     * @param category
     */
    handleCategoryClick(category) {
        const BUTTON = document.getElementById(category);
        if(!BUTTON.classList.contains("disabled")) {
            this.props.select(this.props.name, convertDate(new Date().toDateString()))
        } else {
            this.setState({showPopUp: true})
            this.setState({disabledCategory: category})
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
     * renders the ButtonWithCal
     * @returns {JSX.Element}
     */
    render(){
        return(
                <div key={"buttonwithCal div 0"} id={"cal"}>
                    <PopUp
                        language={this.props.language}
                        version={""}
                        selectedVersion={this.props.updateVersion}
                        selectedLanguage={this.props.selectedLanguage}
                        category={this.state.disabledCategory}
                        selectedCategory={this.props.updateCategory}
                        show={this.state.showPopUp}
                        updateValue={this.updatePopUp}
                    />
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={this.renderTooltip}
                    >
                    <button
                        id={this.props.name}
                        key={"buttonwithcal " + this.props.name}
                        name={this.props.name}
                        className={this.getClassName()}
                        onClick={() =>{
                            this.handleCategoryClick(this.props.name)
                        }}>
                        {this.props.label}
                    </button>
                    </OverlayTrigger>
                        {this.props.showHideCal && (this.props.active === this.props.name) &&

                        <DatePicker
                                activeDate = {this.props.date}
                                setDate={(date) => {
                                    this.props.select(this.props.name, date)
                                }}
                            />
                        }
                </div>
                )}

}
export default ButtonWithCal;
