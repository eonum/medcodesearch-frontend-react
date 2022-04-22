import React, {Component} from "react";
import RouterService from "../../Services/router.service";
import CodeSortService from "../../Services/CodeSortService";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";

class CHOP extends Component {

    static async fetchInformations(language, catalog, version, code, categories) {
        let newCategories = categories
        return await fetch('https://search.eonum.ch/' + language + "/" + catalog + "/" + version + "/" + code + "?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                    for(let category in categories) {
                        newCategories[category] = json[category]
                    }
                    if(version === code) {
                        newCategories["children"] = CodeSortService(json["children"])
                    }
                    // if(newCategories.parent !== null) {
                     // console.log(newCategories.parent.code);
                   // }
                })
                .then(() => {return newCategories})

    }

    static goToChild(oldCode, code, navigate, version, language) {
        if(version === oldCode) {
            navigate({pathname: "/" + language + "/CHOP/" + version + "/chop_chapters/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else {
            navigate({pathname: "/" + language + "/CHOP/" + version + "/chops/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
    }

    render() {
        let parentBreadcrumbs =  [];
        console.log("this.props.parents: ", this.props.parents[0]);
        if(this.props.parents.length > 0){
            this.props.parents.map((parent) =>
            parentBreadcrumbs.push(<Breadcrumb.Item>{parent.code}</Breadcrumb.Item>))
        }
        return (
            <div>
                <Breadcrumb>
                    {parentBreadcrumbs}
                    <Breadcrumb.Item>{this.props.title.replace("_", " ")}</Breadcrumb.Item>
                </Breadcrumb>
                <h3>{this.props.title.replace("_", " ")}</h3>
                <p>{this.props.text}</p>
                {this.props.categories}
            </div>
        )
    }
}
export default CHOP;
