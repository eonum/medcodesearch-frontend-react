import React, {Component} from "react";
import RouterService from "../../Services/router.service";
import CodeSortService from "../../Services/CodeSortService";
import {Breadcrumb} from "react-bootstrap";

class TARMED extends Component {

    static async fetchInformations(language, catalog, version, code, categories) {
        let newCategories = categories

        async function fetchGrandparents(parent, parents) {
            await fetch('https://search.eonum.ch/' + parent.url + "?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                    if (json["parent"] !== null) {
                        parents.push(json["parent"]);
                        fetchGrandparents(json["parent"], parents);
                    }
                })
        }

        return await fetch('https://search.eonum.ch/' + language + "/" + catalog + "/" + version + "/" + code + "?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                    for(let category in categories) {
                        newCategories[category] = json[category]
                    }
                    if(version === code) {
                        newCategories["children"] = CodeSortService(json["children"])
                    }}).then( async () => {
                            newCategories["parents"] = [];
                            if (newCategories["parent"] != null) {
                                console.log("newCategories[parent]: ", newCategories["parent"]);
                                let parent = newCategories["parent"];
                                newCategories["parents"].push(parent);
                                console.log("newCategories[parents]: ", newCategories["parents"]);
                                await fetchGrandparents(parent, newCategories["parents"]);
                            }
                            //  console.log(newCategories);
                        }

                    )
                        .then(() => {return newCategories})
    }


    render() {
        let parentBreadcrumbs =  [];
        let parents = this.props.parents;
        //   console.log("(ICD) Parents:", parents);
        if(parents.length > 0){
            for(let i=parents.length-1; i>=0; i--){
                parentBreadcrumbs.push(<Breadcrumb.Item>{parents[i].code}</Breadcrumb.Item>)
            }
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

    static goToChild(oldCode, code, navigate, version, language) {
        if(code.match(/^[0-9][0-9]$/)) {
            navigate({pathname: "/" + language + "/TARMED/" + version + "/tarmed_chapters/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else {
            navigate({pathname: "/" + language + "/TARMED/" + version + "/tarmeds/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
    }
}
export default TARMED;
