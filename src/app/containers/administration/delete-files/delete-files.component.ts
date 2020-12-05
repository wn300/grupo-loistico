import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DeleteFilesService } from './services/delete-files.service';

@Component({
  selector: 'app-delete-files',
  templateUrl: './delete-files.component.html',
  styleUrls: ['./delete-files.component.scss']
})
export class DeleteFilesComponent implements OnInit, OnDestroy {
  public subscription: Subscription[];
  public titlePage: string;
  public subTitle: string;
  public images: any[];
  public imagesByReport: any[];
  public imagesMappper: any[];
  public imagesDelete: any[];
  public displayedColumns: string[];
  public isLoading: boolean;
  public dataSourceImages;

  constructor(private storage: AngularFireStorage, private deleteFilesService: DeleteFilesService) {
    this.titlePage = 'Imagenes guardadas';
    this.subTitle = 'Imagenes en bucket de firebase';
    this.images = [];
    this.imagesByReport = [];
    this.imagesMappper = [];
    this.imagesDelete = [];
    this.displayedColumns = [
      'name',
      'type',
      'date',
      'url',
      'delete'
    ];
    this.subscription = [];
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.deleteFilesService.getReportsByFiles().subscribe(data => {

      this.imagesByReport = data.map((catData: any) => {
        const objectReport = {
          id: catData.payload.doc.data().id,
          images: catData.payload.doc.data().images,
          address: catData.payload.doc.data().address,
          createAt: catData.payload.doc.data().createAt,
          createBy: catData.payload.doc.data().createBy,
          description: catData.payload.doc.data().description,
          type: catData.payload.doc.data().type,
        };

        const imagesBucket = catData.payload.doc.data().images;
        this.images = [...imagesBucket];

        return objectReport;
      });

      this.imagesByReport.forEach(imageByReport => {
        if (imageByReport.images.length > 0) {
          imageByReport.images.forEach(image => {
            this.imagesMappper.push({
              id: imageByReport.id,
              name: image.split('reports%2F')[1].split('?')[0],
              url: image,
              type: imageByReport.type,
              date: imageByReport.createAt.toDate(),
              selected: false
            });
          });
        }
      });

      this.dataSourceImages = new MatTableDataSource(this.imagesMappper);
      setTimeout(() => {
        this.isLoading = false;
      }, 100);

    });
  }

  goToImage(image: string): void {
    window.open(image);
  }

  checkDeleteFile(image: string): void {
    const selected = this.imagesMappper.filter(imageArray => imageArray.name === image)[0].selected;
    this.imagesMappper.filter(imageArray => imageArray.name === image)[0].selected = !selected;

    if (this.imagesDelete.filter(imageArray => imageArray === image).length > 0) {
      this.imagesDelete.splice(this.imagesDelete.findIndex(imageArray => imageArray === image), 1);
    } else {
      this.imagesDelete.push(image);
    }
  }

  deleteImages(): void {
    this.imagesDelete.forEach(data => {
      console.log(data);

      // this.storage.storage.ref(`reports/${data}`).delete();
      // const fileDeleted = this.imagesMappper.filter(imageArray => imageArray.name === data)[0];

    });
  }

  selectedAllImages(): void {
    this.imagesMappper.forEach(data => data.selected = true);
    this.imagesDelete = this.imagesMappper.map(data => data.name);
  }

  deSelectedAll(): void {
    this.imagesMappper.forEach(data => data.selected = false);
    this.imagesDelete = [];
  }
  ngOnDestroy(): void {
    if (this.subscription.length > 0) {
      this.subscription.forEach(data => data.unsubscribe());
    }
  }

}
