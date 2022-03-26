import React, {Component} from "react";
import './Main.css';
import Body from "../Body/Body";
import BodyChild from "../BodyChild/BodyChild";
import {useParams} from "react-router-dom";

class Main extends Component {

    constructor(props) {
        super(props);
        this.page = "I"
    }

    render() {
        return (
            <div className="Wrapper">
                <div className="row">
                    <div className="col">
                        <div id="color" className="whiteBackground border border-5 border-bottom-0 border-top-0 border-right-0 border-end-0 rounded">
                            <div className="text-start ms-3">
                                <h6 className="pb-4">{this.props.params.version}</h6>
                                <Body version={this.props.params.version} category={this.props.params.catalog} language={this.props.params.language}/>
                                {/*<BodyChild version={this.version} category={this.buttons} page={this.page} language={this.language}/>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default (props) => (
    <Main {...props} params={useParams()} />
)
