import { Injectable } from '@angular/core';

@Injectable()
export class VpHomeSelectorService {

  constructor() { }
  populateAddresses(results) {
    const addresses = [];
    for (const address of results) {
      addresses.push(address.address);
    }
    return addresses;
  }
  populateStates(addresses) {
    const states = new Set<string>();
    for (const address of addresses) {
      states.add(address.state);
    }
    return states;
  }
  populateCities(state, addresses) {
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
