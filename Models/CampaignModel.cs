using SMS.Helpers;

namespace SMS.Models
{
    public class TemplateFilter
    {
        public string? TemplateID { get; set;}
        public string? TemplateName { get; set;}
        public int TemplateTypeId { get; set;}
        public int MessageTypeId { get; set;}
    }   


    public class TemplateModel
    {
        public int userId { get; set; }
        public int accountId { get; set; }
        public Template? jsonData { get; set; }
    }

    public class Template
    {
        public int id { get; set; }
        public string? senderId { get; set; }
        public string? tempalteId { get; set; }
        public string? templateName { get; set; }
        public string? messageType { get; set; }
        public string? template { get; set; }
        public string? templateType { get; set; }
        public int length { get; set; }
        public int variableCount { get; set; }

        private string? _templateMessage;
        public string? TemplateMessage
        {
            get
            {
                if (UnicodeStatus == 8)
                {
                    _templateMessage = _templateMessage?.ConvertUnocdeToText();
                }
                else
                {
                    _templateMessage = _templateMessage?.ConvertHexToText();
                }
                return _templateMessage;
            }
            set
            {
                _templateMessage = value;
            }
        }
        public int? UnicodeStatus { get; set; }

    }
    public class TemplateResponse
    {
      //  public List<Header> Header { get; set; }
        public List<Template>? Data { get; set; }
       // public int? Count { get; set; }
    }
    //public class Response
    //{
    //    public bool isSuccess;
    //    public object? value;
    //    public string? error;
    //}
    public class IdModel
    {
        public int id { get; set; }

    }
    public class CampIdModel
    {
        public string? campaignId { get; set; }
    }
    public class CampaignFilter
    {
        public int? AccountId { get; set; }
        public int UserId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public string? CampaignName { get; set; }
        public int TemplateTypeId { get; set; }
        public int MessageTypeId { get; set; }
        public int CampaignStatusId { get; set; }//1: Active; 2: Expired
    }
    public class CampaignModel
    {
        public int userId { get; set; }
        public int accountId { get; set; }
        public Campaign? jsonData { get; set; }
    }
    public class Campaign
    {
        public string toDate { get; set; }
        public string? fromDate { get; set; }
        public List<timeFrame>? timeFrame { get; set; }
        public string? senderId { get; set; }
        public string? campaignId { get; set; }
        public string? templateId { get; set; }
        public string? windowType { get; set; }
        public string? campaignName { get; set; }
        public string? campaignType { get; set; }
        public string? campaignStatus { get; set; }
    }
    public class timeFrame
    {
        public string? From { get; set; }
        public string? To { get; set; }
    }



}
