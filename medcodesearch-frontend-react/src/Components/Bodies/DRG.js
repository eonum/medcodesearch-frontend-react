import React, {Component} from "react";
import RouterService from "../../Services/router.service";
import {Breadcrumb} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

class DRG extends Component {

    static async fetchInformations(language, catalog, version, code, categories) {
        let codeForSearch;
        let cat = 'mdcs';
        let newCategories = categories
        if (catalog !==  'mdcs'){
            cat = catalog;
        }
        if (version === code){
            codeForSearch = '/ALL'
        }
        else {
            codeForSearch = '/' + code;
        }

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

        return await fetch('https://search.eonum.ch/' + language + "/" + cat+ "/" + version + codeForSearch + "?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                        for (let category in categories) {
                            newCategories[category] = json[category]
                        }}
                    ).then( async () => {
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
        let renderedOutput;
        let parents = this.props.parents;
         //console.log("(DRG) Parents:", parents);
        if(parents.length > 0){
            console.log("parents length: ", parents.length);
            for(let i=parents.length-1; i>=0; i--){
              parentBreadcrumbs.push(parents[i].code);
            }
            renderedOutput = parentBreadcrumbs.map(parent => <Breadcrumb.Item>{parent}</Breadcrumb.Item>);
         //console.log(parentBreadcrumbs);
        }
        return (
            <div>
                <Breadcrumb>
                    {renderedOutput}
                    <Breadcrumb.Item>{this.props.title.replace("_", " ")}</Breadcrumb.Item>
                </Breadcrumb>
                <h3>{this.props.title}</h3>
                <p>{this.props.text}</p>
                {this.props.categories}
            </div>
        )
    }

 //   static goToParent(parent)
    //
 //   }

    static goToChild(child, navigate, version, language) {
        if (child.code.match(/^[A-Z][A-Z][A-Z]\s\w+$/)){ // for example MDC 03 or MDC PRE or MDC a3
            let searchCode = child.code.split(' ');
            navigate({pathname: "/" + language + "/SwissDRG/" + version + "/mdcs/" + searchCode[1],
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else if(child.code.match(/[P|p]artition/) || child.code.match(/[P|p]artizione/)){ // for example C_A
            child.code = child.url.split("/")[child.url.split("/").length-1];
            navigate({pathname: "/" + language + "/SwissDRG/" + version + "/partitions/" + child.code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else if(child.code.match(/^[A-Z][0-9][0-9]$/)){ // for example C60
            navigate({pathname: "/" + language + "/SwissDRG/" + version + "/adrgs/" + child.code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else if (child.code.match(/^[A-Z][0-9][0-9][A-Z]$/)){ // for example C60A
            navigate({pathname: "/" + language + "/SwissDRG/" + version + "/drgs/" + child.code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
    }
}
export default DRG;
