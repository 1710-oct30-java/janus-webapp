import { Component, OnInit } from '@angular/core';

// object for dataset aspect of ng2-charts
export class DataSet {
    data: any[];
    label: any;
    fill: boolean;
    stack: string;
    id: any;
    constructor() {
        this.data = [];
    }

}
