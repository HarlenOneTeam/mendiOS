import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export interface Item {
  id: string;
  value: any;
}

const ITEMS_KEY = 'mend-items';
@Injectable({
  providedIn: 'root'
})

export class StorageService {
  constructor() {}
  // async setItem(item: Item): Promise<any> {
  //   const items = await this.storage.get(ITEMS_KEY);
  //   if (items) {
  //     // TODO: remove it when the project is completed.
  //     for (let i = 0; i < items.length; i++) {
  //       if (items[i].id.toLowerCase() === item.id.toLowerCase()) {
  //         items.splice(i, 1);
  //       }
  //     }
  //     const found = items.find(element => {
  //       return element.id === item.id;
  //     });
  //     if (found) {
  //       found.value = item.value;
  //     } else {
  //       items.push(item);
  //     }
  //     return await this.storage.set(ITEMS_KEY, items);
  //   } else {
  //     // can use object instead of array, too lazy to change it now
  //     return await this.storage.set(ITEMS_KEY, [item]);
  //   }
  // }

  setItem(item: Item) {
    const items = JSON.parse(localStorage.getItem(ITEMS_KEY));
    // const index = items.findIndex(i => i.id === item.id);
    items[item.id] = item;
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    return this.getItems();
  }

  getItems() {
    return JSON.parse(localStorage.getItem(ITEMS_KEY));
  }

  // DELETE
  deleteItem(id: string) {
    const items = JSON.parse(localStorage.getItem(ITEMS_KEY));
    delete items[id];
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    return this.getItems();
  }

  deleteAllItems() {
    localStorage.setItem(ITEMS_KEY, JSON.stringify({}));
  }
}
