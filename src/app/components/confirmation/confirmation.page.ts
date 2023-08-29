import { Component, OnInit } from '@angular/core';
import { StorageService, Item } from 'src/app/services/storage.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: 'confirmation.page.html',
  styleUrls: ['confirmation.page.scss']
})

export class ConfirmationPage implements OnInit {
  answers: Item[];
  address = '';

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    this.storageService.getItems().then(result => {
      this.answers = result;
    });
  }

  onChange(event: any, id: string) {
    // this.setItem(id, event.detail.value);
  }
}
