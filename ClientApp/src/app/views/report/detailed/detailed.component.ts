
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { ManageAccServiceService } from '../../../core/manage-acc-service/manage-acc-service.service';

import { FlowbuilderService } from '../../flow/flowbuilder.service';
import { SigninService } from '../../sign-in/sign-in.service';
import {   dropdown, VMNReport, SummaryReportModal } from '../report.modal';

import { ReportService } from '../report.service';

import { ExcelService } from '../../../core/services/excel-services';

import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.scss']
})
export class DetailedComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
 // @ViewChild("sort") sort: MatSort;
   @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;
  maxDate: string;
  displayedColumns = ['SMS Sequence ID', 'Customer Name', 'Source Address', 'Destination Address', 'Short Message', 'Received Time', 'Message Part Number', 'Message Part Count', 'Smsc IP', 'IP Address', 'Message ID', 'Instance ID'];
  isDatepickerOpen = false;
  color = '#90c81f';
  mode = 'indeterminate';
  value = 50;
  formGroup: FormGroup;
  statusFormControl: FormControl;
  ELEMENT_DATA: any[] = [];
  //displayedColumns = ['VMN', 'IMSI', 'Customer', 'Created_Date', 'Status', 'Proxy', 'Method', 'URL'];
  // dataSource = new MatTableDataSource(this.ELEMENT_DATA);
 // dataSource: any;
 

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  customer_: any = '0'; detail_m: SummaryReportModal;
  customerlist = Array<dropdown>();
  statuslist = Array<dropdown>();
  vmnlist = Array<dropdown>();
  showSpinner1: boolean = false;
  showSpinner2: boolean = false;
  is_show: boolean = false;
  status_: any = '0'; vmn_: any = '0'; created_date_: Date = new Date();
  VMNReport_modal: VMNReport; is_show1: boolean = false;
  currentDateTime: string; report_data: any ;

  constructor(private datePipe: DatePipe, private spinner: NgxSpinnerService, private toastr: ToastrService, private manageservice: ManageAccServiceService, 
    private excelservice: ExcelService,
    private flowbuilder: FlowbuilderService,
    private changeDetectRef: ChangeDetectorRef,
    private signInService: SigninService,
    private router: Router, private report_service: ReportService, private cdr: ChangeDetectorRef) {
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
  onDatepickerClose() {
   
    this.isDatepickerOpen = false;
  }
  ngOnInit(): void {
    this.spinner.hide();
    this.GetCustomerDropDown();
    //console.log(this.dataSource);
  }
  GetCustomerDropDown() {

    this.report_service.GetCustomerDropDown().subscribe((data: any) => {
     // console.log('data', data);
      this.customerlist = data.Table;
      this.statuslist = data.Table1;
    //  console.log(' this.customerlist', this.customerlist);
    //  console.log(' this.statuslist', this.statuslist);
      const request_body = '{"Customer_Id":"0"}';
      this.report_service.CustomerSearchVMNList(request_body).subscribe((data: any[]) => {
    //    console.log('data', data);
        this.vmnlist = data;
        this.is_show = true;

      });
    });
    


  }
  customer_search() {

   // console.log('this.customer_', this.customer_);
    const request_body = '{"Customer_Id":"' + this.customer_ + '"}';
    this.report_service.CustomerSearchVMNList(request_body).subscribe((data: any[]) => {
    //  console.log('data', data);
      this.vmnlist = data;
      this.is_show = true;
      this.created_date_ = new Date();

    });

  }
  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  show_detail_report() {
    let customern: any = '';
    this.spinner.show();
    this.showSpinner1 = false;
    this.showSpinner2 = true;
    //  console.log('GetSummaryReport');
   // console.log('customer', this.customer_);
    const customer_n = this.customerlist.find(item => item.value === this.customer_);
    if (this.customer_ == "0") {
      customern = 'All Customer';
    } else {
      customern = customer_n.text;
    }

   // console.log('customern', customern);
    //  console.log('vmn', this.vmn_);
    //console.log('date', this.created_date_);
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

    //console.log(formattedDate); // Output: 07/07/2023





    if (formattedDate == '1970-01-01') {
      formattedDate = '0';
    }


    // console.log('formattedDate', formattedDate);
    this.detail_m = new SummaryReportModal;
    this.detail_m.customer = this.customer_.toString();
    this.detail_m.vmn = this.vmn_.toString();
    this.detail_m.date = formattedDate.toString();
    const request_body = JSON.stringify(this.detail_m);
    // console.log('request_body', request_body);
    this.report_service.DetailReport(request_body).subscribe((data: any[]) => {
      console.log('response', data);
      //this.dataSource = new MatTableDataSource(
      //  JSON.parse(JSON.stringify(data))

      //);

      this.report_data = JSON.parse(JSON.stringify(data));
      console.log(' this.report_data', this.report_data);
      if (this.report_data != null) {
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
       // this.cdr.detectChanges();
          this.dataSource = new MatTableDataSource(this.report_data);
          
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log('  this.dataSource', this.dataSource);
        console.log('  this.paginator', this.paginator);
        console.log(' this.sort', this.sort);
      
      } else {

        this.toastr.warning('No Data Available');

      }
      
      //  console.log('report_data', this.report_data);

       
      
        this.spinner.hide();

      
      

    });
  }



  downloadLog() {
    let customern: any  ='';
    this.spinner.show();
    this.showSpinner1 = true;
    this.showSpinner2 = false;
  //  console.log('GetSummaryReport');
   // console.log('customer', this.customer_);
    const customer_n = this.customerlist.find(item => item.value === this.customer_);
    if (this.customer_ == "0") {
      customern = 'All Customer';
    } else {
      customern = customer_n.text;
    }
     
   // console.log('customern', customern);
  //  console.log('vmn', this.vmn_);
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

    //console.log(formattedDate); // Output: 07/07/2023





    if (formattedDate == '1970-01-01') {
      formattedDate = '0';
    }


   // console.log('formattedDate', formattedDate);
    this.detail_m = new SummaryReportModal;
    this.detail_m.customer = this.customer_.toString();
    this.detail_m.vmn = this.vmn_.toString();
    this.detail_m.date = formattedDate.toString();
    const request_body = JSON.stringify(this.detail_m);
   // console.log('request_body', request_body);
    this.report_service.DetailReport(request_body).subscribe((data: any[]) => {
     // console.log('response', data);
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
      //  console.log('report_data', this.report_data);
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
       // console.log('report_data', this.report_data);
        const currentDate = new Date();
        const year1 = currentDate.getFullYear();
        const month1 = this.padZero(currentDate.getMonth() + 1);
        const day1 = this.padZero(currentDate.getDate());
        const hours = this.padZero(currentDate.getHours());
        const minutes = this.padZero(currentDate.getMinutes());
        const seconds = this.padZero(currentDate.getSeconds());

        this.currentDateTime = `${year1}-${month1}-${day1} ${hours}:${minutes}`;
        var jsonDataDownload = this.report_data;
       // console.log('jsonDataDownload', jsonDataDownload);
        const fileName = customern+ ' -Detailed Report' + this.currentDateTime;
        this.excelservice.exportAsExcelFile(jsonDataDownload, fileName);
        this.spinner.hide();
      }
      this.spinner.hide();
     
    });
    
  }

}
