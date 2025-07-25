import { Component } from '@angular/core';
import { ArrowBigRight, ArrowLeft, ChevronRight, Github, HeartIcon, LinkedinIcon, LucideAngularModule, Mail } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  imports: [LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly Github = Github
  readonly Mail = Mail;
  readonly LinkedinIcon = LinkedinIcon;
  readonly ChevronRight = ChevronRight
}
