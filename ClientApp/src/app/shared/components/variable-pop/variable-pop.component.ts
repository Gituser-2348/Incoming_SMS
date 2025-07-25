import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, HostListener, ViewChild, ElementRef, Renderer2, Directive } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FlowbuilderService } from '../../../views/flow/flowbuilder.service';
import { PropertyBindingService } from '../../../views/flow/propertybuilder/propertyBinding.service';

@Component({
  selector: 'app-variable-pop',
  templateUrl: './variable-pop.component.html',
  styleUrls: ['./variable-pop.component.scss']
})
export class VariablePopComponent implements OnInit {
  @Output() childToParent = new EventEmitter<String>();
  @Input() style;
  @ViewChild('menu') menu: ElementRef;
  data: any;
  searchText: string;
  variables = [];
  selectedVariable?: "";
  systemVariables: any = [{ name: "cus_number" }]
  // systemVariables: any = [{ name: "1", flag: 0 }, { name: "2", flag: 0 }, { name: "3", flag: 0 }, { name: "4", flag: 0 }]
  // userVariables:any = ['Alabama', 'Alaska', 'Arizona', 'Arkansas'];
  allVariables: any = []
  display = "none";
  search: any;
  selected: any
  newVariable: any;
  checkbox: any;
  variableList: any = [];
  filterValue: any = [];
  myVar1:boolean=false;
  myVar2:boolean=true;
  type1: any = 1;
  constructor(private toastr:ToastrService, private service: PropertyBindingService, private renderer: Renderer2, private flowService: FlowbuilderService) {
    this.flowService.updateVariable.subscribe((data:any) => {
      // this.variables = data
      this.change('user')
    })
  }

  ngOnInit() {
    this.type1 = 1;
    this.selected = "userVariables"
    this.variables = this.flowService.userVariables;
    this.systemVariables = this.flowService.systemVariables;
    this.service.dynamicVariable.subscribe((data) => {
      // console.log(data,"Var Pop")
      this.data = data
      const element = document.getElementsByClassName("modal")
      if (data == 'botask.retryMessage') {
        element[5].classList.add("display")
      } else if (data == 'botask.timeoutMessage') {
        element[4].classList.add("display")
      } else if (data == 'botask.invalidMessage') {
        element[2].classList.add("display")
      } else if (data == 'botask.message') {
        element[1].classList.add("display")
      } else if (data == "botask.caption.image") {
        element[1].classList.add("display")
      } else if (data == "botask.caption.audio") {
        element[1].classList.add("display")
      } else if (data == "botask.caption.video") {
        element[1].classList.add("display")
      } else if (data == "botask.caption.document") {
        element[1].classList.add("display")
      }
      else {
        element[0].classList.add("display")
        this.display = "block";
      }
      if (this.selected == "userVariables") {
        this.variables = this.flowService.userVariables;
      } else {
        this.variables = this.systemVariables
      }
      this.variableList = []
      this.changeFormat(this.variables)
    })
  }

  addVariable() {
    if(this.newVariable.trim().length !=0 ){
     this.newVariable=this.newVariable.trim().replace(/\s/g, '_')
     var duplicate:boolean=false;
     this.flowService.userVariables.map(data=>{
       if(data.name==this.newVariable){
         duplicate=true;
         this.toastr.warning("Variable already exists")
         return;
       }
     })
     if(duplicate==false){
       this.flowService.addVariable(this.newVariable,"")
       this.variables = this.flowService.userVariables;
       this.variableList = []
       this.changeFormat(this.variables)
       this.newVariable=''
     }
    }else{
     this.toastr.warning("Variable name cannot be empty")
    }
   }

  preventPaste(ev){
    ev.preventDefault()
  }
  delete(i) {
    this.flowService.removeVariable(i)
    this.variables = this.flowService.userVariables;
    this.variableList = []
    this.changeFormat(this.variables)
  }

  ngAfterViewInit() {
    this.type1 = 1;
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target == this.menu.nativeElement) {
        const element = document.getElementsByClassName("modal")
        // console.log(element.length,'length');
        for (let i = 0; i < element.length; i++) {
          element[i].classList.remove("display")
        }
        this.display = "none";
        this.variables = [""];
        this.search = "";
      }
    });
  }

  openModal() {
    if (this.flowService.variableType == "systemVariables") {
      this.variables = this.systemVariables;
      this.selected = "systemVariables";
      this.flowService.variableType = "systemVariables";
    }
    this.display = "block";
  }

  onCloseHandled() {
    this.display = "none";
  }

  onSelect(variable, index): void {
    this.selectedVariable = variable;
    this.onClick();
    // this.flowService.changeValue(index)
  }

  change(e) {
    if(e=='user'){
      this.myVar2=true;
      this.myVar1=false;
    }else{
      this.myVar1=true;
      this.myVar2=false;
    }
    if (e == "system") {
      this.variables = this.systemVariables;
      this.selected = this.systemVariables;
      this.flowService.variableType = "systemVariables";
      this.variableList = []
      this.changeFormat(this.variables)
    } else if (e == "user") {
      this.variables = this.flowService.userVariables;
      this.selected = "userVariables";
      // console.log(this.selected, 'selected');
      this.flowService.variableType = "userVariables";
      this.variableList = []
      this.changeFormat(this.variables)
    } else {
      this.variables = this.allVariables;
      this.selected = this.allVariables
    }
  }

  changeFormat(data) {
    for (let i = 0; i < data.length; i++) {
      this.variableList.push(data[i].name)
    }
    this.filterValue = this.variableList
  }

  onClick() {
    let value = this.selectedVariable;
    this.childToParent.emit(`[${value}]`);
  }

  onSearch(event: any) {
    const value = this.search;
    if (value.length >= 0) {
      this.variableList = this.filterValue.filter((filtered) =>
        filtered.toLowerCase().includes(value)
      );
    }
  }
}
