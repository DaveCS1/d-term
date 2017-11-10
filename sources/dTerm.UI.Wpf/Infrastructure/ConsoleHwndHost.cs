﻿using dTerm.Core.Processes;
using System;
using System.Runtime.InteropServices;
using System.Windows.Interop;
using WinApi.User32;

namespace dTerm.UI.Wpf.Infrastructure
{
	public class ConsoleHwndHost : HwndHost
	{
		private IConsoleInstance _dtermProcess;

		public ConsoleHwndHost(IConsoleInstance dtermProcess)
		{
			_dtermProcess = dtermProcess;
		}

		protected override HandleRef BuildWindowCore(HandleRef hwndParent)
		{
			_dtermProcess.Start();
			var childHandle = _dtermProcess.ProcessMainWindowHandle;
			Integrate(childHandle, hwndParent.Handle);
			return new HandleRef(this, childHandle);
		}

		protected override void DestroyWindowCore(HandleRef hwnd)
		{
			User32Methods.DestroyWindow(hwnd.Handle);
		}

		private void Integrate(IntPtr childHandle, IntPtr parentHandle)
		{
			// Set Parent
			User32Methods.SetParent(childHandle, parentHandle);

			// Make child window
			var newStyle = (WindowStyles)User32Helpers.GetWindowLongPtr(childHandle, WindowLongFlags.GWL_STYLE);

			newStyle &= ~WindowStyles.WS_MAXIMIZEBOX;
			newStyle &= ~WindowStyles.WS_MINIMIZEBOX;
			newStyle &= ~WindowStyles.WS_THICKFRAME;
			newStyle &= ~WindowStyles.WS_DLGFRAME;
			newStyle &= ~WindowStyles.WS_BORDER;
			newStyle &= ~WindowStyles.WS_POPUP;

			newStyle |= WindowStyles.WS_CHILD;

			User32Helpers.SetWindowLongPtr(childHandle, WindowLongFlags.GWL_STYLE, new IntPtr((long)newStyle));
		}
	}
}