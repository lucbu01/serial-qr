import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { Editor } from 'primeng/editor';
import Quill from 'quill';
import { Operation } from 'src/utils/data';

@Component({
  selector: 'qr-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  @ViewChild('quill')
  editorInstance?: Editor;

  get quill(): Quill | undefined {
    return this.editorInstance?.getQuill();
  }

  @Output()
  valueChange: EventEmitter<Operation[]> = new EventEmitter();

  @Input()
  label?: string;

  @Input()
  set value(value: Operation[] | undefined) {
    if (this.quill) {
      if (value && !this.quill?.hasFocus()) {
        this.quill?.setContents(value as any);
      }
    } else {
      setTimeout(() => (this.value = value));
    }
  }
  get value() {
    const ops = this.quill ? this.quill.getContents().ops : [];

    if (ops.length === 0 || this.quill?.getText().trim() === '') {
      return undefined;
    }
    return ops;
  }

  changed() {
    this.valueChange.emit(this.value);
  }
}
