import React, { Component } from "react";
import 'react-moment'
import 'react-table/react-table.css'
import ReportTable from "./ReportTable"

class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {value: "Todos",
                        dateOne: new Date(),
                        dateTwo: new Date(),
                        dateOneActive: false,
                        dateTwoActive: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleDate1 = this.handleDate1.bind(this);
        this.handleDate2 = this.handleDate2.bind(this);
        this.toggleDate1 = this.toggleDate1.bind(this);
        this.toggleDate2 = this.toggleDate2.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleDate(date) {
        this.setState({dateOne: date.target.value});
    }

    handleDate1(date) {
        this.setState({dateOne: date.target.value});
    }

    handleDate2(date) {
        this.setState({dateTwo: date.target.value});
    }

    toggleDate1() {
        if (this.state.dateOneActive){
            this.setState({dateOneActive: false})
        }
        else {
            this.setState({dateOneActive: true})
        }
    }

    toggleDate2() {
        if (this.state.dateTwoActive){
            this.setState({dateTwoActive: false})
        }
        else {
            this.setState({dateTwoActive: true})
        }
    }

    render() {
        return (
            <div>
                <h2>DATOS DE TODOS LOS REPORTES</h2>
                <div>
                    <form>
                      <div className="form-group row">
                        <label htmlFor="inputPassword" className="col-sm-1 col-form-label">Filtrar por fecha:</label>
                          {/*<div class="col-sm-3">
                          <select class="form-control" value={this.state.value} onChange={this.handleChange}>
                              <option value="Todos">Todos</option>
                              <option value="Últimas 24 horas">Últimas 24 horas</option>
                              <option value="Última semana">Última semana</option>
                              <option value="Último mes">Último mes</option>
                              <option value="Últimos 6 meses">Últimos 6 meses</option>
                          </select>
                        </div>*/}
                          <div>
                              <input type="checkbox" onChange={this.toggleDate1}/>
                              <span style={{
                                  margin: "auto 5px"
                              }}>Fecha inicial:</span>
                              <input type="datetime-local" onChange={this.handleDate1}/>
                              <input type="checkbox" onChange={this.toggleDate2}
                                style={{
                                    marginLeft: "30px"
                                }}/>
                              <span style={{
                                  margin: "auto 5px auto 5px"
                              }}>Fecha final:</span>
                              <input type="datetime-local" onChange={this.handleDate2}/>
                          </div>
                      </div>
                    </form>

                </div>

                <ol>
                </ol>
                <ol>
                    <ReportTable filterStart={this.state.dateOne}
                                    filterEnd={this.state.dateTwo}
                                    startActive={this.state.dateOneActive}
                                    endActive={this.state.dateTwoActive}/>
                </ol>
            </div>
        );
    }
}

export default TableView;
