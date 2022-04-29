import React, {Component} from "react";
import Popup from "reactjs-popup";
import {Button, FormGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import calendarLogo from "../../assets/calendar.png";
import Calendar from "react-calendar";
import DatePicker from "./DatePicker";

/**
 * creates a button with a calender
 * @component
 */
class ButtonWithCal extends Component{

    renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {this.props.fullLabel}
        </Tooltip>
    );

    /**
     * renders the ButtonWithCal
     * @returns {JSX.Element}
     */
    render(){
            return(
                <div key={"buttonwithCal div 0"} id={"cal"}>
                    <OverlayTrigger
                        delay={{ show: 250, hide: 400 }}
                        overlay={this.renderTooltip}
                    >
                    <button
                        key={"buttonwithcal " + this.props.name}
                        name={this.props.name}
                        className={this.props.name === this.props.active ? "customButton activeCatalog" : "customButton" }
                        onClick={() =>{
                            this.props.select(this.props.name, '')
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
