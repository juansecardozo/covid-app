import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Chart from "../Chart";
import Table from "../Table";
import Tabs from "../Tabs";
import TabPane from "../Tabs/TabPane";

export default function Home() {
    const [countries, setCountries] = useState({});
    const [timeline, setTimeline] = useState({});
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const columns_ = [
        {
            Header: "Country",
            accessor: "country"
        },
        {
            Header: "Total cases",
            accessor: "cases"
        },
        {
            Header: "New cases",
            accessor: "todayCases"
        },
        {
            Header: "Total recovered",
            accessor: "recovered"
        },
        {
            Header: "New recovered",
            accessor: "todayRecovered"
        },
        {
            Header: "Total deaths",
            accessor: "deaths"
        },
        {
            Header: "New deaths",
            accessor: "todayDeaths"
        },
        {
            Header: "Total tests",
            accessor: "tests"
        },
        {
            Header: "Updated at",
            accessor: "updated"
        }
    ];

    useEffect(() => {
        let fetchAll = async () => {
            try {
                setLoading(true);
                let response = await axios.get(`/api/countries`);
                let res = await axios.get(`/api/historical`);
                let { data } = response.data;
                setCountries(data);
                setTimeline(res.data.data);
                let tl = res.data.data;
                let tableRows = [];
                for (let i in tl) {
                    let timeline = tl[i];
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
                <h2 className="text-center my-5">Global data</h2>
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
                        <Table
                            columns={columns_}
                            data={countries}
                            clickable={true}
                        />
                    </TabPane>
                    <TabPane name="Data per day" key="2">
                        <Table columns={columns} data={rows} highlight={true} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}
