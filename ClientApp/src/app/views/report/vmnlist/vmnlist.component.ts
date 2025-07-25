import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { ReportService } from '../report.service';
import { dropdown, VMNReport } from '../report.modal';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExcelService } from '../../../core/services/excel-services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-vmnlist',
  templateUrl: './vmnlist.component.html',
  styleUrls: ['./vmnlist.component.scss']
})
 

export class VMNListComponent implements OnInit {
 
  @ViewChild(MatPaginator) paginator: MatPaginator; numRows: any = 5;
  @ViewChild(MatSort) sort: MatSort;
  formGroup: FormGroup;
  statusFormControl: FormControl; maxDate: string;
  isDatepickerOpen = false;
  ELEMENT_DATA: any[]=[];
  displayedColumns = ['VMN', 'IMSI', 'Customer', 'Created_Date', 'Status', 'Proxy', 'Method','URL'];

  dataSource: any;
 
  customer_: any='0';
  customerlist = Array<dropdown>();
  statuslist = Array<dropdown>();
  vmnlist = Array<dropdown>();
  is_show: boolean = false;
  status_: any = '0'; vmn_: any = '0'; created_date_: Date = new Date();
  VMNReport_modal: VMNReport; is_show1: boolean = false;
  currentDateTime: string; report_data: any[] = [];


  constructor(private report_service: ReportService, private excelservice: ExcelService, private toastr: ToastrService, private datePipe: DatePipe, private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef) {
    this.statusFormControl = new FormControl('', Validators.required);

    this.formGroup = new FormGroup({
      status: this.statusFormControl
    });
    this.maxDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;

  }
  ngAfterViewInit() {
    this.spinner.hide();
    if (this.dataSource && this.paginator && this.sort) {
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
    }
  }
  onDatepickerOpen() {
    
    this.isDatepickerOpen = true;
  }

  onDatepickerClose() {

    this.isDatepickerOpen = false;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  ngOnInit(): void {
    this.spinner.hide();
    this.GetCustomerDropDown();
  }
  GetCustomerDropDown() {

    this.report_service.GetCustomerDropDown().subscribe((data:any) => {
    //  console.log('data',data);
      this.customerlist = data.Table;
      this.statuslist = data.Table1;
   //   console.log(' this.customerlist', this.customerlist);
    //  console.log(' this.statuslist', this.statuslist);
      const request_body = '{"Customer_Id":"0"}';
      this.report_service.CustomerSearchVMNList(request_body).subscribe((data: any[]) => {
       // console.log('data', data);
        this.vmnlist = data;
        this.is_show = true;

      });
    });
  //  this.GetVMNTable1();
    this.GetVMNTable2(this.customer_);
  //  this.GetVMNTable2(this.customer_);

  }

  onCustomerChange(event: any): void {
   
   // console.log('Selected customer value:', event);
    const request_body = '{"Customer_Id":"' + this.customer_ + '"}';
    this.report_service.CustomerSearchVMNList(request_body).subscribe((data: any[]) => {
    //  console.log('data', data);
      this.vmnlist = data;
      this.is_show = true;

    });
    this.vmn_ = '0';
    this.GetVMNTable2(this.customer_);
  
   
  }
 
  GetVMNTable2(customer_id: any) {
   // alert();
   // console.log('date', this.created_date_);
  //  console.log('GetVMNTable1 vmn table in ts file');
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
    this.VMNReport_modal = new VMNReport();
   // this.VMNReport_modal.VMN = '0';
   // this.VMNReport_modal.status = '0';
    this.VMNReport_modal.VMN = this.vmn_.toString();
    this.VMNReport_modal.status = this.status_.toString();
  //  this.VMNReport_modal.date = formattedDate.toString();
   // this.VMNReport_modal.Customer_Id = this.customer_.toString();
  //  this.VMNReport_modal.date = formattedDate.toString();
    this.VMNReport_modal.date = '0';
    this.VMNReport_modal.Customer_Id = customer_id.toString();
    const request_body = JSON.stringify(this.VMNReport_modal);
    this.report_service.VMNReport(request_body).subscribe((data: any[]) => {
     // console.log('response', data);
      this.dataSource = new MatTableDataSource(
        JSON.parse(JSON.stringify(data))

      );
      this.cdr.detectChanges();
     // console.log('dataSource', this.dataSource);
      this.numRows = this.dataSource.data.length;
    
      this.dataSource.paginator = this.paginator;
   
      this.dataSource.sort = this.sort;
      this.is_show1 = true;
      this.report_data = data;
    
    });
    this.is_show1 = true;

  }





  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  downloadLog() {
    let customern: any = '';
    this.spinner.show();
    
   // console.log('customer', this.customer_);
    const customer_n = this.customerlist.find(item => item.value === this.customer_);
    if (this.customer_ == "0") {
      customern = 'All Customer';
    } else {
      customern = customer_n.text;
    }

   // console.log('customern', customern);
  
    const createdDate = new Date(this.created_date_);
    const day = createdDate.getDate();
    const month = createdDate.getMonth() + 1; // Months are zero-indexed, so we add 1
    const year = createdDate.getFullYear();

   
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    

    let formattedDate = `${year}-${formattedMonth}-${formattedDay}`;


    if (formattedDate == '1970-01-01') {
      formattedDate = '0';
    }

    this.VMNReport_modal = new VMNReport();
    this.VMNReport_modal.VMN = this.vmn_.toString();
    this.VMNReport_modal.status = this.status_.toString();
   // this.VMNReport_modal.date = formattedDate.toString();
    this.VMNReport_modal.date = '0';
    this.VMNReport_modal.Customer_Id = this.customer_.toString();
    const request_body = JSON.stringify(this.VMNReport_modal);
    this.report_service.VMNReport(request_body).subscribe((data: any[]) => {
    //  console.log('data', data);
      if (data.length == 0) {
        this.toastr.warning('No Data Available');
        this.spinner.hide();
      } else {

        this.report_data = JSON.parse(JSON.stringify(data));
        this.report_data = this.report_data.map(obj => {
          delete obj["Circle"];
          return obj;
        });

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = this.padZero(currentDate.getMonth() + 1);
        const day = this.padZero(currentDate.getDate());
        const hours = this.padZero(currentDate.getHours());
        const minutes = this.padZero(currentDate.getMinutes());
        const seconds = this.padZero(currentDate.getSeconds());

        this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        var jsonDataDownload = JSON.parse(JSON.stringify(this.report_data));
        const fileName = customern +'-VMN Report' + this.currentDateTime;
        this.excelservice.exportAsExcelFile(jsonDataDownload, fileName);
        this.spinner.hide();

      }
      });
  
  }
}
