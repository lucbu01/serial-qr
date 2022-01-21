import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable, share } from 'rxjs';
import { KeyValue } from 'src/utils/data';

@Injectable({
  providedIn: 'root'
})
export class ShortcutService {
  private observables: KeyValue<Observable<void>> = {};

  constructor(
    private eventManager: EventManager,
    @Inject(DOCUMENT) private document: Document
  ) {}

  get(...keys: string[]) {
    const event = `keydown.${keys.join('.')}`;
    if (this.observables[event]) {
      return this.observables[event];
    } else {
      const observable = new Observable<void>((subscriber) => {
        const listener = (e: Event) => {
          e.preventDefault();
          subscriber.next();
          return false;
        };
        const dispose = this.eventManager.addEventListener(
          this.document as any,
          event,
          listener
        );
        return () => {
          dispose();
        };
      }).pipe(share());
      this.observables[event] = observable;
      return observable;
    }
  }
}
