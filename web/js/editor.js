// --- Editor Events ---
function update() {
  updateLineNumbers();
  updateStatus();
  updateCursor();
}

editor.addEventListener('input', () => {
  state.modified = true;
  update();
  clearTimeout(editor._saveTimer);
  editor._saveTimer = setTimeout(autoSave, 2000);
});

editor.addEventListener('keyup', updateCursor);
editor.addEventListener('click', updateCursor);
editor.addEventListener('scroll', () => {
  lineNumbers.scrollTop = editor.scrollTop;
});

// Tab key inserts spaces
editor.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    document.execCommand('insertText', false, '    ');
  }
  if (e.key === 'Escape') {
    if (document.getElementById('findBar').classList.contains('open')) toggleFindBar(false);
  }
});
