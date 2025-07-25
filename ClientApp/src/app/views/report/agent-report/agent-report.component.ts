import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ManageAccServiceService } from '../../../core/manage-acc-service/manage-acc-service.service';
import { ExcelService } from '../../../core/services/excel-services';
///import { AccountsService } from '../../accounts/accounts.service';
import { SigninService } from '../../sign-in/sign-in.service';
import { DateRange, ReportFilter } from '../report.modal';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-agent-report',
  templateUrl: './agent-report.component.html',
  styleUrls: ['./agent-report.component.scss']
})

export class AgentReportComponent implements OnInit {
  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;
  public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  public defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  reportFilter: ReportFilter = <ReportFilter>{};
  columnDefs: ColDef[];
  dateRange: DateRange = <DateRange>{};
  selectedAgent: any = "";
  selectedMenu: string = "menuOne";
  noData: boolean = true;
  accountID: any;
  agentList: any = [];
  userRole: any;
  rowData: any = [];
  rowHeight: number = 18;
  headerHeight: number = 30;
  flag: number = 0;
  userEmail:any;
  selectedAgentName:any;
  constructor(private service: ReportService,
    //private accService: AccountsService,
    private manageservice: ManageAccServiceService,
    private signInService: SigninService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private excelservice: ExcelService) { }

  ngOnInit(): void {
    this.userRole = this.signInService.decryptData(sessionStorage.getItem("RoleID"));
    var selectAcc = this.manageservice.SelectedAccount;
    if (selectAcc) {
      this.accountID = selectAcc.Value;
      this.fetchAgents();
      console.log(this.accountID, 'acc')
      // this.selectMenu("menuOne");
    }
    this.manageservice.accountChanged.subscribe((data) => {
      if (data) {
        this.accountID = data.Value;
        this.fetchAgents();
        console.log(this.accountID, 'acc')
        // this.selectMenu("menuOne");
      }
    });
  }



  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) { //auto width column after data load
    params.api.sizeColumnsToFit();
  }

  fetchAgents() { //for fetching agent details
    this.agentList = [];
    var dataTo={"acc_id":this.accountID,
    "user_id":this.signInService.decryptData(sessionStorage.getItem("UserID")),
    "role_id":this.userRole
 }
//  console.log(dataTo,'toDb')
      this.service.fetchAllAgents(dataTo).subscribe((res:any)=>{
        // console.log(res,'res')
        if (res != undefined) {
         
              if (this.selectedMenu == "menuOne"&&this.userRole==1||this.selectedMenu == "menuOne"&&this.userRole==2||this.selectedMenu == "menuOne"&&this.userRole==3 || this.selectedMenu == "menuTwo"&&this.userRole==1||this.selectedMenu == "menuTwo"&&this.userRole==2||this.selectedMenu == "menuTwo"&&this.userRole==3) {
                this.agentList.push({ name: "All Agents", user_id: 0 })
              }else if(this.userRole==4){

              }
              res.map((data:any)=>{
                this.agentList.push(data)
              })
              // if (this.userRole < 4) {
              //   res.map((user: any) => {
              //     this.agentList.push(user)
              //   })
              // } else {
              //   res.map((data: any) => {
              //     // console.log(data,'data')
              //     if(data.user_id==this.signInService.decryptData(sessionStorage.getItem("UserID"))){
              //       this.userEmail=data.email;
              //     }
              //     if (data.reporting_to == this.signInService.decryptData(sessionStorage.getItem("UserID"))) {
              //       this.agentList.push(data)
              //     }
              //     if (data.user_id == this.signInService.decryptData(sessionStorage.getItem("UserID")) && data.chat_feature == 1 ||data.user_id == this.signInService.decryptData(sessionStorage.getItem("UserID"))&&this.userRole==4) {
              //       this.agentList.push(data)
              //     }
              //   })
              // }
              // if (this.agentList.length == 1 && this.selectedMenu == "menuOne" || this.agentList.length == 1 && this.selectedMenu == "menuTwo") {
              //   this.agentList = [];
              // }
              console.log('agentList1', this.agentList)
            }
      })
  }

  selectMenu(menu) { //call when change the menu's
    if (menu == this.selectedMenu) {
      return;
    }
    this.service.refreshDate.next('date')
    document.getElementById("menuOne").classList.add("unSelected");
    document.getElementById("menuTwo").classList.add("unSelected");
    document.getElementById("menuThree").classList.add("unSelected");
    document.getElementById("menuFour").classList.add("unSelected");
    if (menu == "menuOne") {
      this.rowData = [];
      this.selectedMenu = "menuOne";
      this.selectedAgent = "";
      this.selectedAgentName="";
      this.noData = true;
      document.getElementById("menuOne").classList.remove("unSelected");
      this.fetchAgents();
    } else if (menu == "menuTwo") {
      this.rowData = [];
      this.selectedAgent = "";
      this.selectedAgentName="";
      this.noData = true;
      this.selectedMenu = "menuTwo";
      this.fetchAgents();
      document.getElementById("menuTwo").classList.remove("unSelected");
    } else if (menu == "menuThree") {
      this.rowData = [];
      this.selectedAgent = "";
      this.selectedAgentName="";
      this.noData = true;
      this.selectedMenu = "menuThree"
      this.fetchAgents();
      document.getElementById("menuThree").classList.remove("unSelected");
    } else if (menu == "menuFour") {
      this.rowData = [];
      this.selectedAgent = "";
      this.selectedAgentName="";
      this.noData = true;
      this.selectedMenu = "menuFour"
      this.fetchAgents();
      document.getElementById("menuFour").classList.remove("unSelected");
    }
  }

  selectAgent(event) { //call when selecting agent from dropdown
    this.selectedAgent = event.target.value;
    this.agentList.map((agent: any) => {
      // console.log(this.selectedAgent,'1')
      if (agent.user_id == this.selectedAgent) {
        this.selectedAgentName = agent.name;
        console.log(this.selectedAgentName)
      }
    })
    if (this.selectedMenu == "menuOne") {
      // this.fetchLoginReport();
    } else if (this.selectedMenu == "menuTwo") {
      //  this.fetchBreak();
    }
  }

  fetchLoginReport() { //for fetching login report
    this.spinner.show();
    var data = {
      "acc_id": this.accountID,
      "user_id": this.selectedAgent,
      "from_date": this.reformatDateString(this.dateRange.FromDate),
      "to_date": this.reformatDateString(this.dateRange.ToDate)
    }
    if (new Date().toISOString().slice(0, 10) < this.reformatDateString(this.dateRange.ToDate) == true) {
      data.to_date = new Date().toISOString().slice(0, 10);
    }
    if (this.userRole == 5) {
      data.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    }
    console.log(data,'dataTo')
    this.service.fetchLoginReport(data).subscribe((data: any) => {
      console.log(data, 'fetchLoginReport');
      // console.log(typeof (data), 'type')
      if (data != undefined && data != null) {
        this.noData = false;
        if (this.selectedAgent == 0 && this.userRole != 5) {
          if (this.userRole > 3) {
            console.log('morethan');

            var dataTo = []
            data.map((rep:any)=>{
              if(rep!=null&&rep.reporting_to==this.signInService.decryptData(sessionStorage.getItem("UserID"))||rep!=null&&rep.email==this.userEmail){
                dataTo.push(rep);
              }
            })
            // this.agentList.map((agent: any) => {
            //   data.map((rep: any) => {
            //     if (agent.email == rep.email) {
            //       dataTo.push(rep);
            //     }
            //   })
            // });
            this.rowData = dataTo;
          } else {
            var dataTo = []
            data.map((rep: any) => {
              if (rep!=null&&rep.TotalWebLogin) {
                dataTo.push(rep)
              }
            })
            this.rowData = dataTo;
          }
        } else {
          if (data.TotalWebLogin) {
            this.rowData = [data];
          } else {
            this.noData = true;
            this.rowData = [];
            this.spinner.hide();
          }
        }
        if (this.userRole == 5) {
          this.columnDefs = [{ field: "from_to_date", headerName: "Date Range" }, { field: "email" }, { field: "avg_login_time", headerName: "Avarage Chat Login Time" }, { field: "TotalChatLogin", headerName: "Total Chat Login Time" }, { field: "TotalWebLogin", headerName: "Total Web Login Time" }]
        } else {
          // this.columnDefs = [{ field: "Date" }, { field: "email" }, { field: "avg_login_time", headerName: "Avg Login Time" }, { field: "TotalChatLogin", headerName: "Total Chat Login Time" }, { field: "TotalWebLogin", headerName: "Total Web Login Time" }]
          this.columnDefs = [{ field: "from_to_date", headerName: "Date Range" }, { field: "agent_name", headerName: "Agent Name" }, { field: "email" }, { field: "avg_login_time", headerName: "Avarage Chat Login Time" }, { field: "TotalChatLogin", headerName: "Total Chat Login Time" }, { field: "TotalWebLogin", headerName: "Total Web Login Time" }]
        }
        this.spinner.hide();
      } else {
        this.noData = true;
        this.rowData = [];
        this.spinner.hide();
      }
    })
  }

  reformatDateString(s) { //for changing the date format
    var b = s.split(/\D/);
    return b.reverse().join('-');
  }

  fetchBreak() { //for fetching break report
    this.spinner.show();
    var data = {
      "acc_id": this.accountID,
      "user_id": this.selectedAgent,
      "from_date": this.reformatDateString(this.dateRange.FromDate),
      "to_date": this.reformatDateString(this.dateRange.ToDate)
    }
    // console.log(new Date().toISOString().slice(0, 10)<this.reformatDateString(this.dateRange.ToDate));
    if (new Date().toISOString().slice(0, 10) < this.reformatDateString(this.dateRange.ToDate) == true) {
      data.to_date = new Date().toISOString().slice(0, 10);
    }
    // console.log(this.reformatDateString(this.dateRange.FromDate), 'from', this.reformatDateString(this.dateRange.ToDate), 'to')
    if (this.userRole == 5) {
      data.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    }
    console.log(data, 'toDb')
    this.service.fetchBreak(data).subscribe((data: any) => {
      console.log(data,'fromDB');
      if (data != undefined && data != null) {
        this.noData = false;
        if (this.selectedAgent == 0 && this.userRole != 5) {
          if (this.userRole > 3) {
            var dataTo = []
            data.map((rep:any)=>{
              if(rep!=null&&rep.reporting_to==this.signInService.decryptData(sessionStorage.getItem("UserID"))||rep!=null&&rep.email==this.userEmail){
                dataTo.push(rep);
              }
            })
            // this.agentList.map((agent: any) => {
            //   data.map((rep: any) => {
            //     console.log('entered')
            //     if (agent.email == rep.email) {
            //       dataTo.push(rep);
            //     }
            //   })
            // });
            this.rowData = dataTo;
          } else {
            var dataFront = [];
            data.map((data: any) => {
              if (data!=null&&data.break_count > 0) {
                dataFront.push(data);
              }
            })
            this.rowData = dataFront;
          }
        } else {
          if (data.break_count > 0) {
            this.rowData = [data];
          } else {
            this.noData = true;
            this.rowData = [];
            this.spinner.hide();
          }
        }
        if (this.userRole == 5) {
          this.columnDefs = [{ field: "from_to_date", headerName: "Date Range" }, { field: "email" }, { field: "break_count", headerName: "Break Count" }, { field: "avg_break_time", headerName: "Avg Break Time" }, { field: "total_break_time", headerName: "Total Break Time" }]
        } else {
          // this.columnDefs = [{ field: "Date" }, { field: "email" }, { field: "break_count", headerName: "Break Count" }, { field: "avg_break_time", headerName: "Avg Break Time" }, { field: "total_break_time", headerName: "  Total Break time" }]
          this.columnDefs = [{ field: "from_to_date", headerName: "Date Range" }, { field: "agent_name", headerName: "Agent Name" }, { field: "email" }, { field: "break_count", headerName: "Break Count" }, { field: "avg_break_time", headerName: "Avg Break Time" }, { field: "total_break_time", headerName: "Total Break Time" }]
        }
        this.spinner.hide();
      } else {
        this.noData = true;
        this.rowData = [];
        this.spinner.hide();
      }
    })
  }

  fetchChatReport() { //for fetching chat report
    this.spinner.show();
    var data = {
      "acc_id": this.accountID,
      "user_id": this.selectedAgent,
      "from_date": this.reformatDateString(this.dateRange.FromDate),
      "to_date": this.reformatDateString(this.dateRange.ToDate)
    }
    if (new Date().toISOString().slice(0, 10) < this.reformatDateString(this.dateRange.ToDate) == true) {
      data.to_date = new Date().toISOString().slice(0, 10);
    }
    if (this.userRole == 5) {
      data.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    }
    this.service.fetchChatReport(data).subscribe((data: any) => {
      console.log(data);
      if (data != undefined && data != null) {
        this.noData = false;
        this.rowData = data;
        if (this.userRole == 5) {
          this.columnDefs = [{ field: "date" }, { field: "SubscriberWhatsAppName", headerName: "Subscriber WhatsApp Name" }, { field: "start", headerName: "Chat Start Time" }, { field: "end", headerName: "Chat End time" }]
        } else {
          this.columnDefs = [{ field: "date" }, { field: "agentname", headerName: "Agent Name" }, { field: "SubscriberWhatsAppName", headerName: "Subscriber WhatsApp Name" }, { field: "start", headerName: "Chat Start Time" }, { field: "end", headerName: "Chat End time" }]
        }
        this.spinner.hide();
      } else {
        this.noData = true;
        this.rowData = [];
        this.spinner.hide();
      }
    })
  }

  fetchPerformance() { //for fetching performance report
    this.spinner.hide();
    var data = {
      "acc_id": this.accountID,
      "user_id": this.selectedAgent,
      "from_date": this.reformatDateString(this.dateRange.FromDate),
      "to_date": this.reformatDateString(this.dateRange.ToDate)
    }
    if (new Date().toISOString().slice(0, 10) < this.reformatDateString(this.dateRange.ToDate) == true) {
      data.to_date = new Date().toISOString().slice(0, 10);
    }
    if (this.userRole == 5) {
      data.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    }
    this.service.fetchPerformance(data).subscribe((res: any) => {
      console.log(res, 'res');
      if (res != undefined && res != null) {
        this.noData = false;
        this.rowData = res;
        if (this.userRole == 5) {
          this.columnDefs = [{ field: "date" }, { field: "email", headerName: "Agent Email-ID" }, { field: "TotalChatSessionTime", headerName: "Chat Time" }, { field: "totalChatRequest", headerName: "Total Chat Requests" }, { field: "totalChatAnswer", headerName: "Total Chat Answered" }, { field: "TotalChatLogin", headerName: "Total Chat Login Time" }]
        } else {
          // this.columnDefs = [{ field: "date" }, { field: "name", headerName: "Agent Name" }, { field: "email", headerName: "Agent Email-ID" }, { field: "totalChatTime", headerName: "Chat Time" }, { field: "totalChatRequest", headerName: "Total Chat Requests" }, { field: "totalChatAnswer", headerName: "Total Chat Answered" }, { field: "TotalChatLogin", headerName: "Total Login Time" }]
          this.columnDefs = [{ field: "date" }, { field: "agent_name", headerName: "Agent Name" }, { field: "email", headerName: "Agent Email-ID" }, { field: "TotalChatSessionTime", headerName: "Chat Time" }, { field: "totalChatRequest", headerName: "Total Chat Requests" }, { field: "totalChatAnswer", headerName: "Total Chat Answered" }, { field: "TotalChatLogin", headerName: "Total Chat Login Time" }]
        }
        this.spinner.hide();
      } else {
        this.noData = true;
        this.rowData = [];
        this.spinner.hide();
      }
    })
  }

  getReport() { //call when click on search button
    var reportFilterData = { ... this.reportFilter };
    reportFilterData.toNumber = reportFilterData.toNumber ? reportFilterData.toNumber : "";
    if (this.manageservice.SelectedAccount.Value == "-1") {
      this.toastr.warning("Please select an account", "Warning");
      return;
    } else if (!this.dateRange.FromDate) {
      this.toastr.warning("Please select a Date Range", "Warning");
      return;
    } else if (!this.selectedAgent&&this.userRole!="5") {
      this.toastr.warning("Please select an agent", "Warning");
      return;
    } else if (reportFilterData.toNumber != "") {
      if (reportFilterData.toNumber.length != 12) {
        return;
      }
    }
    if (new Date().toISOString().slice(0, 10) < this.reformatDateString(this.dateRange.FromDate) == true) {
      return this.toastr.warning("Select valid date","Warning")
    }
    if (this.selectedMenu == "menuOne") {
      this.fetchLoginReport();
    } else if (this.selectedMenu == "menuTwo") {
      this.fetchBreak();
    } else if (this.selectedMenu == "menuThree") {
      this.fetchChatReport();
    } else if (this.selectedMenu == "menuFour") {
      this.fetchPerformance();
    }
  }

  dataToDownload() { //for change the report format and download it
    var jsonDataDownload = []
    return new Promise((resolve) => {
      if (this.selectedMenu == 'menuOne') {
        var data = {
          "acc_id": this.accountID,
          "user_id": this.selectedAgent,
          "from_date": this.reformatDateString(this.dateRange.FromDate),
          "to_date": this.reformatDateString(this.dateRange.ToDate)
        }
        if (new Date().toISOString().slice(0, 10) < this.reformatDateString(this.dateRange.ToDate) == true) {
          data.to_date = new Date().toISOString().slice(0, 10);
        }
        if (this.userRole == 5) {
          data.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
        }
        this.service.fetchLoginReport(data).subscribe((data: any) => {
          var dataTo = []
          if (data != undefined) {
            if (this.selectedAgent == 0&&this.userRole!="5") {
              data.map((res: any) => {
                if(this.userRole<=3&&res!=null&&res["TotalWebLogin"]){
                  var info = {
                    "Date Range": res["from_to_date"],
                    "Agent Name": res["agent_name"],
                    "Email": res["email"],
                    "Avarage Chat Login Time": res["avg_login_time"],
                    "Total Chat Login Time": res["TotalChatLogin"],
                    "Total Web Login Time": res["TotalWebLogin"]
                  };
                  dataTo.push(info);
                }else if(res!=null&&res["TotalWebLogin"]&&res["reporting_to"]==this.signInService.decryptData(sessionStorage.getItem("UserID"))||res!=null&&res.email==this.userEmail){
                  var info = {
                    "Date Range": res["from_to_date"],
                    "Agent Name": res["agent_name"],
                    "Email": res["email"],
                    "Avarage Chat Login Time": res["avg_login_time"],
                    "Total Chat Login Time": res["TotalChatLogin"],
                    "Total Web Login Time": res["TotalWebLogin"]
                  };
                  dataTo.push(info);
                }
              });
              // console.log(data,'dataTo')
              resolve(dataTo);
            } else {
             if(data["TotalWebLogin"]){
              dataTo = [{
                "Date Range": data["from_to_date"],
                "Agent Name": data["agent_name"],
                "Email": data["email"],
                "Avarage Login Time": data["avg_login_time"],
                "Total Chat Login Time": data["TotalChatLogin"],
                "Total Web Login Time": data["TotalWebLogin"]
              }];
              resolve(dataTo);
             }else{
              resolve(dataTo);
             }
            }
          } else {
            resolve([])
          }
        })
      } else if (this.selectedMenu == 'menuTwo') {
        var data = {
          "acc_id": this.accountID,
          "user_id": this.selectedAgent,
          "from_date": this.reformatDateString(this.dateRange.FromDate),
          "to_date": this.reformatDateString(this.dateRange.ToDate)
        }
        if (new Date().toISOString().slice(0, 10) < this.reformatDateString(this.dateRange.ToDate) == true) {
          data.to_date = new Date().toISOString().slice(0, 10);
        }
        if (this.userRole == 5) {
          data.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
        }
        this.service.fetchBreak(data).subscribe((data: any) => {
          var dataTo = []
          if (data != undefined) {
            if (this.selectedAgent == 0&&this.userRole!="5") {
              data.map((rep: any) => {
                if(this.userRole<=3&&rep!=null&&rep["break_count"]>0){
                  var info = {
                    "Date Range": rep["from_to_date"],
                    "Agent Name": rep["agent_name"],
                    "Email": rep["email"],
                    "Break Count": rep["break_count"],
                    "Avg Break Time": rep["avg_break_time"],
                    "Total Break Time": rep["total_break_time"]
                  };
                  dataTo.push(info);
                }else if(rep!=null&&rep["break_count"]>0&&rep["reporting_to"]==this.signInService.decryptData(sessionStorage.getItem("UserID"))||rep!=null&&rep.email==this.userEmail){
                  var info = {
                    "Date Range": rep["from_to_date"],
                    "Agent Name": rep["agent_name"],
                    "Email": rep["email"],
                    "Break Count": rep["break_count"],
                    "Avg Break Time": rep["avg_break_time"],
                    "Total Break Time": rep["total_break_time"]
                  };
                  dataTo.push(info);
                }
              });
              resolve(dataTo);
            } else {
              if(data["break_count"]>0){
                dataTo = [{
                  "Date Range": data["from_to_date"],
                  "Agent Name": data["agent_name"],
                  "Email": data["email"],
                  "Break Count": data["break_count"],
                  "Avg Break Time": data["avg_break_time"],
                  "Total Break Time": data["total_break_time"]
                }];
                resolve(dataTo);
              }else{
                resolve(dataTo);
              }
            }
          } else {
            resolve([])
          }
        })
      } else if (this.selectedMenu == 'menuThree') {
        var data = {
          "acc_id": this.accountID,
          "user_id": this.selectedAgent,
          "from_date": this.reformatDateString(this.dateRange.FromDate),
          "to_date": this.reformatDateString(this.dateRange.ToDate)
        }
        if (new Date().toISOString().slice(0, 10) < this.reformatDateString(this.dateRange.ToDate) == true) {
          data.to_date = new Date().toISOString().slice(0, 10);
        }
        if (this.userRole == 5) {
          data.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
        }
        this.service.fetchChatReport(data).subscribe((data: any) => {
          var dataTo = [];
          if (data != undefined) {
            data.map((report: any) => {
              dataTo.push({
                "Date": report["date"],
                "Agent Name": report["agentname"],
                "Subscriber WhatsApp Name": report["SubscriberWhatsAppName"],
                "Chat Start Time": report["start"],
                "Chat End Time": report["end"]
              })
            })
          }
          resolve(dataTo);
        })
      } else if (this.selectedMenu == 'menuFour') {
        var data = {
          "acc_id": this.accountID,
          "user_id": this.selectedAgent,
          "from_date": this.reformatDateString(this.dateRange.FromDate),
          "to_date": this.reformatDateString(this.dateRange.ToDate)
        }
        if (new Date().toISOString().slice(0, 10) < this.reformatDateString(this.dateRange.ToDate) == true) {
          data.to_date = new Date().toISOString().slice(0, 10);
        }
        if (this.userRole == 5) {
          data.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
        }
        this.service.fetchPerformance(data).subscribe((res: any) => {
          var dataTo = [];
          if (res != undefined) {
            res.map((report: any) => {
              dataTo.push({
                "Date": report["date"],
                "Agent Name": report["agent_name"],
                "Agent Email-ID": report["email"],
                "Chat Time": report["TotalChatSessionTime"],
                "Total Chat Requests": report["totalChatRequest"],
                "Total Chat Answered": report["totalChatAnswer"],
                "Total Chat Login Time": report["TotalChatLogin"]
              })
            })
          }
          resolve(dataTo);
        })
      }
    })
  }

  downloadReport() { //for download the reports
    var reportFilterData = { ... this.reportFilter };
    reportFilterData.toNumber = reportFilterData.toNumber ? reportFilterData.toNumber : "";
    if (this.manageservice.SelectedAccount.Value == "-1") {
      this.toastr.warning("Please select an account", "Warning");
      return;
    } else if (!this.dateRange.FromDate) {
      this.toastr.warning("Please select a Date Range", "Warning");
      return;
    } else if (!this.selectedAgent&&this.userRole!="5") {
      this.toastr.warning("Please select an agent", "Warning");
      return;
    } else if (reportFilterData.toNumber != "") {
      if (reportFilterData.toNumber.length != 12) {
        return;
      }
    }
    if (new Date().toISOString().slice(0, 10) < this.reformatDateString(this.dateRange.FromDate) == true) {
      return this.toastr.warning("Select valid date","Warning")
    }
    this.spinner.show();
    var fileName = ''
    
    this.dataToDownload().then((result: any) => {
      console.log(result, 'res')
      if (result == undefined || result == null || result.length == 0) {
        this.toastr.warning("No data to download");
        this.spinner.hide();
        return;
      }
      if(this.selectedAgentName!=undefined){
        if (this.selectedMenu == 'menuOne') {
          fileName = this.selectedAgentName + ' LoginReport' + this.dateRange.FromDate + '_to_' + this.dateRange.ToDate;
        } else if (this.selectedMenu == 'menuTwo') {
          fileName = this.selectedAgentName + ' BreakReport' + this.dateRange.FromDate + '_to_' + this.dateRange.ToDate;
        } else if (this.selectedMenu == 'menuThree') {
          fileName = this.selectedAgentName + ' ChatReport' + this.dateRange.FromDate + '_to_' + this.dateRange.ToDate;
        } else if (this.selectedMenu == 'menuFour') {
          fileName = this.selectedAgentName + ' PerfomanceReport' + this.dateRange.FromDate + '_to_' + this.dateRange.ToDate;
        }
      }else{
        if (this.selectedMenu == 'menuOne') {
          fileName = ' LoginReport' + this.dateRange.FromDate + '_to_' + this.dateRange.ToDate;
        } else if (this.selectedMenu == 'menuTwo') {
          fileName = ' BreakReport' + this.dateRange.FromDate + '_to_' + this.dateRange.ToDate;
        } else if (this.selectedMenu == 'menuThree') {
          fileName = ' ChatReport' + this.dateRange.FromDate + '_to_' + this.dateRange.ToDate;
        } else if (this.selectedMenu == 'menuFour') {
          fileName = ' PerfomanceReport' + this.dateRange.FromDate + '_to_' + this.dateRange.ToDate;
        }
      }
      this.excelservice.exportAsExcelFile(result, fileName);
      this.spinner.hide();
    })
  }
}
