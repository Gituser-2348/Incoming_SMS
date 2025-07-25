import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { FlowbuilderService } from "../flowbuilder.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatTableModule } from "@angular/material/table";
import { MatSort, Sort } from "@angular/material/sort";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MatPaginator } from '@angular/material/paginator';
import { ThemePalette } from "@angular/material/core";
import { ToastrService } from "ngx-toastr";
import { ManageAccServiceComponent } from "../../../core/manage-acc-service/manage-acc-service.component";
import { ManageAccServiceService } from "../../../core/manage-acc-service/manage-acc-service.service";
import { flowDetail } from "../models/flowmodel";
import { FLOWDETAILS } from "../models/mock.flowmodel";
import { HttpClient } from "@angular/common/http";
import { DatePipe, JsonPipe, LocationStrategy } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
import { ExcelDataCreateService } from './../shared/sevices/excel.service';
import { Subject } from "rxjs";
import * as CryptoJS from 'crypto-js';
import { SigninService } from "../../sign-in/sign-in.service";
@Component({
  providers: [DatePipe],
  selector: "app-flowlanding",
  templateUrl: "./flowlanding.component.html",
  styleUrls: ["./flowlanding.component.scss"],
})

export class FlowlandingComponent implements OnInit {
  @ViewChild("closebutton") closebutton;
  @ViewChild('sort') sort: MatSort;
  @ViewChild('sortActive') sortActive: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorActive') paginatorActive: MatPaginator;
  Report_flag: any;
  tempFlow: any = {
    name: "",
    type: "",
    channel: ""
  };
  showTempFlow: boolean = false;
  showImport: boolean = false;
  showTemplate: boolean = false;
  importFileName: any;
  flowImportFile: any;
  flowImportName: any;
  selectedElement: any
  searchInput: any;
  editId: any;
  editName: any;
  accInfo: any;
  accService: any;
  accountID: any;
  serviceID: any;
  color: ThemePalette = "primary";
  tableData: any;
  submitted: boolean = false;
  dataSource: any;
  activatedTableData: any;
  activatedFlowData: any;
  ngForm: FormGroup;
  flow: any[];
  ipAddress = "";
  displayStyle = "none";
  disableFlag = false;
  flag: number = 0;
  displayedColumns: string[] = [
    "Name",
    // "Channel",
    // "Type",
    "assignNumbers",
    "Last_modified_time",
    "Status",
    "Action",
    "Edit",
    "Open",
    "View",
    "Export"
  ];
  displayedColoumnforActivatedFlow: any = [
    "Name",
    "Activate",
    "Start"
  ]
  messageHeading: any = "Flow edit detected.";
  flowchanged = new Subject();
  flowActiveNumbers: any = {}
  disabledIndex: any = {};
  businessNumbers: any = {};
  duplicateName: boolean = false;
  activeNumbers: any = [];
  confirmBox: any = 'none';
  templates: any;
  selectedTemplate: any;
  oldVariable: any;
  constructor(
    private Location: LocationStrategy,
    private http: HttpClient,
    private manageservice: ManageAccServiceService,
    private toastr: ToastrService,
    private flowbuilder: FlowbuilderService,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private changeDetectRef: ChangeDetectorRef,
    private excelService: ExcelDataCreateService,
    private datePipe: DatePipe,
    private signInService: SigninService
  ) {

  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.flowchanged.subscribe(data => {
      if (data == true) {
        this.messageHeading = "Flow edit detected.";
        this.confirmBox = "block";
      } else if (data == "newFlow") {
        this.messageHeading = "New Flow"
        this.confirmBox = "block";
      } else {
        this.activateFlow(this.selectedElement)
      }
    })
    // console.log(this.tableData, 'tableData');
    this.getIPAddress();
    this.ngForm = this.formBuilder.group({
      Name: ["", Validators.required],
      Channel: ["", Validators.required],
      // Number:["",Validators.required],
      Type: ["", Validators.required],
      // API:["",Validators.required]
    });
    var selectAcc = this.manageservice.SelectedAccount;
    if (selectAcc) {
      this.accountID = selectAcc.Value;
      this.fetchFlowDetails();
      // console.log(this.accountID);
    }
    // var selectSer=this.manageservice.SelectedService;
    // if(selectSer){
    //   this.serviceID=selectSer.Value;
    //   console.log(this.serviceID);
    //   this.fetchFlowDetails();
    // }
    this.manageservice.accountChanged.subscribe((data) => {
      if (data) {
        this.accountID = data.Value;
        this.fetchFlowDetails();
      }
    });
    // this.manageservice.serviceChanged.subscribe((data) => {
    //   if (data) {
    //     this.accService = data.Value;
    //     this.fetchFlowDetails();
    //   }
    // });
  }
  isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  openPopup(name, id) {
    this.editName = name
    this.displayStyle = "block";
    this.editId = id
  }

  closePopup() {
    this.displayStyle = "none";
    this.editName = ''
  }

  closeConfirm() {
    this.confirmBox = 'none'
    this.flowchanged.next(false)
  }

  createConfig() {
    this.flowbuilder.newReport.next(this.selectedElement)
    this.router.navigate(["/report/configuration"]);
  }

  showTemp() {
    this.getTemplates()
    this.showTemplate = true;
  }

  closeTemp() {
    this.tempFlow = {
      name: "",
      type: "",
      channel: ""
    };
    this.showTempFlow = false;
    this.showTemplate = false;
    this.changeDetectRef.detectChanges()
    this.dataSource.paginator = this.paginator;
  }

  saveFlowName() {
    this.duplicateName = false;
    var flag = 0;
    this.flowbuilder.getDate(this.editId).subscribe((data: any) => {
      if (data == 1) {
        this.tableData.map((data: any) => {
          if (data.name == this.editName) {
            flag += 1;
          }
        })
        if (flag == 0) {
          if (!this.editName.replace(/\s/g, '').length) {
            this.toastr.error("string only contains whitespace", "Error");
          } else {
            this.saveName();
          }
        } else {
          // console.log(flag, 'flag');
          this.toastr.warning("Flow name already exists");
        }
      } else if (data == 0) {
        this.toastr.warning("Flow is being edited by another user");
      }
    })
  }

  saveName() {
    var newFlow: flowDetail = <flowDetail>{};
    newFlow.name = this.editName;
    newFlow.id = this.editId;
    newFlow.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    newFlow.user_ip = this.ipAddress;
    this.checkDuplicateName(newFlow.name)
    // console.log(this.duplicateName)
    if (this.duplicateName == false) {
      this.displayStyle = "none";
      this.flowbuilder.addFlow(newFlow).subscribe((data) => {
        // console.log(data, 'data');
        this.fetchFlowDetails();
      })
    } else {
      this.toastr.warning("Flow Name Already Exists")
    }
  }
  getIPAddress() {
    this.flowbuilder.checkIPaddress().subscribe((res: any) => {
      // console.log(res, "IP")
      this.ipAddress = res.ip;
    });
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      // filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSource.filter = this.searchInput.toLowerCase();
    } else if (filterValue == "") {
      this.dataSource.filter = filterValue;
    }
  }

  get f() {
    return this.ngForm.controls;
  }


  open(name, id) {
    this.flowbuilder.getDate(id).subscribe((data: any) => {
      if (data == 1) {
        this.openEdit(name, id);
      } else if (data == 0) {
        this.toastr.warning("Flow is being edited by another user");
      }
    })
  }

  openEdit(name, id) {
    this.flowbuilder.flowName.next(name);
    this.excelService.excelName.next(name);
    var accountInfo = {
      account_id: this.accountID,
      flow_id: id,
      user_id: this.signInService.decryptData(sessionStorage.getItem("UserID")),
    };
    this.getFlowDetails(accountInfo);
    this.flowbuilder.getDataForFlow({
      "acc_id": this.accountID,
      "flow_id": id
    });
    this.flowbuilder.callgetuserVariable({
      "acc_id": this.accountID,
      "flow_id": id
    });
  }

  view(name, id) {
    this.flowbuilder.flowName.next(`${name} [View Only]`);
    this.excelService.excelName.next(name);
    var accountInfo = {
      account_id: this.accountID,
      // service_id: this.serviceID.toString(),
      flow_id: id,
      user_id: this.signInService.decryptData(sessionStorage.getItem("UserID")),
    };
    this.viewFlowDetails(accountInfo);
    this.flowbuilder.getDataForFlow({
      "acc_id": this.accountID,
      "flow_id": id
    });
    this.flowbuilder.callgetuserVariable({
      "acc_id": this.accountID,
      "flow_id": id
    })
  }

  useTemp() {
    this.spinner.show();
    var newFlow: flowDetail = <flowDetail>{};
    var flowId;
    newFlow.name = this.tempFlow.name;
    newFlow.channel = this.tempFlow.channel;
    newFlow.flow_type = this.tempFlow.type;
    newFlow.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    newFlow.account_id = this.accountID.toString();
    // newFlow.service_id = this.serviceID.toString();
    newFlow.user_ip = this.ipAddress;
    // newFlow.id="";
    newFlow.status = '0';
    // this.checkDuplicateName(newFlow.name);
    if (newFlow.name.trim().length == 0) {
      this.toastr.warning("Name could not be empty", "Warning");
    } else if (this.duplicateName == true) {
      this.toastr.warning("Duplicate Name Not allowed", "Warning");
    }
    else {
      this.flowbuilder.addFlow(newFlow).subscribe((data) => {
        this.spinner.show();

        if (data["status"] == 1) {
          var flowId = data["flow_id"];
          // this.fetchFlowDetails();
          var accountInfo = {
            account_id: this.accountID,
            flow_id: flowId,
            user_id: this.signInService.decryptData(sessionStorage.getItem("UserID")),
          };
          this.flowbuilder.assignUserInfo(accountInfo)
          this.flowbuilder.flowName.next(newFlow.name);
          this.excelService.excelName.next(newFlow.name);
          this.flowbuilder.callgetuserVariable({
            "acc_id": this.accountID,
            "flow_id": flowId
          });
          this.flowbuilder.getDataForFlow({
            "acc_id": this.accountID,
            "flow_id": flowId
          });
          var saveObjet = {
            tempJSON: this.selectedTemplate,
            flag: 0
          }
          // this.flowbuilder.JSONData.next(saveObjet);
          this.flowbuilder.importAndTemplate(saveObjet)
          setTimeout(() => {
            this.openEdit(newFlow.name, flowId);
            this.flowbuilder.addVariable('', `-${this.oldVariable}`)
          }, 300);
          // this.flowbuilder.dataFromDB.next(this.selectedTemplate);
          // this.router.navigateByUrl("/flow/flow");
        } else {
          this.toastr.warning(data["message"], "Warning");
        }
      });
      // this.ngOnInit();
    }
    this.duplicateName = false;
  }
  getTemplates() {
    // console.log("getTemplates");
    var acc = {
      "acc_id": this.accountID
    }
    this.flowbuilder.getTemplates(acc).subscribe((data: any) => {
      // console.log(data,'temp');
      this.templates = data;
    })
  }

  viewTemplate(id, name) {
    // console.log(id)
    var accountInfo = {
      account_id: this.accountID,
      flow_id: id,
      user_id: sessionStorage.getItem("UserID"),
    };
    this.flowbuilder.assignUserInfo(accountInfo)
    this.templates.map(data => {
      if (data.id == id) {
        this.selectedTemplate = JSON.parse(data.data);
      }
    })
    this.flowbuilder.callgetuserVariable({
      "acc_id": this.accountID,
      "flow_id": id
    })
    this.flowbuilder.flowName.next(`${name} [View Only]`);
    this.excelService.excelName.next(name);
    this.flowbuilder.dataFromDB.next(this.selectedTemplate);
    this.router.navigateByUrl("/flow/flowpreview");
  }

  openTempFlow(id, name) {
    this.duplicateName = false;
    this.oldVariable = name.slice(-1)
    this.tempFlow = {
      name: "",
      type: "",
      channel: ""
    };
    this.templates.map(data => {
      if (data.id == id) {
        this.selectedTemplate = JSON.parse(data.data);
      }
    })
    this.showTempFlow = true;
  }
  closeTempFlow() {
    this.tempFlow = {
      name: "",
      type: "",
      channel: ""
    };
    this.showTempFlow = false;
  }
  save() {
    this.submitted = true;
    if (this.manageservice.SelectedAccount.Value == "-1") {
      this.toastr.warning("Please select a Account", "Warning");
      return;
    }
    // else if (!this.manageservice.SelectedService) {
    //   this.toastr.warning("Please select a Service", "Warning");
    //   return;
    // }
    else {
      // this.serviceID = this.manageservice.SelectedService.Value;
      var newFlow: flowDetail = <flowDetail>{};
      var flowId;
      newFlow.api = this.ngForm.value.API
      newFlow.number = this.ngForm.value.Number;
      newFlow.name = this.ngForm.value.Name;
      newFlow.channel = this.ngForm.value.Channel;
      newFlow.flow_type = this.ngForm.value.Type;
      newFlow.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
      newFlow.account_id = this.accountID.toString();
      // newFlow.service_id = this.serviceID.toString();
      newFlow.user_ip = this.ipAddress;
      // newFlow.id="";
      newFlow.status = '0';
      this.checkDuplicateName(newFlow.name);
      if (newFlow.name.trim().length == 0) {
        this.toastr.warning("Name could not be empty", "Warning");
      } else if (this.duplicateName == true) {
        this.toastr.warning("Duplicate Name Not allowed", "Warning");
      }
      else {
        this.flowbuilder.addFlow(newFlow).subscribe((data) => {
          // console.log(data, "flow added/Not");
          if (data["status"] == 1) {
            flowId = data["flow_id"];
            this.fetchFlowDetails();
            var accountInfo = {
              account_id: this.accountID,
              // service_id: this.serviceID.toString(),
              flow_id: flowId,
              user_id: this.signInService.decryptData(sessionStorage.getItem("UserID")),
            };
            // console.log(accountInfo, "accountInfo");
            this.flowbuilder.flowName.next(newFlow.name);
            this.excelService.excelName.next(name);
            this.getFlowDetails(accountInfo)
            this.flowbuilder.callgetuserVariable({
              "acc_id": this.accountID,
              "flow_id": flowId
            });
            this.flowbuilder.getDataForFlow({
              "acc_id": this.accountID,
              "flow_id": flowId
            });
          } else {
            this.toastr.warning(data["message"], "Warning");
          }
        });
        this.submitted = false;
        this.ngForm.reset();
        this.ngOnInit();
      }
    }
    this.duplicateName = false;
  }

  checkDuplicateName(name) {
    // console.log(name,'name',this.dataSource["filteredData"],"Data")
    var flag = 0;
    if (this.dataSource["filteredData"] != undefined && this.dataSource["filteredData"] != null) {
      this.dataSource["filteredData"].map((data: any) => {
        if (data["Name"].trim().toLowerCase() == name.trim().toLowerCase()) {
          // console.log(data,'data')
          this.duplicateName = true;
          flag += 1;
        }
      })
    } else {
      this.duplicateName = false;
    }
    if (flag == 0) {
      this.duplicateName = false;
    }
    // console.log(this.duplicateName,'dupli')
  }


  viewFlowDetails(accountInfo) {
    this.flowbuilder.fetchFlowFromDB(accountInfo).subscribe((data) => {
      // this.flowbuilder.dataFromDB.next(data);
      if (data != null) {
        this.flowbuilder.dataFromDB.next(data);
      } else {
        Swal.fire("null", "Flow Not Found", "error");
      }
    });
    // console.log(name);
    this.flowbuilder.callFlowBuilderPage.subscribe((data: any) => {
      // console.log(data, "Edit");
      this.router.navigateByUrl("/flow/flowpreview");
    });
  }

  getFlowDetails(accountInfo) {
    this.flowbuilder.fetchFlowFromDB(accountInfo).subscribe((data) => {
      // console.log(data);
      // this.flowbuilder.dataFromDB.next(data);
      if (data != null) {
        this.flowbuilder.dataFromDB.next(data);
      } else {
        Swal.fire("null", "Flow Not Found", "error");
      }
    });
    // console.log(name);
    this.flowbuilder.callFlowBuilderPage.subscribe((data: any) => {
      // console.log(data, "Edit");
      this.router.navigateByUrl("/flow/flow");
    });
  }

  fetchFlowDetails() {
    this.activeNumbers = []
    this.flowActiveNumbers = {};
    this.disabledIndex = {};
    this.disableFlag = false;
    this.spinner.show();
    var dataTo = {};
    // this.serviceID = this.manageservice.SelectedService.Value;
    this.flowbuilder.getFlowDetail(dataTo).subscribe((data: any) => {
      // console.log(data, "flowDetails");
      var flowData = [];
      var activatedFlowData = []

      if (data != null && data != undefined && data.length > 0) {
        var numbers = data[0]["business_num"];
        for (const object in numbers) {
          this.businessNumbers[numbers[object]["service_id"]] = numbers[object]["number"];
        }
        data.map((object: any) => {
          var tempArray = []
          if (object["Status"] == 1 || object["Status"] == 2) {
            activatedFlowData.push(object)
          }
          if (object["active_status"].length > 0) {
            for (let i = 0; i < object["active_status"].length; i++) {
              tempArray.push(object["active_status"][i]["service_id"])
            }
            // this.flowActiveNumbers.push(tempArray)
            this.flowActiveNumbers[object["id"]] = tempArray
            tempArray = []
          } else {
            // this.flowActiveNumbers.push([])
            this.flowActiveNumbers[object["id"]] = []
          }
        })
      }
      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          // if (data[i]["Status"] == 1) {
          // var activeNumbers = this.flowActiveNumbers[data[i]["id"]];
          var activeNumbers = data[0]["active_services"];
          for (let numIndex = 0; numIndex < activeNumbers.length; numIndex++) {
            // for(const object in this.flowActiveNumbers){
            //   if(object!= data[i]["id"]){
            //     if(this.flowActiveNumbers[object].indexOf(activeNumbers[numIndex])>-1){
            //       this.disabledIndex[object]=true
            //     }
            //   }
            // }
            if (this.activeNumbers.indexOf(activeNumbers[numIndex]) < 0) {
              this.activeNumbers.push(activeNumbers[numIndex])
            }
          }
          // }
        }
      }
      // console.log(this.activeNumbers, "activeNumbers");
      // console.log(this.businessNumbers, "businessNumbers");
      this.tableData = JSON.parse(JSON.stringify(data));
      this.dataSource = new MatTableDataSource(this.tableData);
      this.activatedTableData = JSON.parse(JSON.stringify(activatedFlowData));
      this.activatedFlowData = new MatTableDataSource(this.activatedTableData);
      // console.log(this.dataSource, "dataSource");
      this.changeDetectRef.detectChanges()

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return data.Name.toLowerCase().includes(filter);
      };
      this.activatedFlowData.paginator = this.paginatorActive;
      this.activatedFlowData.sort = this.sortActive;

      this.applyActiveSort()
      this.spinner.hide();
      this.applyFilter(this.searchInput)
    });

  }

  applyActiveSort() { //Activated flow sort to top of the list
    if (this.flag == 0&&this.tableData.length>0) {
      var element = document.getElementById("active");
      // console.log(element,'eeeee')
      element.click()
      element.click()
      this.flag += 1;
    }
    // console.log(this.dataSource.filteredData, "dataSource");
    // var dataDetail = this.dataSource.filteredData;
    // var firstTable: any = []
    // var secondTable: any = []
    // dataDetail.map((data: any) => {
    //   if (data.Status == 1) {
    //     firstTable.push(data);
    //   } else {
    //     secondTable.push(data);
    //   }
    // })
    // // console.log(,'finale');
    // this.dataSource = new MatTableDataSource(firstTable.concat(secondTable));
    // this.changeDetectRef.detectChanges();
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  returnBusinessNumbers(arr) {
    var message = "";
    if (arr != undefined) {
      for (let i = 0; i < arr.length; i++) {
        message += this.businessNumbers[arr[i]] + ","
      }
    }
    return message;
  }


  clickMethod(flowDetail) {
    this.flowbuilder.getDate(flowDetail.id).subscribe((data: any) => {
      if (data == 1) {
        this.deleteNow(flowDetail)
      } else if (data == 0) {
        this.toastr.warning("Flow is being edited by another user");
      }
    })
  }

  deleteNow(flow) {
    var accountInfo = {
      account_id: this.accountID,
      // service_id: this.serviceID.toString(),
      flow_id: flow.id.toString(),
      user_id: this.signInService.decryptData(sessionStorage.getItem("UserID")),
      ip: this.ipAddress
    };
    if (confirm("Are you sure to delete " + flow.Name)) {
      this.flowbuilder.deleteFlow(accountInfo).subscribe((data) => {
        if (data["status"] == 1) {
          this.toastr.success(data["message"], "Deleted");
          this.fetchFlowDetails();
        } else {
          this.toastr.warning(data["message"], "Warning");
          this.fetchFlowDetails();
        }
      })
    }
  }

  compareData(oldData: any, newData: any, element: any) {
    if (newData) {
      var newDataValue: any = [];
      var value = newData.drawflow.Home.data;
      var length = value[Object.keys(value)[Object.keys(value).length - 1]].id
      var answerArray: any = []
      for (let i = 1; i <= length; i++) {
        if (value[i] != undefined && value[i].class != "wpBotAsk") {
          newDataValue.push({ id: value[i].id })
        } else if (value[i] != undefined && value[i].properties.keyword != undefined && value[i].class == "wpBotAsk") {
          if (value[i].properties.answerOptions.section_1 != undefined) {
            var answerLength = Object.keys(value[i].properties.answerOptions.section_1.options).length
            for (let j = 1; j <= answerLength; j++) {
              answerArray.push({ option: value[i].properties.answerOptions.section_1.options[`output_${j}`].optionName })
            }
          }
          newDataValue.push({ id: value[i].id, name: value[i].properties.keyword, variable: value[i].properties.variable, answers: answerArray, question: value[i].properties.message })
          answerArray = []
        }
      }
      // console.log(newDataValue, 'newdata');

    }

    if (oldData) {
      var oldDataValue: any = [];
      var oldvalue: any = oldData.drawflow.Home.data;
      var oldlength = oldvalue[Object.keys(oldvalue)[Object.keys(oldvalue).length - 1]].id
      var answers: any = []
      for (let i = 1; i <= oldlength; i++) {
        if (oldvalue[i] != undefined && oldvalue[i].class != "wpBotAsk") {
          oldDataValue.push({ id: oldvalue[i].id })
        } else if (oldvalue[i] != undefined && oldvalue[i].properties.keyword != undefined && oldvalue[i].class == "wpBotAsk") {
          if (oldvalue[i].properties.answerOptions.section_1 != undefined) {
            var answerLength = Object.keys(oldvalue[i].properties.answerOptions.section_1.options).length
            for (let j = 1; j <= answerLength; j++) {
              answers.push({ option: oldvalue[i].properties.answerOptions.section_1.options[`output_${j}`].optionName })
            }
          }
          oldDataValue.push({ id: oldvalue[i].id, name: oldvalue[i].properties.keyword, variable: oldvalue[i].properties.variable, answers: answers, question: oldvalue[i].properties.message })
          answers = []
        }
      }
      // console.log(oldDataValue, 'olddata');
    } else {
      return this.flowchanged.next('newFlow');
    }

    var result = JSON.stringify(oldDataValue) == JSON.stringify(newDataValue)
    // console.log(result, 'res');
    if (result == true) {
      this.flowchanged.next(false);
    } else if (result == false) {
      this.flowchanged.next(true);
    }
  }

  updateActiveStatus(element) {
    this.flowbuilder.getDate(element.id).subscribe((data: any) => {
      if (data == 1) {
        var dataTo = {};
        this.flowbuilder.getFlowDetail(dataTo).subscribe((data: any) => {
          data.map(flow => {
            if (flow.id == element.id && element.Report_flag == 0) {
              // console.log('if');
              // console.log(timeDiff);
              this.selectedElement = element;
              // console.log(element);
              if (element.Status == 0) {
                var dataToDB = {
                  flow_id: element.id,
                  account_id: this.accountID
                }
                this.flowbuilder.dataCompare(dataToDB).subscribe((data: any) => {
                  var old_data = data[0].old_data;
                  var new_data = data[0].new_data;
                  this.compareData(old_data, new_data, element)
                })
              } else {
                // console.log('obne');
                this.activateFlow(element);
              }
            } else if (flow.id == element.id && element.Report_flag == 1) {
              // console.log('elseif');
              this.activateFlow(element);
            }
          })
        })
      } else if (data == 0) {
        this.fetchFlowDetails();
        this.toastr.warning("Flow is being edited by another user");
      }
    })

  }

  activateFlow(element) {
    // console.log(this.flowActiveNumbers[element.id], "test")
    let thisRef = this;
    var accountInfo = {
      account_id: this.accountID,
      service_id: [... new Set(this.flowActiveNumbers[element.id])],
      flow_id: element.id.toString(),
      user_id: this.signInService.decryptData(sessionStorage.getItem("UserID")),
      user_ip: this.ipAddress,
    };
    if (element.Status == 0) {
      if (this.flowActiveNumbers[element.id].length > 0) {
        this.spinner.show()
        this.flowbuilder.fetchFlowFromDB(accountInfo).subscribe((data: any) => {
          // console.log(data,"data");
          var connectionCheck = this.flowbuilder.checkInitialConnection(data)
          // console.log(connectionCheck,"connectionCheck");
          if (connectionCheck == true) {
            this.flowbuilder.activateFlow(accountInfo).subscribe((data) => {
              // console.log(data, "data");
              if (data["status"] == 1) {
                this.fetchFlowDetails()
                var dataToSocket = { href: location.origin, flowId: element.id }
                thisRef.toastr.success(data["message"], "Activated");
              } else {
                this.fetchFlowDetails()
                thisRef.toastr.warning(data["message"], "Warning");
              }
            })
          } else {
            this.fetchFlowDetails()
            this.toastr.warning("Flow Not Connected", "Warning");
          }
        })
      } else {
        this.toastr.warning("Please select atleast one Number", "Warning")
        this.fetchFlowDetails()
      }
    } else {
      this.spinner.show()
      this.flowbuilder.deActivateFlow(accountInfo).subscribe((data) => {
        // console.log(data, "Data")
        if (data["status"] == 1) {
          thisRef.toastr.warning(data["message"], "Deactivated");
          var dataToSocket = { href: location.origin, flowId: element.id }
          this.fetchFlowDetails()
        } else {
          thisRef.toastr.warning(data["message"], "Warning");
          this.fetchFlowDetails()
        }
      })
    }
  }

  export(element) {
    // console.log(element, "element");
    var accountInfo = {
      account_id: this.accountID,
      // service_id: this.serviceID.toString(),
      flow_id: element.id.toString(),
      user_id: this.signInService.decryptData(sessionStorage.getItem("UserID")),
    };
    this.flowbuilder.fetchFlowFromDB(accountInfo).subscribe((data: any) => {
      var fetchedData = {
        flow: data,
        flowId: element.id.toString()
      }
      // console.log(fetchedData)
      this.downloadJson(fetchedData, element.Name);
    })
  }

  downloadJson(myJson, name) {
    var sJson = JSON.stringify(myJson);
    var encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(sJson, 'secret key U2FsdGVkX1/UBATuvgtFgZe+GvYotI9mVthtqWjI+Kw=').toString());    // var element = document.createElement('a');
    // console.log(encryptInfo);
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(encryptInfo));
    element.setAttribute('download', `${name}_copy.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
  }

  fileChange(file) {
    this.importFileName = file.name;
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onloadend = function (x) {
      self.flowImportFile = fileReader.result;
    };
    fileReader.readAsText(file);
    setTimeout(() => {
      var deData = CryptoJS.AES.decrypt(decodeURIComponent(this.flowImportFile), 'secret key U2FsdGVkX1/UBATuvgtFgZe+GvYotI9mVthtqWjI+Kw=');
      var decryptedInfo = JSON.parse(deData.toString(CryptoJS.enc.Utf8));
      // console.log(decryptedInfo);
      this.flowImportFile = decryptedInfo
    }, 100);
  }

  showImp() {
    this.showImport = true;
  }

  importFlow() {
    this.spinner.show()
    if (this.manageservice.SelectedAccount.Value == "-1") {
      this.toastr.warning("Please select a Account", "Warning");
      return;
    } else {
      var newFlow: flowDetail = <flowDetail>{};
      var flowId;
      // newFlow.api = this.ngForm.value.API
      // newFlow.number = this.ngForm.value.Number;
      newFlow.name = this.flowImportName;
      newFlow.channel = "1";
      newFlow.flow_type = "1";
      newFlow.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
      newFlow.account_id = this.accountID.toString();
      // newFlow.service_id = this.serviceID.toString();
      newFlow.user_ip = this.ipAddress;
      // newFlow.id="";
      newFlow.status = '0';
      // console.log(newFlow, 'newFlow');
      this.checkDuplicateName(this.flowImportName);

      if (newFlow.name.trim().length == 0) {
        this.toastr.warning("Name could not be empty", "Warning");
        this.spinner.hide()

      } else if (this.duplicateName == true) {
        this.toastr.warning("Duplicate Name Not allowed", "Warning");
        this.spinner.hide()

      }
      else {
        this.flowbuilder.addFlow(newFlow).subscribe((data) => {
          // console.log(data, "flow added/Not");
          if (data["status"] == 1) {
            var flowId = data["flow_id"];
            var accountInfo = {
              account_id: this.accountID,
              flow_id: flowId,
              user_id: this.signInService.decryptData(sessionStorage.getItem("UserID")),
            };
            this.flowbuilder.assignUserInfo(accountInfo)
            this.flowbuilder.flowName.next(newFlow.name);
            this.excelService.excelName.next(newFlow.name);
            // this.flowbuilder.callgetuserVariable({
            //   "acc_id": this.accountID,
            //   "flow_id": flowId
            // })
            var saveObjet = {
              tempJSON: this.flowImportFile.flow,
              flag: 0
            }

            // this.flowbuilder.JSONData.next(saveObjet);
            this.flowbuilder.importAndTemplate(saveObjet)
            this.flowbuilder.addVariable("", this.flowImportFile.flowId)
            setTimeout(() => {
              this.openEdit(newFlow.name, flowId);
            }, 300);
            // this.flowbuilder.dataFromDB.next(this.flowImportFile);
            // this.router.navigateByUrl("/flow/flow");
          } else {
            this.toastr.warning(data["message"], "Warning");
          }
        });
      }
    }
  }

  startOrStop(flow) {
    // console.log(flow.Status,"flow");
    var activityFlag
    var accountInfo = {
      account_id: this.accountID,
      // service_id: this.serviceID.toString(),
      flow_id: flow.id.toString()
    };
    if (flow.Status == 1) {
      // console.log(this.activatedTableData)
    }
    if (flow.Status == 1) {
      activityFlag = 1;
      this.flowbuilder.startFLow(accountInfo, activityFlag).subscribe((data) => {
        if (data["status"] == 1) {
          this.fetchFlowDetails()
          this.toastr.success(data["message"], "Activated");
        } else {
          this.fetchFlowDetails()
          this.toastr.warning(data["message"], "Warning");
        }
      })

    } else {
      activityFlag = 0;
      this.flowbuilder.startFLow(accountInfo, activityFlag).subscribe((data) => {
        // console.log(data, "Data")
        if (data["status"] == 1) {
          this.toastr.success(data["message"], "Deactivated");
          this.disableFlag = false
          this.fetchFlowDetails()
        } else {
          this.toastr.warning(data["message"], "Warning");
          this.disableFlag = false
          this.fetchFlowDetails()
        }
      })
    }

  }
}
