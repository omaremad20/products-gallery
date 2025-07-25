import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule, AlarmCheckIcon } from 'lucide-angular';
import { NavbarComponent } from "./pages/navbar/navbar.component";
import { FooterComponent } from "./pages/footer/footer.component";
import { ConnectionService } from 'ng-connection-service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'products-gallery';
  readonly AlarmCheckIcon = AlarmCheckIcon;
  private _ToastrService = inject(ToastrService);
  private _PLATFORM_ID = inject(PLATFORM_ID);
  check!: boolean;
  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      window.addEventListener('online', () => {
        this._ToastrService.success('Connection Restored')
      })
      window.addEventListener('offline', () => {
        this._ToastrService.error('No Internet Connection')
      })
    }
  }
}

