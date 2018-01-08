import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../entities/Address';

@Pipe({
  name: 'addressToString'
})
export class AddressToStringPipe implements PipeTransform {

  transform(value: Address): string {
    const address = (value.company) ? [
      value.company,
      value.street,
    ].join(', ') : value.street ;

    const cityState = [
      value.city,
      value.state,
    ].join(', ');

    const a = [
      address,
      cityState,
    ].join(' | ');

    return [
      a,
      value.zipcode,
    ].join(' ');
  }

}
