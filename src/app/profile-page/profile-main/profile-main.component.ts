import { Component, OnInit, Inject, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import {  ChangeDetectionStrategy } from '@angular/core';
import {MatCalendar} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import moment from 'moment'
import {FormBuilder , FormGroup, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
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

import {FocusMonitor} from '@angular/cdk/a11y';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import { ElementRef, Input, Optional, Self} from '@angular/core';
import { ControlValueAccessor, NgControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import {MatFormFieldControl} from '@angular/material/form-field';

export const checkprofilepage: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const name = control.get('DisplayName');
  const alterEgo = control.get('MyPhoneNum').get('number');
  return name && alterEgo && name.value === alterEgo.value ? { checkprofilepage: true } : null;
};

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
  imageStr = 'https://raw.githubusercontent.com/gmanojisaac/familybookMay/master/src/assets/girl.png';
  
  audiodialogRef: any;
  videodialogRef: any;
  impdatesdialogRef: any;
  genderdialogRef: any;
  relationdialogRef: any;
  contactdialogRef: any;
  profileForm = this.formBuilder.group({
    DisplayName: [null, [Validators.required]],
    MyPhoneNum: this.formBuilder.group({
      countryCode : [null, [Validators.required]],
      dialCode: [null, [Validators.required]],
      id: [null, [Validators.required]],
      internationalNumber: [null, [Validators.required]],
      nationalNumber: [null, [Validators.required]],
      number: [null, [Validators.required]]
    })
  }, { validators: checkprofilepage });
  constructor(public formBuilder: FormBuilder, public auth: AuthService,public dialog: MatDialog) {
    this.auth.user$.subscribe(userdata => {
      if (userdata !== undefined && userdata !== null) {
        if (userdata.customphotoURL === null){
          if ( userdata.photoURL !== undefined && userdata.photoURL !== null){
            this.imageStr = userdata.photoURL;
          } else{
            this.imageStr = 'https://raw.githubusercontent.com/gmanojisaac/familybookMay/master/src/assets/girl.png';
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
  openDialogContact()  {
    this.contactdialogRef = this.dialog.open(DetailsComponent, {
      data: this.mylocaluser,
      backdropClass: 'backdropBackground'
    });

    this.contactdialogRef.afterClosed().subscribe(result => {
      if(result !== null && result !== undefined ){
        const myobj= result.MyPhonenum as FormGroup;
        this.profileForm.patchValue(
          {
            ...result,
            MyPhoneNum: myobj
          }
        );
      }
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
  selector: 'app-header-details',
  styles:[`  
  `],
  template: `

  <mat-card fxLayout="column" fxLayoutAlign="center center" ngStyle.lt-sm="background-color:light-blue; min-height: 50vh; width: 70vw; color: red; " ngStyle.gt-xs="background-color:light-blue;   width: 35vw; min-height: 45vh; color: red;">
    
    <mat-card-title >{{settingMsg}}</mat-card-title>  
    <mat-card-content >
      <form [formGroup]="myForm" >
        <mat-form-field >
        <mat-label>Display Name</mat-label>        
        <input type="text" matInput placeholder="Enter Name" formControlName= "DisplayName" [errorStateMatcher]="matcher">
        <mat-icon matSuffix>mode_edit</mat-icon>
        <mat-error *ngIf="myForm.invalid">{{getNameErrorMessage()}}</mat-error>
        </mat-form-field>
      </form>
    </mat-card-content>
    <mat-card-title >Your Phone No:</mat-card-title>  
    <mat-card-content>
      <form #f="ngForm" [formGroup]="phoneForm" ngStyle.lt-sm="padding-left: 20px;" ngStyle.gt-xs="padding-left: 20px; width: 275px; height: 100px;">
      <ngx-intl-tel-input 
      [cssClass]="'custom'" 
      [preferredCountries]="preferredCountries"
      [enableAutoCountrySelect]="false" 
      [enablePlaceholder]="true" 
      [searchCountryFlag]="true"
      [searchCountryField]="[SearchCountryField.Iso2, SearchCountryField.Name]"
      [selectFirstCountry]="false" 
      [selectedCountryISO]="CountryISO.India"
      [maxLength]="10" 
      [tooltipField]="TooltipLabel.Name" 
      [phoneValidation]="true" 
      [separateDialCode]="separateDialCode"
      name="phone" formControlName="phone">
    </ngx-intl-tel-input>
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
export class DetailsComponent  implements OnInit  {
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	phoneForm = new FormGroup({
		phone: new FormControl(undefined, [Validators.required])
	});


  myForm: FormGroup;
  settingMsg= 'Your Name';
  disableback: false;

  matcher = new MyErrorStateMatcher();
  changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  
  onCountryChange($event){
    console.log($event);
  }
  getNameErrorMessage(){
    if(this.myForm.get('DisplayName').hasError('required')){
      return 'You must enter a value';
    } 
    return this.myForm.get('DisplayName').hasError('minlength') ? '3 digits required': '';
  }
  getPhErrorMessage(){
    if(this.myForm.get('MyPhonenum').hasError('required')){
      return 'You must enter a value';
    } 
    if(this.myForm.get('MyPhonenum').hasError('maxlength')){
      return 'You must enter 10 digits only';
    } 
    return this.myForm.get('MyPhonenum').hasError('minlength') ? 'Atleast 10 digits required' : '';
  }
  ngOnInit(){
    this.myForm = this.formBuilder.group({
      MyPhonenum: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      DisplayName: ['', [Validators.required, Validators.minLength(3)]]
    });  
    this.onChanges();
  }
  onChanges(): void {
    this.myForm.get('MyPhonenum').valueChanges.subscribe(val => {
      //console.log('Ph', val);
    });
  }
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DetailsComponent>, private formBuilder: FormBuilder){

  }

  ontask(){
    this.myForm.patchValue(
      { MyPhonenum : this.phoneForm.get('phone').value}
    );
    //console.log('form value', this.myForm.value);
    this.dialogRef.close(this.myForm.getRawValue());
  }
  goback(){
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-audio',
  template:`
  <mat-card fxFlex ngStyle.lt-sm="background:gold; height: 40vh; width: 65vw;" ngStyle.gt-xs="background:gold; height: 57vh; width: 30vw;" fxLayout="column" fxLayoutAlign="space-around center">
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
        //console.log('hi',data.downloadaudioURL);
        this.playgreeting();
      } else {
        const mediaConstraints = {
          video: false,
          audio: true
        };
        navigator.mediaDevices
          .getUserMedia(mediaConstraints)
          .then(this.mediaavialable.bind(this), this.mediaerror.bind(this));
        this.recordgreeting();
      } 
    }
    ngOnInit(){

      /*const mediaConstraints = {
        video: false,
        audio: true
      };
      navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(this.mediaavialable.bind(this), this.mediaerror.bind(this));*/
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
      alert('Uh-oh, Connection Issue, Check Internet connection1');
    }
    showError() {
      this.settingMsg = 'Your Audio- Error';
  
      this.showspinner = false;
  
      this.showbutton = false;
      this.disablebutton = false;
      this.AudioOption = 'Settings';
  
      this.disableback = false;
  
      alert('Uh-oh, Connection Issue, Check Internet connection2');
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
              const mediaConstraints = {
                video: false,
                audio: true
              };
              navigator.mediaDevices
                .getUserMedia(mediaConstraints)
                .then(this.mediaavialable.bind(this), this.mediaerror.bind(this));
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

@Component({
  selector: 'dialog-picture',
  template:`
    <mat-card ngStyle.lt-sm="background:gold; height: 58vh; width: 69vw;" ngStyle.gt-xs="background:gold;  height: 56vh; width: 27vw;" fxFlex  fxLayout="column" fxLayoutAlign="center center">
    
    <mat-card-title >{{settingMsg}}</mat-card-title>  

    <mat-card-content fxFlex fxLyout="column" fxLayoutAlign="center center">
      <img mat-card-lg-image [fxShow]= "showimage ? true :  false" src= "{{imagesrc}}" (load)="AfterVideoLoad()" ngStyle.lt-sm="height:25vh; width:30vw;"  ngStyle.gt-xs="height:30vh; width:20vw;">
      <video #video autoplay playsinline  [fxShow]= "showcamera ? true :  false" (durationchange)="AfterVideoLoad()"></video>
      <canvas [fxShow]="showcanvas ? true : false" #canvas id="canvas" width="240px" height="220px"></canvas>
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
        video: { width: 270, height: 270, facingMode: 'user', aspectRatio: 4.3, }
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

    alert('Uh-oh, Connection Issue, Check Internet connection3');
  }

  connectionerror() {
    this.disablebutton = true;
    alert('Uh-oh, Connection Issue, Check Internet connection4');
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
        this.disableback = false;
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
          this.context.drawImage(this.videoElement, 0, 0, 240, 180);
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

/** Start datepicker. */
@Component({
  selector: 'app-datepicker-custom-header-example',
  template: `

  <mat-card ngStyle.lt-sm="background-color:light-blue; min-height: 50vh; width: 50vw; " ngStyle.gt-xs="background-color:light-blue;   width: 35vw; min-height: 45vh; ">
    
    <mat-card-title >{{settingMsg}}</mat-card-title>  
    <mat-card-content >
      <form style="padding-top: 10%;" [style.fontSize.px]="20" fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="10%">
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
  exampleHeader = ExampleHeaderComponent;
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
export class ExampleHeaderComponent<D> implements OnDestroy {
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
/** End datepicker. */

@Component({
  selector: 'app-header-gender',
  styles:[`
  .demo-section {
    margin: 8px;
    padding: 16px;
  
    .mat-radio-button {
      padding: 80px;
    }
  }

  `],
  template: `

  <mat-card ngStyle.lt-sm="background-color:light-blue; min-height: 50vh; width: 50vw; " ngStyle.gt-xs="background-color:light-blue;   width: 35vw; min-height: 45vh; ">
    
    <mat-card-title >{{settingMsg}}</mat-card-title>  
    <mat-card-content >
      <mat-radio-group [formControl]="Gender" style="padding-top: 10%" [style.fontSize.px]="20" fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="10%">
        <div style="width:200px">          
          <mat-radio-button value="Male" fxFlexAlign="center">
            <mat-label>Male</mat-label>   
          </mat-radio-button>
          <span fxFlex="grow" ></span>
          <fa-icon [icon]="['fas', 'male']" [styles]="{'stroke': 'red', 'color': 'red'}" size="3x"></fa-icon>
        </div>

        <div style="width:200px">        
          <mat-radio-button value="Female"  fxFlexAlign="center">
            <mat-label>Female</mat-label> 
          </mat-radio-button> 
          <span fxFlex="grow" ></span>
          <fa-icon [icon]="['fas', 'female']" [styles]="{'stroke': 'red', 'color': 'red'}" size="3x"></fa-icon>
        </div>
        
        <div style="width:200px">          
          <mat-radio-button value="transgender"  fxFlexAlign="center">
            <mat-label> TransGender</mat-label>          
          </mat-radio-button> 
          <span fxFlex="grow" ></span>
          <fa-icon [icon]="['fas', 'transgender']" [styles]="{'stroke': 'red', 'color': 'red'}" size="3x"></fa-icon>
        </div>
      </mat-radio-group>
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

  settingMsg = 'Your Gender';
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
  styles: [`
  .demo-checkbox {
    margin: 8px 0;
  }
`],
  template: `

  <mat-card ngStyle.lt-sm="background-color:light-blue; min-height: 50vh; width: 50vw; " ngStyle.gt-xs="background-color:light-blue;   width: 35vw; min-height: 45vh; ">
    
    <mat-card-title >{{settingMsg}}</mat-card-title>  
    <mat-card-content >
    <mat-card>
    <mat-card-content [style.fontSize.px]="20" >      
      <form [formGroup]="myForm" fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="10%"  >
        <div style="width:200px;">       
        <fa-icon [icon]="['fas', 'kiss-wink-heart']" [styles]="{'stroke': 'red', 'color': 'red'}" size="3x"></fa-icon>
          <mat-checkbox formControlName="Relation" labelPosition="after" fxFlex="grow" fxFlexAlign="center">
        I have a partner to partner
          </mat-checkbox>
        </div>
        <div style="width:200px;">
          <fa-icon [icon]="['fas', 'child']" [styles]="{'stroke': 'red', 'color': 'red'}" size="3x"></fa-icon>
          <mat-checkbox formControlName="kidsEnable" labelPosition="after" fxFlex="grow"  fxFlexAlign="center" >
            Kids
          </mat-checkbox>
          <mat-slider fxFlexAlign="center"
          [disabled]= "!myForm.get('kidsEnable').value"
          max= 6
          min= 0
          step= 1
          thumbLabel= true
          tickInterval= 1
          formControlName="kidsnumber">
          </mat-slider>
        </div>
        
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
export class RelationshipComponent implements OnInit {
  myForm: FormGroup;
  settingMsg= 'Relationship Status';
  disabledslider: true;
  disableback: false;
  matcher = new MyErrorStateMatcher();
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;

  ngOnInit(){
    this.myForm = this.formBuilder.group({
      Relation: false,
      kidsEnable: false,
      kidsnumber: 0
    });
  
    this.onChanges();
  }
  onChanges(): void {
    this.myForm.get('kidsEnable').valueChanges.subscribe(val => {
      if(val === false){
        this.myForm.patchValue( 
          { kidsnumber : 0 }
        );
      } else{
        this.myForm.patchValue( 
          { kidsnumber : 1 }
        );
      }
    });
  }
  constructor(public dialogRef: MatDialogRef<RelationshipComponent>, private formBuilder: FormBuilder){

  }

  ontask(){
    this.dialogRef.close();
  }
  goback(){
    this.dialogRef.close();
  }


}
