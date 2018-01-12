import { Pipe, PipeTransform } from '@angular/core';

const TYPE_OBJ = typeof {};
const TYPE_ARR = typeof [];

@Pipe({
  name: 'arrToString'
})
export class ArrToStringPipe implements PipeTransform {

  /**
   * Adds spacing between elements in a string array. Specifically used for
   * the topics covered in a given week.
   *
   * @param {Array<String>} arr Array of topic strings covered in a given week.
   * @returns {string} A formatted array string to add spacing between elements.
   * @memberof WeeklyFeedbackComponent
   */
  transform(arr: any): string {

    let result = '';

    for (let i = 0; i < arr.length; i++) {
      if (i > 0) {
        result += ', ';
      }
      result += arr[i];
    }

    return result;
  }

}
