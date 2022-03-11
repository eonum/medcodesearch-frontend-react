import React, { useState } from "react";
import "./ButtonGroup.css";

const ButtonGroup = ({ buttons }) => {
    const [clickedId, setClickedId] = useState(-1);
    return (
        <div className="search-center">
            {buttons.map((buttonLabel, i) => (
                <button
                    key={i}
                    name={buttonLabel}
                    onClick={() => setClickedId(i)}
                    className={i === clickedId ? "customButton active" : "customButton"}
                >
                    {buttonLabel}
                </button>
            ))}
        </div>
    );
};


export default ButtonGroup;
