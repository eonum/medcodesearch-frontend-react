import React, {Component} from "react";
import ICDSortService from "../../Services/ICDSortService";
import RouterService from "../../Services/router.service";
import {Breadcrumb} from "react-bootstrap";

class ICD extends Component {


    static goToChild(oldCode, code, navigate, version, language) {
        if(version === oldCode) {
            navigate({pathname: "/" + language + "/Bodies/" + version + "/icd_chapters/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else if (code.match(/^[A-Z][0-9][0-9]\.?[0-9]?[0-9]?$/)){
            navigate({pathname: "/" + language + "/Bodies/" + version + "/icds/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
        else {
            navigate({pathname: "/" + language + "/Bodies/" + version + "/icd_groups/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
    }

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
                        newCategories["children"] = ICDSortService(json["children"])
                    }
                }).then( async () => {
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
                <h3>{this.props.title}</h3>
                <p>{this.props.text}</p>
                {this.props.categories}
            </div>
        )
    }
}
export default ICD;
