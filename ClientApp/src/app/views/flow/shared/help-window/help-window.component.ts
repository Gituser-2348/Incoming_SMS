import { Component, OnInit } from '@angular/core';
import { webhook } from '../../models/whatsappmodel';
import { FlowbuilderService } from "../../flowbuilder.service";

@Component({
  selector: 'app-help-window',
  templateUrl: './help-window.component.html',
  styleUrls: ['./help-window.component.scss']
})
export class HelpWindowComponent implements OnInit {
  displayStyle:any="none"
  constructor(private service: FlowbuilderService) { }

  ngOnInit(): void {
    this.service.showHelpWindow.subscribe(data=>{
      this.displayStyle=data;
    })
  }
  close() {
    this.displayStyle="none";
    this.service.showHelpWindow.next("none")
  }

}
