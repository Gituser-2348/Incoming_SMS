import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { ConfigurarionComponent } from '../configurarion.component';
import { ConfigureService } from '../configure.service';
import { urldropdown, vmnlist } from '../ConfigurationModel';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AddVmn } from '../ConfigurationModel';

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material/table";
import { RequestModel } from '../ConfigurationModel';
import { InfoComponent } from '../info/info.component';

import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { ViewChild } from '@angular/core';
import { SigninService } from '../../sign-in/sign-in.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UrlComponent } from '../url/url.component';


@Component({
  selector: 'app-numbers',
  templateUrl: './numbers.component.html',
  styleUrls: ['./numbers.component.scss']
})
export class NumbersComponent implements OnInit {
  items: any[]; is_show_no_data_err: boolean = false; is_show_val_error: boolean = false;
  config_: ConfigurarionComponent;
  length: any; is_show_vmn_data: boolean = true; is_show_dup_err: boolean = false;
  msisdn: any; check_dup_vmn: Array<vmnlist> = [];
  imsi: any; url_component_: UrlComponent;
  customerlist = Array<urldropdown>(); Duplicatemsisdn: any[]; Duplicateimsi: any[];
  add_vmn: AddVmn; isvmnbtnEnabled = false;

  customer_: any; newItem: any; customer_name_: any; customername__: any; req_id: any;
  org_item: any[];
  displayedColumns: string[] = ['Sl_No', 'MDN / MSISDN', 'IMSI']; dataSource: any; account_id_: any;
  constructor(private sanitized: DomSanitizer, private conf: ConfigurarionComponent, private config_service: ConfigureService,
    private signin_service: SigninService, private snackBar: MatSnackBar, private toastr: ToastrService) {
   // this.url_component_ = url_c;

    this.items = []; this.org_item = [];
    this.config_ = conf;
    this.customer_name_ = this.config_.info_customer_name;
    this.req_id = this.config_.info_rid;
   
    this.config_service.tabChange$.subscribe(index => {
     /* alert(this.config_.info_rid);*/
      this.GetNumberTable(this.config_.info_rid);
      //if (index === 2) {
      //  // Perform actions specific to the "Info" tab
      //  this.ngOnInit(); // Call ngOnInit explicitly when the tab is changed
      //}
    });


    this.config_service.isvmnbtnEnabled$.subscribe((isEnabled) => {
      this.isvmnbtnEnabled = isEnabled;
    });
  }

  ngOnInit(): void {
    this.isvmnbtnEnabled = true;
    this.is_show_val_error = false;
  //  console.log('config.info_rid', this.config_.info_rid);
    this.config_service.data$.subscribe(data => {
      this.config_.info_rid = data;
      // Print the value in the console or perform any other operations
    });

    
    //this.ini_id = this.config_.info_rid;
    //alert('ng on init()-->this.ini_id' + this.ini_id);
    //alert(this.config_.info_rid);
    this.items = []; this.org_item = [];
    if (this.config_.info_rid == 0 || this.config_.info_rid == '') {
      this.is_show_no_data_err = true;
      this.is_show_vmn_data = false;
    }
    else {
      this.is_show_no_data_err = false;
      this.is_show_vmn_data = true;
      this.GetNumberTable(this.config_.info_rid);
      this.customer_name_ = this.config_.info_customer_name;

      this.GetCustomerDropdown();

    }

    

  }
  add_button() {
    this.is_show_val_error = false;
    //alert('add');
  //  console.log('config.info_rid', this.config_.info_rid);
    if (this.config_.info_rid == null || this.config_.info_rid == "" || this.config_.info_rid=='0') {
      const errorMessage = 'Invalid Request ID found. Please select a request for configure ';
      this.toastr.error(errorMessage, 'Error');
      this.config_service.changeTab(0);
    }
    else {
     // alert('else');
      //console.log("this.dataSource.data", this.dataSource.data);

      const invalidItems = this.dataSource.data.filter(item => {
        return item.editable && (!item.msisdn || !item.imsi ||
          /^\s*$/.test(item.msisdn) || /^\s*$/.test(item.imsi) ||
          isNaN(Number(item.msisdn)) || isNaN(Number(item.imsi)));
      });
      const invalidItems1 = this.dataSource.data.filter(item => {
        return item.editable &&
          ((!item.msisdn || item.msisdn.length < 9 || /^\s*$/.test(item.msisdn) || isNaN(Number(item.msisdn))) || /\s/.test(item.msisdn) ||
            (!item.imsi || item.imsi.length < 9 || /^\s*$/.test(item.imsi) || /\s/.test(item.imsi) || isNaN(Number(item.imsi))));
      });

     // console.log("invalidItems1", invalidItems1);
      if (invalidItems1.length > 0) {
        // Display a message or take any action you want for invalid items
        const errorMessage = 'Invalid items found.. Please check the MSISDN and IMSI values.';
        this.toastr.error(errorMessage, 'Error');
        this.is_show_val_error = true;
      } else {

        //const invalidItems = this.dataSource.data.filter(item => {
        //  return item.editable &&
        //    (!item.msisdn || item.msisdn.length < 9 || /^\s*$/.test(item.msisdn) || isNaN(Number(item.msisdn))) ||
        //    (!item.imsi || item.imsi.length < 9 || /^\s*$/.test(item.imsi) || isNaN(Number(item.imsi)));
        //});

        if (invalidItems.length > 0) {
          const errorMessage = 'Invalid items found. Please check the MSISDN and IMSI values.';
          this.toastr.error(errorMessage, 'Error');
          this.is_show_val_error = true;
        } else {

          if (this.dataSource.data.length >= 10) {
            // If the length is already 10 or more, display a message or take any action you want
            this.toastr.error('Number Limit should not exceed from 10.', 'Error');
            return; // Exit the function to prevent further execution
          }

          //alert('else2');
          //const length_ = this.items.length;
          //const index_ = this.items[length_].index;
          //console.log('length', length_, 'index', index_);
          const maxIndex = Math.max(...this.items.map(item => item.index));

          if (!isNaN(maxIndex) && isFinite(maxIndex)) {

            this.newItem = {
              index: maxIndex + 1,
              msisdn: this.sanitized.bypassSecurityTrustHtml('<input maxlength="15" style=" border-radius: 10px;border-width: 1px;height: 20px;" type="text" >'),
              imsi: this.sanitized.bypassSecurityTrustHtml('<input maxlength="15" style=" border-radius: 10px;border-width: 1px;height: 20px;" type="text" >')
            };
          }
          else {

            this.newItem = {
              index: 0,
              msisdn: this.sanitized.bypassSecurityTrustHtml('<input maxlength="15" style=" border-radius: 10px;border-width: 1px;height: 20px;" type="text" >'),
              imsi: this.sanitized.bypassSecurityTrustHtml('<input maxlength="15" style=" border-radius: 10px;border-width: 1px;height: 20px;" type="text" >')
            };
          }

          this.items.push(this.newItem);

          const new_org_item = { msisdn: '', imsi: '', editable: true, msisdnDuplicate :false , imsiDuplicate : false};
          this.org_item.push(new_org_item);
          this.dataSource.data.push(new_org_item);
          // console.log('datasurce', this.dataSource);
          this.dataSource._updateChangeSubscription();
          //console.log("this.dataSource.data", this.dataSource.data);
        }
      }
    }
  }
  minus(index_: any) {
   
    this.org_item.splice(index_, 1);
    this.dataSource.data.splice(index_, 1);
    this.dataSource._updateChangeSubscription();
    //this.org_item = this.org_item.filter(item => item.index !== index_);
    
  }
  GetNumberTable(ReqID: any) {
    if (this.config_.info_rid == 0 || this.config_.info_rid == '') {
      this.is_show_no_data_err = true;
      this.is_show_vmn_data = false;
    }
    else {
      this.is_show_no_data_err = false;
      this.is_show_vmn_data = true;
     

    }
    this.items = [];
    this.customer_ = ReqID.toString(); 
    this.customer_name_ = this.config_.info_customer_name;
    this.req_id = this.config_.info_rid;
 //  console.log(ReqID);
    this.config_service.getNumberTable(ReqID).subscribe((resp: any[]) => {
     
      this.length = resp.length;
      const firstItem = resp[0];
      this.dataSource = new MatTableDataSource(
        JSON.parse(JSON.stringify(resp))
      );
     /* this.dataSource.data = this.items.map((item, index) => ({ index: index + 1, ...item }));*/
      //this.dataSource = JSON.parse(JSON.stringify(resp))
      //this.dataSource = resp;
      //this.dataSource = JSON.parse(JSON.stringify(this.dataSource));
      this.dataSource.data.forEach((item: any, index: number) => {
        item.editable = false;
        item.msisdnDuplicate = false;
        item.imsiDuplicate = false;// Add editable property to each item
        // Add index property to each item
      });
    //  console.log("datasource", this.dataSource);
      for (let i = 0; i < this.length; i++) {
        this.msisdn = resp[i].msisdn;
        this.imsi = resp[i].imsi;

       
        const newItem = {
          index:i,
          msisdn: this.sanitized.bypassSecurityTrustHtml('<input  style="border-radius: 10px; border-width: 1px; height: 20px;" value="' + this.msisdn + '" type="text">'),
          imsi: this.sanitized.bypassSecurityTrustHtml('<input  style="border-radius: 10px; border-width: 1px; height: 20px;" value="' + this.imsi + '" type="text">')
        };
        this.items.push(newItem);
        const new_org_item = { msisdn: this.msisdn, imsi: this.imsi };
        this.org_item.push(new_org_item);
      }


     
    });

  }
  GetCustomerDropdown() {
    this.config_service.getCustomerDropdown().subscribe((resp: any[]) => {
      /*console.log(resp);*/
      this.customerlist = resp;
    });
  }
  customer_search() {
    const selectedText = this.customerlist.find(item => item.value === this.customer_)?.text;
  //  console.log('Selected customer text:', selectedText);
    this.customer_name_ = selectedText.toString();
  //  console.log('cus name', this.customer_name_);
    this.customername__ = selectedText.toString();
    this.GetNumberTable(this.customer_.toString());
  }

  checkDuplicates() {
    const seenMsisdns = new Set();
    const seenImsis = new Set();

    for (const item of this.dataSource.data) {
      if (seenMsisdns.has(item.msisdn) || seenImsis.has(item.imsi)) {
        return true; // Duplicates found, return true
      }

      seenMsisdns.add(item.msisdn);
      seenImsis.add(item.imsi);
    }

    return false; // No duplicates found, return false
  }




  pre_back() {

    this.config_service.changeTab(1);
  }



  save_() {
    this.is_show_dup_err = false;
    this.is_show_val_error = false;
    //alert('save');
    if (this.config_.info_rid == null || this.config_.info_rid == "" || this.config_.info_rid == '0') {
      const errorMessage = 'Invalid Request ID found. Please select a request for configure ';
      this.toastr.error(errorMessage, 'Error');
      this.config_service.changeTab(0);
    }
    else {
    // console.log(this.org_item);
    //  console.log(this.items);

      this.add_vmn = new AddVmn();
      this.add_vmn.Request_id = this.req_id;
      //this.add_vmn.vmnlist = [...this.dataSource.data.map(item => ({ msisdn: item.msisdn, imsi: item.imsi }))];
      this.add_vmn.vmnlist = this.dataSource.data
        .filter(item => item.editable)
        .map(item => ({ msisdn: item.msisdn, imsi: item.imsi }));
      const invalidItems = this.dataSource.data.filter(item => {
        return item.editable && (!item.msisdn || !item.imsi ||
          /^\s*$/.test(item.msisdn) || /^\s*$/.test(item.imsi) ||
          isNaN(Number(item.msisdn)) || isNaN(Number(item.imsi)));
      });

      const invalidItems1 = this.dataSource.data.filter(item => {
        return item.editable &&
          ((!item.msisdn || item.msisdn.length < 9 || /^\s*$/.test(item.msisdn) || isNaN(Number(item.msisdn))) || /\s/.test(item.msisdn) ||
          (!item.imsi || item.imsi.length < 9 || /^\s*$/.test(item.imsi) || /\s/.test(item.imsi) || isNaN(Number(item.imsi))));
      });

      // console.log("invalidItems1", invalidItems1);
      if (invalidItems1.length > 0) {
        // Display a message or take any action you want for invalid items
        const errorMessage = 'Invalid items found.. Please check the MSISDN and IMSI values.';
        this.toastr.error(errorMessage, 'Error');
        this.is_show_val_error = true;
      } else {


        //const invalidItems = this.dataSource.data.filter(item => {
        //  return item.editable &&
        //    (!item.msisdn || item.msisdn.length < 9 || /^\s*$/.test(item.msisdn) || isNaN(Number(item.msisdn))) ||
        //    (!item.imsi || item.imsi.length < 9 || /^\s*$/.test(item.imsi) || isNaN(Number(item.imsi)));
        //});
        // this.check_dup_vmn = this.dataSource.data.map(item => ({ msisdn: item.msisdn, imsi: item.imsi }));
        const is_dup: boolean = this.checkDuplicates();
        if (is_dup == true) {
          const errorMessage = 'Avoid duplicated msisdn/imsi ';
          this.toastr.error(errorMessage, 'Error');
        }
        else {
          if (invalidItems.length > 0) {
            const errorMessage = 'Invalid items found. Please check the MSISDN and IMSI values.';
            this.toastr.error(errorMessage, 'Error');
            this.is_show_val_error = false;
          }
          else {
            if (this.dataSource.data.length == 0) {

              const errorMessage = 'No VMN found for configure, please add msisdn & imsi';
              this.toastr.error(errorMessage, 'Error');
            }
            else {
              this.account_id_ = this.signin_service.decryptData(sessionStorage.getItem("AccountId"));
              this.add_vmn.account_id = this.account_id_;
              //  console.log('datasource.data', this.dataSource.data);
              const reqbody = JSON.stringify(this.add_vmn);

              // this.config_.actual_vmn_json = this.dataSource.data;
              this.config_.actual_vmn_json = this.dataSource.data.map(item => ({ msisdn: item.msisdn, imsi: item.imsi }));
             // console.log('  this.config_.actual_vmn_json', this.config_.actual_vmn_json);
              this.config_service.AddVmn(reqbody).subscribe((resp: any) => {
              console.log("AddVmnresp", resp);
                //console.log("AddVmnresp", resp.status);
               // console.log("AddVmnresp", resp);
                if (resp.status == 5) {
                  const json_b = JSON.parse(resp.response);
                 // console.log('json_b', json_b);

                  try {
                    this.Duplicatemsisdn = JSON.parse(json_b.DuplicateMsisdn);

                  } catch {
                  //  console.log('error happened while parse DuplicateMsisdn');

                  }
                  try {
                    this.Duplicateimsi = JSON.parse(json_b.Duplicateimsi);

                  } catch {
                 //   console.log('error happened while parse Duplicateimsi');

                  }

                 // console.log('this.Duplicatemsisdn', this.Duplicatemsisdn);
                //  console.log('this.Duplicateimsi', this.Duplicateimsi);
                //  console.log('this.datasourse.data', this.dataSource.data);

                  if (this.Duplicatemsisdn != null && this.Duplicatemsisdn.length > 0) {
                    for (const item of this.Duplicatemsisdn) {
                      const msisdnValue = item.Msisdn;
                    //  console.log("DuplicateMsisdn: " + msisdnValue);
                      for (const ditem of this.dataSource.data) {
                        if (ditem.msisdn == msisdnValue) {

                          ditem.msisdnDuplicate = true;
                        }

                      }

                    }

                  }


                  if (this.Duplicateimsi != null && this.Duplicateimsi.length > 0) {
                    for (const item of this.Duplicateimsi) {
                      const imsiValue = item.imsi;
                    //  console.log("DuplicateMsisdn: " + imsiValue);

                      for (const ditem of this.dataSource.data) {
                        if (ditem.imsi == imsiValue) {

                          ditem.imsiDuplicate = true;
                        }

                      }
                    }
                  }
                //  console.log('this.datasourse.data', this.dataSource.data);
                  this.is_show_dup_err = true;


                 // this.Duplicatemsisdn =
                }

               else if (resp.status == 1) {
                  this.config_.url_info = true;
                  this.config_.url_no_vmn = false;
                  // this.config_service.setBooleanValue(false);
                  //this.url_component_.is_show_err_no_data = false;
                  //this.url_component_.is_show_err_no_data_vmn = false;
                  //this.url_component_.is_show_url_info = true;
                  //this.config_service.getBooleanObservable().subscribe(value => {
                  //  this.url_component_.is_show_err_no_data_vmn = false;
                  //});
                  //this.snackBar.open(resp[0].response, 'Success', { duration: 6000 });
                  //console.log('succcess');
                  //this.config_service.setData(this.url_component_.is_show_err_no_data);
                  //this.config_service.setData(this.url_component_.is_show_err_no_data_vmn);
                  //this.config_service.setData(this.url_component_.is_show_url_info);
                  /*alert('this.config_.info_rid-->request' + this.config_.info_rid);*/

                  // conf_.globalMenuId = "Info";
                  this.config_service.changeTab(3);

                  this.GetNumberTable(this.config_.info_rid);
                }
                else {
                  // this.snackBar.open(resp[0].response, 'Error', { duration: 6000 });
                  //const errorMessage = 'Avoid duplicated msisdn/imsi ';
                  this.toastr.error(resp.response, 'Error');
                  this.url_component_.is_show_err_no_data = false;
                  this.url_component_.is_show_err_no_data_vmn = true;
                  this.url_component_.is_show_url_info = false;
                  //this.config_service.chang_to_3();
                  //  this.snackBar.open(resp[0].response, 'Success', { duration: 6000 });
               //   console.log('succcess');
                  this.config_service.setData(this.url_component_.is_show_err_no_data);
                  this.config_service.setData(this.url_component_.is_show_err_no_data_vmn);
                  this.config_service.setData(this.url_component_.is_show_url_info);
                  this.GetNumberTable(this.config_.info_rid);
                }
              });
              
            }
            //  console.log(this.add_vmn);
            //  console.log(JSON.stringify(this.add_vmn));


          }

        }
      }
     
    }
  }
}
