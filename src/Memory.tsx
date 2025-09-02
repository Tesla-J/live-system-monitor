import React, { Component } from "react";
import Chart from "react-apexcharts";

class MemoryChart extends Component {
    private websocket;
    // @ts-ignore
    constructor(props) {
        super(props);

        this.state = {
            options: {
                dataLabels : {
                    enabled: false,
                },
                chart: {
                    id: "mem-chart",
                },
                yaxis: {
                    min: 0,
                    max: 100,
                    title: {
                        text: 'Usage',
                    },
                },
                xaxis: {
                    categories: Array.from({length: 61}, (_, l) => l),
                    labels: {
                        // @ts-ignore
                        formatter: function(val){
                            if ([60, 50, 40, 30, 20, 10, 0].includes(val))
                                return `${(60 - val)}s`;
                            return '';
                        }
                    }
                },
                stroke: {
                    curve: 'smooth',
                    //colors: ['#ff4488'],
                },
            },
            series: [
                {
                    name: "RAM",
                    data: Array.from({length:61}, (_, l) => 0)//Math.round(Math.random() * 100))//[30, 40, 45, 50, 49, 60, 70, 91, 33, 12, 34, 55, 67, 88, 9, 5]
                },
            ],
        };
        // Websocket Approach
        this.websocket = new WebSocket('ws://localhost:6789');
        this.websocket.onopen = function() {
            console.log('Connected to the server');
        };
        this.websocket.onmessage = this.onUpdate
        this.websocket.onclose = function() {
            console.log('Disconnected from the server');
        };
        this.websocket.onerror = function(error) {
            console.error('WebSocket error:', error);
        };
    }

    render() {
        return (
            <div className="app">
                <div className="row">
                    <div className="mixed-chart">
                        <h1>RAM</h1>
                        <Chart
                            // @ts-ignore
                            options={this.state.options}
                            // @ts-ignore
                            series={this.state.series}
                            type="area"
                            width="600"
                        />
                    </div>
                </div>
            </div>
        );
    }

    private onUpdate = (event: any) => {
        const data = JSON.parse(event.data);
        this.updateMemory([data[1]]);
        console.log('Received data:', data);
    }

    public updateMemory(value: Array<number>) {
        this.setState(actualSeries => {
            // @ts-ignore
            const newSeries = actualSeries.series.map((s, i) => {
                //if (i == 0){
                    // @ts-ignore
                    let array = [...s.data]
                    let tmp = array[array.length - 1];
                    array[array.length - 1] = value[i];
                    for (let i = array.length - 2; i > -1; i--) {
                        array[i] += tmp;
                        tmp = array[i] - tmp;
                        array[i] = array[i] - tmp;
                    }
                    return {...s, data: array}
                //}
                //return s
            })
            return {series: newSeries}
        });
    }
}

export default MemoryChart;

/*
this.setState(actualSeries => {
            // @ts-ignore
            const newSeries = actualSeries.series.map((s, i) => {
                if (i == 0){
                    // @ts-ignore
                    let array = [...s.data]
                    let tmp = array[array.length - 1];
                    array[array.length - 1] = value;
                    for (let i = array.length - 2; i > -1; i--) {
                        array[i] += tmp;
                        tmp = array[i] - tmp;
                        array[i] = array[i] - tmp;
                    }
                    return {...s, array}
                }
                return s
            })
            return {series: newSeries}
        });
 */

/*
// @ts-ignore
        let array = this.state.series[0].data
        let tmp = array[array.length - 1];
        array[array.length - 1] = value;
        for (let i = array.length - 2; i > -1; i--) {
            array[i] += tmp;
            tmp = array[i] - tmp;
            array[i] = array[i] - tmp;
        }
        this.setState({
            series: array
        });
 */