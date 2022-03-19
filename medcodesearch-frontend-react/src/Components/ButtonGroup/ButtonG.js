import React, {Component} from "react";
import "./ButtonGroup.css"
class ButtonG extends Component {

    constructor(props) {
        super(props);
    }

    isActive() {
        let selectedButton = this.props.selectedButton;
        let name = this.props.name;
        if (name == selectedButton){
            return true;
        }
        else {
            return false;
        }
    }

    selectThisButton = (name) => {
        this.props.chosenBtn(name);
    }

    render() {
        return(
                <button
                        key={this.props.name}
                        name={this.props.name}
                        className={this.isActive() ? "customButton active" : "customButton"}
                        onClick = {this.selectThisButton.bind(null, this.props.name)}
                    >{this.props.name}</button>
        )
    }

}
export default ButtonG;