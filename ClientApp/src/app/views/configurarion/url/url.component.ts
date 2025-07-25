import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ConfigurarionComponent } from '../configurarion.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ConfigureService } from '../configure.service';
import { urldropdown, UrlTestParameterkeys, UrlTestRespParameter } from '../ConfigurationModel';
import { ConfigureModel, UrlTestModel, parameterkeys } from '../ConfigurationModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SigninService } from '../../sign-in/sign-in.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { RequestComponent } from '../request/request.component';
import { MatTooltipModule } from '@angular/material/tooltip'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.scss']
})

export class UrlComponent implements OnInit {
 // tabLabelClass = 'custom-tab-label';
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  //@Output() executeFunction: EventEmitter<void> = new EventEmitter<void>();
  @Output() conditionMet: EventEmitter<void> = new EventEmitter<void>();
  config_: ConfigurarionComponent; disableInput: boolean = false;
  private modalService: NgbModal; request_model: RequestComponent;
  configuremodel: ConfigureModel; is_disable_save: boolean = false;
  urltestmodel: UrlTestModel; is_url_fetch: boolean= true;
  parametermodel: parameterkeys; is_show_url_error: boolean = false; is_show_method_error: boolean = false;
  urltestparametermodel: UrlTestParameterkeys; is_show_contenttype_error: boolean = false; is_show_success_error: boolean = false;
  urltestrespmodel: UrlTestRespParameter;
  url: any; public is_show_err_no_data: boolean = false; public is_show_url_info: boolean = true; is_show_failure_error: boolean = false;
  is_show_timeout_error: boolean = false; is_show_retrycount_error: boolean = false; is_show_atleast_1param: boolean = false;
  req_id: any; public is_show_err_no_data_vmn: boolean = false;
  acc_id: any; cot: number = 0;
  method_: any;
  content_type: any;
  date_format: any = 0;
  customer_name_: any;
  proxy_s: any = false;
  success_response: any = "Success";
  failure_response: any = "Failed";
  timeout: any = "0";
  retry_count: any ="0";
  proxy: any;
  header: any;
  header_key1: any; header_keyvalue1: any; parameter_key1: any; parameter_keyvalue1: any;
  basic: any;
  token: any;
  url_b: any;
  UrlID: any;
  method_b: any;
  content_type_b: any;
  date_format_b: any;
  proxy_b: any;
  success_b: any;
  failure_b: any;
  timeout_b: any;
  retry_count_b: any;
  header_b: any;
  authentication_b: any;
  basic_b: any;
  token_b: any;
  request_body: any;
  isModalOpen: boolean;
  header_arr: any[] = [];
  parameter_arr: any[] = [];
  response_param: any[] = [];
  response_param_b: any[] = [];
  urlmethodlist = Array<urldropdown>();
  contenttypelist = Array<urldropdown>();
  dateformatlist = Array<urldropdown>();
  parameterlist = Array<urldropdown>();
  authenticatonlist = Array<urldropdown>();
  vmnlist = Array<urldropdown>();
  selectedValue: string;
  displayStyle = "none";
  parameter_final_arr: any[] = [];
  header_keys_b: any;
  parameters_keys_b: any[] = [];
  hasError: boolean = false;
  hasHeaderError: boolean = false;
  hasAuthenticationError: boolean = false;
  interval: any;
  response2: any;
  response3: any;
  respCheckCount: number;
  authentication_ : any = "0" ;
  vmnFlag: number = 0;
  vmn: any = 1;
  showApitestButton: boolean = true;

  constructor(private conf: ConfigurarionComponent, private matDialog: MatDialog, private config_service: ConfigureService,
    private snackBar: MatSnackBar, private toastr: ToastrService, private signInService: SigninService, private renderer: Renderer2, private spinner: NgxSpinnerService) {
    this.config_ = conf;
    this.config_service.tabChange$.subscribe(index => {
     // alert(this.config_.info_rid);
      this.ngOnInit();
      this.is_disable_save = false;
    });
  }


  from_3() {
    alert();
  }
  pre_back() {
   

      this.config_service.changeTab(2);
    
  }
  clear_initial() {
    this.url = '';
    this.content_type = undefined;
    this.method_ = undefined;
    this.success_response = "success";
    this.failure_response = "failure";
    this.timeout = "0";
    this.retry_count = "0";
    this.proxy_s = false;
    this.date_format = 0;
    this.parameter_final_arr = [];
    
    this.authentication_ = "0";
    this.token = '';
    this.basic = '';
    this.header_arr = [];

  }
  ngOnInit(): void {
    this.clear_initial();
   // this.spinner.hide();
    this.req_id = this.config_.info_rid;
    this.is_show_err_no_data_vmn = this.config_.url_no_vmn; this.is_show_url_info = this.config_.url_info;
    if (this.req_id == 0 || this.req_id == '') {
    //  console.log('if');
      this.is_show_err_no_data = true;
      this.config_.url_info = false;
      this.config_.url_no_vmn = false;
    }
    else  {
    //  console.log('else');
      this.config_.url_no_vmn = true;
      this.is_show_err_no_data = false;
      this.config_.url_info = false;
    }

   
    this.customer_name_ = this.config_.info_customer_name;
    this.configuremodel = new ConfigureModel();
    this.parametermodel = new parameterkeys();
    this.urltestmodel = new UrlTestModel();
    this.urltestparametermodel = new UrlTestParameterkeys();
    this.urltestrespmodel = new UrlTestRespParameter();
    this.GetDropdown();
    this.config_service.getBooleanObservable().subscribe(value => {
    //  console.log('Received boolean value in component:', value);
      this.is_show_err_no_data_vmn = value;
    });
  }
  ngAfterViewInit() {
   // console.log('ngAfterViewInit called');
    const tabLabels = document.querySelectorAll('.mat-tab-label');
   // console.log(tabLabels);vmn

    tabLabels.forEach((tabLabel) => {
   //   console.log('Setting styles for tab label:', tabLabel);
      this.renderer.setStyle(tabLabel, 'background-color', '#719e19');
      this.renderer.setStyle(tabLabel, 'color', 'white');
    });
  }

  clearUrlTabContent() {
    this.url = '';
    this.method_ = undefined;
    this.content_type = undefined;
    this.date_format = undefined;
    this.proxy_s = false;
    this.success_response = '';
    this.failure_response = '';
    this.timeout = '';
    this.retry_count = '';
    this.parameter_final_arr = [];
    this.authentication_ = "0";
    this.token = '';
    this.basic = '';
    this.header_arr = [];
  }

  checkAuthenticationValues(): boolean {
    if (this.authentication_ === 1 && (!this.token || this.token.trim() === '')) {
      this.toastr.error('Please fill in all the required values.');
      return false;
    }

    if (this.authentication_ === 2 && (!this.basic || this.basic.trim() === '')) {
      this.toastr.error('Please fill in all the required values.');
      return false;
    }

    return true;
  }

  checkHeaderValues(): boolean {
  //  console.log(this.header_arr);
    for (let i = 0; i < this.header_arr.length; i++) {
      const { key, value } = this.header_arr[i];
      if (!key || !value || key.trim() === "" || value.trim() === "") {
        this.toastr.error('Please fill in all the required header values.');
        return false;
      }
    }
    return true;
  }

  checkInputValues(): boolean {
  //  console.log('checkinput()', this.parameter_final_arr);
   // console.log('this, date_format', this.date_format);
    for (let i = 0; i < this.parameter_final_arr.length; i++) {
    //  console.log('this.parameter_final_arr[i].parameter_keyvalue', this.parameter_final_arr[i].parameter_keyvalue);
      const { parameter_key, parameter_keyvalue, date_format, vmn, parameter_customevalue } = this.parameter_final_arr[i];
      if (this.parameter_final_arr[i].parameter_key == '' || !this.parameter_final_arr[i].parameter_key ||
        this.parameter_final_arr[i].parameter_key.trim() === '' || this.parameter_final_arr[i].parameter_keyvalue == '' ||
        !this.parameter_final_arr[i].parameter_keyvalue || this.parameter_final_arr[i].parameter_keyvalue.trim() === '' ||
        (this.parameter_final_arr[i].parameter_keyvalue == 'Other' && (this.parameter_final_arr[i].parameter_customevalue == '' ||
        this.parameter_final_arr[i].parameter_customevalue == null || !this.parameter_final_arr[i].parameter_customevalue || this.parameter_final_arr[i].parameter_customevalue.trim() === ""))
      ) {
        this.toastr.error('Please fill in all the required request values.');
        return false;
      }
        else if ((this.parameter_final_arr[i].parameter_keyvalue === 'received time') && (this.date_format === '0' || this.date_format === 0 )) {
       // alert();
        this.toastr.error('Please select date format for received time parameter');

        return false;
      }



      ////if (!parameter_key || parameter_key.toString.trim() === "" || parameter_keyvalue == "" || (parameter_keyvalue === "Other" && (!parameter_customevalue || parameter_customevalue.toString().trim() === ""))
      //// ) {
      ////  this.toastr.error('Please fill in all the required request values.');
      ////  return false;
      ////}
    }
    return true;
  }

  openPopup() {
    this.urltestmodel = new UrlTestModel();
    this.urltestparametermodel = new UrlTestParameterkeys();
    const is_valid: boolean = this.is_valid_all_inputs();

    if (!is_valid) {
      // this.toastr.error('Please fill in with valid values.');

    } else {
      if (!this.url || this.url.trim() === '' && !this.success_response || this.success_response.trim() === '' && !this.failure_response || this.failure_response.trim() === '') {
        this.toastr.error('Please fill in with valid values.');
      }
      if (!this.checkAuthenticationValues()) {
        this.hasAuthenticationError = true;
        return;
      }
      this.hasAuthenticationError = false;
      if (!this.checkHeaderValues()) {
        this.hasHeaderError = true;
        return;
      }
      this.hasHeaderError = false;
      if (!this.checkInputValues()) {
        this.hasError = true;
        return;
      }
      this.hasError = false;
      // console.log("update");
      for (let i = 0; i < this.parameter_final_arr.length; i++) {
        const { parameter_key, parameter_keyvalue, parameter_customevalue, date_format, vmn } = this.parameter_final_arr[i];
        //  console.log("param_array",this.parameter_final_arr[i]);
        const propName = `parameter${i + 1}`;
        const valueName = `value${i + 1}`;
        if (parameter_keyvalue === 'Other') {
          this.urltestparametermodel[propName] = parameter_key;
          this.urltestparametermodel[valueName] = parameter_customevalue;
        }
        //else if (parameter_keyvalue === 'VMN') {
        //  this.urltestparametermodel[propName] = parameter_key;
        //  this.urltestparametermodel[valueName] = vmn;
        //}
        //else if (parameter_keyvalue === 'received time') {
        //  this.urltestparametermodel[propName] = parameter_key;
        //  this.urltestparametermodel[valueName] = date_format;
        //}
        else {
          this.urltestparametermodel[propName] = parameter_key;
          this.urltestparametermodel[valueName] = parameter_keyvalue;
          //const selectedOption = this.parameters_keys_b.find((type) => type.value === parameter_keyvalue);
          //const selectedOptionText = selectedOption ? selectedOption.text : '';
          //this.urltestparametermodel[valueName] = selectedOptionText;
        }
      }
      // console.log("req_array", this.urltestparametermodel);
      //this.urltestmodel.header_keys_b = [...this.header_arr.map(item => ({ key: item.key, value: item.value }))];
      this.urltestmodel.parameters_keys_b.push(this.urltestparametermodel);

      if (this.header_arr.length > 0) {
        this.header = "1";
        this.urltestmodel.header_keys_b = [...this.header_arr.map(item => ({ key: item.key, value: item.value }))];
      } else {
        this.header = "0";
      }

      if (this.proxy_s == true) {
        this.proxy = "1"
      }
      else {
        this.proxy = "0";
      }

      this.urltestmodel.ReqID = this.req_id;
      this.urltestmodel.url_b = this.url;
      this.urltestmodel.content_type_b = this.content_type.toString();
      this.urltestmodel.method_b = this.method_.toString();
      //this.urltestmodel.date_format_b = this.date_format.toString();
      this.urltestmodel.proxy_b = this.proxy;
      this.urltestmodel.authentication_b = this.authentication_.toString();
      this.urltestmodel.header_b = this.header.toString();
      this.urltestmodel.basic_b = this.basic;
      this.urltestmodel.token_b = this.token;
      this.urltestmodel.success_b = this.success_response;
      this.urltestmodel.failure_b = this.failure_response;
      this.urltestmodel.timeout_b = this.timeout.toString();
      this.urltestmodel.retry_count_b = this.retry_count.toString();
      this.request_body = JSON.stringify(this.urltestmodel);
      //  console.log(this.request_body);
      this.config_service.GetUrlTest(this.request_body).subscribe((resp: any[]) => {
        ;
        this.urltestmodel.UrlID = resp[0].urlID;
        const firstItem = resp[0].response[0];
      //  console.log('firstItem', firstItem);
        this.url_b = firstItem.Url;
        this.method_b = firstItem.Method;
        //this.date_format_b = firstItem.Date_Format;
        this.content_type_b = firstItem.Content_type;
        this.proxy_b = firstItem.Proxy;
        this.authentication_b = firstItem.authentication;
        this.basic_b = firstItem.Basic_Auth_Value;
        this.token_b = firstItem.Bearer_Token_Value;
        this.timeout_b = firstItem.Time_Out;
        this.retry_count_b = firstItem.Retry_Count;
        this.success_b = firstItem.Success_Response;
        this.failure_b = firstItem.Failure_Response;
        this.header_b = firstItem.Header;
        this.UrlID = this.urltestmodel.UrlID;
        const headerKeyValue = JSON.parse(firstItem.Header_KeyValue);
        this.header_keys_b = headerKeyValue;
        const parameter_ = JSON.parse(firstItem.Request_Parameters);
        //this.parameter_arr.push(parameter_[0]);
      //  console.log('firstItem.Header_KeyValue', firstItem.Header_KeyValue);
        const parameter_arr = parameter_[0];
        //  console.log('parameter-length', parameter_arr);
        if (firstItem.Header_KeyValue == '[]') {
          this.header_b = '0';

        }
        for (let i = 1; i <= 10; i++) {
          const parameterKey = parameter_arr[`value${i}`];
          if (parameterKey !== null) {
            const newItem = {
              parameter_key: parameterKey,
            };
            this.parameters_keys_b.push(newItem);
          }
        }
        if (firstItem.authentication === '' || firstItem.authentication === null || firstItem.authentication === undefined) {
          this.authentication_b = 'None';
        }
      });
      //console.log(' this.authentication_b ', this.authentication_b);
    
      this.displayStyle = "block";
      this.isModalOpen = true;
    }
  }

  closePopup() { 
    this.displayStyle = "none";
    this.url_b = '';
    this.method_b = '';
    this.content_type_b = '';
    this.proxy_b = '';
    this.timeout_b = '';
    this.retry_count_b = '';
    this.success_b = '';
    this.failure_b = '';
    this.date_format_b = '';
    this.authentication_b = '';
    this.basic_b = '';
    this.token_b = '';
    this.header_b = '';
    this.UrlID = '';
    this.response3 = '';
    this.header_keys_b = [];
    this.parameters_keys_b = [];

    this.is_url_fetch = false;
  }

  GetDropdown() {
    this.config_service.getUrlDropdown().subscribe((resp: any[]) => {
      this.urlmethodlist = resp[0].table1;
      this.contenttypelist = resp[0].table2;
      this.dateformatlist = resp[0].table3;
      this.parameterlist = resp[0].table4;
      this.authenticatonlist = resp[0].table5;
      this.vmnlist = resp[0].table6;
    });
  }

  updateVMNFlag() {
    this.vmnFlag = this.vmn ? 1 : 0;
  }
  is_valid_all_inputs() {

   // console.log('method', this.method_); console.log('content type', this.content_type);
    this.is_show_url_error = false; this.is_show_method_error = false; this.is_show_contenttype_error = false; this.is_show_success_error = false;
    this.is_show_failure_error = false; this.is_show_timeout_error = false; this.is_show_retrycount_error = false; this.is_show_atleast_1param = false;
    if (!this.url || this.url.trim() === '') {
      this.is_show_url_error = true;
      this.toastr.error('Please add URL');
      return false;
    }
    if (this.method_ === undefined || (this.method_ !== 0 && this.method_ !== 1)) {
      this.is_show_method_error = true;
      this.toastr.error('Please add method');
      return false;

    } if (this.content_type === undefined || this.content_type === "undefined") {
      this.is_show_contenttype_error = true;
      this.toastr.error('Please add content type');
      return false;

    }
    if (this.success_response.trim() === '' || !this.success_response) {
      this.is_show_success_error = true;
      this.toastr.error('Please add success response');
      return false;

    }
    if (this.failure_response.trim() === '' || !this.failure_response) {
      this.is_show_failure_error = true;
      this.toastr.error('Please add failure response');
      return false;



    }
    if (!this.timeout || this.timeout.toString().trim() === ''  ) {
      this.is_show_timeout_error = true;
      this.toastr.error('Please add timeout count');
      return false;


    }
    if (!this.retry_count || this.retry_count.toString().trim() === '' ) {
      this.is_show_retrycount_error = true;
      this.toastr.error('Please add retry count');
      return false;


    }
    if (this.parameter_final_arr.length == 0) {
      this.is_show_atleast_1param = true;
      this.toastr.error('Please add atleast 1 parameter');
      return false;
        

    }


    return true;
  }
  configure() {
   // console.log('dateformat', this.date_format);
    this.conditionMet.emit();
 // this.executeFunction.emit();
   // this.request_model.GetRequestTable('0');
    //this.config_service.changeTab(7);
   // console.log('  this.config_.actual_vmn_json', this.config_.actual_vmn_json);
    if (this.config_.actual_vmn_json.length == 0 || this.config_.actual_vmn_json == undefined ) {
      this.is_show_err_no_data_vmn = true;
    }
    else {
      this.is_show_err_no_data_vmn = false;
      if (this.config_.info_rid == null || this.config_.info_rid == "" || this.config_.info_rid == '0') {
        const errorMessage = 'Invalid Request ID found. Please select a request for configure ';
        this.toastr.error(errorMessage, 'Error');
        this.config_service.changeTab(0);
      }
      else {
        const is_valid: boolean = this.is_valid_all_inputs();

        if (!is_valid) {
         // this.toastr.error('Please fill in with valid values.');

        } else {

          this.configuremodel = new ConfigureModel();
          this.parametermodel = new parameterkeys();
          if (!this.url || this.url.trim() === '' || !this.success_response || this.success_response.trim() === '' || !this.failure_response || this.failure_response.trim() === '') {
            this.toastr.error('Please fill in with valid values.');
          }
          if (!this.checkAuthenticationValues()) {
            this.hasAuthenticationError = true;
            return;
          }
          this.hasAuthenticationError = false;
          if (!this.checkHeaderValues()) {
            this.hasHeaderError = true;
            return;
          }
          this.hasHeaderError = false;
          if (!this.checkInputValues()) {
            this.hasError = true;
            return;
          }
          this.hasError = false;
          // console.log("final array",this.parameter_final_arr);
          for (let i = 0; i < this.parameter_final_arr.length; i++) {
            const { parameter_key, parameter_keyvalue, parameter_customevalue } = this.parameter_final_arr[i];
            const propName = `parameter${i + 1}`;
            const valueName = `value${i + 1}`;
            if (parameter_keyvalue === 'Other') {
              this.parametermodel[propName] = parameter_key;
              this.parametermodel[valueName] = parameter_customevalue;
            }
            //else if (parameter_keyvalue === 'VMN') {
            //  this.parametermodel[propName] = parameter_key;
            //  this.parametermodel[valueName] = vmn;
            //}
            //else if (parameter_keyvalue === 'received time') {
            //  this.parametermodel[propName] = parameter_key;
            //  this.parametermodel[valueName] = date_format;
            //}
            else {
              this.parametermodel[propName] = parameter_key;
              this.parametermodel[valueName] = parameter_keyvalue;
              //const selectedOption = this.parameterlist.find((type) => type.value === parameter_keyvalue);
              //const selectedOptionText = selectedOption ? selectedOption.text : '';
              //this.parametermodel[valueName] = selectedOptionText;
            }
          }
          //  console.log(' this.parametermodel', this.parametermodel);
          //this.configuremodel.header_keys = [...this.header_arr.map(item => ({ key: item.key, value: item.value }))];
          this.configuremodel.parameters_keys.push(this.parametermodel);
          if (this.header_arr.length > 0) {
            this.header = "1";
            this.configuremodel.header_keys = [...this.header_arr.map(item => ({ key: item.key, value: item.value }))];
          } else {
            this.header = "0";
          }
          if (this.proxy_s == true) {
            this.proxy = "1"
          }
          else {
            this.proxy = "0";
          }

          this.configuremodel.ReqID = this.req_id;
          this.acc_id = this.signInService.decryptData(sessionStorage.getItem("AccountId"));
          this.configuremodel.Account_id = this.acc_id;
          this.configuremodel.url = this.url;
          this.configuremodel.content_type = this.content_type.toString();
          this.configuremodel.method = this.method_.toString();
          try {
            if (this.date_format != null && this.date_format != '') {
              this.configuremodel.date_format = this.date_format.toString();
            }
          }
          catch { return null; }
          try {
            if (this.date_format === '0' || this.date_format === 0) {
              this.configuremodel.date_format = this.date_format.toString();
            }
          }
          catch { return null; }
          this.configuremodel.proxy = this.proxy;
          this.configuremodel.success_response = this.success_response;
          this.configuremodel.failure_response = this.failure_response;
          this.configuremodel.timeout = this.timeout.toString();
          this.configuremodel.retry_count = this.retry_count.toString();
          this.configuremodel.authentication = this.authentication_.toString();
          this.configuremodel.token = this.token;
          this.configuremodel.basic = this.basic;
          this.configuremodel.header = this.header;
          this.configuremodel.VMN_length_flag = this.vmnFlag.toString();
          // this.configuremodel.actual_vmn_list = this.config_.actual_vmn_json;
          this.configuremodel.actual_vmn_list = [...this.config_.actual_vmn_json.map(item => ({ msisdn: item.msisdn, imsi: item.imsi }))];
        //  console.log('( this.configuremodel.actual_vmn_list);', this.configuremodel.actual_vmn_list);
          this.request_body = JSON.stringify(this.configuremodel);
        ///  console.log('(this.request_body);', this.request_body);
          this.config_service.UrlConfigure(this.request_body).subscribe((resp: any[]) => {
            this.conditionMet.emit();
            if (resp[0].status == 1) {

             
              this.toastr.success(resp[0].response, 'Success');
              this.is_disable_save = true;
              this.disableButton();

            } else {
             

              this.toastr.error(resp[0].response, 'Error');




            }
          });
        }
        this.showApitestButton = true;
      }
    }
   // console.log('config.actual_vmn_json', this.config_.actual_vmn_json);
    
  }
  disableButton() {
    this.config_service.updatevmnbtnState(false);
  }


  clear_out() {
    this.proxy = false;
    this.url = "";
    this.content_type = "undefined";
    

  }
  addparam() {
    if (this.parameters_keys_b.length == 9) {
      //this.snackBar.open('Parameter length exceeds limit.', 'error', { duration: 3000 });
      this.toastr.error('Parameter length exceeds limit.', 'Error');
    } else {
      const newItem = {
        parameter_key: '',
        parameter_keyvalue: ''
      };
      this.parameters_keys_b.push(newItem);
    //  console.log(this.parameters_keys_b);
    }
  }

  minusparam(i: any) {
    //alert(i);
    this.parameters_keys_b.splice(i, 1);
  }

  addparameter() {
    this.is_show_atleast_1param = false;
    if (!this.checkInputValues()) {
      this.hasError = true;
    } else {
      this.hasError = false;

      if (this.parameter_final_arr.length == 9) {

        this.toastr.error('Parameter length exceeds limit.', 'Error');
        //this.snackBar.open('Parameter length exceeds limit.', 'error', { duration: 3000 });
      } else {
        const newItem = {
          parameter_key: '',
          parameter_keyvalue: ''
        };
        this.parameter_final_arr.push(newItem);
        // console.log(this.parameter_final_arr);
      }
}
    
  }

  addheader() {
    if (!this.checkHeaderValues()) {
      this.hasHeaderError = true; 
      return; 
    }
    this.hasHeaderError = false;

    if (this.header_arr.length == 10) {
      const errorMessage = 'Header length exceeds limit. ';
      this.toastr.error(errorMessage, 'Error');

    } else {
      const newItem = {
        parameter_key: '',
        parameter_keyvalue: ''
      };
      this.header_arr.push(newItem);
     // console.log(this.header_arr);
    }

  }

  minusheader(i: any) {
    //alert(i);
    this.header_arr.splice(i, 1);
  }

  minusparameter(i: any) {
    //alert(i);
    this.parameter_final_arr.splice(i, 1);
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
  private recursiveAPITestResponse(url_id: string): void {

    if (this.is_url_fetch) {
      this.cot = 0;
    }
   
    var req_body = "{\"UrlID\":\"" + url_id + "\"}";

    this.config_service.APITestResponse(req_body).subscribe((resp: any) => {
     // console.log('2 response', resp);
      if (resp.status == "1" || resp.status == 1) {
       // alert('if');
        //this.response3 = JSON.stringify(resp[0].url_response).replace(
        //  /\\/g,
        //  ""
        //);
        this.response3 = resp.url_response;
       // console.log('wthis.response3', this.response3);
      } else {
       // alert('else');
       // this.toastr.error(JSON.stringify('didnt get resp'), "failed");
        // Set an interval to call recursiveAPITestResponse after a delay
        this.cot = this.cot+1;
        if (this.cot < 20) {

          this.recursiveAPITestResponse(url_id);
        }
       

        // Adjust the delay as needed (e.g., 2000 milliseconds)
      }
    });
  }

  

  apiTest() {

    this.is_url_fetch = true;
    this.spinner.show();
   // console.log('parameters_keys_b', this.parameters_keys_b);
    let val_flag = '0';
    for (let m = 0; m < this.parameters_keys_b.length; m++) {
      if (!this.parameters_keys_b[m].parameter_keyvalue || this.parameters_keys_b[m].parameter_keyvalue.trim() === '') {
      //  console.log('parameters_keys_b v', this.parameters_keys_b[m].parameter_keyvalue);
        val_flag = '1';
        break;
      }
    }
    if (val_flag === '1') {
      this.toastr.error('Parameter value cannot empty', "failed");
      this.spinner.hide();
    }
    else {
    //  this.disableInput = true;
      let req_body = {};
      for (let i = 0; i < this.parameters_keys_b.length; i++) {
        req_body[this.parameters_keys_b[i].parameter_key] = this.parameters_keys_b[i].parameter_keyvalue;
      }
      const params: parameterkeys = new parameterkeys();
      for (let i = 0; i < this.parameters_keys_b.length; i++) {
        const { parameter_key, parameter_keyvalue } = this.parameters_keys_b[i];
        const propName = `parameter${i + 1}`;
        const valueName = `value${i + 1}`;

        params[propName] = parameter_key;
        params[valueName] = parameter_keyvalue;

      }
      // console.log('params', params);
      let req_body_json = JSON.stringify(req_body);
    //  console.log('req_body', req_body_json);
      //this.insert_parameter_model = new InserturltestModel();
      //this.insert_parameter_model.data = req_body_json; this.insert_parameter_model.url_id = this.url_id; this.insert_parameter_model.parameters = JSON.stringify(params);
      //const request_body = JSON.stringify(this.insert_parameter_model);


      this.urltestmodel = new UrlTestModel();
      this.urltestrespmodel = new UrlTestRespParameter();
      this.parametermodel = new parameterkeys();
      this.urltestmodel.parameters = JSON.stringify(params);
      this.urltestmodel.data = req_body_json;
      // this.urltestmodel.response_param_b = [...this.parameters_keys_b.map(item => ({ key: item.parameter_key, value: item.parameter_keyvalue }))];
      this.urltestmodel.UrlID = this.UrlID
      this.urltestmodel.retry_count_b = this.retry_count_b;
      this.urltestmodel.timeout_b = this.timeout_b;
      this.request_body = JSON.stringify(this.urltestmodel);
      //   console.log('JSON.stringify(this.urltestmodel);', JSON.stringify(this.urltestmodel));
      this.response3 = undefined;
      this.respCheckCount = 0;

           
        this.config_service.UrlTestResponse(this.request_body).subscribe((resp: any[]) => {
          this.spinner.hide();
       //   console.log('uri resp', resp);

          if (resp[0].urlcaller_urlid == '' || !resp[0].urlcaller_urlid || resp[0].urlcaller_urlid == 0 || resp[0].urlcaller_urlid == '0') {
            this.toastr.error(JSON.stringify(resp[0].response), "failed");


          }
          else {
            var url_id = resp[0].urlcaller_urlid;
            var respo = JSON.stringify(resp[0].response).replace(
              /\\/g,
              "");
          //  console.log('respo',respo);
            if (resp[0].status == "0" || respo == "Url ID not found") {
              this.response3 = "Please Wait for Response ...";
              this.recursiveAPITestResponse(url_id);
            //  console.log('athis.response3', this.response3);
              //APITestResponse
              //var req_body = "{\"UrlID\":\"" + url_id +"\"}";
              //this.config_service.APITestResponse(req_body).subscribe((resp: any[]) => {
              //  console.log('2 response', resp);
              //  if (resp[0].status == "1" || resp[0].status == 1) {
              //    this.response3 = JSON.stringify(resp[0].url_response).replace(
              //      /\\/g,
              //      ""
              //    );

              //  }
              //  else {

              //    this.toastr.error(JSON.stringify('didnt get resp'), "failed");
              //  }

              //});
            }

            else {
              this.respCheckCount = this.respCheckCount + 1;
              this.response2 = resp[0].response;
             this.response3 = "Please Wait for Response ...";
              this.toastr.error(JSON.stringify(this.response2), "failed");
              //this.response3 = JSON.stringify(this.response2).replace(
              //  /\\/g,
              //  ""
              //);
            }
           


          }
      

        }, (error) => {
          this.response3 = "";
          this.toastr.error(JSON.stringify(error), "failed");
        });
      
      //this.interval = setInterval(() => {
      //  this.config_service.UrlTestResponse(this.request_body).subscribe((resp: any[]) => {
      //    this.spinner.hide();
      //    console.log('resp', resp);
      //    this.respCheckCount = this.respCheckCount + 1;
      //    this.response2 = resp[0].response;
      //    this.response3 = "Please Wait for Response ...";

      //    this.response3 = JSON.stringify(this.response2).replace(
      //      /\\/g,
      //      ""
      //    );
      //    clearInterval(this.interval);

      //    if (this.respCheckCount >= this.timeout_b) {
      //      clearInterval(this.interval);
      //      if (this.response3 == "") this.response3 = "TimeOut";
      //    }

      //  }, (error) => {
      //    this.response3 = "";
      //    this.toastr.error(JSON.stringify(error), "failed");
      //  });
      //}, 2000);
     // this.spinner.hide();
    }
  }
}

