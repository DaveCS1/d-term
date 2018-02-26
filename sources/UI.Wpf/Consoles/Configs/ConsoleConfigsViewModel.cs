﻿using AutoMapper;
using Consoles.Core;
using ReactiveUI;
using Splat;
using System;
using System.Collections.Generic;
using System.Reactive;
using System.Threading.Tasks;

namespace UI.Wpf.Consoles
{
	/// <summary>
	/// Console configurations view model interface.
	/// </summary>
	public interface IConsoleConfigsViewModel
	{
		bool IsBusy { get; }
		ReactiveCommand AddOptionCommand { get; }
		ReactiveCommand<Unit, List<ConsoleOption>> LoadOptionsCommand { get; }
		IReactiveDerivedList<IConsoleOptionFormViewModel> Options { get; }
	}

	/// <summary>
	/// App console configurations view model implementation.
	/// </summary>
	public class ConsoleConfigsViewModel : ReactiveObject, IConsoleConfigsViewModel
	{
		//
		private readonly IConsoleOptionsRepository _consoleOptionsRepository;
		private readonly IReactiveList<ConsoleOption> _consoleOptionsSourceList;

		//
		private bool _isBusy;
		private ReactiveCommand _addOptionCommand;
		private ReactiveCommand<Unit, List<ConsoleOption>> _loadOptionsCommand;
		private IReactiveDerivedList<IConsoleOptionFormViewModel> _options;

		/// <summary>
		/// Constructor method.
		/// </summary>
		public ConsoleConfigsViewModel(IConsoleOptionsRepository consoleOptionsRepository = null)
		{
			_consoleOptionsRepository = consoleOptionsRepository ?? Locator.CurrentMutable.GetService<IConsoleOptionsRepository>();

			_consoleOptionsSourceList = new ReactiveList<ConsoleOption>();

			_options = _consoleOptionsSourceList.CreateDerivedCollection(
				selector: option => Mapper.Map<IConsoleOptionFormViewModel>(option)
			);

			LoadOptionsCommandSetup();
		}

		/// <summary>
		/// Gets or sets the loading status.
		/// </summary>
		public bool IsBusy
		{
			get => _isBusy;
			set => this.RaiseAndSetIfChanged(ref _isBusy, value);
		}

		/// <summary>
		/// Gets the add console option command instance.
		/// </summary>
		public ReactiveCommand AddOptionCommand => _addOptionCommand;

		/// <summary>
		/// Gets the load options command instance.
		/// </summary>
		public ReactiveCommand<Unit, List<ConsoleOption>> LoadOptionsCommand => _loadOptionsCommand;

		/// <summary>
		/// Gets the current available console options.
		/// </summary>
		public IReactiveDerivedList<IConsoleOptionFormViewModel> Options => _options;

		/// <summary>
		/// Setup the load options comand actions and observables.
		/// </summary>
		private void LoadOptionsCommandSetup()
		{
			_loadOptionsCommand = ReactiveCommand.CreateFromTask(async () => await Task.Run(() =>
			{
				var items = _consoleOptionsRepository.GetAll();

				return Task.FromResult(items);
			}));

			_loadOptionsCommand.IsExecuting.BindTo(this, @this => @this.IsBusy);

			_loadOptionsCommand.ThrownExceptions.Subscribe(@exception =>
			{
				// ToDo: Show message
			});

			_loadOptionsCommand.Subscribe(options =>
			{
				_consoleOptionsSourceList.Clear();
				_consoleOptionsSourceList.AddRange(options);
			});
		}
	}
}