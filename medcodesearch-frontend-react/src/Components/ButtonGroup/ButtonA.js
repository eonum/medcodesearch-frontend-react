import React, {Component} from "react";
import CatalogButton from "./CatalogButton";
import NormButton from "./NormButton";

class ButtonA extends Component{

    selectThisList = (listName) => {
        this.props.chosenList(listName);
    }
    selectThisButton = (name) => {
        this.props.chosenBtn(name);
    }
    getLastList = (button) =>{
        return this.props.lastList(button);
    }
    getCatLists = (button) =>{
        return this.props.lists(button)
    }


    render() {
        return(

                this.props.names.map((buttons, index) => (
                    <div>
                        <NormButton
                            keyN={index}
                            name={buttons}
                            active={this.props.active}
                            click={this.selectThisButton.bind(null, buttons)}>
                            >{buttons}
                        </NormButton>
                        {/*
                        <CatalogButton
                            name={this.getLastList(buttons)}
                            lastList={this.props.lastList(buttons)}
                            catalogs={this.getCatLists(buttons)}
                            click={this.selectThisList.bind(null, buttons)}
                            >
                            {this.props.lastList(buttons)}
                        </CatalogButton>
                        */}
                    </div>
                    ))
        )
    }
}

export default ButtonA;