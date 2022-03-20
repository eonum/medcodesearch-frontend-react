import {Component} from "react";
import Popup from "reactjs-popup";
import {Button} from "react-bootstrap";
import calendarLogo from "../../assets/calendar.png";
import Calendar from "react-calendar";

class ButtonB extends Component{

    render(){
            return(
            <Popup trigger={
                <Button id="cal" onClick={(e) => {
                    e.preventDefault()
                }}>
                    <img id="calendarLogo" src={calendarLogo}/>
                </Button>
            }position="bottom left">
                <div>
                    <Calendar onChange={(selectedDate) =>{
                        this.setState({date: selectedDate})}}
                    />
                </div>
            </Popup>
            )
    }
}
export default ButtonB;