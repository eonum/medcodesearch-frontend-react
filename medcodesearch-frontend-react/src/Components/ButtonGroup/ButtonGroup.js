import React, {Component} from "react";
import ButtonVersion from "./ButtonVersion";
import ButtonWithCal from "./ButtonWithCal";
import "./ButtonGroup.css"
import {useParams} from "react-router-dom";
import convertDate from "../../Services/ConvertDate";
import RouterService from "../../Services/router.service";
import MobileButton from "./MobileButton";

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
            <div key={"buttongroup div 0"}>
                <div key={"buttongroup div 1"}className="d-none d-lg-block">
                    <div key={"ButtonGroup div 2"} className={"alignButtons"}>
                        {this.state.buttons[0].map((btn, index) => (
                            <div key={"buttongroup VersionButton " + btn + " div " + index}>
                                <ButtonVersion
                                    key={btn + " " + index}
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
                                    selectedVersion={this.props.params.version}
                                    selectedCategory={this.state.selectedButton}
                                    chooseV={(version) => {
                                        this.updateButton(version, btn, false, '');
                                    }}
                                />
                            </div>
                        ),this)}
                        {
                            this.state.buttons[1].map((button, index) => (
                                <div key={"buttongroup CalendarButton div " + index}>
                                    <ButtonWithCal
                                        showHideCal={this.state.showHideCal}
                                        date ={this.props.selectedDate}
                                        name={button}
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
                </div>
                <div key={"buttongroup MobileButton div 0"} className="d-lg-none">
                    <MobileButton
                        selectedButton ={this.state.selectedButton}
                        date ={this.props.selectedDate}
                        version={this.getVersion(this.state.selectedButton)}
                        selectedVersion={this.props.params.version}
                        category={this.state.selectedButton}
                        language={this.props.language}
                        selectedLanguage={this.props.selectedLanguage}
                        updateVersion={this.props.selectedList}
                        updateCategory={this.props.selectedButton}
                        buttons={this.props.buttons}
                        chooseC={(version, category, isCalendar, date) => {
                            this.updateButton(version, category, isCalendar, date)
                        }}
                    />
                </div>
            </div>
        )
    }

}
export default (props) => (
    <ButtonGroup {...props} params={useParams()} />
)

