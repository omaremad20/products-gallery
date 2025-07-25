import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { LucideAngularModule, MoonIcon, SunIcon } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  imports: [LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private _PLATFORM_ID = inject(PLATFORM_ID)
  readonly SunIcon = SunIcon;
  readonly MoonIcon = MoonIcon;
  isDarkMode = false;
  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.isDarkMode = true;
        document.documentElement.classList.add('dark');
      } else if (savedTheme === 'light') {
        this.isDarkMode = false;
        document.documentElement.classList.remove('dark');
      } else {
        this.isDarkMode = false;
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');
      }
    }
  }
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const htmlEl = document.documentElement;
    if (this.isDarkMode) {
      htmlEl.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlEl.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
