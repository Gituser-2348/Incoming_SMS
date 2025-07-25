import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, HostListener, ViewChild, ElementRef, Renderer2, Directive } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FlowbuilderService } from '../../../views/flow/flowbuilder.service';
import { PropertyBindingService } from '../../../views/flow/propertybuilder/propertyBinding.service';
import { ChatBotService } from '../chat-bot/chat-bot.service';

@Component({
  selector: 'file-handler-chat',
  templateUrl: './file-handler-chat.html',
  styleUrls: ['./file-handler-chat.scss']
})
export class FileHandler implements OnInit {
  @Output() dataTransfer = new EventEmitter();
  @Input() style;
  @ViewChild('menu') menu: ElementRef;
  @Input() fileHandlerId
  data: any = {
    customer_num: ""
  };
  upload: any = {
    file: "",
    caption: "",
    fileName: ""
  }
  fileName :any ="";
  mulSelectFieldToggle: any;
  dataToTransmit: any;
  url: any = '';
  contentType: any;
  desableFlag: boolean = false;
  sizeFailed: boolean = true
  constructor(private toastr: ToastrService, private renderer: Renderer2, private service: ChatBotService, private flowService: FlowbuilderService) {
  }

  ngOnInit() {
    this.service.fileHandler.subscribe((data: any) => {
      this.data = data
      const element = document.getElementById('file')
      element.style.display = 'block'
    })
    this.mulSelectFieldToggle = 1
    this.contentType = 'image';
    this.upload.caption = "";
    this.upload.file = "";
    this.upload.fileName = "";
    this.fileName = ""
  }

  getFileMedia(event) {
    var val = event.target.files
    if (val && val[0]) {
      if (this.mulSelectFieldToggle == 1) {
        //! checking the uploaded media has size less than limit
        this.contentType = 'image'
        if (event.target.files[0].size > 5000000) {
          this.sizeFailed = true
          this.popUpToasterAndClearField("Maximum allowed Size 5MB")
        } else {
          var extensionArray = event.target.files[0].name.split(".");
          var extension = extensionArray[extensionArray.length - 1];
          if (
            extension.toLowerCase() == "png" ||
            extension.toLowerCase() == "jpg" ||
            extension.toLowerCase() == "jpeg"
          ) {
            this.sizeFailed = false
          } else {
            this.popUpToasterAndClearField("Only Support .png .jpg .jpeg extensions")
          }
        }
      } else if (this.mulSelectFieldToggle == 2) {
        this.contentType = 'audio';
        if (event.target.files[0].size > 16000000) {
          this.sizeFailed = true
          this.popUpToasterAndClearField("Maximum allowed Size 16MB")
        } else {
          var extensionArray = event.target.files[0].name.split(".");
          var extension = extensionArray[extensionArray.length - 1];
          if (
            extension.toLowerCase() == "aac" ||
            extension.toLowerCase() == "mp3" ||
            extension.toLowerCase() == "mp4" ||
            extension.toLowerCase() == "opus" ||
            extension.toLowerCase() == "amr"
          ) {
            this.sizeFailed = false
          } else {
            this.popUpToasterAndClearField("Only Support .aac .mp3 .mp4 .opus extensions")
          }
        }
      } else if (this.mulSelectFieldToggle == 3) {
        this.contentType = 'video'
        if (event.target.files[0].size > 16000000) {
          this.sizeFailed = true
          this.popUpToasterAndClearField("Maximum allowed Size 16MB")
        } else {
          var extensionArray = event.target.files[0].name.split(".");
          var extension = extensionArray[extensionArray.length - 1];
          if (
            extension.toLowerCase() == "3gp" ||
            extension.toLowerCase() == "mp4"
          ) {
            this.sizeFailed = false
          } else {
            this.popUpToasterAndClearField("Only Support .3gp .mp4 extensions")
          }
        }
      } else if (this.mulSelectFieldToggle == 4) {
        this.contentType = 'doc'
        if (event.target.files[0].size > 100000000) {
          this.sizeFailed = true
          this.popUpToasterAndClearField("Maximum allowed Size 100MB")
        } else {
          this.fileName  = event.target.files[0].name;
          this.sizeFailed = false
        }
      } else if (this.mulSelectFieldToggle == 7) {
        this.contentType = 'image'
        if (event.target.files[0].size > 100000) {
          this.sizeFailed = true
          this.popUpToasterAndClearField("Maximum allowed Size 100KB")
        } else {
          var extensionArray = event.target.files[0].name.split(".");
          var extension = extensionArray[extensionArray.length - 1];
          if (extension.toLowerCase() == "webp") {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (e: any) => {
              const image = new Image();
              image.src = e.target.result;
              image.onload = (e: any) => {
                const height = e.target.height;
                const width = e.target.width;
                if (height == 512 && width == 512) {
                  this.sizeFailed = false
                } else {
                  this.popUpToasterAndClearField("Dimension must be 512 X 512")
                }
              };
            };
          } else {
            this.popUpToasterAndClearField("Only Support .webp extensions")

          }
        }
      }
      //!if the uploaded media has less size than limit file is sent to backend and getbacks the mediaId
      setTimeout(() => {
        if (this.sizeFailed == false) {
          var reader = new FileReader();
          // console.log(this.sizeFailed, "File Handler Called")
          reader.readAsArrayBuffer(val[0]);
          reader.onload = (event: ProgressEvent) => {
            return new Promise((resolve, reject) => {
              this.flowService.uploadChatMedia({
                file: val[0],
                acc_id: this.data.acc_id,
                flow_id: this.data.flow_id
              }).subscribe(
                (resp: any) => {
                  resolve(JSON.parse(JSON.stringify(resp)).url);
                },
                (error) => {
                  this.toastr.warning("Some Error Occured", "Warning")
                }
              );
            }).then((url) => {
              this.url = url
              this.desableFlag = true
            });
          };
        }
      },);

    }
  }
  multimediaSelect(val) {
    this.mulSelectFieldToggle = val.target.value;
    this.upload.caption = "";
    this.upload.file = "";
    this.upload.fileName = "";
    this.fileName = ""
  }

  popUpToasterAndClearField(message) {
    this.toastr.warning(message, "Warning")
    this.upload.file = "";
    this.upload.caption = "";
    this.desableFlag = false;
    this.url = '';
    this.contentType = ''
    this.fileName = ""
  }
  preventPaste(ev) {
    ev.preventDefault()
  }
  sendFile() {
    if(this.mulSelectFieldToggle == 4){
      if(this.upload.fileName == ""){
        this.upload.fileName = this.fileName;
      }
    }
    let tempMessage = {
      "msg_type": "msg_out",
      "msg_for": this.contentType,
      "msg_data": this.url,
      "node_type": "message",
      "msg_caption": this.upload.caption,
      "optionArray": [],
      "header": "",
      "footer": ""
    }
    var tempData = {
      "service_id": this.data.service_id,
      "acc_id": this.data.acc_id,
      "flow_id": this.data.flow_id,
      "comm_id": this.data.communication_id,
      "trans_in_id": this.data.transation_id,
      "data": {
        "mediaurl": this.url,
        "caption": this.upload.caption,
        "Fileame": this.upload.fileName
      },
      "business_num": this.data.business_num,
      "content_type": this.mulSelectFieldToggle,
      "cus_num": this.data.customer_num,
    }
    console.log(tempData,"Data")
    this.dataToTransmit = {
      messageData: tempMessage,
      dbData: tempData,
      data: this.data
    }
    this.dataTransfer.emit(this.dataToTransmit)
    this.close()
  }
  close() {
    const element = document.getElementById(`file`);
    this.upload.file = "";
    this.upload.caption = "";
    this.upload.fileName = "";
    element.style.display = 'none';
    this.url = '';
    this.contentType = '';
    this.desableFlag = false;
    this.fileName = "";
    this.mulSelectFieldToggle = 1
  }
}
