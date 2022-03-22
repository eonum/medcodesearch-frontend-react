import React, {Component} from "react";
import './Main.css';
import Body from "../Body/Body";
import BodyChild from "../BodyChild/BodyChild";

class Main extends Component {
    version;
    buttons;
    page;
    language;



    constructor(props) {
        super(props);

        this.language="de"
        this.page = "I"
        this.buttons = "icd_chapters"
        this.version = `ICD10-GM-2022`
    }


    render() {
        return (
            <div className="Wrapper">
                <div className="row">
                    <div className="col">
                        <div id="color" className="whiteBackground border border-5 border-bottom-0 border-top-0 border-right-0 border-end-0 rounded">
                            <div className="text-start ms-3">
                                <h6 className="pb-4">{this.version}</h6>
                                <Body version={this.version} category={this.buttons} language={this.language}/>
                                {/*<BodyChild version={this.version} category={this.buttons} page={this.page} language={this.language}/>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Main
