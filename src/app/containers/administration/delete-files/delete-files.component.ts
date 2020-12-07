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
          id: catData.payload.doc.id,
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

  checkDeleteFile(element: any): void {
    const selected = this.imagesMappper.filter(imageArray => imageArray.name === element.name)[0].selected;
    this.imagesMappper.filter(imageArray => imageArray.name === element.name)[0].selected = !selected;

    if (this.imagesDelete.filter(imageArray => imageArray.image === element.name).length > 0) {
      this.imagesDelete.splice(this.imagesDelete.findIndex(imageArray => imageArray.image === element.name), 1);
    } else {
      this.imagesDelete.push({ id: element.id, image: element.name, url: element.url });
    }
  }

  deleteImages(): void {
    this.imagesDelete.forEach(data => {
      console.log(data, 'data');
      // this.deleteFilesService.downloadFile(data.url).subscribe(response => {
      //   const blob: any = new Blob([response], { type: 'text/json; charset=utf-8' });
      //   const url = window.URL.createObjectURL(blob);
      //   window.open(url);
      // }, (error) => { console.log('Error downloading the file') });
      this.storage.storage.ref(`reports/${data.image}`).getDownloadURL()
        .then(url => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            const blob = xhr.response;
            const urlBlogb = window.URL.createObjectURL(blob);
            window.open(urlBlogb);
          };
          xhr.open('GET', url);
          xhr.send();

        });
      // this.storage.storage.ref(`reports/${data.image}`).delete();

      const imageRemovedObject = this.imagesByReport.filter(imageObject => imageObject.id === data.id);
      console.log(imageRemovedObject[0], '1');
      if (imageRemovedObject.length > 0) {
        imageRemovedObject[0].images.splice(imageRemovedObject[0].images.findIndex(image => image === data.url), 1);
        console.log(imageRemovedObject[0], '2');
      }
    });
  }

  selectedAllImages(): void {
    this.imagesMappper.forEach(data => data.selected = true);
    this.imagesDelete = this.imagesMappper.map(data => {
      return {
        id: data.id,
        image: data.name,
        url: data.url
      }
    });
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
