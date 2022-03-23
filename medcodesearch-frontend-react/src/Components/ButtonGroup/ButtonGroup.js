import React, {Component} from "react";
import ButtonVersion from "./ButtonVersion";
import ButtonWithCat from "./ButtonWithCat";
import Popup from "reactjs-popup";
import {Button} from "react-bootstrap";
import calendarLogo from "../../assets/calendar.png";
import Calendar from "react-calendar";

class ButtonGroup extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: 'ICD',
            selectedDate: new Date(),
            showHideCal: false,
            buttons: this.props.buttons,
        }
        this.updateButton = this.updateButton.bind(this);
        this.updateDate = this.updateDate.bind(this);
    }

    updateButton = (version, btn) => {
        this.setState({selectedButton: btn, activeList: version}); //sets new button on click
        this.props.selectedButton(btn);
        this.props.selectedList(version);
    }
    updateDate = (date) => {
        this.setState({selectedDate: date});
        this.props.selectedDate(date);
    }

    showHideCal = (state) => {
        this.setState({showHideCal: state})
    }
    render() {
        return(
            <div className={"alignButtons"}>
                {this.state.buttons[0].map((btn, index) => (
                <div>
                <ButtonVersion
                    index={index}
                    activate = {(button) => {
                        this.updateButton('', button);
                        this.showHideCal(false);
                    }}
                    category={btn}
                    language={this.props.language}
                    chooseV={(version) => {
                        this.updateButton(version, btn);
                    }}
                />
                </div>
                ),this)}

                {this.state.buttons[1].map((button, index) => (
                <div>
                <ButtonWithCat
                    name={button}
                    index={index}
                    select={(btn) => {
                        this.updateButton('', btn);
                        this.showHideCal(true);
                    }}
                    active={this.state.selectedButton}
                />
                </div>
                ))}
                    <div>
                        {this.state.showHideCal &&
                        <Popup trigger={
                            <Button id="cal" onClick={(e) => {
                                e.preventDefault()
                            }}>
                                <img alt="calender Logo" id="calendarLogo" src={calendarLogo}/>
                            </Button>
                        } position="bottom left">
                            <Calendar onChange={(selectedDate) => {
                                this.updateDate(selectedDate);
                            }}/>
                        </Popup>
                        }
                </div>

            </div>
        )
    }

}export default ButtonGroup;