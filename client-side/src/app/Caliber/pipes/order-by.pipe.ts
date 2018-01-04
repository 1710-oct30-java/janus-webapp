import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'orderBy'})
export class OrderByPipe implements PipeTransform {

  transform(input: Array<any>, property: string): Array<any> {

    if (!input || !property || this.resolveProperty(input[0], property) === undefined) { return input; }

    input.sort((a: any, b: any) => {
      const propA = this.resolveProperty(a, property);
      const propB = this.resolveProperty(b, property);
      return this.compare(propA, propB);
    });

    return input;
  }

  resolveProperty(obj: any, path: string) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : undefined;
    }, obj || self);
  }

  compare(obj1: any, obj2: any) {
    if (typeof obj1 !== typeof obj2) {
      return 0;
    }

    if (typeof obj1 === typeof '') {
      if (obj1 < obj2) { return -1; }
      if (obj1 > obj2) { return 1; }
      return 0;
    }

    return obj1 - obj2;
  }
}
