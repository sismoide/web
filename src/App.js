import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import MyMap from "./Map";
import TableView from "./TableView";

class App extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <h1 className='header-background'>Sismoide</h1>

                    <ul className="header">
                        <li><NavLink to="/">Inicio</NavLink></li>
                        <li><NavLink to="/tableView">Datos tabulados</NavLink></li>
                    </ul>
                    <div className="content">
                        <Route exact path="/" component={MyMap}/>
                        <Route path="/tableView" component={TableView}/>
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default App;
