import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FooterComponent } from "./pages/footer/footer.component";
import { NavbarComponent } from "./pages/navbar/navbar.component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'products-gallery';
}

