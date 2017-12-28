import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'displayTier'
})
// pipe to properly display the tier of a trainer
export class TierPipe implements PipeTransform {
    transform(tier: String) {
       let index = 0;
       while (tier.charAt(index) !== '_') {
           index++;
       }
       return tier.substring(index + 1);
    }
}
