import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ManageAccServiceService } from '../../../core/manage-acc-service/manage-acc-service.service';
import { FlowbuilderService } from '../../flow/flowbuilder.service';
import { SigninService } from '../../sign-in/sign-in.service';
import { fetchReportName } from '../report.modal';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  defaultHeader: any = [{ id: 1, name: 'Sl No', checked: '' }, { id: 2, name: 'WhatsApp Name', checked: '' }, { id: 3, name: 'WhatsApp Number', checked: '' }, { id: 4, name: 'Chat Origination Type ', checked: '' }, { id: 5, name: 'Chat Start Time ', checked: '' }]
  showKeywords:any=[];
  selectedKeyword: any = "Select Object";
  deleteBox: any = "none";
  deleteDetail: any = [];
  deletenow = new Subject();
  confirmBox: any = "none"
  headerName: any = ""
  reportNames: any = []
  accountID: any;
  report: any = 0;
  flowDetails: any = []
  answers: any = []
  showData: boolean = false;
  selectedHeading: any;
  selectedIndex: any;
  ReportName: any;
  keywordHeaders: any = [];
  webhookHeader:any=[];
  renameKeyword: any;
  selectedHeader: any = [];
  selectedType: any = 'detail'
  openWindow: boolean = false;
  flowId: any = 0;
  nameDuplicate:boolean=false;
  ipAddress: any;
  nodeId: any;
  nodeName: any;
  selectedName:any;
  newReportId: any;
  customHeader: any = [];
  selectedDetailHeader: any = [];
  popUpData: any = "";
  previousFlow: any = ""
  showHeader: boolean = false;
  type:any;
  constructor(
    private toastr: ToastrService,
    private flowbuilder: FlowbuilderService,
    private manageservice: ManageAccServiceService,
    private service: ReportService,
    private signInService:SigninService,
    public http: HttpClient
  ) { }

  ngOnInit(): void {
    this.deletenow.subscribe((value) => {
      if (this.deleteDetail[0].data == "default") {
        this.defaultHeader.map(data => {
          if (data.name == this.deleteDetail[0].name) {
            data.checked = false
          }
        })
        var headingTrue: any = [];
        this.defaultHeader.map(data => {
          if (data.checked == true) {
            headingTrue.push(data.id)
          }
        })

        var dataDb = {
          "user_id": this.signInService.decryptData(sessionStorage.getItem("UserID")),
          "acc_id": this.accountID,
          "flow_id": this.flowId,
          "report_id": this.report,
          "default_header_id": headingTrue
        }
        console.log(dataDb, 'datadb');
        this.service.saveDefaultHeader(dataDb).subscribe((res: any) => {
          this.toastr.warning("Header Removed");
          this.fetchDetailReport();
        })
      } else {
        var node_id = this.selectedHeader[this.deleteDetail[0].ind].nodeId;
        var datatoDb = {
          "acc_id": `${this.accountID}`,
          "report_id": this.report,
          "flow_id": this.flowId,
          "user_id": this.signInService.decryptData(sessionStorage.getItem("UserID")),
          "node_id": `${node_id}`
        }
        this.service.deleteCustomHeader(datatoDb).subscribe((res: any) => {
          this.toastr.warning("Header Removed");
          this.fetchDetailReport();
        })
      }
      this.openWindow = false;
      this.confirmBox = 'none';
    })
    if (this.flowbuilder.flowId) {
      this.flowId = this.flowbuilder.flowId;
      this.report = "New Report"
    }
    // this.flowbuilder.newReport.subscribe((data:any)=>{
    //   console.log(data,'config');
    //   this.flowId=data.id
    // })
    this.getIPAddress();
    var selectAcc = this.manageservice.SelectedAccount;
    if (selectAcc) {
      this.accountID = selectAcc.Value;
      this.fetchFlowDetails();
    }
    this.manageservice.accountChanged.subscribe((data) => {
      if (data) {
        this.accountID = data.Value;
        this.fetchFlowDetails();
      }
    });
  }

  deleteReport() {
    this.deleteBox = 'block';
  }

  deleteReportNow() {
    var data = {
      flow_id: this.flowId,
      report_id: this.report
    }
    this.flowbuilder.deleteReport(data).subscribe((res: any) => {
      this.toastr.warning(res.message);
      this.flowId = 0;
      this.report = "0";
      this.deleteBox = "none";
      this.openWindow=false;
    })
  }

  selectFlow(event) { //function call when flow is selected from dropdown
    this.defaultHeader = [{ id: 1, name: 'Sl No', checked: '' }, { id: 2, name: 'WhatsApp Name', checked: '' }, { id: 3, name: 'WhatsApp Number', checked: '' }, { id: 4, name: 'Chat Origination Type ', checked: '' }, { id: 5, name: 'Chat Start Time ', checked: '' }]
    this.showHeader = false;
    this.keywordHeaders = []
    this.openWindow = false;
    var data = {
      account_id: this.accountID,
      flow_id: event.target.value,
      user_id: this.signInService.decryptData(sessionStorage.getItem("UserID"))
    }
    this.flowId = event.target.value,
      this.flowbuilder.fetchFlowFromDB(data).subscribe(data => {      
        this.extractAnswers(data)
      })
    var reportName: fetchReportName = <fetchReportName>{};
    reportName.acc_id = this.accountID;
    reportName.flow_id = this.flowId;
    reportName.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    this.service.fetchReportName(reportName).subscribe((data) => {
      this.reportNames = data;
      this.reportNames.splice(0, 1);
      if (this.reportNames.length > 0) {
        this.report = this.reportNames[this.reportNames.length - 1].Value
        if (this.selectedType == 'detail' && this.report != "New Report") {
          this.showHeader = true;
          this.fetchDetailReport();
        } else if (this.selectedType == 'summary' && this.report != "New Report") {
          this.showHeader = true;
          this.fetchsummaryReport();
        }
      }
    })
  }

  selectReport(event) { //function call when report is selected from dropdown
    this.ReportName = '';
    this.openWindow=false;
    this.nameDuplicate=false;
    this.showHeader = true;
    this.report = event.target.value;
    if (this.selectedType == 'detail' && this.report != "New Report") {
      console.log(this.defaultHeader,'defaultHeader');
      var head=[];
      this.defaultHeader.map((data:any)=>{
        head.push({ id: data.id, name: data.name, checked: '' })
      })
      this.defaultHeader = head;
      this.fetchDetailReport();
    } else if (this.selectedType == 'summary' && this.report != "New Report") {
      this.fetchsummaryReport();
    }
  }

  saveName() { //for saving new report
    // console.log(this.reportNames);
    var flag: any = 0;
    this.reportNames.map(e => {
      if (e.Text.toLowerCase() == this.ReportName.toLowerCase()) {
        flag += 1;
      }
    });
    if (flag == 0) {
      if (!this.ReportName.replace(/\s/g, '').length) {
        this.toastr.error("string only contains whitespace", "Error");
      } else {
        this.selectedHeader = [];
        this.selectedDetailHeader = [];
        var data = {
          "acc_id": `${this.accountID}`,
          "flow_id": this.flowId,
          "user_id": this.signInService.decryptData(sessionStorage.getItem("UserID")),
          "name": this.ReportName,
          "ip": this.ipAddress
        }
        this.service.saveReportName(data).subscribe((res: any) => {
          this.newReportId = res.report_id
          if (res) {
            var reportName: fetchReportName = <fetchReportName>{};
            reportName.acc_id = this.accountID;
            reportName.flow_id = this.flowId;
            this.keywordHeaders=[]
            var data = {
              account_id: this.accountID,
              flow_id: this.flowId,
              user_id: this.signInService.decryptData(sessionStorage.getItem("UserID"))
            }
            this.flowbuilder.fetchFlowFromDB(data).subscribe(data => {      
              this.extractAnswers(data)
            })
            reportName.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
            this.service.fetchReportName(reportName).subscribe((data) => {
              this.reportNames = data;
              this.reportNames.splice(0, 1);
            })
            this.report = this.newReportId
            this.defaultHeader= [{ id: 1, name: 'Sl No', checked: '' }, { id: 2, name: 'WhatsApp Name', checked: '' }, { id: 3, name: 'WhatsApp Number', checked: '' }, { id: 4, name: 'Chat Origination Type ', checked: '' }, { id: 5, name: 'Chat Start Time ', checked: '' }]
            this.showHeader=true;
          }
        });
      }

    } else {
      this.toastr.warning ("Report Name Already Exists");
    }
  }



  saveDefaultHeader() { //for saving default headers
    var default_header: any = []
    for (let i = 0; i < this.defaultHeader.length; i++) {
      if (this.defaultHeader[i].checked == true) {
        default_header.push(this.defaultHeader[i].id)
      }
    }
    var data = {
      "user_id": this.signInService.decryptData(sessionStorage.getItem("UserID")),
      "acc_id": this.accountID,
      "flow_id": this.flowId,
      "report_id": this.report,
      "default_header_id": default_header
    }
    this.service.saveDefaultHeader(data).subscribe((res: any) => {
      this.toastr.success(res.message);
      this.fetchDetailReport();
    })
  }

  deleteNow() {
    this.deletenow.next('donee')
  }

  closeConfirm() {
    this.confirmBox = "none"
  }

  closeDeleteConfirm() {
    this.deleteBox = "none"
  }


  deleteHeader(data, ind, name) { //for deleting headers
    if (this.selectedType == 'detail') {
      this.headerName = name;
      this.confirmBox = "block";
      this.deleteDetail = [{ data: data, ind: ind, name: name }]
    } else {
    }

  }

  saveHeaders() { //for saving keyword header
    if (this.selectedType == 'detail') {
      if(this.type==1){
        var data = {
          "type":1,
          "user_id": this.signInService.decryptData(sessionStorage.getItem("UserID")),
          "acc_id": this.accountID,
          "flow_id": this.flowId,
          "report_id": this.report,
          "header_name": this.renameKeyword,
          "node_id": this.nodeId,
          "answer_options": this.answers,
          "field_name": this.renameKeyword
        }
        this.service.saveCustomHeader(data).subscribe((res: any) => {
          this.toastr.success(res.message);
          this.openWindow = false;
          this.showData = false;
          this.fetchDetailReport();
        })
      }else{
        var data1 = {
          "type":2,
          "user_id": this.signInService.decryptData(sessionStorage.getItem("UserID")),
          "acc_id": this.accountID,
          "flow_id": this.flowId,
          "report_id": this.report,
          "header_name": this.renameKeyword,
          "node_id": this.nodeId,
          "answer_options":[],
          "field_name": this.renameKeyword
        }
        this.service.saveCustomHeader(data1).subscribe((res: any) => {
          this.toastr.success(res.message);
          this.openWindow = false;
          this.showData = false;
          this.fetchDetailReport();
        })
      }
    } else {



    }
  }

  getIPAddress() { //for getting ip address
    this.flowbuilder.checkIPaddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  extractAnswers(data) { //for extracting answersOptions from flow
    var flag=0;
    var value = data.drawflow.Home.data;
    var length = value[Object.keys(value)[Object.keys(value).length - 1]].id
    var answerArray: any = [];
    this.webhookHeader=[];
    for (let i = 1; i <= length; i++) {
      if (value[i] != undefined && value[i].properties.keyword != undefined && value[i].class == "wpBotAsk") {
        if (value[i].properties.answerOptions.section_1 != undefined) {
          var answerLength = Object.keys(value[i].properties.answerOptions.section_1.options).length
          for (let j = 1; j <= answerLength; j++) {
            answerArray.push({ option: value[i].properties.answerOptions.section_1.options[`output_${j}`].optionName, rename: '' })
          }
        }
        this.keywordHeaders.push({type:1,id: value[i].id, name: value[i].properties.uniqueName, answers: answerArray, question: value[i].properties.message })
        answerArray = []
      }else if(value[i] != undefined &&value[i].class=="liveAgent"){
        flag+=1;
      }else if(value[i]!=undefined&&value[i].class=="webhook"){
        // console.log(value[i].properties.respParams,'i')
        var name=value[i].properties.uniqueName;
        value[i].properties.respParams.map((data:any)=>{
          this.webhookHeader.push({type:2,id:value[i].id,option:data.param,name:`${name}-${data.param}`})
        })
        
      }
    }
    // console.log(this.webhookHeader,'webhookHeader')
    if(flag>0){
      this.defaultHeader = [{ id: 1, name: 'Sl No', checked: '' }, { id: 2, name: 'WhatsApp Name', checked: '' }, { id: 3, name: 'WhatsApp Number', checked: '' }, { id: 4, name: 'Chat Origination Type ', checked: '' }, { id: 5, name: 'Chat Start Time ', checked: '' },{ id: 6, name: 'Agent Name', checked: '' },{ id: 7, name: 'Agent Connect Status', checked: '' },{ id: 8, name: 'Agent Connected Time', checked: '' },{ id: 9, name: 'Agent Chat End Time', checked: '' }];
    }else{
      this.defaultHeader = [{ id: 1, name: 'Sl No', checked: '' }, { id: 2, name: 'WhatsApp Name', checked: '' }, { id: 3, name: 'WhatsApp Number', checked: '' }, { id: 4, name: 'Chat Origination Type ', checked: '' }, { id: 5, name: 'Chat Start Time ', checked: '' }];
    }
  }

  fetchHeaders() { //for fetching headers
    if (this.selectedType == 'detail') {
      this.selectedDetailHeader.map((head:any)=>{
        this.keywordHeaders.map((key:any)=>{
          if(head.id == key.id){
            key.checked = true;
          }
        })
      })
      this.selectedHeader = this.selectedDetailHeader
      // console.log(this.showKeywords,'show');
    } else {
      this.selectedHeader = [];
    }
  }

  fetchFlowDetails() { //for fetching flow details
    var dataTo = {};
    this.flowbuilder.getFlowDetail(dataTo).subscribe((data) => {
      this.flowDetails = data;
    });
  }

  fetchsummaryReport() {
    this.fetchHeaders();
  }

  fetchDetailReport() { //for fetching detail report headings
    this.selectedDetailHeader = [];
    if (this.flowId > 0) {
      var data = {
        "acc_id": `${this.accountID}`,
        "flow_id": this.flowId,
        "report_id": this.report,
        "user_id": this.signInService.decryptData(sessionStorage.getItem("UserID")),
      }
      console.log(data,'datain')
      this.service.fetchDetailReport(data).subscribe((res: any) => {
        console.log(res,'res')
        if (res) {
          console.log(res,'res123')
          this.customHeader = res.custom_header;
          this.customHeader.map(data => {
            this.keywordHeaders.map(data1 => {
              if (data.node_id == data1.id) {
                // console.log(data,'data');
                // console.log(data1,'data1');
                for (let i = 0; i < data.answer_option.length; i++) {
                  data.answer_option[i].option = data1.answers[i].option;
                }
              }
            })
          })
          var selectDefaultHeader = res.default_header;
          // console.log(res.default_header,'res.default_header')
          if (selectDefaultHeader != null) {
            selectDefaultHeader.map(data => {
              this.defaultHeader.map(data1 => {
                if (data1.id == data) {
                  this.selectedDetailHeader.push({ name: data1.name, type: "default", id: data })
                  this.defaultHeader[data - 1].checked = true;
                }
              })
            });
          }
          this.customHeader.map(data => {
            console.log(data,'data12e3');
            var flag=0;
            this.keywordHeaders.map(data1 => {
              if (data1.id == data.node_id) {
                console.log(data1,'data1')
                flag=1;
                this.selectedDetailHeader.push({ name: data.field_name, type: data.type, answers: data.answer_option, nodeId: data.node_id, node_name: data1.name })
              }
            });
            // console.log(flag,'flag');
            if(flag==0){
              this.selectedDetailHeader.push({ name: data.field_name, type: data.type, answers: data.answer_option, nodeId: data.node_id, node_name: "Deleted Object" })
            }
          });
        }
      })
      this.fetchHeaders();
    }
  }

  duplicateName(event){
    // console.log(this.selectedName,'custom');
    var flag=0;
    this.customHeader.map((data:any)=>{
      if(data.field_name==event.target.value&&data.field_name!=this.selectedName){
        flag+=1;
      }
  })
  if(flag==0){
    this.nameDuplicate=false;
  }else{
    this.nameDuplicate=true;
  }
  // console.log(this.nameDuplicate,'nameDuplicate')
  }

  showDetails(ind) {

    this.selectedName="";
    this.nameDuplicate=false;
    this.answers = []
    this.openWindow = true;
    this.selectedIndex = ind
    this.showData = true;
    if (this.selectedType == 'detail') {
      // console.log(this.selectedHeader[ind]);
      this.selectedName=this.selectedHeader[ind].name
      this.selectedHeading = this.selectedHeader[ind]
      this.nodeName = this.selectedHeader[ind].node_name;
      this.nodeId = `${this.selectedHeader[ind].nodeId}`;
      // var index = this.keywordHeaders.findIndex((x => x.name === this.selectedHeader[ind].name))
      this.answers = this.selectedHeader[ind].answers;
      this.popUpData = this.selectedHeader[ind].question;
      this.keywordHeaders.map(data => {
        if (data.id == this.selectedHeader[ind].nodeId) {
          this.popUpData = data.question;
          // console.log(this.popUpData);

        }
      })
    } else {
      this.selectedName=this.selectedHeader[ind].name
      this.selectedHeading = this.selectedHeader[ind]
    }
    this.fetchDetailReport();

  }

  keywordChanged(event) { //function call when keyword is changed
    this.showKeywords.map((data:any)=>{
      if(data.id==event.target.value){
        this.type=data.type;
        this.renameKeyword=data.name;
        this.nodeId = data.id;
      }
    })
    console.log(event.target.value)
    if (this.selectedType == 'detail') {
      if(this.type==1){
        var index = this.keywordHeaders.findIndex((x => x.id == event.target.value))
        this.answers = this.keywordHeaders[index].answers;
        // console.log(this.answers);
        this.answers.map(data => {
          data.rename = data.option;
        })
        this.renameKeyword = this.keywordHeaders[index].name;
        this.nodeId = this.keywordHeaders[index].id;
        this.nodeName = this.keywordHeaders[index].name;
        this.popUpData = this.keywordHeaders[index].question;
        console.log(this.nodeId,'nodeid')
      }else{

        // this.renameKeyword=dataType.name
      }
      // console.log(JSON.parse(event.target.value))
    } else {
      var index = this.keywordHeaders.findIndex((x => x.id == event.target.value))
      this.answers = this.keywordHeaders[index].answers;
      // console.log(this.answers);
      this.answers.map(data => {
        data.rename = '';
      })
      this.renameKeyword = this.keywordHeaders[index].name;
      this.nodeId = this.keywordHeaders[index].id;
      this.nodeName = this.keywordHeaders[index].name;
      this.popUpData = this.keywordHeaders[index].question;

    }
  }

  addHeading() { //for adding new heading
    if (this.selectedType == "detail") {
      this.selectedDetailHeader.push({ name: this.renameKeyword, type: "keyword" })
    } else {
      var changeValue = []
      for (let i = 0; i < this.answers.length; i++) {
        changeValue.push(this.answers[i].changed)
      }
      this.service.selectedsummaryHeader.push({ name: this.renameKeyword, type: "keyword", answer: changeValue })
    }
    this.openWindow = false;
  }

  rename() { //for renaming keyword heading and adding it to selected header
    if (this.selectedType == 'detail') {
      if(this.selectedDetailHeader[this.selectedIndex].node_name=="Deleted Object"){
        this.toastr.warning('Deleted Object cannot be edited');
        return;
      }

      this.selectedDetailHeader[this.selectedIndex].name = this.selectedHeading.name;
      var data = {
        "user_id": this.signInService.decryptData(sessionStorage.getItem("UserID")),
        "acc_id": this.accountID,
        "flow_id": this.flowId,
        "report_id": this.report,
        "header_name": this.selectedHeading.name,
        "node_id": this.nodeId,
        "answer_options": this.answers,
        "field_name": this.selectedHeading.name,
        "type":"1"
      }
// console.log(data,'toDB')
      this.service.saveCustomHeader(data).subscribe((res: any) => {
        console.log(res,'res');
        if(res.status==1){
          this.toastr.success("Edited Successfully");
        }
        // this.toastr.success(res.message);
        this.openWindow = false;
        this.showData = false;
        this.fetchDetailReport();
      })
      this.openWindow = false;
      this.showData = false;

    } else {
    }

  }

  valueChange(header, index, event) { //mat-checkbox change event
    var element = document.getElementsByClassName("mat-checkbox-checkmark")
    for (let i = 0; i < element.length; i++) {
      element[i].classList.add("displayNone")
    }
    var element1 = document.getElementsByClassName("mat-checkbox-inner-container");
    element1[index].classList.add("innerBorder")
    if (this.defaultHeader[index].checked == true) {
      this.defaultHeader[index].checked = false;
      // var i = this.service.selectedDetailHeader.findIndex(x => x.name === header.name)
      // this.service.selectedDetailHeader.splice(i, 1)
    } else {
      this.defaultHeader[index].checked = true;
      // this.service.selectedDetailHeader.push({ name: header.name, type: "default" })
    }
  }

  drop(event: CdkDragDrop<string[]>) { //re-arrange selected headers
    moveItemInArray(this.selectedDetailHeader, event.previousIndex, event.currentIndex);
  }

  selectType(type) { //select type of header
    if (this.selectedType == type) {
    } else {
      if (type == "summary") {
        alert("Summary configuration is not available yet")
        return;
        window.location.reload();
        var element = document.getElementById(type)
        element.classList.add("select1Color");
        element.style.zIndex = "70"
        var sumRep = document.getElementById("sumRep")
        sumRep.style.color = "#252733"
        var detRep = document.getElementById("detRep")
        detRep.style.color = "#949494"
        var element1 = document.getElementById("detail")
        element1.classList.add("selectColor");
      }
      else {
        var element = document.getElementById('detail')
        element.classList.remove("selectColor");
        var element1 = document.getElementById("summary")
        element1.classList.remove("select1Color");
        element1.style.zIndex = "20"
        var sumRep = document.getElementById("sumRep")
        sumRep.style.color = "#949494"
        var detRep = document.getElementById("detRep")
        detRep.style.color = "#252733"
      }
    }
    this.report = 0;
    this.flowId = 0;
    this.openWindow = false;
    this.selectedType = type;
    this.ngOnDestroy()
  }

  openBox() {
    this.nameDuplicate=false;
    this.selectedName="";
    this.selectedKeyword="Select Object"
    this.showKeywords=[]
    // console.log(this.keywordHeaders,'key');
      // console.log(this.selectedDetailHeader,'selected');
      this.keywordHeaders.map(e => {
        var flag=0;
        this.selectedDetailHeader.map(e1 => {
          if (e.id == e1.nodeId) {
            flag+=1
          }
        }
        )
        if(flag==0){
          this.showKeywords.push(e)
        }

      })
      this.webhookHeader.map((variable:any)=>{
        var flag=0;
        console.log(variable,'var')
        this.selectedHeader.map((data:any)=>{
          console.log(data,'data')
          if(data.name==variable.name){
            flag+=1;
          }
        })
        if(flag==0){
          this.showKeywords.push(variable)
        }
      })
      // console.log(this.showKeywords,'show');

    this.showData = false;
    this.renameKeyword = ""
    this.selectedHeading = []
    this.answers = []
    this.openWindow = true;
  }

  ngOnDestroy() {
    this.flowbuilder.flowId = ''
    this.selectedDetailHeader = []
    this.selectedHeading = ''
    this.answers = [];
    this.defaultHeader = [{ id: 1, name: 'Sl No', checked: '' }, { id: 2, name: 'WhatsApp Name', checked: '' }, { id: 3, name: 'WhatsApp Number', checked: '' }, { id: 4, name: 'Chat Origination Type ', checked: '' }, { id: 5, name: 'Chat Start Time ', checked: '' },
      // { id: 6, name: 'Chat Status', checked: '' }
    ];
    this.customHeader = []
  }
}
