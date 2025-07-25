// export interface options{
//   variable:any
// }

import { validation } from "../../../shared/components/free-text-validator/free-text-validator.modal";

export interface wpBotAsk {
  id: any;
  message: any;
  uniqueName: any;
  keyword :any;
  answerOptions: any[];
  descriptions : any [];
  connections: any;
  selectFieldvalue:any;
  multimediaFieldValue: any;
  multimediaImage: any;
  multimediaAudio: any;
  multimediaVideo: any;
  multimediaDocument: any;
  caption: caption;
  fileName: fileName;
  variable :any;
  timeout:any;
  timeoutMessage:any;
  invalidMessage :any;
  invalidresponseKey:any;
  retryMessage:any;
  retryCount:any;
  footer:any;
  listButtonName:any;
  body:any;
  header:any;
  documentFileName:any;
  sections:[{
    name:any,
    options:[options]
  }]
  validationJson :validation;
  mediaUrl:fileName;
  waitTime:any;
  expectedInput:any;
}
export interface options{
  optionName:any,
  description:any
}
export interface caption {
  image: any;
  audio: any;
  video: any;
  document: any;
}

export interface fileName {
  image: any;
  audio: any;
  video: any;
  document: any;
  sticker:any;
}

export interface location{
  latitude: any;
  longitude: any;
  name:any;
  address:any;
}
export interface wpBotSays {
  id: any;
  message: any;
  uniqueName: any;
  keyword : any;
  selectFieldvalue: any;
  multimediaFieldValue: any;
  multimediaImage: any;
  multimediaAudio: any;
  multimediaVideo: any;
  multimediaDocument: any;
  multimediaSticker: any;
  caption: caption;
  fileName: fileName;
  waitTime:any;
  documentFileName:any;
  address:[{
    city:any
    countryCode:any,
    country:any,
    street:any,
    type:any,
    zip:any
  }];
  phones:[{
    phone:any,
        phoneType:any,
        Wa_id:any
  }],
  url:[{
    url:any,
    type:any
  }]
  mediaUrl:fileName,
  location:location,
  email:[{
    email:any,
    type:any,
}],
  contact:{
    name:{
      firstName:any,
      formatedName:any,
      middleName:any,
      prefix:any,
      suffix:any,
      lastName:any,
    },
    org:{
      company:any,
      department:any,
      orgTitle:any,
    },
    birthday:any,
  };
}
export class requsetItems {
  variable:string;
  param: string;
}
export interface webhook {
  id: any;
  uniqueName: any;
  message: any;
  url: any;
  method: any;
  contentType: any;
  requestParams: any;
  responseParams: any;
  timeOut: any;
  retryCount: any;
  headerItems: requsetItems[];
  reqItems: requsetItems[];
  respItems: requsetItems[];
  answerOptions: any[];
}

export interface conditions {
  uniqueName:any,
  yes:any,
  no:any
}

export interface liveAgents{
  uniqueName:any,
  keyword:any,
  transferLogic:any,
  customerRatio:any,
  agentList:any,
  groupList:any,
  agentUnavailable:any,
  initialMessage:any,
  agentReplyWaitTime:any;
  customerTotalWaitTime:any;
}
