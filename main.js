(function () {

    const $ = e => { return document.querySelector(e); }
    const $$ = e => { return document.querySelectorAll(e); }

    $('.rules-btn').onclick = () => ShowRules();
    $('.btn.back').onclick = () => HideRules();

    window.ShowRules = () => {
        $('.rules').classList.add('active');
        setTimeout(() => $('.rules').classList.add('opacity'), 50);
    }

    window.HideRules = () => {
        setTimeout(() => $('.rules').classList.remove('active'), 500);
        $('.rules').classList.remove('opacity');
    }

    var game, level, color = ["red", "blue", "yellow", "green", "purple", "lightgreen", "deeppink", "orange", "brown", "pink"],
    water = [],
    w = [],
    lvl, ck = [],
    tf = false,
    tr = "transparent",
    won = false,
    moves = 0;

    var tubePosition = {
        0: [[110, 25], [190, 25], [268, 25], [148, 165], [232, 165]],
        1: [[110, 25], [190, 25], [268, 25], [110, 165], [190, 165], [268, 165]],
        2: [[55, 25], [140, 25], [225, 25], [310, 25], [95, 165], [180, 165], [265, 165]],
        3: [[55, 25], [140, 25], [225, 25], [310, 25], [55, 165], [140, 165], [225, 165], [310, 165]],
        7: [[25, 25], [90, 25], [155, 25], [220, 25], [285, 25], [350, 25], [25, 165], [90, 165], [155, 165], [220, 165], [285, 165], [350, 165]],
    }

    game = $(".game");
    level = $(".level"),
    lev = $$('.lvl');
    for (let i = 0; i < lev.length; i++) lev[i].onclick = () => (i == 4) ? OpenLevel(7) : OpenLevel(i);

    const OpenLevel = x => {
        moves = 0;
        lvl = x;
        won = false;
        $('.level').classList.add('active');
        setTimeout(() => $('.level').classList.add('opacity'), 50);
        level.innerHTML = "";
        water = [];
        let a = [];
        let c = 0;
        for (let i = 0; i < x + 3; i++) {
            for (let j = 0; j < 4; j++) a.push(color[i]);
        }
        a = shuffle(a);
        for (let i = 0; i < x + 3; i++) {
            water[i] = [];
            for (let j = 0; j < 4; j++) {
                water[i].push(a[c]);
                c++;
            }
        }
        water.push([tr, tr, tr, tr], [tr, tr, tr, tr]);
        w = water.map((a) => [...a]);
        ApplyInfo();
    }

    window.shuffle = x => {
        let a = [],
        ln = x.length;
        for (let i = 0; i < ln; i++) {
            let n = Math.floor(Math.random() * x.length);
            a.push(x[n]);
            x.splice(n, 1);
        }
        return a;
    }

    window.ApplyInfo = (a = water) => {
        if (!won) {
            let d = 0;
            let item = '';
            let heading = ["EASY", "MEDIUM", "HARD", "VERY HARD", "", "", "", "IMPOSSIBLE"][lvl];
            level.innerHTML = `<div class="game-option">
                <div class="btn restart">Return</div>
                <div class="moves"><span class="count">${moves}</span></div>
                <div class="btn home">Exit</div>
            </div>
            <div class="lvl-name">${heading}</div>
            <div class="tube-items"></div>`;
            for (let i of tubePosition[lvl]) {
                item += `<div class="tube" style="top:${i[1]}px;left:${i[0]}px;transform:rotate(0deg)">
                    <div class="color" style="background:${a[d][0]};top:100px"></div>
                    <div class="color" style="background:${a[d][1]};top:70px"></div>
                    <div class="color" style="background:${a[d][2]};top:40px"></div>
                    <div class="color" style="background:${a[d][3]};top:10px"></div>
                </div>`;
                d++;
            }
            $('.tube-items').innerHTML = item; R();
            const tube = $$('.tube');
            for (let i = 0; i < tube.length; i++) tube[i].onclick = () => Clicked(i);
        }
    }

    window.R = () => {
        $('.restart').onclick = () => Restart();
        $('.home').onclick = () => {
            setTimeout(() => $('.level').classList.remove('active'), 500);
            $('.level').classList.remove('opacity');
        }
    }

    window.Restart = () => {
        moves = 0;
        water = w.map((a) => [...a]);
        won = false;
        ApplyInfo(w);
        OpenLevel(lvl);
    }

    window.Clicked = x => {
        if (!tf) {
            if (ck.length == 0) {
                ck.push(x);
                $$(".tube")[x].style.transform = "scale(1.08)";
            } else {
                ck.push(x);
                let el = $$(".tube")[ck[0]];
                el.style.transform = "scale(1) rotate(0deg)";
                if (ck[0] != ck[1]) {
                    moves++;
                    $(".count").textContent = moves;
                    Transfer(...ck);
                }
                ck = [];
            }
        }
    }

    window.Transfer = (a, b) => {
        if (!water[b].includes(tr) || water[a] == [tr, tr, tr, tr]) {
            moves -= 1;
            $(".count").textContent = moves;
            return;
        }
        let p, q, r = false,
        s = false,
        count = 0,
        c = 0;
        for (let i = 0; i < 4; i++) {
            if (((water[a][i] != tr && water[a][i + 1] == tr) || i === 3) && !r) {
                r = true;
                p = [water[a][i], i];
                if (water[a].map(function(x) {
                    if (x == tr || x == p[0]) { return 1; } else { return 0; }
                  }).reduce((x, y) => x + y) === 4) {
                  p.push(i + 1)
                }  else {
                    for (let j = 1; j < 4; j++) {
                        if (i - j >= 0 && water[a][i - j] != p[0]) {
                            p.push(j);
                            break;
                        }
                    }
                }
            }
            if (((water[b][i] != tr && water[b][i + 1] == tr) || water[b][0] == tr) && !s) {
                s = true;
                q = [water[b][i], i, water[b].map((x) => x = (x == tr) ? 1 : 0).reduce((x, y) => x + y)];
            }
        }
        if (q[0] != tr && p[0] != q[0]) {
            moves -= 1;
            $(".count").textContent = moves;
            return;
        }
        for (let i = 3; i >= 0; i--) {
            if ((water[a][i] == p[0] || water[a][i] == tr) && count < q[2]) {
                if (water[a][i] == p[0]) count++;
                water[a][i] = tr;
            } else break;
        }
        c = count;
        setTimeout(() => WaterDec({ p: p, a: a, c: c }), 1010);
        setTimeout(() => WaterInc({ p: p, q: q, b: b, c: c}), 1010);
        for (let i = 0; i < 4; i++) {
            if (water[b][i] == tr && count > 0) {
              count--;
              water[b][i] = p[0];
            }
        }
        setTimeout(() => ApplyInfo(), 3020);
        setTimeout(() => TransferAnim({ a: a, b: b }), 10);
        setTimeout(Won, 3000);
    }

    window.WaterDec = e => {
        e.p[1] = 3 - e.p[1];
        $$(".tube")[e.a].innerHTML += `<div class="tr-bg" style="top:calc(10px + ${e.p[1]*30}px - 1px)"></div>`;
        setTimeout(() => { $(".tr-bg").style.height = e.c * 30 + 1 + "px"; }, 50);
        setTimeout(() => {
            $$(".tube")[e.a].innerHTML = `
                <div class="color" style="background:${water[e.a][0]};top:100px"></div>
                <div class="color" style="background:${water[e.a][1]};top:70px"></div>
                <div class="color" style="background:${water[e.a][2]};top:40px"></div>
                <div class="color" style="background:${water[e.a][3]};top:10px"></div>`;
        }, 1050);
    }

    window.WaterInc = e => {
        e.q[1] = 4 - e.q[1];
        e.q[1] -= (e.q[0] != tr ? 1 : 0);
        $$(".tube")[e.b].innerHTML += `<div class="colorful" style="background:${e.p[0]};top:calc(10px + ${e.q[1]*30}px)"></div>`;
        setTimeout(function() {
          $(".colorful").style.height = e.c * 30 + 1 + "px";
          $(".colorful").style.top = `calc(10px + ${e.q[1]*30}px - ${e.c*30}px)`;
        }, 50);
    }

    window.TransferAnim = e => {
        let el = $$(".tube")[e.a];
        tf = true;
        el.style.zIndex = "10";
        el.style.top = `${tubePosition[lvl][e.b][1] - 95}px`;
        el.style.left = `${tubePosition[lvl][e.b][0] - 65}px`;
        el.style.transform = "rotate(75deg)";
        setTimeout(() => el.style.transform = "rotate(90deg)", 1000);
        setTimeout(function() {
            el.style.left = `${tubePosition[lvl][e.a][0]}px`;
            el.style.top = `${tubePosition[lvl][e.a][1]}px`;
            el.style.transform = "rotate(0deg)";
        }, 2000);
        setTimeout(function() {
            el.style.zIndex = "0";
            tf = false;
        }, 3000);
    }

    const Won = () => {
        for (let i of water) {
          if (i[0] != i[1] || i[1] != i[2] || i[2] != i[3]) return;
        }
        won = true;
        level.innerHTML = `<div class="game-option">
            <div class="btn restart">Return</div>
            <div class="btn home">Existing</div>
        </div>
        <div class="tube-items"><div class="won">Congratulations<br>🏆 You win</div></div>`;
        R();
    }
    
})();