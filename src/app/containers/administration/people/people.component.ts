import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  public titlePage: string;
  public subTitle: string;

  constructor() {
    this.titlePage = 'Personas';
    this.subTitle = 'Usuarios del sistema';
  }

  ngOnInit(): void {
  }

  addNewPeople(): void {

  }

}
