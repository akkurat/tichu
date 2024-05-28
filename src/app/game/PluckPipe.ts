import { Pipe, PipeTransform } from '@angular/core';

// todo: make game basically hull only for nav
// having guards for game state

@Pipe({
  name: 'pluck',
  standalone: true,
})
export class PluckPipe implements PipeTransform {

  transform(value: any[], property = "key") {
    return value.map(v => v[property]);
  }

}
