namespace SMS.Models
{
    public class ConfigurationModel
    {
        public string? ReqID { get; set; }
    }
    public class InserturltestModel { 
    public string? data { get; set; }
        public string? url_id { get; set; }
        public string? parameters { get; set; }
    }
    public class RequestModel 
    { 
        public string? data { get; set; }
    }

    public class ConfigureModel
    {
        //public string? proxy_ { get; set; }
        //public string? authentication_ { get; set; }
        public string? VMN { get; set; }
        public string? Account_id { get; set; }
        public string? ReqID { get; set; }
        public string? url { get; set; }
        public string? method { get; set; }
        public string? date_format { get; set; }
        public string? content_type { get; set; }
        public string? proxy{ get; set; }
        public string? splitter { get; set; }
        public List<HeaderKey>? header_keys { get; set; } // Updated to List<HeaderKey>
        public List<ParameterKey>? parameters_keys { get; set; } // Updated to List<ParameterKey>
        public string? authentication { get; set; }
        public string? token { get; set; }
        public string? basic { get; set; }
        public string? success_response { get; set; }
        public string? failure_response { get; set; }
        public string? retry_count { get; set; }
        public string? timeout { get; set; }
        public string? header { get; set; }

        public string? Shortcode_flag { get; set; }
        public string? Unicode_flag { get; set; }
        public string? VMN_length_flag { get; set; }
        public List<Vmnlist>? actual_vmn_list { get; set; }

        //public vmnlist { get; set; }
    }

    public class UrlTestModel
    {
        public string? ReqID { get; set; }
        public string? UrlID { get; set; }
        public string? url_b { get; set; }
        public string? method_b { get; set; }
        public string? date_format_b { get; set; }
        public string? content_type_b { get; set; }
        public string? proxy_b { get; set; }
        public string? header_b { get; set; }
        public List<UrlTestHeaderKey>? header_keys_b { get; set; } // Updated to List<HeaderKey>
        public List<UrlTestParameterKey>? parameters_keys_b { get; set; } // Updated to List<ParameterKey>
        public string? authentication_b { get; set; }
        public string? token_b { get; set; }
        public string? basic_b { get; set; }
        public string? success_b { get; set; }
        public string? failure_b { get; set; }
        public string? retry_count_b { get; set; }
        public string? timeout_b { get; set; }
        public List<UrlTestRespParameter>? response_param_b { get; set; }
        public string? response3 { get; set; }
        public string? parameters { get; set; }
        public string? data { get; set; }
    }

    public class HeaderKey
    {
        public string? key { get; set; }
        public string? value { get; set; }
    }

    public class ParameterKey
    {
        public string? parameter1 { get; set; }
        public string? value1 { get; set; }
        public string? parameter2 { get; set; }
        public string? value2 { get; set; }
        public string? parameter3 { get; set; }
        public string? value3 { get; set; }
        public string? parameter4 { get; set; }
        public string? value4 { get; set; }
        public string? parameter5 { get; set; }
        public string? value5 { get; set; }
        public string? parameter6 { get; set; }
        public string? value6 { get; set; }
        public string? parameter7 { get; set; }
        public string? value7 { get; set; }
        public string? parameter8 { get; set; }
        public string? value8 { get; set; }
        public string? parameter9 { get; set; }
        public string? value9 { get; set; }
        public string? parameter10 { get; set; }
        public string? value10 { get; set; }
    }

    public class UrlTestHeaderKey
    {
        public string? key { get; set; }
        public string? value { get; set; }
    }

    public class UrlTestParameterKey
    {
        public string? parameter1 { get; set; }
        public string? value1 { get; set; }
        public string? parameter2 { get; set; }
        public string? value2 { get; set; }
        public string? parameter3 { get; set; }
        public string? value3 { get; set; }
        public string? parameter4 { get; set; }
        public string? value4 { get; set; }
        public string? parameter5 { get; set; }
        public string? value5 { get; set; }
        public string? parameter6 { get; set; }
        public string? value6 { get; set; }
        public string? parameter7 { get; set; }
        public string? value7 { get; set; }
        public string? parameter8 { get; set; }
        public string? value8 { get; set; }
        public string? parameter9 { get; set; }
        public string? value9 { get; set; }
        public string? parameter10 { get; set; }
        public string? value10 { get; set; }
    }

    public class UrlTestRespParameter
    {
        public string? key { get; set; }
        public string? value { get; set; }
    }

    public class Adduser {
        public string? ReqID { get; set; }
        public string? Account_id { get; set; }
        public string? CustomerName { get; set; }
        public string? UserName { get; set; }
        public string? MobileNumber { get; set; }
        public string? EmailId { get; set;}
        public string? Address { get; set; }

    }

    public class CreateNewRequestModel
    {
        public string? account_id { get; set; }
        public string? customername { get; set; }
        public string? circle { get; set; }
        public string? plan { get; set; }
        public string? service { get; set; }
        public string? platform { get; set; }
    }
  
    public class AddVmnModel 
    { 
        public string? Request_id { get; set; }
        public string? account_id { get; set; }
        public List<Vmnlist>? vmnlist { get; set; }
    }

    public class Vmnlist 
    { 
        public string? msisdn { get; set; }
        public string? imsi { get; set; }
    }
}
