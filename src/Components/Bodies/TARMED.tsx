import React, {Component} from "react";
import RouterService from "../../Services/router.service";
import CodeSortService from "../../Services/code-sort.service";
import {Breadcrumb} from "react-bootstrap";
import {IVersionizedCode} from "../../interfaces";

/**
 * responsible for the TARMED component and the pathname
 */
class TARMED extends Component<IVersionizedCode> {
    /**
     * Render the TARMED component
     * @returns {JSX.Element}
     */
    render() {
        return (
            <div>
                <Breadcrumb>
                    {this.props.parents}
                    <Breadcrumb.Item active>{this.props.title.replace("_", " ")}</Breadcrumb.Item>
                </Breadcrumb>
                <h3>{this.props.title.replace("_", " ")}</h3>
                <p>{this.props.text}</p>
                {this.props.attributes}
            </div>
        )
    }
}
export default TARMED;
