import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, ReplaySubject, buffer, concat, concatAll, connect, debounceTime, delay, map, merge, mergeAll, scan, switchAll, switchMap, timeInterval } from 'rxjs';


type N<T> = NonNullable<T>;

function bufferRing<T>(size: number): OperatorFunction<T, N<T>[]> {
  return scan((acc, curr) => curr ? [curr, ...acc].slice(0, size) : new Array<N<T>>,
    new Array<N<T>>)
}

type Msg = {
  date: string;
  message: any;
};

@Injectable({
  providedIn: 'root'
})
export class SnackService {
  messages = new Array<Msg>
  protected _out$ = new ReplaySubject<Msg>(1)

  out$ = this._out$.pipe(
    connect(s$ => merge(s$, s$.pipe(debounceTime(10000), map(() => null)))),
    bufferRing(15)
  )


  constructor() {
  }

  push(message: string) {
    const msg = { date: new Date().toLocaleTimeString(), message }
    this.messages.push(msg)
    this._out$.next(msg)
  }
}
