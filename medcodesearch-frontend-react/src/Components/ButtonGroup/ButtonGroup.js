import React, {Component} from "react";
import ButtonVersion from "./ButtonVersion";
import ButtonWithCal from "./ButtonWithCal";
import Popup from "reactjs-popup";
import {Button} from "react-bootstrap";
import calendarLogo from "../../assets/calendar.png";
import Calendar from "react-calendar";
import {Link} from "react-router-dom";
import "./ButtonGroup.css"

class ButtonGroup extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: 'ICD',
            activeList: 'ICD10-GM-2022',
            lastICD: 'ICD10-GM-2022',
            lastDRG: 'V11.0',
            lastCHOP: 'CHOP_2022',
            lastTARMED: 'TARMED_01.09',
            selectedDate: new Date(),
            showHideCal: false,
            buttons: this.props.buttons,
        }
        this.updateButton = this.updateButton.bind(this);
        this.updateDate = this.updateDate.bind(this);
    }

    updateButton = (version, btn) => {
        btn = this.getCorrectName(btn)
        if (version === ''){
            version = this.getVersion(btn);
        }
        switch (btn){
            case 'ICD':
                this.setState({lastICD: version});
                break;
            case 'DRG':
                this.setState({lastDRG: version});
                break;
            case 'CHOP':
                this.setState({lastCHOP: version});
                break;
            case 'TARMED':
                this.setState({lastTARMED: version});
                break;
            default:
            }
        this.setState({selectedButton: btn, activeList: version});
        this.props.selectedButton(btn);
        this.props.selectedList(version);
    }
    getVersion(btn) {
        switch (btn){
            case 'ICD':
                return this.state.lastICD;
            case 'DRG':
                return this.state.lastDRG;
            case 'CHOP':
                return this.state.lastCHOP;
            case 'TARMED':
                return this.state.lastTARMED;
            default:
                return ''
        }
    }
    updateDate = (date) => {
        this.setState({selectedDate: date});
        this.props.selectedDate(date);
    }

    showHideCal = (state) => {
        this.setState({showHideCal: state})
    }
    getCorrectName(btn){
        if (btn === 'SwissDRG'){
            return 'DRG';
        }
        return btn
    }
    render() {
        return (
            <div key={"ButtonGroup"} className={"alignButtons"}>
                {this.state.buttons[0].map((btn, index) => (
                <div key={"VersionButton" + index}>
                <ButtonVersion
                    index={index}
                    activate = {(button) => {
                        this.updateButton('', button);
                        this.showHideCal(false);
                    }}
                    category={btn}
                    language={this.props.language}
                    version={this.getVersion(btn)}
                    selectedCategory={this.state.selectedButton}
                    chooseV={(version) => {
                        this.updateButton(version, btn);
                    }}
                />
                </div>
                ),this)}

                {this.state.buttons[1].map((button, index) => (
                <div key={"CalendarButton" + index}><Link to={'/' + button}>
                <ButtonWithCal
                    name={button}
                    index={index}
                    select={(btn) => {
                        this.updateButton('', btn);
                        this.showHideCal(true);
                    }}
                    active={this.state.selectedButton}
                /></Link>
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
