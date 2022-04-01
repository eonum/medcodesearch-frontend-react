import React, {Component} from "react";
import ICDSortService from "../../Services/ICDSortService";
import {generatePath, useLocation, useNavigate, useParams} from "react-router-dom";

class Body extends Component{

    constructor(props) {
        super(props);
        this.state = {
            children:[],
        }
    }

    componentDidMount() {
        this.fetchInformations()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.params.language !== this.props.params.language ||
            prevProps.params.version !== this.props.params.version ||
            prevProps.params.category !== this.props.params.category) {
            this.fetchInformations()
        }
    }

    async fetchInformations() {
        if(this.props.params.catalog === "drg_chapters") {
            await fetch(`https://search.eonum.ch/` + this.props.params.language + `/mdcs/` + this.props.params.version + `/ALL?show_detail=1`)
                .then((res) => res.json())
                .then((json) => {
                    if (json.children != null) {
                        this.setState({children: json.children})
                    } else {
                        this.setState({children: []})
                    }
                })
        } else {
            fetch(`https://search.eonum.ch/` + this.props.params.language + `/` + this.props.params.catalog + `/` + this.props.params.version + `/` + this.props.params.version + `?show_detail=1`)
                .then((res) => res.json())
                .then((json) => {
                    if (json.children != null) {
                        this.setState({children: json.children})
                        if (this.props.params.category === "icd_chapters") {
                            this.setState({children: ICDSortService(this.state.children)})
                        }
                    } else {
                        this.setState({children: []})
                    }
                })
        }
    }

    render() {
        return (
            <div>
                <h3>{this.props.params.version}</h3>
                <h4>Untergeordnete Codes</h4>
                <ul>
                    {this.state.children.map((child) => (
                        <li className="ICD" key={child.code}><a className="link" onClick={() => {this.goToChild(child.code)}}>{child.code}:</a> {child.text}</li>
                    ))}
                </ul>
            </div>
        )
    }

    goToChild(code) {
        let location = this.props.location
        let navigate = this.props.navigation
        code = code.split(" ").pop()
        navigate(location.pathname + "/" + code)
    }
}

export default function(props) {
    const navigation = useNavigate();
    const location = useLocation();
    return <Body {...props} navigation={navigation} location={location} params={useParams()}/>
}

