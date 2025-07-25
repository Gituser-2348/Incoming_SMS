import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { retry } from "rxjs/operators";
import { AppConfig } from "../../../core/AppConfig/app.config";
import { BehaviorSubject, Subject } from "rxjs";
import { media } from "./wpbotsays.modal";
import { ManageAccServiceService } from "../../../core/manage-acc-service/manage-acc-service.service";
// import * as data from '../../app-settings.json';
import { EncdeccryptoService } from "../../../shared/encdeccrypto.service";
import { PropertyBindingService } from "./propertyBinding.service";
import { FormControl } from "@angular/forms";
@Injectable({
  providedIn: "root",
})

export class wpbotsaysService {


  baseURL = AppConfig.Config.api.sms;
  // console.log("JSON Data" + data);
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }),
    responseType: "json" as const,
  };

  httpmulOptions = {
    headers: new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
    }),
    responseType: "json" as const,
  };

  //userDataSubject = new BehaviorSubject<NewAgent>({});
  currentUser = null;
  constructor(
    private http: HttpClient,
    private manageaccservice: ManageAccServiceService,
    private enc: EncdeccryptoService,
    private property: PropertyBindingService
  ) { }

  checkUrl(url) {
    return this.http.get<any>(this.baseURL + 'api/media/checkUrl?url=' + url,
      this.httpOptions)
      .pipe(retry(2));
    // const flag =await this.http.get<any>(this.baseURL + 'api/media/checkUrl?url='+url,this.httpOptions).toPromise();
    // console.log("flag",flag);
    // return flag;
  }

  uploadMedia(media) {
    var fd = new FormData();
    fd.append("file", media);
    // console.log("fd",fd);
    return this.http
      .post(this.baseURL + "api/media/uploadMedia", fd, this.httpmulOptions)
      .pipe(retry(2));
  }

  pushMockDataToDataJSON(name, obj) {
    var elementObj
    if (name == "wpBotAsk") {
      elementObj = {
        validationJSON: {
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
            ]
            ,
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
        nodeDetails: [[]],
        id: obj.id,
        num: "",
        uniqueName: obj.uniqueName,
        message: "",
        answerOptions: {
          "section_1": {
            "options": {
              "output_1": {
                "optionName": "",
                "description": "",
                "next_node": ""
              }
            }
          },
          "errorSection": {
            "sectionName": "ErrorType",
            "options": {
              "output_2": {
                "optionName": "",
                "description": "",
                "next_node": ""
              }
            }
          }
        },
        keyword: "",
        valSelectField: 1,
        valMultimediaSelect: 5,
        fileValue: "",
        caption: "",
        fileName: "",
        extensionType: "",
        timeout: 3600,
        timeoutMessage: "",
        variable: "",
        invalidMessage: "",
        invalidresponseKey: "",
        footer: "",
        retryCount: 3,
        exp_inp: 5
      }
    } else if (name == "wpBotSays") {
      elementObj = {
        nodeDetails: [[]],
        id: obj.id,
        message: "",
        fileValue: "",
        uniqueName: obj.uniqueName,
        keyword: "",
        valMultimediaSelect: 5,
        caption: "",
        fileName: "",
        location: "",
        extensionType: "",
        objectWait: "",
        contact: "",
        multimedaFieldVal: "",
        answerOptions: {
          section1: {
            options: {
              output_1: {
                optionName: "Botsays",
                description: "",
                next_node: ""
              }
            },
            sectionName: ""
          }
        },
      }
    } else if (name == "conditions") {
      elementObj = {
        yesNode: "",
        noNode: "",
        uniqueName: obj.uniqueName,
        num: "",
        variables: [{ vOne: "", vCondition: '1', vTwo: "" }],
        id: obj.id,
        message: "",
        //   answerOptions : {
        //     "section_1": {
        //         "options": {
        //             "output_1": {
        //                 "optionName": "",
        //                 "description": ""
        //             }
        //         }
        //     },
        //     "errorSection": {
        //         "sectionName": "ErrorType",
        //         "options": {
        //             "output_2": {
        //                 "optionName": "",
        //                 "description": ""
        //             }
        //         }
        //     }
        // }
      }
    } else if (name == "webhook") {
      elementObj = {
        successNode: "",
        failureNode: "",
        id: obj.id,
        message: "",
        num: "",
        uniqueName: obj.uniqueName,
        method: "2",
        type: "1",
        url: "",
        headers: [{ param: "", variable: "" }],
        reqParams: [{ param: "", variable: "" }],
        respParams: [{ param: "", variable: "" }],
        retryCount: "1",
        timeOut: "60",
        submittedFlag: false,
      }
    } else if (name == "liveAgent") {
      elementObj = {
        uniqueName: obj.uniqueName,
        keyword: "",
        transferLogic: -1,
        customerRatio: "",
        agentList: [],
        groupList: [],
        agentUnavailable: "",
        // answerOptions: {
        //   section1:{
        //     options:{
        //       output_1:{
        //         optionName:"LiveAgent",
        //         description:"",
        //         next_node:""
        //       }
        //     },
        //     sectionName:""
        //   }
        // }
        initialMessage:"",
        sticky_agent:false,
        agentReplyTime: 30,
        cust_waitTime: 1800,
        maskNumber: false,
        showName: false
      }
    }
    this.property.addDataToJson(obj.id, elementObj)
    // console.log(this.property.nodeJSON)
  }
}
