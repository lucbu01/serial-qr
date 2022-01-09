import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SerialQRProject, SerialQrProjectMetadata } from 'src/utils/data';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  activeProject: SerialQRProject;

  // eslint-disable-next-line no-unused-vars
  constructor(private router: Router) {
    this.activeProject = this.generateNew(1);
  }

  getLastViewed() {
    const lastViewed = localStorage.getItem('serialqr.lastviewed');
    if (lastViewed) {
      try {
        return parseInt(lastViewed);
      } catch (e) {
        return 1;
      }
    } else {
      return 1;
    }
  }

  openLastViewed() {
    this.open(this.getLastViewed(), true);
  }

  open(id: string | number, redirect: boolean) {
    if (typeof id === 'string') {
      try {
        id = parseInt(id);
      } catch (e) {
        id = this.getLastViewed();
      }
    }
    localStorage.removeItem(`serialqr.project.${id}`);
    const projectData = localStorage.getItem(`serialqr.project.${id}`);
    if (projectData) {
      const projectJSON = JSON.parse(projectData);
      if (projectJSON.serialQRVersion === 1) {
        this.activeProject = projectJSON;
      } else {
        this.activeProject = this.generateNew(id);
        localStorage.setItem(
          `serialqr.project.${id}`,
          JSON.stringify(this.activeProject)
        );
        localStorage.setItem(
          `serialqr.metadatas`,
          JSON.stringify([...this.getMetadatas(), this.activeProject.metadata])
        );
        localStorage.setItem(
          'serialqr.lastviewed',
          `${this.activeProject.metadata.id}`
        );
      }
    } else {
      this.activeProject = this.generateNew(id);
      localStorage.setItem(
        `serialqr.project.${id}`,
        JSON.stringify(this.activeProject)
      );
      localStorage.setItem(
        `serialqr.metadatas`,
        JSON.stringify([...this.getMetadatas(), this.activeProject.metadata])
      );
      localStorage.setItem(
        'serialqr.lastviewed',
        `${this.activeProject.metadata.id}`
      );
    }
    if (redirect) {
      this.router.navigate(['project', id, 'edit']);
    }
  }

  generateNew(id: number): SerialQRProject {
    return {
      serialQRVersion: 1,
      metadata: {
        id,
        name: `Unbenannt ${id}`
      },
      options: {
        print: 'paper',
        margin: {
          top: 10,
          bottom: 10,
          left: 15,
          right: 15
        },
        mergeSameCreditors: true,
        creditor: {
          iban: 'CH5204835012345671000',
          name: 'Firma Muster',
          zipAndPlace: '6000 Luzern',
          country: 'CH'
        },
        debtor: {
          name: 'Familie {Nachname}',
          address: '{Adresse}',
          zipAndPlace: '{PLZ} {Ort}',
          country: 'CH'
        },
        logo: {
          height: 30,
          width: 30,
          location: 'right',
          src: `${location.protocol}//${location.host}/assets/icons/icon-512x512.png`,
          correctionX: 2.9,
          correctionY: 2.9
        },
        headingLocation: 'left',
        headingSize: 9,
        customHeading: [
          { insert: 'Firma Muster', attributes: { bold: true } },
          { insert: '\nMax Muster\nMusterstrasse 35\n6000 Luzern' }
        ],
        addressLocation: 'right',
        showSenderAddress: true,
        addressSize: 10,
        dateFormat: 'long',
        place: 'Luzern',
        title: 'Rechnung für Produkt 25 an {Spitzname ?: Vorname}',
        titleSize: 11,
        textSize: 10,
        textBeforeTable: [
          {
            insert:
              'Liebe Familie {Nachname}\n\nVielen Dank für Ihren Auftrag, welchen ich folgendermassen verrechne:'
          }
        ],
        dataFiles: [
          {
            src: `${location.protocol}//${location.host}/assets/data/sample.xlsx`,
            content: [
              {
                Nachname: 'Meier',
                Vorname: 'Urs',
                Spitzname: 'Ürsu',
                Adresse: 'Kaspergasse 13',
                PLZ: '3525',
                Ort: 'Kasperhausen'
              },
              {
                Nachname: 'Meier',
                Vorname: 'Ursula',
                Spitzname: 'Ursi',
                Adresse: 'Kaspergasse 13',
                PLZ: '3525',
                Ort: 'Kasperhausen'
              },
              {
                Nachname: 'Müller',
                Vorname: 'Kari',
                Spitzname: '',
                Adresse: 'Müllerstrasse 36',
                PLZ: '8256',
                Ort: 'Müllersheim'
              }
            ],
            positions: [
              {
                designation: 'Produkt 25',
                count: '2',
                amount: '100'
              },
              {
                designation: 'Versand',
                amount: '5'
              }
            ]
          }
        ],
        tableTemplate: {
          header: {
            size: 8,
            bold: true,
            italic: false,
            background: '#c8c8c8'
          },
          body: {
            size: 8,
            bold: false,
            italic: false,
            background: '#ffffff'
          },
          footer: {
            size: 8,
            bold: true,
            italic: false,
            background: '#e0e0e0'
          },
          padding: {
            top: 2,
            left: 2,
            right: 2,
            bottom: 2
          },
          showFooter: true,
          showPositionNr: true,
          showLines: true
        },
        textAfterTable: [
          {
            insert: 'Zahlbar innert '
          },
          { insert: '30', attributes: { bold: true } },
          {
            insert: ' Tagen.\n\nFreundliche Grüsse\n\n'
          },
          { insert: 'Max Muster', attributes: { bold: true } },
          { insert: '\nGeschäftsleiter Firma Muster' }
        ],
        message: 'Produkt 25 {Nachname} {Vorname}'
      }
    };
  }

  getMetadatas(): SerialQrProjectMetadata[] {
    const metadata = localStorage.getItem('serialqr.metadatas');
    if (metadata) {
      return JSON.parse(metadata);
    } else {
      return [];
    }
  }
}
