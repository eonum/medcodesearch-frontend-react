import React, {Component, useState} from "react";
import "./ButtonGroup.css";

class ButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ICD: false,
            DRG: false,

        }
    }
    render() {
        return (
//            const [clickedId, setClickedId] = useState(-1);
                <div className="search-center">
                    {buttons.map((buttonLabel, i) => (
                        <button
                            key={i}
                            name={buttonLabel}
                            onClick={() => clickedButton(i, buttonLabel)}
                            className={i === clickedId ? "customButton active" : "customButton"}
                        >
                            {buttonLabel}
                        </button>
                    ))}
                </div>)};
    clickedButton(i, buttonLabel){
        setClickedId(i);
        this.setState({list = buttonLabel.toLowerCase()});
    }
};


export default ButtonGroup;
