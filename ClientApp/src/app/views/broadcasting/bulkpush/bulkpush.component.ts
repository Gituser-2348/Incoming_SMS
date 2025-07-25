import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ManageAccServiceService } from '../../../core/manage-acc-service/manage-acc-service.service';
//import { AccountsService } from '../../accounts/accounts.service';
import { SigninService } from '../../sign-in/sign-in.service';
import { broadcastingService } from '../broadcasting.service';
@Component({
  selector: 'app-bulkpush',
  templateUrl: './bulkpush.component.html',
  styleUrls: ['./bulkpush.component.scss']
})
export class BulkpushComponent implements OnInit {
  @ViewChild('sort') sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  serviceId: any = "-1";
  serviceList = [];
  accountID: any;
  tempNames: any = [];
   upload_id:any= "";

 
  noData: boolean = false;
  tempDetails: any = {
    template_name: "",
    template_id: "",
    category: "",
    template: "",
    language: "",
    type: "",
    variable_count: ""
  }
  file:any=""
  fileUploaded:any;
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource();
  displayStyle: any = "none";
  selectedTemp: any;
  selectedType: any = 'create'
  constructor(private toastr: ToastrService,
    private service:broadcastingService,
    private manageservice: ManageAccServiceService,
    private signInService: SigninService) { }

  ngOnInit(): void {
    var selectAcc = this.manageservice.SelectedAccount;
    if (selectAcc) {
      this.accountID = selectAcc.Value;
      this.getServices(selectAcc);
      // this.selectMenu("menuOne");
    }
    this.manageservice.accountChanged.subscribe((data) => {
      if (data) {
        this.accountID = data.Value;
        this.getServices(data);
        // console.log(this.accountID, 'acc')
        // this.selectMenu("menuOne");
      }
    });
    // this.service.fetchTempName(this.serviceId).subscribe((data:any)=>{
    //   console.log(data)
    // })
  }

  selectType(type) { //select type of header
    if (this.selectedType == type) {
    } else {
      if (type == "broadcast") {
        this.resetNow();
        var element = document.getElementById(type)
        element.classList.add("select1Color");
        element.style.zIndex = "70"
        var sumRep = document.getElementById("sumRep")
        sumRep.style.color = "#252733"
        var detRep = document.getElementById("detRep")
        detRep.style.color = "#949494"
        var element1 = document.getElementById("create")
        element1.classList.add("selectColor");
      }
      else {
        var element = document.getElementById('create')
        element.classList.remove("selectColor");
        var element1 = document.getElementById("broadcast")
        element1.classList.remove("select1Color");
        element1.style.zIndex = "20"
        var sumRep = document.getElementById("sumRep")
        sumRep.style.color = "#949494"
        var detRep = document.getElementById("detRep")
        detRep.style.color = "#252733"
      }
    }
    this.selectedType = type;
  }

  serviceChanged(event) {
    this.service.fetchTempName(this.serviceId).subscribe((data: any) => {
      console.log(JSON.parse(data), 'data');
      if (data != undefined) {
        this.tempNames = JSON.parse(data);
      } else {
        this.tempNames = [];
      }
    })
  }

  closePopup() { //for closing user popup form
    // console.log(form, 'form')
    this.displayStyle = "none";
  }

  opennPopUp() {
    this.displayedColumns = ['template_name', 'category', 'template', 'language', 'type', 'select']
    this.dataSource = new MatTableDataSource(this.tempNames);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.displayStyle = "grid";
  }

  tempChange(element) {
    this.tempDetails.template_name = element.template_name;
    this.tempDetails.template_id = element.id;
    this.tempDetails.category = element.category;
    this.tempDetails.template = element.template;
    this.tempDetails.language = element.language;
    this.tempDetails.type = "";
    this.tempDetails.variable_count = ""
    this.selectedTemp = element;
    this.displayStyle = 'none';
  }

  getServices(acc) {
    this.service.getAllService(acc.Value).subscribe((data: any) => {
      // console.log(data,'service')
      this.serviceList = data;
    })
  }

  resetNow(){
    this.upload_id=""
    this.tempDetails = {
      template_name: "",
      template_id: "",
      category: "",
      template: "",
      language: "",
      type: "",
      variable_count: ""
    }
    this.serviceId = "-1";
    this.tempNames = []; 
    this.displayedColumns = [];
  this.dataSource = new MatTableDataSource();
  this.displayStyle = "none";
  this.selectedTemp="";
  this.selectedType = 'create'
  }

  fileChange(ev) {
    console.log(ev)
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    if (!file) {
      return;
    }
    var name = ev.target.files[0].name.split(".")
    var fileType = name[name.length - 1];
    if (fileType == "csv" || fileType == "xlsx" || fileType == "xls") {
      console.log(fileType)
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        const dataString = JSON.stringify(jsonData);
        if (jsonData[Object.keys(jsonData)[1]]) {
          this.toastr.warning("Only one sheet supported", "Warning")
        }
        if (jsonData[Object.keys(jsonData)[0]]) {
          if (jsonData[Object.keys(jsonData)[0]].length > 1000) {
            return this.toastr.warning("Maximum 1000 Records at a time", "Limit Exceeded")
          } else {
            this.changeFormat(jsonData[Object.keys(jsonData)[0]])
            // console.log(jsonData[Object.keys(jsonData)[0]])

          }
        }
      }
      reader.readAsBinaryString(file);
    } else {
      return this.toastr.warning("Invalid format", "Warning")
    }
  }

  changeFormat(data) {
    // console.log(data,'dataToChange');
    var changedData = []
    data.map((row: any) => {
      // console.log(row);
      var length = Object.keys(row).length
      var obj = {};
      for (let i = 1; i < length; i++) {
        var nameOf = row[Object.keys(row)[i]];
        obj[`param${i}`] = nameOf;
      }
      //  console.log( Object.keys(row)[0],'key')
      changedData.push({ number: row[Object.keys(row)[0]], params: obj })
    });
    this.fileUploaded=changedData;

    // console.log(changedData, 'changedData');
    // var dataTo = {
    //   "service_id": this.serviceId,
    //   "acc_id": this.accountID,
    //   "user_id": this.signInService.decryptData(sessionStorage.getItem('UserID')),
    //   "data": changedData
    // }
    // console.log(dataTo, 'dataTo')
    // this.service.tempBaseUpload(dataTo).subscribe((data: any) => {
    //   this.formData.upload_id = data
    //   console.log(data, 'fromDb');
    //   console.log(this.formData, 'formData')
    // })
  }

  uploadNow(){
    var dataTo = {
      "service_id": this.serviceId,
      "acc_id": this.accountID,
      "user_id": this.signInService.decryptData(sessionStorage.getItem('UserID')),
      "data": this.fileUploaded
    }
    console.log(dataTo, 'dataTo')
    this.service.tempBaseUpload(dataTo).subscribe((data: any) => {
      console.log(data, 'fromDb');
      if(data!=undefined){
       if(data.status==1){
        this.file=""
        this.fileUploaded=""
        this.upload_id = data;
        this.toastr.success(data.message)
       }else{
        this.toastr.warning(data.message)
       }
      }
    })
  }
  // ngOnDestroy(){
   
  // }

}
