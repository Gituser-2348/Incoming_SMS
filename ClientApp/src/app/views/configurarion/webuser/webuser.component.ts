import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigureService } from '../configure.service';
import { urldropdown } from '../ConfigurationModel';
import { adduser } from '../ConfigurationModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SigninService } from '../../sign-in/sign-in.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from '@angular/material/dialog';
import { ViewaccountdetailsComponent } from './viewaccountdetails/viewaccountdetails.component';

@Component({
  selector: 'app-webuser',
  templateUrl: './webuser.component.html',
  styleUrls: ['./webuser.component.scss']
})

export class WebuserComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  adduser_: adduser; showError_status: boolean = false; is_show_viewstep: boolean = false;
  customerlist = Array<urldropdown>(); response_info: any = "Please select customer"; view_info: any = "Please select customer";
  customer: any; is_show_customer_name_err: boolean = false; is_show_username_err: boolean = false;
  Request_ID: any; is_show_mobilenumber_err: boolean = false; is_show_emailid_err: boolean = false;
  Circle_Name: any; is_show_address_err: boolean = false;
  Customer_Name: any; userlist = Array<urldropdown>();
  Plan_Name: any;
  Plan_Type: any; displayStyle = "none";
  services: any;
  Suggested_Platform: any;
  info_show: boolean;
  add_show: boolean; resp_array: any[] = [];
  customer_name: any;
  user_name: any;
  mobile_number: any;
  email_id: any;
  address: any;
  request_body: any;
  addbtn_show: any; user_id: any; is_show_next1: boolean = false;
  
  constructor(private config_service: ConfigureService, private snackBar: MatSnackBar, private spinner: NgxSpinnerService,
    private signInService: SigninService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit(): void {
    //this.spinner.hide();
    this.info_show = false;
    this.add_show = false;
    this.GetCustomerList();
    //this.response_info = "";
    //this.view_info = "";
    
  }
  GetCustomerList() {
    this.config_service.AddUserCustomerDropdown().subscribe((resp: any[]) => {
      /*console.log(resp);*/

    //  console.log('resp2222', resp);
     
      this.customerlist = resp[0].table1;
      this.userlist = resp[0].table2;
      //this.response_info = "";
      //this.view_info = "";
    });
  }

  validateInput(event: any) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    input.value = numericValue;

    const isValid = !isNaN(Number(numericValue));
    if (!isValid) {
      event.preventDefault();
    }
  }

  moveToStep2(stepper: MatStepper) {
   // alert('step 2');
    stepper.selectedIndex = 1; // Move to Step 3 (index starts from 0)
  }
  viewuser() {
   
    this.response_info = "";
    this.is_show_viewstep = false;

    this.showError_status = false;
    if (this.customer == "") {
      this.showError_status = true;
    } else {
      this.showError_status = false;

      // alert('view user');
      // alert(this.customer);
      this.config_service.getInfoTable(this.customer.toString()).subscribe((resp: any[]) => {
        //console.log(resp);
        //console.log(resp.length);
        if (resp.length > 0) {
          const firstItem = resp[0];
          this.Request_ID = firstItem.Request_ID;
          this.Circle_Name = firstItem.Circle;
          this.Customer_Name = firstItem.Customer;
          this.Plan_Name = firstItem.PlanName;
          this.Plan_Type = firstItem.PlanType;
          this.services = firstItem.Services;
          this.Suggested_Platform = firstItem.SuggestedPlatform;
          this.info_show = true;
          this.addbtn_show = true;
          this.add_show = false;
          this.is_show_viewstep = true;
          this.response_info = "";
          this.view_info = "";
          // You can assign other properties as needed
          this.stepper.next();
          this.is_show_next1 = true;
        }
        else {
          this.info_show = false;
          this.addbtn_show = false;
          this.add_show = false;
          this.is_show_viewstep = false;
        }
      });
    }
  }

  adduser() {
   // this.spinner.show();
    this.addbtn_show = false;
    this.add_show= true;
  }
  customer_click() {
    this.GetCustomerList();

  }

  isValidEmail(email: string): boolean {
    // Use a regular expression to validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }
  isValidMobileNumber(mobileNumber: string): boolean {
    // Use a regular expression to validate mobile number format and minimum length of 9
    const mobileRegex = /^[0-9]{9,}$/;
    return mobileRegex.test(mobileNumber);
  }
  validate() {
  //  console.log('this.customer_name', this.Customer_Name);
    this.is_show_customer_name_err = false; this.is_show_username_err = false;
    this.is_show_mobilenumber_err = false; this.is_show_emailid_err = false; this.is_show_address_err = false;
    //if (!this.Customer_Name || this.Customer_Name.trim() === '') {
    //   this.is_show_customer_name_err = true;
    //   this.toastr.error("Invalid customer name", 'Error');
    //  return false;
    //}
     if (!this.user_name || this.user_name.trim() === '') {
       this.is_show_username_err = true;
       this.toastr.error("Invalid user name.", 'Error');
      return false;
     }
     else if (!this.mobile_number || this.mobile_number.trim() === '') {
       this.is_show_mobilenumber_err = true;
       this.toastr.error("Invalid mobile number (9 to 15 digit).", 'Error');
       return false;
     }
     else if (!this.isValidMobileNumber(this.mobile_number)) {
       // Handle invalid mobile number
      // console.log("Invalid mobile number format or length.");
       this.toastr.error("Invalid mobile number (9 to 15 digit).", 'Error');
       this.is_show_mobilenumber_err = true;
       return false;
     }
    else if (!this.email_id) {
      // Handle empty email
       this.toastr.error('Email is required', 'Error');
       this.is_show_emailid_err = true;
      return false;
    } else if (!this.isValidEmail(this.email_id.trim())) {
      // Handle invalid email
      //console.log("Invalid email format.");
       this.is_show_emailid_err = true;
      this.toastr.error("Invalid email format.", 'Error');
      return false;
     }
     else if (!this.address || this.address.trim() === '') {
       this.is_show_address_err = true;
       this.toastr.error("Invalid address", 'Error');
       return false;
     }
    else {
      return true;
      // Email is valid
      //console.log("Email is valid.");
    }
  }
  clear_fields() {
    this.customer_name = '';
    this.user_name = '';
    this.mobile_number = '';
    this.email_id = '';
    this.address = '';
    this.Customer_Name = '';
  }
  createuser() {
    this.spinner.show();
    this.is_show_customer_name_err = false; this.is_show_emailid_err = false;
    this.is_show_username_err = false;
    this.is_show_mobilenumber_err = false; this.is_show_address_err = false;
    let is_valid: boolean = this.validate();
    if (is_valid) {



      this.adduser_ = new adduser();
      this.adduser_.ReqID = this.Request_ID.toString();
      this.user_id = this.signInService.decryptData(sessionStorage.getItem("AccountId"));
      this.adduser_.Account_id = this.user_id;
      /*this.adduser_.CustomerName = this.customer_name;*/
      this.adduser_.UserName = this.user_name.trim();
      this.adduser_.MobileNumber = this.mobile_number.trim();
      this.adduser_.EmailId = this.email_id.trim();
      this.adduser_.Address = this.address.trim();
      this.adduser_.CustomerName = this.Customer_Name.trim();

      /* console.log(this.adduser_);*/
      this.request_body = JSON.stringify(this.adduser_);
     

      this.config_service.AddUser(this.request_body).subscribe((resp: any[]) => {
       

        this.GetCustomerList();
        if (resp[0].status == 1) {
          this.clear_fields();
          this.response_info = resp[0].response;
          this.spinner.hide();
          this.toastr.success(resp[0].response, 'Success');
          this.add_show = false;
          this.info_show = false;
          this.addbtn_show = false;
          this.add_show = false;
          this.is_show_viewstep = false;
          this.customer = '';
        }
        else if (resp[0].status == 2) {
          this.clear_fields();
          this.spinner.hide();
          this.toastr.error(resp[0].response, 'Error');
          this.add_show = false;
          this.info_show = false;
          this.addbtn_show = false;
          this.add_show = false;
          this.is_show_viewstep = false;
          this.customer = '';

        } else if (resp[0].status == 5) {

          this.user_name = '';
         // this.clear_fields();
          this.spinner.hide();
          this.toastr.error(resp[0].response, 'Error');
         // this.add_show = false;
          //this.info_show = false;
          this.addbtn_show = false;
          //this.add_show = false;
         // this.is_show_viewstep = false;
          this.customer = '';

          this.info_show = true;
          //this.addbtn_show = true;
          this.add_show = true;
          this.is_show_viewstep = true;
          this.response_info = "";
          this.view_info = "";

        }
         else {


          this.clear_fields();
          this.spinner.hide();
          this.toastr.error(resp[0].response, 'Error');
          this.add_show = false;
          this.info_show = false;
          this.addbtn_show = false;
          this.add_show = false;
          this.is_show_viewstep = false;
          this.customer = '';




        }
        this.GetCustomerList();
      });
}

    else {
      this.spinner.hide();
      return;

    }
    
  }

  ViewUserList() {
    const dialogRef = this.dialog.open(ViewaccountdetailsComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
     
    });
  }

}
