import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { CaseService } from 'src/app/services/case.service';

import * as moment from 'moment';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'app-notification',
  templateUrl: 'notification.page.html',
  styleUrls: ['notification.page.scss']
})
export class NotificationPage implements OnInit {
  notificationForm: FormGroup;
  showEmail = true;
  payload: any;
  paramStr = '';
  error = '';
  notifications: any[];
  loadingSubmittion = false;

  modalRef: BsModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private caseService: CaseService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.notificationForm = this.formBuilder.group({
      notification: new FormControl('yes', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
    this.notifications = [{
      name: 'yes',
      checked: false
    }, {
      name: 'no',
      checked: false
    }];
    this.loadData();
  }

  onChange(id: string) {
    if (id === 'notification') {
      if (this.notificationForm.controls[id].value === 'yes') {
        this.showEmail = true;
        this.notificationForm.addControl('email', new FormControl('', [Validators.required, Validators.email]));
      } else {
        this.showEmail = false;
        delete this.notificationForm.controls.email;
        this.storageService.deleteItem('email');
      }
    }

    this.notificationForm.updateValueAndValidity();
    this.setItem(id);
  }

  loadData() {
    const items = this.storageService.getItems();

    let notification: any;
    let email: any;
    if (items && items !== {}) {
      notification = items['notification'];
      email = items['email'];

      if (email && email.value) {
        if (this.notificationForm.controls.email) {
          this.notificationForm.controls.email.setValue(email.value);
        }
      }
      if (notification && notification.value) {
        const selectedNotification = this.notifications.find(g => g.name === notification.value);
        selectedNotification.checked = true;
        this.notificationForm.controls.notification.setValue(notification.value);
        if (notification.value === 'no') {
          this.showEmail = false;
          delete this.notificationForm.controls.email;
          this.notificationForm.updateValueAndValidity();
        }
      } else {
        const selectedNotification = this.notifications.find(g => g.name === 'yes');
        selectedNotification.checked = true;
        this.notificationForm.controls.notification.setValue('yes');
      }
    }
    this.setItem('notification');
    this.setItem('email');
  }

  isDisabled() {
    return !this.notificationForm.valid || this.loadingSubmittion;
  }

  isChecked(gender: string) {
    const item = this.notifications.find(d => d.name === gender);
    return (item) ? item.checked : false;
  }

  toggle(gender: string) {
    this.notifications.forEach(g => g.checked = false);
    const item = this.notifications.find(d => d.name === gender);
    if (item) {
      item.checked = true;
    }

    this.notificationForm.controls.notification.setValue(item.name);
    this.setItem('notification');
    this.onChange('notification');
  }

  submit() {
    this.loadingSubmittion = true;
    const items = this.storageService.getItems();

    const formattedDate = moment(items['date'].value).format('YYYY-MM-YY');
    const formattedSeenTime = moment(items['date'].value).format('HH:mm');
    const coords = (items['coords']) ? { lat: items['coords'].value.latitude , lng: items['coords'].value.longitude } : { };
    const payload = {
      age_bracket: (items['age']) ? items['age'].value : '',
      date: formattedDate,
      date_and_time: (items['date']) ? items['date'].value : '',
      details: (items['extra']) ? items['extra'].value : '',
      errors: {},
      gender: (items['gender']) ? items['gender'].value : '',
      identifiers: (items['description']) ? items['description'].value : [],
      isValid: true,
      location: {
        address: (items['location']) ? items['location'].value : '',
        postCode: (items['postcode']) ? items['postcode'].value : '',
        coordinates: coords
      },
      notifications: false,
      seen_at: (items['time']) ? items['time'].value : '',
      seen_before: (items['frequency']) ? items['frequency'].value : '',
      step: 4,
      time: formattedSeenTime,
      type: '',
      user: {email:  (items['email']) ? items['email'].value : ''},
      user_email:  (items['email']) ? items['email'].value : '',
      version: environment.version
    };

    this.caseService.createCase(payload).subscribe(res => {
      if (res.total) {
        this.loadingSubmittion = false;
        this.storageService.deleteAllItems();
        this.storageService.setItem({ id: 'total', value: res.total });
        this.router.navigateByUrl('/thank-you');
      }
    }, error => {
      // alert(JSON.stringify(error));
      this.loadingSubmittion = false;
      if (error.status === 405) {
        this.modalRef = this.modalService.show(ModalComponent,  {
          initialState: {
            title: 'App update required',
            data: {
              message: 'Please update new mend app to create a new case.'
            }
          }
        });
      }
    });
  }

  setItem(id: string) {
    if (this.notificationForm.controls[id] && this.notificationForm.controls[id].valid) {
      this.storageService.setItem({ id, value: this.notificationForm.controls[id].value });
    } else {
      this.storageService.setItem({ id, value: '' });
    }
  }
}
