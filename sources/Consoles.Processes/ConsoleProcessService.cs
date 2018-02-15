﻿using Consoles.Core;
using Consoles.Processes.PathBuilders;
using System;
using System.Diagnostics;

namespace Consoles.Processes
{
	public class ConsoleProcessService : IConsolesProcessService
	{
		private readonly IProcessTracker _processTracker = null;

		/// <summary>
		/// Constructor method.
		/// </summary>
		public ConsoleProcessService(IProcessTracker processTracker)
		{
			_processTracker = processTracker ?? throw new ArgumentNullException(nameof(processTracker), nameof(ConsoleProcessService));
		}

		public IConsoleProcess Create(IProcessDescriptor processDescriptor)
		{
			var pathBuilder = GetPathBuilder(processDescriptor);
			var startupArgs = processDescriptor.Console.ProcessStartupArgs;

			if (pathBuilder == null)
			{
				throw new InvalidOperationException(nameof(Create), new ArgumentNullException(nameof(pathBuilder), nameof(ConsoleProcessService)));
			}

			var processStartInfo = new ProcessStartInfo(pathBuilder.Build())
			{
				WorkingDirectory = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
				WindowStyle = ProcessWindowStyle.Hidden,
				Arguments = startupArgs
			};

			var consoleInstance = new ConsoleProcess(processStartInfo, processDescriptor.StartupTimeoutInSeconds)
			{
				SourceSpecifications = processDescriptor.Console
			};

			consoleInstance.Start();

			if (consoleInstance.IsStarted)
			{
				_processTracker.Track(consoleInstance.Id);
			}

			return consoleInstance;
		}

		private IPathBuilder GetPathBuilder(IProcessDescriptor processDescriptor)
		{
			var pathBuilder = processDescriptor.Console.ProcessBasePath;
			var pathExeFilename = processDescriptor.Console.ProcessExecutableName;

			switch (pathBuilder)
			{
				case BasePath.Physical:
					return new PhysicalFilePathBuilder(pathExeFilename);
				case BasePath.ProgramFilesFolder:
					return new ProgramFilesFolderPathBuilder(pathExeFilename);
				case BasePath.System32Folder:
					return new System32FolderPathBuilder(pathExeFilename);
				case BasePath.SystemPathVar:
					return new SystemPathVarPathBuilder(pathExeFilename);
			}

			return null;
		}
	}
}
