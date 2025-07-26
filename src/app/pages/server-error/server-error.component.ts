import { Component, Input, SimpleChanges } from '@angular/core';
import { LucideAngularModule, RotateCw, LoaderCircle } from 'lucide-angular';
@Component({
  selector: 'app-server-error',
  imports: [LucideAngularModule],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.css'
})
export class ServerErrorComponent {
  @Input() isRetry!: boolean;
  @Input() onRetry: () => void = () => { };
  readonly RotateCw = RotateCw;
  readonly LoaderCircle = LoaderCircle;
}
