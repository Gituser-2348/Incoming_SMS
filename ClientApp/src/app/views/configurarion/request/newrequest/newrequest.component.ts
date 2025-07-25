import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { urldropdown, NewRequestModel } from '../../ConfigurationModel';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Injectable, ViewContainerRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfigureService } from '../../configure.service';

import { SigninService } from '../../../sign-in/sign-in.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-newrequest',
  templateUrl: './newrequest.component.html',
  styleUrls: ['./newrequest.component.scss']
})
export class NewrequestComponent implements OnInit {
  planlist = Array<urldropdown>();
  circlelist = Array<urldropdown>();
  servicelist = Array<urldropdown>();
  platformlist = Array<urldropdown>();
  new_req: NewRequestModel;
  selectedServices: any[] = [];
  customer_name: any;
  plan_: any='';
  circle_: any;
  platform_: any = 2;
  services_: any = 1;
  account_id_: any; is_show_customer_name_err_msg: boolean = false;

  

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private config_service: ConfigureService, private signin_service: SigninService,
    private snackBar: MatSnackBar, private dialogRef: MatDialogRef<NewrequestComponent>, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.GetDropdown();

  }
  GetDropdown() {
    this.config_service.NewRequestDropdown().subscribe((resp: any[]) => {
    //  console.log("resp", resp);
      this.circlelist = resp[0].table1;
      this.planlist = resp[0].table2;
      this.servicelist = resp[0].table3;
      this.platformlist = resp[0].table4;

    });

  }
  toggleSelectAll() {
    if (this.selectedServices.length === this.servicelist.length) {
      // If all options are already selected, deselect all
      this.selectedServices = [];
    } else {
      // Select all options
      this.selectedServices = this.servicelist.map(type => type.value);
    }
  }
  newrequest() {
    this.is_show_customer_name_err_msg = false;
    if (this.customer_name == '' || this.customer_name == null || !this.customer_name || this.customer_name.trim() === '') {
      this.is_show_customer_name_err_msg = true;
      this.snackBar.open('Please add customer name', '! Warning', { duration: 3000 });

    } else {
      this.new_req = new NewRequestModel();
    //  console.log('platform', this.platform_, 'services', this.services_, 'plan', this.plan_);

      this.account_id_ = this.signin_service.decryptData(sessionStorage.getItem("AccountId"));
      this.new_req.account_id = this.account_id_;
      this.new_req.customername = this.customer_name.trim();
      if (this.circle_) {
        this.new_req.circle = this.circle_.toString();
      } else {
        this.new_req.circle = ""; // Provide a default value or handle the exception
      }
      if (this.plan_) {
        this.new_req.plan = this.plan_.toString();
      } else {
        this.new_req.plan = ""; // Provide a default value or handle the exception
      }
      this.new_req.plan = this.plan_.toString();
      this.new_req.platform = this.platform_.toString();
      this.new_req.service = this.services_.toString();
      const reqbody = JSON.stringify(this.new_req);
   //   console.log(reqbody);
      this.config_service.GetNewRequest(reqbody).subscribe((resp: any[]) => {
     //   console.log("resp", resp);
        if (resp[0].status == 1) {
          //this.snackBar.open(resp[0].response, 'Success', { duration: 3000 });
          this.toastr.success(resp[0].response, 'Success');
          this.dialogRef.close();

        } else {
          //this.snackBar.open(resp[0].response, 'Error', { duration: 3000 });
          this.toastr.error(resp[0].response, 'Error');
        }
      });



    }
    
  }
}
