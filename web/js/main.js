// --- Keyboard Shortcuts ---
document.addEventListener('keydown', e => {
  const ctrl = e.ctrlKey || e.metaKey;
  if (!ctrl) return;

  const map = {
    'n': 'new', 'o': 'open', 's': e.shiftKey ? 'saveAs' : 'save',
    'f': 'find', 'g': 'goto', 'h': 'heading',
    'b': 'bold', 'i': 'italic', 'u': 'underline',
    'z': 'undo', 'y': 'redo',
    '=': 'zoomIn', '-': 'zoomOut', '0': 'zoomReset'
  };

  if (e.shiftKey && e.key === 'P') {
    e.preventDefault(); commands.cmdPalette.fn(); return;
  }

  const key = e.key.toLowerCase();
  if (map[key] && commands[map[key]]) {
    // Let browser handle cut/copy/paste/selectAll/undo/redo natively for contenteditable
    if (['z','y'].includes(key) && !e.shiftKey) return;
    if (['x','c','v','a'].includes(key)) return;
    e.preventDefault();
    commands[map[key]].fn();
  }
});

// --- Init ---
autoLoad();
update();
editor.focus();

// Welcome text for empty documents
if (!editor.innerText.trim()) {
  editor.innerHTML = `<b>Welcome to QuillStar</b>

<i>"Your humble word processor has grown up."</i>

A modern writing tool inspired by the legendary WordStar.

<b>Getting Started</b>
  \u2022 Just start typing \u2014 your work auto-saves
  \u2022 Press <b>Ctrl+Shift+P</b> for the Command Palette
  \u2022 Press <b>Ctrl+S</b> to save, <b>Ctrl+O</b> to open files
  \u2022 Press <b>Ctrl+F</b> to find and replace

<b>Formatting</b>
  \u2022 <b>Ctrl+B</b> Bold
  \u2022 <b>Ctrl+I</b> Italic
  \u2022 <b>Ctrl+U</b> Underline
  \u2022 <b>Ctrl+H</b> Toggle heading

<b>Philosophy</b>
  The writer is sacred. Nothing should come between
  you and your words. Technology enhances, never
  dominates, the creative process.

  Flow is everything. Interruptions are hostile.
  Assistance, not insistence.

Start writing and this welcome text will be replaced.
`;
  state.modified = false;
  update();
}
