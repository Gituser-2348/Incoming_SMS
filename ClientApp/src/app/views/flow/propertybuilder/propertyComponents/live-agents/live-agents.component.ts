import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FlowbuilderService } from '../../../flowbuilder.service';
import { liveAgents } from '../../../models/whatsappmodel';
import { PropertyBindingService } from '../../propertyBinding.service';

@Component({
  selector: 'app-live-agents',
  templateUrl: './live-agents.component.html',
  styleUrls: ['./live-agents.component.scss']
})
export class LiveAgentsComponent implements OnInit {

  liveAgents: liveAgents = <liveAgents>{
    uniqueName: "",
    keyword: "",
    transferLogic: '-1',
    customerRatio: "",
    agentList: [],
    groupList: [],
    agentUnavailable: "",
    initialMessage: "",
    agentReplyWaitTime: 30,
    customerTotalWaitTime: 1800
  }
  tempModel: string = "liveAgents.initialMessage";
  modelToPass = this.liveAgents.initialMessage;
  members: string[] = ['member1', 'member2']
  uniqueNameArray: any = [];
  keywordArray: any = [];
  duplicateUniquecheckFlag: boolean = false;
  duplicatekeywordcheckFlag: boolean = false;
  nodeId: any;
  textLength: boolean = false;
  outputNode: any = [];                   //! for storing outputnode id(name)
  selectedNode: any = [[]];                 //! for selecting output node connction
  agents: any = [
    // { name: 'Agent-1', id: "1" },
    // { name: 'Agent-2', id: "2" },
    // { name: 'Agent-3', id: "3" },
    // { name: 'SuperVisor 4', id: "40" },
  ];
  groups: any = [
    // { name: 'Group-1', id: "21" },
    // { name: 'Group-2', id: "22" },
    // { name: 'Group-3', id: "23" }
  ]
  stickyAgent: boolean = false;
  disabledForView: boolean = false;
  waitTimeComparisonFlag: boolean = true;
  showName: boolean = false;
  maskNumber: boolean = false;


  constructor(
    private propertyService: PropertyBindingService,
    private builderService: FlowbuilderService,
    private toastr: ToastrService,
  ) {
    // this.selectedNode = this.outputNode;
    this.propertyService.dynamicIdConditions.subscribe((id) => {  //! getting nodeId from service
      this.nodeId = id;
    });
    this.builderService.passUniqueName.subscribe((data: any) => {
      this.liveAgents.uniqueName = data.uniqueName
      this.nodeId = data.id
    })

    this.propertyService.disableSubmit.subscribe((data) => {
      this.disabledForView = true;
    });

    this.propertyService.fetchDataSubscription.subscribe((val: any) => {
      var data = JSON.parse(JSON.stringify(val))
      if (data != undefined) {
        // console.log(data,'data')
        this.liveAgents.uniqueName = data.uniqueName;
        this.liveAgents.keyword = data.keyword;
        this.liveAgents.transferLogic = data.transferLogic;
        this.liveAgents.customerRatio = data.customerRatio;
        this.liveAgents.agentList = data.agentList;
        this.liveAgents.groupList = data.groupList;
        this.liveAgents.initialMessage = data.initialMessage;
        this.textLength = this.getTextLength(data.initialMessage);
        // this.liveAgents.agentUnavailable = data.agentUnavailable;
        this.modelToPass = data.initialMessage;
        this.stickyAgent = data.sticky_agent;
        this.liveAgents.agentReplyWaitTime = data.agentReplyTime;
        this.liveAgents.customerTotalWaitTime = data.cust_waitTime;
        this.maskNumber = data.maskNumber;
        this.showName = data.showName;
        for (let i = 0; i < data.nodeDetails.length; i++) {
          this.selectedNode[0].push(data.nodeDetails[i]);
        }
      }
    })
  }

  ngOnInit(): void {
    // this.outputNode = this.selectedNode
    this.uniqueNameArray = this.propertyService.getUniqueName(this.nodeId);
    this.keywordArray = this.propertyService.getKeyword(this.nodeId);
    // console.log(this.uniqueNameArray,this.keywordArray)
    this.agents = this.builderService.agentList;
    this.groups = this.builderService.groupList;
    // console.log(this.agents,"Agent",this.groups,"Group")
  }


  checkUniqueName(name) {
    //!To be implemented
    if (this.uniqueNameArray.includes(name.toLowerCase().trim())) {
      this.duplicateUniquecheckFlag = true;
    } else {
      this.duplicateUniquecheckFlag = false;
    }
  }


  checkKeyword(name) {
    //!To be implemented
    if (this.keywordArray.includes(name.toLowerCase().trim())) {
      this.duplicatekeywordcheckFlag = true;
    } else {
      this.duplicatekeywordcheckFlag = false;
    }
  }


  getMessage(message) {
    console.log(message, 'mess');
    this.liveAgents.initialMessage = message;
    this.textLength = this.getTextLength(message)
  }

  getTextLength(message) {
    if (message != undefined && message != null) {
      return message
        .replace(/&nbsp;/g, " ")
        .replace(/<br>/g, "")
        .trim().length != 0
    } else return false
  }

  childValue(value, type, index) {       //!getting outputNode id from nextObject Component
    this.outputNode[index] = value;

  }
  replaceFunction(message) {
    // console.log(message, "Message");
    return message
      .replace(/<b>[<br>]*<\/b>/g, "<br>")
      .replace(/[a-z0-9]<div><br><\/div><div>/, "<br><br>")
      .replace(/<div><br><\/div><div>/g, "<br>")
      .replace(/<div><br><div>/g, "<br><br>")
      .replace(/<div><br><\/div>/g, "<br>")
      .replace(/<\/?span[^>]*>/g, "")
      .replace(/<div>/g, "<br>")
      .replace(/<\/div>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/<b>\s+/g, " <b>").replace(/\s+<\/b>/g, "</b> ")
      .replace(/<i>\s+/g, " <i>").replace(/\s+<\/i>/g, "</i> ")
      .replace(/<strike>\s+/g, " <strike>").replace(/\s+<\/strike>/g, "</strike> ")
      .replace(/\n/g, "<br>")
      .replace(/&amp;/g, "&")
      .replace(/\\"/g, '"')
      .replace(/"/g, '\\"')
      .replace(/\n/g, "<br>");
  }
  checkingNumber(event) {
    //!used to check whether the typed value is number/not
    var reg = /^[0-9+-.]+$/;
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
  }
  compareWaitTime() {
    if (Number(this.liveAgents.customerTotalWaitTime) <= Number(this.liveAgents.agentReplyWaitTime)) {
      this.waitTimeComparisonFlag = false;
    } else {
      this.waitTimeComparisonFlag = true
    }
  }
  onSubmit(form) {
    // console.log(form.value,"Form")
    if (form.value.agentList.length == 0 && form.value.groupList.length == 0) {
      this.toastr.warning("Please select atleaet One Agent or Group", "Warning")
      return
    }
    let newTemplate = document.getElementsByClassName("selected");
    var optionsObject = {};
    var options = {}
    var optionNames = ["Agent Unavailable", "Communication End"]
    // optionsObject[0] = "Success";
    // optionsObject[1] = "Failed";
    // console.log(newTemplate,"Template")
    for (let i = 0; i < 2; i++) {
      options[`output_${i + 1}`] = {
        optionName: optionNames[i],
        description: ""
        // next_node:""
      }
    }
    optionsObject[`section_1`] = {
      sectionName: "",
      options: options
    }
    var agentGroup = [];
    if (form.value.agentList.length > 0) {
      form.value.agentList.map((agentId: any) => {
        this.agents.map((agentObj: any) => {
          if (agentId == agentObj.id) {
            agentGroup.push(agentObj.name)
          }
        })
      })
    }
    if (form.value.groupList.length > 0) {
      form.value.groupList.map((groupId: any) => {
        this.groups.map((groupObj: any) => {
          if (groupId == groupObj.id) {
            agentGroup.push(groupObj.name)
          }
        })
      })
    }
    var elementObj = {
      num: 2,
      nodeDetails: this.outputNode,
      id: this.nodeId,
      uniqueName: form.value.uniqueName,
      keyword: form.value.keyword,
      transferLogic: form.value.transferLogic,
      customerRatio: form.value.customerRatio,
      agentList: form.value.agentList,
      groupList: form.value.groupList,
      agentUnavailable: form.value.agentUnavailable,
      answerOptions: optionsObject,
      sticky_agent: this.stickyAgent,
      agentGroup: agentGroup,
      initialMessage: this.replaceFunction(this.liveAgents.initialMessage),
      agentReplyTime :this.liveAgents.agentReplyWaitTime,
      cust_waitTime : this.liveAgents.customerTotalWaitTime,
      maskNumber: this.maskNumber,
      showName:this.showName
    }
    // console.log(elementObj,'eleme')
    this.builderService.addNodeToComponent.next(elementObj);

    setTimeout(() => {
      this.propertyService.addLiveAgentDiv(elementObj); //!adding node content to drawflow
      var templateInnerHtml = newTemplate[0].children[1].innerHTML;
      var nodeContent = {
        id: this.nodeId,
        html: templateInnerHtml,
      };
      // console.log(nodeContent,"TestContent")

      this.builderService.nodeContent.next(nodeContent); //! saving HTML of the node to Drawflow for copying the node
      this.builderService.deleteConnection.next(this.nodeId); //! deleting if existing connection presents to keep only one connection in outputnode
      for (let i = 0; i < 2; i++) {
        var connection = {
          outputId: this.nodeId,
          inputId: this.outputNode[i],
          outputNode: `output_${i + 1}`,
          inputNode: "input_1",
        };
        this.builderService.addConnection.next(connection); //! creating connection from saysObject to another saved Object
      }

      this.propertyService.addDataToJson(this.nodeId, elementObj); //! adding data to JSON for rebinding and DB
      this.propertyService.addKeywordToJSON(this.nodeId, elementObj); //!saving keyword to keywordJSON
      this.propertyService.addUniqueJSON(this.nodeId, elementObj); //! adding uniqueName to uniqueJSON for nextObejct property
      this.builderService.newReq.next(this.nodeId); //! getting uniqueNames from JSON for nextObject dropdown
    });
    this.toastr.success("Object Saved", "Success");
  }
}
