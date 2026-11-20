(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const dokudamiSvg = () => `<svg class="dokudami-svg" viewBox="0 0 100 130" aria-hidden="true"><path d="M50 128 C47 102 53 80 50 54" stroke="#3e7d3a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M51 106 C39 90 22 94 24 109 C26 122 43 127 51 118 C59 127 76 122 78 109 C80 94 63 90 51 106 Z" fill="#57a047"/><ellipse cx="50" cy="42" rx="13" ry="6" fill="#ffffff" stroke="#cfd8c8"/><ellipse cx="33" cy="47" rx="13" ry="6" transform="rotate(-28 33 47)" fill="#ffffff" stroke="#cfd8c8"/><ellipse cx="67" cy="47" rx="13" ry="6" transform="rotate(28 67 47)" fill="#ffffff" stroke="#cfd8c8"/><ellipse cx="50" cy="55" rx="16" ry="7" fill="#ffffff" stroke="#cfd8c8"/><rect x="45" y="8" width="10" height="34" rx="5" fill="#ecc94b"/><circle cx="50" cy="16" r="1.6" fill="#c9a227"/><circle cx="48" cy="24" r="1.6" fill="#c9a227"/><circle cx="52" cy="31" r="1.6" fill="#c9a227"/></svg>`;
  const garden = $("garden");
  if (garden) {
    for (let i=0;i<26;i++) {
      const el=document.createElement("div");
      el.className="garden-leaf";
      el.innerHTML=dokudamiSvg();
      el.style.left=(Math.random()*100)+"%";
      el.style.top=(Math.random()*100)+"%";
      el.style.animationDelay=(-Math.random()*5)+"s";
      el.style.transform="scale("+(0.45+Math.random()*0.85)+")";
      garden.appendChild(el);
    }
  }

  const diceTransforms = ["rotateX(0deg) rotateY(0deg)","rotateX(0deg) rotateY(-90deg)","rotateX(-90deg) rotateY(0deg)","rotateX(90deg) rotateY(0deg)","rotateX(0deg) rotateY(90deg)","rotateX(0deg) rotateY(180deg)"];
  function buildDice(el) {
    if(!el) return;
    const patterns = {1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
    el.innerHTML="";
    [1,2,3,4,5,6].forEach((v)=>{
      const f=document.createElement("div");
      f.className="dface fv"+v;
      for(let i=0;i<9;i++){const c=document.createElement("span");if(patterns[v].indexOf(i)>=0)c.className="pip";f.appendChild(c);}
      el.appendChild(f);
    });
    el.style.transform=diceTransforms[0];
  }
  function tumbleDice(el, finalN, done) {
    if(!el){done(finalN);return;}
    el.classList.add("tumbling");
    let ticks=0;
    const timer=setInterval(()=>{
      el.style.transform=diceTransforms[Math.floor(Math.random()*6)];
      ticks++;
      if(ticks>=9){clearInterval(timer);el.classList.remove("tumbling");el.style.transform=diceTransforms[finalN-1];done(finalN);}
    },70);
  }
  function bounceBack(pos, last) { return pos>last ? last-(pos-last) : pos; }
  function sproutDokudami() {
    const layer=$("boardGarden");
    if(!layer) return;
    if(layer.childElementCount>=30) return;
    const el=document.createElement("div");
    el.className="board-sprout";
    el.innerHTML=dokudamiSvg();
    el.style.left=(Math.random()*93)+"%";
    el.style.top=(Math.random()*90)+"%";
    el.style.setProperty("--s",(0.3+Math.random()*0.5).toFixed(2));
    layer.appendChild(el);
  }
  function seedDokudami() {
    const layer=$("boardGarden");
    if(!layer) return;
    const spots=[[1,3],[90,2],[2,88],[91,86],[44,1],[58,93],[96,45],[0,50]];
    spots.forEach((sp)=>{
      const el=document.createElement("div");
      el.className="board-sprout seed";
      el.innerHTML=dokudamiSvg();
      el.style.left=sp[0]+"%";
      el.style.top=sp[1]+"%";
      el.style.setProperty("--s",(0.4+Math.random()*0.35).toFixed(2));
      layer.appendChild(el);
    });
  }
  function drawRoute(board) {
    if(!board) return;
    const cells=board.querySelectorAll(".board-cell:not(.flower-cell)");
    if(cells.length<2) return;
    let svg=board.querySelector(".route-svg");
    if(!svg){
      svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
      svg.setAttribute("class","route-svg");
      svg.setAttribute("aria-hidden","true");
      board.insertBefore(svg, board.firstChild);
    }
    const br=board.getBoundingClientRect();
    if(board.clientWidth===0) return;
    svg.setAttribute("viewBox",`0 0 ${board.clientWidth} ${board.clientHeight}`);
    const pts=[];
    cells.forEach((c)=>{ const r=c.getBoundingClientRect(); pts.push([r.left-br.left+r.width/2, r.top-br.top+r.height/2]); });
    let d=`M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for(let i=1;i<pts.length-1;i++){
      const mx=(pts[i][0]+pts[i+1][0])/2, my=(pts[i][1]+pts[i+1][1])/2;
      d+=` Q ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }
    d+=` L ${pts[pts.length-1][0].toFixed(1)} ${pts[pts.length-1][1].toFixed(1)}`;
    svg.innerHTML=`<path d="${d}" fill="none" stroke="#7da574" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" opacity="0.25"/><path d="${d}" fill="none" stroke="#fffdf7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.55" stroke-dasharray="0.1 17"/>`;
  }

  const jobSpaces = [
    ["START","🌱","就活スタート",""],
    ["自己分析","🪞","自分の好きなこと・得意なこと・大切にしたいことを発表してみよう",""],
    ["価値観","💎","仕事で大切にしたいことを5つ挙げてみよう",""],
    ["過去の経験","📖","頑張ったこと・失敗したことから、自分の強みを見つけよう",""],
    ["周りの人に聞く","👂","自分はどんな人か、意外な発見があるかも？",""],
    ["志望動機","🎯","志望動機を、自分の言葉で説明してみよう",""],
    ["身だしなみ","👔","今日の身だしなみを緊急チェック！",""],
    ["求人票","🔎","一番重視したいポイントは？ 理由を言えたら1マスすすむ","plusChoice"],
    ["ハプニング","💥","応募書類で書き間違い！ 1回休み","skip"],
    ["自己PR","🎤","15秒間で「自己PR」を言ってみよう",""],
    ["逆質問","❓","面接の最後に「何か質問はありますか？」と聞かれたら、何を聞いてみたい？",""],
    ["緊張対策","🌿","面接で緊張したとき、自分を落ち着かせる方法は？",""],
    ["ニュース","📰","「最近気になったニュースは？」と聞かれたら、何と答える？",""],
    ["スーツ準備","👕","面接に着ていくスーツやオフィスカジュアル、準備できてる？","suitChoice"],
    ["ひとやすみ","🍰","就活の息抜きに食べたい「ご褒美スイーツ」は？",""],
    ["相談ボーナス","🌼","支援員さんに相談して悩みがスッキリ！","roulette"],
    ["気持ちの切り替え","🔄","もし不採用の通知が来ても大丈夫。どうやって気持ちを切り替える？",""],
    ["内定の報告","📞","内定をもらったら、一番最初に誰に報告したい？",""],
    ["初給料","💴","働き始めて「最初のお給料」をもらったら、何に使いたい？",""],
    ["応援の言葉","💌","今日一緒にすごろくをやったメンバーに、応援の言葉を一言！",""],
    ["優しい言葉","🕊️","落ち込んだとき、自分にかけたい「優しい言葉」は？",""],
    ["憧れの人","⭐","将来「こんな人になりたいな」という憧れの人はいる？",""],
    ["GOAL","🏁","ゴール！",""]
  ];
  const uraMode = new URLSearchParams(location.search).get("mode")==="dokudami";
  const jobSpacesUra = [
    ["START","🌱","通所開始。じゃんけんの前に『まず自己紹介から★』と30分の近況確認が始まる",""],
    ["自己分析","🪞","発表したら『干渉されたくないくせに』と勝手にラベリングされる",""],
    ["価値観","💎","5つ発表したら、1つが『社会人としての義務』にすり替えられている",""],
    ["過去の経験","📖","失敗談を話したら説教の材料にされる。次回から報告義務が発生",""],
    ["周りの人に聞く","👂","聞いてもないのに『お母様に共有しました😊』",""],
    ["志望動機","🎯","深堀したら『何のために練習するんだっけ？理解したー？』の詰問ラッシュ",""],
    ["身だしなみ","👔","5分遅刻でグチグチ言われる。なお愛用PCは先客に奪われている",""],
    ["求人票","🔎","答えたら『タイピングスコアも報告しろ😊』と追加クエスト発生","plusChoice"],
    ["ハプニング","💥","応募書類ではなく、通所記録の1文字ミスを30分確認される。1回休み","skip"],
    ["自己PR","🎤","言い終わったら『どこで話変わっちゃったんですかー？』。計測からやり直し",""],
    ["逆質問","❓","質問したら『逃げているように思えます』と人格否定が返ってくる",""],
    ["緊張対策","🌿","落ち着く方法を答えたら『祝日も来い😊』の一言で緊張が戻る",""],
    ["ニュース","📰","答えたら『長期就労サポート😊』の綺麗な言葉で午前通所を勧められる",""],
    ["スーツ準備","👕","『はい』と答えたら『じゃあ明日も来られるね😊』で休みが消える","suitChoice"],
    ["ひとやすみ","🍰","ご褒美スイーツを答えたら『体力課題改善😊』と息抜き自体が課題化される",""],
    ["相談ボーナス","🌼","支援員に相談してみた。結果はルーレットしだい","roulette"],
    ["気持ちの切り替え","🔄","答えたら『振替通所しろ😊』。切り替える暇がない",""],
    ["内定の報告","📞","答えたら、母親へのチクりLINEが先に送信されている",""],
    ["初給料","💴","使い道を答えたら『年金事務所15時なら午前中通所しろ』と迫られる",""],
    ["応援の言葉","💌","言ったら『素敵な社会人になれますように』と薄い言葉で返される",""],
    ["優しい言葉","🕊️","かけたら『だれもしたくありません』と被害者ムーブ発動",""],
    ["憧れの人","⭐","答えたら『いる間しか支援できません』と卒業を急かされる",""],
    ["GOAL","🏁","真のゴール",""]
  ];
  const jobBoardSpaces = uraMode ? jobSpacesUra : jobSpaces;
  const lifeSpaces = [
    ["START","🌱","人生スタート"],["趣味","🎨","好きな趣味を満喫"],["おこづかい","🪙","臨時収入ゲット"],["お買い物","🛍️","欲しかったものを購入"],["休日","🌷","のんびり休息"],["新しい出会い","🐾","素敵な出会い"],["ラッキー","🍀","思いがけない幸運"],["お仕事","💼","新しいことに挑戦"],["ごほうび","🍰","自分にごほうび"],["GOAL","🏁","自分らしい人生！"]
  ];
  const jobPath = [[5,1],[4,1],[3,1],[2,1],[1,1],[1,2],[1,3],[1,4],[1,5],[2,5],[3,5],[4,5],[5,5],[5,4],[5,3],[5,2],[4,2],[3,2],[2,2],[2,3],[2,4],[3,4],[3,3]];
  const lifePath = [[1,1],[1,2],[1,3],[1,4],[1,5],[2,5],[2,4],[2,3],[2,2],[2,1]];
  function renderBoard(id, spaces, position, path) {
    const board=$(id); if(!board)return;
    board.innerHTML="";
    spaces.forEach((space,i)=>{
      const cell=document.createElement("div");
      cell.className="board-cell"+(i===0?" start-cell":"")+(i===spaces.length-1?" goal-cell":"")+(i===position?" current-cell":"")+(space[3]?" event-cell":"");
      cell.innerHTML=`<span class="cell-num">${String(i).padStart(2,"0")}</span><span class="cell-emoji">${space[1]}</span><span class="cell-name">${space[0]}</span>`;
      cell.title=space[2];
      cell.style.setProperty("--tilt",(((i%2===0)?1:-1)*(0.7+(i%3)*0.35)).toFixed(2)+"deg");
      if(path&&path[i]){cell.style.gridRowStart=path[i][0];cell.style.gridColumnStart=path[i][1];}
      board.appendChild(cell);
    });
    if(id==="jobBoard"){
      [[4,3],[4,4]].forEach((pos)=>{
        const patch=document.createElement("div");
        patch.className="board-cell flower-cell";
        patch.style.gridRowStart=pos[0];patch.style.gridColumnStart=pos[1];
        patch.innerHTML=dokudamiSvg();
        board.appendChild(patch);
      });
    }
    requestAnimationFrame(()=>drawRoute(board));
  }
  const job = {position:0,busy:false,skip:false};
  const life = {position:0,busy:false};
  const jobLast = () => jobBoardSpaces.length-1;
  function setJobEvent(title,text,actions="") {
    if($("eventTitle"))$("eventTitle").textContent=title;
    if($("eventText"))$("eventText").textContent=text;
    if($("eventActions"))$("eventActions").innerHTML=actions;
    if($("missionBarTitle"))$("missionBarTitle").textContent=title;
    if($("missionBarText"))$("missionBarText").textContent=text;
  }
  const missionModal=$("missionModal");
  function openMission(title,text,actionsHtml) {
    if(!missionModal){return;}
    if($("missionTitle"))$("missionTitle").textContent=title;
    if($("missionText"))$("missionText").textContent=text;
    const box=$("missionActions");
    if(box){box.innerHTML=actionsHtml||"";bindJobActions(box);}
    missionModal.hidden=false;
  }
  function closeMissionModal() {
    if(missionModal)missionModal.hidden=true;
    if($("rollButton")&&job.position<jobLast())$("rollButton").disabled=false;
  }
  function bindJobActions(box) {
    if(!box)return;
    box.querySelectorAll("button[data-move]").forEach((btn)=>{
      btn.addEventListener("click",()=>{
        const d=parseInt(btn.getAttribute("data-move"),10)||0;
        if(missionModal)missionModal.hidden=true;
        job.position=Math.max(0,Math.min(jobLast(),job.position+d));
        updateJob();
        if($("turnStatus"))$("turnStatus").textContent=d>0?`イベントで ${d}マス進んだ！`:`イベントで ${-d}マス戻った……`;
        finishJobSpace();
      });
    });
  }
  function updateJob() {
    renderBoard("jobBoard",jobBoardSpaces,job.position,jobPath);
    const last=jobLast();
    if($("positionText"))$("positionText").textContent=job.position===0?"START / 0":job.position===last?`GOAL / ${last}`:`マス ${job.position} / ${last}`;
    if($("progressBar"))$("progressBar").style.width=(job.position/last*100)+"%";
  }
  const roulette=$("rouletteModal");
  function showRoulette(){if(roulette){roulette.hidden=false;$("rouletteResult").textContent="";$("rouletteResult").className="roulette-result";$("spinButton").disabled=false;}}
  function goalTexts() {
    return uraMode?["ゴール！（裏）","ドクダミ畑を卒業！ 真のゴールは内定先に入社すること。お疲れ様でした！"]:["ゴール！","お疲れ様でした！ 素敵な社会人になれますように！"];
  }
  function goalJobEvent() {
    const g=goalTexts();
    setJobEvent(g[0],g[1]);
    if($("rollButton"))$("rollButton").disabled=true;
  }
  function finishJobSpace() {
    const s=jobBoardSpaces[job.position];
    const eff=s[3];
    if(job.position===jobLast()){goalJobEvent();const g=goalTexts();openMission(g[0],g[1]);return;}
    if(eff==="roulette"){setJobEvent(s[0],s[2]);showRoulette();return;}
    if(eff==="skip"){job.skip=true;setJobEvent(s[0],s[2]);if($("turnStatus"))$("turnStatus").textContent="ハプニング！ 次のターンは1回休み";openMission(s[0],s[2]);return;}
    if(eff==="plusChoice"){setJobEvent(s[0],s[2]);openMission(s[0],s[2],`<button class="action-button" data-move="1" type="button">理由を言えた！ 1マスすすむ</button>`);return;}
    if(eff==="suitChoice"){setJobEvent(s[0],s[2]);openMission(s[0],s[2],`<button class="action-button" data-move="1" type="button">はい（+1マス）</button><button class="action-button sub" data-move="-1" type="button">いいえ（-1マス）</button>`);return;}
    setJobEvent(s[0],s[2]);
    openMission(s[0],s[2]);
  }
  const rollButton=$("rollButton");
  buildDice($("dice"));
  if(rollButton)rollButton.addEventListener("click",()=>{
    if(job.busy||job.position>=jobLast())return;
    if(job.skip){
      job.skip=false;
      sproutDokudami();
      const t="1回休み";
      const x=uraMode?"休んでいる間にもドクダミは育つ。次のターンから再開。":"ハプニングの余波で、このターンはお休み。次のターンから再開！";
      setJobEvent(t,x);
      if($("turnStatus"))$("turnStatus").textContent="1回休みでやり過ごした";
      openMission(t,x);
      return;
    }
    job.busy=true;rollButton.disabled=true;
    const n=Math.floor(Math.random()*6)+1;
    tumbleDice($("dice"),n,()=>{
      const raw=job.position+n;
      const landed=bounceBack(raw,jobLast());
      const bounced=landed!==raw;
      job.position=landed;
      updateJob();
      sproutDokudami();
      if($("turnStatus"))$("turnStatus").textContent=bounced?`${n}が出た！ ゴールを行き過ぎて ${raw-landed}マス戻った`:`${n}マス進んだ！`;
      finishJobSpace();
      job.busy=false;
      if(job.position<jobLast())rollButton.disabled=false;
    });
  });
  const spinButton=$("spinButton");
  if(spinButton)spinButton.addEventListener("click",()=>{
    spinButton.disabled=true;
    const wheel=$("rouletteWheel");wheel.classList.remove("spinning");void wheel.offsetWidth;wheel.classList.add("spinning");
    $("rouletteResult").textContent="運命を判定中……";
    setTimeout(()=>{
      const good=Math.random()<0.5;
      $("rouletteResult").className="roulette-result "+(good?"good":"bad");
      $("rouletteResult").textContent=good?(uraMode?"✨ スッキリした（気がする）！ 2マスすすむ":"✨ 悩みがスッキリ！ 2マスすすむ"):(uraMode?"💥 ストレス倍増！ 怪文書が届いて3マス戻る":"💥 ストレス倍増！ 3マス戻る");
      if(good){job.position=Math.min(jobLast(),job.position+2);}else{job.position=Math.max(0,job.position-3);}
      updateJob();
      if(job.position===jobLast()){goalJobEvent();}
      else{
        if(uraMode){setJobEvent(good?"相談してスッキリ…？":"相談してストレス倍増！",good?"気持ちが軽くなった（気がする）。2マスすすもう。ただし帰り際に講座の勧誘つき。":"『お母様に共有しました😊』の連絡つき。3マス戻ろう。");}
        else{setJobEvent(good?"相談してスッキリ！":"相談してストレス倍増！",good?"気持ちが軽くなった！ 2マスすすもう。":"おっと、ストレスが増えてしまった……3マス戻ろう。");}
        $("rollButton").disabled=false;
      }
      if($("turnStatus"))$("turnStatus").textContent=good?"相談イベント：ラッキー！":"相談イベント：ドクダミ注意報！";
      $("closeRoulette").textContent="×";
      spinButton.disabled=false;
    },900);
  });
  if($("closeRoulette"))$("closeRoulette").addEventListener("click",()=>{roulette.hidden=true;if(job.position<jobLast()&&rollButton)rollButton.disabled=false;});
  if(roulette)roulette.addEventListener("click",(e)=>{if(e.target===roulette){roulette.hidden=true;if(job.position<jobLast()&&rollButton)rollButton.disabled=false;}});
  if($("closeMission"))$("closeMission").addEventListener("click",closeMissionModal);
  if(missionModal)missionModal.addEventListener("click",(e)=>{if(e.target===missionModal)closeMissionModal();});
  if(uraMode&&$("jobBoard")){
    document.body.classList.add("ura-mode");
    if($("rouletteTitle"))$("rouletteTitle").textContent="支援員に相談してみた！（裏）";
    if($("rouletteLead"))$("rouletteLead").textContent="さて、現実は……？ ルーレットを回そう。";
    const stamp=document.querySelector(".board-stamp");if(stamp)stamp.textContent="🌿 DOKUDAMI REALITY";
    const pc=document.querySelector(".player-count");if(pc)pc.innerHTML="<span class=\"leaf-dot\"></span> ドクダミ満開";
    setJobEvent("スタート！（裏）","ここは現実のドクダミ畑。サイコロを振って進もう。");
  }
  const resetButton=$("resetButton");
  if(resetButton)resetButton.addEventListener("click",()=>{
    if(job.busy)return;
    job.position=0;job.skip=false;updateJob();
    const d=$("dice");if(d)d.style.transform=diceTransforms[0];
    if($("turnStatus"))$("turnStatus").textContent="スタート地点から出発！";
    const g=$("boardGarden");if(g){g.innerHTML="";seedDokudami();}
    if(missionModal)missionModal.hidden=true;
    if(uraMode){setJobEvent("スタート！（裏）","ここは現実のドクダミ畑。サイコロを振って進もう。");}
    else{setJobEvent("スタート！","サイコロを振って、ドクダミロードを進もう。");}
    if(rollButton)rollButton.disabled=false;
    if(roulette)roulette.hidden=true;
  });
  updateJob();

  const lifeButton=$("lifeRollButton");
  buildDice($("lifeDice"));
  const lifeModal=$("lifeMissionModal");
  function openLifeMission(title,text) {
    if(!lifeModal)return;
    if($("lifeMissionTitle"))$("lifeMissionTitle").textContent=title;
    if($("lifeMissionText"))$("lifeMissionText").textContent=text;
    lifeModal.hidden=false;
  }
  function closeLifeMissionModal() {
    if(lifeModal)lifeModal.hidden=true;
    if(lifeButton)lifeButton.disabled=life.position>=9;
  }
  if($("closeLifeMission"))$("closeLifeMission").addEventListener("click",closeLifeMissionModal);
  if(lifeModal)lifeModal.addEventListener("click",(e)=>{if(e.target===lifeModal)closeLifeMissionModal();});
  function updateLife(){renderBoard("lifeBoard",lifeSpaces,life.position,lifePath);if($("lifePositionText"))$("lifePositionText").textContent=life.position===0?"START / 0":life.position===9?"GOAL / 9":`マス ${life.position} / 9`;if($("lifeProgressBar"))$("lifeProgressBar").style.width=(life.position/9*100)+"%";}
  if(lifeButton)lifeButton.addEventListener("click",()=>{
    if(life.busy||life.position>=9)return;life.busy=true;lifeButton.disabled=true;
    const n=Math.floor(Math.random()*6)+1;
    tumbleDice($("lifeDice"),n,()=>{
      const raw=life.position+n;
      const landed=bounceBack(raw,9);
      const bounced=landed!==raw;
      life.position=landed;
      updateLife();
      sproutDokudami();
      const s=lifeSpaces[life.position];
      const evText=life.position===9?"ゴール！自分らしい人生を楽しもう！":s[2]+"！";
      $("lifeEventTitle").textContent=s[0];
      $("lifeEventText").textContent=evText;
      if($("lifeMissionBarTitle"))$("lifeMissionBarTitle").textContent=s[0];
      if($("lifeMissionBarText"))$("lifeMissionBarText").textContent=evText;
      $("lifeTurnStatus").textContent=bounced?`${n}が出た！ ゴールを行き過ぎて ${raw-landed}マス戻った`:`${n}マス進んだ！`;
      life.busy=false;lifeButton.disabled=life.position>=9;
      openLifeMission(s[0],evText);
      if(life.position<9)lifeButton.disabled=true;
    });
  });
  const lifeResetButton=$("lifeResetButton");
  if(lifeResetButton)lifeResetButton.addEventListener("click",()=>{
    if(life.busy)return;
    life.position=0;updateLife();
    const d=$("lifeDice");if(d)d.style.transform=diceTransforms[0];
    if($("lifeEventTitle"))$("lifeEventTitle").textContent="新しい人生のスタート！";
    if($("lifeEventText"))$("lifeEventText").textContent="サイコロを振って、いろんなイベントに出会おう。";
    if($("lifeMissionBarTitle"))$("lifeMissionBarTitle").textContent="新しい人生のスタート！";
    if($("lifeMissionBarText"))$("lifeMissionBarText").textContent="サイコロを振って、いろんなイベントに出会おう。";
    if($("lifeTurnStatus"))$("lifeTurnStatus").textContent="人生は運しだい、のんびり行こう。";
    const g=$("boardGarden");if(g){g.innerHTML="";seedDokudami();}
    if(lifeModal)lifeModal.hidden=true;
    if(lifeButton)lifeButton.disabled=false;
  });
  updateLife();
  seedDokudami();
  window.addEventListener("resize",()=>{
    drawRoute($("jobBoard"));
    drawRoute($("lifeBoard"));
  });
  window.addEventListener("load",()=>{
    drawRoute($("jobBoard"));
    drawRoute($("lifeBoard"));
  });
})();
