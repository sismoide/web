import React, { Component } from "react";
import 'react-moment'
import 'react-table/react-table.css'
import ReportTable from "./ReportTable"


class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {value: "Todos",
        };

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
                <ol>
                    <ReportTable/>
                </ol>
            </div>
        );
    }
}

export default TableView;
