import React, {Component} from "react";

class ICD extends Component{
    version;




    constructor(props) {
        super(props);

        this.version = props.version

        this.state = {
            children:[],
        }
    }

    async componentDidMount() {
        fetch(`https://search.eonum.ch/de/icd_chapters/`+this.version+`/`+this.version+`?show_detail=1`)
            .then((res) => res.json())
            .then((json) => {

                this.setState({children: json.children})

            })
    }



    render() {
        return (
            <div>
                {this.state.children.map((child) => (
                    <li className="ICD" key={child.code}><a href="">{child.code}:</a> {child.text}</li>
                ))}

            </div>
        )
    }
}

export default ICD
