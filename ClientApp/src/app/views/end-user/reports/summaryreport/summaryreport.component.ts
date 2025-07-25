import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ManageAccServiceService } from '../../../../core/manage-acc-service/manage-acc-service.service';
import { ExcelService } from '../../../../core/services/excel-services';
import { FlowbuilderService } from '../../../flow/flowbuilder.service';
import { SigninService } from '../../../sign-in/sign-in.service';
import { EndUserService } from '../../end-user.service';
import { dropdown, EndUserSummaryReportModal, EndUserVMNReport } from '../../end-userModel';

@Component({
  selector: 'app-summaryreport',
  templateUrl: './summaryreport.component.html',
  styleUrls: ['./summaryreport.component.scss']
})
export class SummaryreportComponent implements OnInit {
  maxDate: string;
  isDatepickerOpen = false;
  Total_count: any = 0; single_part: any = 0; multi_part: any = 0; Failure_count: any = 0;
  formGroup: FormGroup; summary_m: EndUserSummaryReportModal;
  statusFormControl: FormControl;
  ELEMENT_DATA: any[] = [];
  displayedColumns = ['VMN', 'IMSI', 'Customer', 'Created_Date', 'Status', 'Proxy', 'Method', 'URL'];
  // dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  dataSource: any;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
  }
  customer_: any = '0';
  customerlist = Array<dropdown>();
  statuslist = Array<dropdown>();
  vmnlist = Array<dropdown>();
  is_show: boolean = false;
  status_: any = '0'; vmn_: any = '0'; created_date_: Date = new Date();
  VMNReport_modal: EndUserVMNReport; is_show1: boolean = false;
  currentDateTime: string; report_data: any[] = []; user_id: any;
  constructor(private datePipe: DatePipe, private toastr: ToastrService, private manageservice: ManageAccServiceService,
    private excelservice: ExcelService, private flowbuilder: FlowbuilderService,
    private signInService: SigninService, private report_service: EndUserService) {
    this.maxDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  }
  onDatepickerOpen() {

    this.isDatepickerOpen = true;
  }

  onDatepickerClose() {

    this.isDatepickerOpen = false;
  }
  ngOnInit(): void {

    this.GetCustomerDropDown();
    this.GetSummaryReport();
  }
  GetCustomerDropDown() {

    this.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    const req_body = "{\"user_id\":\"" + this.user_id + "\"}";

    this.report_service.GetCustomerDropDown(req_body).subscribe((data: any) => {
    //  console.log('data', data);
      this.vmnlist = data.Table1;
      this.statuslist = data.Table;
      //console.log(' this.customerlist', this.customerlist);
    //  console.log(' this.statuslist', this.statuslist);
      const request_body = '{"Customer_Id":"0"}';
      
    });



  }
 
  GetSummaryReport() {

   // console.log('GetSummaryReport');
   // console.log('customer', this.customer_);
   // console.log('vmn', this.vmn_);
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

   // console.log(formattedDate); // Output: 07/07/2023





    if (formattedDate == '1970-01-01') {
      formattedDate = '0';
    }


  //  console.log('formattedDate', formattedDate);
    this.summary_m = new EndUserSummaryReportModal;
    this.summary_m.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    this.summary_m.vmn = this.vmn_.toString();
    this.summary_m.date = formattedDate.toString();
    const request_body = JSON.stringify(this.summary_m);
   // console.log('request_body', request_body);

    this.report_service.SummaryReport(request_body).subscribe((data: any) => {
    //  console.log('response', data);

      this.Total_count = data.Total_Count;
      this.single_part = data.single_part;
      this.multi_part = data.multi_part;
     // this.Failure_count = data.Failure_Count;

    });

  }
}
