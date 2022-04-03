import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import ICDSortService from "../../Services/ICDSortService";
import Fetch from "../../Services/fetch";

class DRG extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children:[],
        }
    }
    componentDidMount() {
        this.fetchInformations()
    }
    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevProps.params.language !== this.props.params.language ||
            prevProps.params.version !== this.props.params.version) {
            this.fetchInformations()
        }
    }

    async fetchInformations() {
        Fetch(this.props.params.language, this.props.params.version, 'drgs_chapters', this.props.params.version)
            .then((res) => res.json())
            .then((json) => {
                if (json.children != null) {
                    this.setState({children: ICDSortService(json.children)})
                } else {
                    this.setState({children: []})
                }
            })
    }
    render() {
        return (
            <div>
                <h3>{this.props.params.version}</h3>
                <h4>Untergeordnete Codes</h4>
                <ul>
                    {this.state.children.map((child) => (
                        <li className="DRG" key={child.code}><a className="link" onClick={() => {this.goToChild(child.code)}}>{child.code}:</a> {child.text}</li>
                    ))}
                </ul>
            </div>
        )
    }

    goToChild(code) {
        let navigate = this.props.navigation
        navigate("/" + this.props.params.language + "/SwissDRG/" + this.props.params.version + "/mdcs/" + code)
    }
}
export default function(props) {
    const navigation = useNavigate();
    const location = useLocation();
    return <DRG {...props} navigation={navigation} location={location} params={useParams()}/>
}
