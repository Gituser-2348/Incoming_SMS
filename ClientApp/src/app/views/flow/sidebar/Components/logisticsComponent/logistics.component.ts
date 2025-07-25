
import { Component ,Input, OnInit} from "@angular/core";
import { LoginService } from "../../../../../core/services/login.service";
import { SigninService } from "../../../../sign-in/sign-in.service";
import { FlowBuilderComponent } from "../../../flowbuilder.component";
import { FlowbuilderService } from "../../../flowbuilder.service";

@Component({
  selector:'logistics-root',
  templateUrl:'./logistics.component.html',
  styleUrls:['./logistics.component.css']
})



export class LogisticsComponent{
  objectFlags :any={
    // "liveAgent" :1
  }
  // ObjectMaster :any = {
  //   "3":"condition",
  //   "4":"webhook"
  // }
  ObjectMaster :any = {
  }

  constructor(private flow :FlowBuilderComponent, private login : LoginService,
    private flowService:FlowbuilderService,
    private signInService :SigninService){
    // this.objectFlags = this.login.getObjectFlags()
    this.ObjectMaster = this.flowService.ObjectMaster;


    var flags = JSON.parse(this.signInService.decryptData(sessionStorage.getItem("ObjectFlag")))
    if(flags!=null){
      flags.map((e)=>{
        this.objectFlags[this.ObjectMaster[e["object_type_id"]]] = e["status"]
      })
      // console.log(this.objectFlags)
    }
  }

  @Input() collapsedValue :string;  //!getting whether the sidebar is collapsed or not
  ngDrag(ev){   //!component dragged from the sidebar to canvas and passing the event value to flowbuilderComponnet
    this.flow.drag(ev)
  }
}
