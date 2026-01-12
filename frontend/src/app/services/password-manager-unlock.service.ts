import { Injectable } from '@angular/core';

const STORAGE_KEY = 'passwordManagerUnlocked';

@Injectable({
  providedIn: 'root',
})
export class PasswordManagerUnlockService {
  isUnlocked(): boolean {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  }

  unlock(): void {
    sessionStorage.setItem(STORAGE_KEY, '1');
  }

  lock(): void {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
