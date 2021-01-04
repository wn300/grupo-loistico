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
      'createBy',
      'address',
      'description',
      'images'
    ];
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.subscription.push(
      this.reportsService.getReportsByFiles()
        .subscribe(data => {
          this.reports = data.map((catData: any) => {
            const objectReport = {
              id: catData.payload.doc.id,
              images: catData.payload.doc.data().images,
              address: catData.payload.doc.data().address,
              createAt: catData.payload.doc.data().createAt,
              date: catData.payload.doc.data().createAt.toDate(),
              createBy: catData.payload.doc.data().createBy,
              description: catData.payload.doc.data().description,
              type: catData.payload.doc.data().type,
              status: catData.payload.doc.data().status,
              location: catData.payload.doc.data().location,
            };
            return objectReport;
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
