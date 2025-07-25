import { AfterViewInit, Component, OnInit, OnDestroy } from "@angular/core";
import Drawflow from "drawflow";
import { PropertyBindingService } from "../propertybuilder/propertyBinding.service";
import { FlowbuilderService } from "../flowbuilder.service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { DrawflowMinimap } from "drawflow";
import { wpbotsaysService } from "../propertybuilder/wpbotsays.service";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { ExcelDataCreateService } from "../shared/sevices/excel.service";
import { ToastrService } from "ngx-toastr";


@Component({
  selector: 'app-flowPreview',
  templateUrl: './flowPreview.component.html',
  styleUrls: ['./flowPreview.component.scss']
})
export class FlowPreviewComponent implements OnInit {

  constructor(private router:Router,
    private service: FlowbuilderService,
    private propertyBindingService: PropertyBindingService,
    private botMockService:wpbotsaysService,
    private excelService:ExcelDataCreateService,
    private toaster :ToastrService
  ) {
    this.router.events
    .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    .subscribe(event => {
      if (
        event.id === 1 &&
        event.url === event.urlAfterRedirects
      ) {
        this.service.refreshFlow.next("data");
        window.location.href = "#/flow";
      }
    })
    this.router.events
    .pipe(filter((rs): rs is NavigationStart => rs instanceof NavigationStart))
    .subscribe(event => {
      // console.log(event)
      if (
        event.navigationTrigger == 'popstate'
      ) {
        this.service.refreshFlow.next("data");
        window.location.href = "#/flow";
      }
    })
    this.propertyBindingService.propertyShow.subscribe((data:any)=>{
      this.propertywithMinimap = data;
    });
    this.service.addNodeToComponent.subscribe((NodeData: any) => {
      //!adding Output node to component like botask condition and webhook
      this.editor.addAskComponentDiv(
        NodeData.id,
        NodeData.num,
        NodeData.answerOptions
      );
    });
    this.service.addConnection.subscribe((connectionNodeData: any) => {
      //!creating connection between two nodes
      this.editor.addConnection(
        connectionNodeData.outputId,
        connectionNodeData.inputId,
        connectionNodeData.outputNode,
        connectionNodeData.inputNode
      );
    });
    this.service.deleteConnection.subscribe((nodeId) => {
      //!for removing outputconnection for a specific node
      this.editor.removeOutputConnections(`node-${nodeId}`);
    });
    this.service.removeNode.subscribe((nodeId) => {
      //!removing node itself
      this.editor.removeNodeId(nodeId);
    });
    this.service.nodeContent.subscribe((node: any) => {
      //!changing HTML content of the node during property saving for using in copy node
      // try{
      //   this.editor.drawflow.drawflow.Home.data[node.id].html = node.html
      // }catch(err){
      //   console.warn(err)
      // }
      this.editor.drawflow.drawflow.Home.data[node.id].html = node.html;
    });

    this.service.copyNode.subscribe((nodeOject) => {
      // console.log("copyNodeCalled");
      //!used for copying node reimplimenting addNode()
      this.editor.addNode(
        nodeOject.name,
        nodeOject.num_In,
        nodeOject.num_Out,
        nodeOject.pos_x,
        nodeOject.pos_y,
        nodeOject.classoverride,
        nodeOject.data,
        nodeOject.html
      );
    });
    this.service.eventListner.subscribe((nodeId) => {
      //! adding copybutton property and delete button property while importing
      // this.addDeleteEventListener(nodeId);
      // this.addCopyEventListner(nodeId);
    });
    this.validationSubscription = this.excelService.alert.subscribe((data)=>{
      if(data["status"] == 1){
        this.toaster.success(data["message"],"Success")
      }else{
        this.toaster.warning(data["message"],"Warning")
      }
    })
  }
  autosave;
  element: any = "";
  jsonData: any;
  showPropertyWindow = "false";
  propertywithMinimap = "false";
  editor;
  validationSubscription:any;
  ngOnInit() {

  }

  ngClear() {
    this.element = " ";
  }

  ngAfterViewInit() {
    //!initializing drawflow() and adding event lisntners
    var dataToImport = this.service.dataToImport(); //*getting JSON for drawflow from backnd

    var id = document.getElementById("drawflow");
    const editor1 = new Drawflow(id);

    editor1.reroute = true;
    editor1.reroute_fix_curvature = true;
    editor1.force_first_input = false;

    const idMinimap = document.getElementById("minimap");
    new DrawflowMinimap(idMinimap, editor1, 0.07);


    editor1.start();
    this.editor = editor1; //* getting editor reference as global variable
    editor1.import(dataToImport); //*importing drawflow form JSON


    var elements = document.getElementsByClassName("drag-drawflow");
    for (var i = 0; i < elements.length; i++) {
      //*adding eventlisters to the drawflow objects and sidebar objects
      elements[i].addEventListener("touchend", this.drop, false);
      elements[i].addEventListener("touchmove", this.positionMobile, false);
      elements[i].addEventListener("touchstart", this.drag, false);
    }
    var drawdflowElementIdList = Object.keys(
      this.editor.drawflow.drawflow.Home.data
    );
    // console.log(drawdflowElementIdList);

    for (var i = 0; i < drawdflowElementIdList.length; i++) {
      //*adding copy delete property for imported Nodes
      // this.addDeleteEventListener(drawdflowElementIdList[i]);
      // this.addCopyEventListner(drawdflowElementIdList[i]);
    }
    // console.log((document.getElementById("container")))
    setTimeout(() => {
      document.getElementById("body").classList.add("overflow-hidden"); //! class added for removing scrolbar for fixed height
      document.getElementById("container").classList.add("container-fluid-new");
      document.getElementById("mainTag").classList.add("bg-dot"); //!addign background dotted
    });
    // console.log("afterViewinit")
  }
  // ngAfterViewChecked(){
  // }

  resetPosition() {
    this.editor.resetCanvasPosition();
  }
  ngClick() {
    //!selection of nodes and property bindings
    try {
      // console.log(document.querySelectorAll(".selected"))
      document.querySelectorAll(".selected")[1].classList.remove("selected");
    } catch (err) {}
    var selectedNode = document.getElementsByClassName("selected"); //*selecting node while clicking with selected class
    // console.log(selectedNode)
    if (
      selectedNode.length > 0 &&
      selectedNode[0].classList[0] == "drawflow-node"
    ) {
      this.propertyBindingService.propertyShow.next("true");
      this.service.alwaysCloseKeyboard.next("close")
      // this.showPropertyWindow = "true"
      var selectedNodeValue = []; //*storing name of selected node
      try {
        this.service.alwaysCloseKeyboard.next("close")
        var tempSelectNode = selectedNode[0].textContent.split("\n");
        var tempNodeId = selectedNode[0].id;
        var selectedNodeId = tempNodeId.split("-")[1];
        var connectionsList = this.editor.returnOutputNodes(selectedNodeId);
        tempSelectNode.map((node) => {
          //*getting selected node Name for passing to property binding
          if (node.trim().length > 0) {
            selectedNodeValue.push(node.trim());
          }
        });

        if(selectedNodeValue.length >0){
          // console.log(selectedNodeValue[0],"Node")
          this.propertyBindingService.propertyShow.next("true");
        }else{
          this.propertyBindingService.propertyShow.next("false");
        }
        if (selectedNodeValue[0] === "Bot Says" || selectedNodeValue[0] == "wpBotSays") {
          this.element = "Bot Says";
          this.propertyBindingService.dynamicSubject.next(this.element); //!creating properties of object dynamically
          this.propertyBindingService.dynamicIdWpBotSays.next(selectedNodeId); //!passing node Id
          var dataToFetch =
            this.propertyBindingService.fetchdataFromJson(selectedNodeId); //!fetching already saved data from JSON
          dataToFetch.nodeDetails = connectionsList;
          // console.log(dataToFetch)
          this.propertyBindingService.fetchDataSubscription.next(dataToFetch);
          this.propertyBindingService.disableSubmit.next(true)
          // this.propertyBindingService.fetchDataSubscription.next(this.editor.drawflow.drawflow.Home.data[selectedNodeId]["properties"]);
        } else if (selectedNodeValue[0] === "Bot Asks" || selectedNodeValue[0] == "wpBotAsk") {
          //! same datas of each objects are passing in elseIf
          this.element = "Bot Asks";
          this.propertyBindingService.dynamicSubject.next(this.element);
          this.propertyBindingService.dynamicIdWpBotAsk.next(selectedNodeId);
          var dataToFetch =
            this.propertyBindingService.fetchdataFromJson(selectedNodeId);
          dataToFetch.nodeDetails = connectionsList;
          // console.log(connectionsList)
          this.propertyBindingService.fetchDataSubscription.next(dataToFetch);
          this.propertyBindingService.disableSubmit.next(true)

        } else if (selectedNodeValue[0] === "Conditions" || selectedNodeValue[0] == "conditions" ) {
          this.element = "Conditions";
          this.propertyBindingService.dynamicSubject.next(this.element);
          this.propertyBindingService.dynamicIdConditions.next(selectedNodeId);
          var dataToFetch =
            this.propertyBindingService.fetchdataFromJson(selectedNodeId);
          dataToFetch.nodeDetails = connectionsList;
          this.propertyBindingService.fetchDataSubscription.next(dataToFetch);
          this.propertyBindingService.disableSubmit.next(true);
        } else if (selectedNodeValue[0] === "Webhook" || selectedNodeValue[0] == "webhook") {
          this.element = "Webhook";
          this.propertyBindingService.dynamicSubject.next(this.element);
          this.propertyBindingService.dynamicIdWebhook.next(selectedNodeId);
          var dataToFetch =
            this.propertyBindingService.fetchdataFromJson(selectedNodeId);
          dataToFetch.nodeDetails = connectionsList;
          this.propertyBindingService.fetchDataSubscription.next(dataToFetch);
          this.propertyBindingService.disableSubmit.next(true)
        }else if (selectedNodeValue[0] === "Connect Agent" || selectedNodeValue[0] == "Connect Agent" || selectedNodeValue[0] === "live Agent" || selectedNodeValue[0] == "Live Agent" || selectedNodeValue[0] == "liveAgent" ) {
          this.element = "liveAgent";
          this.propertyBindingService.dynamicSubject.next(this.element);
          this.propertyBindingService.dynamicIdConditions.next(selectedNodeId);
          var dataToFetch =
            this.propertyBindingService.fetchdataFromJson(selectedNodeId);
          dataToFetch.nodeDetails = connectionsList;
          this.propertyBindingService.fetchDataSubscription.next(dataToFetch);
          this.propertyBindingService.disableSubmit.next(true)
         } else {
          this.element = "";
          this.propertyBindingService.dynamicSubject.next(this.element);
        }
      } catch (error) {
        console.log(error);
      }
      // document.addEventListener(
      //   "keydown",
      //   (event) => {
      //     if (selectedNode.length > 0) {
      //       if (event.key === "Delete") {
      //         // console.log("Delete presses");
      //         this.element = " ";
      //         this.showPropertyWindow = "false";
      //         let node = document.getElementsByClassName('selected')
      //         try {
      //           let nodeId = node[0].id.split('-')[1]
      //           this.propertyBindingService.deletefromUniqueJSON(nodeId)
      //           this.propertyBindingService.deleteDataFromJson(nodeId)
      //         } catch (err) { }
      //       }
      //     }
      //   },
      //   true
      // );
    } else {
      this.propertyBindingService.propertyShow.next("false");
      // this.showPropertyWindow = "false"
      this.element = " ";
      this.propertyBindingService.dynamicSubject.next(this.element);
      this.service.alwaysCloseKeyboard.next("close")
    }
  }

  mobile_item_selec = "";
  mobile_last_move = null;
  positionMobile(ev) {
    this.mobile_last_move = ev;
  }

  allowDrop(ev) {
    //!preventing default property of drop for droping objects into canvas
    ev.preventDefault();
  }

  drag(ev) {
    //!starting drag from sideBar
    if (ev.type === "touchstart") {
      this.mobile_item_selec = ev.target
        .closest(".drag-drawflow")
        .getAttribute("data-node");
    } else {
      ev.dataTransfer.setData("node", ev.target.getAttribute("data-node"));
    }
  }

  drop(ev) {
    //!droping node to the canvas
    if (ev.type === "touchend") {
      var parentdrawflow = document
        .elementFromPoint(
          this.mobile_last_move.touches[0].clientX,
          this.mobile_last_move.touches[0].clientY
        )
        .closest("#drawflow");
      if (parentdrawflow != null) {
        this.addNodeToDrawFlow(
          //!placing the component
          this.mobile_item_selec,
          this.mobile_last_move.touches[0].clientX,
          this.mobile_last_move.touches[0].clientY
        );
        let mobiledata = {
          item: this.mobile_item_selec,
          pos_x: this.mobile_last_move.touches[0].clientX,
          pos_y: this.mobile_last_move.touches[0].clientY,
        };
      }
      this.mobile_item_selec = "";
    } else {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("node");
      this.propertyBindingService.dynamicSubject.next(data); //!showing property while droping the objects into the drawflow itself
      this.addNodeToDrawFlow(data, ev.clientX, ev.clientY);
      // console.log(data)
      this.propertyBindingService.propertyShow.next("true");

      // this.showPropertyWindow = "true"
      // this.element
    }
  }

  addNodeToDrawFlow(name, pos_x, pos_y) {
    //!adding node with property in drawflow
    if (this.editor.editor_mode === "fixed") {
      return false;
    } //!determining (x,y) cordinates of the nodes in the canvas for placing
    pos_x =
      pos_x *
        (this.editor.precanvas.clientWidth /
          (this.editor.precanvas.clientWidth * this.editor.zoom)) -
      this.editor.precanvas.getBoundingClientRect().x *
        (this.editor.precanvas.clientWidth /
          (this.editor.precanvas.clientWidth * this.editor.zoom));
    pos_y =
      pos_y *
        (this.editor.precanvas.clientHeight /
          (this.editor.precanvas.clientHeight * this.editor.zoom)) -
      this.editor.precanvas.getBoundingClientRect().y *
        (this.editor.precanvas.clientHeight /
          (this.editor.precanvas.clientHeight * this.editor.zoom));

    var uniqueName;
    switch (
      name //!defining outline of the initial component basic proprty like no:input/output initial structure etc..
    ) {
      case "wpBotAsk": //!each case define outline of each nodes/objects
        var wpBotAsk = `
        <div>
          <div>
          <div class="title-box bot-header d-flex">
          <i class="nodeIcon bi bi-question-circle"></i>
              <div class="NodeHeader">Bot Asks</div>
              <div class="ml-auto">
               <img class="arrange-header-icon" draggable="false" id="node-${this.editor.getNodeId()}_copyBtn" src="./assets/img/brandImg/icons8-copy-25.png">
                  <img class="arrange-header-icon" draggable="false" id="node-${this.editor.getNodeId()}_deleteBtn" src="./assets/img/brandImg/icons8-delete-25.png">
              </div>
            </div>
          </div>
          <div class="box pb-0"  id="node-${this.editor.getNodeId()}_msgDiv">
            <div class="wp-box">
              <div class="msgComponent">
                Bot Ask
              </div>

            </div>
          </div>
          <div id="node-${this.editor.getNodeId()}_outputsDiv" ></div>
        </div>`;
        this.editor.addNode(
          "wpBotAsk",
          1,
          0,
          pos_x,
          pos_y,
          "wpBotAsk",
          {},
          wpBotAsk
        );
        uniqueName = "botask";
        break;
      case "wpBotSays":
        var wpBotSays = `
        <div>
          <div>
            <div class="title-box bot-header d-flex">
            <i class="nodeIcon bi bi-chat-dots"></i>
            <div class="NodeHeader">Bot Says</div>
              <div class="ml-auto">
               <img class="arrange-header-icon" draggable="false" id="node-${this.editor.getNodeId()}_copyBtn" src="./assets/img/brandImg/icons8-copy-25.png">
                  <img class="arrange-header-icon" draggable="false" id="node-${this.editor.getNodeId()}_deleteBtn" src="./assets/img/brandImg/icons8-delete-25.png">
              </div>
            </div>
          </div>
          <div class="box pb-0" id="node-${this.editor.getNodeId()}_msgDiv">
            <div class="wp-box">
              <div class="msgComponent">Hello Welcome to my Store</div>
            </div>
          </div>
        </div>`;
        this.editor.addNode(
          "wpBotSays",
          1,
          1,
          pos_x,
          pos_y,
          "wpBotSays",
          {},
          wpBotSays
        );
        uniqueName = "botsays";
        break;
      case "conditions":
        var conditions = `<div>
              <div>
                <div class="title-box bot-header d-flex">
                <i class="nodeIcon bi bi-file-earmark-check"></i>
                <div class="NodeHeader">Conditions</div>
                  <div class="ml-auto">
                  <img class="arrange-header-icon" draggable="false" id="node-${this.editor.getNodeId()}_copyBtn" src="./assets/img/brandImg/icons8-copy-25.png">
                  <img class="arrange-header-icon" draggable="false" id="node-${this.editor.getNodeId()}_deleteBtn" src="./assets/img/brandImg/icons8-delete-25.png">
                  </div>
                </div>
              </div>
              <div class="box pb-0" id="node-${this.editor.getNodeId()}_msgDiv">
                <div class="wp-box">
                  <div class="msgComponent">Conditions</div>
                </div>
                </div>
                <div id="node-${this.editor.getNodeId()}_outputsDiv"></div>
              </div>`;
        this.editor.addNode(
          "conditions",
          1,
          0,
          pos_x,
          pos_y,
          "conditions",
          {},
          conditions
        );
        uniqueName = "conditions";
        break;
      case "webhook":
        var webhook = `
                <div>
                <div>
                <div class="title-box bot-header d-flex">
                <i class="nodeIcon bi bi-link-45deg"></i>
                <div class="NodeHeader">Webhook</div>
                <div class="ml-auto">
                  <img class="arrange-header-icon" draggable="false" id="node-${this.editor.getNodeId()}_copyBtn" src="./assets/img/brandImg/icons8-copy-25.png">
                  <img class="arrange-header-icon" draggable="false" id="node-${this.editor.getNodeId()}_deleteBtn" src="./assets/img/brandImg/icons8-delete-25.png">
              </div>
            </div>
          </div>
                <div class="box pb-0"  id="node-${this.editor.getNodeId()}_msgDiv">
                  <div class="wp-box ">
                    <div class="msgComponent">
                      Webhook URL
                    </div>
                  </div>
                </div>
                <div id="node-${this.editor.getNodeId()}_outputsDiv" >
              </div>`;
        this.editor.addNode(
          "webhook",
          1,
          0,
          pos_x,
          pos_y,
          "webhook",
          {},
          webhook
        );
        uniqueName = "webhook";
        break;
      default:
    }
    // this.addDeleteEventListener(this.editor.getNodeId() - 1); //!adding delete button functionality for newly created Node/object
    // this.addCopyEventListner(this.editor.getNodeId() - 1); //!adding copt button funcionality for newly created objects
    try {
      document
        .getElementsByClassName("selected")[0]
        .classList.remove("selected"); //!trying to deselect if any other nodes are selected
    } catch (err) {}
    document
      .getElementById(`node-${this.editor.getNodeId() - 1}`)
      .classList.add("selected"); //!adding selected class for showing that object is selected and its property is setting
    uniqueName = this.service.generateUniqueName(uniqueName);
    var elementObj = {
      id: this.editor.getNodeId() - 1,
      uniqueName: uniqueName,
    };
    this.botMockService.pushMockDataToDataJSON(name, elementObj);
    // this.propertyBindingService.addDataToJson(this.editor.getNodeId() - 1,elementObj)
    this.propertyBindingService.addUniqueJSON(
      this.editor.getNodeId() - 1,
      elementObj
    );
    this.service.passUniqueName.next(elementObj);
  }

  transform = "";

  showpopup(e) {
    e.target.closest(".drawflow-node").style.zIndex = "9999";
    e.target.children[0].style.display = "block";
    this.transform = this.editor.precanvas.style.transform;
    this.editor.precanvas.style.transform = "";
    this.editor.precanvas.style.left = this.editor.canvas_x + "px";
    this.editor.precanvas.style.top = this.editor.canvas_y + "px";
    this.editor.editor_mode = "fixed";
  }

  closemodal(e) {
    e.target.closest(".drawflow-node").style.zIndex = "2";
    e.target.parentElement.parentElement.style.display = "none";
    //document.getElementById("modalfix").style.display = "none";
    this.editor.precanvas.style.transform = this.transform;
    this.editor.precanvas.style.left = "0px";
    this.editor.precanvas.style.top = "0px";
    this.editor.editor_mode = "edit";
  }

  changeModule(event) {
    var all = document.querySelectorAll(".menu ul li");
    for (var i = 0; i < all.length; i++) {
      all[i].classList.remove("selected");
    }
    event.target.classList.add("selected");
  }

  //!customFunctions
  //!functions for Zoomin and ZoomOut
  zoom_out() {
    this.editor.zoom_out();
  }
  zoom_in() {
    this.editor.zoom_in();
  }
  redirectToFlow(){
    this.router.navigateByUrl('/flow');
  }
  // nodeLength(id){
  //   var data =this.editor.getNodeLength(id)
  //   return data
  // }
  addDeleteEventListener(id) {
    //!delete event listener for adding delete button functionality
    var element = this.element;
    var showProperty = this.showPropertyWindow;
    var flowServiceRef = this.service;
    var propertyBindingRef = this.propertyBindingService;
    var NodeId = "node-" + id;
    var deleteBtn = document.getElementById(`node-${id}_deleteBtn`);
    try {
      deleteBtn.addEventListener(
        "mousedown",
        function (e) {
          //!adding eventListener for click in delete button if exist
          e.stopPropagation();
        },
        true
      );
      deleteBtn.onclick = function () {
        Swal.fire({
          position: "center",
          title: "Are you sure?",
          text: "This process is irreversible.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, go ahead.",
          cancelButtonText: "No, let me think",
        }).then((result) => {
          if (result.value) {
            flowServiceRef.removeNode.next(NodeId);
            Swal.fire("Removed!", "Item removed successfully.", "success");
            try {
              element = " ";
              showProperty = "false";
              propertyBindingRef.propertyShow.next(showProperty);
              propertyBindingRef.dynamicSubject.next(element);
              propertyBindingRef.deleteDataFromJson(id); //!deleting data of the deleted node from the JSON(data)
              propertyBindingRef.deletefromUniqueJSON(id); //*deleting unique name from the JSON
              propertyBindingRef.deleteKeyword(id)
            } catch (err) {}
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire("Cancelled", "Item is safe.)", "error");
          }
        });
      };
    } catch (err) {}
  }

  addCopyEventListner(prevId) {
    //!copy button functionality with new nuiqueNames
    var editorRef = this.editor;
    var flowServiceRef = this.service;
    var propertyBindingServiceRef = this.propertyBindingService;
    var copyBtn = document.getElementById(`node-${prevId}_copyBtn`);
    try {
      copyBtn.addEventListener(
        "mousedown",
        function (e) {
          //!adding copy button eventListner for clicks
          e.stopPropagation();
        },
        true
      );
      copyBtn.onclick = function (ev) {
        var nodeName = (ev.composedPath()[6] as Element).classList[1]; //!gettngNode name from the events
        // console.log(nodeName)
        var nodeData = editorRef.drawflow.drawflow.Home.data[prevId]; //!getting nodeData to be copy from the id passed
        var pos_x =
          (ev.clientX + 100) * //!calculating postion(x,y)co-ordinates for the copied object
            (editorRef.precanvas.clientWidth /
              (editorRef.precanvas.clientWidth * editorRef.zoom)) -
          editorRef.precanvas.getBoundingClientRect().x *
            (editorRef.precanvas.clientWidth /
              (editorRef.precanvas.clientWidth * editorRef.zoom));
        var pos_y =
          (ev.clientY - 25) *
            (editorRef.precanvas.clientHeight /
              (editorRef.precanvas.clientHeight * editorRef.zoom)) -
          editorRef.precanvas.getBoundingClientRect().y *
            (editorRef.precanvas.clientHeight /
              (editorRef.precanvas.clientHeight * editorRef.zoom));

        var nodeObject = {
          name: nodeName,
          num_In: 0,
          num_Out: 1,
          pos_x: pos_x,
          pos_y: pos_y,
          classoverride: nodeName,
          data: {},
          html: "",
        };
        //!adding no:of inputs and outputs,HTML of the node to copy from the drawflowJSON
        nodeObject.num_In = Object.keys(nodeData.inputs).length;
        nodeObject.num_Out = Object.keys(nodeData.outputs).length;
        nodeObject.html = nodeData.html;
        // console.log(nodeObject)
        flowServiceRef.copyNode.next(nodeObject); //!copying Node by calling service to drawflow

        var currentId = editorRef.getNodeId() - 1; //!creating new id for the copied object and assigning to particular Div
        console.log(currentId, "currentId", prevId, "prevId");
        // console.log(
        //   document.querySelector(`#node-${currentId} #node-${prevId}_copyBtn`)
        // );
        var CopyBtn = document.querySelector(
          `#node-${currentId} #node-${prevId}_copyBtn`
        );
        CopyBtn.setAttribute("id", `node-${currentId}_copyBtn`);
        var DeleteBtn = document.querySelector(
          `#node-${currentId} #node-${prevId}_deleteBtn`
        );
        DeleteBtn.setAttribute("id", `node-${currentId}_deleteBtn`);
        // node-2_msgDiv
        var msgDiv = document.querySelector(
          `#node-${currentId} #node-${prevId}_msgDiv`
        );
        // console.log(msgDiv)
        msgDiv.setAttribute("id", `node-${currentId}_msgDiv`);
        flowServiceRef.eventListner.next(currentId);
        if (
          nodeName == "wpBotAsk" ||
          nodeName == "conditions" ||
          nodeName == "webhook"
        ) {
          var outputsDiv = document.querySelector(
            `#node-${currentId} #node-${prevId}_outputsDiv`
          );
          outputsDiv.setAttribute("id", `node-${currentId}_outputsDiv`);
          propertyBindingServiceRef.arrangeOutputNode(
            currentId,
            nodeObject.num_Out
          );
        }

        try {
          var tempNodeJSON =
            propertyBindingServiceRef.fetchdataFromJson(prevId);
          var nodeJSON_prevId = Object.assign({}, tempNodeJSON);
          var uniqueJSON = propertyBindingServiceRef.uniqueJSON;
          if (nodeJSON_prevId.uniqueName != undefined) {
            //!creating dynamic unique Names if exist
            var newUniqueId = 1;
            var UniqueName = nodeJSON_prevId.uniqueName;
            var newUniqueName;
            var copyNameFlag = false;
            while (copyNameFlag == false) {
              var index = UniqueName.lastIndexOf("_");
              var secondString = UniqueName.substring(
                index + 1,
                UniqueName.length
              );
              // console.log(index);
              if (UniqueName.length >= 14) {
                if (index != -1 && secondString != "" && !isNaN(secondString)) {
                  newUniqueName = UniqueName.slice(0, 13) + `${newUniqueId}`;
                } else {
                  newUniqueName = UniqueName.slice(0, 13) + `_${newUniqueId}`;
                }
              } else {
                newUniqueName = UniqueName + `_${newUniqueId}`;
                if (secondString != "" && !isNaN(secondString)) {
                  newUniqueName = UniqueName + `${newUniqueId}`;
                } else {
                  newUniqueName = UniqueName + `_${newUniqueId}`;
                }
              }
              for (const object in uniqueJSON) {
                // console.log(uniqueJSON[object].name)
                if (uniqueJSON[object].name == newUniqueName) {
                  copyNameFlag = false;
                  newUniqueId = newUniqueId + 1;
                  break;
                } else {
                  copyNameFlag = true;
                }
              }
            }
            nodeJSON_prevId.uniqueName = newUniqueName;
            var uniqueNameChanged = nodeJSON_prevId.uniqueName;
            // console.log(uniqueNameChanged,"after")
            propertyBindingServiceRef.addDataToJson(currentId, nodeJSON_prevId);
            var uniqueJSONobject = {
              id: currentId,
              uniqueName: uniqueNameChanged,
            };
            propertyBindingServiceRef.addUniqueJSON(
              currentId,
              uniqueJSONobject
            );
            var uniqueDiv = document.querySelector(
              `#node-${currentId} #node-${prevId}_uniqueName`
            );
            uniqueDiv.setAttribute("id", `node-${currentId}_uniqueName`);
            uniqueDiv.innerHTML = uniqueNameChanged;
          }
        } catch (err) {}
        var newHtml = document.querySelector(
          `.parent-node #node-${currentId} .drawflow_content_node`
        ).innerHTML;
        editorRef.drawflow.drawflow.Home.data[currentId].html = newHtml;
      };
    } catch (err) {}
  }

  jsonValidation(){
    var drawflowJSON =  this.editor.export()
    var data = {
      "drawflowJSON" : drawflowJSON["drawflow"]["Home"]["data"],
      "propertyJSON" : this.propertyBindingService.nodeJSON
    }
    // console.log(drawflowJSON["drawflow"]["Home"]["data"])
    this.excelService.getDrawFlowJSON.next(data)
  }
  ngOnDestroy() {
    document.getElementById("mainTag").classList.remove("bg-dot"); //!removing dotted background from frawflow
    document.getElementById("body").classList.remove("overflow-hidden");
    document
      .getElementById("container")
      .classList.remove("container-fluid-new");
    clearInterval(this.autosave);
    this.validationSubscription.unsubscribe();
    // this.service.autoSave.unsubscribe()
    // console.log("destroyed")
  }
}
