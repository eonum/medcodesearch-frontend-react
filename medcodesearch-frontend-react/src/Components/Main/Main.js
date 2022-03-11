import React, {Component} from "react";
import './Main.css';
import ICD from "../ICD/ICD";

class Main extends Component {


    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-2"/>
                    <div className="col-8">
                        <div className="whiteBackground border border-5 border-bottom-0 border-top-0 border-right-0 border-end-0 border-primary rounded">
                            <div className="text-start ms-3">
                                <h6 className="pb-4">ICD-10-GM-2022</h6>
                                <h3>ICD-10-GM-2022</h3>
                                <h4>Untergeordnete Codes</h4>
                                <ul>
                                    <ICD />
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-2"/>
                </div>
            </div>
        )
    }
}

export default Main
