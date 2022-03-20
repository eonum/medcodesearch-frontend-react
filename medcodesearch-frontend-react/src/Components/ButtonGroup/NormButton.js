import React, {Component} from "react";
import "./ButtonGroup.css"
class NormButton extends Component {

    render() {
        return(
                <button
                        key={this.props.keyN}
                        name={this.props.name}
                        className={this.props.name=== this.props.active ? "customButton active" : "customButton"}
                        onClick = {this.props.click}
                    >{this.props.name}</button>
        )
    }

}
export default NormButton;