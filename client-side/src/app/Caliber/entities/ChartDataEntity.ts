import { Component, OnInit } from '@angular/core';
import { DataSet } from './DataSet';

// the object used for the ng2-charts
export class ChartDataEntity {
    data: DataSet[];
    labels = [];
    colors = [];
    options: any;
    mainColor = {
        backgroundColor: 'rgba(114, 164, 194, .5)',
        pointBackgroundColor: 'rgba(114, 164, 194, .5)',
        borderColor: 'rgba(114, 164, 194, 1)',
        pointHoverBackgroundColor: 'rgba(114, 164, 194, .3)',
        pointHoverBorderColor: 'rgba(114, 164, 194, .3)',
        pointBorderColor: '#fff',
        borderWidth: 2
    };
    secondaryColor = {
        backgroundColor: 'rgba(252, 180, 20, .6)',
        pointBackgroundColor: 'rgba(252, 180, 20, .6)',
        borderColor: 'rgba(252, 180, 20, 1)',
        pointHoverBackgroundColor: 'rgba(252, 180, 20, .3)',
        pointHoverBorderColor: 'rgba(252, 180, 20, .3)',
        pointBorderColor: '#fff',
        borderWidth: 2
    };
    type: String;

    constructor() {}
}
