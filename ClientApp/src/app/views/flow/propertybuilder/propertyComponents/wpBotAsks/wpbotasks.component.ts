import { Component, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { FlowbuilderService } from "../../../flowbuilder.service";
import { PropertyBindingService } from "../../propertyBinding.service";
import { wpBotAsk } from "../../../models/whatsappmodel";
import { KeyValue } from "@angular/common";
import { wpbotsaysService } from "../../wpbotsays.service";
import { ToastrService } from "ngx-toastr";
import { LoadingBarService } from "@ngx-loading-bar/core";

@Component({
  selector: "wpbot-ask-component",
  templateUrl: "./wpbotasks.component.html",
  styleUrls: ["../wpBotSays/wpbotsays.component.css", "./wpbotasks.component.css"],
})

export class WpbotasksComponent {
  @ViewChild('initialCurser') initialCurser: ElementRef       //! getting elementRefernce for initial curser position
  //! onCompare used to iterate ObjectofObject in Anugular which return key:value pair in th object
  private onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>) {
    return -1;
  }
  botask: wpBotAsk = <wpBotAsk>{
    validationJson: {
      typeId: "0",
      dateTime: {
        formatId: "2",
        showDatePicker: false,
        fromDate: "",
        toDate: "",
      },
      number: {
        fromLength: "",
        toLength: "",
        fromRange: "",
        toRange: "",
        exactValue: [
          // { value: ""}
        ],
      },
      text: {
        caseSensitive: false,
        selectedTypeId: 1,
        fromLength: "",
        toLength: "",
        exactValue: [
          // { value: "" }
        ],
        criteriaList: [
          // { selectedId: 1, value: "" }
        ],
      },
    },
    uniqueName: "",
    selectFieldvalue: 1,
    multimediaFieldValue: 5,
    keyword: "",
    message: "",
    timeoutMessage: "",
    invalidMessage: "",
    retryMessage: "",
    answerOptions: [""],
    descriptions: [""],
    timeout: 3600,
    fileName: {
      image: "Choose Image",
      audio: "Choose Audio",
      video: "Choose Video",
      document: "Choose Document",
    },
    caption: {
      image: "",
      audio: "",
      video: "",
      document: ""
    },
    mediaUrl: {
      image: "",
      audio: "",
      video: "",
      document: "",
      sticker: ""
    },
    invalidresponseKey: "Invalid/Other",
    // sections:[{
    //   name:"",
    //   options:[{
    //     optionName:"",
    //     description:""
    //   }]
    // }]
    retryCount: 3,
    variable:"",
    waitTime:0,
    expectedInput:5
  };
  icon = "{X}";               //! variable component icon (used to popUp variable list)
  type: any;                 //! for setting variable name passed to variable Component
  style = "block"             //! for choosing the variable component to be show/hide (popUp)
  index: any;                 //! used to store the variable index in array
  caption: any;               //! for storing caption from the user for multimedia if exist
  nodeId: any;                //! id of currentObject
  answerOptions: any = [""];    //! storing answerOptions for the botask Component
  sections: any = [{
    name: "",
    options: [{
      optionName: "",
      description: ""
    }]
  }]
  answerArrayLength: any = 0; //! storing length of answerOptions
  connections = {};               //! storing connections
  formValidity = true;            //! check whether all fields are valid / not
  textLength: boolean = false;    //! flag to check the message field having value/ not
  message: string;                //! used to store the message value that emitted from the textareaComponent
  elementLength: any = 20;        //! setting list type has 20 options
  selectFieldToggle: any = 1;      //! selecting default value as lisType for question
  optionName: any = "Answer key";
  selectedNode: any = [[], [], []];           //! for selecting output node connction
  outputNode: any = [[], [], []]               //! array for storing outputnode element id
  nextObject: any = {};            //! outputNodes are stored in nextObject JSON
  // multimediaFieldValue:any;
  mulSelectFieldToggle: any = 5;       //! used to store the value of multimedia selection field value
  content: string = "Content";     //! header for the textarea changing dynamically
  tempModel: string = "botask.message";    //! modelname for comparing the message that emitted from the textareaComponent
  modelToPass = this.botask.message;        //! modal for pass to textareaComponent
  fileUploadFlag: boolean = false;         //! flag used to check whether the file is uploaded or not
  sizeLimit: boolean = false;     //! flag for checking media size <5MB,<16MB etc
  mediaId: any;                   //! variable used for storing mediaid getting from backend
  filePath: any;                  //! for storing uploaded media file used for converting to {mediaid}
  fileName: any;                  //! file name
  imageCaption: string;          //! used for storing caption content in the textareaField of image
  audioCaption: string;           //! used for storing caption content in the textareaField of audio
  videoCaption: string;           //! used for storing caption content in the textareaField of video
  documentCaption: string;        //! used for storing caption content in the textareaField of document
  extensionType: any;            //! extension type of document file (.pdf,.xls,.xlsx)
  timeoutMessage: any              //! used to store the message for timeout that emitted from textareaComponent
  invalidMessage: any             //! used to store the message for invalid response from the user
  invalidresposnseNode: any       //! used to store the invalide response redirection object
  retryMessage: any                //! used to store the retry message that emitted from textareaComponent
  getValidators: any
  indexOfNext: any = 1
  connectionIdArray: any = []
  mediaUrlFlag: any = false;
  previewUrlFlag: boolean = false;
  previewUrlFlagDB: any;
  header: any;
  uniqueNameArray: any = [];
  keywordArray: any = [];
  duplicateUniquecheckFlag: boolean = false;
  duplicatekeywordcheckFlag: boolean = false;
  gifWarning: any = false;
  mediaErrorFlag: any = false;
  disabledForView: boolean = false;
  maxLength: any = 100;
  contentLength:any = 4000;
  nullOptionFLag : boolean = false;
  nullSectionFlag : boolean = false;
  variableFlag:boolean = false;
  expectedInput:any =5;
  constructor(
    private service: FlowbuilderService,
    private PropertyService: PropertyBindingService,
    private Service: wpbotsaysService,
    private toastr: ToastrService,
    public loader: LoadingBarService,
    private detecterRef: ChangeDetectorRef
  ) {
    this.selectedNode = this.outputNode;

    this.PropertyService.disableSubmit.subscribe((data) => {
      this.disabledForView = true;
    })

    this.PropertyService.fetchDataSubscription.subscribe((val) => {  //! rebinding data of component to the propertyWindow if already saved
      var data = JSON.parse(JSON.stringify(val))
      if (data != undefined) {
        // console.log(data)
        try {
          this.botask.uniqueName = data.uniqueName;
          this.botask.message = data.message;
          this.botask.keyword = data.keyword;
          this.selectFieldToggle = data.valSelectField;
          this.botask.selectFieldvalue = data.valSelectField;
          this.mulSelectFieldToggle = data.valMultimediaSelect;
          this.botask.multimediaFieldValue = data.valMultimediaSelect;
          this.botask.timeoutMessage = data.timeoutMessage;
          this.botask.invalidMessage = data.invalidMessage;
          this.botask.timeout = data.timeout;
          this.botask.variable = data.variable;
          this.botask.listButtonName = data.button;
          this.botask.footer = data.footer;
          // this.botask.body = data.body;
          this.botask.header = data.header;
          this.botask.waitTime = data.objectWait
          this.botask.retryCount = data.retryCount;
          this.mediaId = data.fileValue;
          this.textLength = true;
          this.fileUploadFlag = true;
          this.mediaUrlFlag = data.mediaUrlFlag;
          this.previewUrlFlag = data.urlCheck;
          this.expectedInput = data.exp_inp;
          this.botask.expectedInput = data.exp_inp
          // this.previewUrlFlagDB = data.urlCheck;
          // if(data.urlCheck == "1"){
          //   this.previewUrlFlag = true;
          // }else{
          //   this.previewUrlFlag = false;
          // }
          // this.botask.invalidresponseKey = data.invalidresponseKey
          this.modelToPass = this.botask.message;
          this.content = "Content";
          this.tempModel = "botask.message";
          this.botask.answerOptions = [];
          this.selectedNode = []
          // this.botask.descriptions = [];
          this.answerOptions = [];
          this.sections = []
          this.contentLength = 4000;
          this.maxLength = 100;
          // if(data.keyword){
          //   this.keywordFlag = true;
          // }
          if (this.botask.multimediaFieldValue == undefined) {
            this.botask.multimediaFieldValue = 5
          }
          if (data.valSelectField == 1) {
            this.optionName = "Answer key";
            this.elementLength = 20;
            this.maxLength = 100;
            this.contentLength = 4000;
          } else if (data.valSelectField == 2) {
            this.optionName = "Button";
            this.elementLength = 3;
            this.maxLength = 20;
            this.contentLength = 1024;
          } else if (data.valSelectField == 3) {
            this.optionName = "List Item";
            this.elementLength = 10;
            this.maxLength = 24;
            this.contentLength = 1024;
          }
          if (data.valMultimediaSelect == 1) {    //!assining caption,filepath,fileName curresponding to previous save
            this.botask.caption.image = data.caption
            this.botask.fileName.image = data.fileName
            this.fileName = data.fileName
            this.filePath = data.fileValue
            this.extensionType = data.extensionType
            this.modelToPass = this.botask.caption.image    //!re-assigning model to textarea field
            if (data.valSelectField == 2) {
              this.content = "body";
              this.contentLength = 1024;
            } else {
              this.content = "Image Caption"
              this.contentLength = 1024;
            }
            this.tempModel = "botask.caption.image"
            if (data.mediaUrlFlag == true) {
              this.botask.mediaUrl.image = data.fileValue
            }
          } else if (data.valMultimediaSelect == 2) {  //!assining caption,filepath,fileName curresponding to previous save
            this.botask.caption.audio = data.caption
            this.botask.fileName.audio = data.fileName
            this.filePath = data.fileValue
            this.fileName = data.fileName
            this.extensionType = data.extensionType
            this.modelToPass = this.botask.caption.audio
            this.content = "Audio Caption"
            this.tempModel = "botask.caption.audio"
            if (data.mediaUrlFlag == true) {
              this.botask.mediaUrl.audio = data.fileValue
            }
          } else if (data.valMultimediaSelect == 3) {  //!assining caption,filepath,fileName curresponding to previous save
            this.botask.caption.video = data.caption
            this.botask.fileName.video = data.fileName
            this.filePath = data.fileValue
            this.fileName = data.fileName
            this.extensionType = data.extensionType
            this.modelToPass = this.botask.caption.video
            if (data.valSelectField == 2) {
              this.content = "Body"
              this.contentLength = 1024;
            } else {
              this.content = "Video Caption"
              this.contentLength = 1024;
            }
            this.tempModel = "botask.caption.video"
            if (data.mediaUrlFlag == true) {
              this.botask.mediaUrl.video = data.fileValue
            }
          } else if (data.valMultimediaSelect == 4) {  //!assining caption,filepath,fileName curresponding to previous save
            this.botask.caption.document = data.caption
            this.botask.fileName.document = data.fileName
            this.botask.documentFileName = data.fileName
            this.filePath = data.fileValue;
            this.fileName = data.fileName
            this.extensionType = data.extensionType
            this.modelToPass = this.botask.caption.document
            if (data.valSelectField == 2) {
              this.content = "Body"
              this.contentLength = 1024;
            } else {
              this.content = "Document Caption"
              this.contentLength = 1024;
            }
            this.tempModel = "botask.caption.document"
            if (data.mediaUrlFlag == true) {
              this.botask.mediaUrl.document = data.fileValue
            }
          } else if(data.valMultimediaSelect == -1) {   //! changing other field values to default
            this.content = "Body"    //! setting model to default to message field
            this.tempModel = "botask.message"
            this.modelToPass = this.botask.message
            this.fileUploadFlag = true;
            this.contentLength = 1024;
            if(this.selectFieldToggle == 2){
              this.maxLength = 20;
            }else if(this.selectFieldToggle == 3){
              this.maxLength = 24;
            }
          }
          else {
            //! setting model to default to message field
            if (this.selectFieldToggle == 2 || this.selectFieldToggle == 3) {
              this.content = "Body ";
              this.contentLength = 1024;
            } else {
              this.content = "Content";
              this.contentLength = 4000;
            }
            if(this.selectFieldToggle == 2){
              this.maxLength = 20;
            }else if(this.selectFieldToggle == 3){
              this.maxLength = 24;
            }
            this.tempModel = "botask.message"
            this.modelToPass = this.botask.message
            this.fileUploadFlag = true;
          }
          // for (const options in data.answerOptions) {
          //   var limit = Object.keys(data.answerOptions).length-1
          //   while(this.botask.answerOptions.length<limit){
          //     var optionName = data.answerOptions[options].optionName;
          //     var description = data.answerOptions[options].description
          //     this.botask.answerOptions.push(optionName);
          //     this.answerOptions.push(optionName);
          //     this.botask.descriptions.push(description)
          //     break;
          //   }
          // }
          if (data.validationJSON == undefined) {
            this.botask.validationJson = this.botask.validationJson
          } else {
            this.botask.validationJson = data.validationJSON
          }
          var inital_index = 0
          for (const option in data.answerOptions) {
            // if(option != "errorSection" && option != "retrySection" ){
            if (option != "errorSection") {
              var options = data.answerOptions[option].options
              var name = data.answerOptions[option].sectionName
              var optionArray = [];
              for (const opt in options) {
                // this.botask.description
                optionArray.push(options[opt])
                this.answerOptions.push("")
              }
              this.sections.push({
                name: name,
                options: optionArray
              })

              if (data.nodeDetails.length > 0) {
                this.selectedNode.push([])
                var connectionList = data.nodeDetails;
                var arrayIndex = option.split("_")[1]
                var sectionOptionLength = Object.keys(options).length
                var arrayList = connectionList.slice(inital_index, inital_index + sectionOptionLength)
                inital_index = arrayList.length
                for (let i = 0; i < sectionOptionLength; i++) {
                  this.selectedNode[parseInt(arrayIndex) - 1].push(arrayList[i])
                }
              } else {
                this.selectedNode = [[], [], []]
              }

            }
          }
          if (data.nodeDetails.length > 0) {
            for (const option in data.answerOptions) {
              if (option == "errorSection") {
                this.selectedNode.push([])
                this.selectedNode[this.selectedNode.length - 1].push(data.nodeDetails[data.nodeDetails.length - 1])
              }
              // if(option == "retrySection"){
              //   this.selectedNode.push([])
              //   this.selectedNode[this.selectedNode.length-1].push(data.nodeDetails[data.nodeDetails.length-1])
              // }

            }
          }
          this.answerArrayLength = this.botask.answerOptions.length;
        } catch (err) { }
      } else {
      }
    });
    this.PropertyService.dynamicIdWpBotAsk.subscribe((id) => {    //! getting nodeId from service
      this.nodeId = id;
    });
    this.service.passUniqueName.subscribe((data: any) => {
      this.botask.uniqueName = data.uniqueName
      this.nodeId = data.id
    })
  }

  ngOnInit() {
    // if(this.botask.uniqueName=="")
    // this.botask.uniqueName = this.service.generateUniqueName("botask"); //!generating different uniqueNames for objects on initialisation
    this.uniqueNameArray = this.PropertyService.getUniqueName(this.nodeId)
    this.keywordArray = this.PropertyService.getKeyword(this.nodeId)
    this.message = this.botask.message      //! assigning message,captions to corresponding varaibles
    this.imageCaption = this.botask.caption.image;
    this.audioCaption = this.botask.caption.audio;
    this.videoCaption = this.botask.caption.video;
    this.documentCaption = this.botask.caption.document;
    this.timeoutMessage = this.botask.timeoutMessage;
    this.invalidMessage = this.botask.invalidMessage;

    if (this.mulSelectFieldToggle == undefined || this.mulSelectFieldToggle == 5) { //! checking fileUpload flag is needed or Not
      this.fileUploadFlag = true
    }
    if(this.botask.variable == undefined){
      this.variableFlag = false
    }
    this.getValidators = this.botask.validationJson
    this.checkVaraibleLength({keycode: 0,preventDefault():void{}})
    // this.selectFieldToggle = 1
    this.outputNode = this.selectedNode
    this.getTextLength(1)
    this.updateArrayLength()
    // console.log(this.outputNode,"outputNode")
  }
  ngOnChanges() {
    this.getTextLength(0)
  }
  ngAfterViewInit() {
    this.initialCurser.nativeElement.focus()    //! Assigning curser position to uniqueName input field
  }
  ngAfterContentChecked(){
    this.detecterRef.detectChanges()
  }

  select(val: any) {    //! select field toggle function changes models and its value to initial stage
    this.botask.message = ""
    this.sections = [{
      name: "",
      options: [{
        optionName: "",
        description: ""
      }]
    }]
    this.botask.sections = this.sections
    this.answerOptions = [""]
    this.botask.answerOptions = [""]
    this.fileUploadFlag = true
    this.outputNode = [[], [], []];
    this.PropertyService.clearTextbox.next();
    this.textLength = false;
    this.updateArrayLength();
    this.getValidators = undefined;
    this.botask.expectedInput = 5
    if (val.target.value == 1) {
      this.elementLength = 20
      this.optionName = "Answer key"
      this.mulSelectFieldToggle = 5
      this.botask.multimediaFieldValue = 5
      this.content = "Content"
      this.tempModel = "botask.message"
      this.modelToPass = this.botask.message
      this.maxLength = 100;
      this.contentLength = 4000;
    } else if (val.target.value == 2) {
      this.elementLength = 3
      this.optionName = "Button"
      this.botask.multimediaFieldValue = -1
      this.mulSelectFieldToggle = -1
      this.content = "Body"
      this.tempModel = "botask.message"
      this.modelToPass = this.botask.message
      this.maxLength = 20;
      this.contentLength = 1024;
    } else if (val.target.value == 3) {
      this.botask.listButtonName = ""
      this.elementLength = 10
      this.optionName = "List Item"
      this.botask.multimediaFieldValue = -1
      this.mulSelectFieldToggle = -1
      this.content = "Body"
      this.tempModel = "botask.message"
      this.modelToPass = this.botask.message
      this.maxLength = 24;
      this.contentLength = 1024;
    } else if (val.target.value == 4) {
      this.elementLength = 1
      this.optionName = "Anser Key"
      this.mulSelectFieldToggle = 5
      this.botask.multimediaFieldValue = 5
      this.content = "Content"
      this.tempModel = "botask.message"
      this.modelToPass = this.botask.message
      this.maxLength = 100;
      this.contentLength = 4000;
    }
    this.selectFieldToggle = val.target.value;  //! storing current value of selectField (ListItem/Button/Answerkey)
    this.updateArrayLength();
  }

  multimediaSelect(val: any) {    //! multimedia selection function for  multimedia imaged (image,audio,video)
    this.botask.fileName.image = "Choose Image";
    this.botask.fileName.audio = "Choose Audio";
    this.botask.fileName.video = "Choose Video";
    this.botask.fileName.document = "Choose Document";
    this.botask.caption.image = "";
    this.botask.caption.audio = "";
    this.botask.caption.video = "";
    this.botask.caption.document = "";
    this.mediaUrlFlag = false;
    this.botask.expectedInput = 5
    if (val.target.value == 1) {   //! changing other field values to default
      if (this.selectFieldToggle == 2 || this.selectFieldToggle == 3) {
        this.content = "Body ";
        this.contentLength = 1024;
      } else {
        this.content = "Image Caption";
        this.contentLength = 1024;
      }
      this.tempModel = "botask.caption.image";
      this.modelToPass = this.botask.caption.image;
      this.fileUploadFlag = false;
      this.textLength = false;

      this.PropertyService.clearTextbox.next();
    } else if (val.target.value == 2) {   //! changing other field values to default
      if (this.selectFieldToggle == 2 || this.selectFieldToggle == 3) {
        this.content = "Body ";
        this.contentLength = 1024;
      } else {
        this.content = "Audio Caption";
        this.contentLength = 1024;
      }
      this.tempModel = "botask.caption.audio";
      this.modelToPass = this.botask.caption.audio;
      this.fileUploadFlag = false;
      this.textLength = false;
      this.PropertyService.clearTextbox.next();
    } else if (val.target.value == 3) {   //! changing other field values to default
      if (this.selectFieldToggle == 2 || this.selectFieldToggle == 3) {
        this.content = "Body ";
        this.contentLength = 1024;
      } else {
        this.content = "Video Caption";
        this.contentLength = 1024;
      }
      this.tempModel = "botask.caption.video"
      this.modelToPass = this.botask.caption.video
      this.fileUploadFlag = false;
      this.textLength = false;
      this.PropertyService.clearTextbox.next();
    } else if (val.target.value == 4) {   //! changing other field values to default
      if (this.selectFieldToggle == 2 || this.selectFieldToggle == 3) {
        this.content = "Body ";
        this.contentLength = 1024;
      } else {
        this.content = "Document Caption";
        this.contentLength = 1024;
      }
      this.tempModel = "botask.caption.document"
      this.modelToPass = this.botask.caption.document
      this.fileUploadFlag = false;
      this.textLength = false;
      this.PropertyService.clearTextbox.next();
    }
    else if (val.target.value == -1) {   //! changing other field values to default
      this.content = "Body"    //! setting model to default to message field
      this.tempModel = "botask.message"
      this.modelToPass = this.botask.message
      this.fileUploadFlag = true;
      this.contentLength = 1024;
      if(this.selectFieldToggle == 2){
        this.maxLength = 20;
      }else if(this.selectFieldToggle == 3){
        this.maxLength = 24;
      }
      this.PropertyService.clearTextbox.next();
    }
    else {
      //! setting model to default to message field
      if (this.selectFieldToggle == 2 || this.selectFieldToggle == 3) {
        this.content = "Body ";
        this.contentLength = 1024;
      } else {
        this.content = "Content";
        this.contentLength = 4000;
      }
      if(this.selectFieldToggle == 2){
        this.maxLength = 20;
      }else if(this.selectFieldToggle == 3){
        this.maxLength = 24;
      }
      this.tempModel = "botask.message"
      this.modelToPass = this.botask.message
      this.fileUploadFlag = true;
      this.PropertyService.clearTextbox.next();
    }
    if (this.mediaUrlFlag == true) {
      this.fileUploadFlag = true;
    }
    this.mulSelectFieldToggle = val.target.value
  }

  getMediaPath(val: any) {      //! setting media-id if size is less than limit
    if (val.target.files && val.target.files[0]) {
      if (this.mulSelectFieldToggle == 1) {    //! checking the uploaded media has size less than limit
        if (val.target.files[0].size > 5000000) {
          this.sizeLimit = true
          this.botask.fileName.image = "Choose Image"
        } else {
          var extensionArray = val.target.files[0].name.split(".")
          var extension = extensionArray[extensionArray.length - 1];
          if (
            extension.toLowerCase() == "png" ||
            extension.toLowerCase() == "jpg" ||
            extension.toLowerCase() == "jpeg"
          ) {
            this.sizeLimit = false;
            this.gifWarning = false;
          } else {
            this.gifWarning = true;
            this.sizeLimit = true;
            this.botask.fileName.image = "Choose Image";
          }
        }
      } else if (this.mulSelectFieldToggle == 2) {
        if (val.target.files[0].size > 5000000) {
          this.sizeLimit = true
          this.botask.fileName.audio = "Choose Audio"
        } else {
          this.sizeLimit = false;
        }
      } else if (this.mulSelectFieldToggle == 3) {
        if (val.target.files[0].size > 16000000) {
          this.sizeLimit = true
          this.botask.fileName.video = "Choose Video"
        } else {
          var extensionArray = val.target.files[0].name.split(".")
          var extension = extensionArray[extensionArray.length - 1];
          if (
            extension.toLowerCase() == "3gp" ||
            extension.toLowerCase() == "mp4"
          ) {
            this.sizeLimit = false;
            this.gifWarning = false;
          } else {
            this.gifWarning = true;
            this.sizeLimit = true;
            this.botask.fileName.image = "Choose Video";
          }
        }
      } else if (this.mulSelectFieldToggle == 4) {
        if (val.target.files[0].size > 100000000) {
          this.sizeLimit = true
          this.botask.fileName.document = "Choose Document"
        } else {
          this.sizeLimit = false
        }
      }
      if (this.sizeLimit == false) {   //!if the uploaded media has less size than limit file is sent to backend and getbacks the mediaId
        var reader = new FileReader();
        this.loader.useRef().start();
        reader.readAsArrayBuffer(val.target.files[0]);
        reader.onload = (event: ProgressEvent) => {
          // this.filePath = (<FileReader>event.target).result;
          this.filePath = (val.target).files[0]
          // var newFilePath = val.target.files[0]
          return new Promise((resolve, reject) => {
            this.service.uploadMedia((val.target).files[0]).subscribe(resp => {
              // this.loader.useRef().complete();
              //  this.mediaId = JSON.parse(JSON.stringify(resp));
              //  resolve( this.mediaId);     //!storing mediaID
              resolve(JSON.parse(JSON.stringify(resp)).url)
              this.loader.useRef().complete();
            }, error => {
              this.loader.useRef().complete();
              //  console.log(error)
            });
          }).then((obj) => {
            this.mediaId = obj;          //! setting mediaUpload flags true/false based on the upload success/failure
            if (this.mediaId) {
              this.fileUploadFlag = true
            } else {
              this.fileUploadFlag = false
            }
          })
        }
        // reader.readAsBinaryString(val.target.files[0]);
        if (this.mulSelectFieldToggle == 1) {    //!assigning media fileName to corresponding variable
          this.fileName = val.target.files[0].name
          this.botask.fileName.image = this.fileName
          this.extensionType = this.fileName.split(".")[1]
        } else if (this.mulSelectFieldToggle == 2) {
          this.fileName = val.target.files[0].name
          this.botask.fileName.audio = this.fileName
          this.extensionType = this.fileName.split(".")[1]
        } else if (this.mulSelectFieldToggle == 3) {
          this.fileName = val.target.files[0].name
          this.botask.fileName.video = this.fileName
          this.extensionType = this.fileName.split(".")[1]
        } else if (this.mulSelectFieldToggle == 4) {
          this.fileName = val.target.files[0].name
          this.botask.fileName.document = this.fileName
          this.extensionType = this.fileName.split(".")[1]
        }
      }
    }
  }

  addOption(secNum) {                         //! adding new AnswerOptions
    if (this.answerArrayLength < this.elementLength) {
      this.answerOptions.push("");
      this.sections[secNum].options.push({
        optionName: "",
        description: ""
      })
      this.outputNode[secNum].push("")
      this.updateArrayLength();
    } else {
      this.toastr.error(`${this.optionName} limit reached`)
    }
  }

  deleteOption(index, secNum) {                 //! deleting answerOptions
    // this.botask.answerOptions.splice(index, 1);
    this.sections[secNum].options.splice(index, 1)
    this.answerOptions.pop();
    this.updateArrayLength();
    this.outputNode[secNum].splice(index, 1)
    this.checkNullOption();
  }

  addSection() {
    if (this.answerArrayLength < 10) {
      this.sections.push({
        name: "",
        options: [{
          optionName: "",
          description: ""
        }]
      });
      this.answerOptions.push("")
      this.updateArrayLength();

      this.outputNode.splice(this.outputNode.length - 1, 0, [])
    } else {
      this.toastr.error(`limit reached`)
    }
  }
  deleteSection(secNum) {
    var secLength = this.sections[secNum]["options"].length
    this.sections.splice(secNum, 1)
    this.outputNode.splice(secNum, 1)
    for (let i = 0; i < secLength; i++) {
      this.answerOptions.pop()
    }
    this.updateArrayLength();
    this.checkNullOption();
  }

  updateArrayLength() {                 //!increasing or decreasing array length as deletion /addition of new answer Options
    this.answerArrayLength = this.answerOptions.length;
  }
  createArray(length) {
    return new Array(length);
  }
  getMessage(message, model) {    //! storing corresponding messages emitted from the textareaComponent
    if (model == 'botask.message') {
      this.message = message
    } else if (model == 'botask.caption.image') {
      this.imageCaption = message;
    } else if (model == 'botask.caption.audio') {
      this.audioCaption = message;
    } else if (model == 'botask.caption.video') {
      this.videoCaption = message;
    } else if (model == 'botask.caption.document') {
      this.documentCaption = message;
    } else if (model == 'botask.timeoutMessage') {
      this.timeoutMessage = message;
    } else if (model == 'botask.invalidMessage') {
      this.invalidMessage = message
    }
    // else if(model == 'botask.header'){
    // this.header = message
    // }
    // else if(model == 'botask.retryMessage'){
    //   this.retryMessage = message
    // }
  }
  preventPaste(ev){
    ev.preventDefault()
  }
  checkLengthFn(string) {
    if (string.replace(/&nbsp;/g, "").replace(/<br>/g, "").trim().length != 0) {
      this.textLength = true
    } else {
      this.textLength = false
    }
  }

  getTextLength(length) {       //! function used to store the length that emitted from the textareaComponent
    if (this.mulSelectFieldToggle == 5 || this.mulSelectFieldToggle == -1) {
      if (this.message.replace(/&nbsp;/g, "").replace(/<br>/g, "").trim().length != 0) {
        this.textLength = true
      } else {
        this.textLength = false
      }
    } else if (this.mulSelectFieldToggle == 1) {
      this.checkLengthFn(this.imageCaption)
    } else if (this.mulSelectFieldToggle == 3) {
      this.checkLengthFn(this.videoCaption)
    } else if (this.mulSelectFieldToggle == 4) {
      this.checkLengthFn(this.documentCaption)
    }
    // else{
    //   this.textLength = true
    // }
  }
  callValidator() {            //! used to call variable validator component
    this.PropertyService.dynamicValidation.next(this.botask.validationJson);
  }
  clearForm() {                //! used to clear form
    this.PropertyService.clearTextbox.next();
    this.selectFieldToggle = "default"
  }
  childValue(value, sectionNum, index) {    //!getting outputNode id from nextObject Component
    this.outputNode[sectionNum][index] = value;

  }

  input(i, name) {            //! used to pass the variable property to variable popUp component
    this.index = i;
    this.type = name;
    this.style = "block";
    this.PropertyService.dynamicVariable.next(this.style);
  }
  childToParent(name) {      //! gets back the value of variable from variable popUp component
    if (this.type == "variable") {
      // this.botask.variableOptions[this.index].variable = name;
      this.botask.variable = name
      this.checkVaraibleLength({keycode: 0,preventDefault():void{}})
    }
  }
  checkingNumber(event) {    //!used to check whether the typed value is number/not
    if (event.keyCode >= 48 &&
      event.keyCode <= 57 ||
      event.keyCode >= 96 &&
      event.keyCode <= 105 ||
      event.keyCode == 8 ||
      event.keyCode == 46) { }
    else {
      event.preventDefault()
    }
  }
  bindValidation(event: any) {
    // console.log(event,"Event")
    if(event.typeId == 3){
      if(event.dateTime.fromDate == 'Invalid Date' || event.dateTime.fromDate == 'Invalid date' ){
        event.dateTime.fromDate = ''
      }
      if(event.dateTime.toDate == 'Invalid Date' || event.dateTime.toDate == 'Invalid date' ){
        event.dateTime.toDate = ''
      }
    }
    this.getValidators = event
    this.botask.validationJson = this.getValidators
    // console.log(this.getValidators)
  }
  switchMediaUrlFlag() {
    if (this.mediaUrlFlag == false) {
      this.mediaUrlFlag = true;
      this.fileUploadFlag = true;
      // this.sizeLimit = false;
      this.textLength = true;
      this.getTextLength(1)
    } else {
      this.mediaUrlFlag = false;
      if(this.filePath!=null && this.filePath!=undefined && this.filePath!= ""){
        this.fileUploadFlag = true;
      }else{
        this.fileUploadFlag = false;
      }
      // this.sizeLimit = true;
      this.textLength = true;
      this.getTextLength(1)
    }
  }
  setPreviewUrl() {
    this.previewUrlFlag = !this.previewUrlFlag
  }
  checkUniqueName(name) {
    //!To be implemented
    if (this.uniqueNameArray.includes(name.toLowerCase().trim())) {
      this.duplicateUniquecheckFlag = true;
    } else {
      this.duplicateUniquecheckFlag = false;
    }
  }
  checkVaraibleLength(event){
    // if(event.code != "Backspace" && event.code != "Delete"){
      event.preventDefault();
    // }
    if(this.botask.variable!=undefined){
      if(this.botask.variable.trim().length == 0){
        this.variableFlag = true;
      }else{
        this.variableFlag = false;
      }
    }
  }
  checkNullOption(){
    for (let i = 0; i < this.sections.length; i++) {
      for (let j = 0; j < this.sections[i].options.length; j++) {
        let option = this.sections[i].options[j].optionName
        // console.log(option.trim().length,"option length")
        if(option.trim().length == 0){
          this.nullOptionFLag = true;
          break;
        }else{
          this.nullOptionFLag = false;
        }
      }
    }
  }
  checkNullSectionName(){
    for (let i = 0; i < this.sections.length; i++) {
      // console.log(this.sections[i],"section length")
      // for (let j = 0; j < this.sections[i].options.length; j++) {
        let sectionName = this.sections[i].name
        // console.log(option.trim().length,"option length")
        if(sectionName.trim().length == 0){
          this.nullSectionFlag = true;
          break;
        }else{
          this.nullSectionFlag = false;
        }
      // }
    }
  }
  checkKeyword(name) {
    // console.log(name, "Keyword")
    //!To be implemented
    if (this.keywordArray.includes(name.toLowerCase().trim())) {
      this.duplicatekeywordcheckFlag = true;
    } else {
      this.duplicatekeywordcheckFlag = false;
    }
  }
  replaceFunction(message){
    return message
    .replace(/<b>[<br>]*<\/b>/g,"\n")
    .replace(/[a-z0-9]<div><br><\/div><div>/,"<br><br>")
    .replace(/<div><br><\/div><div>/g,"<br>")
    .replace(/<div><br><div>/g,"<br><br>")
    .replace(/<div><br><\/div>/g,"<br>")
    .replace(/<\/?span[^>]*>/g,"")
    .replace(/<div>/g, "<br>")
    .replace(/<\/div>/g, "")
    .replace(/&nbsp;/g," ")
    .replace(/<b>\s+/g, " <b>").replace(/\s+<\/b>/g,"</b> ")
    .replace(/<i>\s+/g, " <i>").replace(/\s+<\/i>/g,"</i> ")
    .replace(/<strike>\s+/g, " <strike>").replace(/\s+<\/strike>/g,"</strike> ")
    .replace(/\n/g, "<br>")
    .replace(/&amp;/g,"&")
    .replace(/\\"/g,'"')
    .replace(/"/g, '\\"')
    .replace(/\n/g, "<br>");
  }
  expectedInputFn(event:any){
    // console.log(event)
    this.expectedInput = event.target.value
    this.botask.expectedInput = event.target.value
  }
  onSubmit(form: NgForm) {
    // console.log(this.outputNode, "outputNode")
    // console.log(this.selectedNode, "SelectedNode")
    var dupliacteCheckArray = [];
    for (let i = 0; i < this.sections.length; i++) {
      for (let j = 0; j < this.sections[i].options.length; j++) {
        if ((form.value[`answer${j}_of_section${i}`] == undefined || form.value[`answer${j}_of_section${i}`] == "") && form.value.selectFieldValue != 4) { continue; }
        else {
          if (form.value.selectFieldValue == 4) {
            var optName: any = "Exit Node"
          } else {
            var optName: any = form.value[`answer${j}_of_section${i}`]
          }
          dupliacteCheckArray.push(optName.trim())
        }
      }
    }
    if (new Set(dupliacteCheckArray).size !== dupliacteCheckArray.length) {
      this.toastr.error("Duplicate option name", "Error")
      return
    } else {
      this.service.changeFlag.next("add")
      this.connectionIdArray = []
      var template = document.getElementsByClassName("selected");
      // var templateId = template[0].id.split("-")[1];    //! getting nodeId from template
      var templateId = this.nodeId;    //! getting nodeId from template
      var optionsObject = {};
      var options = {}
      // var nextObject = {};

      var iter = 1
      for (let i = 0; i < this.sections.length; i++) {
        for (let j = 0; j < this.sections[i].options.length; j++) {
          if ((form.value[`answer${j}_of_section${i}`] == undefined || form.value[`answer${j}_of_section${i}`] == "") && form.value.selectFieldValue != 4) { continue; }
          else {
            var description;
            if (form.value[`description${j}_of_section${i}`] == undefined) {
              description = "";
            } else {
              description = form.value[`description${j}_of_section${i}`];
            }
            if (form.value.selectFieldValue == 4) {
              var optName: any = "Exit Node"
            } else {
              var optName: any = form.value[`answer${j}_of_section${i}`]
            }
            options[`output_${iter}`] = {
              optionName: optName,
              description: description
              // next_node:""
            }
          }
          iter++
        }
        optionsObject[`section_${i + 1}`] = {
          sectionName: form.value[`section${i}`],
          options: options
        }
        options = {}
      }
      // if(Object.keys(optionsObject).length == this.answerOptions.length){
      //   optionsObject[`output_${this.answerOptions.length + 1}`] = {
      //     optionName : this.botask.invalidresponseKey,
      //     description : "",
      //     type : "error"
      //   }
      // }

      if (iter - 1 == this.answerOptions.length) {
        // var options={};
        options[`output_${iter}`] = {
          optionName: this.botask.invalidresponseKey,
          description: ""
          // next_node:""
        }
        optionsObject[`errorSection`] = {
          sectionName: "ErrorType",
          options: options
        }
        // options={}
        // options[`output_${iter+1}`]={
        //   optionName : "Limit Exceed",
        //   description:""
        // }
        // optionsObject[`retrySection`]={
        //   sectionName:"retry",
        //   options:options
        //   }
      }
      for (let i = 0; i <= iter; i++) {
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
      // console.log("########",this.connections,this.connectionIdArray ,"########")

      // if(this.botask.invalidresponseKey == ""){
      //   delete optionsObject[`output_${this.answerOptions.length + 1}`]
      // }
      if (this.mulSelectFieldToggle == 1) {
        this.caption = this.imageCaption
        if (this.mediaUrlFlag == true) {
          this.mediaId = this.botask.mediaUrl.image;
        }
      } else if (this.mulSelectFieldToggle == 2) {
        this.caption = this.audioCaption
        if (this.mediaUrlFlag == true) {
          this.mediaId = this.botask.mediaUrl.audio;
        }
      } else if (this.mulSelectFieldToggle == 3) {
        this.caption = this.videoCaption
        if (this.mediaUrlFlag == true) {
          this.mediaId = this.botask.mediaUrl.video;
        }
      } else if (this.mulSelectFieldToggle == 4) {
        this.caption = this.documentCaption
        if (this.botask.documentFileName != "" && this.botask.documentFileName != undefined) {
          this.fileName = this.botask.documentFileName
        }
        if (this.mediaUrlFlag == true) {
          this.mediaId = this.botask.mediaUrl.document;
        }
      }

      if (this.previewUrlFlag == true) {
        const urlEx = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?")
        if (urlEx.test(this.message)) {
          var urlArray = this.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
          if (urlArray != null) {
            return new Promise((resolve, reject) => {
              this.Service.checkUrl(urlArray[0]).subscribe(resp => {
                resolve(resp);
              }, error => {
              });
            }).then((flag: any) => {
              this.previewUrlFlag = flag.staus
              // this.previewUrlFlagDB = flag.status
              // if(flag.status == "1"){
              //   this.previewUrlFlag = true;
              // }else{
              //   this.previewUrlFlag = false;
              // }
              this.afterOnSubmit(templateId, form, template, optionsObject)
            })
          } else {
            this.previewUrlFlag = false;
            this.afterOnSubmit(templateId, form, template, optionsObject)
          }
        } else {
          // this.previewUrlFlagDB="0"
          this.previewUrlFlag = false;
          this.afterOnSubmit(templateId, form, template, optionsObject)
        }
      }
      else {
        this.afterOnSubmit(templateId, form, template, optionsObject)
      }
    }
  }
  afterOnSubmit(templateId, form, template, optionsObject) {
    var newFileValue;
    if (form.value.multimediaFieldValue != 5) {
      if (this.mediaUrlFlag == true) {
        newFileValue = this.mediaId
      } else {
        // if(this.mediaId.Id == undefined){
        if (this.mediaId == undefined) {
          newFileValue = this.filePath
        } else {
          // newFileValue = `https://prutech.org/ACP/api/media/getMedia?id=${this.mediaId.Id}.${this.extensionType}`
          // newFileValue = `https://192.9.200.70/ACP/api/media/getMedia?id=${this.mediaId.Id}.${this.extensionType}`
          newFileValue = this.mediaId
        }
      }
    }
    // if(this.message || this.caption ){
      if(this.message!=undefined && this.message!=""){
        this.message = this.replaceFunction(this.message);
      }
      if(this.caption!=undefined && this.caption!=""){
        this.caption = this.replaceFunction(this.caption);
      }
      if(this.timeoutMessage!=undefined && this.timeoutMessage!=""){
        this.timeoutMessage = this.replaceFunction(this.timeoutMessage);
      }
      if(this.invalidMessage!=undefined && this.invalidMessage!=""){
        this.invalidMessage = this.replaceFunction(this.invalidMessage);
      }
    // }

    var elementObj = {     //! data for saving to DB
      nodeDetails: this.outputNode,
      id: templateId,
      num: this.answerOptions.length + 1,
      uniqueName: form.value.uniqueName,
      message: this.message,
      button: this.botask.listButtonName,
      answerOptions: optionsObject,
      keyword: form.value.keyword,
      valSelectField: form.value.selectFieldValue,
      valMultimediaSelect: form.value.multimediaFieldValue,
      // nextObject : this.nextObject,
      fileValue: newFileValue,
      caption: this.caption,
      fileName: this.fileName,
      extensionType: this.extensionType,
      timeout: form.value.timeout,
      timeoutMessage: this.timeoutMessage,
      variable: this.botask.variable,
      invalidMessage: this.invalidMessage,
      invalidresponseKey: this.botask.invalidresponseKey,
      footer: this.botask.footer,
      header: this.botask.header,
      validationJSON: this.getValidators,
      retryCount: this.botask.retryCount,
      mediaUrlFlag: this.mediaUrlFlag,
      urlcheck: this.previewUrlFlag,
      objectWait :this.botask.waitTime,
      exp_inp:this.expectedInput
    };
    // for(const element in elementObj){
    //   if(elementObj[element] == undefined){
    //     elementObj[element] = ""
    //   }
    // }

    // console.log(this.outputNode,"outputNode")
    // console.log(this.connectionIdArray,"connectionId")
    // console.log(this.connections,"ConnecntionObject")
    // console.log(this.answerOptions.length,"answerOption Length",iter,"iterationNumber")
    // console.log(elementObj)
    this.service.addNodeToComponent.next(elementObj);             //!adding no:of outputnodes to the node in drawflow
    setTimeout(() => {
      this.PropertyService.addAskComponentDiv(elementObj);        //!adding node content to drawflow
      this.PropertyService.addDataToJson(templateId, elementObj); //! adding data to JSON for rebinding and DB
      var templateInnerHtml = template[0].children[1].innerHTML;

      var nodeContent = {
        id: templateId,
        html: templateInnerHtml
      }
      this.service.nodeContent.next(nodeContent)            //! saving HTML of the node to Drawflow for copying the node
      this.service.deleteConnection.next(templateId);       //! deleting if existing connection presents to keep only one connection in outputnode
      for (let i = 0; i <= this.answerOptions.length + 1; i++) { //! creating connection from saysObject to another saved Object loop used for more number of outputnodes
        var connection = {
          outputId: templateId,
          inputId: this.connectionIdArray[i],
          outputNode: this.connections[i].outputNodeName,
          inputNode: "input_1",
        };
        this.service.addConnection.next(connection);
      }
      this.PropertyService.addVariableToJSON(templateId, this.botask.variable)         //!saving variable to variableArray
      this.PropertyService.addKeywordToJSON(templateId, elementObj)  //!saving keyword to keywordJSON
      this.PropertyService.addUniqueJSON(templateId, elementObj);           //! adding uniqueName to uniqueJSON for nextObejct property
      this.service.newReq.next(this.nodeId);                                //! getting uniqueNames from JSON for nextObject dropdown
      this.toastr.success("Object Saved","Success");
    });
  }
  ngOnDestroy() {
    this.service.changeFlag.next("destroy")
  }
}
