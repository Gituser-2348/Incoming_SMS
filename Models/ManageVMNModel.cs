namespace SMS.Models
{
    public class ManageVMNModel
    {
        public string? VMN { get; set; }

    }

    public class VMNChangeStatusModel { 
        public string ? user_id { get; set; }
    public string? lcsms_id { get; set; }  
    public string? status { get; set; }
        public string? remark { get; set;}
    }
}
