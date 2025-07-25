import { KeyValue } from "@angular/common";
import { Component, Output, EventEmitter, Input } from "@angular/core";
import { FlowbuilderService } from "../../flowbuilder.service";
import { PropertyBindingService } from "../../propertybuilder/propertyBinding.service";
@Component({
  selector: 'next-object',
  templateUrl: './next-object.component.html',
  styleUrls: ["./next-object.component.css"]
})

export class NextObjectComponent {
  @Input() nodeId             //! id of the object/node to fetch uniqueNames otherthan its name if exist
  @Input() selectedNode       //! answeroption of the selected node (for single answerOptions)
  @Input() arrayNode          //! used for multiple number of answerOptions
  @Input() index              //! arrayIndex to store the answerOptions
  @Output() childValue = new EventEmitter<String>();      //! emitting the id of uniqueName

  // { sec:1,index :}
  // [[]] array[index.sec][index.index] =
  private onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>) {
    return -1;
  }

  nodeSelected: any
  uniqueObject: any = {};   //! uniqueObjectJSON fetch from propertyService
  array:any
  constructor(private service: FlowbuilderService,
    private PropertyService: PropertyBindingService) { }

  ngOnInit(): void {
  this.service.newNextObj.subscribe(data=>{
    if(data){
      this.onChange()
    }
  })
  this.PropertyService.clearUniqueJSON.subscribe((data)=>{
    // console.log("Called")
    this.clearUniqueObject()
  })

  // console.log("this.arrayNode",this.arrayNode)
    this.nodeSelected=this.selectedNode
    if(this.arrayNode[this.index.sec].length>0){
      this.nodeSelected=this.arrayNode[this.index.sec][this.index.index];
      this.onChange()
    }else if(this.selectedNode){
      this.nodeSelected=this.selectedNode
      this.onChange()
    }
    this.uniqueObject = this.PropertyService.fetchUniqueJSON(this.nodeId);
    this.service.newReq.subscribe(id=>{
      this.uniqueObject = this.PropertyService.fetchUniqueJSON(id);
    })
    this.array=Object.keys(this.uniqueObject);
    // console.log(this.array,'array');

  }

  clearUniqueObject() {
    this.uniqueObject = {};
  }
  onChange(){
    this.childValue.emit(this.nodeSelected)
  }
}
