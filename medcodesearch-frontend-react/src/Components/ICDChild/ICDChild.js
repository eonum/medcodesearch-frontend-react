import React, {Component} from "react";

class ICDChild  extends Component{

    constructor(props) {
        super(props);

        this.state = {
            children:[],
            exclusions: [],
            inclusions: []
        }
    }

    async componentDidMount() {
        fetch(`https://search.eonum.ch/de/icd_chapters/ICD10-GM-2022/I?show_detail=1`)
            .then((res) => res.json())
            .then((json) => {
                console.log(json.exclusions)
                this.setState({
                    children: json.children,
                    exclusions: json.exclusions,
                    inclusions: json.inclusions
                })
            })
    }


    render() {
        return(
            <div>
                <div>
                    <h5>Exklusionen</h5>

                    <ul>
                        {this.state.exclusions.map((exclusion) => (
                            <li className="Exclusion" key={exclusion}>{exclusion}</li>
                        ))}
                    </ul>

                    <h5>Inklusionen</h5>

                    <ul>
                        {this.state.inclusions.map((inclusion) => (
                            <li className="Inclusion" key={inclusion}>{inclusion}</li>
                        ))}
                    </ul>

                    <h5>Untergeordnete Codes</h5>
                    <ul>
                        {this.state.children.map((child) => (
                            <li className="ICD" key={child.code}><a href="">{child.code}:</a> {child.text}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}

export default ICDChild
