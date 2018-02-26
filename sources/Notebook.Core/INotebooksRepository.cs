﻿using System;
using System.Collections.Generic;

namespace Notebook.Core
{
	public interface INotebooksRepository
	{
		NoteEntity Add(NoteEntity noteEntity);
		void Delete(Guid noteId);
		List<NoteEntity> GetAll();
		void Update(NoteEntity noteEntity);
	}
}