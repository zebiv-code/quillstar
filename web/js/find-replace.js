// --- Find/Replace ---
function toggleFindBar(open) {
  const bar = document.getElementById('findBar');
  if (open) {
    bar.classList.add('open');
    document.getElementById('findInput').focus();
    const sel = window.getSelection();
    if (sel.toString()) document.getElementById('findInput').value = sel.toString();
  } else {
    bar.classList.remove('open');
    editor.focus();
  }
}

document.getElementById('findClose').onclick = () => toggleFindBar(false);
document.getElementById('findInput').onkeydown = e => {
  if (e.key === 'Escape') toggleFindBar(false);
  if (e.key === 'Enter') findInDoc(true);
};

document.getElementById('findNext').onclick = () => findInDoc(true);
document.getElementById('findPrev').onclick = () => findInDoc(false);

function findInDoc(forward) {
  const term = document.getElementById('findInput').value;
  if (!term) return;
  window.find(term, false, !forward, true);
}

document.getElementById('replaceOne').onclick = () => {
  const sel = window.getSelection();
  if (sel.toString() === document.getElementById('findInput').value) {
    document.execCommand('insertText', false, document.getElementById('replaceInput').value);
  }
  findInDoc(true);
};

document.getElementById('replaceAll').onclick = () => {
  const find = document.getElementById('findInput').value;
  const replace = document.getElementById('replaceInput').value;
  if (!find) return;
  const html = editor.innerHTML;
  const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  editor.innerHTML = html.replace(new RegExp(escaped, 'g'), replace);
  state.modified = true; update();
};

// --- About ---
document.getElementById('aboutClose').onclick = () => {
  document.getElementById('aboutOverlay').classList.remove('open');
  editor.focus();
};
document.getElementById('aboutOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('aboutOverlay')) {
    document.getElementById('aboutOverlay').classList.remove('open');
    editor.focus();
  }
});
