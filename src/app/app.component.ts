import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'qr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // eslint-disable-next-line no-unused-vars
  constructor(private primeConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.primeConfig.ripple = true;
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
      dateFormat: 'dd.mm.yyyy',
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
  }
}
