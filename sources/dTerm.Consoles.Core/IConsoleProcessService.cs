﻿namespace dTerm.Consoles.Core
{
	public interface IConsoleProcessService
	{
		IConsoleProcess Create(IProcessDescriptor descriptor);
	}
}