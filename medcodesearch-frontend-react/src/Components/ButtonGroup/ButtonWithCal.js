import React, {Component} from "react";
import Popup from "reactjs-popup";
import {Button, FormGroup} from "react-bootstrap";
import calendarLogo from "../../assets/calendar.png";
import Calendar from "react-calendar";
import BootstrapDatePickerComponent from "./BootstrapDatePickerComponent";

/**
 * creates a button with a calender
 * @component
 */
class ButtonWithCal extends Component{

    /**
     * renders the ButtonWithCal
     * @returns {JSX.Element}
     */
    render(){
            return(
                <div key={"buttonwithCal div 0"} id={"cal"}>
                    <button
                        key={"buttonwithcal " + this.props.name}
                        name={this.props.name}
                        className={this.props.name === this.props.active ? "customButton active" : "customButton" }
                        onClick={() =>{
                            this.props.select(this.props.name, '')
                        }}>
                        {this.props.name}
                    </button>
                        {this.props.showHideCal && (this.props.active === this.props.name) &&
                            <BootstrapDatePickerComponent
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
