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
import FontAwesome from 'react-fontawesome';
import MyMap from "./Map";
import TableView from "./TableView";
import Login from "./Login";



class App extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <h1 className='header-background'>Sismoide</h1>
                    <Navbar>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <NavLink to="/">
                                    <div className='bold-font'>Inicio</div>
                                </NavLink>
                            </Navbar.Brand>
                        </Navbar.Header>
                        <Nav>
                            <NavItem>
                                <NavLink style={{textDecoration: 'none'}} to="/tableView">Datos tabulados</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink style={{textDecoration: 'none'}} to="/login">login</NavLink>
                            </NavItem>
                        </Nav>
                    </Navbar>
                    <div className="content">
                        <Route exact path="/" component={MyMap}/>
                        <Route path="/tableView" component={TableView}/>
                        <Route path="/login" exact component={Login} />
                    </div>
                </div>
            </HashRouter>

        );
    }
}

export default App;
