import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';

@Component({
  selector: 'flow-builder-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('side') dropDivRef: ElementRef;
  dropDivElement: HTMLElement;
  @ViewChild('arrowDiv') arrowDivRef: ElementRef;
  arrowDivElement : HTMLElement;
            //!right and show used for sidebar show/hide and arrow position
  right = false;
  show =true;

  isCollapsed = 'false';
  width = "200"
  constructor() { }

  ngOnInit(): void {

  }
  sidebarShow() { //!making sidebar show/hide
  this.dropDivElement = this.dropDivRef.nativeElement;
    if(this.dropDivElement.style.width >='60'){
        // this.dropDivElement.style.visibility = 'hidden'
        this.right = false;
        this.width = "200"
        this.isCollapsed = 'false';
        // this.show= true;
        // document.getElementById("customCol").style.width = "18%";
        document.getElementById("customCol").style.width = "200px";   //!for expanded sidebar
        // document.getElementById("sideBarArrow").style.left = "93%"
        document.getElementById("sideBarArrow").style.left = "88%"  //!setting arrow in the sidebar for collapsing at right end
        if(document.getElementById("scrollDiv").classList.length>1){
          document.getElementById("scrollDiv").classList.remove("animation-scrollToCollapse")   //!adding and removing animations for the arrow to collapse and expand
        }
        document.getElementById("scrollDiv").classList.add("animation-scrollToMax")

      }else{
          this.isCollapsed = 'true';
          this.width = "60"
          this.right = true;
          document.getElementById("customCol").style.width = "60px";  //!setting sidebar collapsed width
          document.getElementById("sideBarArrow").style.left = "35%"  //!postion for the arrow nth bottom of sidebar
          if(document.getElementById("scrollDiv").classList.length>1){
            document.getElementById("scrollDiv").classList.remove("animation-scrollToMax")  //!adding and removing animation class for the arrow for expanding and collapsing
          }
          document.getElementById("scrollDiv").classList.add("animation-scrollToCollapse")
        }
  }
}
