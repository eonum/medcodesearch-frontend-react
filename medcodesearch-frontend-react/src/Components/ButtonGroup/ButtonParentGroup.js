import {Component} from "react";
import ButtonG from "./ButtonG";
import "./ButtonGroup.css"
import ButtonD from "./ButtonD";
class ButtonParentGroup extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: 'ICD',
            selectedListICD: 'ICD10-GM-2014',
            selectedListDRG: 'V3.0',
            selectedListCHOP: 'CHOP_2014',
            selectedListTARMED: 'TARMED_01.09'
        }
    }

    updateButton = (btn) => {
        this.setState({selectedButton: btn}); //sets new button on click
    }

    activatedList = (list) => {
        switch (this.state.selectedButton){
            case 'ICD':
                this.setState({selectedListICD: list});
                break;
            case 'SwissDRG':
                this.setState({selectedListDRG: list});
                break;
            case 'CHOP':
                this.setState({selectedListCHOP: list});
                break;
            case 'TARMED':
                this.setState({selectedListTARMED: list});
                break;
        }
    }

    render() {
        return(
            <div>
                <ButtonG
                    chosenBtn={this.updateButton}
                    name='ICD'
                    active={this.state.selectedButton}
                />
                <ButtonD
                    name={this.state.selectedListICD}
                    actualName={this.activatedList}
                    active={this.state.selectedButton}
                    lists={['ICD10-GM-2014','ICD10-GM-2015', 'ICD10-GM-2016','ICD10-GM-2017']}
                />
                <ButtonG
                    chosenBtn={this.updateButton}
                    name='CHOP'
                    active={this.state.selectedButton}/>

                <ButtonD
                    name={this.state.selectedListCHOP}
                    actualName={this.activatedList}
                    active={this.state.selectedButton}
                    lists={['CHOP_2014','CHOP_2015', 'CHOP_2016', 'CHOP_2017']}
                />
                <ButtonG
                    chosenBtn={this.updateButton}
                    name='SwissDRG'
                    active={this.state.selectedButton}/>

                <ButtonD
                    name={this.state.selectedListDRG}
                    actualName={this.activatedList}
                    active={this.state.selectedButton}
                    lists={['V3.0','V4.0', 'V5.0','V6.0']}
                />
                <ButtonG
                    chosenBtn={this.updateButton}
                    name='TARMED'
                    active={this.state.selectedButton}/>

                <ButtonD
                    name={this.state.selectedListTARMED}
                    actualName={this.activatedList}
                    active={this.state.selectedButton}
                    lists={['TARMED_01.09', 'TARMED_01.10', 'TARMED_01.11', 'TARMED_01.12']}
                />
            </div>)
    }
}
export default ButtonParentGroup;