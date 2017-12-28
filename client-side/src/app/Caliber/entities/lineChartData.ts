import { Component, OnInit } from '@angular/core';
import { ChartData } from './chartData';

export class LineChartData {
    data: ChartData[];
    labels = [];
    colors = [];
    options: any;
    mainColor = {
        backgroundColor: 'rgba(114, 164, 194, .5)',
        pointBackgroundColor: 'rgba(114, 164, 194, .5)',
        borderColor: 'rgba(114, 164, 194, 1)',
        pointHoverBackgroundColor: 'rgba(114, 164, 194, .3)',
        pointHoverBorderColor: 'rgba(114, 164, 194, .3)',
        pointBorderColor: '#fff'
    };
    secondaryColor = {
        backgroundColor: 'rgba(252, 180, 20, .6)',
        pointBackgroundColor: 'rgba(252, 180, 20, .6)',
        borderColor: 'rgba(252, 180, 20, 1)',
        pointHoverBackgroundColor: 'rgba(252, 180, 20, .3)',
        pointHoverBorderColor: 'rgba(252, 180, 20, .3)',
        pointBorderColor: '#fff'
    };
    type = 'line';

    constructor() {
        this.colors = [this.mainColor, this.secondaryColor];
        this.options = {
            legend: {
                display: true,
                labels: {
                    boxWidth: 10
                }
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Week'
                    }

                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Score'
                    },

                    ticks: {
                        suggestedMin: 40,
                        suggestedMax: 100,
                        stepSize: 20
                    }
                }]
            },
            datasetFill: false,
            tooltips: {
                mode: 'x',
            },
        };
        this.data = [];
    }
}
