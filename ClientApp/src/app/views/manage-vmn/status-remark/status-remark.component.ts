import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip'
@Component({
  selector: 'app-status-remark',
  templateUrl: './status-remark.component.html',
  styleUrls: ['./status-remark.component.scss']
})
export class StatusRemarkComponent implements OnInit
{
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() dialogTitle: string;
  @Input() data: any[];
  @Input() columns: string[];
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {
    this.dialogTitle = dialogData.dialogTitle;
  this.data = dialogData.data;
    this.columns = dialogData.columns;
    this.data = this.data.map(item => ({
      ...item,
      Status_Changed_Date: item.Status_Changed_Date.replace(/T/g, ' ')
    }));
    this.dataSource = new MatTableDataSource(
      JSON.parse(JSON.stringify(this.data))
    );
    //this.dataSource = JSON.parse(JSON.stringify(resp))
    //this.dataSource = resp;
    //this.dataSource = JSON.parse(JSON.stringify(this.dataSource));
  //  console.log("datasource", this.dataSource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
   // console.log(this.data);
   
}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  ngOnInit(): void {
  //  console.log('dialogData.columns', this.columns);
  //  console.log(' dialogData.data', this.data);
    this.data = this.data.map(item => ({
      ...item,
      Status_Changed_Date: item.Status_Changed_Date.replace(/T/g, ' ')
    }));

  }

}
