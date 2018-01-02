import { Component, OnInit } from '@angular/core';

export class ChartData {
    data: any[];
    label: any;
    fill: boolean;
    constructor() {
        this.data = [];
        this.fill = false;
    }

}
