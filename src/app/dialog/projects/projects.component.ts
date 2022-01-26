import { Component, OnDestroy, OnInit } from '@angular/core';
import { liveQuery, Subscription } from 'dexie';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SerialQrProjectMetadata } from 'src/utils/data';
import { db } from 'src/utils/db';

@Component({
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  metadata: SerialQrProjectMetadata[] = [];
  selectedMetadata?: SerialQrProjectMetadata[] | SerialQrProjectMetadata;
  buttonText: string;
  canEdit = false;

  delete: (metadata: SerialQrProjectMetadata) => void;
  rename: (metadata: SerialQrProjectMetadata) => void;
  selectionMode: 'single' | 'multiple';

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.delete = config.data.delete;
    this.rename = config.data.rename;
    this.selectionMode = config.data.selectionMode;
    this.buttonText = config.data.buttonText;
    this.metadata = config.data.metadata;
  }

  ngOnInit(): void {
    if (!this.metadata) {
      this.subscriptions.push(
        liveQuery(() => db.metadata.orderBy('name').toArray()).subscribe(
          (metadata) => (this.metadata = metadata)
        )
      );
      this.canEdit = true;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  invalid() {
    if (!this.selectedMetadata) {
      return true;
    } else if (
      this.selectionMode === 'multiple' &&
      Array.isArray(this.selectedMetadata) &&
      this.selectedMetadata.length === 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  select() {
    if (!this.invalid()) {
      this.ref.close(this.selectedMetadata);
    }
  }
}
