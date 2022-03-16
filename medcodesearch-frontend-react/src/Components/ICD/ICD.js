import React, {Component} from "react";

class ICD extends Component{
    code;
    text;
    url;
    index;
    version;




    constructor(props) {
        super(props);

        this.version = props.version

        this.state = {
            children:[],
            code:[],
            text:[],
            url:[],
            index:[]
        }
    }

    async componentDidMount() {
        fetch(`https://search.eonum.ch/de/icd_chapters/`+this.version+`/`+this.version+`?show_detail=1`)
            .then((res) => res.json())
            .then((json) => {

                this.setState({children: json.children})

                this.addChildrenToState(json.children)
            })
    }


    addChildrenToState(children) {
        this.code = [children.length]
        this.text = [children.length]
        this.url = [children.length]
        this.index = [children.length]

        for (let i=0; i<children.length; i++){
            this.code[i] = children[i].code
            this.text[i] = children[i].text
            this.url[i] = children[i].url
            this.index[i] = i
        }
        this.setState({
            code: this.code,
            text: this.text,
            url: this.url,
            index: this.index
        })
    }



    render() {
        return (
            <div>
                {this.state.index.map((index) => (
                    <li className="Index" key={index}><a href={this.url[index]}>{this.code[index]}:</a> {this.text[index]}</li>
                ))}

            </div>
        )
    }
}

export default ICD
