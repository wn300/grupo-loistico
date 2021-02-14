import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { AppUserService } from './services/app-user.service';

@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.scss']
})
export class AppUsersComponent implements OnInit, OnDestroy {
  public subscription: Subscription[];
  public titlePage: string;
  public subTitle: string;
  public reports: any[];
  public displayedColumns: string[];
  public dataSourceReports;
  public isLoading: boolean;
  public startDate: Date;
  public endDate: Date;

  private readonly dateFormat = 'DD/MM/YYYY';

  constructor(public reportsService: AppUserService) {
    const onlyDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    this.startDate = moment(onlyDateNow).toDate();
    this.endDate = moment(onlyDateNow).toDate();

    this.titlePage = 'Reportes';
    this.subTitle = 'Reportes desde la App';
    this.subscription = [];
    this.reports = [];
    this.displayedColumns = [
      'type',
      'date',
      'createByIdentification',
      'createBy',
      'address',
      'description',
      'images'
    ];
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.subscription.push(
      this.getReport()
    );
  }

  getReport(): Subscription {
    this.isLoading = true;
    if (this.startDate !== null && this.endDate !== null) {
      const startDate = moment(this.startDate).toDate();
      const endDate = moment(this.endDate).add(12, 'hours').add(59, 'minutes').add(59, 'seconds').toDate();

      return this.reportsService.getReportsByFilesByDates(startDate, endDate)
        .subscribe(data => {
          this.reports = data.map(dataMapper => {
            return {
              ...dataMapper,
              createByIdentification: dataMapper.people.identification,
              createByNames: `${dataMapper.people.firstName} ${dataMapper.people.secondName} ${dataMapper.people.firstLastName} ${dataMapper.people.secondLastName}`,
              date: dataMapper.createAt.toDate(),
            };
          });

          this.dataSourceReports = new MatTableDataSource(this.reports);
          setTimeout(() => {
            this.isLoading = false;
          }, 100);
        });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceReports.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    if (this.subscription.length > 0) {
      this.subscription.forEach(data => data.unsubscribe());
    }
  }
}
