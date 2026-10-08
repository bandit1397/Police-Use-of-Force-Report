// 화면 처리. 주소의 # 뒤로 화면을 고른다: '' 전체 흐름, '#levels' 섹션, '#levels/2' 섹션의 3번째 항목.
(function () {
  'use strict';
  var M = window.Manual, S = M.SECTIONS;
  var view = document.getElementById('view');
  var PHASES = ['사용 전', '사용 중', '사용 후', '근거'];
  var CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'];

  function dateKo(iso) { var p = iso.split('-'); return p[0] + '. ' + (+p[1]) + '. ' + (+p[2]) + '.'; }

  // ── 블록 → HTML ──
  function list(items) {
    return '<div class="list">' + items.map(function (it) {
      return '<div class="li"><span class="mk">' + it[0] + '</span><div class="tx">' + it[1] +
        (it[2] ? list(it[2]) : '') + '</div></div>';
    }).join('') + '</div>';
  }
  function blocks(arr) {
    return (arr || []).map(function (b) {
      switch (b[0]) {
        case 'h': return '<h4>' + b[1] + '</h4>';
        case 'p': return '<p>' + b[1] + '</p>';
        case 'list': return list(b[1]);
        case 'law': return '<div class="law">' + (b[1] ? '<span class="src">' + b[1] + '</span>' : '') + b[2] + '</div>';
        case 'note': return '<div class="note ' + b[1] + '"><div>' + b[2] + '</div></div>';
        case 'flow':
          return '<div class="flow">' + b[1].map(function (q, i) {
            return '<div class="q"><span class="qn">Q' + (i + 1) + '</span><span class="qt">' + q[0] + '</span>' +
              '<span class="yes">예 → <b>사용보고서 ' + q[1] + '</b></span></div><div class="no-arrow">아니오 ↓</div>';
          }).join('') + '<div class="flow-end"><span class="qt">모두 아니오</span>' + b[2] + '</div></div>';
        case 'fields':
          return '<div class="fields">' + b[1].map(function (f) {
            return '<div class="fld"><div class="k">' + f[0] + '</div><div class="v">' + f[1] + '</div></div>';
          }).join('') + '</div>';
        case 'example':
          return '<div class="example"><div class="ex-title">' + b[1] + '</div><div class="ex-body">' + b[2] + '</div></div>';
        case 'more':
          return '<details class="more"><summary>' + b[1] + '</summary>' + blocks(b[2]) + '</details>';
      }
      return '';
    }).join('');
  }

  // ── 전체 흐름 ──
  function home() {
    var h = '<p class="lead">큰 주제를 누르면 세부 내용을 볼 수 있습니다. 위에서 아래로 물리력 사용 전 → 사용 중 → 사용 후 순서입니다.</p>';
    PHASES.forEach(function (ph) {
      var secs = S.filter(function (s) { return s.phase === ph; });
      if (!secs.length) return;
      h += '<section class="phase"><p class="phase-label">' + ph + '</p>';
      secs.forEach(function (s) {
        h += '<a class="sec-card" href="#' + s.id + '"><span class="sec-no">' + s.no + '</span>' +
          '<span class="sec-title">' + s.title + '</span><span class="sec-sum">' + s.sum + '</span><span class="sec-chev">›</span>';
        if (s.id === 'levels') {
          h += '<span class="mini-strip">' + M.LEVELS.map(function (l) {
            return '<span class="lv' + l.lv + '">' + l.act + '</span>';
          }).join('') + '</span>';
        }
        h += '</a>';
      });
      h += '</section>';
    });
    h += '<details class="about"><summary>이 매뉴얼에 대해</summary>' +
      '<p>「경찰 물리력 행사의 기준과 방법에 관한 규칙」을 중심으로 관련 법령 원문과 대조해 만든 <b>현장 참고용</b> 자료입니다. 최종 판단은 현행 법령과 소속 기관 지침에 따릅니다.</p>' +
      '<h3>법령 기준 (' + dateKo(M.META.checked) + ' 원문 대조)</h3>' +
      list(M.META.sources.map(function (src) {
        return ['›', '<a href="' + src.url + '" target="_blank" rel="noopener">' + src.name + '</a> <small>' + src.info + '</small>'];
      })) +
      '<h3>처음 자료에서 바뀐 내용</h3>' +
      list([
        ['›', '“범인 행위”를 규칙 용어인 <b>“대상자 행위”</b>로 바꿨습니다.'],
        ['›', '5단계 고위험 물리력의 “가급적 머리 부분은 지양”은 규칙에서 <b>4단계(중위험) 경찰봉</b>에 대한 기준입니다. 고위험은 다른 모든 물리력이 불가능하거나 무력화되고 정당방위·긴급피난 요건을 갖춘 경우 최후의 수단으로 중요 부위·급소 가격까지 허용합니다. 권총은 가급적 대퇴부 이하를 조준합니다.'],
        ['›', '3단계 신체적 물리력, 4단계 도주 대상자에 대한 사용 요건을 규칙 문구대로 보탰습니다.'],
        ['›', '부상자 확인은 신체 접촉을 동반한 물리력을 썼다면 <b>반드시</b> 해야 합니다.'],
        ['›', '사용보고서는 소속기관의 장에게 보고하고, 대상자별로 작성하며, 불발이어도 작성합니다.'],
        ['›', '“부상”의 정의(병원 후송·진료가 필요한 부상)는 규칙 조문에 없는 실무 해석 기준이라 그렇게 표시했습니다.'],
        ['›', '장비별 사용 한계, 현장 기록·증거 확보, 보고 계통, 사용보고서 작성요령, 관련 법규를 새로 넣었습니다.']
      ]) +
      '</details>';
    return h;
  }

  // ── 세부 화면 ──
  function detail(si, sub) {
    var s = S[si], h = '';
    h += '<div class="d-head"><span class="sec-no">' + s.no + '</span><div><span class="phase-tag">' + s.phase + '</span><h2>' + s.title + '</h2></div></div>';

    if (s.tabs) {
      var isLv = s.id === 'levels';
      h += '<div class="tabbar' + (isLv ? ' lvbar' : '') + '" role="tablist">' + s.kids.map(function (k, i) {
        var inner = isLv ? '<span class="n">' + k.lv + '</span><span class="a">' + k.title + '</span><span class="r">' + k.res + '</span>' : k.title;
        return '<button role="tab" data-i="' + i + '" aria-selected="' + (i === sub) + '"' +
          (isLv ? ' class="lv' + k.lv + '"' : '') + '>' + inner + '</button>';
      }).join('') + '</div>';
      if (isLv) h += '<div class="lv-arrow">대상자 위해 수준 낮음 ──────── 높음</div>';
      h += blocks(s.intro);
      var k = s.kids[sub];
      if (isLv) {
        h += '<article class="card lv-card lv' + k.lv + '"><h3><span class="lv-badge">' + k.lv + '단계</span>' + k.title +
          ' <span class="lv-res">→ ' + k.res + '</span></h3>' + blocks(k.blocks) + '</article>';
      } else {
        h += '<article class="card"><h3>' + k.title + '</h3>' + blocks(k.blocks) + '</article>';
      }
    } else {
      if (s.kids.length > 1) {
        h += '<nav class="toc">' + s.kids.map(function (k, i) {
          return '<a href="#' + s.id + '/' + i + '">' + k.title + '</a>';
        }).join('') + '</nav>';
      }
      h += s.kids.map(function (k, i) {
        var meta = '';
        if (k.law != null) {
          var src = M.META.sources[k.law];
          meta = '<p class="law-meta">' + src.info + ' · <a href="' + src.url + '" target="_blank" rel="noopener">국가법령정보센터 원문 ↗</a></p>';
        }
        return '<article class="card" id="k-' + i + '"><h3>' + k.title + '</h3>' + meta + blocks(k.blocks) + '</article>';
      }).join('');
    }

    // 이전·다음: 탭 섹션은 탭부터 넘긴다
    var prev = null, next = null;
    if (s.tabs && sub > 0) prev = { href: '#' + s.id + '/' + (sub - 1), t: s.kids[sub - 1].title, k: '이전 항목' };
    else if (si > 0) prev = { href: '#' + S[si - 1].id, t: CIRCLED[si - 1] + ' ' + S[si - 1].title, k: '이전 주제' };
    if (s.tabs && sub < s.kids.length - 1) next = { href: '#' + s.id + '/' + (sub + 1), t: s.kids[sub + 1].title, k: '다음 항목' };
    else if (si < S.length - 1) next = { href: '#' + S[si + 1].id, t: CIRCLED[si + 1] + ' ' + S[si + 1].title, k: '다음 주제' };
    h += '<nav class="pager">' +
      (prev ? '<a class="prev" href="' + prev.href + '"><small>‹ ' + prev.k + '</small><b>' + prev.t + '</b></a>' : '') +
      (next ? '<a class="next" href="' + next.href + '"><small>' + next.k + ' ›</small><b>' + next.t + '</b></a>' : '') +
      '</nav>';
    return h;
  }

  // ── 라우팅 ──
  var current = { si: -1, sub: 0 };
  function parse() {
    var p = location.hash.replace(/^#\/?/, '').split('/');
    var si = -1;
    for (var i = 0; i < S.length; i++) if (S[i].id === p[0]) si = i;
    var sub = Math.max(0, parseInt(p[1], 10) || 0);
    if (si >= 0) sub = Math.min(sub, S[si].kids.length - 1);
    return { si: si, sub: sub, hasSub: p.length > 1 };
  }
  function render() {
    var r = parse(), before = current;
    current = r;
    document.body.classList.toggle('detail', r.si >= 0);
    view.innerHTML = r.si < 0 ? home() : detail(r.si, r.sub);
    document.title = (r.si < 0 ? '' : S[r.si].title + ' · ') + '경찰 물리력 사용 매뉴얼';
    var tabs = view.querySelector('.tabbar'), on = tabs && tabs.querySelector('[aria-selected="true"]');
    if (on) tabs.scrollLeft = on.offsetLeft - (tabs.clientWidth - on.offsetWidth) / 2;

    if (r.si >= 0 && S[r.si].tabs && before.si === r.si) {
      // 같은 섹션에서 탭만 바꾸면 탭 위치를 유지
      var bar = view.querySelector('.tabbar');
      var y = bar.getBoundingClientRect().top + window.scrollY - 52;
      if (window.scrollY > y) window.scrollTo(0, y);
    } else if (r.si >= 0 && !S[r.si].tabs && r.hasSub) {
      var el = document.getElementById('k-' + r.sub);
      if (el) el.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }

  view.addEventListener('click', function (e) {
    var b = e.target.closest('.tabbar button');
    if (!b) return;
    history.replaceState(null, '', '#' + S[current.si].id + '/' + b.getAttribute('data-i'));
    render();
  });

  // 탭 섹션은 좌우로 밀어 넘긴다
  var t0 = null;
  view.addEventListener('touchstart', function (e) {
    t0 = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
  }, { passive: true });
  view.addEventListener('touchend', function (e) {
    if (!t0 || current.si < 0 || !S[current.si].tabs) return;
    var dx = e.changedTouches[0].clientX - t0.x, dy = e.changedTouches[0].clientY - t0.y;
    t0 = null;
    if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
    var s = S[current.si], n = current.sub + (dx < 0 ? 1 : -1);
    if (n < 0 || n >= s.kids.length) return;
    history.replaceState(null, '', '#' + s.id + '/' + n);
    render();
  }, { passive: true });

  window.addEventListener('hashchange', render);
  document.getElementById('footMeta').textContent =
    '법령 기준 ' + dateKo(M.META.checked) + ' · 현장 참고용이며 최종 판단은 현행 법령과 소속 기관 지침에 따릅니다.';
  render();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
