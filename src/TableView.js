import React, { Component } from "react";
import 'react-moment'
import 'react-table/react-table.css'
import ReportTable from "./ReportTable"
// import Websocket from 'react-websocket';

class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {value: 'Todos', dateOne: new Date(), dateTwo: new Date()};

        this.handleChange = this.handleChange.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleDate(date) {
        this.setState({dateOne: date.target.value});
    }

    render() {
        return (
            <div>
                <h2>DATOS DE TODOS LOS REPORTES</h2>
                <div>
                    <form>
                        Filtrar por fecha:
                        <select value={this.state.value} onChange={this.handleChange}>
                            <option value="Todos">Todos</option>
                            <option value="Últimas 24 horas">Últimas 24 horas</option>
                            <option value="Última semana">Última semana</option>
                            <option value="Último mes">Último mes</option>
                            <option value="Últimos 6 meses">Últimos 6 meses</option>
                        </select>
                    </form>
                </div>
                <ol>
                    <ReportTable filter = {this.state.value}/>
                </ol>
            </div>
        );
    }
}

export default TableView;

/*
<div className='inline'>
    Fecha inicio: <Datetime
    timeFormat={false}
    dateFormat="YYYY/MM/DD"
    defaultValue={myDate.setDate(myDate.getDate() - 36500)}
    onChange={this.handleDate}
/>
</div>
<ol>
<div className='whiteSpaceSquare'>
    </div>
</ol>
<div className='move-left'>
    Fecha fin: <Datetime
    timeFormat={false}
    dateFormat="YYYY/MM/DD"
    defaultValue={new Date()}
/>
    </div>
    */
