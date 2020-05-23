import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule} from '../app-material/app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule , FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowAltCircleDown, faAngleDoubleLeft, faAngleDoubleRight, faAngleDoubleUp, faPlus, faMinus, faCalendarAlt, faGifts} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppMaterialModule,
    FlexLayoutModule,
    FontAwesomeModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AppMaterialModule,
    FontAwesomeModule
  ]
})
export class AppSharedModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faAngleDoubleLeft, faAngleDoubleRight, faAngleDoubleUp, faPlus, faMinus, faCalendarAlt, faGifts, faArrowAltCircleDown);
  }
 }
