import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const TOKEN_KEY = 'access_token_2';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  private myStorage: Storage | null = null;
  private token: string = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this.myStorage = storage;
    this.token = await this.storage?.get(TOKEN_KEY);
  }

  setToken(value: any) {
    this.myStorage?.set(TOKEN_KEY, value);
  }

  getToken() {
    return this.storage?.get(TOKEN_KEY);
  }

  removeToken() {
    return this.storage?.remove(TOKEN_KEY);
  }

  setTokenString(value: string){
    this.token = value;
  }

  getTokenString(){
    return this.token;
  }
}
