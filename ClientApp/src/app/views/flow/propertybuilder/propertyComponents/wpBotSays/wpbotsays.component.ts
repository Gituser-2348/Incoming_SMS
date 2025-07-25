import { ChangeDetectorRef, Component, ElementRef, ViewChild } from "@angular/core";
import { FlowbuilderService } from "../../../flowbuilder.service";
import { NgForm } from "@angular/forms";
import { wpBotSays } from "../../../models/whatsappmodel";
import { PropertyBindingService } from "../../propertyBinding.service";
import { wpbotsaysService } from "../../wpbotsays.service";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "wpbot-says-component",
  templateUrl: "./wpbotsays.component.html",
  styleUrls: ["./wpbotsays.component.css"],
})
export class WpbotsaysComponent {
  @ViewChild("initialCurser") initialCurser: ElementRef; //! getting elementRefernce for initial curser position

  botsays: wpBotSays = <wpBotSays>{
    //! initialising botsaysModel
    uniqueName: "",
    keyword: "",
    message: "",
    multimediaFieldValue: 5, //*set as 5 for selecting textarea for message as default
    fileName: {
      image: "Choose Image",
      audio: "Choose Audio",
      video: "Choose Video",
      document: "Choose Document",
      sticker: "Choose Sticker",
    },
    mediaUrl: {
      image: "",
      audio: "",
      video: "",
      document: "",
      sticker: "",
    },
    caption: {
      image: "",
      audio: "",
      video: "",
      document: "",
    },
    url: [
      {
        url: "",
        type: "",
      },
    ],
    email: [
      {
        email: "",
        type: "",
      },
    ],
    contact: {
      name: {
        firstName: "",
        formatedName: "",
        middleName: "",
        prefix: "",
        suffix: "",
        lastName: "",
      },
      org: {
        company: "",
        department: "",
        orgTitle: "",
      },
    },
    address: [{}],
    phones: [
      {
        phone: "",
        phoneType: "",
        Wa_id: "",
      },
    ],
    // mediaUrl:"",
    location: {
      latitude: "",
      longitude: "",
      name: "",
      address: "",
    },
    waitTime: 0,
  };
  url: any;
  email: any;
  phones: any;
  address: any;
  selectedNode: any = [[]]; //! for selecting output node connction
  nodeId: any; //! id of currentObject
  selectFieldToggle: any; //! for storing selectfield value (message /Multimedia) prevDesign
  mulSelectFieldToggle: any = 5; //! for stoting multselectFieldValue (image/audio/video/document)
  filePath: any; //! for storing uploaded media file used for converting to {mediaid}
  fileName: any; //! file name
  caption: any; //! variable for storing caption
  extensionType: any; //! extension type of document file (.pdf,.xls,.xlsx)
  sizeLimit: boolean = false; //! flag for checking media size <5MB,<16MB etc
  textLength: boolean = false; //! flag used for checking message textarea field is empty or not as it is a seperate component
  fileUploadFlag: boolean = false; //! flag for checking whether the media is uploaded or not
  message: string; //! used for storing message content in the textareaField
  imageCaption: string; //! used for storing caption content in the textareaField of image
  audioCaption: string; //! used for storing caption content in the textareaField of audio
  videoCaption: string; //! used for storing caption content in the textareaField of video
  documentCaption: string; //! used for storing caption content in the textareaField of document
  previewUrlFlag: boolean = false; //! used for previewUrl check/uncheck
  previewUrlFlagDB: any;
  outputNode: any = []; //! for storing outputnode id(name)
  mediaId: any; //!variable used for storing mediaid getting from backend
  nextObject: any; //! variable for storing details of nextObject
  content: string = "Content"; //! initial Type/Head for textArea
  tempModel: string = "botsays.message"; //! model-name used for validating the emitted value of current model or not
  modelToPass = this.botsays.message; //! model used to pass to the textareaComponent
  contact: any;
  location: any;
  mediaUrlFlag: any = false;
  uniqueNameArray: any = [];
  keywordArray: any = [];
  duplicateUniquecheckFlag: boolean = false;
  duplicatekeywordcheckFlag: boolean = false;
  gifWarning: any = false;
  mediaErrorFlag: any = false;
  disabledForView: boolean = false;
  maxLength: any = 4000;
  dimensionFlag: boolean = false;
  constructor(
    private flowService: FlowbuilderService,
    private propertyService: PropertyBindingService,
    private Service: wpbotsaysService,
    public loader: LoadingBarService,
    private toaster: ToastrService,
    private detecterRef: ChangeDetectorRef
  ) {
    // console.log("constructr loaded form bot says")
    this.propertyService.dynamicIdWpBotSays.subscribe((id) => {
      //!getting Nodeid from the service
      this.nodeId = id;
    });

    this.propertyService.disableSubmit.subscribe((data) => {
      this.disabledForView = true;
    });

    this.propertyService.fetchDataSubscription.subscribe((val) => {
      //! rebinding data of component to the propertyWindow if already saved
      var data = JSON.parse(JSON.stringify(val));
      if (data != undefined) {
        // console.log(data)
        try {
          // this.selectedNode=data.nodeDetails;
          this.botsays.uniqueName = data.uniqueName;
          this.botsays.keyword = data.keyword;
          this.botsays.message = data.message;
          this.selectFieldToggle = data.valSelectField;
          this.botsays.selectFieldvalue = data.valSelectField;
          this.mulSelectFieldToggle = data.valMultimediaSelect;
          this.botsays.multimediaFieldValue = data.valMultimediaSelect;
          this.botsays.waitTime = data.objectWait;
          this.mediaId = data.fileValue;
          this.textLength = true;
          this.fileUploadFlag = true;
          this.mediaUrlFlag = data.mediaUrlFlag;
          // this.previewUrlFlagDB = data.urlCheck;
          // if(data.urlCheck == "1"){
          //   this.previewUrlFlag = true;
          // }else{
          //   this.previewUrlFlag = false;
          // }
          this.previewUrlFlag = data.urlCheck;
          // if(data.keyword){
          //   this.keywordFlag = true;
          // }
          this.modelToPass = this.botsays.message;
          this.content = "Content";
          this.tempModel = "botsays.message";
          this.maxLength = 4000;
          if (data.valMultimediaSelect == 1) {
            //!assining caption,filepath,fileName curresponding to previous save
            this.botsays.caption.image = data.caption;
            this.botsays.fileName.image = data.fileName;
            this.fileName = data.fileName;
            this.filePath = data.fileValue;
            this.modelToPass = this.botsays.caption.image; //!re-assigning model to textarea field
            this.content = "Image Caption";
            this.tempModel = "botsays.caption.image";
            this.extensionType = data.extensionType;
            this.maxLength = 1024;
            if (data.mediaUrlFlag == true) {
              this.botsays.mediaUrl.image = data.fileValue;
            }
          } else if (data.valMultimediaSelect == 2) {
            //!assining caption,filepath,fileName curresponding to previous save
            this.botsays.caption.audio = data.caption;
            this.botsays.fileName.audio = data.fileName;
            this.filePath = data.fileValue;
            this.fileName = data.fileName;
            this.modelToPass = this.botsays.caption.audio;
            this.content = "Audio Caption";
            this.tempModel = "botsays.caption.audio";
            this.extensionType = data.extensionType;
            this.maxLength = 1024;
            if (data.mediaUrlFlag == true) {
              this.botsays.mediaUrl.audio = data.fileValue;
            }
          } else if (data.valMultimediaSelect == 3) {
            //!assining caption,filepath,fileName curresponding to previous save
            // console.log(data)
            this.botsays.caption.video = data.caption;
            this.botsays.fileName.video = data.fileName;
            this.filePath = data.fileValue;
            this.fileName = data.fileName;
            this.modelToPass = this.botsays.caption.video;
            this.content = "Video Caption";
            this.tempModel = "botsays.caption.video";
            this.extensionType = data.extensionType;
            this.maxLength = 1024;
            if (data.mediaUrlFlag == true) {
              this.botsays.mediaUrl.video = data.fileValue;
            }
          } else if (data.valMultimediaSelect == 4) {
            //!assining caption,filepath,fileName curresponding to previous save
            this.botsays.caption.document = data.caption;
            this.botsays.fileName.document = data.fileName;
            this.botsays.documentFileName = data.fileName;
            this.filePath = data.fileValue;
            this.fileName = data.fileName;
            this.extensionType = data.extensionType;
            this.modelToPass = this.botsays.caption.document;
            this.content = "Document Caption";
            this.tempModel = "botsays.caption.document";
            this.maxLength = 1024;
            if (data.mediaUrlFlag == true) {
              this.botsays.mediaUrl.document = data.fileValue;
            }
          } else if (data.valMultimediaSelect == 6) {
            this.botsays.phones = data.phones;
            this.botsays.address = data.address;
            this.botsays.email = data.contact.email;
            this.botsays.url = data.contact.url;
            // this.botsays.contact.city=data.contact.city
            // this.botsays.contact.country=data.contact.country
            // this.botsays.contact.countryCode=data.contact.countryCode
            // this.botsays.contact.street=data.contact.street
            // this.botsays.contact.addressType=data.contact.addressType
            // this.botsays.contact.zip=data.contact.zip
            this.botsays.contact.birthday = data.contact.birthday;
            this.botsays.contact.name.firstName = data.contact.name.firstName;
            this.botsays.contact.name.formatedName =
              data.contact.name.formatedName;
            this.botsays.contact.name.middleName = data.contact.name.meddleName;
            this.botsays.contact.name.prefix = data.contact.name.prefix;
            this.botsays.contact.name.suffix = data.contact.name.suffix;
            this.botsays.contact.name.lastName = data.contact.name.lastName;
            this.botsays.contact.org.company = data.contact.org.company;
            this.botsays.contact.org.department = data.contact.org.department;
            this.botsays.contact.org.orgTitle = data.contact.org.orgTitle;
            // this.botsays.contact.phone=data.contact.phone
            // this.botsays.contact.phoneType=data.contact.phoneType
            // this.botsays.contact.wa_id=data.contact.wa_id
          } else if (data.valMultimediaSelect == 7) {
            // this.botsays.mediaUrl=data.multimedaFieldVal
            this.botsays.fileName.sticker = data.fileName;
            this.filePath = data.fileValue;
            this.fileName = data.fileName;
            this.extensionType = data.extensionType;
            if (data.mediaUrlFlag == true) {
              this.botsays.mediaUrl.sticker = data.fileValue;
            }
          } else if (data.valMultimediaSelect == 8) {
            this.botsays.location.latitude = data.location.latitude;
            this.botsays.location.longitude = data.location.longitude;
            this.botsays.location.name = data.location.name;
            this.botsays.location.address = data.location.address;
          } else {
            //! asigning textarea to default message
            this.content = "Content";
            this.tempModel = "botsays.message";
            this.modelToPass = this.botsays.message;
            this.maxLength = 4000;
          }
          for (let i = 0; i < data.nodeDetails.length; i++) {
            this.selectedNode[0].push(data.nodeDetails[i]);
          }
        } catch (err) { }
      } else {
      }
    });

    this.flowService.passUniqueName.subscribe((data: any) => {
      this.botsays.uniqueName = data.uniqueName;
      this.nodeId = data.id;
    });
  }

  ngOnInit() {
    // console.log(this.nodeId,"Node ID")
    this.uniqueNameArray = this.propertyService.getUniqueName(this.nodeId);
    this.keywordArray = this.propertyService.getKeyword(this.nodeId);
    // console.log(this.uniqueNameArray,this.keywordArray)
    this.message = this.botsays.message; //! assigning message,captions to corresponding varaibles
    this.imageCaption = this.botsays.caption.image;
    this.audioCaption = this.botsays.caption.audio;
    this.videoCaption = this.botsays.caption.video;
    this.documentCaption = this.botsays.caption.document;
    this.dimensionFlag = false;
    if (
      this.mulSelectFieldToggle == undefined ||
      this.mulSelectFieldToggle == 5
    ) {
      //! checking fileUpload flag is needed or Not
      this.fileUploadFlag = true;
    }
    this.getTextLength(1);
  }
  ngAfterViewInit() {
    this.initialCurser.nativeElement.focus(); //! Assigning curser position to uniqueName input field
  }
  ngAfterContentChecked() {
    this.detecterRef.detectChanges()
  }
  addEmail() {
    this.botsays.email.push({
      email: "",
      type: "",
    });
  }
  addUrl() {
    this.botsays.url.push({
      url: "",
      type: "",
    });
  }
  addAddress() {
    this.botsays.address.push({
      city: "",
      countryCode: "",
      country: "",
      street: "",
      type: "",
      zip: "",
    });
  }

  addPhones() {
    this.botsays.phones.push({
      phone: "",
      phoneType: "",
      Wa_id: "",
    });
  }

  select(val: any) {
    //! select field toggle function changes models and its value to initial stage
    if (val.target.value == 1) {
      this.mulSelectFieldToggle = "default";
      this.botsays.multimediaFieldValue = "";
      this.botsays.fileName.image = "Choose Image";
      this.botsays.fileName.audio = "Choose Audio";
      this.botsays.fileName.video = "Choose Video";
      this.botsays.fileName.document = "Choose Document";
      this.botsays.caption.image = "";
      this.botsays.caption.audio = "";
      this.botsays.caption.video = "";
      this.botsays.caption.document = "";
      this.fileUploadFlag = true;
    } else if (val.target.value == 2) {
      this.botsays.message = "";
      this.fileUploadFlag = false;
    }
    this.selectFieldToggle = val.target.value; //! storing current value of selectField (message/multimedia)
  }

  multimediaSelect(val: any) {
    //! multimedia selection function for  multimedia imaged (image,audio,video)
    this.botsays.fileName.image = "Choose Image";
    this.botsays.fileName.audio = "Choose Audio";
    this.botsays.fileName.video = "Choose Video";
    this.botsays.fileName.document = "Choose Document";
    this.botsays.caption.image = "";
    this.botsays.caption.audio = "";
    this.botsays.caption.video = "";
    this.botsays.caption.document = "";
    this.gifWarning = false;
    // this.botsays.contact=[{}]
    this.botsays.location = {
      latitude: "",
      longitude: "",
      name: "",
      address: "",
    };
    this.mediaUrlFlag = false;
    this.dimensionFlag = false;
    if (val.target.value == 1) {
      //! changing other field values to default
      this.content = "Image Caption";
      this.tempModel = "botsays.caption.image";
      this.modelToPass = this.botsays.caption.image;
      this.fileUploadFlag = false;
      this.textLength = true;
      this.maxLength = 1024;
      this.propertyService.clearTextbox.next();
    } else if (val.target.value == 2) {
      //! changing other field values to default
      this.content = "Audio Caption";
      this.tempModel = "botsays.caption.audio";
      this.modelToPass = this.botsays.caption.audio;
      this.fileUploadFlag = false;
      this.textLength = true;
      this.maxLength = 1024;
      this.propertyService.clearTextbox.next();
    } else if (val.target.value == 3) {
      //! changing other field values to default
      this.content = "Video Caption";
      this.tempModel = "botsays.caption.video";
      this.modelToPass = this.botsays.caption.video;
      this.fileUploadFlag = false;
      this.textLength = true;
      this.maxLength = 1024;
      this.propertyService.clearTextbox.next();
    } else if (val.target.value == 4) {
      //! changing other field values to default
      this.content = "Document Caption";
      this.tempModel = "botsays.caption.document";
      this.modelToPass = this.botsays.caption.document;
      this.fileUploadFlag = false;
      this.textLength = true;
      this.maxLength = 1024;
      this.propertyService.clearTextbox.next();
    } else if (val.target.value == 6) {
      this.fileUploadFlag = true;
      this.textLength = true;
    } else if (val.target.value == 7) {
      this.fileUploadFlag = false;
      this.textLength = true;
    } else if (val.target.value == 8) {
      this.fileUploadFlag = true;
      this.textLength = true;
    } else {
      //! setting model to default to message field
      this.content = "Content";
      this.tempModel = "botsays.message";
      this.modelToPass = this.botsays.message;
      this.fileUploadFlag = true;
      this.textLength = false;
      this.maxLength = 4000;
      this.propertyService.clearTextbox.next();
    }
    if (this.mediaUrlFlag == true) {
      this.fileUploadFlag = true;
    }
    this.mulSelectFieldToggle = val.target.value;
  }
  checkExtension() {
    // console.log(this.botsays.mediaUrl.image)
    // console.log(extensionArray,"Array")
    if (this.botsays.multimediaFieldValue == 1) {
      var extensionArray = this.botsays.mediaUrl.image.split(".");
      var extension = extensionArray[extensionArray.length - 1].toLowerCase();
      if (extension == "png" || extension == "jpg" || extension == "jpeg") {
        this.gifWarning = false;
      } else {
        this.gifWarning = true;
      }
    } else if (this.botsays.multimediaFieldValue == 3) {
      var extensionArray = this.botsays.mediaUrl.video.split(".");
      var extension = extensionArray[extensionArray.length - 1].toLowerCase();
      if (extension == "mp4" || extension == "3gp") {
        this.gifWarning = false;
      } else {
        this.gifWarning = true;
      }
    }
  }
  getMediaPath(val: any) {
    //! setting media-id if size is less than limit
    // console.log(val.target.files, "File");
    if (val.target.files && val.target.files[0]) {
      if (this.mulSelectFieldToggle == 1) {
        //! checking the uploaded media has size less than limit
        if (val.target.files[0].size > 5000000) {
          this.sizeLimit = true;
          this.botsays.fileName.image = "Choose Image";
        } else {
          var extensionArray = val.target.files[0].name.split(".");
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
            this.botsays.fileName.image = "Choose Image";
          }
        }
      } else if (this.mulSelectFieldToggle == 2) {
        if (val.target.files[0].size > 16000000) {
          this.sizeLimit = true;
          this.botsays.fileName.audio = "Choose Audio";
        } else {
          var extensionArray = val.target.files[0].name.split(".");
          var extension = extensionArray[extensionArray.length - 1];
          if (
            extension.toLowerCase() == "aac" ||
            extension.toLowerCase() == "mp3" ||
            extension.toLowerCase() == "mp4" ||
            extension.toLowerCase() == "opus" ||
            extension.toLowerCase() == "amr"
          ) {
            this.sizeLimit = false;
            this.gifWarning = false;
          } else {
            this.gifWarning = true;
            this.sizeLimit = true;
            this.botsays.fileName.image = "Choose Video";
          }
        }
      } else if (this.mulSelectFieldToggle == 3) {
        if (val.target.files[0].size > 16000000) {
          this.sizeLimit = true;
          this.botsays.fileName.video = "Choose Video";
        } else {
          var extensionArray = val.target.files[0].name.split(".");
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
            this.botsays.fileName.image = "Choose Video";
          }
        }
      } else if (this.mulSelectFieldToggle == 4) {
        if (val.target.files[0].size > 100000000) {
          this.sizeLimit = true;
          this.botsays.fileName.document = "Choose Document";
        } else {
          this.sizeLimit = false;
        }
      } else if (this.mulSelectFieldToggle == 7) {
        if (val.target.files[0].size > 100000) {
          this.sizeLimit = true;
          this.botsays.fileName.sticker = "Choose Sticker";
        } else {
          var extensionArray = val.target.files[0].name.split(".");
          var extension = extensionArray[extensionArray.length - 1];
          if (extension.toLowerCase() == "webp") {
            const reader = new FileReader();
            reader.readAsDataURL(val.target.files[0]);
            reader.onload = (e: any) => {
              const image = new Image();
              image.src = e.target.result;
              image.onload = (e: any) => {
                const height = e.target.height;
                const width = e.target.width;
                // console.log(height,"height", width,"width");
                if (height == 512 && width == 512) {
                  this.sizeLimit = false;
                  this.gifWarning = false;
                  this.dimensionFlag = false;
                } else {
                  // this.sizeLimit = true;
                  this.dimensionFlag = true;
                  this.botsays.fileName.sticker = "Choose Sticker";
                  this.toaster.warning("Sticker Dimension should be 512 X 512", "Warning");
                }
              };
            };
          } else {
            this.gifWarning = true;
            this.sizeLimit = true;
            this.botsays.fileName.sticker = "Choose Sticker";
            this.loader.useRef().complete();
          }
        }
      }
      if (this.sizeLimit == false) {
        //!if the uploaded media has less size than limit file is sent to backend and getbacks the mediaId
        var reader = new FileReader();
        this.loader.useRef().start();
        reader.readAsArrayBuffer(val.target.files[0]);

        reader.onload = (event: ProgressEvent) => {
          // this.filePath = (<FileReader>event.target).result;
          this.filePath = val.target.files[0];
          // var newFilePath = val.target.files[0]
          return new Promise((resolve, reject) => {
            this.flowService.uploadMedia(val.target.files[0]).subscribe(
              (resp: any) => {
                // console.log(resp, "Resp");
                // console.log(JSON.parse(JSON.stringify(resp)),"media Response")
                // this.mediaId = JSON.parse(JSON.stringify(resp)); //!storing mediaID
                // resolve(this.mediaId);
                // this.mediaId = JSON.parse(JSON.stringify(resp))
                // console.log(this.mediaId.url,"Media Id")
                resolve(JSON.parse(JSON.stringify(resp)).url);
                this.loader.useRef().complete();
              },
              (error) => {
                this.loader.useRef().complete();
              }
            );
          }).then((obj) => {
            this.mediaId = obj; //! setting mediaUpload flags true/false based on the upload success/failure
            // console.log(this.mediaId,"OBJE")
            if (this.mediaId) {
              this.fileUploadFlag = true;
            } else {
              this.fileUploadFlag = false;
            }
            // reader.readAsBinaryString(val.target.files[0]);    //!assigning media fileName to corresponding variable
          });
        };
        if (this.mulSelectFieldToggle == 1) {
          this.fileName = val.target.files[0].name;
          this.botsays.fileName.image = this.fileName;
          let extensionArray = this.fileName.split(".");
          this.extensionType = extensionArray[extensionArray.length - 1];
        } else if (this.mulSelectFieldToggle == 2) {
          this.fileName = val.target.files[0].name;
          this.botsays.fileName.audio = this.fileName;
          let extensionArray = this.fileName.split(".");
          this.extensionType = extensionArray[extensionArray.length - 1];
        } else if (this.mulSelectFieldToggle == 3) {
          this.fileName = val.target.files[0].name;
          this.botsays.fileName.video = this.fileName;
          let extensionArray = this.fileName.split(".");
          this.extensionType = extensionArray[extensionArray.length - 1];
        } else if (this.mulSelectFieldToggle == 4) {
          this.fileName = val.target.files[0].name;
          this.botsays.fileName.document = this.fileName;
          let extensionArray = this.fileName.split(".");
          this.extensionType = extensionArray[extensionArray.length - 1];
        } else if (this.mulSelectFieldToggle == 7) {
          this.fileName = val.target.files[0].name;
          this.botsays.fileName.sticker = this.fileName;
          let extensionArray = this.fileName.split(".");
          this.extensionType = extensionArray[extensionArray.length - 1];
        }
      }
    } else {
      this.mediaErrorFlag = true;
    }
  }

  setPreviewUrl() {
    this.previewUrlFlag = !this.previewUrlFlag;
  }

  getTextLength(length) {
    //! function used to store the length that emitted from the textareaComponent
    // if(length > 0){
    //   this.textLength = true;
    // }else{
    //   this.textLength = false;
    // }
    // console.log(this.message,"Message Before")
    // console.log(this.message.replace(/&nbsp;/g,""),"Message After")
    // console.log(this.message.replace(/&nbsp;/g,"").trim().length,"Length")
    if (this.mulSelectFieldToggle == 5) {
      // if(this.message.trim().length != 0){
      if (
        this.message
          .replace(/&nbsp;/g, " ")
          .replace(/<br>/g, "")
          .trim().length != 0
      ) {
        this.textLength = true;
      } else {
        this.textLength = false;
      }
    } else {
      this.textLength = true;
    }
  }
  getMessage(message, model) {
    //! storing corresponding messages emitted from the textareaComponent
    if (model == "botsays.message") {
      this.message = message;
    } else if (model == "botsays.caption.image") {
      this.imageCaption = message;
    } else if (model == "botsays.caption.audio") {
      this.audioCaption = message;
    } else if (model == "botsays.caption.video") {
      this.videoCaption = message;
    } else if (model == "botsays.caption.document") {
      this.documentCaption = message;
    }
  }
  clearForm() {
    //! used to clear form
    this.propertyService.clearTextbox.next();
    this.selectFieldToggle = "default";
  }
  childValue(value) {
    //!getting outputNode id from nextObject Component
    // this.outputNode=value;
    this.outputNode[0] = value;
  }
  checkingNumber(event) {
    //!used to check whether the typed value is number/not
    // if (
    //   (event.keyCode >= 48 && event.keyCode <= 57) ||
    //   (event.keyCode >= 96 && event.keyCode <= 105) ||
    //   event.keyCode == 8 ||
    //   event.keyCode == 46 ||
    //   event.keyCode == 109 ||
    //   event.keyCode == 45 ||
    //   event.keyCode == 43
    // ) {

    // }else{
    //   event.preventDefault();
    // }
    // console.log(event);
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
  switchMediaUrlFlag() {
    if (this.mediaUrlFlag == false) {
      this.mediaUrlFlag = true;
      this.fileUploadFlag = true;
      // this.sizeLimit = false;
      this.textLength = true;
      this.getTextLength(1);
    } else {
      this.mediaUrlFlag = false;
      if (
        this.filePath != null &&
        this.filePath != undefined &&
        this.filePath != ""
      ) {
        this.fileUploadFlag = true;
      } else {
        this.fileUploadFlag = false;
      }
      // this.sizeLimit = true;
      this.textLength = true;
      this.getTextLength(1);
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
  checkKeyword(name) {
    //!To be implemented
    if (this.keywordArray.includes(name.toLowerCase().trim())) {
      this.duplicatekeywordcheckFlag = true;
    } else {
      this.duplicatekeywordcheckFlag = false;
    }
  }
  preventPaste(ev) {
    ev.preventDefault()
  }
  onSubmit(form: NgForm) {
    this.flowService.changeFlag.next("add");
    let template = document.getElementsByClassName("selected");
    // let templateId = template[0].id.split("-")[1]; //!getting nodeId from template
    let templateId = this.nodeId; //!getting nodeId from template
    let newTemplate = document.getElementsByClassName("selected");
    //! selecting multimedia seletion field value
    if (this.mulSelectFieldToggle == 1) {
      this.caption = this.imageCaption;
      if (this.mediaUrlFlag == true) {
        this.mediaId = this.botsays.mediaUrl.image;
      }
    } else if (this.mulSelectFieldToggle == 2) {
      this.caption = this.audioCaption;
      if (this.mediaUrlFlag == true) {
        this.mediaId = this.botsays.mediaUrl.audio;
      }
    } else if (this.mulSelectFieldToggle == 3) {
      this.caption = this.videoCaption;
      if (this.mediaUrlFlag == true) {
        this.mediaId = this.botsays.mediaUrl.video;
      }
    } else if (this.mulSelectFieldToggle == 4) {
      this.caption = this.documentCaption;
      if (
        this.botsays.documentFileName != "" &&
        this.botsays.documentFileName != undefined
      ) {
        this.fileName = this.botsays.documentFileName;
      }
      if (this.mediaUrlFlag == true) {
        this.mediaId = this.botsays.mediaUrl.document;
      }
    } else if (this.mulSelectFieldToggle == 6) {
      // this.caption=this.botsays.contact.firstName+" "+this.botsays.contact.lastName
      this.phones = this.botsays.phones;
      this.address = this.botsays.address;
      this.email = this.botsays.email;
      this.url = this.botsays.url;
      this.contact = {
        name: {
          firstName: form.value.nameFullName,
          formatedName: form.value.nameFormatedName,
          middleName: form.value.nameMiddleName,
          prefix: form.value.namePrefix,
          suffix: form.value.namesuffix,
          lastName: form.value.nameLastName,
        },
        org: {
          company: form.value.company,
          department: form.value.department,
          orgTitle: form.value.orgTitle,
        },
        phones: this.phones,
        address: this.address,
        birthday: form.value.birthday,
        email: this.email,
        url: this.url,
      };
    } else if (this.mulSelectFieldToggle == 8) {
      this.location = this.botsays.location;
    } else if (this.mulSelectFieldToggle == 7) {
      if (this.mediaUrlFlag == true) {
        this.mediaId = this.botsays.mediaUrl.sticker;
      }
    }

    if (this.previewUrlFlag == true) {
      const urlEx = new RegExp(
        "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
      );
      // console.log(this.message, "Message");
      // console.log(urlEx.test(this.message));
      if (urlEx.test(this.message)) {
        var urlArray = this.message.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
        );
        if (urlArray != null) {
          return new Promise((resolve, reject) => {
            this.Service.checkUrl(urlArray[0]).subscribe(
              (resp) => {
                resolve(resp);
                // console.log(resp)
              },
              (error) => {
                // console.log(error);
              }
            );
          }).then((flag: any) => {
            // console.log(flag)
            this.previewUrlFlag = flag.status;
            // this.previewUrlFlagDB = flag.status
            // if(flag.status == "1"){
            //   this.previewUrlFlag = true;
            // }else{
            //   this.previewUrlFlag = false;
            // }
            this.afterOnSubmit(templateId, form, newTemplate);
          });
        } else {
          this.previewUrlFlag = false;
          this.afterOnSubmit(templateId, form, newTemplate);
        }
      } else {
        // this.previewUrlFlagDB="0"
        this.previewUrlFlag = false;
        this.afterOnSubmit(templateId, form, newTemplate);
      }
    } else {
      this.afterOnSubmit(templateId, form, newTemplate);
    }
  }

  afterOnSubmit(templateId, form, newTemplate) {
    var newFileValue;
    if (
      form.value.multimediaFieldValue != 5 &&
      form.value.multimediaFieldValue != 6 &&
      form.value.multimediaFieldValue != 8
    ) {
      if (this.mediaUrlFlag == true) {
        newFileValue = this.mediaId;
      } else {
        // if (this.mediaId.Id == undefined) {
        if (this.mediaId == undefined) {
          newFileValue = this.filePath;
        } else {
          // newFileValue = `https://prutech.org/ACP/api/media/getMedia?id=${this.mediaId.Id}.${this.extensionType}`;
          // newFileValue = `https://192.9.200.70/ACP/api/media/getMedia?id=${this.mediaId.Id}.${this.extensionType}`
          newFileValue = this.mediaId;
          // console.log(newFileValue,"URL")
        }
      }
    }

    if (this.message || this.caption) {
      if (this.message != undefined && this.message != "") {
        // this.message = this.message
        // .replace(/<b>[<br>]*<\/b>/g,"\n")
        // .replace(/<div><br><div>/g,"<br><br>")
        // .replace(/<div><br><\/div>/g,"<br>")
        // .replace(/<div>/g, "<br>")
        // .replace(/<\/div>/g, "")
        // .replace(/" "/g,"&nbsp;")
        // .replace(/\n/g, "<br>")
        // .replace(/<\/?span[^>]*>/g,"");
        this.message = this.replaceFunction(this.message);
        // console.log(this.message, "After Message");
      }
      if (this.caption != undefined && this.caption != "") {
        // this.caption = this.caption
        // .replace(/<b>[<br>]*<\/b>/g,"\n")
        // .replace(/<div><br><div>/g,"<br><br>")
        // .replace(/<div><br><\/div>/g,"<br>")
        // .replace(/<div>/g, "<br>")
        // .replace(/<\/div>/g, "")
        // .replace(/" "/g,"&nbsp;")
        // .replace(/\n/g, "<br>")
        // .replace(/<\/?span[^>]*>/g,"");
        this.caption = this.replaceFunction(this.caption);
      }
    }
    var elementObj = {
      //! data for saving to DB
      nodeDetails: this.outputNode,
      id: templateId,
      message: this.message,
      fileValue: newFileValue,
      uniqueName: form.value.uniqueName,
      keyword: form.value.keyword,
      valMultimediaSelect: form.value.multimediaFieldValue,
      mediaUrlFlag: this.mediaUrlFlag,
      caption: this.caption,
      fileName: this.fileName,
      extensionType: this.extensionType,
      objectWait: this.botsays.waitTime,
      contact: this.contact,
      answerOptions: {
        section_1: {
          options: {
            output_1: {
              optionName: "",
              description: "",
              // next_node:""
            },
          },
          sectionName: "",
        },
      },
      urlCheck: this.previewUrlFlag,
      location: this.location,
    };

    // for(const element in elementObj){
    //   if(elementObj[element] == undefined){
    //     elementObj[element] = ""
    //   }
    // }

    // console.log(elementObj);
    this.propertyService.addDivToNode(elementObj, templateId); //!adding node content to drawflow
    this.propertyService.addDataToJson(templateId, elementObj); //! adding data to JSON for rebinding and DB
    // var datatoJSON = {
    //   id : templateId,
    //   data : elementObj
    // }
    // this.flowService.addDatatoJSON.next(datatoJSON)
    var templateInnerHtml = newTemplate[0].children[1].innerHTML;
    var nodeContent = {
      id: templateId,
      html: templateInnerHtml,
    };
    var connection = {
      outputId: templateId,
      inputId: this.outputNode,
      outputNode: "output_1",
      inputNode: "input_1",
    };
    this.flowService.nodeContent.next(nodeContent); //! saving HTML of the node to Drawflow for copying the node
    this.flowService.deleteConnection.next(templateId); //! deleting if existing connection presents to keep only one connection in outputnode
    this.flowService.addConnection.next(connection); //! creating connection from saysObject to another saved Object
    this.propertyService.addKeywordToJSON(templateId, elementObj); //!saving keyword to keywordJSON
    this.propertyService.addUniqueJSON(templateId, elementObj); //! adding uniqueName to uniqueJSON for nextObejct property
    this.flowService.newReq.next(this.nodeId); //! getting uniqueNames from JSON for nextObject dropdown
    this.toaster.success("Object Saved", "Success");
  }
  ngOnDestroy() {
    this.flowService.changeFlag.next("destroy");
  }
}
