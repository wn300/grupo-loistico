import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() isSmallScreen: boolean;
  @Output() toggleEmit: EventEmitter<string> = new EventEmitter<string>();

  public titleToolbar: string;

  constructor() {
    this.titleToolbar = 'App Asistencia';
  }

  ngOnInit(): void {
  }

  toggle(): void {
    this.toggleEmit.next(null);
  }

}
