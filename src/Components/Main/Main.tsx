import React, {Component} from "react";
import './Main.css';
import {Outlet, useParams} from "react-router-dom";
import {IParamTypes} from "../../interfaces";

interface Props{
    params: IParamTypes
}

interface IMain {
    page: string
}

/**
 * Sets the default page and is responsible for the background.
 */
class Main extends Component<Props, IMain> {
    constructor(props) {
        super(props);
        this.state = {page: "I"}
    }

    /**
     * Render the Main component.
     * @returns {JSX.Element}
     */
    render() {
        return (
            <div key={"main"} className="Wrapper">
                <div key={"main_0"} className="row">
                    <div key={"main_0_0"} className="col">
                        <div key={"main_0_0_0"} id="color" className="whiteBackground border border-5 border-bottom-0 border-top-0 border-right-0 border-end-0 rounded">
                            <div key={"main_0_0_0_0"} className="text-start ms-3">
                                <Outlet/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function addProps(Component) {
    return props => <Component {...props} params={useParams()}/>;
}

export default addProps(Main);
