import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SerialQrProjectMetadata } from 'src/utils/data';
import { db } from 'src/utils/db';

@Component({
  templateUrl: './rename.component.html',
  styleUrls: ['./rename.component.scss']
})
export class RenameComponent implements OnInit {
  metadata: SerialQrProjectMetadata = { id: 0, name: 'Unbenannt' };
  form = new FormGroup({
    name: new FormControl(
      '',
      [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/.*\S+.*/)
      ],
      (control) => this.alreadyExists(control)
    )
  });

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.metadata = config.data;
  }

  ngOnInit(): void {
    this.form.patchValue({ name: this.metadata.name });
  }

  async alreadyExists(control: AbstractControl) {
    if (
      await db.metadata
        .where('name')
        .equals(control.value.trim())
        .and((m) => m.id !== this.metadata.id)
        .first()
    ) {
      const error: ValidationErrors = {
        alreadyExists: true
      };
      return error;
    }
    return null;
  }

  submit() {
    if (this.form.valid) {
      this.ref.close(this.form.value.name.trim());
    }
  }
}
