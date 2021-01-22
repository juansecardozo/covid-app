import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Chart from "../Chart";
import Table from "../Table";
import Tabs from "../Tabs";
import TabPane from "../Tabs/TabPane";

export default function Country() {
    const [state, setState] = useState({});
    const [timeline, setTimeline] = useState({});
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    let { id } = useParams();
    const columns = [
        {
            Header: "Date",
            accessor: "date"
        },
        {
            Header: "New cases",
            accessor: "cases"
        },
        {
            Header: "Patient recovered",
            accessor: "recovered"
        },
        {
            Header: "Deaths",
            accessor: "deaths"
        }
    ];

    useEffect(() => {
        let fetchAll = async () => {
            try {
                setLoading(true);
                let response = await axios.get(`/api/countries/${id}`);
                let { data } = response.data;
                setState(data);
                setTimeline(data.timeline);
                let tableRows = [];
                for (let i in data.timeline) {
                    let timeline = data.timeline[i];
                    for (let k in timeline) {
                        let reg = timeline[k];
                        if (typeof tableRows[reg.date] === "undefined") {
                            let obj = {};
                            obj["date"] = reg.date;
                            obj[i] = reg.stats;
                            tableRows[reg.date] = obj;
                        } else {
                            let obj = tableRows[reg.date];
                            obj[i] = reg.stats;
                            tableRows[reg.date] = obj;
                        }
                    }
                }
                let objects = [];
                for (let i in tableRows) {
                    objects.push(tableRows[i]);
                }
                setRows(objects);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const dateFormat = unix => {
        let date = new Date(unix);
        return date.toLocaleString();
    };

    return loading ? (
        <div className="row justify-content-center align-items-center min-vh-100">
            <p className="h3">Loading...</p>
        </div>
    ) : error ? (
        <div className="row justify-content-center align-items-center min-vh-100">
            <p className="h3">Not available.</p>
        </div>
    ) : (
        <div className="row">
            <div className="col-12">
                <h2 className="text-center my-5">{state.country}</h2>
                <p>Updated on: {dateFormat(state.updated)}</p>
            </div>
            <div className="col-12">
                <div className="row justify-content-center">
                    <div className="col-6">
                        <Chart
                            id="graph"
                            title="New cases per day"
                            data={timeline.cases}
                        />
                    </div>
                    <div className="col-6">
                        <Chart
                            id="graph-1"
                            title="Patient recovered per day"
                            data={timeline.recovered}
                        />
                    </div>
                    <div className="col-6">
                        <Chart
                            id="graph-2"
                            title="Deaths per day"
                            data={timeline.deaths}
                        />
                    </div>
                </div>
            </div>
            <div className="col-12">
                <Tabs>
                    <TabPane name="General data" key="1">
                        <div className="col-12 mt-3">
                            <div className="row justify-content-center">
                                <div className="col-6">
                                    <div className="card mb-3">
                                        <div className="card-body text-center">
                                            <p className="h3 my-5">
                                                {state.cases}
                                            </p>
                                            <p className="my-0">Total cases</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="card mb-3">
                                        <div className="card-body text-center">
                                            <p className="h3 my-5">
                                                {state.todayCases}
                                            </p>
                                            <p className="my-0">New cases</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="card mb-3">
                                        <div className="card-body text-center">
                                            <p className="h3 my-5">
                                                {state.recovered}
                                            </p>
                                            <p className="my-0">
                                                Total recovered
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="card mb-3">
                                        <div className="card-body text-center">
                                            <p className="h3 my-5">
                                                {state.todayRecovered}
                                            </p>
                                            <p className="my-0">
                                                New recovered
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="card mb-3">
                                        <div className="card-body text-center">
                                            <p className="h3 my-5">
                                                {state.deaths}
                                            </p>
                                            <p className="my-0">Total deaths</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="card mb-3">
                                        <div className="card-body text-center">
                                            <p className="h3 my-5">
                                                {state.todayDeaths}
                                            </p>
                                            <p className="my-0">New deaths</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="card mb-3">
                                        <div className="card-body text-center">
                                            <p className="h3 my-5">
                                                {state.tests}
                                            </p>
                                            <p className="my-0">Total tests</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane name="Data per day" key="2">
                        <Table columns={columns} data={rows} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}
