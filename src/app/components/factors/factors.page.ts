import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-factors',
  templateUrl: 'factors.page.html',
  styleUrls: ['factors.page.scss']
})
export class FactorsPage implements OnInit {
  factorsForm: FormGroup;
  descriptions: any[];
  frequencyOptions: any[];
  defaultFrequencyOption: any;

  constructor(
    private formBuilder: FormBuilder,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.factorsForm = this.formBuilder.group({
      description: new FormControl([]),
      frequency: new FormControl('never', Validators.required)
    });
    this.descriptions = [{
      name: 'pets',
      checked: false
    }, {
      name: 'injured',
      checked: false
    }, {
      name: 'trolley',
      checked: false
    }, {
      name: 'withChild',
      checked: false
    }, {
      name: 'disabled',
      checked: false
    }, {
      name: 'intoxicated',
      checked: false
    }, {
      name: 'mentallyUnwel',
      checked: false
    }, {
      name: 'inCar',
      checked: false
    }];
    this.frequencyOptions = [{
      value: 'never',
      display: 'Never'
    }, {
      value: 'once',
      display: 'Once'
    }, {
      value: 'occasionally',
      display: 'Occasionally'
    }, {
      value: 'frequently',
      display: 'Frequently'
    }];
    this.defaultFrequencyOption = this.frequencyOptions[0];
    this.loadData();
  }

  onChange(id: string) {
    this.setItem(id);
  }

  toggle(description: string) {
    const item = this.descriptions.find(d => d.name === description);
    if (item) {
      item.checked = !item.checked;
    }

    const descriptionValues = this.descriptions.filter(d => d.checked).map(i => i.name);
    this.factorsForm.controls.description.setValue(descriptionValues);
    this.setItem('description');
  }

  onFrequencySelect(event: any) {
    this.factorsForm.controls.frequency.setValue(event.value);
    this.setItem('frequency');
  }

  isCheck(description: string) {
    const item = this.descriptions.find(d => d.name === description);
    return (item) ? item.checked : false;
  }

  loadData() {
    const items = this.storageService.getItems();

    let description: any;
    let frequency: any;
    let postcode: any;
    let location: any;
    if (items && items !== {}) {
      description = items['description'];
      frequency = items['frequency'];

      if (description && description.value) {
        this.factorsForm.controls.description.setValue(description.value);
        description.value.forEach(d => {
          const found = this.descriptions.find(i => i.name === d);
          found.checked = found !== null;
        });
      }
      if (frequency && frequency.value) {
        this.defaultFrequencyOption = this.frequencyOptions.find(f => f.value === frequency.value);
        this.factorsForm.controls.frequency.setValue(frequency.value);
      } else {
        this.defaultFrequencyOption = this.frequencyOptions.find(f => f.value === this.frequencyOptions[0].value);
        this.factorsForm.controls.frequency.setValue(this.frequencyOptions[0].value);
      }
    } else {
      this.factorsForm.controls.frequency.setValue(this.frequencyOptions[0].value);
    }
    this.setItem('description');
    this.setItem('frequency');
  }

  isDisabled() {
    return !this.factorsForm.valid;
  }

  setItem(id: string) {
    if (this.factorsForm.controls[id] && this.factorsForm.controls[id].valid) {
      this.storageService.setItem({ id, value: this.factorsForm.controls[id].value });
    }
  }
}
