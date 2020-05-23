import { Component, OnInit, Inject, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';


import {
  ChangeDetectionStrategy,
} from '@angular/core';
import {MatCalendar} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as _moment from 'moment';
//import {default as _rollupMoment} from 'moment';

const moment = _moment;
import {FormControl} from '@angular/forms';

import {FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    console.log('called', !!(control && control.invalid && (control.dirty || control.touched || isSubmitted)));
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MMM',
  },
  display: {
    dateInput: 'DD/MMM',
    monthYearLabel: 'MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


export interface DialogData {
  name: string;
}

declare var MediaRecorder: any;

export enum RecordingState {
  STOPPED = 'stopped',
  RECORDING = 'recording',
  FORBIDDEN = 'forbidden',
}

@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.css']
})
export class ProfileMainComponent implements OnInit , OnDestroy {
  disableOk= true;
  showspinner = true;
  name: string;
  mylocaluser: User = null;
  imageStr = './assets/girl.png';
  
  audiodialogRef: any;
  videodialogRef: any;
  impdatesdialogRef: any;
  genderdialogRef: any;
  relationdialogRef: any;
  kidsdialogRef: any;

  constructor(public auth: AuthService,public dialog: MatDialog) {
    this.auth.user$.subscribe(userdata => {
      if (userdata !== undefined && userdata !== null) {
        if (userdata.customphotoURL === null){
          if ( userdata.photoURL !== undefined && userdata.photoURL !== null){
            this.imageStr = userdata.photoURL;
          } else{
            this.imageStr = './assets/girl.png';
          }
        } else{
          this.imageStr = userdata.customphotoURL;
        }
        this.mylocaluser = userdata;
      }
    });
   }
  ngOnInit(): void {
  }
  ngOnDestroy(){
    if(this.audiodialogRef !== null && this.audiodialogRef !== undefined){
      this.audiodialogRef.close();
    }   
    if(this.videodialogRef !== null && this.videodialogRef !== undefined){
      this.videodialogRef.close();
    }   
  }
  openDialogPictures(){
  this.videodialogRef = this.dialog.open(PicturesComponent, {
      data: this.mylocaluser,
      backdropClass: 'backdropBackground'
    });

    this.videodialogRef.afterClosed().subscribe(result => {
    });
  }
  openDialogDates()  {
    this.impdatesdialogRef = this.dialog.open(DatepickerComponent, {
      data: this.mylocaluser,
      backdropClass: 'backdropBackground'
    });
  }
  openDialogGender()  {
    this.genderdialogRef = this.dialog.open(GenderComponent, {
      data: this.mylocaluser,
      backdropClass: 'backdropBackground'
    });
  }
  openDialogRelation()  {
    this.relationdialogRef = this.dialog.open(RelationshipComponent, {
      data: this.mylocaluser,
      backdropClass: 'backdropBackground'
    });
  }
  openDialogKids()  {
    this.kidsdialogRef = this.dialog.open(KidsComponent, {
      data: this.mylocaluser,
      backdropClass: 'backdropBackground'
    });
  }

  openDialogGreeting(){
    this.audiodialogRef = this.dialog.open(AudioComponent, {
        data: this.mylocaluser,
        backdropClass: 'backdropBackground'
      });

    this.audiodialogRef.afterClosed().subscribe(result => 
    {

    });
  }

  dosomething() {
    this.showspinner = false;
  }
}
@Component({
  selector: 'dialog-audio',
  template:`
  <mat-card fxFlex ngStyle.lt-sm="background:gold; height: 40vh; width: 65vw;" ngStyle.gt-xs="background:gold; height: 40vh; width: 30vw;" fxLayout="column" fxLayoutAlign="space-around center">
    <mat-card-title>{{settingMsg}}</mat-card-title>  
    <audio *ngFor="let audio of audioFiles" ngStyle.lt-sm="width: 50vw" controls='true' [src]="audio" (error) = "connectionerror()">
    </audio>
    <mat-card-content  *ngIf="showmicrophone">
    <button mat-fab color="primary"
    (click)="startRecording()" [disabled]= "disablemicrophone" >
    {{ state === 'recording' ? seconds : 'REC' }}</button> 
  </mat-card-content>
  <div mat-dialog-actions>
  <button mat-raised-button color ="primary" (click)="ontask()" *ngIf="showbutton" [disabled]= "disablebutton" >{{AudioOption}} </button>
  <button mat-raised-button  color="primary" (click)="goback()" [disabled]= "disableback" cdkFocusInitial>Back</button>
  </div>
  </mat-card>
  `

})
export class AudioComponent implements OnInit, OnDestroy {
  settingMsg = '';
  state: RecordingState;
  streamRef: any;
  disablemicrophone: boolean;
  showmicrophone: boolean;
  disablebutton: boolean;
  showbutton: boolean;
  audioFiles = [];
  showspinner = false;
  AudioOption = 'Delete';
  seconds = 0;
  public isOnline: boolean = navigator.onLine;
  intervalId = 0;
  mediaRecorder: any;
  disableback = false;
  chunks = [];
  imageFile: any;
  savetoDB: User;

  constructor(private cd: ChangeDetectorRef, private dom: DomSanitizer,private storage: AngularFireStorage, private afs: AngularFirestore,
              public dialogRef: MatDialogRef<AudioComponent>, @Inject(MAT_DIALOG_DATA) public data: User) {
      this.state = RecordingState.STOPPED;
      if (data.downloadaudioURL !== null) {
        this.audioFiles.push(data.downloadaudioURL);
        console.log('hi',data.downloadaudioURL);
        this.playgreeting();
      } else {
        this.recordgreeting();
      } 
    }
    ngOnInit(){

      const mediaConstraints = {
        video: false,
        audio: true
      };
      navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(this.mediaavialable.bind(this), this.mediaerror.bind(this));
    }
    ngOnDestroy(){
      if(this.chunks !== null){
        this.chunks.pop();
      }// save local mem if possible      
    }
    recordgreeting() {
      navigator.permissions.query({ name: 'microphone' }).then((result) => {
        console.log('result', result.state);
        switch (result.state) {
          case 'granted':
            this.showgranted();
            break;
          case 'prompt':
            this.showprompt();
            break;
          case 'denied':
            this.showdenied();
            break;
        }
        result.onchange = (event) => {
          switch (result.state) {
            case 'granted':
              this.showgranted();
              break;
            case 'prompt':
              this.showprompt();
              break;
            case 'denied':
              this.showdenied();
              break;
          }
        };
      });
    }
    playgreeting() {

      this.settingMsg = 'Play your Voice Greeting';
  
      this.showmicrophone = false;
      this.disablemicrophone = true;
  
      this.showspinner = false;
  
      this.showbutton = true;
      this.disablebutton = false;
      this.AudioOption = 'Delete';
  
      this.disableback = false;
    }
  
    savegreeting() {
      this.settingMsg = 'Save your Voice Greeting';
  
      this.showmicrophone = false;
      this.disablemicrophone = true;
  
      this.showspinner = false;
  
      this.showbutton = true;
      this.disablebutton = false;
      this.AudioOption = 'Save';
  
      this.disableback = false;
  
    }
    showprompt() {
      this.settingMsg = 'Set Microphone settings';
  
      this.showmicrophone = true;
      this.disablemicrophone = true;
  
      this.showspinner = false;
  
      this.showbutton = true;
      this.disablebutton = false;
      this.AudioOption = 'Settings';
  
      this.disableback = false;
  
    }
    showgranted() {
      this.settingMsg = 'Record Greeting!';
  
      this.showmicrophone = true;
      this.disablemicrophone = false;
  
      this.showspinner = false;
  
      this.showbutton = false;
      this.disablebutton = false;
      this.AudioOption = 'Settings';
  
      this.disableback = false;
    }
    showdenied() {
      this.settingMsg = 'Microphone Setting is denied';
  
      this.showmicrophone = true;
      this.disablemicrophone = true;
  
      this.showspinner = false;
  
      this.showbutton = false;
      this.disablebutton = false;
      this.AudioOption = 'Settings';
  
      this.disableback = false;
    }
    showSettings() {
      const mediaConstraints = {
        video: false,
        audio: true
      };
      navigator.mediaDevices
        .getUserMedia(mediaConstraints);
      return;
    } 
    connectionerror() {
      this.disablebutton = true;
      alert('Uh-oh, Connection Issue, Check Internet connection');
    }
    showError() {
      this.settingMsg = 'Your Audio- Error';
  
      this.showspinner = false;
  
      this.showbutton = false;
      this.disablebutton = false;
      this.AudioOption = 'Settings';
  
      this.disableback = false;
  
      alert('Uh-oh, Connection Issue, Check Internet connection');
    }    
    startRecording() {
      if (this.state === RecordingState.STOPPED) {//start recording
        this.mediaRecorder.start();
        this.disableback = true;
        this.state = RecordingState.RECORDING;
        this.seconds = 9;        
        this.clearTimer();
        this.intervalId = window.setInterval(() => {
          this.seconds -= 1;
                     
          if (this.seconds === 0) {
            console.log('stopped first:',  this.mediaRecorder.state); 
            this.state = RecordingState.STOPPED;
            this.mediaRecorder.stop();
            window.clearInterval( this.intervalId);
            this.savegreeting();
            return;
          }
        }, 1000);
      } else { //pressed again
        this.state = RecordingState.STOPPED;
        if (this.seconds !== 0) {
          this.savegreeting();
          window.clearInterval( this.intervalId);      
          this.mediaRecorder.stop();
        }
      }
    }
    mediaerror() {
      this.showError();
    }
    clearTimer() {
      clearInterval(this.intervalId);
    }
    mediaavialable(stream)
  {
    this.mediaRecorder = new MediaRecorder(stream);
    this.streamRef = stream;
    this.mediaRecorder.onstop = e => {
     
      const blob = new Blob(this.chunks, {type: 'audio/ogg; codecs=opus'});
      this.chunks = [];
      const audioURL = URL.createObjectURL(blob);
      // audio.src = audioURL;
      this.audioFiles.push(this.dom.bypassSecurityTrustUrl(audioURL));
      console.log(audioURL);
      console.log('recorder stopped');
      this.cd.detectChanges();
      const imageName = this.data.uid;
      this.imageFile = new File([blob], imageName, { type: 'audio/ogg; codecs=opus' });
      
    };
    this.mediaRecorder.ondataavailable = e => {
      this.chunks.push(e.data);
    };
  }     
    onNoClick(): void {
      this.dialogRef.close();
    }
    goback(){
      if(this.chunks !== null){
        this.chunks.pop();
      }
      this.dialogRef.close(this.data);
    }
    async ontask() {
      switch (this.AudioOption) {
        case 'Settings':
          this.showSettings();
          break;
  
        case 'Delete':
          this.settingMsg = 'Deleting...';
  
          //audio option is pushed
          this.showspinner = true;
  
          this.showbutton = false;
          this.disablebutton = false;
          this.AudioOption = 'Delete';
  
          this.disableback = true;
          switch (await this.deleteOps()) {
            case true:
              this.data.downloadaudioURL = '';
              this.audioFiles.pop();
              this.recordgreeting();
              break;
            case false:
              this.showError();
              break;
          }

          break;
        case 'Save':
          this.settingMsg = 'Saving...';
  
          this.showspinner = true;
  
          this.showbutton = false;
          this.disablebutton = false;
          this.AudioOption = 'Delete';
  
          this.disableback = true;
          switch (await this.saveOps()) {
            case true:
              this.data.downloadaudioURL = this.savetoDB.downloadaudioURL;            

              this.playgreeting();
              break;
            case false:
              this.showError();
              break;
          }
          break;
      }
    }
    async deleteOps() {
      const ref = this.afs.firestore.collection('users').doc(`${this.data.uid}`);
      try {
        await this.storage.storage.refFromURL(this.data.downloadaudioURL).delete();
        await this.afs.firestore.runTransaction(transaction =>
          transaction.get(ref).then(sfdoc => {
            this.savetoDB = sfdoc.data() as User;
            this.savetoDB.downloadaudioURL = null;
            transaction.update(ref, this.savetoDB);
          })
        );
        return true;
      } catch (error) {
        return false;
      }
    }
    async saveOps() {
      const ref = this.afs.firestore.collection('users').doc(`${this.data.uid}`);
      try {
        const uploadURL = await this.storage.upload(`audio/${this.data.uid}`, this.imageFile);
        await this.afs.firestore.runTransaction(transaction =>
          transaction.get(ref).then(async sfdoc => {
            this.savetoDB = sfdoc.data() as User;
            this.savetoDB.downloadaudioURL = await uploadURL.ref.getDownloadURL();
            this.data.downloadaudioURL = this.savetoDB.downloadaudioURL;
            this.audioFiles.pop();
            this.chunks.pop();
            this.audioFiles.push(this.data.downloadaudioURL);
            transaction.update(ref, this.savetoDB);
          })
        );
        return true;
      } catch (error) {
        return false;
      }
    }
}
/*pictures*/
@Component({
  selector: 'dialog-picture',
  template:`
    <mat-card ngStyle.lt-sm="background:gold; height: 60vh; width: 65vw;" ngStyle.gt-xs="background:gold;  height: 50vh; width: 25vw;" fxFlex  fxLayout="column" fxLayoutAlign="center center">
    
    <mat-card-title >{{settingMsg}}</mat-card-title>  

    <mat-card-content fxFlex fxLyout="column" fxLayoutAlign="center center">
      <img mat-card-lg-image [fxShow]= "showimage ? true :  false" src= "{{imagesrc}}" (load)="AfterVideoLoad()">
      <video #video autoplay playsinline  [fxShow]= "showcamera ? true :  false" (durationchange)="AfterVideoLoad()"></video>
      <canvas [fxShow]="showcanvas ? true : false" #canvas id="canvas" width="200px" height="200px"></canvas>
      <mat-spinner [fxShow]= "showspinner ? true :  false" [diameter]="30"></mat-spinner>
    </mat-card-content>
    <mat-card-actions>
    <button mat-raised-button color ="primary" (click)="ontask()" *ngIf="showbutton" [disabled]= "disablebutton" >{{AudioOption}} </button>
    <button mat-raised-button  color="primary" (click)="goback()" [disabled]= "disableback" cdkFocusInitial>Back</button>
    </mat-card-actions>
    </mat-card> 
  `
})
export class PicturesComponent
{
  state: RecordingState;
  imagesrc: string = null;
  disablebutton: boolean;
  showbutton: boolean;
  audioFiles = [];

  AudioOption = 'Delete';
  seconds = 0;
  intervalId = 0;
  mediaRecorder: any;
  streamRef: any;
  chunks = [];
  imageFile: any;
  private error;
  storageRef: any;
  saveRef: any;
  private basePath = '/audio';
  disableback = false;
  showimage = false;
  showcamera = false;
  showcanvas = false;
  showspinner = true;
  videostreamOn = false;
  @ViewChild('video', { static: true }) video: any;
  @ViewChild('canvas', { static: true }) canvas: any;
  canvasElement: any;
  context: any;
  videoElement: HTMLVideoElement;
  videostreamRef= null;
  savetoDB: User;
  settingMsg = 'Change Profile Image!';
  constructor(
    // tslint:disable-next-line: max-line-length
    public dialogRef: MatDialogRef<PicturesComponent>, private dom: DomSanitizer, private storage: AngularFireStorage, private afs: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: User){
      if (data.customphotoURL !== null) { //second login
        this.imagesrc = data.customphotoURL; 
        this.showcamera = true;
        this.recordgreeting();
      } else { //first time
        this.imagesrc = data.photoURL; 
        this.showimage = true;
        this.playgreeting();
      } 
    }
    AfterVideoLoad(){
      this.showspinner = false;
    }

  recordgreeting() {
    navigator.permissions.query({ name: 'camera' }).then((result) => {
      switch (result.state) {
        case 'granted':
          this.showgranted();
          break;
        case 'prompt':
          this.showprompt();
          break;
        case 'denied':
          this.showdenied();
          break;
      }
      result.onchange = (event) => {
        switch (result.state) {
          case 'granted':
            this.showgranted();
            break;
          case 'prompt':
            this.showprompt();
            break;
          case 'denied':
            this.showdenied();
            break;
        }
      };
    });
  }
  playgreeting() {

    this.settingMsg = 'Change Profile Image!';
    this.showbutton = true;
    this.disableback = false;
    this.disablebutton = false;
    this.AudioOption = 'Change';
  }

  savegreeting() {
    this.settingMsg = 'Save your Voice Greeting';

    this.showspinner = false;

    this.showbutton = true;
    this.disablebutton = false;
    this.AudioOption = 'Save';

    this.disableback = false;

  }

  showprompt() {
    this.settingMsg = 'Change Camera settings';

    this.showspinner = true;

    this.showbutton = true;
    this.disablebutton = false;
    this.AudioOption = 'Settings';
    this.showSettings();
    this.disableback = false;

  }
  showgranted() {
    this.settingMsg = 'Please wait !..';
    this.videoElement = this.video.nativeElement;
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 200, height: 200, facingMode: 'user', aspectRatio: .5 }
      })
      .then(stream => {
        this.videoElement.srcObject = stream;
        this.videostreamRef = stream;
        this.videostreamOn = true;
        this.showspinner = false;
        this.showcamera = true;

        this.settingMsg = 'Set Your Profile Picture';
      });
    this.showspinner = true;
    this.showimage = false;
    this.showbutton = true;
    this.disablebutton = false;
    this.AudioOption = 'Take Picture';
    this.disableback = false;
  }

  showdenied() {
    this.settingMsg = 'Microphone Setting is denied';
    this.showspinner = false;

    this.showbutton = false;
    this.disablebutton = false;
    this.AudioOption = 'Settings';

    this.disableback = false;
  }
  showSettings() {
    const mediaConstraints = {
      video: true,
      audio: false
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints);
    return;
  }
  async deleteOps() {
    const ref = this.afs.firestore.collection('users').doc(`${this.data.uid}`);
    try {
      await this.storage.storage.refFromURL(this.data.photoURL).delete();
      await this.afs.firestore.runTransaction(transaction =>
        transaction.get(ref).then(sfdoc => {
          this.savetoDB = sfdoc.data() as User;
          this.savetoDB.photoURL = '';
          transaction.update(ref, this.savetoDB);
        })
      );
      return true;
    } catch (error) {
      return false;
    }
  }
  async saveOps() {
    const img = this.canvasElement.toDataURL();
    let byteString;
    if (img.split(',')[0].indexOf('base64') >= 0){
      byteString = atob(img.split(',')[1]);
    } else{
      byteString = unescape(img.split(',')[1]);
    }
    // separate out the mime component
    const mimeString = img.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const ref = this.afs.firestore.collection('users').doc(`${this.data.uid}`);
    try {
      const uploadURL = await this.storage.upload(`image/${this.data.uid}`, new Blob([ia], {type: mimeString}));
      await this.afs.firestore.runTransaction(transaction =>
        transaction.get(ref).then(async sfdoc => {
          this.savetoDB = sfdoc.data() as User;
          this.savetoDB.photoURL = await uploadURL.ref.getDownloadURL();
          transaction.update(ref, this.savetoDB);
        })
      );
      return true;
    } catch (error) {
      return false;
    }
  }
  showError() {
    this.settingMsg = 'Your Profile Image- Error';

    this.showspinner = false;

    this.showbutton = false;
    this.disablebutton = false;
    this.AudioOption = 'Settings';

    this.disableback = false;

    alert('Uh-oh, Connection Issue, Check Internet connection');
  }

  connectionerror() {
    this.disablebutton = true;
    alert('Uh-oh, Connection Issue, Check Internet connection');
  }
  async ontask() {
    switch (this.AudioOption) {
      case 'Settings':
        this.showSettings();
        break;

      case 'Change':
        if(this.data.customphotoURL === null){
          this.recordgreeting();
          return;
        }
        this.settingMsg = 'Deleting...';

        this.showspinner = true;

        this.showbutton = false;
        this.disablebutton = false;
        this.disableback = true;
        switch (await this.deleteOps()) {
          case true:
            this.data.photoURL = '';
            //this.canvas.nativeElement.style.display = 'none';
            this.showcamera = false;
            this.goback();
            break;
          case false:
            this.showError();
            break;
        }
        break;

      case 'Save':
        this.settingMsg = 'Saving...';

        this.showspinner = true;
        this.showbutton = false;
        this.disablebutton = false;
        this.showcanvas = false;
        this.showcamera = false;
        this.disableback = true;
        this.canvas.nativeElement.style.display = 'none';    
        switch (await this.saveOps()) {
          case true:
                    
            this.goback();
            break;
          case false:
            this.showError();
            break;
        }
        break;

      case 'Take Picture':
        this.showcamera = false;
        this.canvas.nativeElement.style.display = 'block';
        this.canvasElement = this.canvas.nativeElement;
        this.context = this.canvasElement.getContext('2d');
        this.AudioOption = 'Save';
        this.videostreamRef.getTracks().map((val) => {
          this.context.drawImage(this.videoElement, 0, 0, 200, 200);
          this.videostreamOn = false;
          val.stop();
        });

        break;
    }
  }


  goback() {
    if (this.settingMsg === 'Deleting...'){
      this.dialogRef.close(this.data); 
      return;
    }
    if( this.videostreamOn !== false ){
      this.videostreamRef.getTracks().map((val) => {
        if(val !== null){
          this.videoElement.remove();
          val.stop();
        }
        val.stop();
      });    
    }
    this.dialogRef.close(this.data); 
  }

  startRecording() {
    if (this.state === RecordingState.STOPPED) {//start recording
      this.state = RecordingState.RECORDING;
      const mediaConstraints = {
        video: false,
        audio: true
      };
      navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(this.mediaavialable.bind(this), this.mediaerror.bind(this));
      this.seconds = 9;
      
      this.clearTimer();
      this.intervalId = window.setInterval(() => {
        this.seconds -= 1;
        if (this.seconds === 0) {
          this.mediaRecorder.stop();
          this.streamRef.getTracks().map((val) => {
            val.stop();
            return;
          });
        }
      }, 1000);
    } else { //pressed again
      this.mediaRecorder.stop();
      this.streamRef.getTracks().map((val) => {
        val.stop();
        return;
      });
    }
  }

  mediaavialable(stream) {
    this.mediaRecorder = new MediaRecorder(stream);
    this.streamRef = stream;
    this.mediaRecorder.start();
    this.mediaRecorder.ondataavailable = e => {
      this.chunks.push(e.data);
      const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
      const audioURL = URL.createObjectURL(blob);
      this.audioFiles.push(this.dom.bypassSecurityTrustUrl(audioURL));
      const imageName = this.data.uid;
      this.imageFile = new File([blob], imageName, { type: 'audio/ogg; codecs=opus' });
      this.savegreeting();
    }
  }

  mediaerror() {
    this.showError();
  }

  clearTimer() {
    clearInterval(this.intervalId);
  }
}
@Component({
  selector: 'app-datepicker-custom-header-example',
  template: `

  <mat-card ngStyle.lt-sm="background-color:light-blue; min-height: 50vh; width: 50vw; " ngStyle.gt-xs="background-color:light-blue;   width: 35vw; min-height: 45vh; ">
    
    <mat-card-title >{{settingMsg}}</mat-card-title>  
    <mat-card-content >
      <form style="padding-top: 10%" [style.fontSize.px]="20" fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="10%">
        <mat-form-field  ngStyle.lt-sm= "width: 95%; " ngStyle.gt-xs= "width: 45%; ">
          <mat-label  >Enter Birthday</mat-label>
          <input matInput [matDatepicker]="picker" [formControl]="birthdate" [errorStateMatcher]="matcher" placeholder="Enter Day">
          <mat-error *ngIf="birthdate.hasError('required')">
            Birthday is <strong>required</strong>
          </mat-error>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker [calendarHeaderComponent]="exampleHeader"></mat-datepicker>
        </mat-form-field>

        <mat-form-field  >
        <mat-label  >Marriage Anniversary</mat-label>
        <input matInput [matDatepicker]="Annipicker" [formControl]="Annidate" [errorStateMatcher]="matcher" placeholder="Enter Day">
        <mat-error *ngIf="Annidate.hasError('required')">
          Anniversary is <strong>required</strong>
        </mat-error>
        <mat-datepicker-toggle matSuffix [for]="Annipicker"></mat-datepicker-toggle>
        <mat-datepicker #Annipicker [calendarHeaderComponent]="exampleHeader"></mat-datepicker>
      </mat-form-field>

      </form>
    </mat-card-content>
    <mat-card-actions>
    <button mat-raised-button color ="primary" (click)="ontask()" [style.fontSize.px]="20"> Ok </button>
    <span fxFlex> </span>
    <button mat-raised-button  color="primary" (click)="goback()" [style.fontSize.px]="20" [disabled]= "disableback" cdkFocusInitial>Back</button>
    </mat-card-actions>
    </mat-card>
    
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },{provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}]
})
export class DatepickerComponent {

  settingMsg= 'Edit Dates';
  exampleHeader = ExampleHeader;
  disableback: false;
  birthdate = new FormControl(moment(), [Validators.required]);
  Annidate = new FormControl(moment(), [Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(public dialogRef: MatDialogRef<DatepickerComponent>){

  }

  ontask(){
    this.dialogRef.close();
  }
  goback(){
    this.dialogRef.close();
  }


}

/** Custom header component for datepicker. */
@Component({
  selector: 'app-example-header',
  styles: [`
    .example-header {
      display: flex;
      align-items: center;
      padding: 0.5em;
    }

    .example-header-label {
      flex: 1;
      height: 1em;
      font-weight: 500;
      text-align: center;
    }

    .example-double-arrow .mat-icon {
      margin: -22%;
    }
  `],
  template: `
    <div class="example-header">
       <button mat-icon-button (click)="previousClicked('month')">
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>
      <span class="example-header-label">{{periodLabel}}</span>
      <button mat-icon-button (click)="nextClicked('month')">
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleHeader<D> implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
      private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,
      @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    _calendar.stateChanges
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
        .format(this._calendar.activeDate,this._dateFormats.display.monthYearLabel)
        .toLocaleUpperCase();
  }

  previousClicked(mode: any) {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1);
  }

  nextClicked(mode: any) {
    this._calendar.activeDate =  this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1);
  }
}
//https://stackblitz.com/angular/jamxebpdmdea?file=src%2Fapp%2Finput-error-state-matcher-example.ts

@Component({
  selector: 'app-header-gender',
  template: `

  <mat-card ngStyle.lt-sm="background-color:light-blue; min-height: 50vh; width: 50vw; " ngStyle.gt-xs="background-color:light-blue;   width: 35vw; min-height: 45vh; ">
    
    <mat-card-title >{{settingMsg}}</mat-card-title>  
    <mat-card-content >
      <form style="padding-top: 10%" [style.fontSize.px]="20" fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="10%">


      </form>
    </mat-card-content>
    <mat-card-actions>
    <button mat-raised-button color ="primary" (click)="ontask()" [style.fontSize.px]="20"> Ok </button>
    <span fxFlex> </span>
    <button mat-raised-button  color="primary" (click)="goback()" [style.fontSize.px]="20" [disabled]= "disableback" cdkFocusInitial>Back</button>
    </mat-card-actions>
    </mat-card>
    
    `
})
export class GenderComponent {

  settingMsg = 'Edit Dates';
  disableback: false;
  Gender = new FormControl('Male', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(public dialogRef: MatDialogRef<GenderComponent>){

  }

  ontask(){
    this.dialogRef.close();
  }
  goback(){
    this.dialogRef.close();
  }


}

@Component({
  selector: 'app-header-relationship',
  template: `

  <mat-card ngStyle.lt-sm="background-color:light-blue; min-height: 50vh; width: 50vw; " ngStyle.gt-xs="background-color:light-blue;   width: 35vw; min-height: 45vh; ">
    
    <mat-card-title >{{settingMsg}}</mat-card-title>  
    <mat-card-content >
     
    </mat-card-content>
    <mat-card-actions>
    <button mat-raised-button color ="primary" (click)="ontask()" [style.fontSize.px]="20"> Ok </button>
    <span fxFlex> </span>
    <button mat-raised-button  color="primary" (click)="goback()" [style.fontSize.px]="20" [disabled]= "disableback" cdkFocusInitial>Back</button>
    </mat-card-actions>
    </mat-card>
    
    `
})
export class RelationshipComponent {

  settingMsg= 'Your Relationship Status';
  disableback: false;
  birthdate = new FormControl(moment(), [Validators.required]);
  Annidate = new FormControl(moment(), [Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(public dialogRef: MatDialogRef<RelationshipComponent>){

  }

  ontask(){
    this.dialogRef.close();
  }
  goback(){
    this.dialogRef.close();
  }


}

@Component({
  selector: 'app-header-kids',
  template: `

  <mat-card ngStyle.lt-sm="background-color:light-blue; min-height: 50vh; width: 50vw; " ngStyle.gt-xs="background-color:light-blue;   width: 35vw; min-height: 45vh; ">
    
    <mat-card-title >{{settingMsg}}</mat-card-title>  
    <mat-card-content >
      
    </mat-card-content>
    <mat-card-actions>
    <button mat-raised-button color ="primary" (click)="ontask()" [style.fontSize.px]="20"> Ok </button>
    <span fxFlex> </span>
    <button mat-raised-button  color="primary" (click)="goback()" [style.fontSize.px]="20" [disabled]= "disableback" cdkFocusInitial>Back</button>
    </mat-card-actions>
    </mat-card>
    
    `
})
export class KidsComponent {

  settingMsg= 'Kids Details';
  disableback: false;
  birthdate = new FormControl(moment(), [Validators.required]);
  Annidate = new FormControl(moment(), [Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(public dialogRef: MatDialogRef<KidsComponent>){

  }

  ontask(){
    this.dialogRef.close();
  }
  goback(){
    this.dialogRef.close();
  }

}



