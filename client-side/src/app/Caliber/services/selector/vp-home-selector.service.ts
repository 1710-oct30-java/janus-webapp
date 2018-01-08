import { Injectable } from '@angular/core';
import { ChartDataEntity } from '../../entities/ChartDataEntity';

@Injectable()
export class VpHomeSelectorService {

  constructor() { }
  /**
   * populates addresses from the results array
   * @param results Array<any>
   * @returns Array<any>
   */
  public populateAddresses(results: Array<any>): Array<any> {
    const addresses = [];
    for (const address of results) {
      addresses.push(address.address);
    }
    return addresses;
  }
  /**
   * populates states from the addresses array
   * @param addresses Array<any>
   * @returns Set<String>
   */
  public populateStates(addresses: Array<any>): Set<string> {
    const states = new Set<string>();
    for (const address of addresses) {
      states.add(address.state);
    }
    return states;
  }
  /**
   * populates cities by filtering addresses with states
   * @param state : string
   * @param addresses : Array<any
   * @returns Set<String
   */
  public populateCities(state: string, addresses: Array<any>): Set<string> {
    const cities = new Set<string>();
    for (const address of addresses) {
      if (state === address.state) {
        cities.add(address.city);
      }
    }
    return cities;
  }
}
