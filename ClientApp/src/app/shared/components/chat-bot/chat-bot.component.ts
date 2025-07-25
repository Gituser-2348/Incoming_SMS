import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ManageAccServiceService } from '../../../core/manage-acc-service/manage-acc-service.service';
//import { AccountsService } from '../../../views/accounts/accounts.service';
import { FlowbuilderService } from '../../../views/flow/flowbuilder.service';
import { PropertyBindingService } from '../../../views/flow/propertybuilder/propertyBinding.service';
import { SigninService } from '../../../views/sign-in/sign-in.service';
import { ChatBotService } from './chat-bot.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements OnInit {
  file: string;
  users: any = [];
  btnClick: boolean = false;
  reply: any;
  messages: any = [];
  userId: any;
  username: any;
  showEmojiPicker = false;
  files: any;
  newfile: any;
  fileUrl: any;
  caretPos: number = 0;
  userIndex: any;
  sessionCLose: boolean = false;
  minimizeWindow: boolean = false;
  tempModel: string = "chat"; //! model-name used for validating the emitted value of current model or not
  modelToPass = ''; //! model used to pass to the textareaComponent
  quickReply: any = []
  quickBox: boolean = false;
  time: any = "00:00:00";
  chatWindows: any = [];
  accountID: any;
  onBreak: string = '0';
  chatStatus: string = 'false';
  myInterval: any;
  healthUpdate: any;
  isLoggedIn: any;
  countTime: any;
  chatList: any;
  userArrayIndexMap: any = {}
  mainWindow: any = []
  windowIndexMap: any = {}
  chatObjectwithId: any = {
  }
  replays: any = {}
  chatDataOld: any;
  dateArray: any = []
  sortedDateArray: any = []
  chatOpenFlag: any = {}
  timmer: any;
  countDownDate: any;
  maxSession: any;
  getMessageListInterval: any;
  sessionEndReplys: any = {};
  // showTimmer:boolean=false;
  notificationCount: any = {};
  notifications: any = [];
  flag: number = 0;

  constructor(
   // private accService: AccountsService,
    private manageservice: ManageAccServiceService,
   // private AccService: AccountsService,
    private signInService: SigninService,
    private toastr: ToastrService,
    private chatBotService: ChatBotService,
    private detecterRef: ChangeDetectorRef,
    private propertyService: PropertyBindingService
  ) {
    this.chatBotService.getQuickReplyWhenCreate.subscribe((data: boolean) => {
      this.fetchAgentReply()
    })
  }

  ngOnInit(): void {
    var status = this.signInService.decryptData(sessionStorage.getItem('agentStatus'));
    this.onBreak = this.signInService.decryptData(sessionStorage.getItem('onBreak'));
    this.chatStatus = this.signInService.decryptData(sessionStorage.getItem('chatEnableFlag'));
    this.maxSession = this.signInService.decryptData(sessionStorage.getItem('maxSession'));
    console.log(status,'status');
    console.log(this.onBreak,'braek');
    console.log(this.chatStatus,'chatStatus');
    console.log(this.maxSession,'maxSession');




    if (this.chatStatus == undefined || this.chatStatus == 'false') {
      if (status == "0") {
        this.chatStatus = 'false';
        sessionStorage.setItem("chatEnableFlag", this.signInService.encryptData('false'));
        sessionStorage.setItem("onBreak", this.signInService.encryptData("0"));
        this.onBreak = "0"
        if (this.getMessageListInterval) {
          clearInterval(this.getMessageListInterval)
        }
      } else if (status == "1") {
        this.chatStatus = 'true';
        this.onBreak = "0"
        sessionStorage.setItem("chatEnableFlag", this.signInService.encryptData('true'));
        sessionStorage.setItem("onBreak", this.signInService.encryptData("0"));
        this.getMessageListInterval = setInterval(() => {
          this.fetchUserData()
        }, 2000);
      } else {
        this.chatStatus = 'true';
        this.onBreak = "1";
        sessionStorage.setItem("chatEnableFlag", this.signInService.encryptData('true'));
        sessionStorage.setItem("onBreak", this.signInService.encryptData("1"));
      }
    }
    if (this.chatStatus == 'true') {
      this.getMessageListInterval = setInterval(() => {
        this.fetchUserData()
      }, 2000);
    }
    if (this.onBreak == "1") {
      if (this.getMessageListInterval) {
        clearInterval(this.getMessageListInterval)
      }
      // if(sessionStorage.getItem("countDownDate")){
      //   this.countDownDate=this.signInService.decryptData(sessionStorage.getItem("countDownDate"));
      //   // this.countDown();
      // }
      this.checkOnBreak();
    }

    // if (this.onBreak == "1") {
    //   if (this.getMessageListInterval) {
    //     clearInterval(this.getMessageListInterval)
    //   }
    //   this.checkOnBreak();
    // }
    var selectAcc = this.manageservice.SelectedAccount;
    if (selectAcc) {
      this.accountID = selectAcc.Value;
      this.fetchAgentReply();
      this.fetchSessionEndReply()
    }
    //this.accService.updateHealthAgent().subscribe((data) => {
    //})
    //this.accService.updateHealthFlagDB(1).subscribe((data) => {
    //})
    this.manageservice.accountChanged.subscribe((data) => {
      if (data) {
        this.accountID = data.Value;

        this.fetchAgentReply();
        this.fetchSessionEndReply()
      }
    });
    this.healthUpdate = setInterval(() => {
      //this.accService.updateHealthAgent().subscribe((data) => {
      //})
      // console.log(this.chatObjectwithId,"ChatObjectwithIdJSON")
    }, 10000)
    this.isLoggedIn = setInterval(() => {
      //this.accService.isLoggedin().subscribe((status) => {
      //  if (status == 0) {
      //    sessionStorage.clear()
      //  }
      //})
    }, 3000)
    this.getSessionStorageDataToVariables()
  }

  ngAfterContentChecked() {
    this.detecterRef.detectChanges()
  }

  fetchUserData() {
    // console.log('entered');

    var data = {
      acc_id: this.accountID,
      user_id: this.signInService.decryptData(sessionStorage.getItem("UserID")),
      // lv_Count : 100
    }
    this.chatBotService.getUserData(data).subscribe((usersArray: any) => {

      if(usersArray!=null){
        if (usersArray.length > 0) {
          // console.log(usersArray,"User Data From Node")
          usersArray.sort(this.idComparisson)
          var chatObjectIDTempJSON = this.chatObjectwithId;
          // if (sessionStorage.getItem("chatObjectwithId")) {
          //   chatObjectIDTempJSON = JSON.parse(this.signInService.decryptData(sessionStorage.getItem("chatObjectwithId")))
          // }

          usersArray.map((data_msg) => {
            // console.log(data_msg,"chatData")
            this.notificationCount[data_msg.chat_id] = this.notificationCount.hasOwnProperty(data_msg.chat_id)? this.notificationCount[data_msg.chat_id] + 1 : 1
            // console.log(this.notificationCount,"Notification")
            if (chatObjectIDTempJSON.hasOwnProperty(data_msg.chat_id)) {
              //console.log(data_msg,"Chat")
              // data_msg["message"] = JSON.parse(data_msg["message"])
             var tempJSON = {}
          if(data_msg["message"]["Type"].toUpperCase() == "TEXT" || data_msg["message"]["Type"].toUpperCase() == "INTERACTIVE"){
            tempJSON = {
              "msg_type": "msg_in",
              "msg_for": "msg",
              "node_type": "message",
              "msg_data":this.replaceFunciton(data_msg["message"]["Text"]),
              "optionArray": [],
              "msg_caption": "",
              "header": "",
              "footer": "",
            }
          }else if(data_msg["message"]["Type"].toUpperCase() == "LOCATION"){
            tempJSON = {
              "msg_type": "msg_in",
              "msg_for": "msg",
              "node_type": "message",
              "msg_data": `<a href="https://maps.google.com/?q=${data_msg["message"]["Location"]["latitude"]},${data_msg["message"]["Location"]["longitude"]}" target="_blank">Open Map</a>`,
              "optionArray": [],
              "msg_caption": "",
              "header": "",
              "footer": "",
            }
          }else if(data_msg["message"]["Type"].toUpperCase() == "CONTACTS"){
            var contact =`<div class="contactAgentChat">`
            var contactInfo = ""
            data_msg["message"]["Contacts"].map((data,index)=>{
              let phone = ''
              if(data_msg["message"]["Contacts"][index]["phones"].length>0){
                phone=`<div class="row pb-1">
                <div class="col">Phone</div>
                <div class="col-7">${data_msg["message"]["Contacts"][index]["phones"][0]["phone"]}</div>
              </div>`
              }else{
                phone=`<div class="row pb-1">
                <div class="col">Phone</div>
                <div class="col-7">    </div>
              </div>`
              }

              contactInfo+=`<div class="row justify-content-md-center">
              <div class="ml-n2">Contact - ${index+1}</div>
              </div>
              <div class="row">
                <div class="col">Name</div>
                <div class="col-8">${data_msg["message"]["Contacts"][index]["name"]["formatted_name"]} </div>
              </div>
              ${phone}
      `
            })

            contact = contact+contactInfo+'</div>'
            tempJSON = {
              "msg_type": "msg_in",
              "msg_for": "msg",
              "node_type": "message",
              "msg_data": contact,
              "optionArray": [],
              "msg_caption": "",
              "header": "",
              "footer": "",
            }
          }else if(data_msg["message"]["Type"].toUpperCase() == "IMAGE" ||
          data_msg["message"]["Type"].toUpperCase() == "VIDEO" ||
          data_msg["message"]["Type"].toUpperCase() == "AUDIO" ||
          data_msg["message"]["Type"].toUpperCase() == "DOCUMENT" ||
          data_msg["message"]["Type"].toUpperCase() == "STICKER" ||
          data_msg["message"]["Type"].toUpperCase() == "VOICE" ){
            var url =  `<a href=${data_msg["message"]["Id"]} target="_blank">Download Media</a>`
            if(data_msg["message"]["Caption"] != "" && data_msg["message"]["Caption"] != undefined && data_msg["message"]["Caption"]!= null ){
              url+= `<div
              class="chatCaption" >${this.replaceFunciton(data_msg["message"]["Caption"])}</div>`
            }
             tempJSON = {
              "msg_type": "msg_in",
              "msg_for": "doc",
              "node_type": "message",
              "msg_data": url,
              "optionArray": [],
              "msg_caption": data_msg["message"]["Caption"],
              "header": "",
              "footer": "",
            }
          }



              this.chatObjectwithId[data_msg.chat_id].push(tempJSON)

              if(Object.keys(this.windowIndexMap).find(key => this.windowIndexMap[key] === data_msg.chat_id) !=undefined){
                this.chatWindows[Object.keys(this.windowIndexMap).find(key => this.windowIndexMap[key] === data_msg.chat_id)]['transation_id'] = data_msg.transation_id
              }
              if (document.getElementById(`msgBody${data_msg.chat_id}`) != null) {
                this.scrollToBottom(data_msg.chat_id)
              }

            }
          })
          this.makeUserArray(usersArray);
          this.makeChatWindow()

        }
      }
    })
  }

  idComparisson(obj1, obj2) {
    const id1: any = (obj1.Id)
    const id2: any = (obj2.Id)
    return id1 - id2;
  }

  makeChatWindow(){
    this.chatWindows.map((chatObj)=>{
      chatObj.messages = this.chatObjectwithId[chatObj.chat_id]
    })
  }
  makeUserArray(usersArray) {
    // usersArray.map(data => {
    //   data.notification = this.notificationCount[data.chat_id];
    //   data.message = this.getUserMessage(data.message);
    // })
    var uniqueArray = [...new Map(usersArray.map(item => [item['chat_id'], item])).values()]
    if (this.signInService.decryptData(sessionStorage.getItem('users'))) {
      var oldusers = JSON.parse(this.signInService.decryptData(sessionStorage.getItem('users')))
      var indexArray = JSON.parse(this.signInService.decryptData(sessionStorage.getItem('userArrayIndex')))
      uniqueArray.map((object: any) => {
        if (Object.keys(indexArray).includes(object.chat_id.toString())) {
          oldusers.splice(indexArray[object.chat_id], 1, object)
        } else {
          oldusers.push(object)
        }
      })
      oldusers.map((msgData)=>{
        msgData.notification = this.notificationCount[msgData.chat_id];
        msgData.message = this.getUserMessage(msgData.message);
      });
      this.users = oldusers;
      sessionStorage.setItem("users", this.signInService.encryptData(JSON.stringify(oldusers)))
      this.setUserArrayIndex()
      // console.log(this.users,"Old + New Usera")
    } else {
      uniqueArray.map((msgData:any)=>{
        msgData.notification = this.notificationCount[msgData.chat_id];
        msgData.message = this.getUserMessage(msgData.message);

      })
      this.users = uniqueArray;
      sessionStorage.setItem("users", this.signInService.encryptData(JSON.stringify(uniqueArray)))
      this.setUserArrayIndex()
      // console.log(this.users,"new Users Only")
    }
    sessionStorage.setItem("chatObjectwithId", this.signInService.encryptData(JSON.stringify(this.chatObjectwithId)))

  }

  setUserArrayIndex() {
    this.users.map((data: any, index) => {
      this.userArrayIndexMap[data.chat_id] = index
    })
    sessionStorage.setItem("userArrayIndex", this.signInService.encryptData(JSON.stringify(this.userArrayIndexMap)))
  }

  getSessionStorageDataToVariables() {
    if ((this.signInService.decryptData(sessionStorage.getItem('users')))) {
      this.users = JSON.parse(this.signInService.decryptData(sessionStorage.getItem('users')))
    }
    if ((this.signInService.decryptData(sessionStorage.getItem('userArrayIndex')))) {
      this.userArrayIndexMap = JSON.parse(this.signInService.decryptData(sessionStorage.getItem('userArrayIndex')))
    }
    if ((this.signInService.decryptData(sessionStorage.getItem('windowIndexMap')))) {
      this.windowIndexMap = JSON.parse(this.signInService.decryptData(sessionStorage.getItem('windowIndexMap')))
    }
    if (this.signInService.decryptData(sessionStorage.getItem("chatObjectwithId"))) {
      this.chatObjectwithId = JSON.parse(this.signInService.decryptData(sessionStorage.getItem("chatObjectwithId")))
    }
    if (this.signInService.decryptData(sessionStorage.getItem("chatOpenFlag"))) {
      this.chatOpenFlag = JSON.parse(this.signInService.decryptData(sessionStorage.getItem("chatOpenFlag")))
    }
  }

  fetchAgentReply() {
    var data = {
      "acc_id": this.accountID,
      "user_id": this.signInService.decryptData(sessionStorage.getItem('UserID'))
    }
    //this.AccService.fetchAgentReply(data).subscribe((res: any) => {
    //  this.quickReply = res;
    //})
  }


  getCaretPos(oField) {
    if (oField.selectionStart || oField.selectionStart == '0') {
      this.caretPos = oField.selectionStart;
    }
  }

  replaceFunciton(message) {
    if(message != null && message != undefined){
      return (
        message.toString().replaceAll('\\r\\n', "<br/>").replaceAll('\n',"<br/>")
          .replace(/(?:\*)([^*<\n]+)(?:\*)/g, "<b>$1</b>")
          .replace(/(?:_)([^_<\n]+)(?:_)/g, "<i>$1</i>")
          .replace(/(?:~)([^~<\n]+)(?:~)/g, "<strike>$1</strike>")
      );
    }
  }

  textAreaReplaceFunction(message: any) {
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

  getMessage(message, window) {
    // this.reply = message;
    this.replays[window.chat_id] = message;
  }

  showQuick(index) {
    this.chatWindows[index].quickBox = !this.chatWindows[index].quickBox;
  }
  showSessionEnd(index) {
    this.chatWindows[index].sessionEncBox = !this.chatWindows[index].sessionEncBox;
  }

  sendQuick(reply, index, window) {
    // var data = { _id: this.chatWindows[index].messages.length + 1, message: { message: '', time: '' }, reply: { reply: reply, time: '', file: '' } }
    // this.chatWindows[index].messages.push(data);
    // this.quickBox = false;
    this.replays[window.chat_id] = this.textAreaReplaceFunction(reply);
    this.replyMsg(index, window);
    this.showQuick(index)
  }
  sendSessionEnd(reply, index, window) {

    this.replays[window.chat_id] = this.textAreaReplaceFunction(reply);
    this.endSessionMessage(index, window)
    // this.replyMsg(index, window);
    // this.showSessionEnd(index)
  }

  closeQuick(index) {
    this.chatWindows[index].quickBox = false;
  }
  closeSessionEnd(window, index) {
    // this.chatWindows[index].sessionEncBox = false;
    this.callEndSessionPrc(window, index)
  }

  handleChange(val, data) {
    // if (files && files.length) {
    //   this.file = files[0].name;
    //   this.files = files[0];
    //   let reader = new FileReader();
    //   reader.onload = (event: any) => {
    //     this.fileUrl = event.target.result;
    //   }
    //   reader.readAsDataURL(this.files);
    // }
    // var contentType ;
    // if (val && val[0]) {
    //   //!if the uploaded media has less size than limit file is sent to backend and getbacks the mediaId
    //   var reader = new FileReader();
    //   reader.readAsArrayBuffer(val[0]);
    //   reader.onload = (event: ProgressEvent) => {
    //     // this.filePath = (<FileReader>event.target).result;
    //     // var newFilePath = val.target.files[0]
    //     return new Promise((resolve, reject) => {
    //       this.flowService.uploadChatMedia({
    //         file: val[0],
    //         acc_id: data.acc_id,
    //         flow_id: data.flow_id
    //       }).subscribe(
    //         (resp: any) => {
    //           resolve(JSON.parse(JSON.stringify(resp)).url);
    //         },
    //         (error) => {
    //         }
    //       );
    //     }).then((url) => {

    //       let type = val[0].type.split("/")[0]
    //       if(type == 'image'){
    //         contentType = 1
    //       }else if(type == 'audio'){
    //         contentType = 2
    //       }else if(type == 'video'){
    //         contentType = 3
    //       }
    //       let tempMessage = {

    //       }
    //       var tempData = {
    //         "service_id":"",
    //          "acc_id":data.acc_id,
    //         "flow_id":data.flow_id,
    //         "comm_id":data.communication_id,
    //         "trans_in_id":data.transation_id,
    //          "data":{
    //            "url":url
    //          },
    //         "business_num":data.business_num,
    //         "content_type":"5",
    //         }

    //       this.chatBotService.sentReply(tempData).subscribe((status)=>{
    //         if(status == 1){
    //           data.messages.push(tempMessage)
    //         sessionStorage.setItem("chatObjectwithId", this.signInService.encryptData(JSON.stringify(this.chatObjectwithId)))
    //         }else{
    //           this.toastr.warning("Warning","Something Went Wrong")
    //         }
    //       })
    //     });
    //   };

    // }
  }

  endSession(index) {
    this.chatWindows[index].sessionCLose = !this.chatWindows[index].sessionCLose;
    this.chatWindows[index].sessionEncBox = false;
    this.sessionCLose = true;
  }

  // countDown(){
  //   var count=this.countDownDate;
  //   this.timmer = setInterval(()=> {
  //     this.showTimmer=true;
  //     // Get today's date and time
  //     var now = new Date().getTime();

  //     // Find the distance between now and the count down date
  //     var distance = count-now
  //     // console.log(count,'countDownDate')
  //     // console.log(now,'distance')
  //     // Time calculations for days, hours, minutes and seconds
  //     // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  //     // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //     var minutes:any = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //     var seconds:any = Math.floor((distance % (1000 * 60)) / 1000);
  //     // Display the result in the element with id="demo"
  //     if(seconds.toString().length==1){
  //       var sec=`0${seconds}`
  //       seconds=sec;
  //       console.log(sec,'sec')
  //     }
  //     this.countTime=`${minutes}Min : ${seconds}Sec`
  //     // If the count down is finished, write some text
  //     if (distance < 0) {
  //       this.showTimmer=false;
  //       clearInterval(this.timmer);
  //     }
  //   }, 1000);
  // }

  agentBreak(detail) {
    if (detail == 'break') {
      var data = {
        data: {
          "id": this.accountID,
          "user_id": this.signInService.decryptData(sessionStorage.getItem('UserID')),
          "session_id": this.signInService.decryptData(sessionStorage.getItem("sessionId")),
          "resume_type": "manual"
        },
        type: 1
      }
      //this.accService.agentBreak(data).subscribe((data: any) => {
      //  if (data.status == 1) {
      //    this.countDownDate = new Date().getTime() + 900000;
      //    sessionStorage.setItem("countDownDate", this.signInService.encryptData(this.countDownDate));
      //    // this.countDown();
      //    sessionStorage.setItem("onBreak", this.signInService.encryptData("1"));
      //    this.onBreak = "1";
      //    clearInterval(this.getMessageListInterval)
      //    this.checkOnBreak();
      //    this.notifications.push({ notification: "Automatically resume in 15min", time: 0 })
      //    this.autoRemove();
      //    this.clearuserList()
      //    // this.toastr.success(data.message);
      //  } else {
      //    this.toastr.warning(data.message);
      //  }
      //})
    } else {
      var data = {
        data: {
          "id": this.accountID,
          "user_id": this.signInService.decryptData(sessionStorage.getItem('UserID')),
          "session_id": this.signInService.decryptData(sessionStorage.getItem("sessionId")),
          "resume_type": "manual"
        },
        type: 2
      }
      //this.accService.agentBreak(data).subscribe((data: any) => {
      //  if (data.status == 1) {
      //    sessionStorage.setItem("onBreak", this.signInService.encryptData("0"));
      //    this.onBreak = "0";
      //    this.toastr.warning(data.message);
      //    this.getMessageListInterval = setInterval(() => {
      //      this.fetchUserData()
      //    }, 2000);
      //    clearInterval(this.myInterval);
      //    // clearInterval(this.timmer);
      //    // this.showTimmer=false;
      //    sessionStorage.removeItem("countDownDate");
      //  } else {
      //    this.toastr.warning(data.message);
      //  }
      //})
    }
  }

  minWindow() {
    this.minimizeWindow = !this.minimizeWindow;
    if (this.minimizeWindow) {
      document.getElementsByTagName("app-chat-bot")[0].classList.add("minWindow")
      document.getElementById("insideDiv").style.width = "73px";
    } else {
      document.getElementsByTagName("app-chat-bot")[0].classList.remove("minWindow")
      document.getElementById("insideDiv").style.width = "96%"
    }
  }

  endSessionNow(index, window) {
    if (window.sessionEndReply != undefined) {
      this.showSessionEnd(index)
    } else {
      this.callEndSessionPrc(window, index)
    }
    // this.users.splice(this.userIndex, 1);
    // this.chatWindows.splice(index, 1)

  }

  restoreSession() {
    this.sessionCLose = false;
  }

  scrollToBottom(chat_id) {
    setTimeout(() => {
      const element = document.getElementById(`msgBody${chat_id}`);
      element.scrollTop = element.scrollHeight;
    },);
  }

  getDetails(data) {

  }

  checkOnBreak() {
    this.myInterval = setInterval(() => {
      var data = {
        "user_id": this.signInService.decryptData(sessionStorage.getItem("UserID")),
        "session_id": this.signInService.decryptData(sessionStorage.getItem("sessionId"))
      }
      //this.AccService.checkOnBreak(data).subscribe((data: any) => {
      //  console.log(data, 'checkBreak')
      //  if (data == 1) {
      //    this.agentBreak('resume')
      //    sessionStorage.setItem("onBreak", this.signInService.encryptData("0"));
      //    this.onBreak = "0";
      //    this.toastr.warning("Automatically resumed");
      //    clearInterval(this.myInterval);
      //  }
      //})
    }, 3000)
  }


  closeChat(index) {
    this.chatWindows.splice(index, 1);
    this.generateWindowIndexMap()
    // this.btnClick = !this.btnClick;
    // this.sessionCLose = false;
  }
  generateWindowIndexMap(){
    this.windowIndexMap = {};
    this.chatWindows.map((chatObj,i)=>{
      this.windowIndexMap[i]=chatObj.chat_id
    })
  }
  enableChat(data) {
    if (data == 'enable') {
      this.chatStatus = 'true';
      var value = {
        data: {
          "user_id": this.signInService.decryptData(sessionStorage.getItem("UserID")),
          "session_id": this.signInService.decryptData(sessionStorage.getItem("sessionId"))
        },
        type: 1
      }
      //this.accService.enableChat(value).subscribe((data: any) => {
      //  // console.log(data, 'fromDb');
      //  if (data.status == 1) {
      //    sessionStorage.setItem("chatEnableFlag", this.signInService.encryptData('true'));
      //    this.toastr.success(data.message);
      //    this.getMessageListInterval = setInterval(() => {
      //      this.fetchUserData()
      //    }, 2000);
      //  } else {
      //    this.toastr.warning(data.message);
      //  }
      //})
    } else {
      var value = {
        data: {
          "user_id": this.signInService.decryptData(sessionStorage.getItem("UserID")),
          "session_id": this.signInService.decryptData(sessionStorage.getItem("sessionId"))
        },
        type: 2
      }
      //this.accService.enableChat(value).subscribe((data: any) => {
      //  // console.log(data, 'fromDb');
      //  if (data.status == 1) {
      //    this.chatStatus = 'false';
      //    this.onBreak = "0";
      //    sessionStorage.setItem("chatEnableFlag", this.signInService.encryptData('false'));
      //    sessionStorage.setItem("onBreak", this.signInService.encryptData("0"));
      //    this.toastr.warning(data.message);
      //    clearInterval(this.getMessageListInterval)
      //    this.clearuserList()
      //    // this.users = []
      //    // this.chatObjectwithId = {}
      //    // this.userArrayIndexMap = {}
      //    // this.chatOpenFlag = {}
      //    // this.chatWindows = []
      //    // sessionStorage.setItem("users", this.signInService.encryptData(JSON.stringify(this.users)))
      //    // sessionStorage.setItem("chatObjectwithId", this.signInService.encryptData(JSON.stringify(this.chatObjectwithId)))
      //    // sessionStorage.setItem("userArrayIndex", this.signInService.encryptData(JSON.stringify(this.userArrayIndexMap)))
      //    // sessionStorage.setItem("chatOpenFlag", this.signInService.encryptData(JSON.stringify(this.chatOpenFlag)))

      //  } else {
      //    this.toastr.warning(data.message);
      //  }
      //})
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker
  }

  addEmoji(event) {
    var emoji = event.emoji.native;
    var curPosition = this.caretPos
    var firstString = this.reply.slice(0, curPosition)
    var secondString = this.reply.slice(curPosition)
    firstString = firstString + emoji
    var finalString = firstString + secondString
    this.reply = finalString
  }

  openChat(data) {
    // console.log(data,"Chat")
    // console.log(this.users,"user")
    this.reply = ""
    this.file = ''
    this.files = ''
    this.newfile = ''
    var flag = 0;
    this.chatWindows.map((window: any) => {
      if (window.chat_id == data.chat_id) {
        flag += 1
      } else {

      }
    })
    // if (this.chatWindows.length < 3) {
    if (flag == 0) {
      data.quickBox = false;
      this.replays[data.chat_id] = ""
      data.reply = ""
      var chatData = JSON.parse(this.signInService.decryptData(sessionStorage.getItem("chatObjectwithId")));
      this.notificationCount[data.chat_id] = 0;
      data.notification = 0;
      if (chatData.hasOwnProperty(data.chat_id) && this.chatOpenFlag[data.chat_id] == true) {
        this.chatObjectwithId = JSON.parse(this.signInService.decryptData(sessionStorage.getItem("chatObjectwithId")))
        data.messages = this.chatObjectwithId[data.chat_id]
        data.sessionEndReply = this.sessionEndReplys[data.flow_id]
        this.assignChatToWindow(data)
        this.scrollToBottom(data.chat_id)
      } else {
        this.chatBotService.getSessionMessages(data.communication_id).subscribe((obj) => {
          // console.log(obj)
          if (obj != null) {
            this.chatBotService.chatOpen(data.chat_id).subscribe((flag) => {
              // console.log(flag,"Flag")
              if (flag != 0) {
                this.chatOpenFlag[data.chat_id] = true;
                sessionStorage.setItem("chatOpenFlag", this.signInService.encryptData(JSON.stringify(this.chatOpenFlag)))
                this.chatDataOld = obj;
                for (const object in this.chatDataOld) {
                  this.dateArray.push(object);
                }

                this.sortedDateArray = this.dateArray.sort(this.dateComparison);
                setTimeout(() => {
                  this.getMessageList().then((chat) => {
                    this.chatObjectwithId[data.chat_id] = chat
                    sessionStorage.setItem("chatObjectwithId", this.signInService.encryptData(JSON.stringify(this.chatObjectwithId)))
                    data.messages = this.chatObjectwithId[data.chat_id]
                    data.sessionEndReply = this.sessionEndReplys[data.flow_id]
                    this.assignChatToWindow(data)
                    this.scrollToBottom(data.chat_id)
                  })
                },);
              } else {
                this.users.splice(this.userArrayIndexMap[data.chat_id], 1);
                this.setUserArrayIndex()
                sessionStorage.setItem("users", this.signInService.encryptData(JSON.stringify(this.users)))
                sessionStorage.setItem("userArrayIndex", this.signInService.encryptData(JSON.stringify(this.userArrayIndexMap)))
                this.toastr.warning("User already assigned to another Agent", "Warning")
                //delete user with chat_id from users list
              }
            })
          } else {
            this.toastr.warning("Something Went Wrong", "Warning")
          }
        })
      }
    }
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      // this.replyMsg()
    }
  }
  getMessagelength(message) {
    return message
      .replace(/&nbsp;/g, " ")
      .replace(/<br>/g, "")
      .trim().length != 0
  }

  replyMsg(index, window: any) {
    this.replays[window.chat_id] = this.textAreaReplaceFunction(this.replays[window.chat_id])
    // console.log(this.replays[window.chat_id],"Chat")
    if (this.getMessagelength(this.replays[window.chat_id])) {
      document.getElementById('reply_button').style.pointerEvents = 'none'
      // let transactionId ;

      var tempMessage = {
        "msg_type": "msg_out",
        "msg_for": "msg",
        "msg_data": this.replays[window.chat_id],
        "node_type": "message",
        "msg_caption": '',
        "optionArray": [],
        "header": "",
        "footer": ""
      }
      var tempData = {
        "service_id": window.service_id,
        "acc_id": window.acc_id,
        "flow_id": window.flow_id,
        "comm_id": window.communication_id,
        "trans_in_id": window.transation_id,
        "data": {
          "text": this.replays[window.chat_id]
        },
        "business_num": window.business_num,
        "content_type": "5",
        "cus_num": window.customer_num,
      }
      // console.log(window.transation_id)
      this.replays[window.chat_id] = "";
      this.chatBotService.sentReply(tempData).subscribe((status) => {
        if (status == 1) {
          // window.messages.push(tempMessage);
          this.notificationCount[window.chat_id] = 0;
          this.users[this.userArrayIndexMap[window.chat_id]].notification = 0      //!To be Tested
          this.chatObjectwithId[window.chat_id].push(tempMessage)
          sessionStorage.setItem("chatObjectwithId", this.signInService.encryptData(JSON.stringify(this.chatObjectwithId)))
          this.propertyService.lengthChange.next("data")
          this.scrollToBottom(window.chat_id);
          document.getElementById('reply_button').style.pointerEvents = 'auto'
        } else if (status == 9) {
          this.toastr.warning("Flow Deactivated", "Warning")
          this.callEndSessionPrc(window, index)
          document.getElementById('reply_button').style.pointerEvents = 'auto';
          // this.callEndSessionPrc(window,index)
        }else if (status == 2) {
          this.toastr.warning("Communication Ended Or Flow Deactivated", "Warning")
          this.chatWindows.splice(index, 1)
          this.users.splice(this.userArrayIndexMap[window.chat_id], 1);
          this.setUserArrayIndex()
          delete this.chatObjectwithId[window.chat_id]
          delete this.userArrayIndexMap[window.chat_id]
          delete this.chatOpenFlag[window.chat_id]
          sessionStorage.setItem("users", this.signInService.encryptData(JSON.stringify(this.users)))
          sessionStorage.setItem("chatObjectwithId", this.signInService.encryptData(JSON.stringify(this.chatObjectwithId)))
          sessionStorage.setItem("userArrayIndex", this.signInService.encryptData(JSON.stringify(this.userArrayIndexMap)))
          sessionStorage.setItem("chatOpenFlag", this.signInService.encryptData(JSON.stringify(this.chatOpenFlag)))

        }
        else {
          this.toastr.warning("Something Went Wrong", "Warning")
          document.getElementById('reply_button').style.pointerEvents = 'auto'
        }
      })
    }
    // this.modelToPass = ""
    this.scrollToBottom(window.chat_id);
    document.getElementById(window.chat_id).innerHTML = ""
  }

  deleteFile() {
    this.file = ''
    this.files = ''
  }


  remove_WithSpace(date) {
    if (date != null || date != undefined) {
      return date.replace(/-/g, " ");
    }
  }

  // dbCall_getSessionMessages(data) {
  //   let chatArray;
  //   this.AccService.getSessionMessages(data.communication_id).subscribe((data) => {
  //     this.chatDataOld = data;
  //     for (const object in this.chatDataOld) {
  //       this.dateArray.push(object);
  //     }

  //     this.sortedDateArray = this.dateArray.sort(this.dateComparison);
  //     chatArray = this.getMessageList()
  //     return chatArray
  //   })
  // }
  assignChatToWindow(data) {
    // console.log(this.chatWindows,"ChatWindows")
    var index = this.chatWindows.findIndex(x => x.chat_id == data.chat_id);
    if (index == -1) {
      if (this.chatWindows.length > 2) {
        this.chatWindows.splice(0, 1);
        this.chatWindows.push(data);
      } else {
        this.chatWindows.push(data);
      }
      // this.windowIndexMap[this.chatWindows.length - 1] = data.chat_id
      this.generateWindowIndexMap()
      // console.log(this.windowIndexMap,"WindowIndexMap")
      sessionStorage.setItem("windowIndexMap", this.signInService.encryptData(JSON.stringify(this.windowIndexMap)))
    }
    // console.log(this.windowIndexMap)
  }
  dateComparisonOnObject(obj1, obj2) {
    const date1: any = new Date(obj1.msg_in_time)
    const date2: any = new Date(obj2.msg_in_time)
    return date1 - date2;
  }

  dateComparison(a, b) {
    const date1: any = new Date(a)
    const date2: any = new Date(b)
    return date1 - date2;
  }
  fileHanler(data, index) {
    data.index = index
    this.chatBotService.fileHandler.next(data);
    //! used to pass the variable property to variable popUp component
  }
  async getMessageList() {
    // var jsonData = this.drawflowJSON["drawflow"]["Home"]["data"];
    this.chatList = []
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
            "msg_data":this.replaceFunciton(msgIn["Text"]),
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
          var contact =`<div class="contactAgentChat">`
          var contactInfo = ""
          msgIn["Contacts"].map((data,index)=>{
            let phone = ''
            if(msgIn["Contacts"][index]["phones"].length>0){
              phone=`<div class="row pb-1">
              <div class="col">Phone</div>
              <div class="col-7">${msgIn["Contacts"][index]["phones"][0]["phone"]}</div>
            </div>`
            }else{
              phone=`<div class="row pb-1">
              <div class="col">Phone</div>
              <div class="col-7">    </div>
            </div>`
            }

            contactInfo+=`<div class="row justify-content-md-center">
            <div class="ml-n2">Contact - ${index+1}</div>
            </div>
            <div class="row">
              <div class="col">Name</div>
              <div class="col-7">${msgIn["Contacts"][index]["name"]["formatted_name"]} </div>
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
                "msg_caption":this.replaceFunciton(msgContent["Content"]["Caption"]),
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
                // "msg_caption": this.replaceFunciton(msgContent["Content"]["Caption"]),
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
                // "msg_caption": this.replaceFunciton(msgContent["Content"]["Caption"]),
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

    // this.scrollToBottom()
    this.dateArray = [];
    this.sortedDateArray = [];
    return this.chatList;
  }

  getFileTransferData(dataFromFileUpload: any) {
    // this.chatWindows[dataFromFileUpload.data.index].messages = []
    // this.chatWindows[dataFromFileUpload.data.index].messages.push(dataFromFileUpload.messageData)

    // sessionStorage.setItem("chatObjectwithId", this.signInService.encryptData(JSON.stringify(this.chatObjectwithId)))
    // setTimeout(() => {
    // },3000 );
    this.chatBotService.sentReply(dataFromFileUpload.dbData).subscribe((status) => {
      if (status == 1) {
        this.chatWindows[dataFromFileUpload.data.index].messages.push(dataFromFileUpload.messageData)
        sessionStorage.setItem("chatObjectwithId", this.signInService.encryptData(JSON.stringify(this.chatObjectwithId)))
        this.replays[dataFromFileUpload.data.chat_id] = "";
        this.scrollToBottom(dataFromFileUpload.data.chat_id);
      } else {
        this.toastr.warning("Warning", "Something Went Wrong")
      }
    })

  }

  fetchSessionEndReply() {
    var data = {
      "acc_id": this.accountID,
      "user_id": ""
    }
    //this.AccService.fetchEndSession(data).subscribe((res: any) => {
    //  console.log(res, "EndSession Reply")
    //  if (res.length > 0) {
    //    res.map((data) => {
    //      if (this.sessionEndReplys[data.flow_id]) {
    //        this.sessionEndReplys[data.flow_id].push(data)
    //      } else {
    //        this.sessionEndReplys[data.flow_id] = []
    //        this.sessionEndReplys[data.flow_id].push(data)
    //      }
    //    })
    //    console.log(this.sessionEndReplys, "Session End Replsy against Flow")
    //  }
    //})
  }

  autoRemove() {
    if (this.flag == 0) {
      this.flag += 1
      this.timmer = setInterval(() => {
        // console.log('ent')
        if (this.notifications.length > 0) {
          this.notifications.map((data: any) => {
            data.time += 1;
          });
        } else {
          this.flag = 0;
          clearInterval(this.timmer);
        }
      }, 1000)
    }
    setTimeout(() => {
      this.notifications.shift()
    }, 5000)
  }

  endSessionMessage(index, window) {
    if (this.replays[window.chat_id] != "") {
      var tempData = {
        "service_id": window.service_id,
        "acc_id": window.acc_id,
        "flow_id": window.flow_id,
        "comm_id": window.communication_id,
        "trans_in_id": window.transation_id,
        "data": {
          "text": this.replays[window.chat_id]
        },
        "business_num": window.business_num,
        "content_type": "5",
        "cus_num": window.customer_num,
      }

      this.chatBotService.sentReply(tempData).subscribe((status) => {
        if (status == 1) {
          this.callEndSessionPrc(window, index)
        } else if (status == 9) {
          this.toastr.warning("Flow Deactivated", "Warning")
          this.callEndSessionPrc(window, index)
        }
        else {
          this.toastr.warning("Something Went Wrong", "Warning")
        }
      })
    }
    // this.modelToPass = ""
    this.scrollToBottom(window.chat_id);
    document.getElementById(window.chat_id).innerHTML = ""
  }
  callEndSessionPrc(window, index) {
    //make chat_id as array
    this.chatBotService.endSession(
      {
        "user_id": this.signInService.decryptData(sessionStorage.getItem("UserID")),
        "chat_id": [window.chat_id]
      }
    ).subscribe((endStatus) => {
      // console.log(endStatus,"End")
      if (endStatus['status'] == 1) {
        this.chatWindows.splice(index, 1)
        this.users.splice(this.userArrayIndexMap[window.chat_id], 1);
        this.setUserArrayIndex()
        delete this.chatObjectwithId[window.chat_id]
        delete this.userArrayIndexMap[window.chat_id]
        delete this.chatOpenFlag[window.chat_id]
        sessionStorage.setItem("users", this.signInService.encryptData(JSON.stringify(this.users)))
        sessionStorage.setItem("chatObjectwithId", this.signInService.encryptData(JSON.stringify(this.chatObjectwithId)))
        sessionStorage.setItem("userArrayIndex", this.signInService.encryptData(JSON.stringify(this.userArrayIndexMap)))
        sessionStorage.setItem("chatOpenFlag", this.signInService.encryptData(JSON.stringify(this.chatOpenFlag)))
      } else {
        this.toastr.warning("Something Went Wrong", "Warning")
      }
    })
  }
  clearuserList() {
    var chatIdList = []
    if (this.users.length > 0) {
      this.users.map((data) => {
        chatIdList.push(data.chat_id)
      })
      this.chatBotService.endSession(
        {
          "user_id": this.signInService.decryptData(sessionStorage.getItem("UserID")),
          "chat_id": chatIdList
        }
      ).subscribe((endStatus) => {
        // console.log(endStatus,"end")
        if (endStatus['status'] == 1) {
          this.users = []
          this.chatObjectwithId = {}
          this.userArrayIndexMap = {}
          this.chatOpenFlag = {}
          this.chatWindows = []
          sessionStorage.setItem("users", this.signInService.encryptData(JSON.stringify(this.users)))
          sessionStorage.setItem("chatObjectwithId", this.signInService.encryptData(JSON.stringify(this.chatObjectwithId)))
          sessionStorage.setItem("userArrayIndex", this.signInService.encryptData(JSON.stringify(this.userArrayIndexMap)))
          sessionStorage.setItem("chatOpenFlag", this.signInService.encryptData(JSON.stringify(this.chatOpenFlag)))
        } else {
          this.toastr.warning("Something Went Wrong", "Warning")
        }
      })
    }

  }

  getUserMessage(messageObj){
    // console.log(messageObj,"Object")
    var  messageObject = messageObj
    try{
      // messageObject = JSON.parse(messageObj)
      if(messageObject["Type"].toUpperCase() == "TEXT" || messageObject["Type"].toUpperCase() == "INTERACTIVE"){
       return(messageObject["Text"])
      }else if(messageObject["Type"].toUpperCase() == "LOCATION"){
        return("Location")
      }else if(messageObject["Type"].toUpperCase() == "CONTACTS"){
        return("Contact")
      }else if(messageObject["Type"].toUpperCase() == "IMAGE" ||
      messageObject["Type"].toUpperCase() == "VIDEO" ||
      messageObject["Type"].toUpperCase() == "AUDIO" ||
      messageObject["Type"].toUpperCase() == "DOCUMENT" ||
      messageObject["Type"].toUpperCase() == "STICKER" ||
      messageObject["Type"].toUpperCase() == "VOICE" ){
        return("Media")
      }
    }catch(er){
      return messageObject
    }

  }
  ngOnDestroy() {
    clearInterval(this.healthUpdate);
    clearInterval(this.isLoggedIn);
    clearInterval(this.getMessageListInterval);
  }
}
