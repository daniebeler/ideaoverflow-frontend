import { Injectable } from '@angular/core';

const TOKEN_KEY = 'access_token_2';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  setToken(value: any): void {
    localStorage.setItem(TOKEN_KEY, value);
  }

  getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
