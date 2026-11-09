/*
 * JS Engine Lab — ⌨️ Terminal & Git: the Linux / shell and Git commands professionals use every day,
 * grouped by task. Brief by default (command + what it does); "+ Show details" adds an example or a warning.
 * The "Which command?" situations are also 🏋️ Practice tasks (topic "Terminal & Git").
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // [command, what it does, example / note (details), danger?]
  const GROUPS = [
    { key: 'files', name: 'Files & folders', title: 'Moving around and working with files', say: 'The commands you type a hundred times a day.', cmds: [
      ['pwd', 'Print the folder you are in.', '/home/ravi/projects/shop'],
      ['ls -la', 'List everything here, with hidden files (.env, .git), sizes and permissions.', 'ls -lah  → sizes in KB / MB'],
      ['cd folder · cd .. · cd ~ · cd -', 'Go into a folder · up one · to your home · back to the previous folder.', 'cd ~/projects/shop && code .   (open it in VS Code)'],
      ['mkdir -p src/components/ui', 'Create a folder, including missing parents.', ''],
      ['touch file.js', 'Create an empty file (or update its time).', ''],
      ['cp -r src backup · mv old.js new.js', 'Copy (with -r for folders) · move or rename.', ''],
      ['rm file.js · rm -r folder', 'Delete a file · a folder. There is no recycle bin.', 'rm -rf deletes without asking: check the path twice; never run it with a variable that might be empty.', true],
      ['cat file · less file', 'Print a file · page through a long one (q to quit, / to search).', ''],
      ['head -n 20 file · tail -n 50 file', 'First or last lines of a file.', ''],
      ['tail -f logs/app.log', 'Follow a log file live as new lines arrive (Ctrl+C to stop).', 'docker logs -f api   (the same for a container)'],
      ['find . -name "*.test.ts" -not -path "*/node_modules/*"', 'Find files by name.', ''],
    ] },
    { key: 'text', name: 'Search & text', title: 'Searching and working with text', say: 'Find anything in a codebase or a log in seconds.', cmds: [
      ['grep -rn "useAuth" src', 'Search all files under src for text, with line numbers.', 'grep -rni ... ignores case · grep -rl ... lists only file names'],
      ['rg "useAuth"', 'ripgrep: a much faster grep that skips node_modules and .gitignore files.', 'rg -t ts "fetch\\(" → only TypeScript files'],
      ['command | grep text', 'The pipe: send one command\'s output into another.', 'npm ls | grep react'],
      ['> file · >> file · 2>&1', 'Write output to a file · append to it · include errors too.', 'npm run build > build.log 2>&1'],
      ['wc -l file', 'Count lines.', 'git ls-files | xargs wc -l   (lines in the repo)'],
      ['sort | uniq -c | sort -rn', 'Count repeated lines, most frequent first.', 'cut -d" " -f1 access.log | sort | uniq -c | sort -rn | head   (top IPs)'],
      ['sed -i "s/old/new/g" file', 'Replace text in a file.', 'On macOS: sed -i "" "s/old/new/g" file'],
      ['xargs', 'Turn a list into arguments for another command.', 'find . -name "*.log" | xargs rm'],
      ['jq', 'Pretty-print and query JSON on the command line.', 'curl -s https://api.github.com/users/octocat | jq ".name"'],
    ] },
    { key: 'proc', name: 'Processes & ports', title: 'Processes, ports and running things', say: 'For "port 3000 is already in use" and stuck dev servers.', cmds: [
      ['Ctrl+C · Ctrl+Z, then fg / bg', 'Stop the running command · pause it, then bring it back or run it in the background.', ''],
      ['command &', 'Run a command in the background.', 'npm run dev &   then  jobs  to list them'],
      ['ps aux | grep node', 'Find running processes and their PIDs.', ''],
      ['lsof -i :3000', 'Which process is using port 3000.', 'Windows: netstat -ano | findstr :3000'],
      ['kill 12345 · kill -9 12345', 'Ask a process to stop · force it.', 'npx kill-port 3000 does both steps for a port. Windows: taskkill /PID 12345 /F'],
      ['top · htop', 'Live CPU and memory use (q to quit).', ''],
      ['nohup npm start > out.log 2>&1 &', 'Keep a process running after you log out (on a server).', 'In real deployments, use a process manager (pm2, systemd) or a container instead.'],
    ] },
    { key: 'net', name: 'Network & servers', title: 'Network and remote servers', say: 'Test APIs and work on servers from the terminal.', cmds: [
      ['curl https://api.example.com/users', 'Make an HTTP request and print the body.', ''],
      ['curl -i URL · curl -I URL', 'Show the response headers too · only the headers (check Cache-Control, CORS…).', ''],
      ['curl -X POST -H "Content-Type: application/json" -d \'{"name":"Ada"}\' URL', 'Send JSON to an API.', 'DevTools → Network → right-click → Copy as cURL gives you this for any request.'],
      ['ssh user@server', 'Open a terminal on a remote server.', 'ssh -i ~/.ssh/key.pem ubuntu@1.2.3.4'],
      ['scp file user@server:/path · rsync -avz dist/ user@server:/var/www/', 'Copy files to a server (rsync only sends what changed).', ''],
      ['ping host · dig shop.com · nslookup shop.com', 'Is the host reachable · what does DNS return for a domain.', 'dig +short shop.com → the IP addresses'],
      ['ssh-keygen -t ed25519 -C "you@example.com"', 'Create an SSH key (for GitHub and servers).', 'Add ~/.ssh/id_ed25519.pub to GitHub → Settings → SSH keys. Never share the file without .pub.'],
    ] },
    { key: 'env', name: 'Env & permissions', title: 'Environment, permissions and the shell', say: 'Why "command not found" and "Permission denied" happen.', cmds: [
      ['chmod +x deploy.sh · ./deploy.sh', 'Make a script executable · run it.', 'chmod 644 file (owner writes, others read) · chmod 755 for scripts and folders'],
      ['sudo command', 'Run as administrator (on servers). Never use it for npm install.', 'npm permission errors are fixed by using nvm, not sudo.', true],
      ['echo $PATH · which node', 'Where the shell looks for programs · which node will run.', 'Windows PowerShell: $env:PATH · Get-Command node'],
      ['export API_URL=http://localhost:4000', 'Set an environment variable for this terminal session.', 'API_URL=... npm run dev   (only for that one command) · PowerShell: $env:API_URL="..."'],
      ['nvm install 20 · nvm use 20', 'Install and switch Node versions per project.', 'Put "20" in a .nvmrc file; then just run nvm use. (Windows: nvm-windows or fnm)'],
      ['alias gs="git status"', 'A shortcut for a long command (save it in ~/.bashrc or ~/.zshrc).', 'source ~/.bashrc reloads it'],
      ['history · Ctrl+R', 'Show past commands · search them as you type (the biggest time saver).', ''],
      ['du -sh * · df -h', 'Size of each item here · free disk space.', 'du -sh node_modules → often the biggest folder'],
      ['tar -czf site.tar.gz dist · tar -xzf site.tar.gz', 'Pack a folder into one compressed file · unpack it.', ''],
    ] },
    { key: 'git-daily', name: 'Git: daily flow', title: 'Git: the everyday flow', say: 'Branch, commit, push, open a PR, stay up to date.', cmds: [
      ['git status', 'What changed, what is staged, which branch you are on. Run it all the time.', ''],
      ['git switch -c feat/WISH-102-heart', 'Create a new branch from where you are and switch to it.', 'git switch main → go back · (older: git checkout -b)'],
      ['git add -p', 'Stage changes piece by piece, reviewing each one before it goes in.', 'git add file · git add . (everything)'],
      ['git commit -m "feat(wishlist): add heart button"', 'Save the staged changes with a clear message.', 'Conventional commits: feat, fix, refactor, test, docs, chore'],
      ['git push -u origin feat/WISH-102-heart', 'Upload the branch; -u links it, so later just git push.', 'Then open the pull request on GitHub / GitLab'],
      ['git pull --rebase', 'Get the latest changes and put your local commits on top (no extra merge commits).', 'git config --global pull.rebase true makes it the default'],
      ['git fetch --prune', 'Download remote changes without touching your files; remove deleted remote branches.', ''],
      ['git log --oneline --graph --decorate -20', 'A compact picture of recent history and branches.', 'git config --global alias.lg "log --oneline --graph --decorate" → git lg'],
    ] },
    { key: 'git-look', name: 'Git: investigate', title: 'Git: looking at changes and history', say: 'Find out what changed, who changed it, and why.', cmds: [
      ['git diff · git diff --staged', 'Unstaged changes · what is about to be committed.', ''],
      ['git show a1b2c3d', 'One commit: message and changes.', ''],
      ['git log -p -- src/cart.ts', 'Every change ever made to one file.', ''],
      ['git blame -L 40,60 src/cart.ts', 'Who last changed each line, in which commit.', 'Then git show <sha> to read the commit and its message (and the linked PR).'],
      ['git log -S "calcTotal"', 'Find commits that added or removed some text (the "pickaxe").', ''],
      ['git bisect start · bad · good v1.4.0', 'Binary-search history for the commit that broke something.', 'Mark each commit git checks out as good / bad; git bisect reset when done.'],
      ['git shortlog -sn', 'Commits per author.', ''],
    ] },
    { key: 'git-fix', name: 'Git: fix mistakes', title: 'Git: fixing mistakes', say: 'Almost nothing is truly lost in Git, if you know these.', cmds: [
      ['git restore file', 'Throw away unstaged changes in a file.', 'They are gone for good: Git never saw them.', true],
      ['git restore --staged file', 'Unstage a file (keep the changes).', ''],
      ['git commit --amend', 'Change the last commit (message or add a forgotten file). Only before pushing.', 'After pushing, amending rewrites history others may have.'],
      ['git reset --soft HEAD~1', 'Undo the last commit but keep its changes staged.', 'Committed to main by mistake? git switch -c my-branch, then on main: git reset --hard origin/main'],
      ['git revert a1b2c3d', 'Make a new commit that undoes an old one: the safe undo for pushed / shared commits.', ''],
      ['git reflog', 'Every place HEAD has been: find "lost" commits after a reset or a deleted branch.', 'git switch -c rescue <sha-from-reflog>'],
      ['git stash push -m "wip" · git stash pop', 'Put unfinished changes aside (to switch branch), and bring them back.', 'git stash list · git stash -u also stashes new files'],
      ['git clean -fd', 'Delete untracked files and folders.', 'Run git clean -nd first to see what would be deleted.', true],
    ] },
    { key: 'git-team', name: 'Git: branches & team', title: 'Git: branches, conflicts and working with others', say: 'Keeping your branch current and your teammates happy.', cmds: [
      ['git rebase main', 'Replay your branch on top of the latest main (straight history).', 'Rebase only your own branch, never a shared one.'],
      ['git rebase -i HEAD~3', 'Tidy your last 3 commits before a PR: squash, reword, reorder.', 'Opens an editor: change "pick" to "squash" / "reword".'],
      ['Conflicts: edit → git add file → git rebase --continue', 'Fix the <<<<<<< ======= >>>>>>> markers, stage the file, continue.', 'git rebase --abort / git merge --abort goes back to before you started.'],
      ['git push --force-with-lease', 'Push your rebased branch, but refuse if someone else pushed meanwhile.', 'Never plain --force, and never on main.', true],
      ['git cherry-pick a1b2c3d', 'Copy one commit onto the current branch (a hotfix to a release branch).', ''],
      ['git branch -d feat/old · git push origin --delete feat/old', 'Delete a merged branch locally · on the remote.', ''],
      ['git tag v1.2.0 · git push --tags', 'Mark a release.', ''],
      ['git worktree add -b hotfix ../hotfix main', 'A second working folder on a new branch (hotfix, made from main), without stashing.', 'A branch can be checked out in only one folder at a time, so "git worktree add ../hotfix main" fails while main is open in your main folder. git worktree remove ../hotfix when done.'],
    ] },
  ];

  const SHORTCUTS = [['Tab', 'complete file names and commands'], ['↑ / ↓', 'previous / next command'], ['Ctrl+R', 'search command history'], ['Ctrl+A / Ctrl+E', 'start / end of the line'], ['Ctrl+U / Ctrl+W', 'delete to the start / delete one word'], ['Ctrl+L or clear', 'clear the screen'], ['!!', 'repeat the last command (sudo !!)'], ['cd -', 'back to the previous folder']];

  const SITUATIONS = [
    { id: 'term-port', title: 'Port already in use', q: '`npm run dev` fails: "Port 3000 is already in use".', a: 'find', choices: [['find', 'lsof -i :3000, then kill <PID> (or npx kill-port 3000)'], ['reboot', 'Restart the computer'], ['sudo', 'sudo npm run dev']], why: 'An old dev server is still running. lsof shows which process holds the port, kill stops it. On Windows: netstat -ano | findstr :3000, then taskkill /PID <PID> /F.' },
    { id: 'term-logs', title: 'Watch a log live', q: 'You want to watch the server\'s log file while you reproduce a bug.', a: 'tailf', choices: [['tailf', 'tail -f logs/app.log'], ['cat', 'cat logs/app.log again and again'], ['open', 'Open it in an editor and refresh']], why: 'tail -f keeps the file open and prints new lines as they are written. Add | grep ERROR to see only errors.' },
    { id: 'term-grep', title: 'Where is it used?', q: 'You need every place in src where useAuth is used.', a: 'grep', choices: [['grep', 'grep -rn "useAuth" src (or rg useAuth)'], ['find', 'find src -name useAuth'], ['ls', 'ls -R src']], why: 'grep searches file contents (-r recursively, -n with line numbers); find searches file names. ripgrep (rg) is faster and skips node_modules.' },
    { id: 'term-perm', title: 'Permission denied', q: 'Running ./deploy.sh says "Permission denied".', a: 'chmod', choices: [['chmod', 'chmod +x deploy.sh, then ./deploy.sh'], ['sudo', 'sudo ./deploy.sh'], ['rm', 'Delete it and write it again']], why: 'The file is not marked as executable. chmod +x adds the execute permission. sudo would not fix that, and running scripts as root is risky.' },
    { id: 'term-headers', title: 'Check the caching headers', q: 'You want to check the Cache-Control header the CDN sends for app.js.', a: 'curl', choices: [['curl', 'curl -I https://shop.com/assets/app.js'], ['ping', 'ping shop.com'], ['ssh', 'ssh into the CDN']], why: 'curl -I sends a HEAD request and prints only the response headers: Cache-Control, ETag, content-type, CORS headers. (DevTools → Network shows the same in the browser.)' },
    { id: 'git-wrong-branch', title: 'Committed on main by mistake', q: 'You made 2 commits on main locally (not pushed) that belong on a feature branch.', a: 'branch', choices: [['branch', 'git switch -c feat/x (keeps the commits), then on main: git reset --hard origin/main'], ['delete', 'Delete the folder and clone again'], ['push', 'Push to main and fix it later']], why: 'A new branch at the current commit keeps your work; resetting main to origin/main removes the commits from main only. Nothing is lost, and nothing was pushed.' },
    { id: 'git-switch-wip', title: 'Switch branch with unfinished work', q: 'You are halfway through a change when you must fix an urgent bug on another branch.', a: 'stash', choices: [['stash', 'git stash push -m "wip", switch, fix, come back, git stash pop'], ['commit', 'Commit the broken work to main'], ['lose', 'git restore . and start again later']], why: 'stash saves your unfinished changes and cleans the working folder; pop brings them back. (git worktree is another option: a second folder on the other branch.)' },
    { id: 'git-lost', title: 'Commits gone after a reset', q: 'You ran git reset --hard and your last commit disappeared.', a: 'reflog', choices: [['reflog', 'git reflog to find its id, then git switch -c rescue <id>'], ['gone', 'It is gone forever'], ['revert', 'git revert HEAD']], why: 'The reflog records every move of HEAD, so commits you "lost" locally are still there: by default for at least 30 days for commits no branch points to any more (90 days for the rest). Only changes that were never committed cannot be recovered.' },
    { id: 'git-push-rejected', title: 'Push rejected after a rebase', q: 'You rebased your own feature branch on main, and git push is rejected.', a: 'lease', choices: [['lease', 'git push --force-with-lease'], ['force', 'git push --force'], ['merge', 'git pull, then push the merge']], why: 'Rebasing rewrote your branch, so the remote must be overwritten. --force-with-lease does that only if nobody else pushed in the meantime; plain --force could wipe a teammate\'s commits. Never force-push main.' },
    { id: 'git-why-line', title: 'Why is this line here?', q: 'A strange line in cart.ts looks wrong, and you want to know why someone added it.', a: 'blame', choices: [['blame', 'git blame -L 40,50 src/cart.ts, then git show <sha>'], ['delete', 'Delete it and see what breaks'], ['log', 'git log on the whole repo']], why: 'blame shows the commit that last changed each line; git show displays its message and diff, and usually links the ticket or PR that explains why.' },
  ];

  if (window.WebLab) window.WebLab.extend('term', s => ({ answer: s.a, steps: [{ ok: true, text: esc(s.why) }] }),
    (s, e) => `<div class="wl-card"><small>the situation</small><pre>${e(s.q)}</pre></div>`);
  (window.WEB_TASKS = window.WEB_TASKS || []).push(...SITUATIONS.map(x => ({
    id: x.id, cat: 'Terminal & Git', kind: 'rule', solver: 'term', icon: '⌨️', kindLabel: 'which command?',
    title: x.title, ask: 'Which command?', scene: 'Everyday work in the terminal.',
    choices: x.choices.map(c => c[0]), labels: Object.fromEntries(x.choices),
    hint: 'Which command is made for exactly this, and is it safe?', why: `${esc(x.why)} See the ⌨️ Terminal & Git tab.`, scenario: { q: x.q, a: x.a, why: x.why },
  })));

  const STAGES = [
    { key: 'start', name: 'Start here', title: 'Using the terminal on your computer', say: 'Linux and macOS have a terminal built in. On Windows, use Git Bash or WSL to run the same commands.' },
    ...GROUPS.map(g => ({ key: g.key, name: g.name, title: g.title, say: g.say, group: g })),
    { key: 'quiz', name: 'Which command?', title: 'Which command?', say: 'Real situations. Pick an answer to see why.' },
  ];
  const UI = { stage: 0, detail: false, answers: {} };
  const groupView = g => `<table class="iv-diff tg-table"><tbody>${g.cmds.map(([c, w, ex, danger]) => `<tr class="${danger ? 'danger' : ''}"><td><code>${esc(c)}</code></td><td>${danger ? '⚠️ ' : ''}${esc(w)}${UI.detail && ex ? `<small class="tg-ex">${esc(ex)}</small>` : ''}</td></tr>`).join('')}</tbody></table>
    ${UI.detail ? '' : '<p class="cl-note">"+ Show details" adds an example or a warning to each command. ⚠️ marks commands that can delete or overwrite things.</p>'}`;
  const VIEWS = {
    start: () => `<div class="db-grid dp-must">
        <div class="db-card"><div class="db-h"><b>🐧 Linux / 🍎 macOS</b></div><p>Open the Terminal app. Everything in this tab works as written (macOS uses zsh; a few flags differ, noted where it matters).</p></div>
        <div class="db-card"><div class="db-h"><b>🪟 Windows</b></div><p><b>Git Bash</b> (comes with Git for Windows) runs most of these commands. <b>WSL</b> (Windows Subsystem for Linux) gives you a real Linux, which is what most servers run: the best choice for learning. In VS Code, pick the shell in the terminal's ▾ menu.</p></div>
        <div class="db-card"><div class="db-h"><b>Why it matters</b></div><p>Servers, Docker, CI pipelines and cloud machines are almost always Linux. Professionals use the terminal for Git, running and debugging apps, searching code and checking servers, because it is faster and scriptable.</p></div></div>
      <p><b>Shortcuts that save hours</b></p><table class="iv-diff db-words"><tbody>${SHORTCUTS.map(([k, d]) => `<tr><td><code>${esc(k)}</code></td><td>${esc(d)}</td></tr>`).join('')}</tbody></table>
      <p class="cl-note">The Git practice tasks (merge, rebase, reset, revert, cherry-pick, with a commit graph) are in the 🏋️ Practice list under "Git & tools".</p>`,
    quiz: () => SITUATIONS.map((x, i) => {
      const got = UI.answers[i], done = got != null, ok = got === x.a, label = k => x.choices.find(c => c[0] === k)[1];
      return `<div class="db-q${done ? (ok ? ' ok' : ' no') : ''}"><p><b>${i + 1}.</b> ${esc(x.q)}</p>
        <div class="cl-choices">${x.choices.map(([k, l]) => `<button class="btn small cl-choice${got === k ? ' on' : ''}${done && k === x.a ? ' right' : ''}" data-tgq="${i}" data-tga="${k}">${esc(l)}</button>`).join('')}</div>
        ${done ? `<p class="db-ans">${ok ? '✅ Right' : `❌ Better: <b>${esc(label(x.a))}</b>`}. ${esc(x.why)}</p>` : ''}</div>`;
    }).join(''),
  };

  function ensure() {
    let m = $('tgLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'tgLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'Terminal and Git');
    m.innerHTML = `<div class="modal-card wide cl-lab px-card">
      <button class="close" data-tgclose aria-label="Close">✕</button>
      <div class="cl-head"><h2 class="modal-title">⌨️ Terminal & Git</h2><span class="cl-note">the commands professionals use every day</span></div>
      <div class="px-rail" id="tgRail"></div>
      <div class="px-main db-main"><div class="px-view"><h3 id="tgTitle"></h3><p class="px-say" id="tgSay"></p><button class="btn small dp-detail" id="tgDetail" data-tgdetail></button><div id="tgBody"></div></div></div>
      <div class="px-controls"><button class="btn small" id="tgPrev">◀ Back</button><button class="btn small primary" id="tgNext">Next ▶</button></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function draw() {
    const s = STAGES[UI.stage];
    $('tgRail').innerHTML = STAGES.map((x, i) => `<button class="px-step${i === UI.stage ? ' now' : i < UI.stage ? ' done' : ''}" data-tgstage="${i}"><span>${i + 1}</span>${esc(x.name)}</button>`).join('<i>→</i>');
    $('tgTitle').textContent = `${UI.stage + 1} · ${s.title}`;
    $('tgSay').textContent = s.say;
    $('tgBody').innerHTML = s.group ? groupView(s.group) : VIEWS[s.key]();
    $('tgDetail').textContent = UI.detail ? '− Brief view' : '+ Show details';
    $('tgDetail').classList.toggle('hidden', !s.group);
    $('tgPrev').disabled = UI.stage === 0;
    $('tgNext').disabled = UI.stage === STAGES.length - 1;
  }
  function open(stage) {
    const m = ensure();
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    ['practiceList', 'frontendMap'].forEach(id => { const x = $(id); if (x) x.classList.add('hidden'); });
    UI.stage = stage || 0;
    m.classList.remove('hidden');
    draw();
  }
  function close() { const m = $('tgLab'); if (m) m.classList.add('hidden'); }
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnTerminal') || t.closest('[data-fmterminal]')) { open(); return; }
    if (!$('tgLab') || $('tgLab').classList.contains('hidden')) return;
    const st = t.closest('[data-tgstage]');
    if (st) { UI.stage = +st.dataset.tgstage; draw(); return; }
    const a = t.closest('[data-tgq]');
    if (a) { UI.answers[+a.dataset.tgq] = a.dataset.tga; const box = $('tgBody').closest('.px-main'), y = box.scrollTop; draw(); box.scrollTop = y; return; }
    if (t.closest('[data-tgdetail]')) { UI.detail = !UI.detail; draw(); return; }
    if (t.closest('#tgPrev')) { UI.stage = Math.max(0, UI.stage - 1); draw(); return; }
    if (t.closest('#tgNext')) { UI.stage = Math.min(STAGES.length - 1, UI.stage + 1); draw(); return; }
    if (t.closest('[data-tgclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('tgLab') && !$('tgLab').classList.contains('hidden')) close(); });

  window.TerminalLab = { open, close, go: i => { UI.stage = i; draw(); }, goKey: k => { UI.stage = STAGES.findIndex(s => s.key === k); draw(); }, groups: GROUPS, situations: SITUATIONS, stages: STAGES };
})();
