using Google.Protobuf.WellKnownTypes;

namespace SMS.ICollection
{
    public interface IDataService
    {
        List<Any> GetItems();
        Any GetItemById(int id);
        void AddItem(Any item);
        void UpdateItem(int id, Any item);
        void DeleteItem(int id);
    }
}
