// --- Core State ---
const editor = document.getElementById('editor');
const lineNumbers = document.getElementById('lineNumbers');
const state = {
  fileName: 'Untitled',
  modified: false,
  zoom: 100,
  showHelp: true,
  showLines: true,
  showRuler: true,
  wordWrap: true
};

// --- Ruler ---
function buildRuler() {
  let r = '';
  for (let i = 0; i <= 120; i++) {
    if (i % 10 === 0) r += (i / 10) % 10;
    else if (i % 5 === 0) r += '+';
    else r += '\u00b7';
  }
  document.getElementById('rulerInner').textContent = r;
}
buildRuler();

// --- Line Numbers ---
function updateLineNumbers() {
  const text = editor.innerText || '';
  const lines = text.split('\n').length || 1;
  let html = '';
  for (let i = 1; i <= lines; i++) html += i + '\n';
  lineNumbers.textContent = html;
}

// --- Status Bar ---
function updateStatus() {
  const text = editor.innerText || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  document.getElementById('wordCount').textContent = words;
  document.getElementById('charCount').textContent = text.length;
  document.getElementById('fileName').textContent = state.fileName;

  const ind = document.getElementById('modIndicator');
  if (state.modified) { ind.textContent = 'Modified'; ind.className = 'modified'; }
  else { ind.textContent = 'Saved'; ind.className = 'saved'; }
}

function updateCursor() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  const preRange = range.cloneRange();
  preRange.selectNodeContents(editor);
  preRange.setEnd(range.startContainer, range.startOffset);
  const textBefore = preRange.toString();
  const lines = textBefore.split('\n');
  document.getElementById('curLine').textContent = lines.length;
  document.getElementById('curCol').textContent = lines[lines.length - 1].length + 1;
}

// --- Auto-save to localStorage ---
function autoSave() {
  localStorage.setItem('quillstar_doc', editor.innerHTML);
  localStorage.setItem('quillstar_name', state.fileName);
}

function autoLoad() {
  const saved = localStorage.getItem('quillstar_doc');
  const name = localStorage.getItem('quillstar_name');
  if (saved) { editor.innerHTML = saved; state.fileName = name || 'Untitled'; }
}
