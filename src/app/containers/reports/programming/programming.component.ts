import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProgrmmingService } from './services/progrmming.service';
@Component({
  selector: 'app-programming',
  templateUrl: './programming.component.html',
  styleUrls: ['./programming.component.scss']
})
export class ProgrammingComponent implements OnInit {
  public subscription: Subscription[];
  public titlePage: string;
  public subTitle: string;

  constructor(private progrmmingService: ProgrmmingService) {
    this.titlePage = 'Reporte de programación';
    this.subTitle = 'Reportes de programación conta el reporte de usuarios por la app';
  }

  ngOnInit(): void {
    this.progrmmingService.getPrograming()
    .subscribe(data => console.log(data));
  }

}
