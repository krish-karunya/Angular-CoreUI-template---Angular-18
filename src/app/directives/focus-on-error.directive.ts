import {
  ContentChildren,
  Directive,
  ElementRef,
  HostListener,
  QueryList
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[focusOnError]'
})
export class FocusOnErrorDirective {

  // we are getting all the form controls and their corresponding elements:
  @ContentChildren(NgControl, { descendants: true, read: ElementRef })
  elements!: QueryList<ElementRef>;
  
// we are getting all the form controls:
  @ContentChildren(NgControl, { descendants: true })
  controls!: QueryList<NgControl>;

  // here we are listening to the submit event of the form:
  @HostListener('submit')
  onSubmit() {
    const controls = this.controls.toArray();
    const elements = this.elements.toArray();

    for (let i = 0; i < controls.length; i++) {
      if (controls[i].invalid) {
        elements[i].nativeElement.focus();
        break;
      }
    }
  }
}
