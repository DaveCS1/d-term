﻿using Processes.Core;
using ReactiveUI;
using Splat;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using System.Text.RegularExpressions;
using UI.Wpf.Properties;
using WinApi.User32;

namespace UI.Wpf.Processes
{
	public interface IInstancesManager
	{
		IReactiveDerivedList<IInstanceViewModel> GetAllInstances();
		IReactiveDerivedList<IInstanceViewModel> GetMinimizedInstances();
		void Track(IInstanceViewModel instance);
	}

	public class InstancesManager : ReactiveObject, IInstancesManager
	{
		private const uint EVENT_SYSTEM_FOREGROUND = 0x0003;
		private const uint EVENT_OBJECT_NAMECHANGE = 0x800C;
		private const uint EVENT_SYSTEM_MINIMIZESTART = 0x0016;

		private readonly uint[] _winEvents = new uint[]
		{
			EVENT_SYSTEM_FOREGROUND,
			EVENT_OBJECT_NAMECHANGE,
			EVENT_SYSTEM_MINIMIZESTART
		};

		private readonly IntPtr _shellViewHandle;
		private readonly WinEventDelegate _eventsHandler;
		private readonly IEnumerable<IntPtr> _eventHookHandles;
		private readonly IReactiveList<IInstanceViewModel> _instancesSource;
		private readonly IReactiveDerivedList<IInstanceViewModel> _allInstancesList;
		private readonly IReactiveDerivedList<IInstanceViewModel> _minimizedInstancesList;
		private readonly IProcessTracker _processTracker;

		/// <summary>
		/// Constructor method.
		/// </summary>
		public InstancesManager(IntPtr shellViewHandle, IProcessTracker processTracker = null)
		{
			_shellViewHandle = shellViewHandle;
			_processTracker = processTracker ?? Locator.CurrentMutable.GetService<IProcessTracker>();

			_eventsHandler = new WinEventDelegate(WinEventsHandler);
			_eventHookHandles = Win32Api.AddEventsHook(_winEvents, _eventsHandler);

			_instancesSource = new ReactiveList<IInstanceViewModel>()
			{
				ChangeTrackingEnabled = true
			};

			_instancesSource.ItemsAdded.Subscribe(instance => Integrate(instance));

			_allInstancesList = _instancesSource.CreateDerivedCollection(
				selector: instance => instance
			);

			_minimizedInstancesList = _instancesSource.CreateDerivedCollection(
				filter: instance => instance.IsMinimized,
				selector: instance => instance
			);
		}

		/// <summary>
		/// Destructor method.
		/// </summary>
		~InstancesManager()
		{
			_processTracker.KillAll();

			foreach (var handle in _eventHookHandles)
			{
				Win32Api.RemoveEventHook(handle);
			}
		}

		public IReactiveDerivedList<IInstanceViewModel> GetAllInstances() => _allInstancesList;

		public IReactiveDerivedList<IInstanceViewModel> GetMinimizedInstances() => _minimizedInstancesList;

		public void Track(IInstanceViewModel instance)
		{
			var subscription = instance.ProcessTerminated.ObserveOnDispatcher().Subscribe(@event =>
			{
				_instancesSource.Remove(instance);
			});

			_processTracker.Track(instance.ProcessId);

			_instancesSource.Add(instance);
		}

		private void Integrate(IInstanceViewModel instance)
		{
			var handle = instance.ProcessMainWindowHandle;
			TakeWindowOwnership(handle);
			SetWindowTitle(instance);
		}

		private void TakeWindowOwnership(IntPtr windowHandle)
		{
			var iconHandle = Resources.dTermIcon.Handle;

			Win32Api.SetWindowOwner(windowHandle, _shellViewHandle);
			Win32Api.SetWindowIcons(windowHandle, iconHandle);
			Win32Api.RemoveWindowFromTaskbar(windowHandle);
			Win32Api.MakeLayeredWindow(windowHandle);
		}

		private void SetWindowTitle(IInstanceViewModel instance)
		{
			var handle = instance.ProcessMainWindowHandle;

			var wndTitle = Win32Api.GetWindowTitle(handle);
			var cleanTitle = Regex.Replace(wndTitle, @"(\[.*\]\s+)", string.Empty);
			var newTitle = $"[PID: {instance.ProcessId}] {cleanTitle}";

			if (!wndTitle.ToLower().Equals(newTitle.ToLower()))
			{
				User32Methods.SetWindowText(handle, newTitle);
			}
		}

		private IInstanceViewModel GetCurrentEventInstance(IntPtr windowHandle)
		{
			return _instancesSource.SingleOrDefault(i => i.ProcessMainWindowHandle == windowHandle);
		}

		private void WinEventsHandler(IntPtr hWinEventHook, uint eventType, IntPtr hwnd, int idObject, int idChild, uint dwEventThread, uint dwmsEventTime)
		{
			if (idObject != 0 || idChild != 0 || !_winEvents.Contains(eventType))
			{
				return;
			}

			switch (eventType)
			{
				//case EVENT_SYSTEM_FOREGROUND:
				//	{
				//		if (!Win32Api.IsOwnedWindow(hwnd))
				//		{
				//			TakeWindowOwnership(hwnd);
				//		}
				//	}
				//	break;

				case EVENT_OBJECT_NAMECHANGE:
					{
						var instance = _instancesSource.SingleOrDefault(i => i.ProcessMainWindowHandle == hwnd);
						if (instance != null)
						{
							SetWindowTitle(instance);
						}
					}
					break;

				case EVENT_SYSTEM_MINIMIZESTART:
					{
						var instance = _instancesSource.SingleOrDefault(i => i.ProcessMainWindowHandle == hwnd);
						if (instance != null)
						{
							instance.IsMinimized = true;
							User32Methods.ShowWindow(hwnd, ShowWindowCommands.SW_HIDE);
						}
					}
					break;
			}
		}
	}
}