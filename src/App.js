import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import {
    Nav,
    Navbar,
    NavItem
} from "react-bootstrap";
import MyMap from "./Map";
import TableView from "./TableView";
//import Login from "./Login"

class App extends Component {
    render() {
        return (
            <HashRouter>
                <div className="complete">
                    <h1 className='header-background'>
                        <h1 className="header-text">Geoscopio</h1>
                    </h1>

                    <Navbar className="navbar-background">
                        <Nav>
                            <NavItem>
                                <NavLink className="navbar-init-text" style={{textDecoration: 'none'}} to="/">
                                    <div>
                                        Inicio
                                    </div>
                                </NavLink>
                            </NavItem>
                        </Nav>

                        <Nav className="divider-vertical">
                        </Nav>

                        <Nav>
                            <NavItem>
                                <NavLink className="navbar-text" style={{textDecoration: 'none'}} to="/tableView">
                                    <div>
                                        Datos tabulados
                                    </div>
                                </NavLink>
                            </NavItem>
                        </Nav>

                        <Nav className="divider-vertical">
                        </Nav>

                    </Navbar>

                    <div className="complete">
                        <Route exact path="/" component={MyMap}/>
                        <Route path="/tableView" component={TableView}/>
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default App;
