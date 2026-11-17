(function(){
  /* ascii name */
  const art=[
    '  ____  ___   _ _  _ ___ ___ _    ___   _   ___ _    ___ ',
    ' /  \\ \\/ / | | | \\| | _ \\ __| |  |_ _| /_\\ | _ ) |  | __|',
    '| () >  <| |_| | .` |   / _|| |__ | | / _ \\| _ \\ |__| _| ',
    ' \\__/_/\\_\\\\___/|_|\\_|_|_\\___|____|___/_/ \\_\\___/____|___|'
  ].join('\n');
  const asciiEl=document.getElementById('ascii');
  asciiEl.textContent=art;

  /* glitch the ascii on click + occasionally */
  function glitch(){asciiEl.classList.remove('glitch');void asciiEl.offsetWidth;asciiEl.classList.add('glitch');}
  asciiEl.addEventListener('click',glitch);
  setInterval(()=>{if(Math.random()>0.6)glitch();},6000);

  /* every build i actually ship */
  const repos={
    ghostesp:'https://github.com/0xunreliable/GhostESP',
    deskbuddy:'https://github.com/0xunreliable/ESP32-DeskBuddy',
    riggsware:'https://riggsware.pages.dev',
    riggbox:'https://github.com/0xunreliable/riggbox',
    'wardrive-map':'https://github.com/0xunreliable/wardrive-map'
  };

  /* boot sequence + progress bar */
  const lines=[
    '[ ok ] mounting /dev/esp32 ...',
    '[ ok ] loading kernel: linux 6.12.4-arch1 (btw)',
    '[ ok ] starting service: riggsware.service',
    '[ ok ] attaching /dev/ttyUSB0 ──> ghostesp.bin',
    '[ ok ] wardriving: capture buffer 4096 frames',
    '[ ok ] loading models: llama.cpp · local only',
    '[ ok ] resolving identity ... 0xunreliable',
    '',
    'welcome. booting portfolio shell ...'
  ];
  const pre=document.getElementById('bootpre');
  const bootBar=document.getElementById('bootBar');
  const bootPct=document.getElementById('bootPct');
  let i=0;
  (function next(){
    if(i<lines.length){
      pre.textContent+=lines[i]+'\n';i++;
      const p=Math.round((i/lines.length)*100);
      bootBar.style.width=p+'%';bootPct.textContent=p+'%';
      setTimeout(next,150);
    } else { bootBar.style.width='100%';bootPct.textContent='100%';setTimeout(finish,420); }
  })();
  function finish(){
    document.getElementById('boot').classList.add('done');
    document.body.classList.remove('boot');
    const blks=[...document.querySelectorAll('#term .blk')];
    blks.forEach((b,k)=>setTimeout(()=>{b.classList.add('in');},k*220));
    typeRole();
    setTimeout(animateBars,700);
  }

  /* live clock + uptime in title bar + neofetch uptime */
  const startTime=Date.now();
  const clockEl=document.getElementById('clock');
  const nfUptime=document.getElementById('nfUptime');
  function fmtUptime(ms){
    const s=Math.floor(ms/1000);const h=Math.floor(s/3600);const m=Math.floor((s%3600)/60);const ss=s%60;
    if(h)return h+'h '+m+'m '+ss+'s';if(m)return m+'m '+ss+'s';return ss+'s';
  }
  function tick(){
    const now=new Date();
    const t=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
    if(clockEl)clockEl.innerHTML='🕐 '+t+' <span class="up">· up '+fmtUptime(Date.now()-startTime)+'</span>';
    if(nfUptime)nfUptime.textContent=fmtUptime(Date.now()-startTime);
  }
  setInterval(tick,1000);tick();

  /* animated skill bars */
  function animateBars(){
    document.querySelectorAll('#skillBars .bar-track').forEach(track=>{
      const pct=parseInt(track.getAttribute('data-pct'),10);
      const total=18;const target=Math.round(pct/100*total);let cur=0;
      const iv=setInterval(()=>{
        cur++;
        track.innerHTML='<b>'+'█'.repeat(cur)+'</b>'+'░'.repeat(total-cur);
        if(cur>=target)clearInterval(iv);
      },45);
    });
  }

  /* typed role */
  const roles=['ethical hacker by passion','embedded systems tinkerer','esp32 firmware gremlin','software engineer','founder @ riggsware','local compute enjoyer','web + ecommerce builder'];
  let ri=0,ci=0,del=false;const rEl=document.getElementById('role');
  function typeRole(){
    const c=roles[ri];rEl.textContent=c.substring(0,ci);
    if(!del&&ci<c.length){ci++;setTimeout(typeRole,60);}
    else if(!del&&ci===c.length){del=true;setTimeout(typeRole,1500);}
    else if(del&&ci>0){ci--;setTimeout(typeRole,28);}
    else{del=false;ri=(ri+1)%roles.length;setTimeout(typeRole,260);}
  }

  /* project rows clickable */
  document.querySelectorAll('.proj[data-href]').forEach(r=>{
    r.addEventListener('click',()=>window.open(r.dataset.href,'_blank','noopener'));
  });

  /* ===== mode switch: terminal loader morphs into clean loader ===== */
  const loader=document.getElementById('loader');
  const loaderTerm=document.getElementById('loaderTerm');
  const lcBar=document.getElementById('lcBar');
  const toExec=document.getElementById('toExec');
  const toTerm=document.getElementById('toTerm');
  const toDesign=document.getElementById('toDesign');
  const toDesign2=document.getElementById('toDesign2');
  let switching=false;
  const savedView=localStorage.getItem('view')||'term';
  let currentView=savedView;
  if(savedView!=='term')document.body.classList.add('view-'+savedView);
  const bootLines=['$ ./build --target simple','> compiling views ...','> bundling assets ...','> optimizing layout ...','> done. launching.'];
  function switchView(target){
    if(switching)return;
    if(target===currentView)return;
    if(target==='design' || currentView==='design'){
      if(target==='design'){
        document.body.classList.toggle('from-exec', currentView==='exec');
        localStorage.setItem('lastView', currentView);
      }
      document.body.classList.remove('view-exec','view-design');
      if(target!=='term')document.body.classList.add('view-'+target);
      localStorage.setItem('view',target);
      currentView=target;window.scrollTo(0,0);return;
    }
    switching=true;currentView=target;
    loader.className='loader on';loaderTerm.textContent='';lcBar.style.width='0%';
    let i=0;
    (function typeLine(){
      if(i<bootLines.length){loaderTerm.textContent+=bootLines[i]+'\n';i++;setTimeout(typeLine,170);}
      else setTimeout(morph,360);
    })();
    function morph(){
      loader.classList.add('to-clean');
      requestAnimationFrame(()=>requestAnimationFrame(()=>{lcBar.style.width='100%';}));
      setTimeout(()=>{
        document.body.classList.remove('view-exec','view-design');
        if(target!=='term')document.body.classList.add('view-'+target);
        localStorage.setItem('view',target);window.scrollTo(0,0);
        loader.classList.add('fade');
        setTimeout(()=>{loader.className='loader';switching=false;},520);
      },1050);
    }
  }
  if(toExec)toExec.addEventListener('click',()=>switchView('exec'));
  if(toTerm)toTerm.addEventListener('click',()=>switchView('term'));
  if(toDesign)toDesign.addEventListener('click',()=>switchView('design'));
  if(toDesign2)toDesign2.addEventListener('click',(e)=>{e.preventDefault();switchView('design');});
  document.querySelectorAll('.designBackBtn').forEach(b=>{
    b.addEventListener('click',(e)=>{e.preventDefault();switchView(localStorage.getItem('lastView')||'term');});
  });

  /* ===== designs gallery & lightbox ===== */
  const dgGridTerm=document.getElementById('dgGridTerm');
  const dgGridExec=document.getElementById('dgGridExec');
  const lb=document.getElementById('lb');
  const lbImg=document.getElementById('lbImg');
  const lbClose=document.getElementById('lbClose');
  const lbPrev=document.getElementById('lbPrev');
  const lbNext=document.getElementById('lbNext');
  const lbCount=document.getElementById('lbCount');
  let lbIdx=0;let dImgs=[];
  if(dgGridTerm || dgGridExec){
    for(let i=1;i<=14;i++)dImgs.push(i);
    dImgs.sort(()=>Math.random()-0.5);
    let html='';
    dImgs.forEach((num,i)=>{
      html+=`<a href="#" class="dg-item" data-idx="${i}"><img src="/static/images/designs/${num}.png" alt="Design ${num}" loading="lazy"><div class="cap">Design ${num}</div></a>`;
    });
    if(dgGridTerm) dgGridTerm.innerHTML=html;
    if(dgGridExec) dgGridExec.innerHTML=html;
    document.querySelectorAll('.dg-item').forEach(el=>{
      el.addEventListener('click',e=>{e.preventDefault();lbIdx=parseInt(el.getAttribute('data-idx'));openLb();});
    });
  }
  function openLb(){updateLb();lb.classList.add('on');setTimeout(()=>lb.classList.add('show'),10);}
  function closeLb(){lb.classList.remove('show');setTimeout(()=>lb.classList.remove('on'),300);}
  function updateLb(){lbImg.src=`/static/images/designs/${dImgs[lbIdx]}.png`;lbCount.textContent=`${lbIdx+1} / ${dImgs.length}`;}
  if(lbClose)lbClose.addEventListener('click',closeLb);
  if(lbPrev)lbPrev.addEventListener('click',()=>{lbIdx=(lbIdx-1+dImgs.length)%dImgs.length;updateLb();});
  if(lbNext)lbNext.addEventListener('click',()=>{lbIdx=(lbIdx+1)%dImgs.length;updateLb();});
  if(lb)lb.addEventListener('click',e=>{if(e.target===lb)closeLb();});
  document.addEventListener('keydown',e=>{
    if(lb && lb.classList.contains('on')){
      if(e.key==='Escape')closeLb();
      if(e.key==='ArrowLeft'){lbIdx=(lbIdx-1+dImgs.length)%dImgs.length;updateLb();}
      if(e.key==='ArrowRight'){lbIdx=(lbIdx+1)%dImgs.length;updateLb();}
    }
  });

  /* ===== interactive console ===== */
  const con=document.getElementById('console'),clog=document.getElementById('clog'),cin=document.getElementById('cin');
  const hist=[];let hp=-1;let mtx=null;
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function print(html){const d=document.createElement('div');d.className='res';d.innerHTML=html;clog.appendChild(d);con.scrollTop=con.scrollHeight;}
  function echo(cmd){const d=document.createElement('div');d.className='echo';d.innerHTML='<span class="ps1">0x@riggsware</span>:~$ '+esc(cmd);clog.appendChild(d);}

  /* print lines progressively (for hack / sl etc) */
  function typeOut(arr,delay){
    let k=0;
    (function n(){ if(k<arr.length){print(arr[k]);k++;setTimeout(n,delay||120);} })();
  }

  const cmds={
    help:()=>'available commands:\n  <span class="ok">about</span>      who is 0xunreliable\n  <span class="ok">skills</span>     languages + tooling\n  <span class="ok">projects</span>   list builds (open with: open &lt;name&gt;)\n  <span class="ok">experience</span> work history + the lab\n  <span class="ok">contact</span>    ways to reach me\n  <span class="ok">neofetch</span>   system info\n  <span class="ok">riggsware</span>  the studio\n  <span class="ok">theme</span>      green / amber phosphor\n  <span class="ok">clear</span>      wipe the screen\n  <span class="warn">esp32 · wardrive · ai · tools · coffee · sudo · matrix · hack · cowsay · banner · history · weather · sl · echo · date</span>  (✨ fun)\n  <span class="dim"># psst: there\'s a hidden konami code 🎮</span>',
    about:()=>'0xunreliable — ethical hacker by passion, software engineer by trade.\ni take electronics apart, flash esp32s, and ship web + ecommerce stores through riggsware.\nbreak it, understand it, build it properly.',
    skills:()=>'languages  c · c++ · python · rust · zig · odin · typescript · kotlin\nweb        svelte · vue · javascript · html · css\nembedded   esp-idf (espressif) · arduino-ide · esp32\nsecurity   nmap · wireshark · burp suite · john the ripper\nbase       arch linux · foot · zsh · docker',
    projects:()=>'<span class="ok">ghostesp</span>      esp32 wifi deauth + wardriving firmware\n<span class="ok">deskbuddy</span>     esp32 desk companion · 0.96" oled\n<span class="ok">riggsware</span>     web + ecommerce studio\n<span class="ok">riggbox</span>       self-hosted inference box (local models)\n<span class="ok">wardrive-map</span>  every ssid i\'ve ever heard, on a map\n\ntip: <span class="warn">open &lt;name&gt;</span> to launch a repo.',
    experience:()=>'2024–now  founder · web &amp; ecommerce @ riggsware\n2023–now  embedded &amp; offensive security r&amp;d @ the lab\n2023–24   software engineer @ freelance / contract\nongoing   b.sc. software engineering',
    contact:()=>'email      <a href="mailto:root@0xunreliable.dev">root@0xunreliable.dev</a>\ngithub     <a href="https://github.com/0xunreliable" target="_blank" rel="noopener noreferrer">@0xunreliable</a>\nx          <a href="https://x.com/0xunreliable" target="_blank" rel="noopener noreferrer">@0xunreliable</a>\nriggsware  <a href="https://riggsware.pages.dev" target="_blank" rel="noopener noreferrer">riggsware.pages.dev</a>',
    date:()=>new Date().toString(),
    whoami:()=>'0xunreliable',
    ls:()=>'about  skills  projects  experience  contact  tools',
    pwd:()=>'/home/0x/portfolio',
    repo:()=>{window.open('https://github.com/0xunreliable','_blank','noopener');return 'opening <span class="ok">github.com/0xunreliable</span> ...';},
    social:()=>'github     <a href="https://github.com/0xunreliable" target="_blank" rel="noopener noreferrer">@0xunreliable</a>\nx          <a href="https://x.com/0xunreliable" target="_blank" rel="noopener noreferrer">@0xunreliable</a>\nriggsware  <a href="https://riggsware.pages.dev" target="_blank" rel="noopener noreferrer">riggsware.pages.dev</a>',
    riggsware:()=>{window.open('https://riggsware.pages.dev','_blank','noopener');return 'opening <span class="ok">riggsware.pages.dev</span> — web &amp; ecommerce studio ...'},
    open:(a)=>{
      const k=(a[0]||'').toLowerCase();
      if(repos[k]){window.open(repos[k],'_blank','noopener');return 'opening <span class="ok">'+esc(k)+'</span> ...';}
      return '<span class="warn">usage: open &lt;ghostesp|deskbuddy|riggsware|riggbox|wardrive-map&gt;</span>';
    },
    tools:()=>'terminal   foot + zsh + tmux\nos         arch linux (btw)\nnetwork    nmap · wireshark\ncracking   john the ripper\nweb        burp suite\nembedded   esp-idf · arduino-ide · esptool\ndocs       whatever the datasheet says',
    coffee:()=>'    ( (\n     ) )\n  ........\n  |      |]   brewing... ☕ stay caffeinated.\n  \\      /\n   `----\'',
    sudo:(a)=>'<span class="err">0x is not in the sudoers file. this incident will be reported.</span> 😈',
    matrix:()=>{startMatrix();return '<span class="ok">wake up... entering the matrix. (press any key)</span>';},
    echo:(a)=>a.length?esc(a.join(' ')):'',
    neofetch:()=>'<span class="cyn">  .--.</span>      <span class="ok">0xunreliable</span>@<span class="ok">arch</span>\n<span class="cyn"> |o_o |</span>     ----------------\n<span class="cyn"> |:_/ |  &lt;/&gt;</span>  <span class="grn">os</span>      : Arch Linux x86_64\n<span class="cyn">//   \\ \\</span>   <span class="grn">kernel</span>  : 6.12.4-arch1-1\n<span class="cyn">(|   | )</span>    <span class="grn">shell</span>   : zsh 5.9 · foot\n<span class="cyn">/\'\\_ _/`\\</span>   <span class="grn">stack</span>   : c/c++ · rust · zig · ts\n<span class="cyn">\\___)=(__/</span>  <span class="grn">status</span>  : ● available for work\n             <span class="grn">coffee</span>  : <span class="ok">████████</span><span class="dim">░░</span> 80%',
    theme:()=>{const amber=document.body.classList.toggle('amber');localStorage.setItem('theme',amber?'amber':'green');return amber?'<span class="ok">amber phosphor enabled.</span>':'<span class="ok">green phosphor enabled.</span>';},
    history:()=>hist.length?hist.slice().reverse().map((h,i)=>'  '+(i+1)+'  '+esc(h)).join('\n'):'<span class="dim">no history yet.</span>',
    banner:()=>'<span class="grn">  ____  ___   _ _  _ ___ ___ _    ___   _   ___ _    ___ \n /  \\ \\/ / | | | \\| | _ \\ __| |  |_ _| /_\\ | _ ) |  | __|\n| () >  <| |_| | .` |   / _|| |__ | | / _ \\| _ \\ |__| _| \n \\__/_/\\_\\\\___/|_|\\_|_|_\\___|____|___/_/ \\_\\___/____|___|</span>',
    cowsay:(a)=>{const msg=a.length?a.join(' '):'moo! hire 0xunreliable 🐄';const top=' '+'_'.repeat(msg.length+2);const bot=' '+'-'.repeat(msg.length+2);return esc(top)+'\n&lt; '+esc(msg)+' &gt;\n'+esc(bot)+'\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||';},
    weather:()=>{const w=['the lab: 21°C, fan noise 62%, three esp32s on the desk','the lab: 24°C, one board flashing, one board smoking','the lab: 19°C, rainy — perfect weather for teardowns','the lab: 26°C, monitor mode active, do not touch the antenna'];return w[Math.floor(Math.random()*w.length)];},
    hack:()=>{typeOut(['<span class="grn">[*] initializing exploit framework...</span>','<span class="grn">[*] scanning ports... 22 80 443 open</span>','<span class="yel">[+] bypassing firewall...</span>','<span class="yel">[+] injecting payload... 38%... 71%... 100%</span>','<span class="ok">[✓] access granted. relax 😄 — i break things with a signed scope.</span>'],260);return null;},
    esp32:()=>{typeOut(['<span class="grn">[*] esptool.py --chip esp32 --port /dev/ttyUSB0 write_flash 0x0 ghostesp.bin</span>','<span class="dim">[*] connecting..............</span>','<span class="yel">[+] chip is ESP32-D0WD-V3 (rev 3) · 240mhz · 4mb flash</span>','<span class="yel">[+] mac 24:0a:c4:xx:xx:xx · writing 1,048,576 bytes</span>','<span class="ok">[✓] hash of data verified. hard reset.</span>','<span class="grn">[*] boot: ghostesp · monitor mode · hopping 1-13</span>'],320);return null;},
    wardrive:()=>{typeOut(['<span class="grn">[*] wlan0 ──> monitor mode .......... ok</span>','<span class="dim">[*] hopping 1-13 @ 400ms · capture buffer 4096</span>','<span class="yel">[+] 812 unique ssids · 1,204 clients observed</span>','<span class="ok">[✓] gps lock · writing ./captures/wardrive-2026-11-15.csv</span>'],300);return null;},
    ai:()=>'i don\'t like ai much. i use it out of peer pressure and because i\'m lazy.\nmodels run on my own box (<span class="ok">riggbox</span>) — nothing leaves the rack.\nagents: <span class="ok">opencode</span> · <span class="ok">claude code</span> · <span class="ok">pi</span> (cloud + local)',
    sl:()=>'      ====        ________\n  _D _|  |_______/        \\__\nch choo!  |  |  ___   ___ \'  |\n  |_______|_|___|___|___|__|\n   choo choo 🚂  (you typed `sl` instead of `ls`)',
    exit:()=>'<span class="warn">nice try — you can\'t escape a portfolio this cool. 😎</span>',
    'rm':(a)=>a.join(' ').includes('-rf')?'<span class="err">whoa! permission denied. that\'s how careers end. 🛑</span>':'<span class="err">rm: missing operand</span>',
    clear:()=>{clog.innerHTML='';return null;}
  };
  const alias={proj:'projects',exp:'experience',work:'projects',cls:'clear',man:'help','?':'help',gh:'repo',esp:'esp32',deauth:'esp32',wardriving:'wardrive'};
  function run(raw){
    const line=raw.trim();if(!line){echo('');return;}
    echo(line);
    const parts=line.split(/\s+/);let name=parts[0].toLowerCase();const args=parts.slice(1);
    if(alias[name])name=alias[name];
    const fn=cmds[name];
    if(!fn){print('<span class="err">command not found: '+esc(parts[0])+'</span> — type <span class="ok">help</span>');return;}
    const out=fn(args);if(out!==null&&out!==undefined&&out!=='')print(out);
  }
  cin.addEventListener('keydown',e=>{
    if(e.key==='Enter'){const v=cin.value;if(v.trim())hist.unshift(v);hp=-1;cin.value='';run(v);}
    else if(e.key==='ArrowUp'){if(hist.length){hp=Math.min(hp+1,hist.length-1);cin.value=hist[hp];setTimeout(()=>cin.setSelectionRange(cin.value.length,cin.value.length),0);}e.preventDefault();}
    else if(e.key==='ArrowDown'){if(hp>0){hp--;cin.value=hist[hp];}else{hp=-1;cin.value='';}e.preventDefault();}
    else if(e.key==='Tab'){e.preventDefault();const p=cin.value.toLowerCase();const hit=Object.keys(cmds).find(c=>c.startsWith(p)&&p);if(hit)cin.value=hit;}
  });
  con.addEventListener('click',()=>cin.focus());

  /* restore saved phosphor theme */
  if(localStorage.getItem('theme')==='amber')document.body.classList.add('amber');

  /* konami code easter egg */
  const konami=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kpos=0;
  document.addEventListener('keydown',e=>{
    const k=e.key.length===1?e.key.toLowerCase():e.key;
    if(k===konami[kpos]){kpos++;if(kpos===konami.length){kpos=0;partyMode();}}
    else{kpos=(k===konami[0])?1:0;}
  });
  function partyMode(){
    let n=0;const iv=setInterval(()=>{
      const hue=(n*40)%360;
      document.documentElement.style.setProperty('--grn','hsl('+hue+',70%,45%)');
      document.documentElement.style.setProperty('--cyn','hsl('+((hue+120)%360)+',70%,45%)');
      document.documentElement.style.setProperty('--mag','hsl('+((hue+240)%360)+',70%,50%)');
      n++;if(n>40){clearInterval(iv);document.documentElement.style.removeProperty('--grn');document.documentElement.style.removeProperty('--cyn');document.documentElement.style.removeProperty('--mag');}
    },80);
    glitch();
  }

  /* matrix easter egg */
  function startMatrix(){
    if(mtx)return;
    const cv=document.createElement('canvas');cv.style.cssText='position:fixed;inset:0;z-index:300;background:#000';document.body.appendChild(cv);
    const ctx=cv.getContext('2d');let W,H,cols,drops;
    function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;cols=Math.floor(W/14);drops=Array(cols).fill(1);}
    size();const ch='アイウエオカキクケコサシスセソｱｲｳ01<>{}[];=$#'.split('');
    mtx=setInterval(()=>{ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#38f57f';ctx.font='14px monospace';
      drops.forEach((y,i)=>{const t=ch[Math.floor(Math.random()*ch.length)];ctx.fillText(t,i*14,y*14);if(y*14>H&&Math.random()>.975)drops[i]=0;drops[i]++;});},55);
    const stop=()=>{clearInterval(mtx);mtx=null;cv.remove();removeEventListener('keydown',stop);removeEventListener('click',stop);};
    addEventListener('keydown',stop);setTimeout(()=>addEventListener('click',stop),300);
  }
})();
