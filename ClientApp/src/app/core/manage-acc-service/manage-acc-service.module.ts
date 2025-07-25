import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageAccServiceComponent } from './manage-acc-service.component';
import { FormsModule } from '@angular/forms';
import { ManageAccServiceService } from './manage-acc-service.service'



@NgModule({
  declarations: [ManageAccServiceComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  exports: [ManageAccServiceComponent],
  providers: [ManageAccServiceService]
})
export class ManageAccServiceModule { }
