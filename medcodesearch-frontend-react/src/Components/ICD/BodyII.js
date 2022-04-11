import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import MiGeL from "./MiGeL";
import AL from "./AL";
import CalCatalogs from "./CalCatalogs";

// TODO: link whensearching for a code isnt working anymore

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
        let newCategories, versions;
        if (this.props.params.category === "MIGEL") {
            versions = 'migels'
        }else if (this.props.params.category === "AL") {
            versions = 'laboratory_analyses';
        }else if (this.props.params.category === "DRUG") {
            versions = 'drugs'
        }
        newCategories = await CalCatalogs.fetchInformations(this.props.params.language, this.props.params.category, versions, this.props.params.code, this.state)
        if (newCategories !== null) {
            this.setState(newCategories)
        }
    }

    render() {
        let title;
        let showTitle = this.props.params.code === 'all'
        if(this.props.params.category === "MIGEL") {
            title = 'MiGeL'
        }
        else if (this.props.params.category === "AL") {
            title = 'AL'
        }
        else if (this.props.params.category === "DRUG") {
            title = 'Drug'
        }
        return <CalCatalogs title={showTitle ? title : this.props.params.code}
                            text={showTitle ? "Search for a Code" : this.state.text}/>

    }
}

export default function(props) {
    const navigation = useNavigate();
    const location = useLocation();
    return <BodyII {...props} navigation={navigation} location={location} params={useParams()}/>
}
