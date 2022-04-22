import React, {Component} from "react";
import Popup from "reactjs-popup";
import {Button, FormGroup} from "react-bootstrap";
import calendarLogo from "../../assets/calendar.png";
import Calendar from "react-calendar";
import BootstrapDatePickerComponent from "./BootstrapDatePickerComponent";

class ButtonWithCal extends Component{

    render(){
            return(
                <div id={"cal"}>
                    <button
                        key={this.props.index}
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
