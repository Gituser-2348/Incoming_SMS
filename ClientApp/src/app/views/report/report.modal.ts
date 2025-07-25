export interface ReportFilter {
  userId?: number; 
  accountId?: string; 
  serviceId?: string; 
  fromDate?: any; 
  toDate?: any; 
  toNumber?:string;
  header?:any;
}
  
  export interface DateRange {
    FromDate: string;
    FromTime?: string;
    ToDate: string;
    ToTime?: string;
  }
   
  export interface Headers {
   Keywords?: any;
  }
  export class StatusList {
    id: number;
    text: string;
}
export interface fetchReportName{
  acc_id:any,
flow_id:any,
user_id:any

}
export interface detailReport{
  user_id:any;
  acc_id:any;
  report_id:any;
  flow_id:any;
  from_date:any;
  to_date:any;
}
export class dropdown {
  value: any;
  text: any;
}
export class VMNReport {
  status: any;
  date: any;
  VMN: any;
  Customer_Id: any;

}
export class SummaryReportModal {
  customer: any;
  vmn: any;
  date: any;

}
