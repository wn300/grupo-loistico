import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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

  constructor(public reportsService: AppUserService) {
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
      this.reportsService.getReportsByFilesByDates()
        .subscribe(data => {
          console.log(data);

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
        })
    );
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
