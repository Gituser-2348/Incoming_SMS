import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../../../../core/services/excel-services';
import { dropdown } from '../../../report/report.modal';
import { SigninService } from '../../../sign-in/sign-in.service';
import { EndUserService } from '../../end-user.service';
import { EndUserVMNReport } from '../../end-userModel';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vmnlist',
  templateUrl: './vmnlist.component.html',
  styleUrls: ['./vmnlist.component.scss']
})
export class VmnlistComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  maxDate: string; numRows: any = 5;
  isDatepickerOpen = false;
  formGroup: FormGroup;
  statusFormControl: FormControl;
  ELEMENT_DATA: any[] = [];
  displayedColumns = ['VMN', 'IMSI', 'Customer', 'Created_Date', 'Status', 'Proxy', 'Method', 'URL'];
  // dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  dataSource: any;
  //applyFilter(filterValue: string) {
  //  filterValue = filterValue.trim(); // Remove whitespace
  //  filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  //  // this.dataSource.filter = filterValue;
  //}
  customer_: any = '0';
  customerlist = Array<dropdown>();
  statuslist = Array<dropdown>();
  vmnlist = Array<dropdown>();
  is_show: boolean = false;
  status_: any = '0'; vmn_: any = '0'; created_date_: Date = new Date();
  VMNReport_modal: EndUserVMNReport; is_show1: boolean = false;
  currentDateTime: string; report_data: any[] = []; user_id: any = "";
  constructor(private cdr: ChangeDetectorRef,private datePipe: DatePipe, private Enduser_report_service: EndUserService, private excelservice: ExcelService, private signInService: SigninService, private toastr: ToastrService, private spinner: NgxSpinnerService) {
    this.statusFormControl = new FormControl('', Validators.required);
    this.formGroup = new FormGroup({
      status: this.statusFormControl
    });
    this.maxDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  }
  ngAfterViewInit() {
    if (this.dataSource && this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  onDatepickerOpen() {

    this.isDatepickerOpen = true;
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
    this.Enduser_report_service.GetCustomerDropDown(req_body).subscribe((data: any) => {
     // console.log("get cus dropdown ts");
     // console.log('data', data);
      this.vmnlist = data.Table1;
      this.statuslist = data.Table;
     // console.log(' this.customerlist', this.customerlist);
     // console.log(' this.statuslist', this.statuslist);
      const request_body = '{"Customer_Id":"0"}';

    });
    this.GetVMNTable();


  }
  GetVMNTable() {
   // console.log('get vmn table in ts file');
    //console.log('vmn', this.vmn_);
    //console.log('status', this.status_);
    const createdDate = new Date(this.created_date_);
    const day = createdDate.getDate();
    const month = createdDate.getMonth() + 1; // Months are zero-indexed, so we add 1
    const year = createdDate.getFullYear();

    // Pad the day and month with leading zeros if necessary
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Create the final formatted date string
    /*let formattedDate = `${formattedDay}-${formattedMonth}-${year}`;*/
    let formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

   // console.log(formattedDate); // Output: 07/07/2023





    if (formattedDate == '1970-01-01') {
      formattedDate = '0';
    }


  //  console.log('created date', formattedDate);
    this.VMNReport_modal = new EndUserVMNReport();
    this.VMNReport_modal.VMN = this.vmn_.toString();
    this.VMNReport_modal.status = this.status_.toString();
    /*this.VMNReport_modal.date = formattedDate.toString();*/
    this.VMNReport_modal.date = '0';
    this.VMNReport_modal.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    const request_body = JSON.stringify(this.VMNReport_modal);
    this.Enduser_report_service.VMNReport(request_body).subscribe((data: any[]) => {
    //  console.log('response', data);
      this.dataSource = new MatTableDataSource(
        JSON.parse(JSON.stringify(data))

      );

      this.cdr.detectChanges();
       this.numRows = this.dataSource.data.length;
      
    //  this.paginator.pageSize = this.numRows < 5 ? this.numRows : 5;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.is_show1 = true;
      this.report_data = data;
     // console.log('report_data', this.report_data);
     // console.log('datasource', this.dataSource);
    });


  }
  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  downloadLog() {

    this.spinner.show();
    this.GetVMNTable();
   // console.log('get vmn table in ts file');
   // console.log('vmn', this.vmn_);
   // console.log('status', this.status_);
    const createdDate = new Date(this.created_date_);
    const day = createdDate.getDate();
    const month = createdDate.getMonth() + 1; // Months are zero-indexed, so we add 1
    const year = createdDate.getFullYear();

    // Pad the day and month with leading zeros if necessary
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Create the final formatted date string
    /*let formattedDate = `${formattedDay}-${formattedMonth}-${year}`;*/
    let formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

   // console.log(formattedDate); // Output: 07/07/2023





    if (formattedDate == '1970-01-01') {
      formattedDate = '0';
    }


  //  console.log('created date', formattedDate);
    this.VMNReport_modal = new EndUserVMNReport();
    this.VMNReport_modal.VMN = this.vmn_.toString();
    this.VMNReport_modal.status = this.status_.toString();
    /* this.VMNReport_modal.date = formattedDate.toString();*/
    this.VMNReport_modal.date = '0';
    this.VMNReport_modal.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    const request_body = JSON.stringify(this.VMNReport_modal);
    this.Enduser_report_service.VMNReport(request_body).subscribe((data: any[]) => {

      if (data == null) {
        this.toastr.warning('No Data Available');
        this.spinner.hide();
      }
     else if (data.length == 0) {
        this.toastr.warning('No Data Available');
        this.spinner.hide();
      }

      else {

      //  console.log('this.report_data', data);
        this.report_data = JSON.parse(JSON.stringify(data));

       // console.log('this.report_data', this.report_data);
        this.report_data = this.report_data.map(obj => {
          delete obj["Circle"];
          return obj;
        });
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
        const customern = this.report_data[0]['Customer'];

        //const numRows = this.dataSource.data.length;
        //this.paginator.pageSize = numRows < 5 ? numRows : 5;
        //this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = this.padZero(currentDate.getMonth() + 1);
        const day = this.padZero(currentDate.getDate());
        const hours = this.padZero(currentDate.getHours());
        const minutes = this.padZero(currentDate.getMinutes());
        const seconds = this.padZero(currentDate.getSeconds());

        this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        var jsonDataDownload = JSON.parse(JSON.stringify(this.report_data));
        const fileName = customern+ '-VMN Report' + this.currentDateTime;
        this.excelservice.exportAsExcelFile(jsonDataDownload, fileName);
        this.spinner.hide();
      }
      this.spinner.hide();
    });
  }
}


