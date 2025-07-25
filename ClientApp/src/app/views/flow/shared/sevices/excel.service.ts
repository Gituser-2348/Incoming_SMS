import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { saveAs } from 'file-saver';
import { FlowbuilderService } from '../../flowbuilder.service';
import { ExcelService } from '../../../../core/services/excel-services';


@Injectable({
  providedIn: 'root'
})
export class ExcelDataCreateService {
  getDrawFlowJSON = new Subject();
  excelName = new Subject();
  excelDataArray :any = [];
  name : any;
  alert = new Subject();
  constructor(
    private excelSave : ExcelService
    ) {
    this.getDrawFlowJSON.subscribe((json :any)=>{
      // console.log(json);
      this.validateDrawflowJSON(json);
    })
    this.excelName.subscribe((name)=>{
      // console.log(name, 'flow name');
      this.name = name;
    })
  }

  // ["Object Id","Object Type","Object Name","Object Keyword","Reason","Connection Info"]


  validateDrawflowJSON(json){
    this.excelDataArray = [];
    var drawFlowJSON = json["drawflowJSON"];
    var propertyJSON = json["propertyJSON"];
    var dataArray = {}
    for(const id in drawFlowJSON){
      var inputObject = drawFlowJSON[id]["inputs"];
      var outputObject = drawFlowJSON[id]["outputs"];
      if(Object.keys(inputObject).length > 0 || Object.keys(outputObject).length > 0){
        if(Object.keys(inputObject).length > 0 && Object.keys(outputObject).length > 0){
          let inputFlag = true;
          let outputFLag = true;
          let noConnectionOutputs = [];
          inputObject["input_1"]["connections"].length > 0 ? inputFlag = true :inputFlag = false;
          for(const output in outputObject){
            // console.log(outputObject[output]["connections"].length, 'output connections');
            if(outputObject[output]["connections"].length > 0){
              outputFLag = true;
            }else{
              outputFLag = false;
              noConnectionOutputs.push(output);
            }
          }
          if(inputFlag == false && noConnectionOutputs.length > 0){
            if(propertyJSON[id]){
              // dataArray.push(id,drawFlowJSON[id]["name"]);
              // dataArray.push(propertyJSON[id]["uniqueName"]);
              // dataArray.push(propertyJSON[id]["keyword"] == undefined ? "" : propertyJSON[id]["keyword"]);
              // dataArray.push("Both input and output are not connected");
              // var string = "input_1 not connected ,"
              // for(let i=0 ; i < noConnectionOutputs.length ; i++){
              //   string += `${noConnectionOutputs[i]} not connected,`
              // }
              // dataArray.push(string);
              var string = "input_1 not connected ,"
              for(let i=0 ; i < noConnectionOutputs.length ; i++){
                string += `${noConnectionOutputs[i]} not connected,`
              }
              dataArray={
                "Object Id":id,
                "Object Type":drawFlowJSON[id]["name"],
                "Object Name":propertyJSON[id]["uniqueName"],
                "Object Keyword":propertyJSON[id]["keyword"] == undefined ? "" : propertyJSON[id]["keyword"],
                "Reason":"Both input and output are not connected",
                "Connection Info":string
              }
            }
            this.excelDataArray.push(dataArray);
          }else if(inputFlag == false && noConnectionOutputs.length == 0){
            if(propertyJSON[id]){
              // dataArray.push(id,drawFlowJSON[id]["name"]);
              // dataArray.push(propertyJSON[id]["uniqueName"]);
              // dataArray.push(propertyJSON[id]["keyword"] == undefined ? "" : propertyJSON[id]["keyword"]);
              // dataArray.push("Input not connected");
              // dataArray.push("input_1 not connected");
              dataArray={
                "Object Id":id,
                "Object Type":drawFlowJSON[id]["name"],
                "Object Name":propertyJSON[id]["uniqueName"],
                "Object Keyword":propertyJSON[id]["keyword"] == undefined ? "" : propertyJSON[id]["keyword"],
                "Reason":"Input not connected",
                "Connection Info":"input_1 not connected"
              }
            }
            this.excelDataArray.push(dataArray);
          }else if(inputFlag == true && noConnectionOutputs.length > 0){
            if(drawFlowJSON[id]["name"] != "wpBotSays"){
              if(propertyJSON[id]){
                // dataArray.push(id,drawFlowJSON[id]["name"]);
                // dataArray.push(propertyJSON[id]["uniqueName"]);
                // dataArray.push(propertyJSON[id]["keyword"] == undefined ? "" : propertyJSON[id]["keyword"]);
                // dataArray.push("Outputs not connected");
                // var string = "";
                // for(let i=0 ; i < noConnectionOutputs.length ; i++){
                //   string += `${noConnectionOutputs[i]} not connected,`
                // }
                // dataArray.push(string);
                var string = "";
                for(let i=0 ; i < noConnectionOutputs.length ; i++){
                  string += `${noConnectionOutputs[i]} not connected,`
                }
                dataArray={
                  "Object Id":id,
                  "Object Type":drawFlowJSON[id]["name"],
                  "Object Name":propertyJSON[id]["uniqueName"],
                  "Object Keyword":propertyJSON[id]["keyword"] == undefined ? "" : propertyJSON[id]["keyword"],
                  "Reason":"Outputs not connected",
                  "Connection Info":string
                }
              }
              this.excelDataArray.push(dataArray);
            }
          }
        }else if(drawFlowJSON[id]["name"] == "welcome"){
          if(outputObject["output_1"]["connections"].length == 0){
          // dataArray.push(id,drawFlowJSON[id]["name"],"","","output not connected,Flow can't be activate","output_1");
            dataArray={
              "Object Id":id,
              "Object Type":drawFlowJSON[id]["name"],
              "Object Name":"",
              "Object Keyword":"",
              "Reason":"output not connected,Flow can't be activate",
              "Connection Info":"output_1 not connected"
            }
            this.excelDataArray.push(dataArray);
          }
      }else if(Object.keys(inputObject).length > 0 && Object.keys(outputObject).length == 0){
        dataArray={
          "Object Id":id,
          "Object Type":drawFlowJSON[id]["name"],
          "Object Name":"",
          "Object Keyword":"",
          "Reason":"Object doesn't contain any data",
          "Connection Info":""
        }
        this.excelDataArray.push(dataArray);
      }
    }
    dataArray = {};
  }
  // console.log(this.excelDataArray);
  if(this.excelDataArray.length > 0){
    this.alert.next({
      status : 0,
      message : "Some Problems in the flow, Please check Excel for details"
    });
    this.excelSave.exportAsExcelFile(this.excelDataArray,this.name);
  }else{
    this.alert.next({
      status : 1,
      message : "No error found on flow"
    });
  }
}

}
