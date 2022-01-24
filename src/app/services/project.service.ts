import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { liveQuery } from 'dexie';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ReplaySubject, Subject } from 'rxjs';
import { SerialQRProject, SerialQrProjectMetadata } from 'src/utils/data';
import { db } from 'src/utils/db';
import { ProjectsComponent } from '../dialog/projects/projects.component';
import { RenameComponent } from '../dialog/rename/rename.component';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  activeProject: SerialQRProject;
  readonly regenerateEvent: Subject<void> = new Subject();
  readonly onLoaded: ReplaySubject<SerialQRProject> = new ReplaySubject();
  showEdit = false;
  loaded = false;

  metadata: SerialQrProjectMetadata[] = [];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private confirm: ConfirmationService,
    private dialog: DialogService
  ) {
    this.activeProject = this.generateNew({ name: 'Unbenannt' });
    liveQuery(() => db.metadata.toArray()).subscribe(
      (metadata) => (this.metadata = metadata)
    );
  }

  regenerate() {
    this.regenerateEvent.next();
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

  openExisting() {
    this.dialog
      .open(ProjectsComponent, {
        header: 'Projekt wählen',
        data: {
          delete: () => this.delete(),
          rename: () => this.rename(),
          selectionMode: 'single',
          buttonText: 'Öffnen'
        }
      })
      .onClose.subscribe((result?: SerialQrProjectMetadata) => {
        if (result && result.id) {
          this.open(result.id, true);
        }
      });
  }

  async createNew() {
    await this.open(-1, true);
    this.rename('Name wählen');
  }

  delete() {
    this.confirm.confirm({
      header: 'Projekt löschen?',
      message: `Bist du sicher, dass du das Projekt "${this.activeProject.metadata.name}" löschen willst?<br>Dieser Vorgang kann nicht rückgängig gemacht werden!`,
      accept: async () => {
        const id = this.activeProject.id;
        const metadata = await db.metadata
          .where('id')
          .notEqual(this.activeProject.id)
          .last();
        if (metadata && metadata.id) {
          await this.open(metadata.id, true);
        } else {
          await this.open(-1, true);
        }
        db.projects.delete(id);
        db.metadata.delete(id);
      }
    });
  }

  rename(header = 'Umbenennen') {
    this.dialog
      .open(RenameComponent, {
        header,
        data: this.activeProject.metadata
      })
      .onClose.subscribe(async (result) => {
        if (result) {
          this.activeProject.metadata.name = result;
          await db.metadata.update(
            this.activeProject.id,
            this.activeProject.metadata
          );
          await db.projects.update(this.activeProject.id, this.activeProject);
          this.onLoaded.next(this.activeProject);
        }
      });
  }

  async open(id: string | number, redirect: boolean) {
    if (typeof id === 'string') {
      try {
        id = parseInt(id);
      } catch (e) {
        id = this.getLastViewed();
        redirect = true;
      }
    }
    let projectData = await db.projects.get(id);
    if (!projectData && id >= 0) {
      const metadata = await db.metadata.orderBy('id').last();
      if (metadata && metadata.id) {
        projectData = await db.projects.get(metadata.id);
        if (projectData) {
          id = projectData.id;
          redirect = true;
        }
      }
    }
    if (projectData) {
      if (projectData.serialQRVersion === 1) {
        this.activeProject = projectData;
      } else {
        id = await db.metadata.add({ name: 'AUTOCREATED' });
        await db.metadata.update(id, { name: `Unbenannt (${id})` });
        this.activeProject = this.generateNew(
          (await db.metadata.get(id)) as SerialQrProjectMetadata
        );
        await db.projects.put(this.activeProject, id);
        redirect = true;
      }
    } else {
      id = await db.metadata.add({ name: 'AUTOCREATED' });
      await db.metadata.update(id, { name: `Unbenannt (${id})` });
      this.activeProject = this.generateNew(
        (await db.metadata.get(id)) as SerialQrProjectMetadata
      );
      await db.projects.put(this.activeProject, id);
      redirect = true;
    }
    localStorage.setItem('serialqr.lastviewed', `${id}`);
    this.regenerate();
    this.loaded = true;
    this.onLoaded.next(this.activeProject);
    if (redirect) {
      this.redirect(id);
    }
  }

  save() {
    db.metadata.put(this.activeProject.metadata, this.activeProject.id);
    db.projects.put(this.activeProject, this.activeProject.id);
    this.messageService.add({
      severity: 'success',
      summary: 'Projekt gespeichert',
      detail: 'Du kannst es beim nächsten mal wiederverwenden!'
    });
  }

  saveCopy() {
    this.dialog
      .open(RenameComponent, {
        header: 'Kopie speichern',
        data: { id: 0, name: this.activeProject.metadata.name }
      })
      .onClose.subscribe(async (result) => {
        if (result) {
          this.activeProject.metadata.name = result;
          this.activeProject.metadata.id = undefined;
          const id = await db.metadata.add(this.activeProject.metadata);
          this.activeProject.metadata.id = id;
          this.activeProject.id = id;
          await db.projects.put(this.activeProject, id);
          this.onLoaded.next(this.activeProject);
          this.redirect(id);
        }
      });
  }

  redirect(id: number) {
    if (this.router.url.endsWith('/preview')) {
      this.router.navigate(['project', id, 'preview']);
    } else if (this.router.url.endsWith('/view')) {
      this.router.navigate(['project', id, 'view']);
    } else {
      this.router.navigate(['project', id, 'edit']);
    }
  }

  generateNew(metadata: SerialQrProjectMetadata): SerialQRProject {
    return {
      serialQRVersion: 1,
      id: metadata.id ? metadata.id : 9999,
      metadata,
      options: {
        print: 'paper',
        margin: {
          top: 15,
          bottom: 15,
          left: 25,
          right: 25
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
          height: 32,
          width: 32,
          location: 'left',
          src: `${location.protocol}//${location.host}/assets/icons/icon-512x512.png`,
          correctionX: 0,
          correctionY: 2.8
        },
        headingLocation: 'logo_left',
        headingSize: 8,
        customHeading: [
          { insert: 'Firma Muster', attributes: { bold: true } },
          {
            insert:
              '\nMax Muster\nMusterstrasse 35\n6000 Luzern\n\nwww.firmamuster.ch\n+41 12 345 67 89\nmail@firmamuster.ch'
          }
        ],
        addressLocation: 'right',
        showSenderAddress: true,
        addressSize: 10,
        dateFormat: 'long',
        place: 'Luzern',
        title: 'Rechnung für Produkt 25 an {[Spitzname ?: Vorname]}',
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
                designation: 'Produkt 25 {Spitzname ?: Vorname}',
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
            size: 10,
            bold: true,
            italic: false,
            background: '#c8c8c8'
          },
          body: {
            size: 10,
            bold: false,
            italic: false,
            background: '#ffffff'
          },
          footer: {
            size: 10,
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
          striped: true,
          showFooter: true,
          showPositionNr: true,
          showLines: false,
          designation: 'Bezeichnung'
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
          {
            insert: '\nGeschäftsleiter Firma Muster'
          }
        ],
        message: 'Produkt 25 {Nachname} {[Vorname]}'
      }
    };
  }
}
