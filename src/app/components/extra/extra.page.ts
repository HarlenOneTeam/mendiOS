import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-extra',
  templateUrl: 'extra.page.html',
  styleUrls: ['extra.page.scss']
})
export class ExtraPage implements OnInit {
  extraForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.extraForm = this.formBuilder.group({
      extra: new FormControl(''),
    });
    this.loadData();
  }

  onChange(id: string) {
    this.setItem(id);
  }

  loadData() {
    const items = this.storageService.getItems();
    let extra: any;
    if (items && items !== {}) {
      extra = items['extra'];
      if (extra && extra.value) {
        this.extraForm.controls.extra.setValue(extra.value);
      }
    }
    this.setItem('extra');
  }

  setItem(id: string) {
    if (this.extraForm.controls[id] && this.extraForm.controls[id].valid) {
      this.storageService.setItem({ id, value: this.extraForm.controls[id].value });
    }
  }
}
