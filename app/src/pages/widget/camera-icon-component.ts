import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, from, of } from 'rxjs';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { getDownloadURL, ref, Storage, StorageReference, uploadString, uploadBytesResumable } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import { v4 as uuid } from 'uuid';

import { environment } from '../../environments/environment';

export interface PhotoEvent {
    url: string;
    path: string;
    error: any;
}

@Component({
    selector: 'app-camera-icon-comp',
    template: `
        <span *ngIf="visible" style="margin: 0 5px;">
            <ion-spinner slot="{{slot}}" *ngIf="loading"></ion-spinner>
            <input type="file" id="inputPhoto" #inputPhoto accept="image/*;capture=camera"
                style="display: none;" capture="camera" (change)="onImage($event)" />
            <ion-icon slot="{{slot}}" name="camera" size="large" *ngIf="!loading"
                class="cameraButton" (click)="openPhoto()"></ion-icon>
        </span>`
  })
export class CameraIconComponent  {

    @Input()
    public visible = true;
    @Input()
    public slot = 'end';
    @Input()
    public  storageDirectory = 'photos';
    @Output()
    public photo: EventEmitter<PhotoEvent> = new EventEmitter<PhotoEvent>();
    @Input()
    public userAlert = false;
    loading = false;

    image: any = null;
    @ViewChild('inputPhoto') inputPhoto: ElementRef;

    constructor(
        private afStorage: Storage,
        private toastController: ToastController) {}

    openPhoto() {
        this.inputPhoto.nativeElement.click();
    }

    onImage(event) {
        this.uploadImage(event.target.files[0]);
    }

    private encodeImageUri(imageUri): Observable<string> {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(imageUri);
        return Observable.create((observer) => {
           reader.onloadend = () => {
              observer.next(reader.result);
              observer.complete();
           };
        });
    }

    async uploadImage(imageURI) {
        console.log('uploadImage: imageURI=', imageURI);
        this.loading = true;
        // Champ present pour un fichier : name, size, type="image/jpeg"
        const fileName = uuid() + '.jpg';
        const fullPath = this.storageDirectory + '/' + fileName;
        console.log('fullPath', fullPath);
        try {
            const r: StorageReference =  ref(this.afStorage, fullPath);
            console.log('uploading');
            await uploadBytesResumable(r, imageURI);
            console.log('uploaded');
            const url = await getDownloadURL(r);
            console.log('url', url);
            this.loading = false;
            if (this.userAlert) {
                this.toastController.create({ message: 'Photo saved.', duration: 3000 })
                    .then((toast) => toast.present());
            }
            this.photo.emit({ path: fullPath, url, error: null });
        } catch(err) {
            this.loading = false;
            console.log('uploadImage: err=', err);
            if (this.userAlert) {
                this.toastController.create({ message: 'Error when saving photo: ' + err, duration: 3000 })
                    .then((toast) => toast.present());
            }
            this.photo.emit({ url: null, path: null, error: err });
        }
    }
}
