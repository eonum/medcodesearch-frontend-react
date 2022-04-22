import React, {Component} from "react";
import ButtonVersion from "./ButtonVersion";
import ButtonWithCal from "./ButtonWithCal";
import Popup from "reactjs-popup";
import {Button} from "react-bootstrap";
import calendarLogo from "../../assets/calendar.png";
import Calendar from "react-calendar";
import "./ButtonGroup.css"
import {useParams} from "react-router-dom";
import convertDate from "../../Services/ConvertDate";
import RouterService from "../../Services/router.service";

class ButtonGroup extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: RouterService.getCategoryFromURL(),
            activeList: this.props.params.version,
            lastICD: 'ICD10-GM-2022',
            lastDRG: 'V11.0',
            lastCHOP: 'CHOP_2022',
            lastTARMED: 'TARMED_01.09',
            selectedDate: convertDate(new Date().toISOString()),
            showHideCal: false,
            buttons: this.props.buttons,
        }
        this.updateButton = this.updateButton.bind(this);
        this.updateDate = this.updateDate.bind(this);
    }

    updateButton = (version, btn, isCalendarType, date) => {
        if (version === '') {
            version = this.getVersion(btn);
        }
        switch (btn) {
            case 'ICD':
                this.setState({lastICD: version});
                break;
            case 'SwissDRG':
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
        if (isCalendarType) {
            version = ''
        }
        if (date !== ''){
            this.updateDate(date);
        }
        this.setState({selectedButton: btn, activeList: version});
        this.props.selectedList(version);
        this.props.selectedButton(btn);
    }

    reRender(btn) {
        if (this.state.selectedButton === btn) {
            this.props.reSetButton()
        }
    }
    getVersion(btn) {
        switch (btn){
            case 'ICD':
                return this.state.lastICD;
            case 'SwissDRG':
                return this.state.lastDRG;
            case 'CHOP':
                return this.state.lastCHOP;
            case 'TARMED':
                return this.state.lastTARMED;
            default:
                return '';
        }
    }
    componentDidMount() {
        if(this.props.category === "CHOP") {
            this.setState({lastCHOP: this.props.version})
        } else if(this.props.category === "ICD") {
            this.setState({lastICD: this.props.version})
        } else if(this.props.category === "SwissDRG") {
            this.setState({lastDRG: this.props.version})
        } else if(this.props.category === "TARMED") {
            this.setState({lastTARMED: this.props.version})
        }
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevProps.version !== this.props.version) {
            if(this.props.category === "CHOP") {
                this.setState({lastCHOP: this.props.version})
            } else if(this.props.category === "ICD") {
                this.setState({lastICD: this.props.version})
            } else if(this.props.category === "SwissDRG") {
                this.setState({lastDRG: this.props.version})
            } else if(this.props.category === "TARMED") {
                this.setState({lastTARMED: this.props.version})
            }
        }
    }

    updateDate = (date) => {
        this.setState({selectedDate: date});
        this.props.selectedDate(date);
    }

    showHideCal = (state) => {
        this.setState({showHideCal: state})
    }
    render() {
        return (
            <div key={"ButtonGroup"} className={"alignButtons"}>
                {this.state.buttons[0].map((btn, index) => (
                <div key={"VersionButton" + index}>
                <ButtonVersion
                    index={index}
                    activate = {(button) => {
                        this.updateButton('', button, false, '');
                        this.showHideCal(false);
                        this.reRender(button)
                    }}
                    category={btn}
                    language={this.props.language}
                    version={this.getVersion(btn)}
                    selectedLanguage={this.props.selectedLanguage}
                    updateVersion={this.props.selectedList}
                    updateCategory={this.props.selectedButton}
                    selectedVersion={this.props.version}
                    selectedCategory={this.props.category}
                    chooseV={(version) => {
                        this.updateButton(version, btn);
                    }}
                />
                </div>
                ),this)}
                {
                this.state.buttons[1].map((button, index) => (
                <div key={"CalendarButton" + index}>
                <ButtonWithCal
                    showHideCal={this.state.showHideCal}
                    date ={this.props.selectedDate}
                    name={button}
                    index={index}
                    select={(btn, date) => {
                        this.updateButton('', btn, true, date);
                        this.showHideCal(true);
                        this.reRender(button)
                    }}
                    active={this.state.selectedButton}
                />
                </div>
                ))}
            </div>
        )
    }

}
export default (props) => (
    <ButtonGroup {...props} params={useParams()} />
)

