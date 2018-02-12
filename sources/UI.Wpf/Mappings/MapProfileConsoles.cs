﻿using System;
using AutoMapper;
using Consoles.Core;
using UI.Wpf.Consoles;

namespace UI.Wpf.Mappings
{
	public class MapProfileConsoles : Profile
	{
		//
		private readonly IConsolesRepository _consolesRepository = null;

		/// <summary>
		/// Constructor method.
		/// </summary>
		public MapProfileConsoles(IConsolesRepository consolesRepository)
		{
			_consolesRepository = consolesRepository ?? throw new ArgumentNullException(nameof(consolesRepository), nameof(MapProfileConsoles));

			SetupMaps();
		}

		private void SetupMaps()
		{
			CreateMap<ConsoleEntity, ConsoleViewModel>();
			CreateMap<ConsoleViewModel, ConsoleEntity>();
		}
	}
}
