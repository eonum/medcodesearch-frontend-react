import React, {Component, useState} from "react";
import "./ButtonGroup.css";

class ButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: 'ICD'
        };
        this.updateButton = this.updateButton.bind(this);
    }

    updateButton(btn) {
        this.setState(function() {
            return {
                selectedButton: btn
            }
        })
    }

    render() {
        return (
            <div className="search-center">
                {this.props.buttons.map(function(btn) {
                    return <button
                        key={btn}
                        name={btn}
                        className={btn === this.state.selectedButton ? "customButton active" : "customButton"}
                        onClick = {this.updateButton.bind(null, btn)}
                    >{btn}</button>
                },this)}
            </div>
        )
    }
}


export default ButtonGroup;
