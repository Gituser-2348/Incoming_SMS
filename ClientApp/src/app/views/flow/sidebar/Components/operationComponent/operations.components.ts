import { Component ,Input} from "@angular/core";

@Component({
  selector:'operations-root',
  templateUrl:'./operations.component.html',
  styleUrls:['./operations.component.css']
})
export class OperationsComponent{
  @Input() collapsedValue :string;  //!getting whether the sidebar is collapsed or not
}
