// --- Menu System ---
let openMenu = null;
document.getElementById('menuBar').addEventListener('click', e => {
  const item = e.target.closest('.menu-item');
  const cmd = e.target.closest('.dropdown-item');

  if (cmd) {
    const c = cmd.dataset.cmd;
    if (commands[c]) commands[c].fn();
    closeMenus();
    return;
  }

  if (item) {
    if (item.classList.contains('open')) { closeMenus(); }
    else { closeMenus(); item.classList.add('open'); openMenu = item; }
  }
});

document.getElementById('menuBar').addEventListener('mouseover', e => {
  if (!openMenu) return;
  const item = e.target.closest('.menu-item');
  if (item && item !== openMenu) {
    closeMenus(); item.classList.add('open'); openMenu = item;
  }
});

function closeMenus() {
  document.querySelectorAll('.menu-item.open').forEach(m => m.classList.remove('open'));
  openMenu = null;
}

document.addEventListener('click', e => {
  if (!e.target.closest('.menu-bar')) closeMenus();
});
