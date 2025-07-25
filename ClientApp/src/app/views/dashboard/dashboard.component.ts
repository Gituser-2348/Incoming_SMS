import { Component, OnInit } from "@angular/core";
import { DateRange } from "../report/report.modal";
import { DashboardService } from "./dashboard.service";

@Component({
  selector: "dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: [
    "./dashboard.component.scss",
    //"../management/management.component.scss",
   // "../smsservice/smsservice.component.scss",
  ],
})
export class DashboardComponent implements OnInit {
  cont: boolean = true;
  VMNdashboard = {
    Total_vmn: "00",
    Active_vmn: "0",
    Inactive_vmn: "0",
    Config_vmn: "0",
    Terminated_vmn: "0"
    
  };
  TransactionDashboard = {
    today: "0",
    last_day: "0",
    this_week: "0",
    last_week: "0",
    this_month: "0",
    last_month: "0",
  };
  public doughnutOutChartData: number[] = [10, 20, 30, 50];
  public doughnutOutChartLabels: string[] = [
    "SMS Loaded",
    "SMS to be Sent",
    "SMS Sent",
    "TimeOut",
  ];
  public doughnutOutChartType = "doughnut";
  public doughnutOutChartColours: Array<any> = [
    {
      backgroundColor: ["#009933", "#ff0000", "#0000ff", "#ffc107", "#4D5360"],
      hoverBackgroundColor: [
        "#009933",
        "#ff0000",
        "#0000ff",
        "#ffc107",
        "#616774",
      ],
      borderWidth: 8,
    },
  ];

  plugins: {
    tooltip: {
      titleFont: {
        size: 100;
      };
      bodyFont: {
        size: 50;
      };
      footerFont: {
        size: 20; // there is no footer by default
      };
    };
  };
  public doughnutChartOptions: any = {
    title: {
      display: true,
      fullSize: true,
      fontSize: 60,
      position: "top",
    },
    tooltips: {
      // enabled:false,
      titleFontSize: 70,
      bodyFontSize: 70,
    },

    legend: {
      position: "right",
      align: "start",
      labels: {
        boxWidth: 50,
        boxHeight: 50,
        fontSize: 60,
        padding: 10,
        // fontStyle: "italic",
        // fontWeight: "bold",
        fontColor: "black",
      },
    },
  };
  dateRange: DateRange = <DateRange>{};
  constructor(private dash_service: DashboardService) { }
  ngOnInit(): void {
 
    this.getDashboardReport();
  }

  getChartOption(title) {
    let option = this.doughnutChartOptions;
    option["title"]["text"] = title;
    return option;
  }

  getDashboardReport() {
 
     // console.log('getDashboardReport');
      this.dash_service.getDashboardReport().subscribe((resp: any) => {
      //  console.log("resp");

       // console.log(resp);
        this.VMNdashboard.Total_vmn = resp.total_vmn;
        this.VMNdashboard.Active_vmn = resp.active_vmn;
        this.VMNdashboard.Inactive_vmn = resp.inactive_vmn;
        this.VMNdashboard.Config_vmn = resp.config_vmn;
        this.VMNdashboard.Terminated_vmn = resp.terminated_vmn;
        this.TransactionDashboard.today = resp.today_cnt;
        this.TransactionDashboard.last_day = resp.last_day_cnt;
        this.TransactionDashboard.last_week = resp.last_week_cnt;
        this.TransactionDashboard.this_month = resp.this_month_cnt;
        this.TransactionDashboard.last_month = resp.last_month_cnt;
        this.TransactionDashboard.this_week = resp.this_week_cnt;

      })
    
}
    

  chartHovered(event) {}
  chartClicked(event) {}
}
