import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private localStorage: Storage;

  constructor() {
    this.localStorage = window.localStorage;
  }

  get isLocalStorageSupported(): boolean {
    return !!this.localStorage;
  }

  public get(key: string): any {
    if (this.isLocalStorageSupported) {
      try {
        return JSON.parse(this.localStorage.getItem(key));
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  public set(key: string, value: any): boolean {
    if (this.isLocalStorageSupported) {
      this.localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  }

  public remove(key: string): boolean {
    if (this.isLocalStorageSupported) {
      this.localStorage.removeItem(key);
      return true;
    }
    return false;
  }
}
