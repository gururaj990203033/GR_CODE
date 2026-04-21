
class LinkedListApp {
  constructor() {
    this.sections = { learn:'learnSection', practice:'practiceSection', patterns:'patternsSection', interview:'interviewSection', debug:'debugSection' };
    this.state = {
      algo: 'reverse', steps: [], current: -1, isPlaying:false, timer:null, speed:3,
      listA: [], listB: [], vizZoom: 1, codeZoom: 1
    };
    this.el = {
      body: document.body,
      tabs: [...document.querySelectorAll('.tab')],
      algoSelect: document.getElementById('algoSelect'),
      listAInput: document.getElementById('listAInput'),
      listBInput: document.getElementById('listBInput'),
      dualInputs: document.getElementById('dualInputs'),
      createBtn: document.getElementById('createBtn'), startBtn: document.getElementById('startBtn'), prevBtn: document.getElementById('prevBtn'), nextBtn: document.getElementById('nextBtn'), playBtn: document.getElementById('playBtn'), pauseBtn: document.getElementById('pauseBtn'), restartBtn: document.getElementById('restartBtn'),
      speedSlider: document.getElementById('speedSlider'), speedLabel: document.getElementById('speedLabel'),
      stepCounter: document.getElementById('stepCounter'), time: document.getElementById('timeComplexity'), space: document.getElementById('spaceComplexity'),
      algoTitle: document.getElementById('algoTitle'), algoBadge: document.getElementById('algoBadge'), difficulty: document.getElementById('difficultyBadge'),
      stepTitle: document.getElementById('stepTitle'), stepExplain: document.getElementById('stepExplain'),
      vizStage: document.getElementById('vizStage'), memoryGrid: document.getElementById('memoryGrid'), codeDisplay: document.getElementById('codeDisplay'), insightList: document.getElementById('insightList'),
      practiceGrid: document.getElementById('practiceGrid'), patternsGrid: document.getElementById('patternsGrid'), interviewGrid: document.getElementById('interviewGrid'), debugGrid: document.getElementById('debugGrid'),
      notesToggle: document.getElementById('notesToggle'), quickNotes: document.getElementById('quickNotes'), quickNotesContent: document.getElementById('quickNotesContent'),
      themeToggle: document.getElementById('themeToggle'),
      vizZoomIn: document.getElementById('vizZoomIn'), vizZoomOut: document.getElementById('vizZoomOut'), vizZoomLabel: document.getElementById('vizZoomLabel'),
      codeZoomIn: document.getElementById('codeZoomIn'), codeZoomOut: document.getElementById('codeZoomOut'), codeZoomLabel: document.getElementById('codeZoomLabel'),
      learnLayout: document.getElementById('learnLayout'), resizeHandle: document.getElementById('resizeHandle')
    };
    this.init();
  }
  init() {
    this.populateSelect();
    this.renderCards();
    this.renderQuickNotes();
    this.attachEvents();
    this.applySavedPrefs();
    this.updateAlgoUI();
    this.createLists();
  }
  attachEvents() {
    this.el.tabs.forEach(t => t.addEventListener('click', ()=>this.openTab(t.dataset.tab)));
    this.el.algoSelect.addEventListener('change', ()=>{ this.state.algo = this.el.algoSelect.value; this.updateAlgoUI(); this.createLists(); });
    this.el.createBtn.addEventListener('click', ()=>this.createLists());
    this.el.startBtn.addEventListener('click', ()=>this.start());
    this.el.prevBtn.addEventListener('click', ()=>this.prev());
    this.el.nextBtn.addEventListener('click', ()=>this.next());
    this.el.playBtn.addEventListener('click', ()=>this.play());
    this.el.pauseBtn.addEventListener('click', ()=>this.pause());
    this.el.restartBtn.addEventListener('click', ()=>this.restart());
    this.el.speedSlider.addEventListener('input', ()=>{ this.state.speed = +this.el.speedSlider.value; this.el.speedLabel.textContent = `${this.state.speed}x`; if (this.state.isPlaying){ this.pause(); this.play(); } });
    this.el.notesToggle.addEventListener('click', ()=> this.el.quickNotes.classList.toggle('open'));
    this.el.themeToggle.addEventListener('click', ()=>this.toggleTheme());
    this.el.vizZoomIn.addEventListener('click', ()=>this.setVizZoom(this.state.vizZoom + 0.1));
    this.el.vizZoomOut.addEventListener('click', ()=>this.setVizZoom(this.state.vizZoom - 0.1));
    this.el.codeZoomIn.addEventListener('click', ()=>this.setCodeZoom(this.state.codeZoom + 0.08));
    this.el.codeZoomOut.addEventListener('click', ()=>this.setCodeZoom(this.state.codeZoom - 0.08));
    document.addEventListener('keydown', (e)=>this.handleKeys(e));
    this.initResize();
  }
  applySavedPrefs(){
    const theme = localStorage.getItem('grcode-theme') || 'dark';
    document.body.classList.toggle('light', theme==='light');
    const split = localStorage.getItem('ll-split');
    if (split && window.innerWidth > 1100) this.el.learnLayout.style.gridTemplateColumns = `${split}px 10px minmax(360px,.9fr)`;
    const vz = +localStorage.getItem('ll-vizzoom'); if (vz) this.state.vizZoom = vz;
    const cz = +localStorage.getItem('ll-codezoom'); if (cz) this.state.codeZoom = cz;
    this.setVizZoom(this.state.vizZoom); this.setCodeZoom(this.state.codeZoom);
  }
  toggleTheme(){ const next=document.body.classList.contains('light')?'dark':'light'; localStorage.setItem('grcode-theme', next); document.body.classList.toggle('light', next==='light'); }
  handleKeys(e){
    const tag = document.activeElement?.tagName; if ((tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT') && e.key !== 'Escape') return;
    if (e.code==='Space'){ e.preventDefault(); this.state.isPlaying ? this.pause() : this.play(); }
    else if (e.key==='ArrowRight'){ e.preventDefault(); this.next(); }
    else if (e.key==='ArrowLeft'){ e.preventDefault(); this.prev(); }
    else if (e.key.toLowerCase()==='r'){ this.restart(); }
    else if (e.key.toLowerCase()==='n'){ this.el.quickNotes.classList.toggle('open'); }
  }
  initResize(){
    let dragging = false;
    const start = x => { if (window.innerWidth<=1100) return; dragging=true; document.body.style.cursor='col-resize'; move(x); };
    const move = x => { if (!dragging) return; const rect=this.el.learnLayout.getBoundingClientRect(); const left=Math.min(Math.max(x-rect.left, 420), rect.width-370); this.el.learnLayout.style.gridTemplateColumns = `${left}px 10px minmax(360px,1fr)`; localStorage.setItem('ll-split', String(Math.round(left))); };
    const stop = ()=>{ dragging=false; document.body.style.cursor=''; };
    this.el.resizeHandle.addEventListener('mousedown', e=>{e.preventDefault(); start(e.clientX);});
    window.addEventListener('mousemove', e=>move(e.clientX)); window.addEventListener('mouseup', stop);
    this.el.resizeHandle.addEventListener('keydown', e=>{ const current = parseFloat(getComputedStyle(this.el.learnLayout).gridTemplateColumns.split(' ')[0]) || 640; if(e.key==='ArrowLeft'){ e.preventDefault(); move(this.el.learnLayout.getBoundingClientRect().left + current - 30); } if(e.key==='ArrowRight'){ e.preventDefault(); move(this.el.learnLayout.getBoundingClientRect().left + current + 30); } });
    window.addEventListener('resize', ()=>{ if(window.innerWidth<=1100) this.el.learnLayout.style.removeProperty('grid-template-columns'); });
  }
  populateSelect(){
    const groups = [{label:'🎯 Basics', keys:['traversal','insert-head','insert-tail','delete-node']},{label:'⚡ Core',keys:['reverse','find-middle','detect-cycle','remove-nth','merge-sorted']},{label:'🔥 Advanced',keys:['palindrome','reverse-k-group','copy-random']}];
    this.el.algoSelect.innerHTML = groups.map(g=>`<optgroup label="${g.label}">${g.keys.filter(k=>ALGO_DATA[k]).map(k=>`<option value="${k}" ${k==='reverse'?'selected':''}>${ALGO_DATA[k].name}</option>`).join('')}</optgroup>`).join('');
  }
  renderCards(){
    this.el.practiceGrid.innerHTML = PRACTICE_PROBLEMS.map(p=>this.problemCard(p.title,p.description,p.difficulty,p.timeComplexity,p.spaceComplexity,()=>this.openFromCard(p.algoKey,p.example))).join('');
    this.el.patternsGrid.innerHTML = PATTERNS.map(p=>`<article class="content-card"><h3>${p.name}</h3><p>${p.description}</p><pre class="mini" style="white-space:pre-wrap">${escapeHtml(p.code)}</pre><div class="kv">${p.problems.map(x=>`<span class="pill">${x}</span>`).join('')}</div></article>`).join('');
    this.el.interviewGrid.innerHTML = INTERVIEW_QUESTIONS.map(p=>this.problemCard(`${p.company} ${p.title}`,p.statement,p.difficulty,p.timeComplexity,p.spaceComplexity,()=>this.openFromCard(p.algoKey,p.example))).join('');
    this.el.debugGrid.innerHTML = DEBUG_SCENARIOS.map(d=>`<article class="content-card"><h3>${d.name}</h3><p>${d.description}</p><h4 style="margin:12px 0 6px">Buggy code</h4><pre class="mini" style="white-space:pre-wrap">${escapeHtml(d.buggyCode)}</pre><h4 style="margin:12px 0 6px">Fix</h4><p class="mini">${d.fix}</p></article>`).join('');
    this.bindCardButtons();
  }
  bindCardButtons(){ document.querySelectorAll('[data-open-algo]').forEach(btn=>btn.addEventListener('click', ()=>this.openFromCard(btn.dataset.openAlgo, btn.dataset.example))); }
  problemCard(title, desc, diff, time, space, handler){ return `<article class="content-card"><h3>${title}</h3><p>${desc}</p><div class="kv"><span class="pill">${diff}</span><span class="pill">Time ${time}</span><span class="pill">Space ${space}</span></div><div class="row" style="margin-top:12px"><button class="btn small primary" data-open-algo="${title.includes('Google')||title.includes('Amazon')||title.includes('Meta')||title.includes('Microsoft')||title.includes('Apple') ? '' : ''}"></button></div><button class="btn small primary" data-open-algo="${this.extractAlgoKey(title, desc)}" data-example="${this.extractExample(title, desc)}" style="margin-top:14px">Open in Learn</button></article>`; }
  extractAlgoKey(title, desc){
    const all = [...PRACTICE_PROBLEMS, ...INTERVIEW_QUESTIONS];
    const found = all.find(x=> title.includes(x.title) || desc.includes(x.description||'') || desc.includes(x.statement||''));
    return found?.algoKey || 'reverse';
  }
  extractExample(title, desc){ const all=[...PRACTICE_PROBLEMS,...INTERVIEW_QUESTIONS]; const f=all.find(x=> title.includes(x.title)||desc.includes(x.description||'')||desc.includes(x.statement||'')); return f?.example||'1,2,3,4,5'; }
  openFromCard(algoKey, example){ this.openTab('learn'); this.state.algo = algoKey; this.el.algoSelect.value = algoKey; if(algoKey==='merge-sorted'){ this.el.listAInput.value = example || '1,3,5'; this.el.listBInput.value = '1,2,4'; } else { this.el.listAInput.value = example || '1,2,3,4,5'; } this.updateAlgoUI(); this.createLists(); }
  renderQuickNotes(){ this.el.quickNotesContent.innerHTML = QUICK_NOTES.map(n=>`<article style="padding:10px 0;border-bottom:1px solid var(--border)"><strong>${n.title}</strong><p class="muted" style="margin:.35rem 0">${n.content}</p><div class="badge">${n.trick}</div></article>`).join(''); }
  openTab(tab){ this.el.tabs.forEach(t=>t.classList.toggle('active', t.dataset.tab===tab)); Object.entries(this.sections).forEach(([k,id])=>document.getElementById(id).classList.toggle('active', k===tab)); }
  updateAlgoUI(){
    const algo = ALGO_DATA[this.state.algo];
    this.el.algoTitle.textContent = algo?.name || 'Algorithm'; this.el.algoBadge.textContent = this.state.algo; this.el.difficulty.textContent = algo?.difficulty || 'Easy'; this.el.time.textContent = algo?.timeComplexity || 'O(n)'; this.el.space.textContent = algo?.spaceComplexity || 'O(1)';
    this.el.codeDisplay.innerHTML = formatCode(algo?.code || '// No code available');
    this.el.insightList.innerHTML = (algo?.insights || []).map(x=>`<li>${x}</li>`).join('');
    this.el.dualInputs.classList.toggle('active', this.state.algo==='merge-sorted');
  }
  parseList(raw){ return raw.split(',').map(x=>x.trim()).filter(Boolean).map(Number).filter(x=>!Number.isNaN(x)); }
  createLists(){
    this.pause();
    this.state.listA = this.makeNodes(this.parseList(this.el.listAInput.value));
    this.state.listB = this.state.algo==='merge-sorted' ? this.makeNodes(this.parseList(this.el.listBInput.value)) : [];
    this.state.steps = []; this.state.current = -1; this.updateControls(); this.renderCurrent({title:'Ready', explanation:'Lists created. Press Start to generate steps.', view:this.defaultView()});
  }
  makeNodes(values, prefix='A'){ return values.map((v,i)=>({id:`${prefix}${i}`, value:v, addr:`0x${(0x1000 + i*0x10 + Math.floor(Math.random()*8)).toString(16).toUpperCase()}`})); }
  defaultView(){ return { listA:this.state.listA, listB:this.state.listB, merged:[], pointers:{}, memoryMode:this.state.algo==='merge-sorted'?'dual':'single' }; }
  start(){
    this.pause();
    this.state.steps = this.generateSteps(this.state.algo);
    this.state.current = 0;
    this.updateControls();
    this.renderStep();
  }
  restart(){ if(!this.state.steps.length) return; this.pause(); this.state.current = 0; this.updateControls(); this.renderStep(); }
  prev(){ if(this.state.current>0){ this.state.current--; this.updateControls(); this.renderStep(); } }
  next(){ if(this.state.current < this.state.steps.length-1){ this.state.current++; this.updateControls(); this.renderStep(); } else { this.pause(); } }
  play(){ if(!this.state.steps.length) return; this.state.isPlaying=true; this.updateControls(); const delay = 1400 - (this.state.speed*180); this.state.timer = setInterval(()=>{ if(this.state.current >= this.state.steps.length-1){ this.pause(); } else { this.state.current++; this.updateControls(); this.renderStep(); } }, delay); }
  pause(){ this.state.isPlaying=false; clearInterval(this.state.timer); this.state.timer=null; this.updateControls(); }
  updateControls(){
    const has = this.state.steps.length>0; this.el.prevBtn.disabled = !has || this.state.current<=0; this.el.nextBtn.disabled = !has || this.state.current>=this.state.steps.length-1; this.el.playBtn.disabled = !has; this.el.restartBtn.disabled = !has; this.el.startBtn.disabled = false; this.el.pauseBtn.style.display = this.state.isPlaying ? '' : 'none'; this.el.playBtn.style.display = this.state.isPlaying ? 'none' : ''; this.el.stepCounter.textContent = has ? `${this.state.current+1} / ${this.state.steps.length}` : '0 / 0';
  }
  renderStep(){ const step = this.state.steps[this.state.current]; if (!step) return; this.renderCurrent(step); }
  renderCurrent(step){ this.el.stepTitle.textContent = step.title; this.el.stepExplain.textContent = step.explanation; this.renderViz(step.view||this.defaultView()); this.highlightCode(step.codeLine ?? -1); }
  renderViz(view){
    const section = (label, nodes, key) => {
      const ptrMap = view.pointers || {};
      const nodeHtml = nodes.map((n, i)=>{
        const labels = Object.entries(ptrMap).filter(([k,v]) => v===`${key}-${i}` || v===n.id).map(([k])=>k);
        const cls = labels.map(l=>`hl-${l}`).join(' ');
        return `<div class="node ${cls}"><div class="label">${labels.join(' / ')}</div><div class="node-box"><div class="val">${n.value}</div><div class="ptr">next</div></div><div class="addr">${n.addr}</div></div>${i<nodes.length-1?'<div class="arrow">→</div>':'<div class="null">NULL</div>'}`;
      }).join('');
      return `<div class="list-row"><div class="list-label">${label}</div><div class="nodes">${nodes.length?nodeHtml:'<div class="muted">empty</div>'}</div></div>`;
    };
    const parts = [section('List A', view.listA || [], 'a')]; if((view.listB||[]).length || this.state.algo==='merge-sorted') parts.push(section('List B', view.listB || [], 'b')); if((view.merged||[]).length) parts.push(section('Result', view.merged, 'm'));
    this.el.vizStage.innerHTML = parts.join('');
    this.renderMemory(view);
  }
  renderMemory(view){
    const all = [];
    (view.listA||[]).forEach((n,i,arr)=>all.push({name:`A${i}`, addr:n.addr, value:n.value, next: arr[i+1]?.addr || 'NULL'}));
    (view.listB||[]).forEach((n,i,arr)=>all.push({name:`B${i}`, addr:n.addr, value:n.value, next: arr[i+1]?.addr || 'NULL'}));
    (view.merged||[]).forEach((n,i,arr)=>all.push({name:`M${i}`, addr:n.addr, value:n.value, next: arr[i+1]?.addr || 'NULL'}));
    this.el.memoryGrid.innerHTML = all.map(m=>`<div class="mem-card"><strong>${m.name}</strong><div>${m.addr}</div><div>val: ${m.value}</div><div>next: ${m.next}</div></div>`).join('');
  }
  highlightCode(line){ const lines = this.el.codeDisplay.querySelectorAll('.code-line'); lines.forEach((ln,i)=>ln.classList.toggle('active', i===line)); }
  setVizZoom(v){ this.state.vizZoom = Math.max(.7, Math.min(1.45, Math.round(v*100)/100)); this.el.vizStage.style.transform = `scale(${this.state.vizZoom})`; this.el.vizZoomLabel.textContent = `${Math.round(this.state.vizZoom*100)}%`; localStorage.setItem('ll-vizzoom', this.state.vizZoom); }
  setCodeZoom(v){ this.state.codeZoom = Math.max(.82, Math.min(1.45, Math.round(v*100)/100)); this.el.codeDisplay.style.fontSize = `${0.92*this.state.codeZoom}rem`; this.el.codeZoomLabel.textContent = `${Math.round(this.state.codeZoom*100)}%`; localStorage.setItem('ll-codezoom', this.state.codeZoom); }
  generateSteps(algo){
    const a = clone(this.state.listA), b = clone(this.state.listB); const steps = [];
    const add = (title, explanation, view, codeLine=-1) => steps.push({title, explanation, view: clone(view), codeLine});
    if(algo==='traversal'){
      const view={listA:a,listB:[],merged:[],pointers:{curr:null}}; add('Initialize','Set curr = head', view, 1); a.forEach((n,i)=> add(`Visit node ${i+1}`, `Process value ${n.value}`, {...view,pointers:{curr:`a-${i}`}}, 2)); return steps;
    }
    if(algo==='reverse'){
      const original = clone(a), reversed=[]; const view={listA:original,listB:[],merged:reversed,pointers:{prev:null,curr:'a-0',next:'a-1'}}; add('Initialize','prev = NULL, curr = head, next = NULL', view, 1);
      for(let i=0;i<original.length;i++){
        const curr = original[i]; const nxt = original[i+1];
        add('Store next', nxt?`Save next = ${nxt.value}`:'Save next = NULL', {listA:original.slice(i), listB:[], merged:reversed.slice(), pointers:{curr:`a-${i}`, next:nxt?`a-${i+1}`:null, prev: reversed.length?`m-${reversed.length-1}`:null}}, 5);
        reversed.unshift(curr);
        add('Reverse link', `Point ${curr.value} back toward previous part`, {listA:original.slice(i+1), listB:[], merged:reversed.slice(), pointers:{prev:`m-0`, curr:nxt?`a-${i+1}`:null}}, 6);
      }
      add('Complete','prev is the new head of the reversed list.', {listA:[], listB:[], merged:reversed, pointers:{}}, 10); return steps;
    }
    if(algo==='find-middle'){
      const view={listA:a,listB:[],merged:[],pointers:{slow:'a-0',fast:'a-0'}}; add('Initialize','slow and fast both start at head.', view, 1); let slow=0, fast=0; while(fast < a.length && fast+1 < a.length){ add('Move pointers','slow moves 1 step, fast moves 2 steps.', {listA:a,listB:[],merged:[],pointers:{slow:`a-${slow}`, fast:`a-${fast}`}}, 3); slow += 1; fast += 2; add('Updated positions', `slow is at ${a[slow].value}; fast ${fast<a.length?`is at ${a[fast].value}`:'reached end'}.`, {listA:a,listB:[],merged:[],pointers:{slow:`a-${slow}`, fast:fast<a.length?`a-${fast}`:null}}, 4);} add('Middle found', `Middle node is ${a[slow].value}.`, {listA:a,listB:[],merged:[],pointers:{slow:`a-${slow}`}}, 6); return steps;
    }
    if(algo==='detect-cycle'){
      const cycleStart = a.length>1?1:0; const view={listA:a,listB:[],merged:[],pointers:{slow:'a-0',fast:'a-0'}}; add('Initialize','Use Floyd’s algorithm with slow and fast pointers.', view, 1); let slow=0, fast=0; while(fast < a.length*2){ slow=(slow+1)%a.length; fast=(fast+2)%a.length; add('Move pointers', `slow -> ${a[slow].value}, fast -> ${a[fast].value}`, {listA:a,listB:[],merged:[],pointers:{slow:`a-${slow}`,fast:`a-${fast}`}}, 4); if(slow===fast){ add('Pointers meet', 'Since slow == fast, a cycle exists.', {listA:a,listB:[],merged:[],pointers:{slow:`a-${slow}`,fast:`a-${fast}`}}, 7); break; } if(steps.length>10) break; } return steps;
    }
    if(algo==='remove-nth'){
      const n=2; const view={listA:a,listB:[],merged:[],pointers:{fast:'a-0',slow:'a-0'}}; add('Initialize','Use dummy node idea; fast leads slow.', view, 2); let slow=0, fast=0; for(let i=0;i<n;i++){ fast++; add('Advance fast', `Move fast ahead to create a gap of ${n}.`, {listA:a,listB:[],merged:[],pointers:{fast:fast<a.length?`a-${fast}`:null,slow:`a-${slow}`}}, 6);} while(fast < a.length-1){ slow++; fast++; add('Move together','Move slow and fast together until fast reaches the end.', {listA:a,listB:[],merged:[],pointers:{fast:`a-${fast}`, slow:`a-${slow}`}}, 10);} const removed = a.splice(slow+1,1)[0]; add('Delete node', `Remove node ${removed?.value ?? ''}.`, {listA:a,listB:[],merged:[],pointers:{slow:`a-${slow}`}}, 15); return steps;
    }
    if(algo==='merge-sorted'){
      const merged=[]; let i=0,j=0; add('Initialize','Create a dummy/tail pointer and compare both list heads.', {listA:a,listB:b,merged,pointers:{curr:a[0]?.id, next:b[0]?.id}}, 3);
      while(i<a.length && j<b.length){ if(a[i].value <= b[j].value){ merged.push(a[i]); add('Take from List A', `${a[i].value} is smaller or equal, so attach it to the result.`, {listA:a.slice(i),listB:b.slice(j),merged:merged.slice(),pointers:{curr:`a-${i}`, next:`b-${j}`}}, 7); i++; } else { merged.push(b[j]); add('Take from List B', `${b[j].value} is smaller, so attach it to the result.`, {listA:a.slice(i),listB:b.slice(j),merged:merged.slice(),pointers:{curr:`a-${i}`, next:`b-${j}`}}, 10); j++; } }
      while(i<a.length){ merged.push(a[i]); add('Attach remaining A', `List B is done, attach ${a[i].value}.`, {listA:a.slice(i),listB:b.slice(j),merged:merged.slice(),pointers:{curr:`a-${i}`}}, 15); i++; }
      while(j<b.length){ merged.push(b[j]); add('Attach remaining B', `List A is done, attach ${b[j].value}.`, {listA:a.slice(i),listB:b.slice(j),merged:merged.slice(),pointers:{next:`b-${j}`}}, 16); j++; }
      add('Complete','Merged list is fully built.', {listA:[],listB:[],merged,pointers:{}}, 18); return steps;
    }
    if(algo==='palindrome'){
      let slow=0, fast=0; add('Find middle','Move slow/fast to reach the midpoint.', {listA:a,listB:[],merged:[],pointers:{slow:'a-0',fast:'a-0'}}, 2); while(fast<a.length && fast+1<a.length){ slow++; fast+=2; add('Advance pointers', `slow=${a[slow].value}, fast ${fast<a.length?`=${a[fast].value}`:'reached end'}`, {listA:a,listB:[],merged:[],pointers:{slow:`a-${slow}`,fast:fast<a.length?`a-${fast}`:null}}, 4); }
      const second = a.slice(slow).reverse(); add('Reverse second half','Reverse the second half in-place for comparison.', {listA:a.slice(0,slow),listB:second,merged:[],pointers:{}}, 8); let ok=true; for(let i=0;i<second.length;i++){ if(a[i].value !== second[i].value) ok=false; add('Compare halves', `${a[i].value} ${a[i].value===second[i].value?'matches':'does not match'} ${second[i].value}.`, {listA:a.slice(0,slow),listB:second,pointers:{curr:`a-${i}`,next:`b-${i}`}}, 17); } add('Result', ok?'The list is a palindrome.':'The list is not a palindrome.', {listA:a,listB:[],merged:[],pointers:{}}, 24); return steps;
    }
    if(algo==='reverse-k-group'){
      const k=2; const groups=[]; for(let i=0;i<a.length;i+=k) groups.push(a.slice(i,i+k)); const result=[]; add('Group nodes', `Split the list into chunks of ${k}.`, {listA:a,listB:[],merged:[],pointers:{}}, 2); groups.forEach((g,idx)=>{ if(g.length===k){ result.push(...g.slice().reverse()); add(`Reverse group ${idx+1}`, `Reverse this full group of ${k} nodes.`, {listA:g,listB:[],merged:result.slice(),pointers:{}}, 12);} else { result.push(...g); add('Leave remainder', 'Remaining nodes smaller than k stay as-is.', {listA:g,listB:[],merged:result.slice(),pointers:{}}, 18);} }); add('Complete','All groups processed.', {listA:[],listB:[],merged:result,pointers:{}}, 20); return steps;
    }
    if(algo==='copy-random'){
      add('Interleave copies','Insert copied nodes between original nodes.', {listA:a,listB:[],merged:[],pointers:{}}, 3); add('Copy random pointers','Use interleaved structure to connect random pointers.', {listA:a,listB:[],merged:[],pointers:{}}, 12); add('Split lists','Detach original and copied lists.', {listA:a,listB:clone(a),merged:[],pointers:{}}, 21); return steps;
    }
    return [{title:'Ready', explanation:'No visual steps defined yet.', view:this.defaultView(), codeLine:-1}];
  }
}

function clone(x){ return JSON.parse(JSON.stringify(x)); }
function escapeHtml(s){ return (s||'').replace(/[&<>]/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;' }[m])); }
function formatCode(code){ return escapeHtml(code).split('\n').map((line,i)=>`<span class="code-line">${line || ' '}</span>`).join('\n'); }

document.addEventListener('DOMContentLoaded', ()=> new LinkedListApp());
