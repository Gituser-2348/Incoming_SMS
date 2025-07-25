export class RequestModel {
  ReqID: any;
}
export class urldropdown {
  text: any;
  value: any;
}

export class ConfigureModel {
  Account_id: any;
  VMN: any;
  VMN_length_flag: any;
  ReqID: any;
  UrlID: any;
  url: any;
  method: any;
  date_format: any;
  content_type: any; 
  proxy: any;
  header: any;
  token: any;
  basic: any;
  //vmn: any;
  header_keys = Array<headerkeys>();
  parameters_keys = Array<parameterkeys>(); 
  success_response: any;
  failure_response: any; 
  timeout: any;

  retry_count: any; authentication: any;
  //VMN_length_flag: any;
  actual_vmn_list:  Array<vmnlist>;

}

export class UrlTestModel {
  ReqID: any;
  UrlID: any;
  url_b: any;
  method_b: any;
  date_format_b: any;
  content_type_b: any;
  proxy_b: any;
  header_b: any;
  authentication_b: any;
  token_b: any;
  basic_b: any;
  header_keys_b = Array<UrlTestHeaderkeys>();
  parameters_keys_b = Array<UrlTestParameterkeys>();
  response_param_b: any;
  success_b: any;
  failure_b: any;
  timeout_b: any;
  retry_count_b: any;
  data: any;
  parameters: any;
}

export class headerkeys {
  key: any;
  value: any;
}

export class parameterkeys {
  parameter1: any;
  value1: any;
  parameter2: any;
  value2: any;
  parameter3: any;
  value3: any;
  parameter4: any;
  value4: any;
  parameter5: any;
  value5: any;
  parameter6: any;
  value6: any;
  parameter7: any;
  value7: any;
  parameter8: any;
  value8: any;
  parameter9: any;
  value9: any;
  parameter10: any;
  value10: any;
}

export class UrlTestRespParameter {
  //parameter1: any;
  //value1: any;
  //parameter2: any;
  //value2: any;
  //parameter3: any;
  //value3: any;
  //parameter4: any;
  //value4: any;
  //parameter5: any;
  //value5: any;
  //parameter6: any;
  //value6: any;
  //parameter7: any;
  //value7: any;
  //parameter8: any;
  //value8: any;
  //parameter9: any;
  //value9: any;
  //parameter10: any;
  //value10: any;
  key: any;
  value: any;
}

export class UrlTestHeaderkeys {
  key: any;
  value: any;
}

export class UrlTestParameterkeys {
  parameter1: any;
  value1: any;
  parameter2: any;
  value2: any;
  parameter3: any;
  value3: any;
  parameter4: any;
  value4: any;
  parameter5: any;
  value5: any;
  parameter6: any;
  value6: any;
  parameter7: any;
  value7: any;
  parameter8: any;
  value8: any;
  parameter9: any;
  value9: any;
  parameter10: any;
  value10: any;
}

export class adduser {
  Account_id: any;
  ReqID: any;
  CustomerName: any;
  UserName: any;
  MobileNumber: any;
  EmailId: any;
  Address: any;
}

export class NewRequestModel {
  account_id: any;
  customername: any;
  circle: any;
  plan: any;
  service: any;
  platform: any;
}

export class AddVmn {
  Request_id: any;
  account_id: any;
  vmnlist: Array<vmnlist>;
}
export class vmnlist {
  msisdn: any;
  imsi: any;
}
