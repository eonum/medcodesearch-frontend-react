import React, {Component} from "react";
import './Main.css';
import {Outlet, useParams} from "react-router-dom";
import {IMain} from "../../interfaces";

interface Props{
    params: any
}

/**
 * Sets the default page and is responsible for the background
 */
class Main extends Component<Props, IMain> {

    constructor(props) {
        super(props);
        this.state = {page: "I"}
    }

    /**
     * Render the Main component
     * @returns {JSX.Element}
     */
    render() {
        return (
            <div key={"main div 0"} className="Wrapper">
                <div key={"main div 1"} className="row">
                    <div key={"main div 2"} className="col">
                        <div key={"main div 3"} id="color" className="whiteBackground border border-5 border-bottom-0 border-top-0 border-right-0 border-end-0 rounded">
                            <div key={"main div 4"} className="text-start ms-3">
                                <Outlet/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default (props) => (
    <Main {...props} params={useParams()} />
)
