import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { flowDetail, flowDetails } from "./models/flowmodel";
import { FLOWDETAILS } from "./models/mock.flowmodel";
import { Subject } from "rxjs";
import { PropertyBindingService } from "./propertybuilder/propertyBinding.service";
import { AppConfig } from "../../core/AppConfig/app.config";
import { ManageAccServiceService } from "../../core/manage-acc-service/manage-acc-service.service";
import { EncdeccryptoService } from "../../shared/encdeccrypto.service";
import { retry } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { saveAs } from 'file-saver';
//import { AccountsService } from './../accounts/accounts.service';
import { SigninService } from "../sign-in/sign-in.service";

@Injectable({
  providedIn: "root",
})
export class FlowbuilderService {
  [x: string]: any;
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
  userInfo = {
    account_id: "",
    service_id: "",
    user_id: "",
    flow_id: "",
    ip_address: "",
    browser_info: {
      browser: "",
      version: "",
    },
    os_hostName:""
  };
  selectedVariables: any = [];
  userVariables = [
    // { name: "one", flag: 0 },
    // { name: "two", flag: 0 },
    // { name: "three", flag: 0 },
    // { name: "four", flag: 0 },
  ];
  showHelpWindow = new Subject();
  systemVariables: any;
  flowId: any;
  newReport = new Subject();
  changedFlag: any;
  storedNodeId: any = [];
  reload: number;
  refreshFlow = new Subject();
  changeFlag = new Subject();
  newNextObj = new Subject();
  flowName = new Subject();
  // FlowName:any;
  openKeyboard = new Subject();
  private flowItems = FLOWDETAILS;
  JSONData = new Subject(); //!for getting exported JSON from drawflow
  addNodeToComponent = new Subject(); //!for adding output-nodes to the component (botask,webhook,conditions)
  nodeContent = new Subject(); //!used to store html of the component while property saving for copying component
  newReq = new Subject();
  addConnection = new Subject<any>(); //!used for drawing connection from one component to another
  deleteConnection = new Subject<any>(); //!used for deleting connection (for creating only one connection from output at a time)
  removeNode = new Subject<any>(); //!for removing node from drawflow
  copyNode = new Subject<any>(); //!used to fetch node data from drawflow JSON
  eventListner = new Subject(); //!to add delete and copy event listener to copied Node
  addDatatoJSON = new Subject(); //!used to add node data (form fileds) to drawflow JSON
  passUniqueName = new Subject();
  dataFromDB = new Subject(); //!used to fetch dataFromDB
  callFlowBuilderPage = new Subject();
  fileSaved = new Subject()
  alwaysCloseKeyboard = new Subject();
  updateVariable = new Subject();
  passObjectFlags = new Subject();
  baseJSON = { drawflow: { Home: { data: {} } } }; //*BaseJSON for drawflow JSON

  // jsonArray = [];
  ObjectMaster: any = {
    "3": "conditions",
    "4": "webhook",
    "6": "liveAgent"
  }
  exportedJSON;
  uniqueNameJSON: any = {};
  keywordJSON: any = {}
  JSON = {
    design: {
      drawflow: {
        Home: {
          data: {},
        },
      },
    },
    data: {
      "1": {
        answerOptions: {
          section_1: {
            options: {
              output_1: {
                optionName: "",
                description: "",
                next_node: ""
              },
            },
          },
        },
      },
    },
  };
  linkJOSN = {
    link: {},
  };
  datatoimport = {
    drawflow: {
      Home: {
        data: {},
      },
    },
  };
  agentList: Array<any> = [];
  groupList: Array<any> = [];
  constructor(
    private manageaccservice: ManageAccServiceService,
    private http: HttpClient,
    private property: PropertyBindingService,
    private enc: EncdeccryptoService,
    private toastr: ToastrService,
   // private accountService: AccountsService,
    private signInService: SigninService
  ) {
    this.newReport.subscribe((data: any) => {
      // console.log(data, 'config');
      this.flowId = data.id
    })

    this.refreshFlow.subscribe((data) => {
      this.reload = 1;
      // console.log(this.reload, "re");
      // window.location.reload();
    });

    // this.flowName.subscribe((data) => {
    //   this.FlowName = data;
    // });
    // this.getSystemVariables().subscribe((variables) => {
    //   this.systemVariables = variables
    //   // console.log(this.systemVariables,"System Variables")
    // })
    this.changeFlag.subscribe((data) => {
      if (data == "destroy") {
        for (let i = 0; i < this.selectedVariables.length; i++) {
          try {
            this.userVariables[this.selectedVariables[i]].flag -= 1;
          } catch (err) { }
        }
        this.selectedVariables = [];
      } else if (data == "add") {
        for (let i = 0; i < this.selectedVariables.length; i++) {
          try {
            this.userVariables[this.selectedVariables[i]].flag += 1;
          } catch (err) { }
        }
      }
      // console.log(this.userVariables, "done");
    });
    // this.checkIPaddress().subscribe((data: any) => {
    //   // console.warn(data,"IP");
    //   this.userInfo.ip_address = data.ip;
    // });
    var browser = this.checkBrowserDetials();
    this.userInfo.browser_info.browser = browser.name;
    this.userInfo.browser_info.version = browser.version;
    this.userInfo.os_hostName = browser.osType;
    // this.generateData();
    // this.generateHTML();
    // this.property.nodeJSON = this.JSON.data;
    this.dataFromDB.subscribe((data: any) => {
      // console.log(data, "dataFromDB");
      this.JSON.design = data;
      this.storeNodeId(data);
      this.generateData();
      this.generateUniqueNameFromData();
      this.generateKeywordFromData()
      this.property.nodeJSON = this.JSON.data;
      this.property.uniqueJSON = this.uniqueNameJSON;
      this.property.keywordJSON = this.keywordJSON;

      // console.log(this.uniqueNameJSON, "Unique", this.keywordJSON, "Keyword")

      this.callFlowBuilderPage.next(true);
    });
    this.JSONData.subscribe((data: any) => {
      //!getting DrawflowJSON from the export
      this.exportedJSON = data["tempJSON"];
      this.jsonCompare(data["flag"]);
    });
  }
  // addEle(id, html) {
  //   this.jsonArray.push({ id: id, html: html });
  // }
  importAndTemplate(data){
    this.exportedJSON = data["tempJSON"];
    this.jsonCompare(data["flag"]);
  }
  getDataForFlow(data: any) {
    this.callgetuserVariable(data);  //*for assigning UserDefinedVariables
    this.accountService.fetchAllAgents({ acc_id: data.acc_id }).subscribe((agentListObject: any) => {
      // console.log(agentListObject,"Agent Fetch")
      if (agentListObject.length > 0) {
        this.agentList = []
        agentListObject.map((agents: any) => {
          this.agentList.push({
            id: agents.user_id,
            name: agents.name
          })
        })
      }
    })
    this.accountService.fetchGroups(data.acc_id).subscribe((groupsObject: any) => {
      if (groupsObject.length > 0) {
        this.groupList = []
        groupsObject.map((groups: any) => {
          this.groupList.push(
            {
              id: groups['data_out'].id,
              name: groups['data_out'].name
            }
          )
        })
      }
    })
  }

  storeNodeId(data) {
    var value = data.drawflow.Home.data;
    var length = value[Object.keys(value)[Object.keys(value).length - 1]].id
    for (let i = 1; i <= length; i++) {
      if (value[i] != undefined) {
        var nodeId = value[i].id;
        this.storedNodeId.push(nodeId);
      }
    }
    // console.log(this.storedNodeId, "storedNodeId");
  }

  getDate(id) {
    return this.http
      .get(
        this.baseURL + "api/flow/getDate?data=" + JSON.stringify(id), this.httpOptions
      )
      .pipe(retry(2));
  }

  getTemplates(id) {
    return this.http.get(
      this.baseURL + "api/flow/getTemplates?data=" + JSON.stringify(id), this.httpOptions
    )
      .pipe(retry(2));
  }

  getSystemVariables() {
    return this.http
      .get(
        this.baseURL + "api/flow/getSystemVariables",
        this.httpOptions
      )
      .pipe(retry(2));
  }
  getUserDefinedVariables(data) {
    return this.http
      .get(
        this.baseURL + "api/flow/getUserDefinedVariables?data=" + JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(2));
  }

  dataCompare(data) {
    return this.http
      .get(
        this.baseURL + "api/flow/dataCompare?mode=" + this.enc.encrypt(JSON.stringify(data)),
        this.httpOptions
      )
      .pipe(retry(2));
  }

  removeVariable(index) {
    if (this.userVariables[index].flag == 0) {
      this.userVariables.splice(index, 1);
    } else {
      this.toastr.warning("Variable Already In Use");
    }

    // console.log(this.userVariables);
  }
  changeValue(index) {
    this.selectedVariables.push(index);
    try {
      this.userVariables[index].flag += 1;
    } catch (err) {

    }
  }
  addVariable(name, flowid) {
    // console.log(flowid, 'old variable');
    // var newObj: any = { name: `${data}`, flag: 0 };
    var data;
    if (flowid != "") {
      data = {
        "acc_id": this.userInfo.account_id,
        "flow_id": flowid,
        "variable": name,
        "flag": 0,
        "new_flow_id": this.userInfo.flow_id
      }
    } else {
      data = {
        "acc_id": this.userInfo.account_id,
        "flow_id": this.userInfo.flow_id,
        "variable": name,
        "flag": 0,
        "new_flow_id": flowid
      }
    }
    // console.log(data, "Variable Call Data")
    this.addUserVariableToDB(data).subscribe((data) => {
      // console.log(data, "userVariables")
      this.callgetuserVariable({
        "acc_id": this.userInfo.account_id,
        "flow_id": this.userInfo.flow_id
      })
    })
    // this.userVariables.push(newObj);
    // console.log(this.userVariables);

    //   this.allVariables=this.systemVariables.concat(this.flowService.userVariables)
  }
  addUserVariableToDB(data) {
    return this.http
      .post(this.baseURL + "api/flow/addUserVariable", data, this.httpOptions)
      .pipe(retry(2));
  }
  addFlow(model: flowDetail) {
    // console.log(model, "model");
    return this.http
      .post(this.baseURL + "api/flow/addFlowDetails", model, this.httpOptions)
      .pipe(retry(2));
  }

  deleteReport(model: any) {
    return this.http
      .post(this.baseURL + "api/report/deleteReport", model, this.httpOptions).pipe(retry(2));
  }

  callgetuserVariable(data) {
    this.getUserDefinedVariables(data).subscribe((data: any) => {
      // console.log(data, "userVariables123");
      if (data != null) {
        this.userVariables = data;
        this.updateVariable.next(data)
      } else {
        this.userVariables = [];
        this.updateVariable.next(data)
      }
    })
  }
  getFlowDetail(model: any) {
    model.account_id = `${this.manageaccservice.SelectedAccount.Value}`;
    // model.service_id = `${this.manageaccservice.SelectedService.Value}`;
    model.user_id = this.signInService.decryptData(sessionStorage.getItem("UserID"));
    // console.log(model, "Model");
    return this.http
      .get(
        this.baseURL + "api/flow/getFlowDetails?mode=" + this.enc.encrypt(JSON.stringify(model)),
        this.httpOptions
      )
      .pipe(retry(2));
  }

  jsonCompare(flag) {
    //!Converting html field in the drawflow default JSON to "" string for DB
    this.linkJOSN = {
      link: {},
    }
    var data = this.exportedJSON.drawflow.Home.data;
    var number = 1;
    for (const i in data) {
      var jsonObject = data[i];
      jsonObject.html = "";
      for (const ele in this.property.nodeJSON) {
        if (ele == i) {
          // console.log(this.property.nodeJSON[ele])
          var outputs = data[i]["outputs"];
          var answerOptions = this.property.nodeJSON[ele]["answerOptions"];
          // console.log(outputs,answerOptions)
          for (const output in outputs) {
            // console.log(output)
            for (const answer in answerOptions) {
              for (const outs in answerOptions[answer].options) {
                // console.log(outs,"outs",output,"output")
                // if (output == outs) {
                //   // console.log(outputs[output].connections[0])
                //   // try {
                //   //   answerOptions[answer].options[outs]["next_node"] =
                //   //     outputs[output]["connections"][0]["node"];
                //   // } catch (err) {}
                //   try{
                //     this.linkJOSN.link[number]={
                //       "fromOperator":i,
                //       "answerOption":answerOptions[answer].options[outs]["optionName"],
                //       "toOperator":outputs[output].connections[0].node,
                //     }
                //     number++;
                //   }catch(err){}
                // }
                if (output == outs) {
                  // console.log(outs.split("_"),"Outs")
                  try {
                    var outputNode;
                    // console.log(outputs[outs],"outputs[outs]")
                    if (outputs[outs].connections.length > 0) {
                      outputNode = outputs[output].connections[0].node;
                    } else {
                      outputNode = "";
                    }

                    if (data[i]["name"] == "conditions") {
                      var conditionArray = this.property.nodeJSON[ele]["variables"]
                      var arrayIndex = parseInt(outs.split("_")[1]) - 1
                      if (arrayIndex == conditionArray.length) {
                        this.linkJOSN.link[number] = {
                          fromNode: i,
                          answerOption: "Invalid/Other",
                          toNode: outputNode,
                        };
                      } else {
                        this.linkJOSN.link[number] = {
                          fromNode: i,
                          vOne: conditionArray[arrayIndex]["vOne"],
                          answerOption: conditionArray[arrayIndex]["vTwo"],
                          vCondition: conditionArray[arrayIndex]["vCondition"],
                          toNode: outputNode,
                        };
                      }

                    } else {
                      this.linkJOSN.link[number] = {
                        fromNode: i,
                        answerOption:
                          answerOptions[answer].options[outs]["optionName"],
                        toNode: outputNode,
                      };
                    }
                    // this.linkJOSN.link[number] = {
                    //   fromNode: i,
                    //   answerOption:
                    //     answerOptions[answer].options[outs]["optionName"],
                    //   toNode: outputNode,
                    // };

                    number++;
                  } catch (err) { }
                }
              }
            }
          }
          data[i]["properties"] = this.property.nodeJSON[ele];
        }
      }
      // console.log(jsonObject.id)
    }
    this.baseJSON.drawflow.Home.data = data; //!adding changed HTML to the baseJOSN for storing to DB
    // console.log(this.linkJOSN,"link")
    if (this.userInfo.browser_info.browser == "") {
      var browser = this.checkBrowserDetials();
      this.userInfo.browser_info.browser = browser.name;
      this.userInfo.browser_info.version = browser.version;
      this.userInfo.os_hostName = browser.osType
    }
    if (this.userInfo.ip_address == "") {
      // console.log("called")
      this.checkIPaddress().subscribe((data: any) => {
        this.userInfo.ip_address = data.ip;
      });
    }
    var dataToDB = {
      account_id: this.userInfo.account_id,
      // service_id: this.userInfo.service_id,
      user_id: this.userInfo.user_id,
      flow_id: this.userInfo.flow_id,
      data: this.baseJSON,
      flag: flag.toString(),
      user_info: {
        ip_address: this.userInfo.ip_address,
        browser_name: this.userInfo.browser_info.browser,
        browser_version: this.userInfo.browser_info.version,
        os_hostName: this.userInfo.os_hostName,
        os_userName: "",
      },
      // link:this.linkJOSN
    };
    console.log(this.linkJOSN, "dataToDB");
    console.log(dataToDB, "data to DB");

    this.insertFlowToDB(dataToDB).subscribe((data) => {
      // console.log(data, "data");
      if (data["flag"] == 1) {
        if (data["status"] == 1) {
          this.toastr.success("Flow Saved Successfully");
        } else {
          this.toastr.error("Flow Not Saved");
        }
      }
    });
  }
  insertFlowToDB(data) {
    // console.log(data,"data")
    // s.baseURL + "api/flow/getFlowDetails?mode="+ JSON.stringify(model),
    var object = {
      link: this.linkJOSN,
      data: data
    }
    // return this.http.post(
    //   `${this.baseURL}api/flow/addnewFlow?link=${JSON.stringify(
    //     this.linkJOSN
    //   )}`,
    //   data,
    //   this.httpOptions
    // );
    return this.http.post(
      `${this.baseURL}api/flow/addnewFlow`,
      object,
      this.httpOptions
    );
  }
  assignUserInfo(data) {
    this.userInfo.account_id = data.account_id;
    this.userInfo.flow_id = data.flow_id;
    // this.userInfo.service_id = data.service_id;
    this.userInfo.user_id = data.user_id;
  }
  fetchFlowFromDB(data) {
    // console.log(data, "data service Angular");
    this.userInfo.account_id = data.account_id;
    this.userInfo.flow_id = data.flow_id;
    // this.userInfo.service_id = data.service_id;
    this.userInfo.user_id = data.user_id;
    return this.http
      .get(
        `${this.baseURL}api/flow/getExistingFlow?data=${JSON.stringify(data)}`,
        this.httpOptions
      )
      .pipe(retry(2));
  }
  uploadMedia(media) {
    var fd = new FormData();
    fd.append("file", media);
    // console.log(fd, "fd");
    var flowData = {
      accountId: this.userInfo.account_id,
      flowId: this.userInfo.flow_id
    }
    return this.http
      .post(this.baseURL + `api/mediaServer/upload-media?account=${JSON.stringify(flowData)}`, fd, this.httpmulOptions)
    // .pipe(retry(2));
  }
  uploadChatMedia(data) {
    var fd = new FormData();
    fd.append("file", data.file);
    // console.log(fd, "fd");
    var flowData = {
      accountId: data.acc_id,
      flowId: data.flow_id
    }
    return this.http
      .post(this.baseURL + `api/mediaServer/upload-media?account=${JSON.stringify(flowData)}`, fd, this.httpmulOptions)
  }

  checkIPaddress() {
    // console.log("CheckIp");
    return this.http.get("https://api.ipify.org/?format=json");
    // return this.http
    //   .get(`${this.baseURL}api/flow/checkIp`, this.httpOptions)
    //   .pipe(retry(2));
  }
  checkBrowserDetials() {
    var userAgent = navigator.userAgent;
    const agent = window.navigator.userAgent.toLowerCase();
    var browser = {
      name: "",
      version: "",
      osType: ""
    };
    switch (true) {
      case agent.indexOf("edge") > -1:
        browser.name = "MS Edge";
        break;
      case agent.indexOf("edg/") > -1:
        browser.name = "Edge ( chromium based)";
        break;
      case agent.indexOf("opr") > -1 && !!(<any>window).opr:
        browser.name = "Opera";
        break;
      case agent.indexOf("chrome") > -1 && !!(<any>window).chrome:
        browser.name = "Chrome";
        break;
      case agent.indexOf("trident") > -1:
        browser.name = "MS IE";
        break;
      case agent.indexOf("firefox") > -1:
        browser.name = "Mozilla Firefox";
        break;
      case agent.indexOf("safari") > -1:
        browser.name = "Safari";
        break;
      default:
        browser.name = "other";
    }
    var tem;
    var matchTest =
      userAgent.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];

    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      browser.version = "IE " + (tem[1] || "");
    }
    if (matchTest[1] === "Chrome") {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null)
        browser.version = tem.slice(1).join(" ").replace("OPR", "Opera");
    }
    matchTest = matchTest[2]
      ? [matchTest[1], matchTest[2]]
      : [navigator.appName, navigator.appVersion, "-?"];
    if ((tem = userAgent.match(/version\/(\d+)/i)) != null)
      matchTest.splice(1, 1, tem[1]);
    browser.version = matchTest.join(" ");
    var OS = "Unknown";
    if (navigator.appVersion.indexOf("Win") != -1) OS = "Windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OS = "MacOS";
    if (navigator.appVersion.indexOf("X11") != -1) OS = "UNIX";
    if (navigator.appVersion.indexOf("Linux") != -1) OS = "Linux";
    browser.osType = OS
    return browser;
  }

  dataToImport() {
    //!for getting drawflow JSON to flowbuilder Component
    this.datatoimport = this.JSON.design;
    return this.datatoimport;
  }

  activateFlow(activationDetails) {
    // console.log(activationDetails, "activationDetails Activate Flow");
    activationDetails["userInfo"]=this.userInfo
    return this.http
      .get(
        `${this.baseURL}api/flow/activateflow?data=${JSON.stringify(
          activationDetails
        )}`,
        this.httpOptions
      )
      .pipe(retry(2));
  }

  startFLow(startingDetails, activityFlag) {
    // console.log(startingDetails,activityFlag,"startingDetails");
    return this.http
      .get(
        `${this.baseURL}api/flow/startflow?data=${JSON.stringify(
          startingDetails
        )}&activityFlag=${activityFlag}`,
        this.httpOptions
      )
      .pipe(retry(2));
  }

  deleteFlow(flowData) {
    // console.log(flowData, "Flow Data");
    return this.http
      .post(
        `${this.baseURL}api/flow/deleteflow?data=${JSON.stringify(
          flowData
        )}`,
        this.httpOptions
      )
      .pipe(retry(2));
  }

  deActivateFlow(activationDetails) {
    // activationDetails["ip"] = this.userInfo.ip_address;
    activationDetails["userInfo"]=this.userInfo
    // console.log(activationDetails, "activationDetails DeactivateFlow Flow");
    return this.http
      .get(
        `${this.baseURL}api/flow/deActivateflow?data=${JSON.stringify(
          activationDetails
        )}`,
        this.httpOptions
      )
      .pipe(retry(2));
  }

  // deleteFlow(flow: flowDetails) {
  //   this.flowItems.splice(this.flowItems.indexOf(flow), 1);
  // }

  exportFlowWriteFile(flowJSON: any, fileName, accountInfo) {
    var accountInfoWithJSON = { ...accountInfo, flowJSON: JSON.stringify(flowJSON) };
    return this.http.post(
      `${this.baseURL}api/flow/exportflowwritefile?name=${fileName}`,
      accountInfoWithJSON,
      this.httpOptions
    )
      .pipe(retry(2));
  }
  exportFlowGetFile(fileName, accountInfo) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    this.http.get(
      `${this.baseURL}api/flow/exportflowgetfile?name=${fileName}
      &account=${accountInfo.account_id}`
      // &service=${accountInfo.service_id}`
      ,
      { headers, responseType: "blob" }
    )
      .toPromise().then(data => {
        saveAs(data, `${fileName}.json`)
        // this.fileSaved.next(true)
        this.toastr.success("Flow Exported Successfully", "Success");
      })
      .catch(err => {
        return { "status": 0 };
      })
  }

  checkInitialConnection(jsonFromDB: any) {
    // console.log(jsonFromDB, "jsonFromDB");
    if (jsonFromDB["drawflow"]["Home"]["data"]["1"]["outputs"]["output_1"]["connections"].length > 0) {
      //! Need to complete during activation Pahse
      //*(LG)=>Fetch[1].["inputs"].length>0
      //*(if(LG !Wrk)=>Need to Work)
      return true;
    } else {
      return false
    }
  }

  generateUniqueName(nodeName) {
    //!function for creating uniqueName for each objects
    let uniqueName = nodeName;
    let counter = 1;
    try {
      uniqueName = uniqueName + counter;
      var uniqueJSON = this.property.uniqueJSON;

      if (uniqueJSON == null || JSON.stringify(uniqueJSON) == "{}") {
        return uniqueName;
      } else {
        var nameArray = [0];
        for (const object in uniqueJSON) {
          if (uniqueJSON[object].name.indexOf(nodeName) !== -1) {
            //var splited= uniqueJSON[object].name.split('_',2);
            var secondString = uniqueJSON[object].name.substring(
              nodeName.length,
              uniqueJSON[object].name.length
            );
            if (secondString != "" && !isNaN(secondString)) {
              nameArray.push(Number(secondString));
            }
          }
        }
        var max = Math.max(...nameArray);
        uniqueName = nodeName + (max + 1);
      }
    } catch (e) { }
    return uniqueName;
  }
  generateUniqueNameFromData() {
    this.uniqueNameJSON = {}
    var objects = this.JSON.design.drawflow.Home.data;
    for (const objectId in objects) {
      // console.log(objects[objectId])
      if (objects[objectId]["properties"]["uniqueName"] != undefined
        && objects[objectId]["properties"]["uniqueName"] != ""
        && objects[objectId]["properties"]["uniqueName"] != null) {
        var uniqueName = objects[objectId]["properties"]["uniqueName"];
        // console.log(uniqueName,"Name")
        this.uniqueNameJSON[objectId] = {
          id: objectId,
          name: uniqueName,
        };
      }
    }
  }
  generateKeywordFromData() {
    this.keywordJSON = {};
    var objects = this.JSON.design.drawflow.Home.data;
    for (const objectId in objects) {
      //console.log(objects[objectId])
      if (objects[objectId]["properties"]["keyword"] != undefined
        && objects[objectId]["properties"]["keyword"] != ""
        && objects[objectId]["properties"]["keyword"] != null) {
        var keyword = objects[objectId]["properties"]["keyword"];
        this.keywordJSON[objectId] = {
          id: objectId,
          keyword: keyword,
        };
      }
    }
  }
  generateData() {
    // delete this.JSON.data
    // this.JSON["data"] = {};
    var objects = this.JSON.design.drawflow.Home.data;
    for (const objectId in objects) {
      // console.log(objects[objectId])
      var properties = objects[objectId]["properties"];
      this.JSON.data[objectId] = properties;
    }
    // console.log(JSON.design,"design")
    // console.log(this.JSON.data,"data")
    this.generateHTML();
  }

  generateHTML() {
    //!creating HTML file for drawflow JSON generated dynamically
    // console.log(JSON.design.drawflow.Home.data)
    var id;
    var objects = this.JSON.design.drawflow.Home.data;
    var html;
    for (const objectId in objects) {
      id = objectId;
      //  console.log(objects[id].name)
      var nodeName = objects[id].name; //* getting Nodename of each object
      if (nodeName == "welcome") {
        html = this.createWelcomeHTML();
        this.JSON.design.drawflow.Home.data[id]["html"] = html;
        // console.log(html,'\n')
      } else if (nodeName == "wpBotSays" || nodeName == "wpBotAsk") {
        html = this.createBotComponentHTML(id, nodeName);
        this.JSON.design.drawflow.Home.data[id]["html"] = html;
        // console.log(html,'\n')
      } else if (nodeName == "conditions" || nodeName == "webhook" || nodeName == "liveAgent") {
        html = this.createLogisticComponentHTML(id, nodeName);
        this.JSON.design.drawflow.Home.data[id]["html"] = html;
        // console.log(html ,"\n")
      }
    }
    // this.datatoimport["drawflow"]["Home"]["data"] = this.JSON.design.drawflow.Home.data
    // this.datatoimport = this.JSON.design
  }


  createWelcomeHTML() {
    //!creating welcome component HTML
    var html;
    return (html = `
    <div class="d-flex">
      <div class="welcome-icon">
        <i class="fab fa-whatsapp text-success"></i>
        <div class="NodeHeader" style="display:none">welcome</div>
      </div>
    </div>`);
  }

  createBotComponentHTML(id, nodeName) {
    //!creating Bot component HTML like botask botSays
    var elementName, elementIcon;
    var elementData = this.JSON.data[id];
    var content;
    var keyword;
    var contact = elementData.contact;
    var location = elementData.location;
    if (elementData.keyword == undefined || elementData.keyword == "") {
      keyword = "";
    } else {
      keyword = elementData.keyword;
    }
    if (contact != "" && contact != undefined) {
      if (contact.firstName == undefined || contact.firstName == "") {
        contact.firstName = "";
      }
      if (contact.formatedName == undefined || contact.formatedName == "") {
        contact.formatedName = "";
      }
      if (contact.email == undefined || contact.email == "") {
        contact.email = "";
      }
      if (contact.phone == undefined || contact.phone == "") {
        contact.phone = "";
      }
      if (contact.address == undefined || contact.address == "") {
        contact.address = "";
      }
      if (contact.city == undefined || contact.city == "") {
        contact.city = "";
      }
    }
    if (location != "" && location != undefined) {
      if (location.latitude == undefined || location.latitude == "") {
        location.latitude = "";
      }
      if (location.longitude == undefined || location.longitude == "") {
        location.longitude = "";
      }
      if (location.address == undefined || location.address == "") {
        location.address = "";
      }
      if (location.name == undefined || location.name == "") {
        location.name = "";
      }
    }
    //*changing content for Botsays and Botask
    if (nodeName == "wpBotSays") {
      elementName = "Bot Says";
      elementIcon = "bi-chat-dots";
      var message = elementData.message;
      if (message == undefined || message == "") {
        message = "Welcome to my store";
      } else {
        message = message.replace(/ /g, "&nbsp;").replace(/\\"/g, '"');
      }

      // console.log(message,"Message");
      // var selectionField = elementData.valSelectField; //*Text/Multimedia
      var multimediaSelectionField = elementData.valMultimediaSelect; //*Img/vdeo/audio/file
      var mediaFile = elementData.fileValue;
      var caption = elementData.caption;
      if (caption != undefined && caption != "") {
        caption = caption.replace(/ /g, "&nbsp;").replace(/\\"/g, '"');
      }
      var extensionType = elementData.extensionType;
      // console.log(selectionField,typeof(selectionField))
      if (multimediaSelectionField == 1) {
        content = `
        <div class="wp-box wp-box-media">
        <div class="msgComponent">
          <div class="d-flex">
             <img
                src=${mediaFile}
                class="ml-auto mr-auto"
                draggable="false"
                style="height: 100px; width: 200px;">
          </div>
          <div>${caption}</div>
        </div>
    </div>
           `;
      } else if (multimediaSelectionField == 2) {
        content = `
          <div class="wp-box wp-box-media">
            <div class="msgComponent">
              <div class="d-flex">
                 <audio
                    class="mb-4 mt-4 ml-2 mr-2"
                    controls=""
                    style="width: 200px;">
                    <source src=${mediaFile}>
                 </audio>
              </div>
              <div>${caption}</div>
              </div>
              </div>
           `;
      } else if (multimediaSelectionField == 3) {
        content = `
        <div class="wp-box wp-box-media">
        <div class="msgComponent">
              <div class="d-flex">
                 <video
                    class="ml-auto mr-auto"
                    controls=""
                    style="width: 200px; height: 100px;">
                    <source src=${mediaFile}>
                 </video>
              </div>
              <div>${caption}</div>
              </div>
              </div>
           `;
      } else if (multimediaSelectionField == 4) {
        var imgPath;
        if (extensionType == "pdf") {
          imgPath = "assets/images/pdf.png";
        } else if (extensionType == "docx" || extensionType == "doc") {
          imgPath = "assets/images/word.png";
        } else if (extensionType == "xlsx" || extensionType == "xls") {
          imgPath = "assets/images/sheets.png";
        }
        content = `
        <div class="wp-box wp-box-media">
        <div class="msgComponent">
              <div class="d-flex">
                 <img
                    src=${imgPath}
                    class="ml-auto mr-auto"
                    draggable="false"
                    style="height: 80px; width: 80px;">
              </div>
              <div>${caption}</div>
              </div>
              </div>
           `;
      } else if (multimediaSelectionField == 5) {
        content = `
             <div class="wp-box">
                <div class="msgComponent">${message}</div>
             </div>`;
      } else if (multimediaSelectionField == 6) {
        var contactPNG = "assets/images/contact.png";
        content = `
        <div class="wp-box wp-box-media">
        <div class="msgComponent">
        <div class="d-flex">
          <div>
            <img
            src=${contactPNG}
            draggable="false"
            style="height: 40px; width: 40px;">
          </div>
          <div class="ml-3">
            <div class="font-weight-bold">:${contact.firstName}</div>
            <div class="font-weight-bold">:${contact.formatedName}</div>
          </div>
        </div>
        <div>
          <div class="row">
            <div class="col-sm font-weight-bold">Address</div>
            <div class="col-sm">:${contact.city}</div>
          </div>
          <div class="row">
            <div class="col-sm"></div>
            <div class="col-sm">:${contact.country}</div>
          </div>
          <div class="row mt-1">
            <div class="col-sm font-weight-bold">Tel</div>
            <div class="col-sm">:${contact.phone}</div>
          </div>
          <div class="row">
            <div class="col-sm font-weight-bold">E-mail</div>
            <div class="col-sm">:${contact.email}</div>
          </div>
      </div>
      </div>
              </div>`;
      } else if (multimediaSelectionField == 7) {
        content = `
        <div class="wp-box wp-box-media">
        <div class="msgComponent">
          <div class="d-flex">
          <img
              src=${mediaFile}
              class="ml-auto mr-auto"
              draggable="false"
              style="height: 100px; width: 200px;">
          </div>
          </div>
              </div>
      `;
      } else if (multimediaSelectionField == 8) {
        content = `
        <div class="wp-box wp-box-media">
        <div class="msgComponent">
        <div>
          <div class="row">
            <div class="col-sm font-weight-bold">Latitude</div>
            <div class="col-sm">:${location.latitude}</div>
          </div>
          <div class="row mt-1">
            <div class="col-sm font-weight-bold">Longitude</div>
            <div class="col-sm">:${location.longitude}</div>
          </div>
          <div class="row mt-1">
            <div class="col-sm font-weight-bold">Name</div>
            <div class="col-sm">:${location.name}</div>
          </div>
          <div class="row mt-1">
            <div class="col-sm font-weight-bold">Address</div>
            <div class="col-sm">:${location.address}</div>
          </div>
        </div>
        </div>
              </div>`;
      }
    } else if (nodeName == "wpBotAsk") {
      elementName = "Bot Asks";
      elementIcon = "bi-question-circle";
      var message = elementData.message;
      if (message == "" || message == undefined) {
        message = "Bot Ask";
      } else {
        message = message.replace(/ /g, "&nbsp;").replace(/\\"/g, '"');
      }
      var selectionField = elementData.valSelectField; //Text/Multimedia
      var multimediaSelectionField = elementData.valMultimediaSelect; //Img/vdeo/audio/file
      var mediaFile = elementData.fileValue;
      var caption = elementData.caption;
      if (caption != undefined && caption != "") {
        caption = caption.replace(/ /g, "&nbsp;").replace(/\\"/g, '"');
      }
      var extensionType = elementData.extensionType;

      if (
        selectionField == 1 ||
        selectionField == 2 ||
        selectionField == 3 ||
        selectionField == 4
      ) {
        if (multimediaSelectionField == 1) {
          content = `
          <div class="wp-box wp-box-media">
            <div class="msgComponent">
              <div class="d-flex">
                 <img
                    src=${mediaFile}
                    class="ml-auto mr-auto"
                    draggable="false"
                    style="height: 100px; width: 200px;">
              </div>
              <div>${caption}</div>
            </div>
        </div>
           `;
        } else if (multimediaSelectionField == 2) {
          content = `
          <div class="wp-box wp-box-media">
          <div class="msgComponent">
        <div class="d-flex">
           <audio
              class="mb-4 mt-4 ml-2 mr-2"
              controls=""
              style="width: 200px;">
              <source src=${mediaFile}>
           </audio>
        </div>
        <div>${caption}</div>
        </div>
        </div>
     `;
        } else if (multimediaSelectionField == 3) {
          content = `
          <div class="wp-box wp-box-media">
          <div class="msgComponent">
        <div class="d-flex">
           <video
              class="ml-auto mr-auto"
              controls=""
              style="width: 200px; height: 100px;">
              <source src=${mediaFile}>
           </video>
        </div>
        <div>${caption}</div>
        </div>
        </div>
     `;
        } else if (multimediaSelectionField == 4) {
          var imgPath;
          if (extensionType == "pdf") {
            imgPath = "assets/images/pdf.png";
          } else if (extensionType == "docx" || extensionType == "doc") {
            imgPath = "assets/images/word.png";
          } else if (extensionType == "xlsx" || extensionType == "xls") {
            imgPath = "assets/images/sheets.png";
          }
          content = `
          <div class="wp-box wp-box-media">
          <div class="msgComponent">
        <div class="d-flex">
           <img
              src=${imgPath}
              class="ml-auto mr-auto"
              draggable="false"
              style="height: 80px; width: 80px;">
        </div>
        <div>${caption}</div>
        </div>
        </div>
     `;
        } else {
          content = `
             <div class="wp-box">
                <div class="msgComponent">${message}</div>
             </div>`;
        }
      }
    }

    var headerSection = `
       <div>
          <div class="title-box bot-header d-flex">
            <i class="nodeIcon bi ${elementIcon}"></i>
            <div class="NodeHeader">${elementName}</div>
              <div class="ml-auto">
                 <img class="arrange-header-icon" draggable="false" id="node-${id}_copyBtn" src="./assets/img/brandImg/icons8-copy-25.png">
                 <img class="arrange-header-icon" draggable="false" id="node-${id}_deleteBtn" src="./assets/img/brandImg/icons8-delete-25.png">
              </div>
          </div>
       </div>`;
    var contentSection = `
       <div class="box pb-0" id="node-${id}_msgDiv">
          <div class="h-40 d-flex" style="font-size : 10px">
             <div class="mt-auto mb-auto" id="node-${id}_uniqueName">${elementData.uniqueName}</div>
             <div class="mt-auto mb-auto ml-auto" id="node-${id}_keyword"><b><i>${keyword}</i></b></div>
          </div>
          ${content}
       </div>
    `;
    var outputsDivSection;
    if (nodeName != "wpBotSays") {
      var outputOuterDiv = `<div id="node-${id}_outputsDiv">`;
      var outputsObject = elementData.answerOptions;
      // console.log(outputsObject,"outputsObject");
      var outputList = [];
      if (Object.keys(outputsObject).length > 1 &&
        (outputsObject["errorSection"]["options"][Object.keys(outputsObject["errorSection"]["options"])[0]]["optionName"] != ''
          &&
          outputsObject["section_1"]["options"][Object.keys(outputsObject["section_1"]["options"])[0]]["optionName"] != ''
        )) {
        for (const element in outputsObject) {
          var outputElements = outputsObject[element].options;
          for (const output in outputElements) {
            outputList.push(outputElements[output].optionName);
          }
        }
        for (let i = 0; i < outputList.length; i++) {
          var outputInnerDiv = ` <div class="wp-queryBox pl-2 d-flex">${outputList[i]}</div>`;
          outputOuterDiv = outputOuterDiv + outputInnerDiv;
        }
      }
      outputsDivSection = outputOuterDiv + `</div>`;
      return (
        "<div>" + headerSection + contentSection + outputsDivSection + "</div>"
      );
    }
    return "<div>" + headerSection + contentSection + "</div>";
  }

  createLogisticComponentHTML(id, nodeName) {
    //!creating HTML for condition and webhook component
    var elementName, elementIcon;
    var elementData = this.JSON.data[id];
    var content;
    var vCondition;
    //*Changing content based on condition/Webhook
    if (nodeName == "conditions") {
      elementName = "Conditions";
      elementIcon = "bi-file-earmark-check";
      var message = elementData.variables;
      var listElements = "";
      if (message.length == 0) {
        listElements = "Conditions";
      } else {
        for (let i = 0; i < message.length; i++) {
          if (message[i] != null) {
            if (message[i].vCondition == "1") {
              vCondition = "Equal to"
            } else if (message[i].vCondition == "2") {
              vCondition = "Does not equal to";
            } else if (message[i].vCondition == "3") {
              vCondition = "Greater than";
            } else if (message[i].vCondition == "5") {
              vCondition = "Less than";
            } else if (message[i].vCondition == "4") {
              vCondition = "Greater than or equal to";
            } else if (message[i].vCondition == "6") {
              vCondition = "Less than or equal to";
            }
            else if (message[i].vCondition == "7") {
              vCondition = "Begins with";
            } else if (message[i].vCondition == "8") {
              vCondition = "! Begins with";
            }
            listElements += `<li>${message[i].vOne} ${vCondition} ${message[i].vTwo}</li>`;
          }
        }
      }
      if (message[0] != null) {
        if (message.length == 1 && message[0].vOne == "") {
          content = `
          <div class="wp-box">
          <div class="msgComponent">Conditions</div>
        </div>
       `;
        } else {
          content = `
              <div class="wp-box">
                 <div class="varComponent">
                    ${listElements}
                 </div>
              </div>`;
        }
      }
    } else if (nodeName == "webhook") {
      elementName = "Webhook";
      elementIcon = "bi-link-45deg";
      var message = elementData.message;
      var url = elementData.url;
      var method = elementData.method == 1 ? "GET" : "POST";
      var retryCount = elementData.retryCount;
      var timeOut = elementData.timeOut;

      if (url == "") {
        content = ` <div class="wp-box ">
        <div class="msgComponent">
          Webhook URL
        </div>
      </div>`
      } else {
        content = `
        <div class="wp-box">
        <div>
            <div class="msgComponent_1">
                <b> ${method}</b> : <a><i class="text-primary">${url}</i></a>
                <table style="width:100%;">
                    <tbody>
                        <tr>
                            <td style="width:50%">Timeout : <b> ${timeOut} </b></td>
                            <td style="width:50%; text-align:right">Retry :<b> ${retryCount}</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </div>
        `;
      }

    } else if (nodeName == "liveAgent") {
      var agentGroups;
      if(elementData.agentGroup!=undefined){
        agentGroups=elementData.agentGroup
      }else{
        agentGroups=[]
      }
      elementName = "Connect Agent";
      elementIcon = "bi-people-fill";
      var transferLogic;
      if (elementData.transferLogic == 1) {
        transferLogic = "Sequential"
      } else if (elementData.transferLogic == 2) {
        transferLogic = "Round Robin"
      }
      var agentGroupHtml = ''
      if (agentGroups != undefined && agentGroups.length > 0) {
        agentGroups.map((groups) => {
          agentGroupHtml += `<div class="liveComponent1">${groups}</div>`
        })
      }

      if (transferLogic == undefined) {
        content = ` <div class="wp-box ">
        <div class="msgComponent">
        Transfer the chat to Agent
        </div>
      </div>`
      } else {
        content = `<div class="live-wp-box">
      <div class="liveComponent">Transfer Logic: ${transferLogic}</div>
      </div>
      <div class="live-wp-box1">
        ${agentGroupHtml}
      </div>`
      }
    }

    var headerSection = `
       <div>
          <div class="title-box bot-header d-flex">
          <i class="nodeIcon bi ${elementIcon}"></i>
             <div class="NodeHeader">${elementName}</div>
             <div class="ml-auto">
                 <img class="arrange-header-icon" draggable="false" id="node-${id}_copyBtn" src="./assets/img/brandImg/icons8-copy-25.png">
                 <img class="arrange-header-icon" draggable="false" id="node-${id}_deleteBtn" src="./assets/img/brandImg/icons8-delete-25.png">
             </div>
          </div>
       </div>`;


    var contentSection = `
       <div class="box pb-0" id="node-${id}_msgDiv">
          <div class="h-40 d-flex" style="font-size : 10px">
          <div class="mt-auto mb-auto" id="node-${id}_uniqueName">${elementData.uniqueName}</div>
       </div>
       ${content}
       </div>
    `;
    var outputsDivSection;
    var outputOuterDiv = `<div id="node-${id}_outputsDiv">`;
    var outputsObject = elementData.answerOptions;
    var outputList = [];
    for (const element in outputsObject) {
      var outputElements = outputsObject[element].options;
      for (const output in outputElements) {
        outputList.push(outputElements[output].optionName);
      }
    }

    for (let i = 0; i < outputList.length; i++) {
      var outputInnerDiv = ` <div class="wp-queryBox pl-2 d-flex">${outputList[i]}</div>`;
      outputOuterDiv = outputOuterDiv + outputInnerDiv;
    }
    outputsDivSection = outputOuterDiv + `</div>`;
    return (
      "<div>" + headerSection + contentSection + outputsDivSection + "</div>"
    );
  }
}
