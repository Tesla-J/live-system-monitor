import React, { Component } from "react";
import Chart from "react-apexcharts";

class CPUChart extends Component {
    private intervalId;
    // @ts-ignore
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: "cpu-chart"
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
                yaxis: {
                    min: 0,
                    max: 100
                },
                stroke: {
                    curve: 'smooth'
                },
            },
            series: [
                {
                    name: "CPU 1",
                    data: Array.from({length:61}, (_, l) => 0)//Math.round(Math.random() * 100))//[30, 40, 45, 50, 49, 60, 70, 91, 33, 12, 34, 55, 67, 88, 9, 5]
                },
                // TODO pode apagar isso abaixo se nao for o objectivo controlar mais de um nucleo
                {
                    name: `CPU 2`,
                    data: Array.from({length:61}, (_, l) => Math.round(Math.random() * 10))
                }
            ]
        };
        this.intervalId = setInterval(this.onUpdate, 1000);
    }

    render() {
        return (
            <div className="app">
                <div className="row">
                    <div className="mixed-chart">
                        <h1>CPU</h1>
                        <Chart
                            // @ts-ignore
                            options={this.state.options}
                            // @ts-ignore
                            series={this.state.series}
                            type="line"
                            width="600"
                        />
                    </div>
                </div>
            </div>
        );
    }

    private onUpdate = () => {
        this.updateCPU([Math.round(Math.random() * 40 + 20),Math.round(Math.random() * 50 + 30)]);
    }

    public updateCPU(value: Array<number>) {
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

export default CPUChart;

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