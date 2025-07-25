import { Component,ViewChild,ElementRef } from "@angular/core";
import { NgForm } from "@angular/forms";
import { FlowbuilderService } from "../../../flowbuilder.service";
import { PropertyBindingService } from "../../propertyBinding.service";
import { webhook } from "../../../models/whatsappmodel";
import { KeyValue } from "@angular/common";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "webhook-component",
  templateUrl: "./webhook.component.html",
  styleUrls: ["./webhook.component.css"],
})
export class WebhookComponent {
  @ViewChild('initialCurser') initialCurser:ElementRef  //! getting elementRefernce for initial curser position
               //! onCompare used to iterate ObjectofObject in Anugular which return key:value pair in th object
  private onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>) {
    return -1;
  }

  helpBtn:any=true
  // elementObj:any = {};
  outputNode:any=[];                   //! for storing outputnode id(name)
  selectedNode:any=[[]]                 //! for selecting output node connction
  successNode: any          //! for selecting output node connction
  failureNode: any          //! for selecting output node connction
  icon = "{X}"              //! variable component icon (used to popUp variable list)
  webhook: webhook = <webhook>{ //! initialising WebhookModel
    id: 0,
    uniqueName: "",
    message: "",
    url: "",
    contentType: "1",
    method: "2",
    retryCount: "1",
    timeOut: "60",
    headerItems: [{ param: "", variable: "" }],
    reqItems: [{ param: "", variable: "" }],
    respItems: [{ param: "", variable: "" }],
    answerOptions: ["Success", "Failed"],
  };
  inputNodeId: any              //! id for the nextObject
  nodeId: any;                  //! id of currentObject
  answerOptions: any = [];      //! storing answerOptions for the webhook Component
  // addConnectionToggle = false;
  answerArrayLength: any = 0;    //! storing length of answerOptions
  // uniqueObject: any = {};
  // uniqueObjectLength;
  connections = {};               //! storing connections
  formValidity = true;            //! check whether all fields are valid / not
  textLength: boolean = false;    //! flag to check the message field having value/ not
  style = "block";                          //! for choosing the variable component to be show/hide (popUp)
  index: any;                               //! used to store the variable index in array
  selectedControlType: string = "";
  type:any;                                 //! for setting variable name passed to variable Component
  apiResp:any;
  submittedFlag :boolean = false;
  disabledForView: boolean = false;
  uniqueNameArray: any = [];
  duplicateUniquecheckFlag: boolean = false;
  constructor(
    private service: FlowbuilderService,
    private PropertyService: PropertyBindingService,
    private toastr: ToastrService
  ) {
    this.PropertyService.fetchDataSubscription.subscribe((val) => {    //! rebinding data of component to the propertyWindow if already saved
      var data = JSON.parse(JSON.stringify(val));
      if (data != undefined) {
        try {
          // this.selectedNode=data.nodeDetails;
          this.successNode=data.successNode;
          this.failureNode=data.failureNode;
          this.webhook.contentType = data.type;
          this.webhook.url=data.url;
          this.webhook.method=data.method;
          this.webhook.headerItems=data.headers;
          this.webhook.reqItems=data.reqParams;
          this.webhook.respItems=data.respParams;
          this.webhook.uniqueName=data.uniqueName;
          this.webhook.message=data.message;
          this.webhook.retryCount=data.retryCount;
          this.webhook.timeOut=data.timeOut;
          this.submittedFlag = data.submittedFlag
          for(let i=0; i<data.nodeDetails.length; i++){
            this.selectedNode[0].push(data.nodeDetails[i])
          }
        } catch (err) { }
      } else {
      }
    });
    this.PropertyService.dynamicIdWebhook.subscribe((id) => {   //! getting nodeId from service
      this.nodeId = id;
    });
    this.service.passUniqueName.subscribe((data :any)=>{
      this.webhook.uniqueName = data.uniqueName
      this.nodeId = data.id
    })
    this.PropertyService.disableSubmit.subscribe((data) => {
      this.disabledForView = true;
    });
  }

  ngOnInit() {
    this.service.showHelpWindow.subscribe((data:any)=>{
      if(data=="none"){
        this.helpBtn=true;
      }
    })
    // this.uniqueObject = this.PropertyService.fetchUniqueJSON(this.nodeId);
    if(this.webhook.uniqueName=="")
    this.webhook.uniqueName = this.service.generateUniqueName("webhook"); //!generating different uniqueNames for objects on initialisation
    // this.uniqueObjectLength = Object.keys(this.uniqueObject).length;
    this.uniqueNameArray = this.PropertyService.getUniqueName(this.nodeId);
  }


  ngAfterViewInit(){
    this.initialCurser.nativeElement.focus()     //! Assigning curser position to uniqueName input field
  }

input(i,name){       //! used to pass the variable property to variable popUp component
  this.index = i;
  this.type = name;
  this.style = "block";
  this.PropertyService.dynamicVariable.next(this.style);
}
  addOption(typeId) {
    // console.log(this.webhook.headerItems.length,'lenbth');

    if (typeId == 1)
      if(this.webhook.headerItems.length<10){
        this.webhook.headerItems.push({ param: "", variable: "" });
      }else{
        this.toastr.warning("Limit Exceeded")
      }
    else if (typeId == 2)
    if(this.webhook.reqItems.length<10){
      this.webhook.reqItems.push({ param: "", variable: "" });
    }else{
      this.toastr.warning("Limit Exceeded")
    }
    else if (typeId == 3)
    if(this.webhook.respItems.length<10){
      this.webhook.respItems.push({ param: "", variable: "" });
    }else{
      this.toastr.warning("Limit Exceeded")
    }
  }
  checkUniqueName(name) {
    if (this.uniqueNameArray.includes(name.toLowerCase().trim())) {
      // console.log("Not Allowed")
      this.duplicateUniquecheckFlag = true;
    } else {
      this.duplicateUniquecheckFlag = false;
    }
  }
  onKeydown(event, index, cntlType) {
    this.selectedControlType = cntlType;
    this.index = index;
    // if (event.key === "Enter" && event.ctrlKey) {
    //   this.PropertyService.dynamicVariable.next("block");
    // }
    if(event.code == 'BracketRight' || event.code == 'BracketLeft'){
      event.preventDefault()
    }
    if(cntlType == 'RespParam'){
      event.preventDefault()
    }
  }

  childToParent(name) {       //! gets back the value of variable from variable popUp component
    if(this.type=="reqValue"){
      this.webhook.reqItems[this.index].variable=name;
    }else if(this.type=="rrsp"){
      this.webhook.respItems[this.index].param=name;
    }
    // switch (this.selectedControlType) {
    //   case "HeaderParam":
    //     this.webhook.headerItems[this.index].param = name;
    //     break;
    //   case "HeaderVariable":
    //     this.webhook.headerItems[this.index].variable = name;
    //     break;
    //   case "ReqParam":
    //     this.webhook.reqItems[this.index].param = name;
    //     break;
    //   case "ReqVariable":
    //     this.webhook.reqItems[this.index].variable = name;
    //     break;
    //   case "RespParam":
    //     this.webhook.respItems[this.index].param = name;
    //     break;
    //   case "RespVariable":
    //     this.webhook.respItems[this.index].variable = name;
    //     break;
    // }
  }


  deleteOption(typeId, index) {
    if (typeId == 1) this.webhook.headerItems.splice(index, 1);
    else if (typeId == 2) this.webhook.reqItems.splice(index, 1);
    else if (typeId == 3) this.webhook.respItems.splice(index, 1);
  }

  preventPaste(event){
    event.preventDefault();
  }
  checkNum(event){
    if((event.key).match(/[^0-9]/g)){
      if(event.code == "Backspace" ||event.key =="Delete"){
      }
      else{
        event.preventDefault()
      }
    }
  }

  clearForm() {         //! used to clear form
    this.webhook.message = "";
  }


  childValue(value, type,index) {       //!getting outputNode id from nextObject Component
    this.outputNode[index]=value;
    if (type == "success") {
      this.successNode = value;
    } else if (type == "failure") {
      this.failureNode = value
    }
  }

  onSubmit(form: NgForm) {
    // console.log(this.webhook.url.trim().slice(0,5),"Slice")
    // if(this.webhook.url.trim().slice(0,7)!= 'https:/' && this.webhook.url.trim().slice(0,7)!='http://'){
    //   this.toastr.warning("https is not present in URL", "Warning");
    //   return
    // }
    if(this.webhook.url.trim().match(/(http(s)?:\/\/.)([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) == null){
      this.toastr.warning("https:// or http:// is not present in URL", "Warning");
      return
    }
    this.service.changeFlag.next("add")
    let template = document.getElementsByClassName("selected");
    let templateId = template[0].id.split("-")[1];
    let newTemplate = document.getElementsByClassName("selected");
    var optionsObject = {};
    var options={}
    var optionNames = ["Success","Failed"]
    this.submittedFlag = true;
    // optionsObject[0] = "Success";
    // optionsObject[1] = "Failed";
    for(let i = 0; i < 2 ; i++){
      options[`output_${i+1}`]={
        optionName : optionNames[i],
        description  :""
        // next_node:""
      }
    }
    optionsObject[`section_1`]={
      sectionName: "",
      options:options
    }
    var webhookObj = JSON.parse(JSON.stringify(this.webhook))
    // console.log(webhookObj)
    var elementObj = {     //! data for saving to DB
      nodeDetails:this.outputNode,
      successNode:this.successNode,
      failureNode:this.failureNode,
      id: templateId,
      message: webhookObj.message,
      num: 2,
      uniqueName: form.value.uniqueName,
      method: webhookObj.method,
      type:webhookObj.contentType,
      url: webhookObj.url,
      headers: webhookObj.headerItems,
      reqParams: webhookObj.reqItems,
      respParams: webhookObj.respItems,
      answerOptions: optionsObject,
      retryCount: webhookObj.retryCount,
      timeOut: webhookObj.timeOut,
      submittedFlag : this.submittedFlag
    };
    // for(const element in elementObj){
    //   if(elementObj[element] == undefined){
    //     elementObj[element] = ""
    //   }
    // }
    // console.log(elementObj)


    for (let i = 0; i < this.answerOptions.length; i++) {    //! assigning nexyObject JSON and connection JSON from answerOptions
      this.connections[i] = {
        outputNodeName: form.value[`selectOutput${i}`],
        inputNodeId: form.value[`selectInput${i}`],
      };
    }
    this.service.addNodeToComponent.next(elementObj);         //!adding no:of outputnodes to the node in drawflow

    for(let i=0 ; i < elementObj.respParams.length; i++ ){
      this.PropertyService.addVariableToJSON(templateId,elementObj.respParams[i].param)     //!saving variable to variableArray
      // console.log(elementObj.respParams[i].param)
    }

    setTimeout(() => {
      this.PropertyService.addWebhookComponentDiv(elementObj);    //!adding node content to drawflow
      var templateInnerHtml = template[0].children[1].innerHTML;
      // this.service.addEle(templateId, templateInnerHtml);
      var nodeContent = {
        id : templateId,
        html :templateInnerHtml
      }
      this.service.nodeContent.next(nodeContent)            //! saving HTML of the node to Drawflow for copying the node

      // this.service.addEle(templateId, templateInnerHtml);
      this.service.deleteConnection.next(templateId);       //! deleting if existing connection presents to keep only one connection in outputnode
      if (this.successNode && this.failureNode) {           //! creating connection from saysObject to another saved Object
        for (let i = 0; i < 2; i++) {
          if (i == 0) {
            var connection = {
              outputId: templateId,
              inputId: this.successNode,
              outputNode: "output_1",
              inputNode: "input_1",
            };
          } else {
            var connection = {
              outputId: templateId,
              inputId: this.failureNode,
              outputNode: "output_2",
              inputNode: "input_1",
            }
          }
          this.service.addConnection.next(connection);
        }
      } else if (this.successNode) {
        var connection = {
          outputId: templateId,
          inputId: this.successNode,
          outputNode: "output_1",
          inputNode: "input_1",
        };
        this.service.addConnection.next(connection);
      } else if (this.failureNode) {
        var connection = {
          outputId: templateId,
          inputId: this.failureNode,
          outputNode: "output_2",
          inputNode: "input_1",
        }
        this.service.addConnection.next(connection);
      }
      this.PropertyService.addDataToJson(templateId, elementObj);   //! adding data to JSON for rebinding and DB
      this.PropertyService.addUniqueJSON(templateId, elementObj);        //! adding uniqueName to uniqueJSON for nextObejct property
      // this.uniqueObject = this.PropertyService.fetchUniqueJSON(this.nodeId);
      this.service.newReq.next(this.nodeId)                       //! getting uniqueNames from JSON for nextObject dropdown
    });
    this.toastr.success("Object Saved", "Success");
    // this.PropertyService.addWebhookComponentDiv(elementObj)
    // this.PropertyService.addDataToJson(templateId,elementObj)
    // var templateInnerHtml = newTemplate[0].children[1].innerHTML;
    // this.service.addEle(templateId,templateInnerHtml)
    // this.PropertyService.addUniqueJSON(templateId,elementObj)
  }
  ngOnDestroy() {
    this.service.changeFlag.next("destroy")
  }
  methodChange(event){
    // console.log(event,"event")
    if(event.target.value == 1){
      this.webhook.contentType = '1'
    }
  }
  apiTest(event){
    // console.log("Called")
    var obj = {
      display:'block',
      data :{
        method: this.webhook.method,
        type:this.webhook.contentType,
        url: this.webhook.url,
        headers: this.webhook.headerItems,
        reqParams: this.webhook.reqItems,
        timeOut:this.webhook.timeOut,
        retry:this.webhook.retryCount
        // respParams: this.webhook.respItems,
      }
    }
    this.PropertyService.testAPI.next(obj)
    event.preventDefault();
  }
  openHelp() {
    this.service.showHelpWindow.next("block")
    this.helpBtn = false;
  }
}
