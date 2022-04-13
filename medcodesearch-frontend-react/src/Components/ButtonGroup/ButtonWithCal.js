import {Component} from "react";
import Popup from "reactjs-popup";
import {Button} from "react-bootstrap";
import calendarLogo from "../../assets/calendar.png";
import Calendar from "react-calendar";

class ButtonWithCal extends Component{

    render(){
            return(
                <div className="catalogButtons d-none d-lg-block">
                    <button
                        key={this.props.index}
                        name={this.props.name}
                        className={this.props.name === this.props.active ? "customButton active" : "customButton" }
                        onClick={() =>{
                            this.props.select(this.props.name)
                        }}>
                        {this.props.name}
                    </button>
                </div>
                )}

}
export default ButtonWithCal;
