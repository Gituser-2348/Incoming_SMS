import { Component,Input } from "@angular/core";

@Component({
  selector:'trigger-root',
  templateUrl:'./trigger.component.html',
  styleUrls:['./trigger.component.css']
})

export class TriggerComponent{
  @Input() collapsedValue :string;  //!getting whether the sidebar is collapsed or not
}
