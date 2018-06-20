import React, { Component } from "react";
import 'react-moment'
import 'react-table/react-table.css'
import ReportTable from "./ReportTable"

class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {value: 'Todos', dateOne: new Date(), dateTwo: new Date()};

        this.handleChange = this.handleChange.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleDate1 = this.handleDate1.bind(this);
        this.handleDate2 = this.handleDate2.bind(this);
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

    render() {
        return (
            <div>
                <h2>DATOS DE TODOS LOS REPORTES</h2>
                <div>
                    <form>
                      <div class="form-group row">
                        <label for="inputPassword" class="col-sm-1 col-form-label">Filtrar por fecha:</label>
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
                              <span>Fecha inicial:</span>
                              <input type="datetime-local" onChange={this.handleDate1}/>
                              <span>Fecha final:</span>
                              <input type="datetime-local" onChange={this.handleDate2}/>
                          </div>
                      </div>
                    </form>
                    {/*<form>
                        <label>Filtrar por fecha:</label>
                        <div>
                            <DateFilter text={"Fecha inicial"}/>
                            <DateFilter text={"Fecha final"}/>
                        </div>
                    </form>*/}

                </div>

                <ol>
                </ol>
                <ol>
                    {/*<ReportTable filter = {this.state.value}/>*/}
                    <ReportTable filterStart={this.state.dateOne}
                                    filterEnd={this.state.dateTwo}/>
                </ol>
            </div>
        );
    }
}

export default TableView;
