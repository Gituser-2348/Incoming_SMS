namespace SMS.Helpers
{
    using System;
    using System.Text;
    using System.Text.RegularExpressions;

    public static class StringHelper
    {
        //public static string ConvertToUnicode(this string codeforConversion)
        //{
        //    byte[] unibyte = Encoding.Unicode.GetBytes(codeforConversion.Trim());
        //    string uniString = string.Empty;
        //    string tmp = string.Empty;
        //    int i = 0;
        //    foreach (byte b in unibyte)
        //    {
        //        if (i == 0)
        //        {
        //            tmp = string.Format("{0}{1}", @"", b.ToString("X2"));
        //            i = 1;
        //        }
        //        else
        //        {
        //            uniString += string.Format("{0}{1}", @"", b.ToString("X2")) + tmp;
        //            i = 0;
        //        }
        //    }
        //    return uniString;
        //}

        public static string ConvertToUnicode(this string codeforConversion)
        {
            byte[] s1 = UTF8Encoding.Unicode.GetBytes(codeforConversion);
            string strUnicode = "";
            string strTmp1 = "";
            string strTmp2 = "";

            for (int i = 0; i < s1.Length; i += 2)
            {
                strTmp1 = int.Parse(s1[i + 1].ToString()).ToString("x");
                if (strTmp1.Length == 1)
                    strTmp1 = "0" + strTmp1;

                strTmp2 = int.Parse(s1[i].ToString()).ToString("x");
                if (strTmp2.Length == 1)
                    strTmp2 = "0" + strTmp2;

                strUnicode += strTmp1 + strTmp2;
            }
            return strUnicode;
        }

        public static string ConvertUnocdeToText(this string codeforConversion)
        {
            if (codeforConversion.Trim() != "")
            {
                try
                {
                    codeforConversion = "\\u" + Regex.Replace(codeforConversion, ".{4}", "$0\\u");
                    codeforConversion = Regex.Unescape(codeforConversion.Substring(0, codeforConversion.Length - 2));
                }
                catch
                {
                    codeforConversion = null;
                }
            }
            return codeforConversion;
        }

        public static string ConvertHexToText(this string codeforConversion)
        {
            try
            {
                byte[] raw = new byte[codeforConversion.Length / 2];
                for (int i = 0; i < raw.Length; i++)
                {
                    raw[i] = Convert.ToByte(codeforConversion.Substring(i * 2, 2), 16);
                }
                return Encoding.ASCII.GetString(raw);
            }
            catch
            {
                return null;
            }
        }

        public static string ConvertToHex(this string codeforConversion)
        {
            //byte[] bytes = Encoding.Default.GetBytes(codeforConversion);
            //string hexString = BitConverter.ToString(bytes);
            //hexString = hexString.Replace("-", "");
            //return hexString;
            byte[] bytes = Encoding.UTF8.GetBytes(codeforConversion);
            string hexString = ToHexadecimalRepresentation(bytes);
            return hexString;
        }

        public static string ToHexadecimalRepresentation(byte[] bytes)
        {
            StringBuilder sb = new StringBuilder(bytes.Length << 1);
            foreach (byte b in bytes)
            {
                sb.AppendFormat("{0:X2}", b);
            }
            return sb.ToString();
        }
    }
}
