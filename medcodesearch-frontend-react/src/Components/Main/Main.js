import React, {Component} from "react";
import './Main.css';

class Main extends Component {

    zahl = `I`;
    wege = `ICD10-GM-2014`;



    constructor(props) {
        super(props);

        this.state = {
            text: "",
            code: ""
        }
    }


    componentDidMount() {
        fetch(`https://search.eonum.ch/de/icd_chapters/`+this.wege+`/`+this.zahl)
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    text: json.text,
                    code: json.code
                })
            })
    }



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
                                    <li>
                                        {this.state.code} {this.state.text}
                                    </li>
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
