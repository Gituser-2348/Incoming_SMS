import { Component, OnInit } from '@angular/core';
//import { campaignDetails, templateDetails } from '../../../views/smsservice/smsservice-model';
//import { SmsService } from '../../../views/smsservice/sms.service';

@Component({
  selector: 'app-testSMS',
  templateUrl: './testSMS.component.html',
 // styleUrls: ['../../../views/smsservice/smsservice.component.scss','./testSMS.component.scss']
})
export class TestSMSComponent implements OnInit {

  testMsgModal: any = {
    testNum: ["", ""],
    var: [[], []],
    content: ["", ""],
  };

  //TemplateDetails: templateDetails = <templateDetails>{
  //  senderId: "",
  //  templateName: "",
  //  contentType: "",
  //  content: "",
  //  variableCount: "",
  //};

  //campaignDetails: campaignDetails = <campaignDetails>{
  //  campaignName: "",
  //  campaignPeriodFrom: "12-12-2022",
  //  campaignPeriodTo: "01-03-2023",
  //  campaignTimeFrom: "",
  //  campaignTimeTo: "",
  //  campaignType: "1",
  //  campaignSMSType: "1",
  //  camapignId: "",
  //};

  displayTestSMS : any = "none"
  testCreated : boolean = false;
  dummyVar = [];
  msgCount:any;
  charCount:any;
  varEmptyFlag1 :boolean =false
  varEmptyFlag :boolean =false
  displaySent :any = 'none';
  constructor(/*private smsService :SmsService*/) {
    //this.smsService.openTestSMS.subscribe((campaign :any)=>{
    //  this.campaignDetails.camapignId = campaign.campaignId;
    // this.campaignDetails.campaignName = campaign.campaignName;
    // this.campaignDetails.campaignWindow = campaign.campaignWindow
    //  this.smsService
    //  .getTemplateDetailsAgainstCampaign({
    //    CampaignId: campaign.campaignId,
    //  })
    //  .subscribe((tempalteDetails: any) => {
    //    console.log(tempalteDetails, "Temp");
    //    this.TemplateDetails.senderId = tempalteDetails.senderId;
    //    this.TemplateDetails.tempalteId = tempalteDetails.templateId;
    //    this.TemplateDetails.templateName = tempalteDetails.templateName;
    //    this.TemplateDetails.templateType = tempalteDetails.templateType;
    //    this.TemplateDetails.contentType = tempalteDetails.messageType;
    //    this.TemplateDetails.content = tempalteDetails.template;
    //    this.TemplateDetails.variableCount = tempalteDetails.VariableCount
    //    this.createTestMsg("")
    //    this.displayTestSMS = "block"
    //  });
    //  // console.log(data,"Data")
    //})
   }

  ngOnInit() {
    // this.createTestMsg("")
  }

  ngAfterViewInit(){
    // this.createTestMsg("")
  }

  closeTemplateModal(type) {
    this.displayTestSMS = "none";
    this.testMsgModal = {
      testNum: ["", ""],
      var: [[], []],
      content: ["", ""],
    };
  }

  createComposedTemplate(templateContent, varlength, index) {
    let str = templateContent;
    for (let i = 0; i < varlength; i++) {
      // console.log( this.testMsgModal.var[index][i],"Index")
      if(this.testMsgModal.var[index][i] != ""){
        str = str.replace(`[VAR${i + 1}]`, this.testMsgModal.var[index][i]);
      }
    }
    return str
  }

  createVariableArray(length) {
    this.dummyVar = [];
    this.testMsgModal.var = [[], []];
    this.testMsgModal.content= ["", ""];
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        this.dummyVar.push("");
      }
      this.testMsgModal.var[0] = JSON.parse(JSON.stringify(this.dummyVar));
      this.testMsgModal.var[1] = JSON.parse(JSON.stringify(this.dummyVar));
    }
  }



  sendTestSMS(){
    this.displaySent = 'block'

  }

  checkVairableFilled(){
    var emptyFlag = 0
    this.varEmptyFlag  =false
    this.testMsgModal.var.map((data)=>{
      data.map((ele)=>{
        if(ele == ""){
          emptyFlag += 1
        }
      })
    })
    if(emptyFlag>0){
      this.varEmptyFlag = true;
    }
  }

  closeSendModal(){
    this.displaySent = 'none'
    this.displayTestSMS = 'none'
    this.testMsgModal = {
      testNum: ["", ""],
      var: [[], []],
      content: ["", ""],
    };
  }

  createTestMsg(formData) {
    // this.testCreated = true;

    let dataToPass = this.testMsgModal;
    this.checkVairableFilled()
    //this.testMsgModal.content.map((element, i) => {
    //  this.testMsgModal.content[i] = this.createComposedTemplate(
    //    //this.TemplateDetails.content,
    //    //this.TemplateDetails.variableCount,
    //    i
    //  );
    //  console.log( this.testMsgModal.content,"Message")
    //});
  }
}
