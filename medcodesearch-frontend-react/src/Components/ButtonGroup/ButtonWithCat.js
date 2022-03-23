import {Component} from "react";
import Popup from "reactjs-popup";
import {Button} from "react-bootstrap";
import calendarLogo from "../../assets/calendar.png";
import Calendar from "react-calendar";

class ButtonWithCat extends Component{

    render(){
            return(<div>
                <Button
                    key={this.props.index}
                    name={this.props.name}
                    className={this.props.name === this.props.active ? "customButton active" : "customButton" }
                    onClick={() =>{
                        this.props.select(this.props.name)
                    }}>
                    {this.props.name}
                </Button>
                </div>
                )}

}
export default ButtonWithCat;