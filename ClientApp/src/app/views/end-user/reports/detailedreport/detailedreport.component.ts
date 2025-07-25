import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ManageAccServiceService } from '../../../../core/manage-acc-service/manage-acc-service.service';
import { ExcelService } from '../../../../core/services/excel-services';
import { FlowbuilderService } from '../../../flow/flowbuilder.service';
import { dropdown } from '../../../report/report.modal';
import { SigninService } from '../../../sign-in/sign-in.service';
import { EndUserService } from '../../end-user.service';
import { EndUserSummaryReportModal, EndUserVMNReport } from '../../end-userModel';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-detailedreport',
  templateUrl: './detailedreport.component.html',
  styleUrls: ['./detailedreport.component.scss']
})
export class DetailedreportComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;
  maxDate: string;
  isDatepickerOpen = false;
  formGroup: FormGroup;
  statusFormControl: FormControl;
  ELEMENT_DATA: any[] = [];
  displayedColumns = ['SMS Sequence ID', 'Customer Name', 'Source Address', 'Destination Address', 'Short Message', 'Received Time', 'Message Part Number', 'Message Part Count', 'Smsc IP', 'IP Address', 'Message ID', 'Instance ID'];
  // dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  dataSource: MatTableDataSource<any>;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
     this.dataSource.filter = filterValue;
  }
  customer_: any = '0'; detail_m: EndUserSummaryReportModal;
  customerlist = Array<dropdown>();
  statuslist = Array<dropdown>();
  vmnlist = Array<dropdown>();
  is_show: boolean = false;
  status_: any = '0'; vmn_: any = '0'; created_date_: Date = new Date();
  VMNReport_modal: EndUserVMNReport; is_show1: boolean = false;
  showSpinner1: boolean = false;
  showSpinner2: boolean = false;
  currentDateTime: string; report_data: any; user_id: any = "";
  constructor(private datePipe: DatePipe, private spinner: NgxSpinnerService, private toastr: ToastrService, private manageservice: ManageAccServiceService, private cdr: ChangeDetectorRef,
    private excelservice: ExcelService,
    private flowbuilder: FlowbuilderService,
    private changeDetectRef: ChangeDetectorRef,
    private signInService: SigninService,
    private router: Router, private report_service: EndUserService) {
    this.maxDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  }
  onDatepickerOpen() {

    this.isDatepickerOpen = true;
  }

  ngAfterViewInit() {
    this.spinner.hide();
    if (this.dataSource && this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }


  show_detail_report() {
    let customern: any = '';
    this.spinner.show();
    this.showSpinner1 = false;
    this.showSpinner2 = true;
   // console.log('date', this.created_date_);
    const createdDate = new Date(this.created_date_);
    const day = createdDate.getDate();
    const month = createdDate.getMonth() + 1; // Months are zero-indexed, so we add 1
    const year = createdDate.getFullYear();

    // Pad the day and month with leading zeros if necessary
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Create the final formatted date string
    // let formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
    let formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

    //  console.log(formattedDate); // Output: 07/07/2023





    if (formattedDate == '1970-01-01') {
      formattedDate = '0';
    }


    //  console.log('formattedDate', formattedDate);
    this.detail_m = new EndUserSummaryReportModal;
    this.detail_m.user_id = this.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    this.detail_m.vmn = this.vmn_.toString();
    this.detail_m.date = formattedDate.toString();
    const request_body = JSON.stringify(this.detail_m);
    //   console.log('request_body', request_body);
    this.report_service.DetailReport(request_body).subscribe((data: any) => {
       //   console.log('response', data);
      //this.dataSource = new MatTableDataSource(
      //  data
      //);
     
        this.report_data = JSON.parse(JSON.stringify(data));
     // console.log('report_data', this.report_data);
      if (this.report_data !=null) {

        for (const item of this.report_data) {
          // Check if the item has the 'Received Time' property
          if (item.hasOwnProperty('Received Time')) {
            // Replace 'T' with a space in the 'Received Time' property
            try { item['Received Time'] = item['Received Time'].replace('T', ' '); }
            catch {
              // console.log('cant replace T');
            }

          }
        }

        this.dataSource = new MatTableDataSource(
          this.report_data
        );
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.spinner.hide();

      } else {

        this.toastr.warning('No Data Available');

      }
      this.spinner.hide();
      
      //  console.log('report_data', this.report_data);

     




    });
  }

  onDatepickerClose() {

    this.isDatepickerOpen = false;
  }
  ngOnInit(): void {
    this.GetCustomerDropDown();
    this.spinner.hide();
  }
  GetCustomerDropDown() {
    this.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    const req_body = "{\"user_id\":\"" + this.user_id + "\"}";
    this.report_service.GetCustomerDropDown(req_body).subscribe((data: any) => {
    //  console.log('data', data);
      this.vmnlist = data.Table1;
      this.statuslist = data.Table;
     // console.log(' this.customerlist', this.customerlist);
     // console.log(' this.statuslist', this.statuslist);
      const request_body = '{"Customer_Id":"0"}';
      
    });



  }
  customer_search() {

  //  console.log('this.customer_', this.customer_);
    const request_body = '{"Customer_Id":"' + this.customer_ + '"}';
    this.report_service.CustomerSearchVMNList(request_body).subscribe((data: any[]) => {
   //   console.log('data', data);
      this.vmnlist = data;
      this.is_show = true;

    });

  }
  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  downloadLog() {
    this.spinner.show();
    this.showSpinner1 = true;
    this.showSpinner2 = false;
  //  console.log('GetSummaryReport');
   // console.log('customer', this.customer_);
   // console.log('vmn', this.vmn_);
    console.log('date', this.created_date_);
    const createdDate = new Date(this.created_date_);
    const day = createdDate.getDate();
    const month = createdDate.getMonth() + 1; // Months are zero-indexed, so we add 1
    const year = createdDate.getFullYear();

    // Pad the day and month with leading zeros if necessary
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Create the final formatted date string
    // let formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
    let formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

  //  console.log(formattedDate); // Output: 07/07/2023





    if (formattedDate == '1970-01-01') {
      formattedDate = '0';
    }


  //  console.log('formattedDate', formattedDate);
    this.detail_m = new EndUserSummaryReportModal;
    this.detail_m.user_id = this.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    this.detail_m.vmn = this.vmn_.toString();
    this.detail_m.date = formattedDate.toString();
    const request_body = JSON.stringify(this.detail_m);
 //   console.log('request_body', request_body);
    this.report_service.DetailReport(request_body).subscribe((data: any) => {
  //    console.log('response', data);

      if (data == null) {
        this.toastr.warning('No Data Available');
        this.spinner.hide();
      }
      else if (data.length == 0) {
        this.toastr.warning('No Data Available');
        this.spinner.hide();
      }

      else {
        this.report_data = JSON.parse(JSON.stringify(data));
        //console.log('report_data', this.report_data);
        const customern = this.report_data[0]['Customer Name'];
        const currentDate = new Date();
        const year1 = currentDate.getFullYear();
        const month1 = this.padZero(currentDate.getMonth() + 1);
        const day1 = this.padZero(currentDate.getDate());
        const hours = this.padZero(currentDate.getHours());
        const minutes = this.padZero(currentDate.getMinutes());
        const seconds = this.padZero(currentDate.getSeconds());

        this.currentDateTime = `${year1}-${month1}-${day1} ${hours}:${minutes}`;
        var jsonDataDownload = this.report_data;
     //   console.log('jsonDataDownload', jsonDataDownload);
        const fileName = customern+'-Detailed Report' + this.currentDateTime;
        this.excelservice.exportAsExcelFile(jsonDataDownload, fileName);
        this.spinner.hide();
      }
      this.spinner.hide();

    });
   
  }
}
