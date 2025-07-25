import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { wpBotAsk } from "../models/whatsappmodel";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { AppConfig } from "../../../core/AppConfig/app.config";
import { retry } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PropertyBindingService {
  changeCurPos = new Subject();
  changeTempVar = new Subject();
  lengthChange = new Subject();
  changeClassOveride = new Subject();
  getPos = new Subject();
  getLanguage = new EventEmitter<any>();
  changeLangSubject = new Subject<any>()
  propertyShow = new Subject(); //! used for setting property window show/hide
  dynamicVariable = new Subject<any>(); //! used for creating varible
  dynamicSubject = new Subject<any>(); //! used for passing name of the selected node for creating component in propertyWindow
  dynamicIdWpBotSays = new Subject<any>(); //! for passing id of
  dynamicIdConditions = new Subject<any>(); //! for passing id of conditionComponent
  dynamicIdWpBotAsk = new Subject<any>(); //! for passing id of BotaskComponent
  dynamicIdWebhook = new Subject<any>(); //! for passing id of WebhookComponent
  fetchDataSubscription = new Subject<any>(); //! used to pass the data form JSON(data) to particular component
  nodevalue = new Subject();
  fetchUnique = new Subject<any>(); //! for fetching uniqueNames from uniqueJSON
  clearTextbox = new Subject<any>(); //! used for clearing textarea component
  dynamicValidation = new Subject();
  newVariable = new Subject();
  disableSubmit = new Subject();
  clearUniqueJSON = new Subject();
  testAPI = new Subject();
  resetBtn=new Subject();
  currentPos: number = 0;
  variableJSON = {}; //! used for storing variable list and used for showing in variable popUp
  keywordJSON = {}; //! used for storing keyword of particular node {id:"nodeId",keyword:"keywordfromUser"}

  nodeJSON = {
    //! used for storing datastored in the component and pass to DB
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
  };
  // nodeJSON={}
  conditionObjectMaster = {
    1: '=',
    2: '≠',
    3: '>',
    4: '>=',
    5: '<',
    6: '<=',
    7: 'Begins with',
    8: 'Does not begins with',
  }
  uniqueJSON = {}; //! used for storing and fetching uniqueName
  baseURL = AppConfig.Config.api.sms;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }),
    responseType: "json" as const,
  };
  constructor(private http: HttpClient) { }

  getUniqueName(id) {
    // console.log(id)
    var uniqueNameJSON = {};
    if (this.uniqueJSON[id]) {
      var tempJSON = Object.assign({}, this.uniqueJSON);
      delete tempJSON[id]; //!deleting unique name of same node/object to avoid self looping
      uniqueNameJSON = tempJSON;
    } else {
      uniqueNameJSON = this.uniqueJSON;
    }
    // console.log(uniqueNameJSON, "uniqueJSON");

    var uniqueNameArray = [];
    if (Object.keys(uniqueNameJSON).length > 0) {
      for (const id in uniqueNameJSON) {
        uniqueNameArray.push(uniqueNameJSON[id].name.toLowerCase().trim());
      }
      return uniqueNameArray;
    } else {
      return uniqueNameArray;
    }
  }

  getKeyword(id) {

    var keywordNameJSON = {};
    if (this.keywordJSON[id]) {
      var tempJSON = Object.assign({}, this.keywordJSON);
      delete tempJSON[id]; //!deleting unique name of same node/object to avoid self looping
      keywordNameJSON = tempJSON;
    } else {
      keywordNameJSON = this.keywordJSON;
    }
    // console.log(keywordNameJSON, "keywordJSON");
    var keywordArray = [];
    if (Object.keys(keywordNameJSON).length > 0) {
      for (const obj in keywordNameJSON) {
        keywordArray.push(keywordNameJSON[obj].keyword.toLowerCase().trim());
      }
      // console.log(keywordArray);
      return keywordArray;
    } else {
      return keywordArray;
    }
  }

  addDataToJson(id, value) {
    //!adding data's of component to JSON
    this.nodeJSON[id] = value;
  }
  fetchdataFromJson(id) {
    //!fetchong data from JSON for rebinding in property Window
    return this.nodeJSON[id];
  }
  deleteDataFromJson(id) {
    //! deleting data while deleting node from the drawflow
    delete this.nodeJSON[id];
  }

  addVariableToJSON(id, variable) {
    //! adding variable to variableArray
    this.variableJSON[id] = variable;
    this.newVariable.next(variable);
    // console.log(this.variableArray)
  }
  addKeywordToJSON(id, object) {
    //! adding keywords to keywordJSON
    if (object.keyword != "" && object.keyword != null && object.keyword != undefined) {
      this.keywordJSON[id] = {
        id: id,
        keyword: object.keyword,
      };
    }
    // console.log(this.keywordJSON)
  }
  deleteKeyword(id) {
    delete this.keywordJSON[id];
  }
  addUniqueJSON(id, object) {
    //! adding unique name of nodes/objects to JSON for next object mapping
    this.uniqueJSON[id] = {
      id: id,
      name: object.uniqueName,
    };
    // console.log(this.uniqueJSON,"Unique")
  }
  deletefromUniqueJSON(id) {
    //! deleting unique names from JSON while deleting a node/object
    delete this.uniqueJSON[id];
  }
  // addKeyword(id, keyword) {
  //   //! adding keyword to keywordJSON
  //   this.keywordJSON[id] = keyword;
  // }
  fetchUniqueJSON(id) {
    //! fetching unique names of objects for next object mapping
    if (this.uniqueJSON[id]) {
      var tempJSON = Object.assign({}, this.uniqueJSON);
      delete tempJSON[id]; //!deleting unique name of same node/object to avoid self looping
      return tempJSON;
    } else {
      return this.uniqueJSON;
    }
  }

  addDivToNode(elementObject, id) {
    //! adding bot says content to the drawflow object
    // console.log(elementObject);

    var message,
      multimediaPath,
      valMultimediaSelect,
      caption,
      uniqueName,
      extensionType,
      keyword,
      location,
      contact;
    var parentNode = document.getElementById(`node-${id}_msgDiv`); //!getting parent node as outer div for recreating innerDiv and appending
    parentNode.innerHTML = " ";

    for (const element in elementObject) {
      //! getting values of each property for assigning to drawflow component
      if (element == "message") {
        message = elementObject[element];
        // if (message != undefined && message.length >= 230) {
        // console.log("called")
        // message = message.slice(0, 230) + "...";
        // console.log(message)
        if (message != undefined) {
          message = message.replace(/ /g, "&nbsp;").replace(/\\"/g, '"');
        }
      } else if (element == "fileValue") {
        multimediaPath = elementObject[element];
        // try {
        //   multimediaPath = multimediaPath.Id;
        // } catch (err) {}
      } else if (element == "valMultimediaSelect") {
        valMultimediaSelect = elementObject[element];
      } else if (element == "caption") {
        caption = elementObject[element];
        if (caption != undefined) {
          caption = caption.replace(/ /g, "&nbsp;").replace(/\\"/g, '"');

        }
      } else if (element == "uniqueName") {
        uniqueName = elementObject[element];
      } else if (element == "keyword") {
        keyword = elementObject[element];
        if (keyword == undefined) {
          keyword = "";
        }
      } else if (element == "extensionType") {
        extensionType = elementObject[element];
        if (extensionType != undefined && extensionType != null && extensionType == "") {
          var extensionArray = elementObject["fileValue"].split(".");
          extensionType = extensionArray[extensionArray.length - 1];
        }
      } else if (element == "location") {
        location = elementObject[element];
      } else if (element == "contact") {
        contact = elementObject[element];
        // console.log(contact)
        if (contact != undefined && contact != "") {
          if (contact.name.firstName == undefined || contact.name.firstName == null || contact.name.firstName == "") {
            contact.firstName = "";
          } else {
            contact.firstName = contact.name.firstName;
          }
          if (contact.name.formatedName == undefined || contact.name.formatedName == "") {
            contact.formatedName = "";
          } else {
            contact.formatedName = contact.name.formatedName;
          }
          if (contact.email[0].email == undefined || contact.email[0].email == "") {
            contact.email = "";
          } else {
            contact.email = contact.email[0].email;
          }
          if (contact.phones[0].phone == undefined || contact.phones[0].phone == "") {
            contact.phones = "";
          } else {
            contact.phone = contact.phones[0].phone
          }
          if (contact.address[0].city == undefined || contact.address[0].city == "") {
            contact.city = "";
          } else {
            contact.city = contact.address[0].city;
          }
          if (contact.address[0].country == undefined || contact.address[0].country == "") {
            contact.country = "";
          } else {
            contact.country = contact.address[0].country;
          }
        }
      } else if (element == "address") {
        if (elementObject[element] != undefined && Object.keys(elementObject[element]).length > 0) {
          if (elementObject[element][0].city == undefined) {
            contact.city = "";
          } else {
            contact.city = elementObject[element][0].city;
          }
          if (elementObject[element][0].country == undefined) {
            contact.country = "";
          } else {
            contact.country = elementObject[element][0].country;
          }
        }
      } else if (element == "phones") {
        if (elementObject[element] != undefined && elementObject[element].length > 0) {
          if (elementObject[element][0].phone == undefined) {
            contact.phone = "";
          } else {
            contact.phone = elementObject[element][0].phone;
          }
        }
      }
    }
    // console.log(message.slice(0,210))      //! creating innerDivs and assining its values as innerHTML to show in the drawflow component
    var objectDiv = document.createElement("div");
    objectDiv.classList.add("h-40");
    objectDiv.innerHTML = `
      <div class="d-flex" style="font-size : 10px">
        <div class="mt-auto mb-auto" id="node-${id}_uniqueName">${uniqueName}</div>
        <div class="mt-auto mb-auto ml-auto" id="node-${id}_keyword"><b><i>${keyword}</i></b></div>
      </div>
    `;
    parentNode.appendChild(objectDiv);
    var childNode = document.createElement("div");
    childNode.classList.add("msgComponent");
    var node = document.createElement("div");
    node.classList.add("wp-box", "wp-box-media");
    node.appendChild(childNode);
    parentNode.appendChild(node);
    //! getting type of content
    if (valMultimediaSelect == 1) {
      //! creating image tag like <img src="url"/>
      var imgNode = document.createElement("img");
      imgNode.style.height = "100px";
      imgNode.style.width = "200px";
      // imgNode.src = `http://192.9.200.156/ACP/api/media/getMedia?id=${multimediaPath}`;     //! assigning url of the media url getting from backnd
      // console.log(multimediaPath)
      // console.log(typeof(multimediaPath))
      imgNode.src = multimediaPath
      imgNode.classList.add("ml-auto", "mr-auto");
      // imgNode.setAttribute("id", `node-${id}multimediaImage`);
      imgNode.setAttribute("draggable", "false");
      var captionDiv = document.createElement("div");
      // captionDiv.setAttribute("id", `node-${id}imageCaption`);
      captionDiv.innerHTML = caption;
      var outerNode = document.createElement("div");
      outerNode.appendChild(imgNode);
      outerNode.classList.add("d-flex");
      // parentNode.appendChild(outerNode);
      // parentNode.appendChild(captionDiv);
      childNode.appendChild(outerNode);
      childNode.appendChild(captionDiv);
    } else if (valMultimediaSelect == 2) {
      //! creating audeo tag like <audio controls> <source src="url"></audio>
      var sourceNode = document.createElement("source");
      // sourceNode.src = `https://prutech.org/ACP/api/media/getMedia?id=${multimediaPath}`; //!assigning url of the media url getting from backnd
      sourceNode.src = multimediaPath
      var audioNode = document.createElement("audio");
      audioNode.style.width = "200px";
      audioNode.classList.add("mb-4", "mt-4", "ml-2", "mr-2");
      audioNode.controls = true;
      audioNode.appendChild(sourceNode);
      var outerNode = document.createElement("div");
      outerNode.classList.add("d-flex");
      outerNode.appendChild(audioNode);
      var captionDiv = document.createElement("div");
      captionDiv.innerHTML = caption;
      // parentNode.appendChild(outerNode);
      // parentNode.appendChild(captionDiv)
      childNode.appendChild(outerNode);
      childNode.appendChild(captionDiv);
    } else if (valMultimediaSelect == 3) {
      //! creating audeo tag like <video controls> <source src="url"></video>
      var sourceNode = document.createElement("source");
      // sourceNode.src = `https://prutech.org/ACP/api/media/getMedia?id=${multimediaPath}`; //!assigning url of the media url getting from backnd
      sourceNode.src = multimediaPath
      var videoNode = document.createElement("video");
      videoNode.style.width = "200px";
      videoNode.style.height = "100px";
      videoNode.classList.add("ml-auto", "mr-auto");
      videoNode.controls = true;
      videoNode.appendChild(sourceNode);
      var outerNode = document.createElement("div");
      outerNode.classList.add("d-flex");
      outerNode.appendChild(videoNode);
      var captionDiv = document.createElement("div");
      captionDiv.innerHTML = caption;
      // parentNode.appendChild(outerNode);
      // parentNode.appendChild(captionDiv)
      childNode.appendChild(outerNode);
      childNode.appendChild(captionDiv);
    } else if (valMultimediaSelect == 4) {
      //! adding image node for documents like pdf word etc...
      var imgPath;
      if (extensionType == "pdf") {
        imgPath = "assets/images/pdf.png";
      } else if (extensionType == "docx" || extensionType == "doc") {
        imgPath = "assets/images/word.png";
      } else if (extensionType == "xlsx" || extensionType == "xls") {
        imgPath = "assets/images/sheets.png";
      }
      var innerNode = document.createElement("img");
      innerNode.style.height = "80px";
      innerNode.style.width = "80px";
      innerNode.classList.add("ml-auto", "mr-auto");
      innerNode.src = imgPath;
      innerNode.setAttribute("draggable", "false");
      var outerDiv = document.createElement("div");
      outerDiv.classList.add("d-flex");
      outerDiv.appendChild(innerNode);
      var captionDiv = document.createElement("div");
      captionDiv.innerHTML = caption;
      // parentNode.appendChild(outerDiv)
      // parentNode.appendChild(captionDiv)
      childNode.appendChild(outerDiv);
      childNode.appendChild(captionDiv);
    } else if (valMultimediaSelect == 6) {    //! adding details of the contact...
      var imgPath;
      // imgPath = "assets/images/contact_png.png";
      imgPath = "assets/images/contact.png";
      var imageNode = document.createElement("img");
      imageNode.setAttribute("draggable", "false");
      imageNode.style.height = "40px";
      imageNode.style.width = "40px";
      imageNode.src = imgPath;
      var outerDflexDiv = document.createElement("div");
      outerDflexDiv.classList.add("d-flex");
      var imageDiv = document.createElement("div");
      imageDiv.appendChild(imageNode);
      var nameDiv = document.createElement("div");
      nameDiv.classList.add("ml-3")
      // var firstNameDiv = document.createElement("div");
      // firstNameDiv.innerHTML = contact.firstName;
      // var lastNameDiv = document.createElement("div");
      // lastNameDiv.innerHTML = contact.lastName;
      // nameDiv.appendChild(firstNameDiv);
      // nameDiv.appendChild(lastNameDiv);
      var nameDivInnerHTML = `
      <div class="font-weight-bold">${contact.firstName}</div>
      <div class="font-weight-bold">${contact.formatedName}</div>
      `
      nameDiv.innerHTML = nameDivInnerHTML;
      outerDflexDiv.appendChild(imageDiv);
      outerDflexDiv.appendChild(nameDiv);
      var communDiv = document.createElement("div");
      var communInnerHTML = `
      <div class="row">
      <div class="col-sm font-weight-bold">Address</div>
      <div class="col-sm">:${contact.city}</div>
      </div>
      <div class="row">
      <div class="col-sm"></div>
      <div class="col-sm">${contact.country}</div>
      </div>
      <div class="row mt-1">
      <div class="col-sm font-weight-bold">Tel</div>
      <div class="col-sm">:${contact.phone}</div>
      </div>
      <div class="row">
      <div class="col-sm font-weight-bold">E-mail</div>
      <div class="col-sm">:${contact.email}</div>
      </div>`
      communDiv.innerHTML = communInnerHTML;
      childNode.appendChild(outerDflexDiv);
      childNode.appendChild(communDiv);
    } else if (valMultimediaSelect == 7) {        //!adding data to object in drawflow for sticker
      var imgNode = document.createElement("img");
      imgNode.style.height = "100px";
      imgNode.style.width = "200px";
      // imgNode.src = `https://prutech.org/ACP/api/media/getMedia?id=${multimediaPath}`; //! assigning url of the media url getting from backnd
      imgNode.src = multimediaPath
      imgNode.classList.add("ml-auto", "mr-auto");
      imgNode.setAttribute("draggable", "false");
      var outerNode = document.createElement("div");
      outerNode.appendChild(imgNode);
      outerNode.classList.add("d-flex");
      childNode.appendChild(outerNode);
    } else if (valMultimediaSelect == 8) {
      //! adding location details to the drawflow object
      // console.log(location);
      var outerDiv = document.createElement("div");
      // outerDiv.classList.add("d-flex");
      for (const data in location) {
        if (data == "latitude") {
          var divTag = `<div class="row">
            <div class="col-sm font-weight-bold">Latitude</div>
            <div class="col-sm">:${location[data]}</div>
          </div>`;
        } else if (data == "longitude") {
          var divTag = `<div class="row mt-1">
            <div class="col-sm font-weight-bold" >Longitude</div>
            <div class="col-sm">:${location[data]}</div>
          </div>`;
        } else if (data == "name") {
          var divTag = `<div class="row mt-1">
            <div class="col-sm font-weight-bold">Name</div>
            <div class="col-sm">:${location[data]}</div>
          </div>`;
        } else if (data == "address") {
          var divTag = `<div class="row mt-1">
            <div class="col-sm font-weight-bold">Address</div>
            <div class="col-sm">:${location[data]}</div>
          </div>`;
        }
        outerDiv.innerHTML += divTag;
      }
      childNode.appendChild(outerDiv);
    } else {
      //! adding message content
      // var childNode = document.createElement("div");
      // childNode.classList.add("msgComponent");
      childNode.innerHTML = message;
      // var outerNode = document.createElement("div");
      // outerNode.classList.add("wp-box");
      // outerNode.appendChild(childNode);
      // parentNode.appendChild(outerNode);
    }
    document.querySelector(`#minimap #node-${id}`).innerHTML =
      document.querySelector(`#drawflow #node-${id}`).innerHTML;
  }

  addAskComponentDiv(objects) {
    //!adding botAsk component proprties
    var id = objects.id;
    var num = objects.num;
    // var num = Object.keys(objects.answerOptions).length
    var elements = objects["answerOptions"];
    var elementsObj = objects;
    var array = [];
    var topPixels;
    var textareaValue;
    var uniqueName;
    var keyword;
    var valMultimediaSelect;
    var multimediaPath;
    var extensionType;
    var caption;

    for (const object in elements) {
      // console.log(elements[object].options)
      var outputObjects = elements[object].options;
      for (const output in outputObjects) {
        // console.log(outputObjects[output].optionName)
        array.push(outputObjects[output].optionName);
      }
    }
    console.log(array);
    var parentDiv = document.getElementById(`node-${id}_msgDiv`); //!setting parentDiv to rebuild innerDivs
    parentDiv.innerHTML = "";

    document.getElementById(`node-${id}_outputsDiv`).innerHTML = ""; //!making outputDiv empty for generating new output style

    for (const field in elementsObj) {
      //! getting each variable value for assaining to drawflow component
      if (field == "message") {
        if (elementsObj[field].length == 0) {
          textareaValue = elementsObj["header"];
        } else {
          textareaValue = elementsObj[field];
        }
        if (textareaValue != undefined) {
          textareaValue = textareaValue.replace(/ /g, "&nbsp;").replace(/\\"/g, '"');
        }
      } else if (field == "uniqueName") {
        uniqueName = elementsObj[field];
      } else if (field == "keyword") {
        keyword = elementsObj[field];
        if (keyword == undefined) {
          keyword = "";
        }
      } else if (field == "valMultimediaSelect") {
        valMultimediaSelect = elementsObj[field];
      } else if (field == "fileValue") {
        multimediaPath = elementsObj[field];
      } else if (field == "extensionType") {
        extensionType = elementsObj[field];
      } else if (field == "caption") {
        caption = elementsObj[field];
        if (caption != undefined) {
          caption = caption.replace(/ /g, "&nbsp;").replace(/\\"/g, '"');
        }
      }
    }

    var objectDiv = document.createElement("div"); //! creating keyword/uniqueName Div
    objectDiv.innerHTML = `
      <div class="h-40 d-flex" style="font-size : 10px">
        <div class="mt-auto mb-auto" id="node-${id}_uniqueName">${uniqueName}</div>
        <div class="mt-auto mb-auto ml-auto" id="node-${id}_keyword"><b><i>${keyword}</i></b></div>
      </div>
    `;

    var childNode = document.createElement("div");
    childNode.classList.add("msgComponent");
    var node = document.createElement("div");
    parentDiv.appendChild(objectDiv);
    node.classList.add("wp-box", "wp-box-media");
    node.appendChild(childNode);
    parentDiv.appendChild(node);

    for (const element in objects) {
      //!creating content of botAsk component
      if (element == "valSelectField") {
        if (
          objects[element] == 1 ||
          objects[element] == 2 ||
          objects[element] == 3 ||
          objects[element] == 4
        ) {
          // try {
          //   multimediaPath = multimediaPath.Id;
          // } catch (err) {}
          // console.log(multimediaPath)
          if (valMultimediaSelect == 1) {
            var imgNode = document.createElement("img"); //! creating image tag like <img src="url"/>
            imgNode.style.height = "100px";
            imgNode.style.width = "200px";
            // imgNode.src = `https://prutech.org/ACP/api/media/getMedia?id=${multimediaPath}`; //! assigning url of the media url getting from backnd
            imgNode.src = multimediaPath
            imgNode.classList.add("ml-auto", "mr-auto");
            // imgNode.setAttribute("id", `node-${id}multimediaImage`);
            imgNode.setAttribute("draggable", "false");
            var captionDiv = document.createElement("div");
            // captionDiv.setAttribute("id", `node-${id}imageCaption`);
            captionDiv.innerHTML = caption;
            var outerNode = document.createElement("div");
            outerNode.appendChild(imgNode);
            outerNode.classList.add("d-flex");
            // parentDiv.appendChild(outerNode);
            // parentDiv.appendChild(captionDiv);
            childNode.appendChild(outerNode);
            childNode.appendChild(captionDiv);
          } else if (valMultimediaSelect == 2) {
            var sourceNode = document.createElement("source"); //! creating audeo tag like <audio controls> <source src="url"></audio>
            // sourceNode.src = `https://prutech.org/ACP/api/media/getMedia?id=${multimediaPath}`; //! assigning url of the media url getting from backnd
            sourceNode.src = multimediaPath
            var audioNode = document.createElement("audio");
            audioNode.style.width = "200px";
            audioNode.classList.add("mb-4", "mt-4", "ml-2", "mr-2");
            audioNode.controls = true;
            audioNode.appendChild(sourceNode);
            var outerNode = document.createElement("div");
            outerNode.classList.add("d-flex");
            outerNode.appendChild(audioNode);
            var captionDiv = document.createElement("div");
            captionDiv.innerHTML = caption;
            // parentDiv.appendChild(outerNode);
            // parentDiv.appendChild(captionDiv).
            childNode.appendChild(outerNode);
            childNode.appendChild(captionDiv);
          } else if (valMultimediaSelect == 3) {
            var sourceNode = document.createElement("source"); //! creating audeo tag like <video controls> <source src="url"></video>
            // sourceNode.src = `https://prutech.org/ACP/api/media/getMedia?id=${multimediaPath}`; //! assigning url of the media url getting from backnd
            sourceNode.src = multimediaPath
            var videoNode = document.createElement("video");
            videoNode.style.width = "200px";
            videoNode.style.height = "100px";
            videoNode.classList.add("ml-auto", "mr-auto");
            videoNode.controls = true;
            videoNode.appendChild(sourceNode);
            var outerNode = document.createElement("div");
            outerNode.classList.add("d-flex");
            outerNode.appendChild(videoNode);
            var captionDiv = document.createElement("div");
            captionDiv.innerHTML = caption;
            // parentDiv.appendChild(outerNode);
            // parentDiv.appendChild(captionDiv)
            childNode.appendChild(outerNode);
            childNode.appendChild(captionDiv);
          } else if (valMultimediaSelect == 4) {
            var imgPath; //! adding image node for documents like pdf word etc...
            if (extensionType == "pdf") {
              imgPath = "assets/images/pdf.png";
            } else if (extensionType == "docx" || extensionType == "doc") {
              imgPath = "assets/images/word.png";
            } else if (extensionType == "xlsx" || extensionType == "xls") {
              imgPath = "assets/images/sheets.png";
            }
            var innerNode = document.createElement("img");
            innerNode.style.height = "80px";
            innerNode.style.width = "80px";
            innerNode.classList.add("ml-auto", "mr-auto");
            innerNode.src = imgPath;
            innerNode.setAttribute("draggable", "false");
            var outerDiv = document.createElement("div");
            outerDiv.classList.add("d-flex");
            outerDiv.appendChild(innerNode);
            var captionDiv = document.createElement("div");
            captionDiv.innerHTML = caption;
            // parentDiv.appendChild(outerDiv)
            // parentDiv.appendChild(captionDiv)
            childNode.appendChild(outerDiv);
            childNode.appendChild(captionDiv);
          } else {
            //! adding textcontent
            // var childNode = document.createElement("div");
            // childNode.classList.add("msgComponent");
            childNode.innerHTML = textareaValue;
            // var outerNode = document.createElement("div");
            // outerNode.classList.add("wp-box");
            // outerNode.appendChild(childNode);
            // parentDiv.appendChild(outerNode);
          }
        }
      }
    }
    //! arranging outputdiv in new Design
    for (let i = 0; i < num; i++) {
      console.log(array[i], "array");
      var option = ""
      const newDiv = document.createElement("div");
      newDiv.classList.add("wp-queryBox", "pl-2", "d-flex");
      if (array[i].length > 25) {
        option = array[i].slice(0, 25) + "...";
      } else {
        option = array[i];
      }
      newDiv.innerHTML = option;
      newDiv.addEventListener(
        "mousedown",
        function (e) {
          e.stopPropagation();
        },
        true
      );
      document.getElementById(`node-${id}_outputsDiv`).appendChild(newDiv);
      var outputDiv = <HTMLDivElement>(
        document.querySelector(`#node-${id} .outputs .output_${i + 1}`)
      );
      // console.log(outputDiv,"div")
      // if(i<=2 && num == 8){
      //   topPixels = -6
      // }else if(i<=3 && num == 9){
      //   topPixels = -16
      // }
      // outputDiv.style.top = `${(i*19.5)+topPixels}px`;
      outputDiv.classList.add("arrangeOutNode");
    }
    array = [];
    this.arrangeOutputNode(id, num); //!fixing position of the outputNodes curresponding to answerOptions
  }

  addWebhookComponentDiv(objects) {
    //!adding botAsk component proprties
    var id = objects.id;
    var num = 2; //objects.num;
    var elements = objects["answerOptions"];
    var elementsObj = objects;
    var array = [];
    var topPixels;
    var textareaValue;
    var uniqueName;

    // console.log("---------------------------");
    // console.log(elementsObj);

    // for(const element in elements){   //! getting answerOptions from webhook component
    //   array.push(elements[element].optionName);
    // }
    for (const object in elements) {
      // console.log(elements[object].options)
      var outputObjects = elements[object].options;
      for (const output in outputObjects) {
        // console.log(outputObjects[output].optionName)
        array.push(outputObjects[output].optionName);
      }
    }
    var parentDiv = document.getElementById(`node-${id}_msgDiv`); //!setting parentDiv to rebuild innerDivs
    parentDiv.innerHTML = "";

    document.getElementById(`node-${id}_outputsDiv`).innerHTML = ""; //!making outputDiv empty for generating new output style

    for (const ele in elementsObj) {
      //! getting each variable value for assining to drawflow component
      if (ele == "message") {
        textareaValue = elementsObj[ele];
      } else if (ele == "uniqueName") {
        uniqueName = elementsObj[ele];
      }
    }
    const _url = elementsObj["url"];
    const _method = elementsObj["method"] == 1 ? "GET" : "POST";
    const _params = elementsObj["reqParams"];
    const _retrycount = elementsObj["retryCount"];
    const _timeOut = elementsObj["timeOut"];
    // console.log(_url + " :: " + _method + " :: " + _params + " :: " + _retrycount + "::" + _timeOut);

    const objectDiv = document.createElement("div"); //! creating keyword/uniqueName Div
    objectDiv.innerHTML = `
      <div class="h-40 d-flex" style="font-size : 10px">
        <div class="mt-auto mb-auto" id="node-${id}_uniqueName">${uniqueName}</div>
      </div>
    `;
    parentDiv.appendChild(objectDiv);

    var childNode = document.createElement("div"); //!creating content of botAsk component
    childNode.innerHTML = ` <div class="msgComponent_1">
  <b>${_method}</b> : <a><i class="text-primary">${_url}</i></a>
   <table style="width:100%;">
        <tr>
          <td style='width:50%' >Timeout : <b> ${_timeOut} </b></td>
          <td style='width:50%; text-align:right' >Retry :<b> ${_retrycount}</b></td>
        </tr>
      </table>
 </div>`;

    // childNode.classList.add("msgComponent_1");
    //childNode.innerHTML = textareaValue;
    var outerNode = document.createElement("div");
    outerNode.classList.add("wp-box");
    outerNode.appendChild(childNode);
    parentDiv.appendChild(outerNode);

    for (let i = 0; i < num; i++) {
      //! arranging outputdiv in new Design
      const newDiv = document.createElement("div");
      newDiv.classList.add("wp-queryBox", "pl-2", "d-flex");
      newDiv.innerHTML = array[i];
      newDiv.addEventListener(
        "mousedown",
        function (e) {
          e.stopPropagation();
        },
        true
      );
      document.getElementById(`node-${id}_outputsDiv`).appendChild(newDiv);
    }
    this.arrangeOutputNode(id, num); //!fixing position of the outputNodes curresponding to answerOptions
    array = [];
  }

  addLiveAgentDiv(objects) {
    var id = objects.id;
    var parentNode = document.getElementById(`node-${objects.id}_msgDiv`); //!getting parent node as outer div for recreating innerDiv and appending
    parentNode.innerHTML = "";
    document.getElementById(`node-${id}_outputsDiv`).innerHTML = "";
    var array = ['Agent Unavailable','Communication End']
    var objectDiv = document.createElement("div");
    var transferLogic;
    if(objects.transferLogic == 1){
      transferLogic = "Sequential"
    }else if(objects.transferLogic == 2){
      transferLogic = "Round Robin"
    }
    objectDiv.classList.add("h-40");
    objectDiv.innerHTML = `
    <div class="d-flex" style="font-size : 10px">
    <div class="mt-auto mb-auto" id="node-${objects.id}_uniqueName">${objects.uniqueName}</div>
    <div class="mt-auto mb-auto ml-auto" id="node-${objects.id}_keyword"><b><i>${objects.keyword}</i></b></div>
    </div>
    `;
    parentNode.appendChild(objectDiv);

    document.querySelector(`#minimap #node-${objects.id}`).innerHTML =
    document.querySelector(`#drawflow #node-${objects.id}`).innerHTML;

    var outerNode = document.createElement("div");
    outerNode.classList.add("live-wp-box");
    var childNode = document.createElement("div");
    childNode.classList.add("liveComponent");
    childNode.innerHTML =`Transfer Logic: ${transferLogic}`;
    outerNode.appendChild(childNode);
    // outerNode.appendChild(childNode1);
    parentNode.appendChild(outerNode);

    var outerNode1 = document.createElement("div");
    outerNode1.classList.add("live-wp-box1");
    var agentGroups=objects.agentGroup;
    for(let i=0;i<agentGroups.length;i++){
      childNode = document.createElement("div");
      childNode.classList.add("liveComponent1");
      childNode.innerHTML =agentGroups[i]
      outerNode1.appendChild(childNode);
    }
    parentNode.appendChild(outerNode1);

    for (let i = 0; i < 2; i++) {
      //! arranging outputdiv in new Design
      const newDiv = document.createElement("div");
      newDiv.classList.add("wp-queryBox", "pl-2", "d-flex");
      newDiv.innerHTML = array[i];
      newDiv.addEventListener(
        "mousedown",
        function (e) {
          e.stopPropagation();
        },
        true
      );
      document.getElementById(`node-${id}_outputsDiv`).appendChild(newDiv);
    }
    this.arrangeOutputNode(objects.id, 2)
    array = []
  }

  arrangeOutputNode(nodeId, numOutput) {
    //!arranging output nodes corresponding to no:of outputs
    var topPixels;
    var num = numOutput;
    console.log(numOutput, "numOutput");
    if (num == 1) {
      // topPixels = 88;
      topPixels = 103;
    } else if (num == 2) {
      topPixels = 93;
    } else if (num == 3) {
      topPixels = 86;
    } else if (num == 4) {
      topPixels = 80;
    } else if (num == 5) {
      topPixels = 72;
    } else if (num == 6) {
      topPixels = 63;
    } else if (num == 7) {
      topPixels = 58;
    } else if (num == 8) {
      topPixels = 51;
    } else if (num == 9) {
      topPixels = 43;
    } else if (num == 10) {
      topPixels = 36;
    } else if (num == 11) {
      topPixels = 29;
    } else if (num == 12) {
      topPixels = 20;
    } else if (num == 13) {
      topPixels = 12;
    } else if (num == 14) {
      topPixels = 4;
    } else if (num == 15) {
      topPixels = 0;
    } else if (num == 16) {
      topPixels = -10;
    } else if (num == 17) {
      topPixels = -18;
    } else if (num == 18) {
      topPixels = -25;
    } else if (num == 19) {
      topPixels = -35;
    } else if (num == 20) {
      topPixels = -43;
    } else if (num == 21) {
      topPixels = -44;
    }
    for (let i = 0; i <= num; i++) {
      if (i < num) {
        //! selecting outputnodes and arrange based on the number of nodes
        var outputDiv = <HTMLDivElement>(
          document.querySelector(`#node-${nodeId} .outputs .output_${i + 1}`)
        );
        // console.log(outputDiv,"div")
        // if(i<=2 && num == 8){
        //   topPixels = -6
        // }else if(i<=3 && num == 9){
        //   topPixels = -16
        // }
        if (i >= 3 && num == 4) {
          topPixels = 77;
        } else if (i >= 3 && num == 5) {
          topPixels = 67;
        } else if (i >= 4 && num == 6) {
          topPixels = 58;
        } else if (i >= 4 && num == 7) {
          topPixels = 53;
        } else if (i >= 4 && num == 8) {
          topPixels = 46;
        } else if (i >= 4 && num == 9) {
          topPixels = 38;
          if (i >= 6) {
            topPixels = 35;
          }
        } else if (i >= 4 && num == 10) {
          topPixels = 31;
          if (i >= 6) {
            topPixels = 28;
          }
        } else if (i >= 4 && num == 11) {
          topPixels = 24;
          if (i >= 6) {
            topPixels = 20;
          }
          if (i >= 9) {
            topPixels = 16;
          }
        } else if (i >= 4 && num == 12) {
          topPixels = 15;
          if (i >= 6) {
            topPixels = 10;
          }
          if (i >= 10) {
            topPixels = 8;
          }
        } else if (i >= 4 && num == 13) {
          topPixels = 7;
          if (i >= 6) {
            topPixels = 2;
          }
          if (i >= 10) {
            topPixels = -10;
          }
        } else if (i >= 4 && num == 14) {
          topPixels = -5;
          if (i >= 6) {
            topPixels = -8;
          }
          if (i >= 10) {
            topPixels = -16;
          }
        } else if (i >= 3 && num == 15) {
          topPixels = -5;
          if (i >= 6) {
            topPixels = -8;
          }
          if (i >= 9) {
            topPixels = -16;
          }
          if (i >= 12) {
            topPixels = -21;
          }
        } else if (i >= 3 && num == 16) {
          topPixels = -5;
          if (i >= 3) {
            topPixels = -15;
          }
          if (i >= 6) {
            topPixels = -21;
          }
          if (i >= 9) {
            topPixels = -25;
          }
          if (i >= 11) {
            topPixels = -30;
          }
        } else if (i >= 3 && num == 17) {
          topPixels = -5;
          if (i >= 3) {
            topPixels = -22;
          }
          if (i >= 6) {
            topPixels = -27;
          }
          if (i >= 9) {
            topPixels = -32;
          }
          if (i >= 12) {
            topPixels = -39;
          }
        } else if (i >= 3 && num == 18) {
          topPixels = -5;
          if (i >= 3) {
            topPixels = -30;
          }
          if (i >= 6) {
            topPixels = -33;
          }
          if (i >= 9) {
            topPixels = -41;
          }
          if (i >= 12) {
            topPixels = -46;
          }
        } else if (i >= 3 && num == 19) {
          topPixels = -5;
          if (i >= 3) {
            topPixels = -36;
          }
          if (i >= 6) {
            topPixels = -43;
          }
          if (i >= 9) {
            topPixels = -50;
          }
          if (i >= 12) {
            topPixels = -55;
          }
        } else if (i >= 3 && num == 20) {
          topPixels = -5;
          if (i >= 3) {
            topPixels = -43;
          }
          if (i >= 6) {
            topPixels = -49;
          }
          if (i >= 9) {
            topPixels = -55;
          }
          if (i >= 12) {
            topPixels = -60;
          }
          if (i >= 15) {
            topPixels = -65;
          }
        }
        else if (i >= 3 && num == 21) {
          topPixels = -6;
          if (i >= 3) {
            topPixels = -53;
          }
          if (i >= 6) {
            topPixels = -58;
          }
          if (i >= 9) {
            topPixels = -65;
          }
          if (i >= 12) {
            topPixels = -70;
          }
          if (i >= 15) {
            topPixels = -75;
          }
        }
        outputDiv.style.top = `${i * 17 + topPixels}px`;
        // outputDiv.classList.add("arrangeOutNode")
      }
    }
    document.querySelector(`#minimap #node-${nodeId}`).innerHTML =
      document.querySelector(`#drawflow #node-${nodeId}`).innerHTML;
  }

  addConditionsDiv(object) {
    //!adding condition component proprties
    var num = object.variables.length + 1;
    var id = object.id;
    var message = object.variables;
    var uniqueName = object.uniqueName;
    var array = [];
    // var array = ["Yes", "No"];
    // vCondition: "1"
    // vOne: "esdfd"
    // vTwo: "sdfs"
    for (let i = 0; i <= message.length; i++) {
      if (i != message.length) {
        array.push(`${message[i].vOne} ${this.conditionObjectMaster[message[i].vCondition]} ${message[i].vTwo}`)
      } else {
        array.push(`Invalid/Failed`)
      }
    }
    var parentNode = document.getElementById(`node-${id}_msgDiv`); //!setting parentDiv to rebuild innerDivs
    parentNode.innerHTML = " ";
    // console.log(document.getElementById(`node-${id}_outputsDiv`))
    document.getElementById(`node-${id}_outputsDiv`).innerHTML = ""; //!making outputDiv empty for generating new output style
    var objectDiv = document.createElement("div"); //! creating keyword/uniqueName Div
    objectDiv.classList.add("h-40");
    objectDiv.innerHTML = `
      <div class="h-40 d-flex" style="font-size : 10px">
        <div class="mt-auto mb-auto" id="node-${id}_uniqueName">${uniqueName}</div>
      </div>`;
    parentNode.appendChild(objectDiv);

    var childNode = document.createElement("div");
    var vCondition: any;
    childNode.classList.add("varComponent");
    for (let i = 0; i < message.length; i++) {
      //! getting each variable value for assaining to drawflow component


      // <!-- 1        Equal to
      // 2        Does not equal to
      // 3        Greater than
      // 4        Greater than or equal to
      // 5        Less than
      // 6        Less than or equal to
      // 7        Begins with
      // 8        Does not begins with -->

      // if (message[i].vCondition == "1") {
      //   vCondition = "=";
      // } else if (message[i].vCondition == "2") {
      //   vCondition = "!=";
      // } else if (message[i].vCondition == "3") {
      //   vCondition = ">";
      // } else if (message[i].vCondition == "5") {
      //   vCondition = "<";
      // } else if (message[i].vCondition == "4") {
      //   vCondition = ">=";
      // } else if (message[i].vCondition == "6") {
      //   vCondition = "<=";
      // }
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
      childNode.innerHTML += `<li>${message[i].vOne} ${vCondition} ${message[i].vTwo}</li>`;
    }

    var outerNode = document.createElement("div");
    outerNode.classList.add("wp-box");
    outerNode.appendChild(childNode);
    parentNode.appendChild(outerNode);

    for (let i = 0; i <= num; i++) {
      //! arranging outputdiv in new Design
      if (i < num) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("wp-queryBox", "pl-2", "d-flex");
        newDiv.innerHTML = array[i];
        // console.log(newDiv.innerHTML);

        newDiv.addEventListener(
          "mousedown",
          function (e) {
            e.stopPropagation();
          },
          true
        );
        document.getElementById(`node-${id}_outputsDiv`).appendChild(newDiv);
        var outputDiv = <HTMLDivElement>(
          document.querySelector(`#node-${id} .outputs .output_${i + 1}`)
        );
        outputDiv.classList.add("arrangeOutNode");
      }
    }
    this.arrangeOutputNode(id, num); //!fixing position of the outputNodes
  }

  testApi(data) {
    return this.http.post(this.baseURL + "api/testApi/callApi", data,
      this.httpOptions)
      .pipe(retry(2));
  }

}
