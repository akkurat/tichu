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

@Pipe({
  name: 'iter',
  standalone: true,
})
export class IterPipe implements PipeTransform {

  transform(value: number|undefined) {
    // let i = 0
    // return {
    //   next() {
    //     const tmp = i
    //     i++
    //     if (value && tmp < value) {
    //       return { done: false, value: tmp }
    //     } else {
    //       return { done: true }
    //     }
    //   },
    //   [Symbol.iterator]() {
    //     return this;
    //   },
    // };
    return value ? [...Array(value).keys()] : []
  }

}

