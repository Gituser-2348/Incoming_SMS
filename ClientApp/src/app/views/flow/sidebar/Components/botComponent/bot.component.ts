import { Component,Input,OnInit} from "@angular/core";
import { FlowBuilderComponent } from "../../../flowbuilder.component";
// declare function drag(ev:any) :any;
// declare function customDrag(ev:any) :any;

@Component({
  selector:'bot-root',
  templateUrl:'./bot.component.html',
  styleUrls:['./bot.component.css']
})
export class BotResponseComponent implements OnInit{
  constructor(private flow :FlowBuilderComponent){}
  @Input() collapsedValue :string;  //!getting whether the sidebar is collapsed or not
  ngOnInit(){
  }
  ngDrag(ev){ //!component dragged from the sidebar to canvas and passing the event value to flowbuilderComponnet
    this.flow.drag(ev)

  }


}
