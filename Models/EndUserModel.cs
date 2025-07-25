namespace SMS.Models
{
    public class EndUserModel
    {
        public string? user_id { get; set; }
    }
    public class EndUserReportModel
    {
        public string? user_id { get; set; }
        public string? status { get; set; }
        public string? VMN { get; set; }
        public string? date { get; set; }



    }
    public class EndUserSummaryModal
    {
        public string? user_id { get; set; }

        public string? vmn { get; set; }
        public string? date { get; set; }


    }
    public class EndUserSummaryResponseModal
    {
        public string? Total_Count { get; set; }
        public string? single_part { get; set; }
        public string? multi_part { get; set; }
        //public string? Failure_Count { get; set; }

    }

}
