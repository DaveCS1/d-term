﻿using Consoles.Core;
using Consoles.Processes;
using UI.Wpf.Consoles;
using ReactiveUI;
using System;
using Notebook.Core;
using AutoMapper;
using UI.Wpf.Notebook;
using System.Collections.Generic;

namespace UI.Wpf.Shell
{
	public class ShellViewModel : ReactiveObject
	{
		private readonly IMapper _mapper = null;
		private readonly INotebookRepository _notebookRepository = null;
		private readonly IConsoleProcessService _consoleProcessService = null;

		public ShellViewModel(IMapper mapper, INotebookRepository notebookRepository, IConsoleProcessService consoleProcessService)
		{
			_mapper = mapper ?? throw new ArgumentNullException(nameof(mapper), nameof(ShellViewModel));
			_notebookRepository = notebookRepository ?? throw new ArgumentNullException(nameof(notebookRepository), nameof(ShellViewModel));
			_consoleProcessService = consoleProcessService ?? throw new ArgumentNullException(nameof(consoleProcessService), nameof(ShellViewModel));

			CreateConsole = ReactiveCommand.Create(CreateConsoleExecute);

			var notes = _notebookRepository.GetAll();
			var notesViewModel = _mapper.Map<List<NoteViewModel>>(notes);
			Notes = new ReactiveList<NoteViewModel>(notesViewModel);
		}

		public ReactiveList<NoteViewModel> Notes { get; set; }
		public ReactiveList<ConsoleInstanceViewModel> ConsoleInstances { get; set; } = new ReactiveList<ConsoleInstanceViewModel>();

		public ReactiveCommand CreateConsole { get; protected set; }

		private void CreateConsoleExecute()
		{
			var consoleProcess = _consoleProcessService.Create(new ProcessDescriptor()
			{
				FilePath = @"/cmd.exe",
				PathType = PathType.SystemPathVar
			});

			//consoleProcess.Start();

			var consoleInstanceViewModel = new ConsoleInstanceViewModel(consoleProcess)
			{
				Name = DateTime.Now.Millisecond.ToString()
			};

			ConsoleInstances.Add(consoleInstanceViewModel);
		}
	}
}
