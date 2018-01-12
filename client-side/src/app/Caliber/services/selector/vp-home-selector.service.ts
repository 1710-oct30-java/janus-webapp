import { Injectable } from '@angular/core';
import { ChartDataEntity } from '../../entities/ChartDataEntity';

@Injectable()
export class VpHomeSelectorService {

  constructor() { }

  /**
   * populates addresses from the results array
   * @param {Array<any>} results
   * @returns {Array<any>}
   * @memberof VpHomeSelectorService
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
   * @param {Array<any>} addresses
   * @returns {Set<string>}
   * @memberof VpHomeSelectorService
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
   * @param {string} state
   * @param {Array<any>} addresses
   * @returns {Set<string>}
   * @memberof VpHomeSelectorService
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
