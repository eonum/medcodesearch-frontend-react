import React, {Component} from "react";

class ICD extends Component{

    romischeZahlen = ['I','II','III',`IV`, 'V',`VI`,`VII`,`IX`,`X`,`XI`,`XII`,`XIII`,`XIV`,`XV`,`XVI`,`XVII`,`XVIII`,`XIX`,`XIX`,`XX`,`XXI`,`XXII`]

    constructor(props) {
        super(props);

        this.state = {
            code: [],
            text: [],
            url: [],
            count: []
        }
    }

    async componentDidMount() {
        for (const romischeZahl of this.romischeZahlen) {
            await this.fetchForAllICDs(romischeZahl)
        }
    }

    async fetchForAllICDs(romischeZahl){
        await fetch(`https://search.eonum.ch/de/icd_chapters/ICD10-GM-2014/`+romischeZahl)
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    code: [...this.state.code, json.code],
                    text: [...this.state.text, json.text],
                    url: [...this.state.url, json.url],
                    count: [...this.state.count, this.state.count.length]
                })
            })
    }

    render() {
        return (
            <div>
                {this.state.count.map(i => <li key={this.state.code[i]}>{this.state.code[i]} {this.state.text[i]}</li>)}
            </div>
        )
    }
}

export default ICD
