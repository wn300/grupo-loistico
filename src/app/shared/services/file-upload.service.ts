import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  public objectFile: Subject<any> = new Subject<any>();
  public cleanFile: Subject<any> = new Subject<any>();

  constructor() { }

  getObjetFile(): any {
    return this.objectFile;
  }

  setObjectFile(object: any): any {
    return this.objectFile.next(object);
  }

  getCleanUpload(): any {
    return this.cleanFile;
  }

  setCleanUpload(clean: any): any {
    return this.cleanFile.next(clean);
  }
}
