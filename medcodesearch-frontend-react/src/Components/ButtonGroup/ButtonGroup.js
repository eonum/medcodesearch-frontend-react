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
            language: this.props.language
        }
        this.updateButton = this.updateButton.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.updateList = this.updateList.bind(this);
    }
    componentDidMount() {
        if (this.props.buttons[1].includes(this.state.selectedButton)){
            this.showHideCal(true);
        }
        else{
            this.showHideCal(false);
        }
    }

    updateButton = (btn) => {
        this.setState({selectedButton: btn}); //sets new button on click
        this.props.selectedButton(btn);
    }
    updateDate = (date) => {
        this.setState({selectedDate: date});
        this.props.selectedDate(date);
    }

    showHideCal = (state) => {
        this.setState({showHideCal: state})
    }

    updateList = (btn, list) => {
        //when choosing a list, activating the corresponding button
        this.updateButton(btn);
        this.setState({activeList: list});
        this.props.selectedList(list);
    }

    render() {
        return(
            <div className={"alignButtons"}>
                {this.state.buttons[0].map((btn, index) => (
                <div>
                <ButtonVersion
                    index={index}
                    activate = {(button) => {
                        this.updateButton(button);
                        this.showHideCal(false);
                    }}
                    category ={btn}
                    language={this.state.language}
                    chooseV={(version) => {
                        this.updateList(version, btn);
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
                        this.updateButton(btn);
                        this.showHideCal(true);
                    }}
                    active={this.state.selectedButton}
                />
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
                ))}
            </div>
        )
    }

}export default ButtonGroup;