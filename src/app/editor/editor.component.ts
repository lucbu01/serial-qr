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
  quill?: Quill;

  _contents?: Operation[];

  @Output()
  valueChange: EventEmitter<Operation[]> = new EventEmitter();

  @Input()
  label?: string;

  @Input()
  set value(value: Operation[] | undefined) {
    if (this.quill) {
      if (
        value &&
        !this.quill.hasFocus() &&
        this._contents != this.quill.getContents().ops
      ) {
        this.quill.setContents(value as any);
      }
    } else {
      this._contents = value;
    }
  }
  get value() {
    return this.quill ? this.quill.getContents().ops : [];
  }

  @ViewChild('quill')
  set editorInstance(value: Editor) {
    value.onInit.subscribe(() => {
      this.quill = value.getQuill() as Quill;
      if (this._contents) {
        this.quill.setContents(value as any);
      }
      this.quill.on('text-change', () =>
        this.valueChange.emit(this.quill?.getContents().ops)
      );
    });
  }
}
