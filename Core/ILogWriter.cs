namespace SMS.Core
{
    public interface ILogWriter
    {
        Task WriteAsync(string message, string subfolder = "");
        void Write(string message, string subfolder = "");
    }
}
