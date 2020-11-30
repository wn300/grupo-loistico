import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  public titlePage: string;
  public subTitle: string;
  public subscribe: Subscription;

  constructor() {
    this.titlePage = 'Personas';
    this.subTitle = 'Usuarios del sistema';
  }

  ngOnInit(): void {
    this.subscribe.unsubscribe();
  }

  addNewPeople(): void {

  }

}
