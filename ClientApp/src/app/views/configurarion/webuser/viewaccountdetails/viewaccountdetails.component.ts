import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigureService } from '../../configure.service';
import { urldropdown } from '../../ConfigurationModel';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-viewaccountdetails',
  templateUrl: './viewaccountdetails.component.html',
  styleUrls: ['./viewaccountdetails.component.scss']
})
export class ViewaccountdetailsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator; repdu: any;
  @ViewChild(MatSort) sort: MatSort; customer: any = "0";
  customerlist = Array<urldropdown>(); userlist = Array<urldropdown>(); dataSource: any;
  displayedColumns: string[] = ['Request_ID', 'Customer_Name', 'User_Name', 'Phone_No', 'Email_ID', 'Address', 'Created_Date', 'Created_By'];
  constructor(private config_service: ConfigureService) { }

  ngOnInit(): void {
    this.GetCustomerList();

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
  GetCustomerList() {
    this.config_service.AddUserCustomerDropdown().subscribe((resp: any[]) => {
      /*console.log(resp);*/

    //  console.log('resp2222', resp);

      
      this.userlist = resp[0].table2;
      
    });
   this.GetRequestTable();
  }

  GetRequestTable() {
    var ReqID = this.customer.toString();
    //alert("get request table");

    this.config_service.getuserdetails(ReqID).subscribe((resp: any[]) => {
     // console.log("resp");
     // console.log(resp);
      // console.log("resp length", resp.length);
      //this.gridApi.setRowData(resp)
      if (resp.length == 0) {
        // this.is_show_no_data_err = true;
        this.dataSource = new MatTableDataSource(

        );
      }
      else {
        let du = [];
        
        this.repdu = JSON.parse(JSON.stringify(resp));
        for (const item of this.repdu) {
          // Check if the item has the 'Received Time' property
          if (item.hasOwnProperty('Created_Date')) {
            // Replace 'T' with a space in the 'Received Time' property
            try { item['Created_Date'] = item['Created_Date'].replace('T', ' '); }
            catch {
              console.log('cant replace T');
            }

          }
        }
        this.dataSource = new MatTableDataSource(
          // JSON.parse(JSON.stringify(resp))
          this.repdu
        );
       
        //this.numRows = this.dataSource.data.length;
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
      }

    })
  }

}
