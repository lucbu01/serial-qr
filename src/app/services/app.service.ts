import { HostListener, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  promptEventChange: ReplaySubject<any> = new ReplaySubject<any>();
  promptEvent?: any;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    this.promptEvent = e;
    this.promptEventChange.next(this.promptEvent);
  }

  public installPWA() {
    if (this.promptEvent) {
      this.promptEvent.prompt();
      this.promptEvent.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          this.promptEvent = undefined;
          this.promptEventChange.next(undefined);
        }
      });
    }
  }

  constructor() {
    window.addEventListener('beforeinstallprompt', (event) =>
      this.onbeforeinstallprompt(event)
    );
  }

  public shouldInstall(): boolean {
    return !this.isRunningStandalone() && this.promptEvent !== undefined;
  }

  public isRunningStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches;
  }
}
