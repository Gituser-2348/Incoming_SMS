using SMS.Helpers;
using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Threading;

namespace Templateprj.Helpers
{
	public class LogWriter
	{
		private static DateTime _lastDeletedDay;
		private readonly CryptoAlg _encDec = new CryptoAlg();

		#region Write File
		public static void Write(string? message,string? path, string? subfolder = "")
		{
			(new LogWriter()).WriteThread(message, subfolder,path);

		}

		private void WriteThread(string? message, string? subfolder,string? logpath)
		{
			try
			{

				message = DateTime.Now.ToString("dd MMM yyyy HH:mm:ss") + " :: " + message.TrimEnd('\n');
				//message = _encDec.EncryptDes(message);

				if (subfolder == null) subfolder = "";
				string filePath = Path.Combine(logpath, subfolder);
				string fileName = Path.Combine(filePath, DateTime.Now.ToString("MMM dd, yyyy") + ".Log");

				if (!Directory.Exists(filePath))
				{
					try
					{
						Directory.CreateDirectory(filePath);
					}
					catch
					{
						return;
					}
				}

				using (var mutex = new Mutex(false, fileName.Replace("\\", ":")))
				{
					mutex.WaitOne();
					if (File.Exists(fileName))
					{
						File.SetAttributes(fileName, FileAttributes.Normal);
						using (var tw = TextWriter.Synchronized(File.AppendText(fileName)))
						{
							tw.WriteLine(message);
						}
						File.SetAttributes(fileName, FileAttributes.ReadOnly | FileAttributes.Archive);
					}
					else
					{
						using (var tw = TextWriter.Synchronized(File.CreateText(fileName)))
						{
							tw.WriteLine(message);
						}
						File.SetAttributes(fileName, FileAttributes.ReadOnly);
					}
					mutex.ReleaseMutex();
				}

				var today = DateTime.Today;
				if (_lastDeletedDay == today) return;

				_lastDeletedDay = today;
				int logClear;
				try { logClear = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["LogClear"].Trim()); }
				catch { logClear = 15; }
				DeleteOldDirFiles(logpath, logClear);
			}
			catch
			{
				// ignored
			}
		}
		#endregion

		#region DeleteOldDirFiles
		private static void DeleteOldDirFiles(string path, int logClear, bool isRoot = true)
		{
			try
			{
				var dir = new DirectoryInfo(path);
				var files = dir.GetFiles();
				foreach (var aFile in files)
				{
					if (aFile.LastWriteTime.Date.AddDays(logClear) >= DateTime.Today.Date) continue;

					aFile.Attributes = FileAttributes.Normal;
					aFile.Delete();
				}

				foreach (var subDir in Directory.GetDirectories(path))
				{
					DeleteOldDirFiles(subDir, logClear, false);
				}

				if (!(dir.EnumerateDirectories().Any() || dir.EnumerateFiles().Any()) && !isRoot)
				{
					dir.Delete();
				}
			}
			catch
			{
				// ignored
			}
		}
		#endregion
	}
}