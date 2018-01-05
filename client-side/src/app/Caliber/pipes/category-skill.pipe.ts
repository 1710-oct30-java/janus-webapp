import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../entities/Category';

@Pipe({
  name: 'categorySkill'
})
export class CategorySkillPipe implements PipeTransform {

  transform(value: Category): string {
    return value.skillCategory;
  }

}
