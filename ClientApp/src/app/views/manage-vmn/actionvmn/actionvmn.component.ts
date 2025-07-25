import { ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ManagevmnService } from '../manage-vmn/managevmn.service';
import { vmndropdown } from '../manage-vmnModel';
import { vmnchangestatusmodel } from '../manage-vmnModel';
import { SigninService } from '../../sign-in/sign-in.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Injectable, ViewContainerRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfigureService } from '../../configurarion/configure.service';
import { ConfigurarionComponent } from '../../configurarion/configurarion.component';
import { ConfigureModel, parameterkeys } from '../../configurarion/ConfigurationModel';
import { ApiurltestComponent } from '../apiurltest/apiurltest.component';
@Component({
  selector: 'app-actionvmn',
  templateUrl: './actionvmn.component.html',
  styleUrls: ['./actionvmn.component.scss']
})
export class ActionvmnComponent implements OnInit {
  formGroup: FormGroup;
  @ViewChild('innerTabGroup', { static: true }) innerTabGroup!: MatTabGroup;
 
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() vmn_id: string; is_show_parameter_err: boolean = false;
  statuslist = Array<vmndropdown>(); 
  VMN_: any; IMSI_: any; Customer: any; Status: any=''; Remark: any=''; Status_: any='';
  changestatusmodel: vmnchangestatusmodel;
  user_id: any;
  config_: ConfigurarionComponent; configuremodel: ConfigureModel;
  parametermodel: parameterkeys;
  url: any; proxy: any; authentication: any;
  req_id: any;
  content_type: any; vmn_length_flag: any;
  method_: any; is_show_bearer_msg: boolean = false; is_show_basic_msg: boolean = false;
  date_format: any = '0'; is_valid: boolean;
  customer_name_: any; parameter_arr_err_msg: any;
  proxy_s: any = false; success_response: any; failure_response: any; timeout: any; retry_count: any;
  proxy_: any;
  header_key1: any; header_keyvalue1: any; parameter_key1: any; parameter_keyvalue1: any;
  statusFormControl: FormControl = new FormControl('', Validators.required);
  remarkFormControl: FormControl = new FormControl('', Validators.required);
  showError_status: boolean = false;
  showError_remark: boolean = false;
  Bearer_token_value: any;
  Basic_auth_value: any; is_show_header_err: boolean = false; header_arr_err_msg: any;
  is_show_url_err_msg: boolean = false; is_show_content_type_err_msg: boolean = false; is_show_method_err_msg: boolean = false; is_show_success_err_msg: boolean = false;
  is_show_failure_err_msg: boolean = false; is_show_retry_err_msg: boolean = false; is_show_timeout_err_msg: boolean = false;
  authentication_: any = "0";

  color = 'forestgreen';
  request_body: any;
  // addp_: AddparameterComponent;
  isModalOpen: boolean;
  header_arr: any[] = [];
  parameter_arr: any[] = []; parameter_final_arr: any[] = [];
  urlmethodlist = Array<vmndropdown>(); vmn_length_list = Array<vmndropdown>();
  contenttypelist = Array<vmndropdown>();
  dateformatlist = Array<vmndropdown>();
  parameterlist = Array<vmndropdown>();
  authenticatonlist = Array<vmndropdown>();
  selectedValue: string;
 
  displayStyle = "none";


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any, private cdr: ChangeDetectorRef,
    private mngvmnservice: ManagevmnService, private signInService: SigninService,
    private snackBar: MatSnackBar, private config_service: ConfigureService,
    private toastr: ToastrService, private dialog: MatDialog, private dialogRef: MatDialogRef<ActionvmnComponent>) {
    this.vmn_id = dialogData.vmn_id;
    this.statusFormControl = new FormControl('', Validators.required);
    this.formGroup = new FormGroup({
      status: this.statusFormControl
    });

  }
  
  ngOnInit(): void {
    setTimeout(() => {
      
      this.innerTabGroup.selectedIndex = 0; // Highlight the first inner tab
      
    });
    this.GetDropdown();
   
    this.mngvmnservice.GetChangeStatusInfo(this.vmn_id.toString()).subscribe((resp: any[]) => {
    //  console.log(resp);

    //  console.log("response");
     // console.log(resp[0].table1);
     // console.log(resp[0].table2);
      const tbl = resp[0].table1;
    //  console.log(tbl);
      this.VMN_ = tbl[0].VMN;
      this.statuslist = resp[0].table2;
     /* this.VMN_ = resp[0].table1.VMN;*/
      this.IMSI_ = resp[0].table1[0].IMSI;
      this.Customer = resp[0].table1[0].Customer;
      this.Status = resp[0].table1[0].Status;

      


      //console.log(this.VMN_);
     // console.log(this.IMSI_);
     // console.log(this.Customer);
     
    });
    this.GetChangeUrlInfo(this.vmn_id);
  }
  GetChangeUrlInfo(vmn:any) {
    
    this.mngvmnservice.ChangeUrlInfo(vmn.toString()).subscribe((resp: any[]) => {
    //  console.log(resp);

    //  console.log("response", resp);

      this.url = resp[0].url;
      this.method_ = Number(resp[0].method);
      this.content_type = Number(resp[0].content_type);
      this.date_format = Number(resp[0].date_format);
      this.success_response = resp[0].success_response;
      this.failure_response = resp[0].failure_response;
      this.retry_count = resp[0].retry_count;
      this.timeout = resp[0].time_out;
      this.authentication_ = Number(resp[0].authentication);
      this.vmn_length_flag = resp[0].longcode_length_flag;
      this.proxy_s = resp[0].proxy;
      if (this.authentication_ == 1) {
        this.Bearer_token_value = resp[0].authorization_value;
      } else if (this.authentication_ == 2) {
        this.Basic_auth_value = resp[0].authorization_value;
      } else {
        this.authentication_ = "0";
      }

      if (this.proxy_s == 1) {
        this.proxy_s = true;
      } else {
        this.proxy_s = false;
      }
      if (this.method_ == 0) {
       // alert();
       this.url= this.url.replace('?','');
      }

      try {

        const header_ = JSON.parse(resp[0].header);
       // console.log('header_', header_);
       
        const header1 = header_.header;
       // console.log('header1', header1);
        if (this.authentication_ == 1 || this.authentication_ == 2) {

          //const remainingHeaders = header_.header.slice(1); // Skip the first entry

          //// Create a new array to hold the remaining headers
          //const newHeaderArray = remainingHeaders.map(item => {
          //  return {
          //    key: item.key,
          //    value: item.value
          //  };
          //});
          //const remainingHeaders = header_.header.filter(item => item.key !== "Authorization");

          //// Create a new array to hold the remaining headers
          //const newHeaderArray = remainingHeaders.map(item => {
          //  return {
          //    key: item.key,
          //    value: item.value
          //  };
          //});
          for (let i = 1; i < header1.length; i++) {

            const item_h = header1[i];
            // console.log('item_h', item_h);
            this.header_arr.push(item_h);
            console.log('this.header_arr', this.header_arr);
          }
        //  this.header_arr.push(newHeaderArray);
          //console.log(newHeaderArray);
          this.cdr.detectChanges(); // Trigger change detection
       //   console.log('this.header_arr', this.header_arr);

          //for (let i = 1; i < header1.length; i++) {

          //  const item_h = header1[i];
          // // console.log('item_h', item_h);
          //  this.header_arr.push(item_h);
          //}
        }
        else {
          for (let i = 0; i < header1.length; i++) {

            const item_h = header1[i];
           // console.log('item_h', item_h);
            this.header_arr.push(item_h);
          //  console.log('this.header_arr', this.header_arr);
          }
        }
        
        
        /*this.header_arr = [...header_.map(item => ({ key: item.key, value: item.value }))];*/
        // Code that relies on the parsed header
      } catch (error) {
        // Handle the exception here
        //console.log('An exception occurred:', error);
      }
      try {
        const parameter_ = JSON.parse(resp[0].parameter);
      //  console.log('parameter', parameter_);
        this.parameter_key1 = parameter_[0].parameter1;
        this.parameter_keyvalue1 = Number(parameter_[0].value1);
        this.parameter_arr.push(parameter_[0]);

      } catch (error) { console.log('An exception occurred:', error); }
     
    //  console.log('keyvalues.', this.parameter_key1, this.parameter_keyvalue1, this.header_key1, this.header_keyvalue1);
    
     // console.log('header_arr', this.header_arr);
      
    //  console.log('parameter_arr', this.parameter_arr);

      for (let i = 1; i <= 10; i++) {
        const parameterKey = this.parameter_arr[0][`parameter${i}`];
        let parameterValue = this.parameter_arr[0][`value${i}`];
        const parameterValue_o = this.parameter_arr[0][`value${i}`];
        if (parameterKey === null || parameterValue === null || parameterKey === '' || parameterValue === '' ||
          typeof parameterKey === 'undefined' || typeof parameterValue === 'undefined') {
          
          break; // Exit the loop
        }
       
        parameterValue = parameterValue == "msisdn" ? '1' : parameterValue == "message" ? '2' : parameterValue == "received time" ? '3' : parameterValue == "VMN" ? '4' : parameterValue == "dcs" ? '5' : parameterValue == "Unique id" ? '6' : '7';
          
            //if (isNaN(parameterValue)) {
            //  parameterValue = '10';
            //}
           
          const newItem = {
            parameter_key: parameterKey,
            parameter_keyvalue: parameterValue,
            parameter_customevalue: parameterValue_o
          };
          this.parameter_final_arr.push(newItem);
       
      }

 //     console.log('parameter_arr_final', this.parameter_final_arr);

    });//subscribe
  }
  GetDropdown() {

    this.config_service.getUrlDropdown().subscribe((resp: any[]) => {
    //  console.log(resp);

    //  console.log("response");
    //  console.log(resp[0].table1);
    //  console.log(resp[0].table2);
      this.urlmethodlist = resp[0].table1;
      this.contenttypelist = resp[0].table2;
      this.dateformatlist = resp[0].table3;
      this.parameterlist = resp[0].table4;
      this.authenticatonlist = resp[0].table5;
      this.vmn_length_list = resp[0].table6;
    });
  }
  saveChanges() {
    this.showError_status = false;

    this.showError_remark = false;
    if (this.Status_ == null || this.Status_=='' ) {
      this.showError_status = true;

    } else if (this.Remark == null || this.Remark == '' || this.Remark.trim() === '') {
      this.showError_status = false;
      
      this.showError_remark = true;
    }

    else {
      this.showError_remark = false;
     
      this.statusFormControl.markAllAsTouched();
    
      this.changestatusmodel = new vmnchangestatusmodel();
      this.changestatusmodel.lcsms_id = this.vmn_id.toString();
      this.changestatusmodel.status = this.Status_.toString();
      this.changestatusmodel.remark = this.Remark.toString();
      this.user_id = this.signInService.decryptData(sessionStorage.getItem("AccountId"));
     // console.log('user id', this.user_id);
      this.changestatusmodel.user_id = this.user_id.toString();


      this.mngvmnservice.Changevmnstatus(JSON.stringify(this.changestatusmodel)).subscribe((resp: any[]) => {
       // console.log(resp);
        if (resp[0].status == 1) {
          //this.snackBar.open(resp[0].response, 'Success', { duration: 6000 });
         
          this.toastr.success(resp[0].response, 'Success');
         
          this.Status_ = " ";
          this.Remark = "";
          this.dialogRef.close();
        } else {
          //this.snackBar.open(resp[0].response, 'Error', { duration: 6000 });
          this.toastr.error(resp[0].response, 'Error');
          this.Status_ = " ";
          this.Remark = "";
        }

      });
    }

  }

  openPopup() { //open popup to select header
    this.displayStyle = "block";
  }
  closePopup() { //close popup
    this.displayStyle = "none";
  }
  
  addheader() {
    this.is_show_header_err = false;
    let is_valid = '0';
    for (let i = 0; i < this.header_arr.length; i++) {

      if (!this.header_arr[i].key || !this.header_arr[i].value || this.header_arr[i].key.trim() === '' || this.header_arr[i].value.trim() === '') {
        is_valid = '1';
        break;

      }
    }
    if (is_valid == '0') {
      if (this.header_arr.length == 9) {
        this.snackBar.open('Header length exceeds limit.', 'Warning', { duration: 6000 });
        this.is_show_header_err = true;
        this.header_arr_err_msg = 'Header length exceeds limit.';

      } else {
        const newItem = {
          key: '',
          value: ''
        };
        this.header_arr.push(newItem);
       // console.log(this.header_arr);
      }
    }
    else {
      this.snackBar.open('Either header key or value cannot be null', 'Warning', { duration: 6000 });
      this.is_show_header_err = true;
      this.header_arr_err_msg = 'Either header key or value cannot be null';


    }
   

  }

  validation() {
    this.is_show_header_err = false; this.is_show_parameter_err = false; this.is_show_bearer_msg = false; this.is_show_basic_msg = false;
    this.is_show_url_err_msg = false; this.is_show_content_type_err_msg = false; this.is_show_method_err_msg = false; this.is_show_success_err_msg = false;
    this.is_show_failure_err_msg = false; this.is_show_timeout_err_msg = false; this.is_show_retry_err_msg = false;
    for (let i = 0; i < this.header_arr.length; i++) {

      if (!this.header_arr[i].key || !this.header_arr[i].value || this.header_arr[i].key.trim() === '' || this.header_arr[i].value.trim() === '') {
        this.snackBar.open('Either key or value of headers cannot be empty', '! Warning', {
          duration: 10000,
          panelClass: ['red-snackbar']
        });
        this.is_show_header_err = true;
        this.header_arr_err_msg = 'Either header key or value cannot be null';

        return false;

      }
    }

  
    
    for (let i = 0; i < this.parameter_final_arr.length; i++) {
    //  console.log('this.parameter_final_arr[i].parameter_keyvalue', this.parameter_final_arr[i].parameter_keyvalue);
      if (this.parameter_final_arr[i].parameter_key == '' || !this.parameter_final_arr[i].parameter_key ||
      this.parameter_final_arr[i].parameter_key.trim() === '' || this.parameter_final_arr[i].parameter_keyvalue == '' ||
      !this.parameter_final_arr[i].parameter_keyvalue || this.parameter_final_arr[i].parameter_keyvalue.trim() === '' ||
      (this.parameter_final_arr[i].parameter_keyvalue == '7' && (this.parameter_final_arr[i].parameter_customevalue == '' ||
        this.parameter_final_arr[i].parameter_customevalue == null || !this.parameter_final_arr[i].parameter_customevalue))
    ) {
        this.snackBar.open('Either key or value of parameters cannot be empty', '! Warning', { duration: 10000 });
        this.is_show_parameter_err = true;
     this.parameter_arr_err_msg = 'Either key or value of parameters cannot be empty';
        return false;
       
        
      }

      else if ((this.parameter_final_arr[i].parameter_keyvalue === '3') && (this.date_format === '0' || this.date_format === 0)) {
        // alert();
        //this.toastr.error('Please select date format for received time parameter');
        this.snackBar.open('Please select date format for received time parameter', '! Warning', { duration: 10000 });
        this.is_show_parameter_err = true;
        this.parameter_arr_err_msg = 'Please select date format for received time parameter';
        return false;
      }

    }

    if (this.authentication_ == '1' && (!this.Bearer_token_value || this.Bearer_token_value.trim() === '')) {
      this.snackBar.open('Please add Bearer token ', '! Warning', { duration: 10000 });
      this.is_show_bearer_msg = true;
      return false;
    }
    if (this.authentication_ == '2' && (!this.Basic_auth_value || this.Basic_auth_value.trim() === '')) {
      this.is_show_basic_msg = true;
      this.snackBar.open('Please add Basic authentication ', '! Warning', { duration: 10000 });
      return false;
    }
 
    if (this.url == '' || this.url == null || !this.url || this.url.trim() === '') {
      this.is_show_url_err_msg = true;
      return false;
    }
    if (this.content_type == '' || this.content_type == null || !this.content_type ) {
     
      this.is_show_content_type_err_msg = true;
      return false;
    }
    if ((this.method_ == '' || this.method_ == null || !this.method_) && this.method_ != 0) {
     // alert('if'); alert(this.method_);
      this.is_show_method_err_msg = true;
      return false;
    }
    if (this.success_response == '' || this.success_response == null || !this.success_response || this.success_response.trim() === '') {

      this.is_show_success_err_msg = true;
      return false;
    }
    if (this.failure_response == '' || this.failure_response == null || !this.failure_response || this.failure_response.trim() === '') {

      this.is_show_failure_err_msg = true;
      return false;
    }
   // console.log('this.timeout', this.timeout);
    if (this.timeout === '' || this.timeout === null  ) {
      alert();
      this.is_show_timeout_err_msg = true;
      return false;
    }
    if (this.retry_count === '' || this.retry_count === null ) {

      this.is_show_retry_err_msg = true;
      return false;
    }
    return true;


  }
  validateInput(event: any) {

    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    input.value = numericValue;
    // alert(this.timeout.charlength);
    const isValid = !isNaN(Number(numericValue));
    // alert(this.timeout.length);
    //if (this.timeout.length > 1 || this.retry_count.length >1) {
    //  //alert();
    //  event.preventDefault();
    //}
    if (!isValid) {
      event.preventDefault();
    }

  }

  update() {
    //alert(this.method_);
    this.is_valid = this.validation();
    if (this.is_valid) {
   //  alert('update');
      const header_flag = this.header_arr.length;

     // alert(this.proxy_s);
      this.configuremodel = new ConfigureModel();
      this.parametermodel = new parameterkeys();
    //  console.log("update");
    //  console.log('parameter array fimal ', this.parameter_final_arr);
      for (let i = 0; i < this.parameter_final_arr.length; i++) {
        const { parameter_key, parameter_keyvalue, parameter_customevalue } = this.parameter_final_arr[i];
        const propName = `parameter${i + 1}`;
        const valueName = `value${i + 1}`;
        if (parameter_keyvalue === '7') {
          this.parametermodel[propName] = parameter_key;
          this.parametermodel[valueName] = parameter_customevalue;
        } else {
          const selectedOption = this.parameterlist.find((type) => type.value.toString() === parameter_keyvalue);
          const selectedOptionText = selectedOption ? selectedOption.text : '';
          this.parametermodel[valueName] = selectedOptionText;


          this.parametermodel[propName] = parameter_key;
          //this.parametermodel[valueName] = parameter_keyvalue;
        }
      }
   //   console.log('this.parametermodel', this.parametermodel);
      this.user_id = this.signInService.decryptData(sessionStorage.getItem("AccountId"));
     // console.log('user id', this.user_id);
      this.configuremodel.Account_id = this.user_id.toString();
      this.configuremodel.header_keys = [...this.header_arr.map(item => ({ key: item.key, value: item.value }))];

      this.configuremodel.parameters_keys.push(this.parametermodel);

     // console.log(this.header_arr);
    //  console.log(this.parameter_arr);

      if (this.proxy_s == true) {
     //   console.log("if");
        this.proxy_ = "1"
      }
      else {
      //  console.log("else");
        this.proxy_ = "0";
      }
      if (header_flag == 0) {
        this.configuremodel.header = '0';
      } else {
        this.configuremodel.header = '1';



      }
    //  console.log(this.proxy_);
      this.configuremodel.VMN = this.vmn_id.toString();
      this.configuremodel.ReqID = this.req_id;
      this.configuremodel.url = this.url;
      this.configuremodel.content_type = this.content_type.toString();
      this.configuremodel.method = this.method_.toString();
      this.configuremodel.date_format = this.date_format.toString();
      this.configuremodel.proxy = this.proxy_;
      this.configuremodel.success_response = this.success_response;
      this.configuremodel.failure_response = this.failure_response;
      this.configuremodel.timeout = this.timeout.toString();
      this.configuremodel.retry_count = this.retry_count.toString();
      this.configuremodel.authentication = this.authentication_.toString();

      this.configuremodel.basic = this.Basic_auth_value;
      this.configuremodel.token = this.Bearer_token_value;
      this.configuremodel.VMN_length_flag = this.vmn_length_flag.toString();

      this.request_body = JSON.stringify(this.configuremodel);

     // console.log(this.request_body);
      this.mngvmnservice.UrlChange(this.request_body).subscribe((resp: any[]) => {
      //  console.log(resp);
      //  console.log("url UrlChange ewsponse");
       // console.log(resp);
        if (resp[0].status == 1) {
          this.snackBar.open(resp[0].response, 'Success', { duration: 3000 });
        } else {
          this.snackBar.open(resp[0].response, 'Error', { duration: 3000 });
        }

      });
    }
    
   
  }
  
  addparameter() {

    this.is_show_parameter_err = false;
    let con = '0';
    for (let i = 0; i < this.parameter_final_arr.length; i++) {
     
      if (this.parameter_final_arr[i].parameter_key == '' || !this.parameter_final_arr[i].parameter_key ||
        this.parameter_final_arr[i].parameter_key.trim() === '' || this.parameter_final_arr[i].parameter_keyvalue == '' ||
        !this.parameter_final_arr[i].parameter_keyvalue || this.parameter_final_arr[i].parameter_keyvalue.trim() === '' ||
        (this.parameter_final_arr[i].parameter_keyvalue == '7' && (this.parameter_final_arr[i].parameter_customevalue == '' ||
        this.parameter_final_arr[i].parameter_customevalue == null || !this.parameter_final_arr[i].parameter_customevalue))
      ) {
        con = '1';
        this.snackBar.open('Either key or value of parameters cannot be empty', 'Warning', { duration: 6000 });
        this.is_show_parameter_err = true;
        this.parameter_arr_err_msg = 'Either key or value of parameters cannot be empty';
        break;
      }

    }
    if (this.parameter_final_arr.length == 9) {

      this.snackBar.open('Parameter length exceeds limit.', 'Warning', { duration: 6000 });
      this.is_show_parameter_err = true;
      this.parameter_arr_err_msg = 'Parameter length exceeds limit.';
    } else if (con == '0') {
      const newItem = {
        parameter_key: '',
        parameter_keyvalue: ''
      };
      this.parameter_final_arr.push(newItem);
      
    } else {

    }
  }
  
  minusheader(i: any) {
   
    this.header_arr.splice(i, 1);
  }
  minusparameter(i: any) {
    
    this.parameter_final_arr.splice(i, 1);
  }
  apiurltest() {
  //  console.log('this.url',this.url);
    this.is_valid = this.validation();
    if (this.is_valid) {
      const header_flag = this.header_arr.length;


      this.configuremodel = new ConfigureModel();
      this.parametermodel = new parameterkeys();
      //console.log("update");
      //console.log('parameter array fimal ', this.parameter_final_arr);
      for (let i = 0; i < this.parameter_final_arr.length; i++) {
        const { parameter_key, parameter_keyvalue, parameter_customevalue } = this.parameter_final_arr[i];
        const propName = `parameter${i + 1}`;
        const valueName = `value${i + 1}`;
        if (parameter_keyvalue === '7') {
          this.parametermodel[propName] = parameter_key;
          this.parametermodel[valueName] = parameter_customevalue;
        } else {
          const selectedOption = this.parameterlist.find((type) => type.value.toString() === parameter_keyvalue);
          const selectedOptionText = selectedOption ? selectedOption.text : '';
          this.parametermodel[valueName] = selectedOptionText;


          this.parametermodel[propName] = parameter_key;
          //this.parametermodel[valueName] = parameter_keyvalue;
        }
      }
     // console.log('this.parametermodel', this.parametermodel);
      this.user_id = this.signInService.decryptData(sessionStorage.getItem("AccountId"));
     // console.log('user id', this.user_id);
      this.configuremodel.Account_id = this.user_id.toString();
      this.configuremodel.header_keys = [...this.header_arr.map(item => ({ key: item.key, value: item.value }))];

      this.configuremodel.parameters_keys.push(this.parametermodel);

     // console.log(this.header_arr);
     // console.log(this.parameter_arr);

      if (this.proxy_s == true) {
       // console.log("if");
        this.proxy_ = "1"
      }
      else {
      //  console.log("else");
        this.proxy_ = "0";
      }
      if (header_flag == 0) {
        this.configuremodel.header = '0';
      } else {
        this.configuremodel.header = '1';



      }
     // console.log(this.proxy_);
      this.configuremodel.VMN = this.vmn_id.toString();
      this.configuremodel.ReqID = this.req_id;
      this.configuremodel.url = this.url;
      this.configuremodel.content_type = this.content_type.toString();
      this.configuremodel.method = this.method_.toString();
      this.configuremodel.date_format = this.date_format.toString();
      this.configuremodel.proxy = this.proxy_;
      this.configuremodel.success_response = this.success_response;
      this.configuremodel.failure_response = this.failure_response;
      this.configuremodel.timeout = this.timeout.toString();
      this.configuremodel.retry_count = this.retry_count.toString();
      this.configuremodel.authentication = this.authentication_.toString();
      this.configuremodel.basic = this.Basic_auth_value;
      this.configuremodel.token = this.Bearer_token_value;
      this.configuremodel.VMN_length_flag = this.vmn_length_flag.toString();
      this.request_body = JSON.stringify(this.configuremodel);

    //  console.log(this.request_body);
      this.mngvmnservice.UrlChangeTestInsert(this.request_body).subscribe((resp: any[]) => {
     //   console.log(resp);
     //   console.log("url UrlChangeTestInsert ewsponse");
      //  console.log(resp);
        if (resp[0].status == 1) {

          this.dialog.open(ApiurltestComponent, {
            disableClose: true,
            data: {
              url_id: resp[0].url_id,
              response: resp[0].response
            }
          });


        } else {
          this.snackBar.open(resp[0].response, 'Error', { duration: 3000 });
        }

      });
    }
    
  }
}
