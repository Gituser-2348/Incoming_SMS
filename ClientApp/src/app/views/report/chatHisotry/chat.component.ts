import { KeyValue } from "@angular/common";
import { Component } from "@angular/core";
//import { AccountsService } from "../../accounts/accounts.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportService } from "../report.service";
import { identifierName } from "@angular/compiler/src/parse_util";

@Component({
  selector: "chat-history",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatHistoryComponent {
  chatList: any = []
  chatDataOld = {}
  drawflowJSON = {}
  userName: any = "User";
  dynamicDate = {
    flag: false,
    date: "",
  };
  mouseUpDown: boolean;
  dateArray: any = [];
  sortedDateArray: any = [];
  constructor(
    private spinner: NgxSpinnerService,
    private reportService: ReportService,
  ) {
    this.spinner.show()
    setTimeout(() => {
      this.spinner.hide()
    }, 1500);

    this.reportService.clearData.subscribe((data) => {
      this.clearData()
    })
    this.reportService.chatLoader.subscribe((data) => {
      this.spinner.show()
      setTimeout(() => {
        this.spinner.hide()
      }, 1500);
    })
    this.reportService.setDrawflowJSON.subscribe((data: any) => {
      this.drawflowJSON = data;
    })
    this.reportService.setUserName.subscribe((name: any) => {
      if (name.length >= 15) {
        this.userName = name.slice(0, 14) + ".."
      } else {
        this.userName = name;
      }
    })

    this.reportService.setChatMessages.subscribe((data: any) => {
      // console.log(data, "Chat Data")
      this.chatDataOld = data;
      for (const object in this.chatDataOld) {
        this.dateArray.push(object);
      }

      this.sortedDateArray = this.dateArray.sort(this.dateComparison);
      // var dateSorted = this.sortedDateArray
      // this.sortedDateArray = []
      // for (let i = 1; i <= 7; i++) {
      //   if (dateSorted[dateSorted.length - i] != undefined) {
      //     // this.sortedDateArray.push(dateSorted[dateSorted.length-i])
      //     this.sortedDateArray.splice(0, 0, dateSorted[dateSorted.length - i])
      //   }
      // }
      this.chatDataOld[this.sortedDateArray[0]].sort(this.dateComparisonOnObject)
      // var chat = document.getElementById("chat");
      // chat.addEventListener("wheel", (event) => {
      //   // console.log(event.deltaY);
      //   if (event.deltaY > 0) {
      //   } else {
      //     this.mouseUpDown = true;
      //   }
      // });
      // chat.addEventListener("scroll", (event) => {
      //   for (let i = 0; i < this.sortedDateArray.length; i++) {
      //     if (this.mouseUpDown == true) {
      //       var trueFlag = this.isInViewportonScrollTop(
      //         document.getElementById(`div_${i}`),
      //         i
      //       );
      //       if (trueFlag["flag"] == true) {
      //         this.dynamicDate.flag = trueFlag.flag;
      //         // this.dynamicDate.date = Object.keys(this.chatData)[trueFlag.pos];
      //         this.dynamicDate.date =this.sortedDateArray[trueFlag.pos - 1];
      //         if (document.getElementById("dynamicDate")) {
      //           document.getElementById("dynamicDate").style.display = "block";
      //         }
      //         this.makeDivHidden();
      //         break;
      //       }
      //     }else{
      //     }
      //   }
      // });
      this.getMessageList()
    })

  }
  private onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>) {
    return -1;
  }
  ngOnInit() {
  }

  hideSpinner() {
  }
  scrollToBottom() {
    // console.log("Called scroll");
    const element = document.getElementById("chat");
    element.scrollTop = element.scrollHeight;
  }
  remove_WithSpace(date) {
    if (date != null || date != undefined) {
      return date.replace(/-/g, " ");
    }
  }
  hideChat() {
    this.reportService.hideChat.next(true);
  }


  isInViewportonScrollTop(element, pos) {
    const rect = element.getBoundingClientRect();
    var flag =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    return {
      flag: flag,
      pos: pos,
    };
  }
  isInViewportonScrollBottom(element, pos) {
    const rect = element.getBoundingClientRect();
    // console.log(rect,"rect",window.innerHeight,"InnerHeight",document.documentElement.clientHeight,"clientHeight")
    var flag =
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left >= 0 &&
      rect.bottom >=
      (window.innerHeight || document.documentElement.clientHeight)
      &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    // console.log(flag);
    return {
      flag: flag,
      pos: pos,
    };
  }
  makeDivHidden() {
    setTimeout(() => {
      const date = document.getElementById("dynamicDate");
      date.style.display = "none";
    }, 1500);
  }
  dateComparison(a, b) {
    const date1: any = new Date(a)
    const date2: any = new Date(b)
    return date1 - date2;
  }
  dateComparisonOnObject(obj1, obj2) {
    const date1: any = new Date(obj1.msg_in_time)
    const date2: any = new Date(obj2.msg_in_time)
    return date1 - date2;
  }

  getObjectwithArrayIndex(index) {
    // console.log(this.chatDataOld[index])
    return this.chatDataOld[index]
  }

  clearData() {
    this.drawflowJSON = {}
    this.chatDataOld = {}
    this.dateArray = [];
    this.sortedDateArray = [];
    this.chatList = [];
  }


  // async agetMessageList(){
  //   // console.log((new Date()).getSeconds())
  //   var jsonData = this.drawflowJSON["drawflow"]["Home"]["data"];
  //   // console.log(jsonData)
  //   for(let i=0; i<this.sortedDateArray.length; i++){
  //     var data = this.chatDataOld[this.sortedDateArray[i]]
  //     let date = this.remove_WithSpace(this.sortedDateArray[i])
  //     this.chatList.push({
  //       "msg_type":"msg_date",
  //       "msg_for":"date",
  //       "node_type":"date",
  //       "msg_data":date,
  //       "optionArray":[],
  //       "msg_caption":"",
  //       "header":"",
  //       "footer":""
  //     })
  //     // console.log(data)
  //     for(let dataIndex = 0; dataIndex<data.length; dataIndex++){
  //       var msgIn = data[dataIndex]["msg_in"]
  //       var nodeOut = data[dataIndex]["node_out"]
  //       this.chatList.push({
  //         "msg_type":"msg_in",
  //         "msg_for":"msg",
  //         "node_type":"message",
  //         "msg_data":msgIn,
  //         "optionArray":[],
  //         "msg_caption":"",
  //         "header":"",
  //         "footer":""
  //       })
  //       for(let outputIndex=0;outputIndex<nodeOut.length;outputIndex++){
  //         // console.log(nodeOut[outputIndex],"Node Value")
  //         if(nodeOut[outputIndex]!= null){
  //           let nodeId = nodeOut[outputIndex]
  //           // console.log(nodeId,"Node Id",jsonData[nodeId],"DAta")
  //           if(nodeOut.length == 2 && nodeOut[0] == nodeOut[1] && nodeOut[outputIndex + 1] !== undefined ){
  //             if(jsonData[nodeOut[0]]["properties"]["invalidMessage"] != undefined && jsonData[nodeOut[0]]["properties"]["invalidMessage"] != ""){
  //               this.chatList.push({
  //                 "msg_type":"msg_out",
  //                 "msg_for":"msg",
  //                 "node_type":"message",
  //                 "msg_data":jsonData[nodeOut[0]]["properties"]["invalidMessage"],
  //                 "optionArray":[],
  //                 "msg_caption":"",
  //                 "header":"",
  //                 "footer":""
  //               });
  //             }
  //           }
  //           else if(jsonData[nodeId]["name"]=="wpBotSays"){

  //             if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 5){

  //               if(jsonData[nodeId]["properties"]["message"].length != 0){
  //                 this.chatList.push({
  //                   "msg_type":"msg_out",
  //                   "msg_for":"msg",
  //                   "msg_data" : jsonData[nodeId]["properties"]["message"],
  //                   "node_type" : "message",
  //                   "msg_caption" : '',
  //                   "optionArray":[],
  //                   "header":"",
  //                   "footer":""
  //                 })
  //               }else{}
  //             }
  //             else if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 1){
  //               this.chatList.push({
  //                 "msg_type":"msg_out",
  //                 "msg_for":"image",
  //                 "msg_data" : jsonData[nodeId]["properties"]["fileValue"],
  //                 "node_type" : "message",
  //                 "msg_caption" : jsonData[nodeId]["properties"]["caption"],
  //                 "optionArray":[],
  //                 "header":"",
  //                 "footer":""
  //               })
  //             }else if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 2){
  //               this.chatList.push({
  //                 "msg_type":"msg_out",
  //                 "msg_for":"audio",
  //                 "msg_data" : jsonData[nodeId]["properties"]["fileValue"],
  //                 "node_type" : "message",
  //                 "msg_caption" : jsonData[nodeId]["properties"]["caption"],
  //                 "optionArray":[],
  //                 "header":"",
  //                 "footer":""
  //               })
  //             }else if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 3){
  //               this.chatList.push({
  //                 "msg_type":"msg_out",
  //                 "msg_for":"video",
  //                 "msg_data" : jsonData[nodeId]["properties"]["fileValue"],
  //                 "node_type" : "message",
  //                 "msg_caption" : jsonData[nodeId]["properties"]["caption"],
  //                 "optionArray":[],
  //                 "header":"",
  //                 "footer":""
  //               })
  //             }else if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 4){
  //               var srcPath ;
  //               if (jsonData[nodeId]["properties"]["extensionType"] == "pdf") {
  //                 srcPath = "assets/images/pdf.png";
  //               } else if (jsonData[nodeId]["properties"]["extensionType"] == "docx" || jsonData[nodeId]["properties"]["extensionType"] == "doc") {
  //                 srcPath = "assets/images/word.png";
  //               } else if (jsonData[nodeId]["properties"]["extensionType"] == "xlsx" || jsonData[nodeId]["properties"]["extensionType"] == "xls") {
  //                 srcPath = "assets/images/sheets.png";
  //               }
  //               this.chatList.push({
  //                 "msg_type":"msg_out",
  //                 "msg_for":"image",
  //                 "msg_data" : srcPath,
  //                 "node_type" : "message",
  //                 "msg_caption" : jsonData[nodeId]["properties"]["caption"],
  //                 "optionArray":[],
  //                 "header":"",
  //                 "footer":""
  //               })
  //             }

  //           }else if(jsonData[nodeId]["name"]=="wpBotAsk"){
  //             if(jsonData[nodeId]["properties"]["valSelectField"] == 1
  //           ||jsonData[nodeId]["properties"]["valSelectField"] == 4 ){
  //           if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 1){
  //             this.chatList.push({
  //               "msg_type":"msg_out",
  //               "msg_for":"image",
  //               "msg_data" : jsonData[nodeId]["properties"]["fileValue"],
  //               "node_type" : "message",
  //               "msg_caption" : jsonData[nodeId]["properties"]["caption"],
  //               "optionArray":[],
  //               "header":"",
  //               "footer":""
  //             })
  //           }else if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 2){
  //             this.chatList.push({
  //               "msg_type":"msg_out",
  //               "msg_for":"audio",
  //               "msg_data" : jsonData[nodeId]["properties"]["fileValue"],
  //               "node_type" : "message",
  //               "msg_caption" :  jsonData[nodeId]["properties"]["caption"],
  //               "optionArray":[],
  //               "header":"",
  //               "footer":""
  //             })
  //           }else if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 3){
  //             this.chatList.push({
  //               "msg_type":"msg_out",
  //               "msg_for":"video",
  //               "msg_data" : jsonData[nodeId]["properties"]["fileValue"],
  //               "node_type" : "message",
  //               "msg_caption" :  jsonData[nodeId]["properties"]["caption"],
  //               "optionArray":[],
  //               "header":"",
  //               "footer":""
  //             })
  //           }else if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 4){
  //             var srcPath ;
  //             if (jsonData[nodeId]["properties"]["extensionType"] == "pdf") {
  //               srcPath = "assets/images/pdf.png";
  //             } else if (jsonData[nodeId]["properties"]["extensionType"] == "docx" || jsonData[nodeId]["properties"]["extensionType"] == "doc") {
  //               srcPath = "assets/images/word.png";
  //             } else if (jsonData[nodeId]["properties"]["extensionType"] == "xlsx" || jsonData[nodeId]["properties"]["extensionType"] == "xls") {
  //               srcPath = "assets/images/sheets.png";
  //             }
  //             this.chatList.push({
  //               "msg_type":"msg_out",
  //               "msg_for":"image",
  //               "msg_data" : srcPath,
  //               "node_type" : "message",
  //               "msg_caption" :  jsonData[nodeId]["properties"]["caption"],
  //               "optionArray":[],
  //               "header":"",
  //               "footer":""
  //             })
  //           }else if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 5){
  //            if(jsonData[nodeId]["properties"]["message"].length != 0){
  //             this.chatList.push({
  //               "msg_type":"msg_out",
  //               "msg_for":"msg",
  //               "node_type":"message",
  //               "msg_data":jsonData[nodeId]["properties"]["message"],
  //               "optionArray":[],
  //               "msg_caption":"",
  //               "header":"",
  //               "footer":""
  //             })
  //            }else{}
  //           }
  //         }else if(jsonData[nodeId]["properties"]["valSelectField"] == 2){
  //           var options = []
  //           for (const sections in jsonData[nodeId]["properties"]["answerOptions"]) {
  //             if(sections != "errorSection"){
  //               var sectionOptions  =jsonData[nodeId]["properties"]["answerOptions"][sections]["options"]
  //               for(const opt in sectionOptions){
  //                 options.push(sectionOptions[opt])
  //               }
  //             }
  //           }

  //           if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 1){
  //             this.chatList.push({
  //               "msg_type":"msg_out",
  //               "msg_for":"image",
  //               "node_type":"button",
  //               "msg_data":jsonData[nodeId]["properties"]["fileValue"],
  //               "optionArray":options,
  //               "msg_caption":jsonData[nodeId]["properties"]["caption"],
  //               "header":"",
  //               "footer":jsonData[nodeId]["properties"]["footer"]
  //             })
  //           }else if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 2){
  //             this.chatList.push({
  //               "msg_type":"msg_out",
  //               "msg_for":"audio",
  //               "node_type":"button",
  //               "msg_data":jsonData[nodeId]["properties"]["fileValue"],
  //               "optionArray":options,
  //               "msg_caption":jsonData[nodeId]["properties"]["caption"],
  //               "header":"",
  //               "footer":jsonData[nodeId]["properties"]["footer"]
  //             })
  //           }else if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 3){
  //             this.chatList.push({
  //               "msg_type":"msg_out",
  //               "msg_for":"video",
  //               "node_type":"button",
  //               "msg_data":jsonData[nodeId]["properties"]["fileValue"],
  //               "optionArray":options,
  //               "msg_caption":jsonData[nodeId]["properties"]["caption"],
  //               "header":"",
  //               "footer":jsonData[nodeId]["properties"]["footer"]
  //             })
  //           }else if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 4){
  //             var srcPath ;
  //             if (jsonData[nodeId]["properties"]["extensionType"] == "pdf") {
  //               srcPath = "assets/images/pdf.png";
  //             } else if (jsonData[nodeId]["properties"]["extensionType"] == "docx" || jsonData[nodeId]["properties"]["extensionType"] == "doc") {
  //               srcPath = "assets/images/word.png";
  //             } else if (jsonData[nodeId]["properties"]["extensionType"] == "xlsx" || jsonData[nodeId]["properties"]["extensionType"] == "xls") {
  //               srcPath = "assets/images/sheets.png";
  //             }
  //             this.chatList.push({
  //               "msg_type":"msg_out",
  //               "msg_for":"image",
  //               "node_type":"button",
  //               "msg_data":srcPath,
  //               "optionArray":options,
  //               "msg_caption":jsonData[nodeId]["properties"]["caption"],
  //               "header":"",
  //               "footer":jsonData[nodeId]["properties"]["footer"]
  //             })
  //           }else if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 5 || jsonData[nodeId]["properties"]["valMultimediaSelect"] == -1){

  //             this.chatList.push({
  //               "msg_type":"msg_out",
  //               "msg_for":"msg",
  //               "node_type":"button",
  //               "msg_data":jsonData[nodeId]["properties"]["message"],
  //               "optionArray":options,
  //               "msg_caption":'',
  //               "header":jsonData[nodeId]["properties"]["header"],
  //               "footer":jsonData[nodeId]["properties"]["footer"]
  //             })

  //           }
  //         }else if(jsonData[nodeId]["properties"]["valSelectField"] == 3){
  //           var listOptions = []
  //           var sectionsList = []
  //           var sectionNameList = []
  //           for (const sections in jsonData[nodeId]["properties"]["answerOptions"]) {
  //             // console.log(sections)

  //             if(sections != "errorSection"){
  //               var sectionName =  jsonData[nodeId]["properties"]["answerOptions"][sections]["sectionName"]
  //               sectionNameList.push(sectionName)
  //               var sectionOptions  = jsonData[nodeId]["properties"]["answerOptions"][sections]["options"]
  //               for(const opt in sectionOptions){
  //                 listOptions.push(sectionOptions[opt])
  //               }
  //               sectionsList.push({
  //                 sectionOptions : listOptions
  //               })
  //             }
  //             listOptions = []
  //           }

  //           if(jsonData[nodeId]["properties"]["valMultimediaSelect"] == 5 || jsonData[nodeId]["properties"]["valMultimediaSelect"] == -1){
  //             this.chatList.push({
  //               "msg_type":"msg_out",
  //               "msg_for":"msg",
  //               "node_type":"list",
  //               "msg_data":jsonData[nodeId]["properties"]["message"],
  //               "optionArray":sectionsList,
  //               "sectionNameList":sectionNameList,
  //               "msg_caption":jsonData[nodeId]["properties"]["caption"],
  //               "header": jsonData[nodeId]["properties"]["header"],
  //               "footer":jsonData[nodeId]["properties"]["footer"]
  //             })
  //           }
  //         }
  //           }
  //         }else{
  //           this.chatList.push({
  //             "msg_type":"",
  //             "msg_for":"",
  //             "node_type":"null",
  //             "msg_data":"",
  //             "optionArray":[],
  //             "header":"",
  //             "footer":""
  //           })
  //         }
  //       }
  //     }
  //   }
  //   // console.log(this.chatList,"ChatLIst")
  //   // console.log((new Date()).getSeconds())
  //   this.scrollToBottom();
  // }

  replaceFunciton(message: any) {
     if(message != null && message != undefined){
    // console.log(message,"Message")
    return (
      message.toString().replaceAll('\\r\\n', "<br/>").replaceAll('\n',"<br/>")
        .replace(/(?:\*)([^*<\n]+)(?:\*)/g, "<b>$1</b>")
        .replace(/(?:_)([^_<\n]+)(?:_)/g, "<i>$1</i>")
        .replace(/(?:~)([^~<\n]+)(?:~)/g, "<strike>$1</strike>")
    );
     }
  }

  async getMessageList() {
    // var jsonData = this.drawflowJSON["drawflow"]["Home"]["data"];
    // console.log(jsonData)
    console.log(this.chatDataOld,"Chat")
    for (let i = 0; i < this.sortedDateArray.length; i++) {
      var data = this.chatDataOld[this.sortedDateArray[i]]
      let date = this.remove_WithSpace(this.sortedDateArray[i])
      this.chatList.push({
        "msg_type": "msg_date",
        "msg_for": "date",
        "node_type": "date",
        "msg_data": date,
        "optionArray": [],
        "msg_caption": "",
        "header": "",
        "footer": "",
      })
      for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
        var msgIn = data[dataIndex]["msg_in"]
        var messageOut = data[dataIndex]["message_out"]
        if(msgIn["Type"].toUpperCase() == "TEXT" || msgIn["Type"].toUpperCase() == "INTERACTIVE"){
          this.chatList.push({
            "msg_type": "msg_in",
            "msg_for": "msg",
            "node_type": "message",
            "msg_data": this.replaceFunciton(msgIn["Text"]),
            "optionArray": [],
            "msg_caption": "",
            "header": "",
            "footer": "",
          })
        }else if(msgIn["Type"].toUpperCase() == "LOCATION"){
          this.chatList.push({
            "msg_type": "msg_in",
            "msg_for": "msg",
            "node_type": "message",
            "msg_data": `<a href="https://maps.google.com/?q=${msgIn["Location"]["latitude"]},${msgIn["Location"]["longitude"]}" target="_blank">Open Map</a>`,
            "optionArray": [],
            "msg_caption": "",
            "header": "",
            "footer": "",
          })
        }else if(msgIn["Type"].toUpperCase() == "CONTACTS"){
          var contact =`<div class="contactChat">`
          var contactInfo = ""
          msgIn["Contacts"].map((data,index)=>{
            let phone = ''
            if(msgIn["Contacts"][index]["phones"].length>0){
              phone=`<div class="row pbb-1">
              <div class="col">Phone</div>
              <div class="col-8">${msgIn["Contacts"][index]["phones"][0]["phone"]}</div>
            </div>`
            }else{
              phone=`<div class="row pb-1">
              <div class="col">Phone</div>
              <div class="col-8">    </div>
            </div>`
            }

            contactInfo+=`<div class="row justify-content-md-center">
            <div class="ml-n2">Contact - ${index+1}</div>
            </div>
            <div class="row">
              <div class="col">Name</div>
              <div class="col-8">${msgIn["Contacts"][index]["name"]["formatted_name"]} </div>
            </div>
            ${phone}
    `
          })

          contact = contact+contactInfo+'</div>'
          this.chatList.push({
            "msg_type": "msg_in",
            "msg_for": "msg",
            "node_type": "message",
            "msg_data": contact,
            "optionArray": [],
            "msg_caption": "",
            "header": "",
            "footer": "",
          })
        }else if(msgIn["Type"].toUpperCase() == "IMAGE" ||
        msgIn["Type"].toUpperCase() == "VIDEO" ||
        msgIn["Type"].toUpperCase() == "AUDIO" ||
        msgIn["Type"].toUpperCase() == "DOCUMENT" ||
        msgIn["Type"].toUpperCase() == "STICKER" ||
        msgIn["Type"].toUpperCase() == "VOICE" ){
          var url =  `<a href=${msgIn["Id"]} target="_blank">Download Media</a>`
          if(msgIn["Caption"] != "" && msgIn["Caption"] != undefined && msgIn["Caption"]!= null ){
            url+= `<div
            class="chatCaption" >${this.replaceFunciton(msgIn["Caption"])}</div>`
          }
          this.chatList.push({
            "msg_type": "msg_in",
            "msg_for": "doc",
            "node_type": "message",
            "msg_data": url,
            "optionArray": [],
            "msg_caption": msgIn["Caption"],
            "header": "",
            "footer": "",
          })
        }


        for (let msgIndex = 0; msgIndex < messageOut.length; msgIndex++) {
          var msgObject = messageOut[msgIndex]
          // console.log(msgObject,"MEssageObjetc")
          var msgContent = msgObject["message"]
          // console.log(msgContent,"MessageContent")
          if (msgObject["question_type"] == null ||
            msgObject["question_type"] == 1 ||
            msgObject["question_type"] == 4) {
            if (msgObject["content_type"] == 5) {
              this.chatList.push({
                "msg_type": "msg_out",
                "msg_for": "msg",
                "node_type": "message",
                "msg_data": this.replaceFunciton(msgContent["Content"]["Text"]),
                "optionArray": [],
                "msg_caption": "",
                "header": "",
                "footer": "",
                "response_by": msgObject["response_by"]
              });
            } else if (msgObject["content_type"] == 1) {
              this.chatList.push({
                "msg_type": "msg_out",
                "msg_for": "image",
                "msg_data": msgContent["Content"]["MediaUrl"],
                "node_type": "message",
                "msg_caption": this.replaceFunciton(msgContent["Content"]["Caption"]),
                "optionArray": [],
                "header": "",
                "footer": "",
                "response_by": msgObject["response_by"]
              })
            } else if (msgObject["content_type"] == 2) {
              this.chatList.push({
                "msg_type": "msg_out",
                "msg_for": "audio",
                "msg_data": msgContent["Content"]["MediaUrl"],
                "node_type": "message",
                // "msg_caption" :this.replaceFunciton(msgContent["Content"]["Caption"]),
                "optionArray": [],
                "header": "",
                "footer": "",
                "response_by": msgObject["response_by"]
              })
            } else if (msgObject["content_type"] == 3) {
              this.chatList.push({
                "msg_type": "msg_out",
                "msg_for": "video",
                "msg_data": msgContent["Content"]["MediaUrl"],
                "node_type": "message",
                "msg_caption": this.replaceFunciton(msgContent["Content"]["Caption"]),
                "optionArray": [],
                "header": "",
                "footer": "",
                "response_by": msgObject["response_by"]
              })
            } else if (msgObject["content_type"] == 4) {
              this.chatList.push({
                "msg_type": "msg_out",
                "msg_for": "doc",
                "msg_data": msgContent["Content"]["MediaUrl"],
                "node_type": "message",
                "msg_caption": this.replaceFunciton(msgContent["Content"]["Caption"]),
                "optionArray": [],
                "name": msgContent["Content"]["FileName"],
                "header": "",
                "footer": "",
                "response_by": msgObject["response_by"]
              })
            } else if (msgObject["content_type"] == 7) {
              this.chatList.push({
                "msg_type": "msg_out",
                "msg_for": "image",
                "msg_data": msgContent["Content"]["MediaUrl"],
                "node_type": "message",
                // "msg_caption" : this.replaceFunciton(msgContent["Content"]["Caption"]),
                "optionArray": [],
                "header": "",
                "footer": "",
                "response_by": msgObject["response_by"]
              })
            }
          } else if (msgObject["question_type"] == 2) {
            var options = [];
            var optionArray = msgContent["Content"]["Action"]["Buttons"]
            for (let optionIndex = 0; optionIndex < optionArray.length; optionIndex++) {
              options.push({
                optionName: optionArray[optionIndex]["Reply"]["Title"]
              })
            }
            var header: any;
            var footer: any;

            if ("Footer" in msgContent["Content"]) {
              footer = msgContent["Content"]["Footer"]
            } else {
              footer = {
                "Text": ""
              }
            };
            if ("Header" in msgContent["Content"]) {
              header = msgContent["Content"]["Header"]
            } else {
              header = {
                "Text": ""
              }
            };

            if (msgObject["content_type"] == 1) {
              this.chatList.push({
                "msg_type": "msg_out",
                "msg_for": "image",
                "node_type": "button",
                "msg_data": header["Image"]["MediaUrl"],
                "optionArray": options,
                "msg_caption": this.replaceFunciton(msgContent["Content"]["Body"]["Text"]),
                "header": "",
                "footer": this.replaceFunciton(footer["Text"]),
                "response_by": msgObject["response_by"]
              })
            } else if (msgObject["content_type"] == 3) {
              this.chatList.push({
                "msg_type": "msg_out",
                "msg_for": "video",
                "node_type": "button",
                "msg_data": header["Video"]["MediaUrl"],
                "optionArray": options,
                "msg_caption": this.replaceFunciton(msgContent["Content"]["Body"]["Text"]),
                "header": "",
                "footer": this.replaceFunciton(footer["Text"]),
                "response_by": msgObject["response_by"]
              })
            } else if (msgObject["content_type"] == 4) {
              this.chatList.push({
                "msg_type": "msg_out",
                "msg_for": "doc",
                "node_type": "button",
                "msg_data": header["Document"]["MediaUrl"],
                "optionArray": options,
                "msg_caption": this.replaceFunciton(msgContent["Content"]["Body"]["Text"]),
                "header": "",
                "name": header["Document"]["FileName"],
                "footer": this.replaceFunciton(footer["Text"]),
                "response_by": msgObject["response_by"]
              })
            } else if (msgObject["content_type"] == 5 ||
              msgObject["content_type"] == -1) {
              this.chatList.push({
                "msg_type": "msg_out",
                "msg_for": "msg",
                "node_type": "button",
                "msg_data": this.replaceFunciton(msgContent["Content"]["Body"]["Text"]),
                "optionArray": options,
                "msg_caption": '',
                "header": this.replaceFunciton(header["Text"]),
                "footer": this.replaceFunciton(footer["Text"]),
                "response_by": msgObject["response_by"]
              })
            }
          } else if (msgObject["question_type"] == 3) {
            var listOptions = [];
            var sectionsList = [];
            var sectionNameList = [];
            var sections = msgContent["Content"]["Action"]["Sections"];
            for (let sectionObj = 0; sectionObj < sections.length; sectionObj++) {
              sectionNameList.push(sections[sectionObj]["Title"]);
              var sectionRows = sections[sectionObj]["Rows"]
              for (let sectionIndex = 0; sectionIndex < sectionRows.length; sectionIndex++) {
                var rowObject = {
                  "optionName": sectionRows[sectionIndex]["Title"],
                  "description": sectionRows[sectionIndex]["Description"]
                }
                listOptions.push(rowObject)
              }
              sectionsList.push({
                sectionOptions: listOptions
              })
              listOptions = []
            }
            var header: any;
            var footer: any;

            if ("Footer" in msgContent["Content"]) {
              footer = msgContent["Content"]["Footer"]
            } else {
              footer = {
                "Text": ""
              }
            };
            if ("Header" in msgContent["Content"]) {
              header = msgContent["Content"]["Header"]
            } else {
              header = {
                "Text": ""
              }
            };
            if (msgObject["content_type"] == 5 || msgObject["content_type"] == -1) {
              this.chatList.push({
                "msg_type": "msg_out",
                "msg_for": "msg",
                "node_type": "list",
                "msg_data": this.replaceFunciton(msgContent["Content"]["Body"]["Text"]),
                "optionArray": sectionsList,
                "sectionNameList": sectionNameList,
                "msg_caption": "",
                "header": this.replaceFunciton(header["Text"]),
                "footer": this.replaceFunciton(footer["Text"]),
                "response_by": msgObject["response_by"]
              })
            }
          }
        }
      }
    }
    // console.log(this.chatList,"ChatLIst")
    // console.log((new Date()).getSeconds())
    this.scrollToBottom()
  }

}


