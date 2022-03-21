import {Component} from "react";
import Popup from "reactjs-popup";
import {Button} from "react-bootstrap";
import calendarLogo from "../../assets/calendar.png";
import Calendar from "react-calendar";
import NormButton from "./NormButton";

class ButtonB extends Component{
    selectThisButton = (name) => {
        this.props.chosenBtn(name);
        this.props.showHide(true);
    }

    render(){
            return(<div>
                {this.props.names.map((buttons, index) => (
                <NormButton
                    keyN={index}
                    name={buttons}
                    active={this.props.active}
                    click={this.selectThisButton.bind(null, buttons)}>
                    >{buttons}</NormButton>
                ))}
                {this.props.isNotHidden &&
                    <Popup trigger={
                        <Button id="cal" onClick={(e) => {
                            e.preventDefault()
                        }}>
                            <img id="calendarLogo" src={calendarLogo}/>
                        </Button>
                    } position="bottom left">
                        <Calendar onChange={(selectedDate) => {
                            this.props.date(selectedDate)
                        }}/>
                    </Popup>
                }
                </div>
                )}

}
export default ButtonB;