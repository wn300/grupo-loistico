import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { People, PeopleNew } from '../../administration/people/entity/people';
import { PeopleService } from '../../administration/people/services/people.service';
import { Programming } from '../../programming/entities/programming.entity';
import { ProgrammingService } from '../../programming/services/programming.service';
import { NewsService } from '../../news/services/news.service';
import { take } from 'rxjs/operators';
import { New } from '../../news/entity/new.entity';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-not-scheduled',
  templateUrl: './not-scheduled.component.html',
  styleUrls: ['./not-scheduled.component.scss'],
})
export class NotScheduledComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public titlePage: string;
  public subTitle: string;
  public peopleNotScheduled: People[] = [];
  public peopleNotScheduledNew: PeopleNew[] = [];
  public displayedColumns: string[];
  public dataSourcePeopleNotScheduled;
  public dataSourcePeopleNotScheduledNew;
  public isLoading: boolean;
  public dateFilter: string;
  public date = new FormControl(new Date());

  private people: People[] = [];
  private programmings: Programming[] = [];
  private news: New[] = [];

  private readonly dateFormat = 'DD/MM/YYYY';

  constructor(
    private readonly peopleService: PeopleService,
    private readonly programmingService: ProgrammingService,
    private readonly newsService: NewsService
  ) {
    this.titlePage = 'Reporte de no programados';
    this.subTitle =
      'Reportes de programación contra lista de usuarios en la app';

    this.displayedColumns = [
      'names',
      'identification',
      'company',
      'phone',
      'memberShip',
      'email',
      'position',
      'dayOfRest',
    ];
    this.isLoading = true;

    this.dateFilter = moment().format(this.dateFormat);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.peopleService.getOnlyPeopleSupernumeraria().subscribe((data) => {
        (data as Array<any>).forEach((item) => {
          this.people.push({
            ...item.payload.doc.data(),
            id: item.payload.doc.id,
            names: `${item.payload.doc.data().firstName} ${
              item.payload.doc.data().secondName
            } ${item.payload.doc.data().firstLastName} ${
              item.payload.doc.data().secondLastName
            }`,
          });
        });
        this.isLoading = false;
        this.getReports();
      })
    );
    this.subscriptions.push(
      this.date.valueChanges.subscribe((date: Date) => {
        this.dateFilter = moment(date).format(this.dateFormat);
        this.getReports();
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((data) => data.unsubscribe());
    }
  }

  public getReports(): void {
    const dateFrom = moment(this.dateFilter, this.dateFormat).toDate();
    const dateTo = moment(this.dateFilter, this.dateFormat)
      .add(1, 'days')
      .toDate();
    this.isLoading = true;
    combineLatest(
      this.programmingService.getProgrammingByDates(dateFrom, dateTo),
      this.newsService.getAllByDates(
        moment(dateFrom).add(1, 'days').toDate(),
        moment(dateTo).subtract(1, 'days').toDate()
      ),
      (programming, news) => ({ programming, news })
    )
      .pipe(take(1))
      .subscribe((data) => {
        this.programmings = data.programming.map((item: any) => {
          return {
            ...item.payload.doc.data(),
            id: item.payload.doc.id,
            date: new Date(item.payload.doc.data().date.seconds * 1000),
            dateFormat: moment(
              item.payload.doc.data().date.seconds * 1000
            ).format(this.dateFormat),
          };
        });
        this.news = data.news;
        this.getNotScheduled();
      });
  }

  private getNotScheduled(): void {
    const peopleNotScheduled = this.people.filter((people) => {
      const programming = this.programmings.find(
        (item) => item.identification === people.identification
      );
      return !programming;
    });
    this.peopleNotScheduled = [];
    this.peopleNotScheduledNew = [];
    peopleNotScheduled.forEach((item) => {
      const _new = this.news.find((_new) => _new.peopleId === item.id);
      if (_new) this.peopleNotScheduledNew.push({ ...item, new: _new });
      else this.peopleNotScheduled.push(item);
    });

    this.dataSourcePeopleNotScheduled = new MatTableDataSource(
      this.peopleNotScheduled
    );
    this.dataSourcePeopleNotScheduledNew = new MatTableDataSource(
      this.peopleNotScheduledNew
    );
    setTimeout(() => {
      this.isLoading = false;
    }, 100);
  }
}
