import React, {Component} from "react";

class ICDChild  extends Component{
    version;
    category;
    page;
    language;


    constructor(props) {
        super(props);

        this.version = props.version;
        this.category = props.category;
        this.page = props.page;
        this.language = props.language;

        this.state = {
            children:[],
            exclusions: [],
            inclusions: []
        }
    }

    async componentDidMount() {
        fetch(`https://search.eonum.ch/`+this.language+`/`+this.category+`/`+this.version+`/`+this.page+`?show_detail=1`)
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
                    <h4>{this.page}</h4>

                    {this.state.exclusions.length > 0 && (
                        <div>
                            <h5>Exklusionen</h5>

                            <ul>
                                {this.state.exclusions.map((exclusion) => (
                                    <li className="Exclusion" key={exclusion}>{exclusion}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {this.state.inclusions.length > 0 && (
                        <div>
                            <h5>Inklusionen</h5>

                            <ul>
                                {this.state.inclusions.map((inclusion) => (
                                    <li className="Inclusion" key={inclusion}>{inclusion}</li>
                                ))}
                            </ul>
                        </div>
                    )}

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