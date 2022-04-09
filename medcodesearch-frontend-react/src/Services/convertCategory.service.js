import React, {Component} from "react";

class ConvertCategoryService extends Component {

    static convertCategory(category, version) {
        switch(category) {
            case "ICD":
                return version.substring(3)
            case "CHOP":
                return version.substring(5)
            case "SwissDRG":
                return version
            case "TARMED":
                return version.substring(7)
        }
    }

}
export default ConvertCategoryService;
