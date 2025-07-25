import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
//import { SmsService } from "../../../views/smsservice/sms.service";

@Component({
  selector: "app-smsTemplateDetails",
  templateUrl: "./smsTemplateDetails.component.html",
  styleUrls: [
    "./smsTemplateDetails.component.scss",
   // "../../../views/smsservice/bulksms/bulksms.component.scss",
   // "../../../views/management/accountInfo/accountInfo.component.scss",
  ],
})
export class SmsTemplateDetailsComponent implements OnInit {
  @ViewChild("sort") sort: MatSort;
  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;
  @Output() TemplatData = new EventEmitter()
  templateSearch: any = {
    TemplateID:"",
    TemplateName: "",
    TemplateTypeId: "-1",
    MessageTypeId: "-1"
  };
  apiCalled = false
  displayedColumns: string[] = [
    "senderId",
    "templateID",
    "templateName",
    "templateType",
    "template",
    "messageType",
    "length",
  ];

  templateTypeMaster: any = [
    { text: "--All--", value: "-1" },
    { text: "Prmotional", value: "1" },
    { text: "Transactional", value: "2" },
    { text: "Service Implicit", value: "3" },
    { text: "Service Explicit", value: "4" },
  ];
  contentTypeMaster: any = [
    { text: "--All--", value: "-1" },
    { text: "STATIC", value: "1" },
    { text: "DYNAMIC", value: "2" },
  ];
  tempalteNameMaster: any = [];
  displayTemplate: any = "";
  dataSource: any ;

  constructor(
    private spinner: NgxSpinnerService,
    private changeDetectRef: ChangeDetectorRef,
    private toaster: ToastrService,
   // private smsService: SmsService
  ) {
    //this.smsService.openTemplateTableData.subscribe((data) => {

    //  // someprcCall
    //  this.searchTemplate(0);
    //  this.displayTemplate = "block";

    //});
  }

  ngOnInit() {}

  closeTemplateModal(type) {
    this.displayTemplate = "none";
    this.dataSource.paginator = this.paginator;
    this.apiCalled = false;
  }

  getTemplateList(){
    // console.log(this.templateSearch,"TeamplateSearch")
    this.spinner.show();
    //this.smsService.getTemplateList(this.templateSearch).subscribe((tempalteList)=>{
    //  this.apiCalled = true;
    //  // console.log(tempalteList,"TemplateList")
    //  this.dataSource = new MatTableDataSource(
    //    JSON.parse(JSON.stringify(tempalteList))
    //  );
    //  this.changeDetectRef.detectChanges();
    //  this.dataSource.paginator = this.paginator;
    //  this.dataSource.sort = this.sort;
    //  this.spinner.hide();
    //  // console.log(this.dataSource,"Data")
    //},(err)=>{
    //  this.spinner.hide();
    //  this.toaster.warning("Something Went Wrong","Warning")
    //})
  }

  selectTemplate(rowData){
    // console.log(rowData,"Data")
    this.TemplatData.emit(rowData);
    this.displayTemplate = 'none'
  }

  searchTemplate(flag) {
    if(flag == 0){
      if(this.apiCalled == false){
        this.getTemplateList();
      }
    }else{
      this.getTemplateList()
    }
  }
}
