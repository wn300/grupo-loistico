import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import * as fileSaver from 'file-saver';

import { DeleteFilesService } from './services/delete-files.service';
import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private storage: AngularFireStorage,
    private deleteFilesService: DeleteFilesService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
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
      this.imagesMappper = [];
      this.imagesByReport = data.map((catData: any) => {
        const objectReport = {
          id: catData.payload.doc.id,
          images: catData.payload.doc.data().images,
          address: catData.payload.doc.data().address,
          createAt: catData.payload.doc.data().createAt,
          createBy: catData.payload.doc.data().createBy,
          description: catData.payload.doc.data().description,
          type: catData.payload.doc.data().type,
          status: catData.payload.doc.data().status,
          location: catData.payload.doc.data().location,
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
      this.imagesDelete.push({
        id: element.id,
        image: element.name,
        url: element.url,
        type: element.type,
        date: element.date
      });
    }
  }

  deleteImages(): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: {
        title: '¡¡¡Advertencia!!!',
        question: `¿Esta seguro que desea descargar y eliminar las imagenes seleccionadas?`,
        actionClose: true
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.imagesDelete.forEach(data => {
            this.storage.storage.ref(`reports/${data.image}`).getDownloadURL()
              .then(url => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                  const blob = xhr.response;

                  fileSaver.saveAs(blob, `${data.type}_${data.date}_${data.image}`);

                  this.storage.storage.ref(`reports/${data.image}`).delete()
                    .then(resDelete => {
                      const imageRemovedObject = this.imagesByReport.filter(imageObject => imageObject.id === data.id);
                      if (imageRemovedObject.length > 0) {
                        imageRemovedObject[0].images.splice(imageRemovedObject[0].images.findIndex(image => image === data.url), 1);

                        this.deleteFilesService.putReportsByFiles(imageRemovedObject[0].id, imageRemovedObject[0])
                          .then(resPut => {
                            this.imagesDelete = [];
                            this.openSnackBar('Archivos eliminados del bucket y descargados correctamente', 'cerrar');
                          });
                      }
                    });
                };
                xhr.open('GET', url);
                xhr.send();

              });
          });
        } else {
          this.deSelectedAll();
        }
      });
  }

  selectedAllImages(): void {
    this.imagesMappper.forEach(data => data.selected = true);
    this.imagesDelete = this.imagesMappper.map(data => {
      return {
        id: data.id,
        image: data.name,
        url: data.url,
        type: data.type,
        date: data.date
      }
    });
  }

  deSelectedAll(): void {
    this.imagesMappper.forEach(data => data.selected = false);
    this.imagesDelete = [];
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ngOnDestroy(): void {
    if (this.subscription.length > 0) {
      this.subscription.forEach(data => data.unsubscribe());
    }
  }

}
