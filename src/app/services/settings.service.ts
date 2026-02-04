import { Injectable, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

export class AppSettings {
  textSize: number = 1;
  highContrast: boolean = false;
  imageThumbWidth: number|null = null;
  imageThumbHeight:  number|null = null;
  previewMaxWidth:  number|null = null;
  previewMaxHeight:  number|null = null;
}

const SETTINGS_KEY = "configuration";

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }

  setFontScaling(newFontScaling: number) {
    this.getSettings().subscribe(s => {
      s.textSize = newFontScaling;
      this.saveSettings(s);
    });
  }

  saveSettings(settings: AppSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  getSettings(): Observable<AppSettings> {
    let settings = localStorage.getItem(SETTINGS_KEY);

    if (settings) {
      return of(JSON.parse(settings));
    }
    else {
      let defaultSettings = new AppSettings();
      this.saveSettings(defaultSettings);

      return of(defaultSettings);
    }
  }
}
