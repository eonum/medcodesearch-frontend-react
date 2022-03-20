import React, {Component} from "react";
import CatButton from "./CatButton";
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
            <div>
                {this.props.names.map((buttons, index) => (
                    <div>
                        <NormButton
                            keyN={index}
                            name={buttons}
                            active={this.props.active}
                            click={this.selectThisButton.bind(null, buttons)}>
                            >{buttons}
                        </NormButton>
                        <CatButton
                            name={this.getLastList(buttons)}
                            lastList={this.props.lastList(buttons)}
                            catalogs={this.getCatLists(buttons)}
                            click={this.selectThisList.bind(null, buttons)}
                            >
                            {this.props.lastList(buttons)}
                        </CatButton>
                    </div>
                    ))}
            </div>
        )
    }
}
/*
<button
                        key={index}
                        name={buttons}
                        className={buttons=== this.props.active ? "customButton active" : "customButton"}
                        onClick={this.selectThisButton.bind(null, buttons)}>
                        {buttons}
                    </button>

                    <DropdownButton title={this.getLastList}>
                        {this.props.lists.map((listNames) => (
    <DropdownItem
        active={this.props.lastList(buttons) === listNames}
        onClick={this.selectThisList.bind(null, listNames)}>
        {listNames}</DropdownItem>
))
}
</DropdownButton>


 */

export default ButtonA;