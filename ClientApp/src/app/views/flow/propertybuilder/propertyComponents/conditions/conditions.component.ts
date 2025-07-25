import { KeyValue } from '@angular/common';
import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FlowbuilderService } from '../../../flowbuilder.service';
import { conditions } from '../../../models/whatsappmodel';
import { PropertyBindingService } from '../../propertyBinding.service';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss']
})
export class ConditionsComponent implements OnInit {
  @ViewChild('initialCurser') initialCurser:ElementRef      //! getting elementRefernce for initial curser position
           //! onCompare used to iterate ObjectofObject in Anugular which return key:value pair in th object
  private onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>) {
    return -1;
  }
  conditions: conditions = <conditions>{    //! initialising conditionsModel
    variableOptions: [],
    yes: "",
    no: "",
    uniqueName: "",
  };
  outputNode:any=[[],[]];                   //! for storing outputnode id(name)
  selectedNode:any=[[],[]];                 //! for selecting output node connction
  display = "none";                //! used for variable popUp
  nodeId: any;                     //! id of currentObject
  // uniqueObjectLength;
  connectionIdArray: any = []
  variableOptions: any = [{vOne:"",vCondition:'1',vTwo:""}];      //! storing variableOptions for the condition Component
  variableArrayLength: any = 0;   //! storing length of variableOptions
  connections = {};
  addConnectionToggle = false;
  index: any;         //! used to store the variable index in array
  type: any;         //! for setting variable name passed to variable Component
  style = "block";   //! for choosing the variable component to be show/hide (popUp)
  icon = "{X}";      //! variable component icon (used to popUp variable list)
  yesNode: any;      //! for selecting output node connction
  noNode: any;       //! for selecting output node connction
  conditionObjectMaster={
    1: '=',
    2: '≠',
    3: '>',
    4: '>=',
    5: '<',
    6: '<=',
    7: 'Begins with',
    8: 'Does not begins with',
  };
  uniqueNameArray: any = [];
  disabledForView: boolean = false;
  emptyValueFlag : boolean = false;
  duplicateUniquecheckFlag: boolean = false;
  constructor(private service: FlowbuilderService, private toastr: ToastrService,
    private PropertyService: PropertyBindingService) {
      this.selectedNode = this.outputNode;
    this.PropertyService.fetchDataSubscription.subscribe((val) => {    //! rebinding data of component to the propertyWindow if already saved
      this.variableOptions = [];
      var data = JSON.parse(JSON.stringify(val))
      if (data != undefined) {
        try {
          // console.log(data,"Data Conditions")
          // this.selectedNode=data.nodeDetails;
          // this.selectedNode = []
          this.yesNode=data.yesNode;
          this.noNode=data.noNode;
          this.conditions.uniqueName = data.uniqueName;
          this.conditions.yes = data.yes;
          this.conditions.no = data.no;
          for (const options in data.variables) {
            var temp = data.variables[options];
            this.variableOptions.push(temp);
          }
          for(let i=0;i<data.nodeDetails.length -1; i++){
            this.selectedNode[0].push(data.nodeDetails[i])
          }
          this.selectedNode[1].push(data.nodeDetails[data.nodeDetails.length -1])
        } catch (err) { }
      } else {

      }
    });
    this.PropertyService.disableSubmit.subscribe((data) => {
      this.disabledForView = true;
    });
    this.PropertyService.dynamicIdConditions.subscribe((id) => {  //! getting nodeId from service
      this.nodeId = id;
    });
    this.service.passUniqueName.subscribe((data:any)=>{
      this.conditions.uniqueName = data.uniqueName
      this.nodeId = data.id
    })
  }

  input(i, name) {       //! used to pass the variable property to variable popUp component
    this.index = i;
    this.type = name;
    this.style = "block";
    this.PropertyService.dynamicVariable.next(this.style);
  }

  ngOnInit(): void {
    // if(this.conditions.uniqueName=="")
    // this.conditions.uniqueName = this.service.generateUniqueName("conditions"); //!generating different uniqueNames for objects on initialisation
    if (this.variableOptions.length == 0) {
      this.addOption()
    }
    this.outputNode = this.selectedNode
    this.uniqueNameArray = this.PropertyService.getUniqueName(this.nodeId);
  }
  ngAfterViewInit(){
    this.initialCurser.nativeElement.focus()   //! Assigning curser position to uniqueName input field
  }
  // testIncludes(flag,condition){
  //   if(flag == 0){
  //    var returnFlag = ['3','4','5','6'].includes(condition);
  //    return returnFlag;
  //   }else if(flag == 1){
  //     var returnFlag = ['1','2','7','8'].includes(condition);
  //    return returnFlag;
  //   }
  // }
  addOption() {     //! adding new variable Options
    if (this.variableOptions.length <= 9) {
      this.variableOptions.push({vOne:"",vCondition:'1',vTwo:""});
      this.outputNode[0].push("")
      this.updateArrayLength();
    } else {
      this.toastr.warning("Limit Exceeded")
    }
  }

  updateArrayLength() {     //! increasing or decreasing variableOptions Length
    this.variableArrayLength = this.variableOptions.length;
  }

  delete(i) {         //! removing variableOptions
    this.variableOptions.splice(i, 1);
    this.outputNode[0].splice(i, 1)
    this.updateArrayLength();
  }

  childToParent(name) {           //! gets back the value of variable from variable popUp component
    if (this.type == "vOne") {
      this.variableOptions[this.index].vOne = name;
    } else if (this.type == "vTwo") {
      this.variableOptions[this.index].vTwo = name;
    }
  }
  checkUniqueName(name) {
    //!To be implemented
    if (this.uniqueNameArray.includes(name.toLowerCase().trim())) {
      // console.log("Not Allowed")
      this.duplicateUniquecheckFlag = true;
    } else {
      this.duplicateUniquecheckFlag = false;
    }
  }

  childValue(value, type,index) {       //!getting outputNode id from nextObject Component
    this.outputNode[type][index]=value;
    // console.log(value,'value');
    // console.log(type,'type');
    // console.log(index,'index');
    // if (type == "yes") {
    //   this.yesNode = value;
    // } else if (type == "no") {
    //   this.noNode = value;
    // }
  }
  preventSqrBracket(event,object){
    if(event.code == 'BracketRight' || event.code == 'BracketLeft'){
      event.preventDefault()
    }
    // console.log(object,"Objetc")
    if(['3','4','5','6'].includes(object['vCondition'])){
      this.checkNumberAndDate(event,object);
    }
  }
  checkNumberAndDate(event,object){
    // var charCode = (event.which) ? event.which : event.keyCode;
    // if (String.fromCharCode(charCode).match(/[^0-9]/g))
    //   return false;
    // console.log(event.key)
    if((event.key).match(/[^0-9]/g)){
      if(event.code == "Backspace"|| event.key == "/" || event.key ==":" || event.key =="Delete"){
      }
      else{
        event.preventDefault()
      }
    }

  }
  clearModel(index){
    this.variableOptions[index]["vOne"] = "";
    this.variableOptions[index]["vTwo"] = "";
  }
  preventPaste(ev){
    ev.preventDefault()
  }
  onSubmit(form) {
    this.connectionIdArray = [];


    // "vCondition": "1",
    //     "vOne": "wtes",
    //     "vTwo": "[test]"

    var duplicateCheckArray = [];
    for(let i=0; i<this.variableOptions.length; i++){
      duplicateCheckArray.push("".concat(this.variableOptions[i]["vOne"].trim().toLowerCase(),
      this.variableOptions[i]["vCondition"].trim(),
      this.variableOptions[i]["vTwo"].trim().toLowerCase()))
    }
    if (new Set(duplicateCheckArray).size !== duplicateCheckArray.length) {
      this.toastr.error("Duplicate conditions", "Error")
      return
    }
    for(let i=0; i<this.variableOptions.length; i++){
      if(this.variableOptions[i]["vTwo"].trim().length == 0){
        this.toastr.warning("Empty Variable/Value", "Warning")
        return
      }
    }

    this.service.changeFlag.next("add")
    var template = document.getElementsByClassName("selected");
    var templateId = template[0].id.split("-")[1];      //! getting nodeId from template
    let newTemplate = document.getElementsByClassName('selected');
    // console.log(this.selectedNode,'selectedNode');



    var options ={};
    var optionsObject= {};
    for(let i = 0;i < this.variableOptions.length;i++){
      options[`output_${i+1}`] = {
        optionName: `${this.variableOptions[i].vOne} ${this.conditionObjectMaster[this.variableOptions[i].vCondition]} ${this.variableOptions[i].vTwo}`,
        description: ""
        // next_node:""
      }
    }
    optionsObject[`section_1`] = {
      sectionName: "",
      options: options
    }
    options = {}
    // optionsObject[`errorSection`] = {
    //   sectionName: "ErrorType",
    //   options: {
    //     output_1:{
    //       optionName : "Invalid/Failed",
    //       description : ""
    //     }
    //   }
    // }

    options[`output_${this.variableOptions.length+1}`] = {
      optionName: "Invalid/Other",
      description: ""
    }
    optionsObject[`errorSection`] = {
      sectionName: "ErrorType",
      options: options
    }

    var elementObj = {     //! data for saving to DB
      nodeDetails:this.outputNode,
      yesNode:this.yesNode,
      noNode:this.noNode,
      uniqueName: form.value.uniqueName,
      num: this.variableOptions.length + 1,
      variables: this.variableOptions,
      id: templateId,
      // message: this.variableOptions,
      // answerOptions: {
      //   section_1:{
      //     options:{
      //       output_1:{
      //         optionName:"Yes",
      //         description:""
      //         // next_node:""
      //       },
      //       output_2:{
      //         optionName: "No",
      //         description:""
      //         // next_node:""
      //       }
      //     },
      //     sectionName:""
      //   }
      // },
      answerOptions : optionsObject
    }
    // console.log(elementObj,"Ele")
    for (let i = 0; i <= this.variableOptions.length; i++) {
      this.connections[i] = {
        outputNodeName: `output_${i + 1}`,
        // inputNodeId: this.outputNode[i]
      };
    }
    for (let i = 0; i < this.outputNode.length; i++) {
      // console.log(this.outputNode[i].length, "outputNodeLength")
      if (this.outputNode[i].length == 0) {
        this.connectionIdArray.push("")
      } else {
        for (let j = 0; j < this.outputNode[i].length; j++) {
          this.connectionIdArray.push(this.outputNode[i][j])
        }
      }
    }


    // for(const element in elementObj){
    //   if(elementObj[element] == undefined){
    //     elementObj[element] = ""
    //   }
    // }

    this.service.addNodeToComponent.next(elementObj);       //!adding no:of outputnodes to the node in drawflow
    setTimeout(() => {
      this.PropertyService.addConditionsDiv(elementObj);    //!adding node content to drawflow
      this.PropertyService.addDataToJson(templateId, elementObj);   //! adding data to JSON for rebinding and DB
      var templateInnerHtml = newTemplate[0].children[1].innerHTML;
      // this.service.addEle(templateId, templateInnerHtml);
      var nodeContent = {
        id: templateId,
        html: templateInnerHtml
      }

      this.service.nodeContent.next(nodeContent);           //! saving HTML of the node to Drawflow for copying the node
      this.service.deleteConnection.next(templateId);       //! deleting if existing connection presents to keep only one connection in outputnode

      for (let i = 0; i <= this.variableOptions.length ; i++) { //! creating connection from saysObject to another saved Object loop used for more number of outputnodes
        var connection = {
          outputId: templateId,
          inputId: this.connectionIdArray[i],
          outputNode: this.connections[i].outputNodeName,
          inputNode: "input_1",
        };
        this.service.addConnection.next(connection);
      }
      // if (this.yesNode && this.noNode) {                //! creating connection from saysObject to another saved Object
      //   for (let i = 0; i < 2; i++) {
      //     if (i == 0) {
      //       var connection = {
      //         outputId: templateId,
      //         inputId: this.yesNode,
      //         outputNode: "output_1",
      //         inputNode: "input_1",
      //       };
      //     } else {
      //       var connection = {
      //         outputId: templateId,
      //         inputId: this.noNode,
      //         outputNode: "output_2",
      //         inputNode: "input_1",
      //       };
      //     }

      //     this.service.addConnection.next(connection);
      //   }
      // } else if (this.yesNode) {
      //   var connection = {
      //     outputId: templateId,
      //     inputId: this.yesNode,
      //     outputNode: "output_1",
      //     inputNode: "input_1",
      //   };
      //   this.service.addConnection.next(connection);
      // } else if (this.noNode) {
      //   var connection = {
      //     outputId: templateId,
      //     inputId: this.noNode,
      //     outputNode: "output_2",
      //     inputNode: "input_1",
      //   };
      //   this.service.addConnection.next(connection);
      // }
      // console.log(elementObj,'outputNode');
      this.PropertyService.addUniqueJSON(templateId, elementObj);    //! adding uniqueName to uniqueJSON for nextObejct property
      this.service.newReq.next(this.nodeId);      //! getting uniqueNames from JSON for nextObject dropdown
      this.toastr.success("Object Saved", "Success");
    });
  }

  ngOnDestroy() {
    this.variableOptions = "";
    this.service.changeFlag.next("destroy")
  }

}
