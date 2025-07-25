import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ColDef, FirstDataRenderedEvent, GridApi, GridReadyEvent, ServerSideStoreType } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { share } from 'rxjs/operators';
import { ManageAccServiceService } from '../../../core/manage-acc-service/manage-acc-service.service';
import { ExcelService } from '../../../core/services/excel-services';
import { SigninService } from '../../sign-in/sign-in.service';
import { DateRange, ReportFilter } from '../report.modal';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-pmmw',
  templateUrl: './pmmw.component.html',
  styleUrls: ['./pmmw.component.scss']
})
export class PmmwComponent implements OnInit {
  public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  reportFilter: ReportFilter = <ReportFilter>{};
  service: any = "0"
  private gridApi!: GridApi;
  show: boolean = false;
  public columnDefs: (ColDef)[] = [

    {
      "field": "SL No",
      filter: 'agNumberColumnFilter'
    },
    {
      "field": "Message ID",
      filter: 'agTextColumnFilter'
    },
    {
      "field": "Customer Number",
      filter: 'agTextColumnFilter'
    },
    {
      "field": "Whatsapp Number",
      filter: 'agNumberColumnFilter'
    },
    {
      "field": "Type",
      filter: 'agTextColumnFilter'
    },
    {
      "field": "Message Time",
      filter: 'agTextColumnFilter'
    },
    {
      "field": "Sent Time",
      filter: 'agTextColumnFilter'
    },
    {
      "field": "Delivered Time",
      filter: 'agTextColumnFilter'
    },
    {
      "field": "Seen Time",
      filter: 'agTextColumnFilter'
    },
    {
      "field": "FailedReason",
      "headerName": "Failed Reason",
      filter: 'agTextColumnFilter'
    },

  ];

  public defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };
  accountID: any;
  serviceList: any = []
  public rowModelType = '';
  public serverSideStoreType: ServerSideStoreType = 'partial';
  rowHeight: number = 18;
  headerHeight: number = 30;
  // public rowData: any[] | null;
  tableData = Array<any>();
  dateRange: DateRange = <DateRange>{};
  public popupParent: HTMLElement = document.body;
  constructor(
    private Service: ReportService,
    private toastr: ToastrService,
    private manageservice: ManageAccServiceService,
    private spinner: NgxSpinnerService,
    private excelservice: ExcelService,
    private signInService: SigninService
  ) { }

  ngOnInit(): void {
    var selectAcc = this.manageservice.SelectedAccount;
    if (selectAcc) {
      this.getServices(selectAcc);
      this.accountID = selectAcc.Value;
    }
    this.manageservice.accountChanged.subscribe((data) => {
      if (data) {
        this.getServices(data);
        this.accountID = data.Value;
      }
    });
    var selectAcc = this.manageservice.SelectedAccount;
    if (selectAcc) {
      this.getServices(selectAcc);
      this.accountID = selectAcc.Value;
    }
    this.manageservice.accountChanged.subscribe((data) => {
      if (data) {
        this.getServices(data);
        this.accountID = data.Value;
      }
    });
  }

  getServices(acc) { //for fetching services
    this.Service.getAllService(acc.Value).subscribe((data: any) => {
      this.serviceList = data;
      console.log(data, 'service')
    })
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) { //auto width column after data load
    // params.api.sizeColumnsToFit();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  getReport() { //fetching report
    this.spinner.show();
    if (this.manageservice.SelectedAccount.Value == "-1") {
      this.spinner.hide()
      this.toastr.warning("Please select Account", "Warning");
      return;
    } else if (!this.service || this.service < 1) {
      this.toastr.warning("Please select Service", "Warning");
      this.spinner.hide()
      return;
    }
    if (new Date().toISOString().slice(0, 10) < this.reformatDateString(this.dateRange.FromDate) == true) {
      this.spinner.hide()
      return this.toastr.warning("Select valid date", "Warning")
    }
    var reportFilterData = { ... this.reportFilter };
    reportFilterData.toNumber = reportFilterData.toNumber ? reportFilterData.toNumber : "";

    reportFilterData.fromDate = this.dateRange.FromDate;
    reportFilterData.toDate = this.dateRange.ToDate;
    reportFilterData.userId = Number(this.signInService.decryptData(sessionStorage.getItem("UserID")));
    reportFilterData.serviceId = this.service;
    this.Service.getWhatsappReport(reportFilterData).subscribe((resp: any) => {
      if (resp != undefined) {
        console.log(JSON.parse(JSON.stringify(resp)), 'result')
        this.show = true;
        this.tableData = JSON.parse(JSON.stringify(resp));
        this.spinner.hide()
      } else {
        this.show = false;
        this.spinner.hide();
      }
    });

  }

  reformatDateString(s) { //for changing the date format
    var b = s.split(/\D/);
    return b.reverse().join('-');
  }

  download() { //for downloading report
    if (this.manageservice.SelectedAccount.Value == "-1") {
      this.toastr.warning("Please select Account", "Warning");
      return;
    } else if (!this.service || this.service < 1) {
      this.toastr.warning("Please select Service", "Warning");
      return;
    }
    if (new Date().toISOString().slice(0, 10) < this.reformatDateString(this.dateRange.FromDate) == true) {
      return this.toastr.warning("Select valid date", "Warning")
    }
    this.spinner.show();
    var reportFilterData = { ... this.reportFilter };
    reportFilterData.toNumber = reportFilterData.toNumber ? reportFilterData.toNumber : "";

    reportFilterData.fromDate = this.dateRange.FromDate;
    reportFilterData.toDate = this.dateRange.ToDate;
    reportFilterData.userId = Number(this.signInService.decryptData(sessionStorage.getItem("UserID")));
    reportFilterData.serviceId = this.service;
    this.Service.getWhatsappReport(reportFilterData).subscribe((resp: any) => {
      this.excelservice.exportAsExcelFile(resp, `PMMW Report ${reportFilterData.fromDate} - ${reportFilterData.toDate}`);
      this.spinner.hide();
    })
  }
}
