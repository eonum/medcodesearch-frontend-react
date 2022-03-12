import React, {Component} from "react";
import './Main.css';
import ICD from "../ICD/ICD";

class Main extends Component {


    render() {
        return (
            <div className="Wrapper">
                <div className="row">
                    <div className="col">
                        <div id="color" className="whiteBackground border border-5 border-bottom-0 border-top-0 border-right-0 border-end-0 rounded">
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
                </div>
            </div>
        )
    }
}

export default Main
