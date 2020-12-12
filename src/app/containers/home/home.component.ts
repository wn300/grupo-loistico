import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    // const savePeople = {
    //   name: 'wilmer'
    // };
    // this.createCoffeeOrder(savePeople);
  }

  createCoffeeOrder(data: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('people')
        .add(data)
        .then(res => {
          console.log(res);
        }, err => reject(err));
    });
  }

}
