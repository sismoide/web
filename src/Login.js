import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";
// import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App"

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

    fetch("http://172.17.71.14:7171/web/get_token", {
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
          throw new Error("There's an error upstream and it says " + err.message);
        });
    }})
    .then(function(data){
    localStorage.setItem("token", data["token"]);
    let text=localStorage.getItem("token");
    console.log(text);
    ReactDOM.render(
        <App/>,
        document.getElementById("root")
    );
    });
  };

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>username</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
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
            Login
          </Button>

        </form>
      </div>
    );
  }
}
