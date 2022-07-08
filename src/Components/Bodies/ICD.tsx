import React, {Component} from "react";
import IcdSortService from "../../Services/icd-sort.service";
import RouterService from "../../Services/router.service";
import {Breadcrumb} from "react-bootstrap";
import {IVersionizedCode} from "../../interfaces";

/**
 * responsible fot he ICD component and the pathname
 */
class ICD extends Component<IVersionizedCode> {
    /**
     * Render the CHOP component
     * @returns {JSX.Element}
     */
    render() {
        return (
            <div>
                <Breadcrumb>
                    {this.props.parents}
                    <Breadcrumb.Item active>{this.props.title.replace("_", " ")}</Breadcrumb.Item>
                </Breadcrumb>
                <h3>{this.props.title}</h3>
                <p>{this.props.text}</p>
                {this.props.attributes}
            </div>
        )
    }
}
export default ICD;
