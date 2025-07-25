import { Component, ElementRef, Input, ViewChild } from '@angular/core';
@Component({
  selector : 'drop-down',
  templateUrl:'./dropdown.component.html',
  styleUrls:['./dropdown.component.css']

})

export class DropDownComponent  {
  @Input() heading :string;
  @Input() iconClass :string;

  @Input() collapsedValue :string;

  @ViewChild('dropDiv') dropDivRef: ElementRef;
  dropDivElement: HTMLElement;

  up = false;
  show =true;


  dropdown() {  //!Dropdown component showing and hiding on the click on div by setting true/false value for show and arrow for direction(up/down)
    try{
      this.dropDivElement = this.dropDivRef.nativeElement;
    if(this.dropDivElement.style.display ==='none'){
      // this.dropDivElement.style.visibility = 'hidden'
      // console.log(this.collapsedValue)
      this.show= true
      this.up = false;
    }else{
      // this.dropDivElement.style.visibility = 'visible'
      this.show=false
      this.up = true;
    }
    }catch(err){

    }
  }
}
