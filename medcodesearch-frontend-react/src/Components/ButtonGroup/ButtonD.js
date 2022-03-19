import {Component} from "react";
import "./ButtonGroup.css"
import {DropdownButton} from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";

class ButtonD extends Component{
    constructor(props) {
        super(props);
    }


    selectThisList = (list) => {
        this.props.actualName(list);
    }

    render() {
        return(
            <DropdownButton
                title={this.props.name}
            >
                {this.props.lists.map((list) => (
                    <DropdownItem active={this.props.name === list} onClick={
                        this.selectThisList.bind(null, list)
                    }>{list}</DropdownItem>
                ))}
            </DropdownButton>)
    }

}
export default ButtonD;