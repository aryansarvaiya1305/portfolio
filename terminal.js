/* ============================================================
   ARYAN SARVAIYA PORTFOLIO — terminal.js
   Hero terminal typewriter effect
   ============================================================ */

'use strict';

const sequences = [
  { cmd: 'whoami',           out: 'aryan-sarvaiya (cloud-engineer)' },
  { cmd: 'cat skills.txt',   out: 'AWS · Docker · Terraform · Ansible · Linux · Git · Python · Prometheus' },
  { cmd: 'echo $STATUS',     out: 'Open to Cloud / DevOps opportunities' },
  { cmd: 'ls projects/',     out: 'InfraPilot/  DevOps-Production-Project/' },
  { cmd: 'ping future.role', out: 'Connected: Cloud Engineer @ [Your Company]' },
];

const cmdEl = document.getElementById('typedCmd');
const outEl = document.getElementById('termOut');

if (cmdEl && outEl) {
  let seqIdx  = 0;
  let charIdx = 0;
  let isTyping = true;
  let timeoutId;

  function typeChar() {
    const { cmd, out } = sequences[seqIdx];

    if (isTyping) {
      if (charIdx < cmd.length) {
        cmdEl.textContent += cmd[charIdx];
        charIdx++;
        timeoutId = setTimeout(typeChar, 58 + Math.random() * 40);
      } else {
        // Done typing command — show output
        outEl.textContent = out;
        isTyping = false;
        // Wait before clearing
        timeoutId = setTimeout(clearAndNext, 2600);
      }
    }
  }

  function clearAndNext() {
    cmdEl.textContent = '';
    outEl.textContent = '';
    charIdx = 0;
    isTyping = true;
    seqIdx = (seqIdx + 1) % sequences.length;
    // Small pause before typing next
    timeoutId = setTimeout(typeChar, 500);
  }

  // Start after hero entrance animation settles
  timeoutId = setTimeout(typeChar, 1400);

  // Pause when tab is hidden (battery saver)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(timeoutId);
    } else {
      timeoutId = setTimeout(typeChar, 400);
    }
  });
}