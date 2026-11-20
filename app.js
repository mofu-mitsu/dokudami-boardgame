(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const diceFaces = ["⚀","⚁","⚂","⚃","⚄","⚅"];
  const plantSvg = (id) => `<svg class="plant-svg" viewBox="0 0 100 100" aria-hidden="true"><path d="M49 94 C48 70 51 44 50 17" fill="none" stroke="#527b4b" stroke-width="3"/><path d="M49 70 C19 75 10 53 17 37 C39 38 51 51 49 70Z"/><path d="M51 56 C79 60 92 41 85 24 C64 26 50 39 51 56Z"/><path d="M49 83 C25 91 14 78 17 64 C36 61 48 69 49 83Z"/><path d="M51 37 C35 29 36 13 48 7 C60 15 61 28 51 37Z"/><g transform="translate(70 16)"><ellipse class="flower" cx="0" cy="-6" rx="5" ry="8"/><ellipse class="flower" cx="6" cy="0" rx="8" ry="5"/><ellipse class="flower" cx="0" cy="6" rx="5" ry="8"/><ellipse class="flower" cx="-6" cy="0" rx="8" ry="5"/><circle class="center" r="4"/></g></svg>`;
  const garden = $("garden");
  if (garden) {
    for (let i=0;i<20;i++) {
      const el=document.createElement("div");
      el.className="garden-leaf";
      el.innerHTML=plantSvg(i);
      el.style.left=(Math.random()*100)+"%";
      el.style.top=(Math.random()*100)+"%";
      el.style.animationDelay=(-Math.random()*5)+"s";
      el.style.transform="scale("+(0.45+Math.random()*0.85)+")";
      garden.appendChild(el);
    }
  }

  const jobSpaces = [
    ["START","🌱","スタート"],["自己分析","🪞","好き・得意を考える"],["身だしなみ","👔","服装や髪型をチェック"],["面接準備","📝","質問への答えを考える"],["相談イベント","🌼","支援員に相談"],["自己PR","🎤","15秒で自己PR"],["求人票","🔎","大切にしたい条件"],["応援の言葉","💌","メンバーに一言"],["面接練習","🗣️","緊張した時の対策"],["GOAL","🏁","ゴール！"]
  ];
  const uraMode = new URLSearchParams(location.search).get("mode")==="dokudami";
  const jobSpacesUra = [
    ["START","🌱","通所開始"],["自己分析","🪞","発表したら『干渉されたくないくせに』と勝手にラベリングされる"],["身だしなみ","👔","5分遅刻でグチグチ言われる。なお愛用PCは先客に奪われている"],["面接準備","📝","答えを考えたら『どこで話変わっちゃったんですかー？』の詰問ラッシュ"],["相談イベント","🌼","支援員に相談してみた。結果はルーレットしだい"],["自己PR","🎤","15秒で言い切ったら『逃げているように思えます』"],["求人票","🔎","条件を答えたら『タイピングスコアも報告しろ😊』と追加クエスト発生"],["応援の言葉","💌","一言言ったら『素敵な社会人になれますように』と薄く返される"],["面接練習","🗣️","緊張対策を答えたら『祝日も来い😊』の一言で緊張が戻る"],["GOAL","🏁","真のゴール"]
  ];
  const jobBoardSpaces = uraMode ? jobSpacesUra : jobSpaces;
  const lifeSpaces = [
    ["START","🌱","人生スタート"],["趣味","🎨","好きな趣味を満喫"],["おこづかい","🪙","臨時収入ゲット"],["お買い物","🛍️","欲しかったものを購入"],["休日","🌷","のんびり休息"],["新しい出会い","🐾","素敵な出会い"],["ラッキー","🍀","思いがけない幸運"],["お仕事","💼","新しいことに挑戦"],["ごほうび","🍰","自分にごほうび"],["GOAL","🏁","自分らしい人生！"]
  ];
  function renderBoard(id, spaces, position) {
    const board=$(id); if(!board)return;
    board.innerHTML="";
    spaces.forEach((space,i)=>{
      const cell=document.createElement("div");
      cell.className="board-cell"+(i===0?" start-cell":"")+(i===spaces.length-1?" goal-cell":"")+(i===position?" current-cell":"");
      cell.innerHTML=`<span class="cell-num">${String(i).padStart(2,"0")}</span><span class="cell-emoji">${space[1]}</span><span class="cell-name">${space[0]}</span>`;
      cell.title=space[2];
      board.appendChild(cell);
    });
  }
  const job = {position:0,busy:false};
  const life = {position:0,busy:false};
  function setJobEvent(title,text,actions="") {
    if($("eventTitle"))$("eventTitle").textContent=title;
    if($("eventText"))$("eventText").textContent=text;
    if($("eventActions"))$("eventActions").innerHTML=actions;
  }
  function updateJob() {
    renderBoard("jobBoard",jobBoardSpaces,job.position);
    if($("positionText"))$("positionText").textContent=job.position===0?"START / 0":job.position===9?"GOAL / 9":`マス ${job.position} / 9`;
    if($("progressBar"))$("progressBar").style.width=(job.position/9*100)+"%";
  }
  const roulette=$("rouletteModal");
  function showRoulette(){if(roulette){roulette.hidden=false;$("rouletteResult").textContent="";$("rouletteResult").className="roulette-result";$("spinButton").disabled=false;}}
  function finishJobSpace() {
    const s=jobBoardSpaces[job.position];
    if(job.position===4){showRoulette();return;}
    if(job.position===9){if(uraMode){setJobEvent("ゴール！（裏）","ドクダミ畑を卒業！ 真のゴールは内定先に入社すること。お疲れ様でした！");}else{setJobEvent("ゴール！","お疲れ様でした！ 素敵な社会人になれますように！");}$("rollButton").disabled=true;return;}
    setJobEvent(s[0],uraMode?s[2]:s[2]+ "。自分のペースで考えてみよう。");
  }
  const rollButton=$("rollButton");
  if(rollButton)rollButton.addEventListener("click",()=>{
    if(job.busy||job.position>=9)return;
    job.busy=true;rollButton.disabled=true;
    const dice=$("dice");dice.classList.remove("rolling");void dice.offsetWidth;dice.classList.add("rolling");
    let ticks=0;const timer=setInterval(()=>{dice.textContent=diceFaces[Math.floor(Math.random()*6)];ticks++;if(ticks>=8){clearInterval(timer);const n=Math.floor(Math.random()*6)+1;dice.textContent=diceFaces[n-1];job.position=Math.min(9,job.position+n);updateJob();if($("turnStatus"))$("turnStatus").textContent=` ${n}マス進んだ！`;finishJobSpace();job.busy=false;if(job.position<9)rollButton.disabled=false;}},75);
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
      if(good){job.position=Math.min(9,job.position+2);}else{job.position=Math.max(0,job.position-3);}
      updateJob();
      if(uraMode){setJobEvent(good?"相談してスッキリ…？":"相談してストレス倍増！",good?"気持ちが軽くなった（気がする）。2マスすすもう。ただし帰り際に講座の勧誘つき。":"『お母様に共有しました😊』の連絡つき。3マス戻ろう。");}
      else{setJobEvent(good?"相談してスッキリ！":"相談してストレス倍増！",good?"気持ちが軽くなった！ 2マスすすもう。":"おっと、ストレスが増えてしまった……3マス戻ろう。");}
      if(job.position===9){$("rollButton").disabled=true;}
      else $("rollButton").disabled=false;
      if($("turnStatus"))$("turnStatus").textContent=good?"相談イベント：ラッキー！":"相談イベント：ドクダミ注意報！";
      $("closeRoulette").textContent="×";
      spinButton.disabled=false;
    },900);
  });
  if($("closeRoulette"))$("closeRoulette").addEventListener("click",()=>{roulette.hidden=true;if(job.position<9&&rollButton)rollButton.disabled=false;});
  if(roulette)roulette.addEventListener("click",(e)=>{if(e.target===roulette){roulette.hidden=true;if(job.position<9&&rollButton)rollButton.disabled=false;}});
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
    job.position=0;updateJob();
    if($("dice"))$("dice").textContent="⚀";
    if($("turnStatus"))$("turnStatus").textContent="スタート地点から出発！";
    if(uraMode){setJobEvent("スタート！（裏）","ここは現実のドクダミ畑。サイコロを振って進もう。");}
    else{setJobEvent("スタート！","サイコロを振って、ドクダミロードを進もう。");}
    if(rollButton)rollButton.disabled=false;
    if(roulette)roulette.hidden=true;
  });
  updateJob();

  const lifeButton=$("lifeRollButton");
  function updateLife(){renderBoard("lifeBoard",lifeSpaces,life.position);if($("lifePositionText"))$("lifePositionText").textContent=life.position===0?"START / 0":life.position===9?"GOAL / 9":`マス ${life.position} / 9`;if($("lifeProgressBar"))$("lifeProgressBar").style.width=(life.position/9*100)+"%";}
  if(lifeButton)lifeButton.addEventListener("click",()=>{
    if(life.busy||life.position>=9)return;life.busy=true;lifeButton.disabled=true;
    const dice=$("lifeDice");dice.classList.remove("rolling");void dice.offsetWidth;dice.classList.add("rolling");
    let ticks=0;const timer=setInterval(()=>{dice.textContent=diceFaces[Math.floor(Math.random()*6)];ticks++;if(ticks>=8){clearInterval(timer);const n=Math.floor(Math.random()*6)+1;dice.textContent=diceFaces[n-1];life.position=Math.min(9,life.position+n);updateLife();const s=lifeSpaces[life.position];$("lifeEventTitle").textContent=s[0];$("lifeEventText").textContent=life.position===9?"ゴール！自分らしい人生を楽しもう！":s[2]+"！";$("lifeTurnStatus").textContent=`${n}マス進んだ！`;life.busy=false;lifeButton.disabled=life.position>=9;}},75);
  });
  const lifeResetButton=$("lifeResetButton");
  if(lifeResetButton)lifeResetButton.addEventListener("click",()=>{
    if(life.busy)return;
    life.position=0;updateLife();
    if($("lifeDice"))$("lifeDice").textContent="⚀";
    if($("lifeEventTitle"))$("lifeEventTitle").textContent="新しい人生のスタート！";
    if($("lifeEventText"))$("lifeEventText").textContent="サイコロを振って、いろんなイベントに出会おう。";
    if($("lifeTurnStatus"))$("lifeTurnStatus").textContent="人生は運しだい、のんびり行こう。";
    if(lifeButton)lifeButton.disabled=false;
  });
  updateLife();
})();