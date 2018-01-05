import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filterBy'})
export class FilterByPipe implements PipeTransform {

  transform(input: Array<any>, property: string, value: any): Array<any> {

    if (!input || !property || !value || this.resolveProperty(input[0], property) === undefined) {
      return input;
    }

    input = input.filter((item) => {
      const prop = this.resolveProperty(item, property);
      return prop === value;
    });

    return input;
  }

  resolveProperty(obj: any, path: string) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : undefined;
    }, obj || self);
  }
}
