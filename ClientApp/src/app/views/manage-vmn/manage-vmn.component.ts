import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ManagevmnService } from './manage-vmn/managevmn.service';
import { vmndropdown } from './manage-vmnModel';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { StatusRemarkComponent } from './status-remark/status-remark.component';
import { ActionvmnComponent } from './actionvmn/actionvmn.component';
import { SigninService } from '../sign-in/sign-in.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-manage-vmn',
  templateUrl: './manage-vmn.component.html',
  styleUrls: ['./manage-vmn.component.scss']
})
export class ManageVMNComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator; numRows: any = 5;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [ 'Longcode_No', 'IMSI', 'Status', 'Proxy','StatusRemark','Action'];
  vmnlist = Array<vmndropdown>();
  vmn_: any='0'; dataSource: any;
  tableData: any[];
  tableColumns: string[] = ['Longcode_no', 'IMSI','Changed_Status', 'Status_Changed_By', 'Remarks', 'Status_Changed_Date', ];
  hideIDColumn = false;
  constructor(private mngvmnservice: ManagevmnService, private dialog: MatDialog, private signInService: SigninService, private cdr: ChangeDetectorRef) { }
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
   // alert();
    this.GetVmnDropdown();
    this.GetVmnTable(0);
   
  }
  GetVmnDropdown() {
   // console.log('getvmndropdown');
    this.mngvmnservice.GetVmnDropdown().subscribe((resp: any[]) => {
     // console.log(resp);
      this.vmnlist = resp;

    });
  };
  GetVmnTable(vmn_n:any) {
   // console.log('GetVmnTable');
    this.mngvmnservice.GetVmntable(vmn_n.toString()).subscribe((resp: any[]) => {
     // console.log(resp);
      //this.vmnlist = resp;
      this.dataSource = new MatTableDataSource(
        JSON.parse(JSON.stringify(resp))
      );

      this.cdr.detectChanges();
      this.numRows = this.dataSource.data.length;
     // this.numRows = this.numRows < 5 ? this.numRows : 5;
      /*this.paginator.pageSize = this.numRows < 5 ? this.numRows : 5;*/
      //this.dataSource = JSON.parse(JSON.stringify(resp))
      //this.dataSource = resp;
      //this.dataSource = JSON.parse(JSON.stringify(this.dataSource));
     // console.log("datasource", this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     // console.log(resp);
    });

  
  }
  GetStatusRemarkTable(vmn_id: any) {
    this.mngvmnservice.GetStatusRemarktable(vmn_id.toString()).subscribe((resp: any[]) => {
    //  console.log(resp);
      this.tableData = resp;
      this.tableData = this.tableData.map(item => {
        const { id, ...rest } = item;
        return rest;
      });
     // console.log('tabledata', this.tableData);
      this.dialog.open(StatusRemarkComponent, {
        disableClose: true,
        data: {
          dialogTitle: 'Status Remark History',
          data: this.tableData,
          columns: this.tableColumns
        }
      });
    });


  }
  vmnsearch() {
    //alert(this.vmn_);
    this.GetVmnTable(this.vmn_);
  }
  viewsts_remark(vmn_id: any) {
    //alert(vmn_id);
    this.GetStatusRemarkTable(vmn_id);
  }
  action(vmn_id:any) {
    //alert(vmn_id);
    const dialogRef = this.dialog.open(ActionvmnComponent, {
      disableClose: true,
      data: {
        vmn_id: vmn_id
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.GetVmnTable(0);// Call the function in response to dialog close event
    });

   
    
  }
}
