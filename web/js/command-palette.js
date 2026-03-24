// --- Command Palette ---
function openCmdPalette() {
  const overlay = document.getElementById('cmdOverlay');
  const input = document.getElementById('cmdInput');
  const list = document.getElementById('cmdList');
  overlay.classList.add('open');
  input.value = '';
  input.focus();
  renderCmdList('');

  input.oninput = () => renderCmdList(input.value);
  input.onkeydown = e => {
    if (e.key === 'Escape') { overlay.classList.remove('open'); editor.focus(); }
    else if (e.key === 'Enter') {
      const sel = list.querySelector('.selected');
      if (sel) { const c = sel.dataset.cmd; if (commands[c]) commands[c].fn(); }
      overlay.classList.remove('open'); editor.focus();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = [...list.querySelectorAll('.cmd-list-item')];
      const cur = items.findIndex(i => i.classList.contains('selected'));
      items.forEach(i => i.classList.remove('selected'));
      const next = e.key === 'ArrowDown' ? Math.min(cur + 1, items.length - 1) : Math.max(cur - 1, 0);
      if (items[next]) { items[next].classList.add('selected'); items[next].scrollIntoView({block:'nearest'}); }
    }
  };
}

function renderCmdList(filter) {
  const list = document.getElementById('cmdList');
  const f = filter.toLowerCase();
  let html = '';
  let first = true;
  for (const [key, cmd] of Object.entries(commands)) {
    if (f && !cmd.label.toLowerCase().includes(f)) continue;
    html += `<div class="cmd-list-item${first?' selected':''}" data-cmd="${key}">
      ${cmd.label} <span class="cmd-shortcut">${cmd.shortcut||''}</span>
    </div>`;
    first = false;
  }
  list.innerHTML = html;
  list.querySelectorAll('.cmd-list-item').forEach(item => {
    item.onclick = () => {
      const c = item.dataset.cmd;
      if (commands[c]) commands[c].fn();
      document.getElementById('cmdOverlay').classList.remove('open');
      editor.focus();
    };
  });
}

document.getElementById('cmdOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('cmdOverlay')) {
    document.getElementById('cmdOverlay').classList.remove('open');
    editor.focus();
  }
});
