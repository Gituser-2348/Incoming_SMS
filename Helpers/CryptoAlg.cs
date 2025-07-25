using System.Security.Cryptography;
using System.Text;

namespace SMS.Helpers
{
    public class CryptoAlg
    {
        private const string Iv = "0123456789ABCDEF";

        #region Encryption
        public  string? EncryptDes(string? toEncrypt, string? key)
        {
            try
            {
                var vector = ToByteArray(Iv);
                var keyArray = Encoding.ASCII.GetBytes(key);
                var toEncryptArray = Encoding.ASCII.GetBytes(toEncrypt);

                var tripleDes = TripleDES.Create();
                tripleDes.Padding = PaddingMode.ANSIX923;
                tripleDes.Key = keyArray;
                tripleDes.IV = vector;

                using (var memoryStream = new MemoryStream())
                {
                    using (var cryptoStream = new CryptoStream(memoryStream, tripleDes.CreateEncryptor(), CryptoStreamMode.Write))
                        cryptoStream.Write(toEncryptArray, 0, toEncryptArray.Length);

                    var encryptedData = memoryStream.ToArray();
                    return ToHexString(encryptedData);
                }
            }
            catch
            {
                return "";
            }
        }

        #endregion

        #region Decrypyion

        public  string DecryptDes(string? cipherString, string? key)
        {
            try
            {
                var vector = ToByteArray(Iv);
                var keyArray = Encoding.ASCII.GetBytes(key);
                var toDecrypteArray = ToByteArray(cipherString);

                //var a = ToHexString(toDecrypteArray);
                //toDecrypteArray = ToByteArray(a);

                var tripleDes = TripleDES.Create();
                tripleDes.Padding = PaddingMode.ANSIX923;
                tripleDes.Key = keyArray;
                tripleDes.IV = vector;
                using (var memoryStream = new MemoryStream())
                {
                    using (var cryptoStream = new CryptoStream(memoryStream, tripleDes.CreateDecryptor(), CryptoStreamMode.Write))
                        cryptoStream.Write(toDecrypteArray, 0, toDecrypteArray.Length);

                    var decryptedData = memoryStream.ToArray();
                    return Encoding.ASCII.GetString(decryptedData);
                }

            }
            catch { return ""; }
        }

        #endregion

        #region Encription SHA1
        public string GetHashSha1(string plainText)
        {
            byte[] hashValue;
            byte[] plainTxt = ASCIIEncoding.ASCII.GetBytes(plainText);

            SHA1Managed hashString = new SHA1Managed();
            string cypherText = "";
            hashValue = hashString.ComputeHash(plainTxt);
            cypherText = ByteArrayToString(hashValue);
            return cypherText;

        }
        #endregion

        #region Hash
        public static string GetHashSha_1(string str)
        {
            using (var shaM = new SHA1Managed())
            {
                var data = Encoding.ASCII.GetBytes(str);
                var hash = shaM.ComputeHash(data);
                return ToHexString(hash);
            }
        }
        public static string GetHashSha512(string str)
        {
            using (var shaM = new SHA512Managed())
            {
                var data = Encoding.ASCII.GetBytes(str);
                var hash = shaM.ComputeHash(data);
                return ToHexString(hash);
            }
        }
        #endregion


        #region others
        private byte[] HexStringToByteArray(string hexString)
        {
            int hexStringLength = hexString.Length;
            byte[] b = new byte[hexStringLength / 2];
            for (int i = 0; i < hexStringLength; i += 2)
            {
                int topChar = (hexString[i] > 0x40 ? hexString[i] - 0x37 : hexString[i] - 0x30) << 4;
                int bottomChar = hexString[i + 1] > 0x40 ? hexString[i + 1] - 0x37 : hexString[i + 1] - 0x30;
                b[i / 2] = Convert.ToByte(topChar + bottomChar);
            }
            return b;
        }

        public static string ByteArrayToString(byte[] ba)
        {
            StringBuilder hex = new StringBuilder(ba.Length * 2);
            foreach (byte b in ba)
                hex.AppendFormat("{0:x2}", b);
            return hex.ToString();
        }

        public static byte[] StringToByteArray(String hex)
        {
            int NumberChars = hex.Length;
            byte[] bytes = new byte[NumberChars / 2];
            for (int i = 0; i < NumberChars; i += 2)
                bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
            return bytes;
        }

        #endregion

        #region others
        //private byte[] HexStringToByteArray(string hexString)
        //{
        //    int hexStringLength = hexString.Length;
        //    byte[] b = new byte[hexStringLength / 2];
        //    for (int i = 0; i < hexStringLength; i += 2)
        //    {
        //        int topChar = (hexString[i] > 0x40 ? hexString[i] - 0x37 : hexString[i] - 0x30) << 4;
        //        int bottomChar = hexString[i + 1] > 0x40 ? hexString[i + 1] - 0x37 : hexString[i + 1] - 0x30;
        //        b[i / 2] = Convert.ToByte(topChar + bottomChar);
        //    }
        //    return b;
        //}

        private static string ToHexString(IReadOnlyCollection<byte> byteArray)
        {
            var hexValue = new StringBuilder(byteArray.Count * 2);
            foreach (var b in byteArray)
                hexValue.AppendFormat("{0:x2}", b);
            return hexValue.ToString();
        }

        private static byte[] ToByteArray(string hexString)
        {
            var numberChars = hexString.Length;
            var bytes = new byte[numberChars / 2];
            for (var i = 0; i < numberChars; i += 2)
                bytes[i / 2] = Convert.ToByte(hexString.Substring(i, 2), 16);
            return bytes;
        }

        #endregion
    }
}
