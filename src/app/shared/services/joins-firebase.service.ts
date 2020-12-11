import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, defer, of, pipe } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JoinsFirebaseService {

  constructor() { }

  innerJoin(afs: AngularFirestore, field, collection, limit = 100): any {
    return source => {

        let collectionData;
        let totalJoins = 0;
        return source.pipe(
          switchMap(data => {
            collectionData = [] as any;

            const reads$ = [];
            for (const doc of collectionData) {

              if (doc[field]) {
                const q = ref => ref.where(field, '==', doc[field]).limit(limit);
                reads$.push(afs.collection(collection, q));
              } else {
                reads$.push(of([]));
              }

              return combineLatest(reads$);
            }
          }),
          map(joins => {
            return collectionData.map();
          }),
          map(joins => {
            return collectionData.map((v, i) => {
              totalJoins += joins[i].length;
              return { ...v, [collection]: joins[i] || null };
            });
          }),
          tap(final => {
            console.log(`Queried ${(final as any).length}, joined ${totalJoins}`);

          })
        );
    }
  }

}
