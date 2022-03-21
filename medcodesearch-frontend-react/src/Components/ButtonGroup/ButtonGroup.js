import NormButton from "./NormButton";
import CatalogButton from "./CatalogButton";
import {Component} from "react";
import ICD from "../ICD/ICD";
import ButtonA from "./ButtonA";
import ButtonB from "./ButtonB";

class ButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: 'ICD',
            selectedDate: new Date(),
            showHideCal: false,
            activeList: 'ICD10-GM-2022',
            lastICD:'ICD10-GM-2022',
            lastDRG:''
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
    updateList = (btn, list) => {
        //when choosing a list, activating the corresponding button
        this.updateButton(btn);
        this.setState({activeList: list});
        this.props.selectedList(list);
        switch (btn){
            case 'ICD':
                this.setState({lastICD: list})
                break;
            case 'DRG':
                this.setState({lastDRG: list})
                break;
        }

    }
    // gets through btn name the last list set for this button
    getLast = (btn) => {
        switch (btn){
            case 'ICD':
                return this.state.lastICD;
            case 'DRG':
                return this.state.lastDRG;
        }
    }

    //return available lists for this button
    async fetchLists(btn) {
        let language = 'de';
        let fetched = await fetch('https://search.eonum.ch/' + language + '/' + btn.toLowerCase() + 's/versions') // fetches the lists
        return fetched;
    }


    showHideCal = (state) => {
        this.setState({showHideCal: state})
    }
    render() {
        return(<div className={"alignButtons"}>
                <ButtonA
                    names={this.props.buttonsA}
                    chosenBtn={(btn) => {
                        this.updateButton(btn);
                        this.showHideCal(false);
                    }
                    } // when button is clicked on
                    active={this.state.selectedButton} // to look up which button is the active one
                    chosenList={this.updateList} // when a list is choosen
                    lists={this.fetchLists} // to get all the possible lists of one button
                    //{['ICD10-GM-2014','ICD10-GM-2015', 'ICD10-GM-2016','ICD10-GM-2017']}
                    lastList={this.getLast} // to get the last clicked list of a specific button
                />
                <ButtonB
                    names={this.props.buttonsB}
                    showHide={this.showHideCal}
                    isNotHidden={this.state.showHideCal}
                    chosenBtn={this.updateButton}
                    active={this.state.selectedButton}
                    date={this.updateDate}
                />
            </div>
        )
    }

}
export default ButtonGroup;