import {Component} from "react";
import "./ButtonGroup.css"
import {DropdownButton} from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";

class CatButton extends Component{

    render() {
        return(
            <DropdownButton title={this.props.name}>
                {this.props.catalogs.map((list) => (
                    <DropdownItem active={this.props.lastList === list} onClick={this.props.click(list)}>
                        {list}</DropdownItem>
                ))}
            </DropdownButton>)
    }

}
export default CatButton;