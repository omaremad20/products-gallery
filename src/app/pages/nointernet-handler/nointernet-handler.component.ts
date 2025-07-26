import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-nointernet-handler',
  imports: [],
  templateUrl: './nointernet-handler.component.html',
  styleUrl: './nointernet-handler.component.css'
})
export class NointernetHandlerComponent {
  @Input() onRetry: () => void = () => { };
  @Input() isRetry!: boolean;
}
