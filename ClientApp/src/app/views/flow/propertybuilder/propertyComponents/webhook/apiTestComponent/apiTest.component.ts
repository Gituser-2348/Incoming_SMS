import { Component } from "@angular/core";
import { PropertyBindingService } from "../../../propertyBinding.service";
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector:'api-component',
  templateUrl:'./apiTest.component.html',
  styleUrls:['./apiTest.component.scss']
})

export class ApiTestComponent {
  isCollapsed : any;
  display = 'none';
  apiObject = {};
  dropdownType :any ;
  url:any;
  dropdownMethod:any ;
  showContent:any = 1
  header : any;
  parameter : any;
  elementObj:any;
  response:any=""
  constructor(private propertyService : PropertyBindingService,
    private spinner: NgxSpinnerService,){
    this.propertyService.testAPI.subscribe((val)=>{
      this.response = "";
      var data = JSON.parse(JSON.stringify(val));
      // console.log(data,"Data")
      this.display = data['display'];
      this.elementObj = data['data'];
      this.header = this.elementObj['headers'];
      this.parameter = this.elementObj['reqParams'];
      this.url = this.elementObj['url'];
      // this.dropdownMethod = data['method'];
      // this.dropdownType = data['type']
      if(data.data['method'] == 1){
        this.dropdownMethod = 'GET'
      }else if(data.data['method'] == 2){
        this.dropdownMethod = 'POST'
      }
      if(data.data['type'] == 1){
        this.dropdownType = 'Plain/Text'
      }else if(data.data['type'] == 2){
        this.dropdownType = 'Application/JSON'
      }
      // console.log(this.dropdownType,"Type",this.dropdownMethod,"Method")
      document.getElementById('modal-new').classList.add('modal-new-backdrop');
    })
  }

  handleClick(value){
    // console.log(value,"value")
    if(value == 1){
      this.showContent = 1;
    }else if(value == 2){
      this.showContent = 2;
    }
  }

  onCloseHandled(){
    this.display = 'none'
    document.getElementById('modal-new').classList.remove('modal-new-backdrop');
    this.spinner.hide()
  }

  callAPI(event){
    event.preventDefault();
    // console.log(this.elementObj)
    this.elementObj = {     //! data for saving to DB
      method: this.elementObj['method'],
      type:this.elementObj['type'],
      url: this.url,
      headers: this.header,
      reqParams: this.parameter,
      timeOut : this.elementObj['timeOut'],
      retry:this.elementObj['retry']
    };
    this.spinner.show();
    this.propertyService.testApi(this.elementObj).subscribe(resp => {
      // console.log(resp,"Resp")
      this.response = JSON.stringify(resp,undefined,4);
      this.spinner.hide()
    })
  }
}
