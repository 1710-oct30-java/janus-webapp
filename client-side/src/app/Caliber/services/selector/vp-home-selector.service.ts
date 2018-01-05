import { Injectable } from '@angular/core';
import { ChartDataEntity } from '../../entities/ChartDataEntity';

@Injectable()
export class VpHomeSelectorService {

  constructor() { }
  public populateAddresses(results) {
    const addresses = [];
    for (const address of results) {
      addresses.push(address.address);
    }
    return addresses;
  }
  public populateStates(addresses) {
    const states = new Set<string>();
    for (const address of addresses) {
      states.add(address.state);
    }
    return states;
  }
  public populateCities(state, addresses) {
    const cities = new Set<string>();
    for (const address of addresses) {
      console.log(address.state);
      if (state === address.state) {
        cities.add(address.city);
      }
    }
    return cities;
  }
}
