import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: 'drop-down.component.html',
  styleUrls: ['drop-down.component.scss']
})
export class DropDownComponent {
  @Input() items: any;
  @Input() selectedOption: any;
  @Output() select = new EventEmitter();
  expand = false;

  constructor() {}

  selectOption(item: any) {
    this.expand = false;
    this.selectedOption = item;
    this.select.emit(item);
  }
}
