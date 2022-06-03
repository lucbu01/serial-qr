import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { PrimeNGConfig } from 'primeng/api';
import { debounceTime, filter } from 'rxjs';
import { AppService } from './services/app.service';

declare let gtag: Function;

@Component({
  selector: 'qr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private appService: AppService,
    private primeConfig: PrimeNGConfig,
    private swUpdate: SwUpdate,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.primeConfig.ripple = true;
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(() => {
        this.swUpdate.activateUpdate().then(() => document.location.reload());
      });
    }
    this.primeConfig.setTranslation({
      startsWith: 'Startet mit',
      contains: 'Beinhaltet',
      notContains: 'Beinhaltet nicht',
      endsWith: 'Endet mit',
      equals: 'Entspricht',
      notEquals: 'Entspricht nicht',
      noFilter: 'Kein Filter',
      lt: 'Kleiner als',
      lte: 'Kleiner als oder gleich wie',
      gt: 'Grösser als',
      gte: 'Grösser als oder gleich wie',
      is: 'Ist',
      isNot: 'Ist nicht',
      before: 'Vor',
      after: 'Nach',
      dateIs: 'Datum ist',
      dateIsNot: 'Datum ist nicht',
      dateBefore: 'Datum ist bevor',
      dateAfter: 'Datum ist danach',
      clear: 'Zurücksetzen',
      apply: 'Anwenden',
      matchAll: 'Entspricht allem',
      matchAny: 'Entspricht etwas',
      addRule: 'Regel hinzufügen',
      removeRule: 'Regel entfernen',
      accept: 'Ja',
      reject: 'Nein',
      choose: 'Auswählen',
      upload: 'Hochladen',
      cancel: 'Abbrechen',
      dayNames: [
        'Sonntag',
        'Montag',
        'Dienstag',
        'Mittwoch',
        'Donnerstag',
        'Freitag',
        'Samstag'
      ],
      dayNamesShort: ['Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'],
      dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      monthNames: [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember'
      ],
      monthNamesShort: [
        'Jan',
        'Feb',
        'Mär',
        'Apr',
        'Mai',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Okt',
        'Nov',
        'Dez'
      ],
      dateFormat: 'dd.mm.yy',
      firstDayOfWeek: 1,
      today: 'Heute',
      weekHeader: 'Wk',
      weak: 'Dünn',
      medium: 'Normal',
      strong: 'Dick',
      passwordPrompt: 'Passwort eingeben',
      emptyMessage: 'Keine Resultate vorhanden',
      emptyFilterMessage: 'Keine Resulate gefunden'
    });
    this.setUpAnalytics();
  }

  setUpAnalytics() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        debounceTime(100)
      )
      .subscribe((event: any) => {
        gtag('config', 'G-R44F20TT3N', {
          app_name: 'SerialQR',
          screen_name: this.appService.screenName,
          page_title: this.appService.screenName,
          page_location: (event as NavigationEnd).urlAfterRedirects.replace(
            /\/\d+\//,
            '/'
          ),
          page_path: (event as NavigationEnd).urlAfterRedirects.replace(
            /\/\d+\//,
            '/'
          )
        });
      });
  }
}
