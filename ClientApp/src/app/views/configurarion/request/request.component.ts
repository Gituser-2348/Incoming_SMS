import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { MatTableModule } from '@angular/material/table';
import { ConfigureService } from '../configure.service';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material/table";
import { RequestModel } from '../ConfigurationModel';
import { InfoComponent } from '../info/info.component';
import { ConfigurarionComponent } from '../configurarion.component';
import { MatDialog } from '@angular/material/dialog';
import { NewrequestComponent } from './newrequest/newrequest.component';
import { MatTooltipModule } from '@angular/material/tooltip'
import { ViewChild } from '@angular/core';
 @Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
  
})
  

 export class RequestComponent implements OnInit {
   requestData: any; numRows: any = 5;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Request_ID', 'Circle', 'Date_of_Request', 'Request_By', 'Customer', 'Plan', 'Services', 'Platform','Status','view'];
   /*  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;*/
   ReqID: any; is_show_no_data_err: boolean = false;
  show_err: boolean;
  error_reqid: any;
  config_: ConfigurarionComponent;
  //info_: InfoComponent;
  
  dataSource: any;
   constructor(private config_service: ConfigureService, private conf: ConfigurarionComponent, private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.config_ = conf;


    //this.config_service.tabChange$.subscribe(index => {
    //  /* alert(this.config_.info_rid);*/
    //  this.GetRequestTable('0');
    //  //if (index === 2) {
    //  //  // Perform actions specific to the "Info" tab
    //  //  this.ngOnInit(); // Call ngOnInit explicitly when the tab is changed
    //  //}
    //});
    
  }

   executeFunction() {
    //alert('Function in RequestComponent executed');
     // Your logic here
     this.GetRequestTable("0");
   }
   ngAfterViewInit() {

     if (this.dataSource && this.paginator && this.sort) {
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
     }
   }

   applyFilter(filterValue: string) {
     filterValue = filterValue.trim(); // Remove whitespace
     filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
     this.dataSource.filter = filterValue;
   }
 
  ngOnInit(): void {
    this.show_err = true;
    this.error_reqid = "sorry";
    this.GetRequestTable("0");
    this.requestData = '0';

    // Pass the variable value to app-info.component.ts
    this.config_service.setData(this.requestData);

  }


  
  req_search() {
  //  console.log("search button");
   // console.log(this.ReqID);
   
    var req_id = '';

    if (this.ReqID != null) {
      req_id = this.ReqID.toString();
    }
    if (req_id.trim() === '') {
      req_id = '0';
    }
  //  console.log('req_id', req_id);
    this.GetRequestTable(req_id);

  }
  GetRequestTable(ReqID:any) {

    //alert("get request table");
   
    this.config_service.getRequestTabe(ReqID).subscribe((resp: any[]) => {
    //  console.log("resp", resp);
    
        this.is_show_no_data_err = false;
        this.dataSource = new MatTableDataSource(
          JSON.parse(JSON.stringify(resp))
        );
      this.cdr.detectChanges();
        this.numRows = this.dataSource.data.length;
      //  this.numRows = this.numRows < 5 ? this.numRows : 5;
        //this.paginator.pageSize = this.numRows < 5 ? this.numRows : 5;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //this.dataSource = JSON.parse(JSON.stringify(resp))
        //this.dataSource = resp;
        //this.dataSource = JSON.parse(JSON.stringify(this.dataSource));
       // console.log("datasource", this.dataSource);
       // console.log("datasource length", this.dataSource.data.length);

        ///console.log(resp);
      
     
    })
  }

  configure(id: any,customer_name:any) {
   /* alert("configure"+id);*/
   // console.log('id', id, 'customer name', customer_name);
    //const info_ = new InfoComponent(this.config_service);
    //const conf_ = new ConfigurarionComponent();
   // info_.GetInfo(id);
    // conf_.show_status = "1";
    this.config_.info_rid = id.toString();
    this.config_.info_customer_name = customer_name;
    ////console.log('config_.info_id', this.config_.info_rid);
    //console.log('config_.info_customer_name', this.config_.info_customer_name);
    this.config_service.setData(this.config_.info_rid);
    /*alert('this.config_.info_rid-->request' + this.config_.info_rid);*/

   // conf_.globalMenuId = "Info";
    this.config_service.changeTab(1);
    this.config_.globalMenuId = "Info";
    this.config_service.updatevmnbtnState(true);
   

  }
   preventNegativeInput_(event: KeyboardEvent) {
     if (this.ReqID < 0 && event.key === 'ArrowDown') {
       event.preventDefault();
     }
   }

   preventNegativeInput(event: KeyboardEvent) {
     if (event.key === '-' || event.key === '+' || event.key === '-' || event.key === '+') {
       event.preventDefault();
     }
   }
   preventNegativeWheel(event: WheelEvent) {
     if (this.ReqID < 0 && event.deltaY < 0) {
       event.preventDefault();
     }
   }
  createnewrequest() {
    //alert('new request');
    
    const dialogRef = this.dialog.open(NewrequestComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
     
      this.GetRequestTable("0");// Call the function in response to dialog close event
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.GetRequestTable("0");
    });
  }

}
