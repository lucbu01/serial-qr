import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { generateFull } from 'src/utils/pdf';
import { AppService } from '../services/app.service';
import { ProjectService } from '../services/project.service';
import { ShortcutService } from '../services/shortcut.service';

@Component({
  selector: 'qr-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  items: MenuItem[] = [];
  rightItems: MenuItem[] = [];
  smallerToolbar = true;
  viewEnabled = true;
  mobile = true;

  constructor(
    private appService: AppService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private shortcut: ShortcutService
  ) {}

  ngOnInit(): void {
    this.updateTitle();
    this.subscriptions.push(
      this.projectService.onLoaded.subscribe(() => this.updateTitle()),
      this.appService.promptEventChange.subscribe(() => this.updateMenubar()),
      this.route.params.subscribe((params) => this.init(params['id'])),
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.updateMenubar();
        }
      }),
      this.breakpointObserver
        .observe([Breakpoints.Medium])
        .subscribe((value) => {
          this.smallerToolbar = value.matches;
          this.updateMenubar();
        }),
      this.breakpointObserver
        .observe([
          Breakpoints.Handset,
          Breakpoints.TabletPortrait,
          Breakpoints.Medium
        ])
        .subscribe((value) => {
          this.mobile = value.matches;
          this.projectService.showEdit = !this.mobile && this.viewEnabled;
          this.updateMenubar();
        }),
      this.shortcut
        .get('control', 's')
        .subscribe(() => this.projectService.save()),
      this.shortcut
        .get('control', 'shift', 's')
        .subscribe(() => this.projectService.saveCopy()),
      this.shortcut
        .get('control', 'r')
        .subscribe(() => this.projectService.regenerate()),
      this.shortcut
        .get('control', 'o')
        .subscribe(() => this.projectService.openExisting()),
      this.shortcut
        .get('control', 'shift', 'e')
        .subscribe(() => this.projectService.rename()),
      this.shortcut
        .get('control', 'insert')
        .subscribe(() => this.projectService.createNew()),
      this.shortcut
        .get('control', 'delete')
        .subscribe(() => this.projectService.delete()),
      this.shortcut.get('control', 'shift', 'r').subscribe(() => this.reload()),
      this.shortcut.get('control', 'd').subscribe(() => this.download()),
      this.shortcut
        .get('control', 'i')
        .subscribe(() => this.router.navigateByUrl('/info')),
      this.shortcut
        .get('control', 'h')
        .subscribe(() => this.router.navigateByUrl('/info')),

      this.shortcut
        .get('control', 'e')
        .subscribe(() =>
          this.router.navigate([
            'project',
            this.projectService.activeProject.id,
            'edit'
          ])
        ),
      this.shortcut
        .get('control', 'g')
        .subscribe(() =>
          this.router.navigate([
            'project',
            this.projectService.activeProject.id,
            'preview'
          ])
        ),
      this.shortcut
        .get('control', 'shift', 'g')
        .subscribe(() =>
          this.router.navigate([
            'project',
            this.projectService.activeProject.id,
            'view'
          ])
        ),

      this.shortcut
        .get('control', 'h')
        .subscribe(() => this.router.navigateByUrl('/info'))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  init(id: any): void {
    if (id) {
      this.updateMenubar();
      this.projectService.open(id, false);
    } else {
      this.projectService.openLastViewed();
    }
  }

  toggleView() {
    this.viewEnabled = !this.viewEnabled;
    this.projectService.showEdit = !this.mobile && this.viewEnabled;
    this.updateMenubar();
  }

  async download() {
    await generateFull(
      this.projectService.activeProject.options,
      this.projectService.activeProject.metadata.name,
      true
    );
  }

  reload() {
    this.projectService.open(this.projectService.activeProject.id, false);
  }

  updateTitle() {
    const view = this.router.url.endsWith('/edit')
      ? 'Bearbeiten'
      : this.router.url.endsWith('/preview')
      ? 'Vorschau'
      : 'Ansicht';
    this.appService.screenName = `Projekt ${view}`;
    if (this.projectService.loaded) {
      document.title = `${this.projectService.activeProject.metadata.name} - ${view} - SerialQR`;
    }
  }

  updateMenubar() {
    this.updateTitle();
    this.items = [
      {
        icon: 'material-icons folder',
        label: 'Projekt',
        items: [
          {
            icon: 'material-icons refresh',
            label: 'Neu laden',
            command: () => this.reload()
          },
          {
            icon: 'material-icons save',
            label: 'Speichern',
            command: () => this.projectService.save()
          },
          {
            icon: 'material-icons save_as',
            label: 'Kopie speichern',
            command: () => this.projectService.saveCopy()
          },
          {
            icon: 'material-icons drive_file_rename_outline',
            label: 'Umbenennen',
            command: () => this.projectService.rename()
          },
          {
            icon: 'material-icons delete',
            label: 'Löschen',
            command: () => this.projectService.delete()
          },
          {
            icon: 'material-icons folder_open',
            label: 'Öffnen',
            command: () => this.projectService.openExisting()
          },
          {
            icon: 'material-icons note_add',
            label: 'Neu',
            command: async () => await this.projectService.createNew()
          },
          {
            icon: 'material-icons cloud_download',
            label: 'Importieren',
            command: () => this.projectService.import()
          },
          {
            icon: 'material-icons cloud_upload',
            label: 'Exportieren',
            command: () => this.projectService.export()
          }
        ]
      }
    ];

    const viewItems = [
      {
        icon: 'material-icons edit',
        label: 'Bearbeiten',
        routerLink: 'edit',
        visible: !this.router.url.endsWith('/edit')
      },
      {
        icon: 'material-icons preview',
        label: 'Vorschau',
        routerLink: 'preview',
        visible: !this.router.url.endsWith('/preview')
      },
      {
        icon: 'material-icons description',
        label: 'Generieren und Ansehen',
        routerLink: 'view',
        visible: !this.router.url.endsWith('/view')
      },
      {
        icon: 'material-icons install_desktop',
        label: 'App installieren',
        command: () => this.appService.installPWA(),
        visible: this.appService.shouldInstall()
      }
    ];
    this.rightItems = [
      {
        icon: 'material-icons info',
        tooltip: 'Anleitungen, Hilfe & Infos',
        command: () => this.router.navigate(['/info']),
        visible: true
      },
      {
        icon: 'material-icons file_download',
        tooltip: 'Generieren und Herunterladen',
        command: async () => await this.download(),
        visible: true
      },
      {
        icon: 'material-icons refresh',
        tooltip: 'Neu generieren',
        command: () => this.projectService.regenerate(),
        visible:
          !this.router.url.endsWith('/edit') || this.projectService.showEdit
      },
      {
        icon: 'material-icons fullscreen',
        tooltip: 'Grosser Editierbereich',
        visible:
          this.router.url.endsWith('/edit') &&
          this.projectService.showEdit &&
          !this.mobile,
        command: () => this.toggleView()
      },
      {
        icon: 'material-icons fullscreen_exit',
        tooltip: 'Editieren mit Ansicht',
        visible:
          this.router.url.endsWith('/edit') &&
          !this.projectService.showEdit &&
          !this.mobile,
        command: () => this.toggleView()
      }
    ];
    if (this.smallerToolbar) {
      this.items.push({
        icon: 'material-icons visibility',
        label: 'Ansicht',
        items: viewItems
      });
    } else {
      this.items.push(...viewItems);
    }
  }
}
