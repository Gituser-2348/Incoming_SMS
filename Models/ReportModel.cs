using Org.BouncyCastle.Asn1.Mozilla;

namespace SMS.Models
{
    public class ReportModel
    {
        public string? Customer_Id { get; set; }
        public string? status { get; set; }
        public string? VMN { get; set; }
        public string? date { get; set; }
        

        
    }
    public class SummaryModal
    {
        public string? customer { get; set; }
       
        public string? vmn { get; set; }
        public string? date { get; set; }
       

    }
    public class SummaryResponseModal {
        public string? Total_Count { get; set; }
        public string? single_part { get; set; }
        public string? multi_part { get; set; }
        //public string? Failure_Count { get; set; }

    }
}
