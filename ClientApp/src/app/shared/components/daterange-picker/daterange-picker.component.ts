import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import * as moment from "moment";
import { ReportService } from "../../../views/report/report.service";
declare var $: any;

@Component({
  selector: "app-daterange-picker",
  templateUrl: "./daterange-picker.component.html",
  styleUrls: ["./daterange-picker.component.scss"],
})
export class DaterangePickerComponent implements OnInit {
  @Output() startDate = new EventEmitter<string>();
  @Output() endDate = new EventEmitter<string>();
  @Input() id;
  constructor(private report: ReportService) {}

  ngOnInit() {
    this.report.refreshDate.subscribe((data: any) => {
      this.reset();
    });
    if (this.id == undefined) {
      this.id = "reportrange";
    }
    const thisRef = this;

    $(function () {
      var today = moment();
      var start = moment();
      var end = moment();
      function cb(start, end) {
        // console.log("Start : " + start.format('MMMM D, YYYY') + " End : " + end.format('MMMM D, YYYY'));
        $(`#${thisRef.id} span`).html(
          start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY")
        );
        var startDate = start.format("DD/MM/YYYY");
        var endDate = end.format("DD/MM/YYYY");
        thisRef.startDate.emit(startDate);
        // console.log(endDate, "end");
        thisRef.endDate.emit(endDate);
      }

      $(`#${thisRef.id}`).daterangepicker(
        {
          startDate: start,
          endDate: end,
          maxDate: today.format("MM/DD/YYYY"),
          alwaysShowCalendars: true,
          ranges: {
            Today: [moment(), moment()],
            Yesterday: [
              moment().subtract(1, "days"),
              moment().subtract(1, "days"),
            ],
            "Last 7 Days": [moment().subtract(6, "days"), moment()],
            "Last 30 Days": [moment().subtract(29, "days"), moment()],
            "This Month": [moment().startOf("month"), moment().endOf("month")],
            "Last Month": [
              moment().subtract(1, "month").startOf("month"),
              moment().subtract(1, "month").endOf("month"),
            ],
            // 'This Year': [moment().startOf('year'), moment()],
          },
        },
        cb
      );

      cb(start, end);
    });
  }

  ngAfterViewInit() {
    // console.log(document.getElementById(this.id));
    // console.log(document.querySelector(`#${this.id} #${this.id}`))
    if(document.querySelector(`#${this.id} #${this.id}`) != null){
      document.querySelector(`#${this.id} #${this.id}`).classList.add('no-border')
    }

  }

  reset() {
    const thisRef = this;

    $(function () {
      var start = moment();
      var end = moment();

      function cb(start, end) {
        // console.log("Start : " + start.format('MMMM D, YYYY') + " End : " + end.format('MMMM D, YYYY'));
        $(`#${thisRef.id} span`).html(
          start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY")
        );
        var startDate = start.format("DD/MM/YYYY");
        var endDate = end.format("DD/MM/YYYY");
        thisRef.startDate.emit(startDate);
        thisRef.endDate.emit(endDate);
      }

      $(`#${thisRef.id}`).daterangepicker(
        {
          startDate: start,
          endDate: end,
          alwaysShowCalendars: true,
          ranges: {
            Today: [moment(), moment()],
            Yesterday: [
              moment().subtract(1, "days"),
              moment().subtract(1, "days"),
            ],
            "Last 7 Days": [moment().subtract(6, "days"), moment()],
            "Last 30 Days": [moment().subtract(29, "days"), moment()],
            "This Month": [moment().startOf("month"), moment().endOf("month")],
            "Last Month": [
              moment().subtract(1, "month").startOf("month"),
              moment().subtract(1, "month").endOf("month"),
            ],
            // 'This Year': [moment().startOf('year'), moment()],
          },
        },
        cb
      );

      cb(start, end);
    });
  }
}
