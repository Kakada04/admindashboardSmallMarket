import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject: BehaviorSubject<boolean>;
  isDarkMode$: Observable<boolean>;

  constructor() {
    // Initialize from local storage, default to false (light mode) if not set
    const savedMode = localStorage.getItem('theme');
    this.isDarkModeSubject = new BehaviorSubject<boolean>(savedMode === 'dark');
    this.isDarkMode$ = this.isDarkModeSubject.asObservable();

    // Apply the initial theme to the document
    if (this.isDarkModeSubject.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleMode() {
  const newMode = !this.isDarkModeSubject.value;
  console.log('ThemeService: Toggling to', newMode ? 'dark' : 'light');
  this.isDarkModeSubject.next(newMode);
  localStorage.setItem('theme', newMode ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark');
}

  getIsDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }
}