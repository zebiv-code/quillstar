// --- Commands ---
const commands = {
  new: { label: 'New Document', shortcut: 'Ctrl+N', fn() {
    if (state.modified && !confirm('Discard changes?')) return;
    editor.innerHTML = ''; state.fileName = 'Untitled'; state.modified = false;
    localStorage.removeItem('quillstar_doc'); update();
  }},
  open: { label: 'Open File', shortcut: 'Ctrl+O', fn() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.txt,.html,.md';
    input.onchange = e => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (file.name.endsWith('.html')) editor.innerHTML = reader.result;
        else editor.innerText = reader.result;
        state.fileName = file.name; state.modified = false; update();
      };
      reader.readAsText(file);
    };
    input.click();
  }},
  save: { label: 'Save', shortcut: 'Ctrl+S', fn() {
    autoSave(); state.modified = false; updateStatus();
  }},
  saveAs: { label: 'Save As', shortcut: 'Ctrl+Shift+S', fn() {
    const name = prompt('File name:', state.fileName);
    if (!name) return;
    state.fileName = name;
    const blob = new Blob([editor.innerHTML], {type:'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; a.click();
    URL.revokeObjectURL(a.href);
    state.modified = false; updateStatus();
  }},
  exportTxt: { label: 'Export as .txt', fn() {
    const blob = new Blob([editor.innerText], {type:'text/plain'});
    const a = document.createElement('a');
    const name = state.fileName.replace(/\.[^.]+$/, '') + '.txt';
    a.href = URL.createObjectURL(blob); a.download = name; a.click();
    URL.revokeObjectURL(a.href);
  }},
  print: { label: 'Print', shortcut: 'Ctrl+P', fn() { window.print(); }},
  undo: { label: 'Undo', shortcut: 'Ctrl+Z', fn() { document.execCommand('undo'); }},
  redo: { label: 'Redo', shortcut: 'Ctrl+Y', fn() { document.execCommand('redo'); }},
  cut: { label: 'Cut', shortcut: 'Ctrl+X', fn() { document.execCommand('cut'); }},
  copy: { label: 'Copy', shortcut: 'Ctrl+C', fn() { document.execCommand('copy'); }},
  paste: { label: 'Paste', shortcut: 'Ctrl+V', fn() { document.execCommand('paste'); }},
  selectAll: { label: 'Select All', shortcut: 'Ctrl+A', fn() { document.execCommand('selectAll'); }},
  find: { label: 'Find & Replace', shortcut: 'Ctrl+F', fn() { toggleFindBar(true); }},
  goto: { label: 'Go to Line', shortcut: 'Ctrl+G', fn() {
    const n = prompt('Go to line:');
    if (!n) return;
    const line = parseInt(n);
    const text = editor.innerText;
    const lines = text.split('\n');
    if (line < 1 || line > lines.length) return;
    let pos = 0;
    for (let i = 0; i < line - 1; i++) pos += lines[i].length + 1;
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    let charCount = 0;
    while (walker.nextNode()) {
      const nodeLen = walker.currentNode.textContent.length;
      if (charCount + nodeLen >= pos) {
        const sel = window.getSelection();
        const range = document.createRange();
        range.setStart(walker.currentNode, pos - charCount);
        range.collapse(true);
        sel.removeAllRanges(); sel.addRange(range);
        break;
      }
      charCount += nodeLen;
    }
    editor.focus();
  }},
  bold: { label: 'Bold', shortcut: 'Ctrl+B', fn() { document.execCommand('bold'); editor.focus(); }},
  italic: { label: 'Italic', shortcut: 'Ctrl+I', fn() { document.execCommand('italic'); editor.focus(); }},
  underline: { label: 'Underline', shortcut: 'Ctrl+U', fn() { document.execCommand('underline'); editor.focus(); }},
  heading: { label: 'Heading', shortcut: 'Ctrl+H', fn() {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const current = document.queryCommandValue('formatBlock');
    document.execCommand('formatBlock', false, current === 'h2' ? 'p' : 'h2');
    editor.focus();
  }},
  blockquote: { label: 'Block Quote', fn() {
    const current = document.queryCommandValue('formatBlock');
    document.execCommand('formatBlock', false, current === 'blockquote' ? 'p' : 'blockquote');
    editor.focus();
  }},
  toggleHelp: { label: 'Toggle Help Bar', fn() {
    state.showHelp = !state.showHelp;
    document.getElementById('helpBar').style.display = state.showHelp ? 'flex' : 'none';
  }},
  toggleLines: { label: 'Toggle Line Numbers', fn() {
    state.showLines = !state.showLines;
    lineNumbers.style.display = state.showLines ? 'block' : 'none';
  }},
  toggleRuler: { label: 'Toggle Ruler', fn() {
    state.showRuler = !state.showRuler;
    document.getElementById('ruler').style.display = state.showRuler ? 'block' : 'none';
  }},
  toggleWrap: { label: 'Toggle Word Wrap', fn() {
    state.wordWrap = !state.wordWrap;
    editor.style.whiteSpace = state.wordWrap ? 'pre-wrap' : 'pre';
  }},
  zoomIn: { label: 'Zoom In', shortcut: 'Ctrl++', fn() {
    state.zoom = Math.min(200, state.zoom + 10);
    editor.style.fontSize = (state.zoom / 100 * 0.88) + 'rem';
  }},
  zoomOut: { label: 'Zoom Out', shortcut: 'Ctrl+-', fn() {
    state.zoom = Math.max(50, state.zoom - 10);
    editor.style.fontSize = (state.zoom / 100 * 0.88) + 'rem';
  }},
  zoomReset: { label: 'Reset Zoom', shortcut: 'Ctrl+0', fn() {
    state.zoom = 100;
    editor.style.fontSize = '0.88rem';
  }},
  cmdPalette: { label: 'Command Palette', shortcut: 'Ctrl+Shift+P', fn() { openCmdPalette(); }},
  shortcuts: { label: 'Keyboard Shortcuts', fn() {
    let msg = 'QuillStar Keyboard Shortcuts\n\n';
    for (const [,cmd] of Object.entries(commands)) {
      if (cmd.shortcut) msg += cmd.shortcut.padEnd(20) + cmd.label + '\n';
    }
    alert(msg);
  }},
  about: { label: 'About QuillStar', fn() {
    document.getElementById('aboutOverlay').classList.add('open');
  }}
};
