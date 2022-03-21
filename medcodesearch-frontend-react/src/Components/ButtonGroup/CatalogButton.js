import {Component} from "react";
import "./ButtonGroup.css"
import {DropdownButton} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";

class CatalogButton extends Component{
    render() {
        return(
            <DropdownButton title={this.props.name}>
                {Array.from(this.props.catalogs).map(list => (
                    <DropdownItem active={this.props.lastList === list} onClick={this.props.click(list)}>
                        {list}
                    </DropdownItem>
                ))}
            </DropdownButton>
        )
    }

}
export default CatalogButton;