import { Component, OnInit } from '@angular/core';

export class WeeklyProgress {
    address: {
        active: boolean,
        addressId: number,
        city: string,
        company: string,
        state: string,
        street: string,
        zipcode: string,
    };
    grades: any;
    label: String;
    constructor() {}
}
