import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";
import ReactDOM from 'react-dom';
import App from "./App"
import logoprs from './assets/logoprs.png';
import logodgf from './assets/logo_dgf_150px.png';
import Favicon from 'react-favicon';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    fetch("http://server-geoscopio.dgf.uchile.cl/web/get_token", {
      method: "POST",
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state)
    })
    .then(function(res) {
    if (res.ok) {
      return res.json();
    } else {
      return res.json()
        .then(function(err) {
          throw new Error("Hay un problema con el login " + err.message);
        });
    }})
    .then(function(data){
    localStorage.setItem("token", data["token"]);
    ReactDOM.render(
        <App/>,
        document.getElementById("root")
    );
    });
  };

  LoginCheck(){
    if (localStorage.getItem("token") !== null){
      return true
    }
    else {
      return false
    }
  }

  componentWillMount(){
    document.title = "Geoscopio"
    if (this.LoginCheck()){
      ReactDOM.render(
          <App/>,
          document.getElementById("root")
      );
    }
  }

  render() {
    return (

      <div className="Login">
      <div>
        <Favicon url="" />
      </div>
      <div align="center">

        <img src={logoprs} width="150" height="150" />
        <img src={logodgf} width="150" height="150" />
      </div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>Usuario</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Contraseña</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Ingresar al sistema
          </Button>

        </form>
      </div>
    );
  }
}
