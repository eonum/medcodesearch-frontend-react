import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import MiGeL from "./MiGeL";
import AL from "./AL";
import DRUG from "./DRUG";

class BodyII extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usage: "",
            text: "",
        }
    }

    componentDidMount() {
        this.fetchInformations()
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
            if (prevProps.params.language !== this.props.params.language ||
                prevProps.params.code !== this.props.params.code) {
                this.setState({
                    text: "",
                    usage: "",
                })
                this.fetchInformations()
            }

    }

    async fetchInformations() {
        let newCategories, versions, component;
        if (this.props.params.category === "MIGEL") {
            component = MiGeL;
            versions = 'migels'
        }else if (this.props.params.category === "AL") {
            component = AL;
            versions = 'laboratory_analyses';
        }else if (this.props.params.category === "DRUG") {
            component = DRUG
            versions = 'drugs'
        }
        newCategories = await component.fetchInformations(this.props.params.language, this.props.params.category, versions, this.props.params.code, this.state)
        if (newCategories !== null) {
            this.setState(newCategories)
        }
    }

    render() {
        let showTitle = this.props.params.code === 'all'
        if(this.props.params.category === "MIGEL") {
            return <MiGeL title={showTitle ? 'MiGeL' : this.props.params.code}
                          text={showTitle ? "Search for a Code" : this.state.text}/>
        }
        else if (this.props.params.category === "AL") {
            return <AL title={showTitle ? 'AL' : this.props.params.code}
                       text={showTitle ? "Search for a Code" : this.state.text} />
        }
        else if (this.props.params.category === "DRUG") {
            return <AL title={showTitle ? 'DRUG' : this.props.params.code}
                       text={showTitle ? "Search for a Code" : this.state.text}/>
        }

    }
}

export default function(props) {
    const navigation = useNavigate();
    const location = useLocation();
    return <BodyII {...props} navigation={navigation} location={location} params={useParams()}/>
}
