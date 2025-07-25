import { JsonPipe, LocationStrategy } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ManageAccServiceService } from '../../../core/manage-acc-service/manage-acc-service.service';
import { FlowbuilderService } from '../../flow/flowbuilder.service';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../report.service';
import * as moment from "moment";
import { SigninService } from '../../sign-in/sign-in.service';

@Component({
  selector: 'app-chatreport',
  templateUrl: './chatreport.component.html',
  styleUrls: ['./chatreport.component.scss']
})
export class ChatreportComponent implements OnInit {

  @ViewChild("closebutton") closebutton;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  accService: any;
  accountID: any;
  serviceID: any;
  tableData: any;
  dataSource: any;
  flow: any[];
  displayedColumns: string[] = [
    "cus_name",
    "Number",
    "Action"
  ];
  chatOpen: boolean = false;
  prevId: any = 0;
  dropdownData: any = [];
  selected: any;
  drawflowData: any = {}
  date: any;
  phoneNumber: any;
  maxDate : any = new Date();
  constructor(
    private Location: LocationStrategy,
    private manageservice: ManageAccServiceService,
    private toastr: ToastrService,
    private flowbuilder: FlowbuilderService,
    private spinner: NgxSpinnerService,
    private changeDetectRef: ChangeDetectorRef,
    private reportService :ReportService,
    private signInService :SigninService
  ) {
    this.reportService.hideChat.subscribe((data) => {
      this.chatOpen = false;
    })

    this.date = new Date()
    this.maxDate.setDate(this.maxDate.getDate())
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    var selectAcc = this.manageservice.SelectedAccount;
    if (selectAcc) {
      this.accountID = selectAcc.Value;
      this.fetchFlowDetails();
    }
    // var selectSer=this.manageservice.SelectedService;
    // if(selectSer){
    //   this.serviceID=selectSer.Value;
    //   this.fetchFlowDetails();
    // }
    this.manageservice.accountChanged.subscribe((data) => {
      this.dropdownData = [];
      this.chatOpen = false;
      this.tableData = [];
      this.accService = undefined;
      if (data) {
        this.accountID = data.Value;
        this.fetchFlowDetails();

      }
    });
    // this.manageservice.serviceChanged.subscribe((data) => {
    //   this.dropdownData = [];
    //   this.chatOpen = false;
    //   this.tableData = []
    //   if (data) {
    //     this.accService = data.Value;
    //     this.fetchFlowDetails();
    //   }
    // });

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  fetchFlowDetails() {
    this.spinner.show();
    var dataTo = {};
    // this.serviceID = this.manageservice.SelectedService.Value;
    this.flowbuilder.getFlowDetail(dataTo).subscribe((data) => {
      // console.log(data,"data")
      this.dropdownData = data;

      this.spinner.hide();
      this.selected = -1;
      // console.log(this.dropdownData,"dropdownData")
    });
  }

  maskCustomerNumber(number) {
    var countryCode = number.toString().substring(0, 2);
    var start = number.toString().substring(2, 4);
    var end = number.toString().substring(4, number.length);
    var maskedNumber = end.toString().replace(/\d(?=\d{4})/g, "*");
    return `+${countryCode} ${start}${maskedNumber}`;
  }

  openChat(flow) {

    if (flow.customer_num != this.prevId) {
      this.prevId = flow.customer_num;
      if (this.chatOpen != true) {
        // this.chatService.getMessageData(flow,this.selected)
        // console.log("flow");
        this.reportService.dynamicChat.next(true);
        // this.reportService.dynamicChatData.next(flow)
        this.reportService.clearData.next(true);
        this.getChatDetails(flow)
        this.chatOpen = true;

      } else {
        // console.log("flow");
        this.reportService.dynamicChat.next(true);
        this.reportService.clearData.next(true);
        this.getChatDetails(flow)
        // this.chatService.getMessageData(flow,this.selected)

      }
    } else if (flow.customer_num == this.prevId && this.chatOpen == false) {
      // this.chatService.getMessageData(flow,this.selected)
      this.chatOpen = true;
      // console.log("flow");
      this.reportService.dynamicChat.next(true);
      this.reportService.clearData.next(true);
      this.getChatDetails(flow)

    } else {
      this.chatOpen = false
      this.reportService.dynamicChat.next(false)
    }
  }

  getChatDetails(flow) {
    // console.log(flow);
    // {"flow_id":"","cus_num":""}
    var userData = {
      flow_id: this.selected.toString(),
      cus_num: flow.customer_num.toString(),
      date : moment(new Date(this.date)).format('MM/DD/YYYY')
    }
    // var userData = {
    //   "flow_id":"36",
    //     "cus_num":"919947741867"
    //   }
    // console.log(userData,"Chat Report")
    this.reportService.chatLoader.next(true);
    this.reportService.getUserChat(userData).subscribe((data) => {
      // console.log(data,"Chat Content")
      this.reportService.setDrawflowJSON.next(this.drawflowData)
      this.reportService.setChatMessages.next(data)
      this.reportService.setUserName.next(flow.cus_name)
    })

  }

  addToMatTable(data) {
    this.tableData = JSON.parse(JSON.stringify(data));
    this.dataSource = new MatTableDataSource(this.tableData);
    this.changeDetectRef.detectChanges()
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.spinner.hide()
  }

  callReport() {
    // console.log(this.selected);
    this.reportService.hideChat.next(true);

    var flowId = {
      flow_id: this.selected.toString()
    }
    var accountInfo = {
      account_id: this.accountID,
      // service_id: this.serviceID.toString(),
      flow_id: this.selected.toString(),
      user_id: this.signInService.decryptData(sessionStorage.getItem("UserID")),
    };
    var data = [
      { cus_name: '', customer_num: "" }
    ]
    this.addToMatTable(data)
    this.spinner.show()
    var reportData = {
      flow_id: this.selected.toString(),
      customer_num: this.phoneNumber,
      date: moment(new Date(this.date)).format('MM/DD/YYYY')
    }
    // reportData = this.selected.toString()
    this.reportService.getFlowUserDetails(reportData).subscribe((data) => {
      // console.log(data);
      if (data != null) {
        this.addToMatTable(data);
      }else{
        data = []
        this.addToMatTable(data)
        this.spinner.hide()
      }
    })
    this.flowbuilder.fetchFlowFromDB(accountInfo).subscribe((jsonData) => {
      this.drawflowData = jsonData;
    });

    // console.log(reportData,"Data")
  }
  checkingNumber(event) {
    try {
      var reg = /^[0-9]+$/;
      if (
        event.key.match(reg) ||
        event.keyCode == 8 ||
        event.keyCode == 37 ||
        event.keyCode == 38 ||
        event.keyCode == 39 ||
        event.keyCode == 40
      ) {
        return true;
      } else {
        event.preventDefault();
      }
    } catch (err) {
      // console.log(err,"event")
    }
  }

}
