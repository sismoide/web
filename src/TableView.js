import React, { Component } from "react";
import 'react-moment'
import 'react-table/react-table.css'
import ReportTable from "./ReportTable"

import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, { formatDate, parseDate, } from 'react-day-picker/moment';
import 'moment/locale/es';

class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {value: "Todos",
                        dateOne: undefined,
                        dateTwo: undefined,
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
        let d = new Date(date);
        //remove time component from date
        let newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        this.setState({dateOne: newDate});
    }

    handleDate2(date) {
        let d = new Date(date);
        //remove time component from date
        let newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        this.setState({dateTwo: newDate});
    }

    toggleDate1() {
        this.setState({dateOneActive: !this.state.dateOneActive});
    }

    toggleDate2() {
        this.setState({dateTwoActive: !this.state.dateTwoActive});
    }

    render() {
        return (
            <div>
                <h2>DATOS DE TODOS LOS REPORTES</h2>
                <div>
                    <form>
                        <div className="form-group row">
                            <label htmlFor="inputPassword" className="col-sm-1 col-form-label">Filtros:
                            </label>

                            <div>
                                <input
                                    type="checkbox"
                                    onChange={this.toggleDate1}/>
                                <span style={{
                                    margin: "auto 5px"
                                }}>Fecha inicial:</span>
                                <DayPickerInput
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    format="DD/MM/YYYY"
                                    placeholder="DD/MM/YYYY"
                                    onDayChange={this.handleDate1}
                                    dayPickerProps={{
                                        onDayClick: this.handleDate1,
                                        selectedDays: this.state.dateOne,
                                        localeUtils: MomentLocaleUtils,
                                        locale: 'es'
                                    }}
                                />
                                <input
                                    type="checkbox"
                                    onChange={this.toggleDate2}
                                    style={{
                                        marginLeft: "30px"}}/>
                                <span
                                    style={{
                                        margin: "auto 5px auto 5px"
                                    }}>Fecha final:</span>
                                <DayPickerInput
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    format="DD/MM/YYYY"
                                    placeholder="DD/MM/YYYY"
                                    onDayChange={this.handleDate2}
                                    dayPickerProps={{
                                        onDayClick: this.handleDate2,
                                        selectedDays: this.state.dateOne,
                                        localeUtils: MomentLocaleUtils,
                                        locale: 'es'
                                    }}
                                />
                            </div>
                        </div>
                    </form>

                </div>

                <ol>
                </ol>
                <ol>
                    <ReportTable
                        filterStart={this.state.dateOne}
                        filterEnd={this.state.dateTwo}
                        startActive={this.state.dateOneActive}
                        endActive={this.state.dateTwoActive}/>
                </ol>
            </div>
        );
    }
}

export default TableView;
