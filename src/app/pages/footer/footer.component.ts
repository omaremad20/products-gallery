import { Component } from '@angular/core';
import { ChevronRight, Github, HeartIcon, LinkedinIcon, LucideAngularModule, Mail, Star } from 'lucide-angular';
@Component({
  selector: 'app-footer',
  imports: [LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly Github = Github;
  readonly Mail = Mail;
  readonly LinkedinIcon = LinkedinIcon;
  readonly ChevronRight = ChevronRight;
  readonly HeartIcon = HeartIcon;
  readonly Star = Star
}
