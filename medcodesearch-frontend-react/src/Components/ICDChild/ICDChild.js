import React, {Component} from "react";

class ICDChild  extends Component{

    constructor(props) {
        super(props);

        this.state = {
            children:[]
        }
    }

    async componentDidMount() {
        fetch(`https://search.eonum.ch/de/icd_chapters/ICD10-GM-2022/I?show_detail=1`)
            .then((res) => res.json())
            .then((json) => {
                console.log(json.children)
                this.setState({children: json.children})
            })
    }


    render() {
        return(
            <div>
                {this.state.children.map((child) => (
                    <li className="ICD" key={child.code}><a href="">{child.code}:</a> {child.text}</li>
                ))}
            </div>
        )
    }
}

export default ICDChild
