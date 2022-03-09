import React, {Component} from "react";
import './Main.css';

class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: "",
            code: ""
        }
    }


    componentDidMount() {
        fetch("https://search.eonum.ch/de/icd_chapters/ICD10-GM-2014/II")
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    text: json.text
                })
            })
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-2"/>
                    <div className="col-8">
                        <div className="bg-secondary border border-5 border-bottom-0 border-top-0 border-right-0 border-end-0 border-primary rounded">
                            {this.state.text}
                        </div>
                    </div>
                    <div className="col-2"/>
                </div>
            </div>
        )
    }
}

export default Main
