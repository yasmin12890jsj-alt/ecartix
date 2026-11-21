(function () {
  'use strict';

  // إزالة أي Service Worker قديم يسبب ثبات النسخة القديمة
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      registrations.forEach(function (reg) {
        reg.unregister();
      });
    });
  }

  const DB_RECORDS = 'ecartix_ledger_db_v4';
  const DB_SETTINGS = 'ecartix_settings_db_v4';

  const RATES = {
    DZD: { symbol: 'د.ج', factor: 1 },
    EUR: { symbol: '€', factor: 1 / 145 },
    USD: { symbol: '$', factor: 1 / 134 }
  };

  const SEED_DATA = [
    {
      id: 'item-101',
      period: 'nov-2026',
      title: 'الإنتاج والتشغيل الرئيسي',
      category: 'الإنتاج والتشغيل',
      planned: 1600000,
      actual: 1820000,
      note: 'تحسن مردودية خطوط الإنتاج',
      date: '2026-11-04 09:20'
    },
    {
      id: 'item-102',
      period: 'nov-2026',
      title: 'المبيعات والإيرادات',
      category: 'المبيعات والإيرادات',
      planned: 1100000,
      actual: 1240000,
      note: 'نمو الطلب الشهري',
      date: '2026-11-11 15:40'
    },
    {
      id: 'item-103',
      period: 'oct-2026',
      title: 'المصاريف الإدارية',
      category: 'المصاريف الإدارية',
      planned: 950000,
      actual: 890000,
      note: 'تحكم جيد في النفقات',
      date: '2026-10-18 12:10'
    }
  ];

  const appState = {
    records: [],
    settings: {
      currency: 'DZD',
      lang: 'ar',
      period: 'nov-2026',
      dark: false
    }
  };

  function $(id) {
    return document.getElementById(id);
  }

  function esc(val) {
    return String(val || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function loadData() {
    try {
      const rawRec = localStorage.getItem(DB_RECORDS);
      appState.records = rawRec ? JSON.parse(rawRec) : SEED_DATA.slice();
    } catch (_) {
      appState.records = SEED_DATA.slice();
    }

    try {
      const rawSet = localStorage.getItem(DB_SETTINGS);
      if (rawSet) {
        appState.settings = Object.assign({}, appState.settings, JSON.parse(rawSet));
      }
    } catch (_) {}
  }

  function persistRecords() {
    localStorage.setItem(DB_RECORDS, JSON.stringify(appState.records));
  }

  function persistSettings() {
    localStorage.setItem(DB_SETTINGS, JSON.stringify(appState.settings));
  }

  function fmtMoney(dzdValue, withSign) {
    const cfg = RATES[appState.settings.currency] || RATES.DZD;
    const val = Number(dzdValue || 0) * cfg.factor;
    const numStr = Math.abs(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (withSign) {
      const sign = val > 0 ? '+' : val < 0 ? '-' : '';
      return sign + numStr + ' ' + cfg.symbol;
    }
    return (val < 0 ? '-' : '') + numStr + ' ' + cfg.symbol;
  }

  function currentRecords() {
    return appState.records.filter(function (r) {
      return r.period === appState.settings.period;
    });
  }

  function calcTotals(rows) {
    let planned = 0;
    let actual = 0;
    rows.forEach(function (r) {
      planned += Number(r.planned || 0);
      actual += Number(r.actual || 0);
    });
    const variance = actual - planned;
    const performance = planned > 0 ? (actual / planned) * 100 : 0;
    return { planned, actual, variance, performance };
  }

  function openTab(tabName) {
    document.querySelectorAll('.nav-item').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.target === tabName);
    });
    document.querySelectorAll('.tab-view').forEach(function (view) {
      view.classList.toggle('active', view.id === 'view-' + tabName);
    });
  }

  function drawDashboard() {
    const rows = currentRecords();
    const t = calcTotals(rows);

    if ($('kpiPlanned')) $('kpiPlanned').textContent = fmtMoney(t.planned, false);
    if ($('kpiActual')) $('kpiActual').textContent = fmtMoney(t.actual, false);
    if ($('kpiVariance')) $('kpiVariance').textContent = fmtMoney(t.variance, true);
    if ($('kpiPerformance')) $('kpiPerformance').textContent = t.performance.toFixed(1) + '%';

    if ($('kpiVarianceStatus')) {
      if (t.variance > 0) {
        $('kpiVarianceStatus').textContent = 'فارق إيجابي (+ أعلى من المخطط)';
      } else if (t.variance < 0) {
        $('kpiVarianceStatus').textContent = 'فارق سلبي (- أقل من المخطط)';
      } else {
        $('kpiVarianceStatus').textContent = 'متطابق مع الموازنة المخططة';
      }
    }

    const barPct = Math.max(0, Math.min(100, (t.performance / 150) * 100));
    if ($('performanceBar')) $('performanceBar').style.width = barPct + '%';
    if ($('progressCaption')) $('progressCaption').textContent = 'نسبة التحقق الحالية: ' + t.performance.toFixed(1) + '%';
    if ($('recordCountChip')) $('recordCountChip').textContent = rows.length + ' سجل محفوظ';

    const recentEl = $('recentLedgerList');
    if (!recentEl) return;

    const topItems = rows.slice(0, 3);
    if (!topItems.length) {
      recentEl.innerHTML = '<div class="ledger-sub">لا توجد عمليات بعد لهذه الفترة. أضيفي بنداً من تبويب "الفروقات".</div>';
      return;
    }

    recentEl.innerHTML = topItems
      .map(function (item) {
        const diff = Number(item.actual) - Number(item.planned);
        const cls = diff >= 0 ? 'pos-text' : 'neg-text';
        return (
          '<div class="ledger-item">' +
            '<div class="ledger-main">' +
              '<div class="ledger-title">' + esc(item.title) + '</div>' +
              '<div class="ledger-sub">' + esc(item.category) + ' • ' + esc(item.date) + '</div>' +
            '</div>' +
            '<div class="ledger-side">' +
              '<div class="ledger-amount ' + cls + '">' + fmtMoney(diff, true) + '</div>' +
              '<div class="ledger-sub">فعلي: ' + fmtMoney(item.actual, false) + '</div>' +
            '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  function drawBreakdown() {
    const box = $('varianceBreakdownList');
    if (!box) return;

    const rows = currentRecords();
    if (!rows.length) {
      box.innerHTML = '<div class="ledger-sub">أضيفي بنداً جديداً بالأعلى لعرض تحليل الفارق.</div>';
      return;
    }

    box.innerHTML = rows
      .map(function (item) {
        const diff = Number(item.actual) - Number(item.planned);
        const pct = Number(item.planned) > 0 ? ((diff / Number(item.planned)) * 100).toFixed(1) : '0.0';
        const cls = diff >= 0 ? 'pos-text' : 'neg-text';
        return (
          '<div class="ledger-item">' +
            '<div class="ledger-main">' +
              '<div class="ledger-title">' + esc(item.title) + '</div>' +
              '<div class="ledger-sub">مخطط: ' + fmtMoney(item.planned, false) + ' | فعلي: ' + fmtMoney(item.actual, false) + '</div>' +
            '</div>' +
            '<div class="ledger-side">' +
              '<div class="ledger-amount ' + cls + '">' + fmtMoney(diff, true) + '</div>' +
              '<div class="ledger-sub">(' + (diff >= 0 ? '+' : '') + pct + '%)</div>' +
            '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  function drawLedger() {
    const listEl = $('fullLedgerList');
    if (!listEl) return;

    const q = ($('ledgerSearch') ? $('ledgerSearch').value : '').trim().toLowerCase();
    const mode = $('ledgerFilter') ? $('ledgerFilter').value : 'all';

    const filtered = currentRecords().filter(function (item) {
      const diff = Number(item.actual) - Number(item.planned);
      const okMode =
        mode === 'all' ||
        (mode === 'favorable' && diff >= 0) ||
        (mode === 'unfavorable' && diff < 0);
      const textBlob = (item.title + ' ' + item.category + ' ' + (item.note || '')).toLowerCase();
      const okQuery = !q || textBlob.indexOf(q) !== -1;
      return okMode && okQuery;
    });

    if (!filtered.length) {
      listEl.innerHTML = '<div class="ledger-sub">لا توجد سجلات مطابقة للبحث أو التصفية.</div>';
      return;
    }

    listEl.innerHTML = filtered
      .map(function (item) {
        const diff = Number(item.actual) - Number(item.planned);
        const cls = diff >= 0 ? 'pos-text' : 'neg-text';
        return (
          '<div class="ledger-item">' +
            '<div class="ledger-main">' +
              '<div class="ledger-title">' + esc(item.title) + '</div>' +
              '<div class="ledger-sub">' + esc(item.category) + ' • ' + esc(item.date) + '</div>' +
              (item.note ? '<div class="ledger-sub">ملاحظة: ' + esc(item.note) + '</div>' : '') +
            '</div>' +
            '<div class="ledger-side">' +
              '<div class="ledger-amount ' + cls + '">' + fmtMoney(diff, true) + '</div>' +
              '<div class="ledger-sub">فعلي: ' + fmtMoney(item.actual, false) + '</div>' +
              '<button type="button" class="delete-mini-btn" data-del="' + esc(item.id) + '">حذف</button>' +
            '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  function drawLab() {
    if (!$('simVolumeSlider') || !$('simPriceSlider')) return;
    const v = Number($('simVolumeSlider').value);
    const p = Number($('simPriceSlider').value);

    if ($('simVolumeVal')) $('simVolumeVal').textContent = (v >= 0 ? '+' : '') + v + '%';
    if ($('simPriceVal')) $('simPriceVal').textContent = (p >= 0 ? '+' : '') + p + '%';

    const t = calcTotals(currentRecords());
    const base = t.actual > 0 ? t.actual : t.planned;
    const simActual = base * (1 + v / 100) * (1 + p / 100);
    const simVar = simActual - t.planned;

    if ($('simProjectedActual')) $('simProjectedActual').textContent = fmtMoney(simActual, false);
    if ($('simProjectedVariance')) $('simProjectedVariance').textContent = fmtMoney(simVar, true);
  }

  function updatePreview() {
    if (!$('previewDiffValue')) return;
    const pl = Number($('plannedAmount') ? $('plannedAmount').value : 0) || 0;
    const ac = Number($('actualAmount') ? $('actualAmount').value : 0) || 0;
    const diff = ac - pl;
    const pct = pl > 0 ? ((diff / pl) * 100).toFixed(1) : '0.0';
    $('previewDiffValue').textContent = fmtMoney(diff, true) + ' (' + (diff >= 0 ? '+' : '') + pct + '%)';
    $('previewDiffValue').className = diff >= 0 ? 'pos-text' : 'neg-text';
  }

  function pushChat(msg, who) {
    const box = $('aiChatBox');
    if (!box) return;
    const bubble = document.createElement('div');
    bubble.className = 'chat-msg ' + (who === 'user' ? 'user' : 'bot');
    bubble.textContent = msg;
    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
  }

  function replyAi(question) {
    const t = calcTotals(currentRecords());
    const count = currentRecords().length;
    const q = String(question || '').toLowerCase();

    if (q.indexOf('إحصاء') !== -1 || q.indexOf('سجل') !== -1) {
      return 'يوجد حالياً ' + count + ' سجل في هذه الفترة. المخطط ' + fmtMoney(t.planned, false) + ' والفعلي ' + fmtMoney(t.actual, false) + '.';
    }
    if (q.indexOf('سبب') !== -1 || q.indexOf('تفسير') !== -1 || q.indexOf('تعامل') !== -1) {
      if (t.variance > 0) {
        return 'الفارق إيجابي (' + fmtMoney(t.variance, true) + '). يُفضل فصل أثر الحجم عن أثر السعر لتحديد مصدر الزيادة بدقة.';
      }
      if (t.variance < 0) {
        return 'الفارق سلبي (' + fmtMoney(t.variance, true) + '). يُنصح بمراجعة البنود المتأخرة أو التحقق من وفورات التكلفة.';
      }
      return 'الفعلي مساوٍ للمخطط تماماً، ولا يوجد انحراف حالياً.';
    }
    return 'ملخص الفترة: المخطط ' + fmtMoney(t.planned, false) + '، الفعلي ' + fmtMoney(t.actual, false) + '، الفارق ' + fmtMoney(t.variance, true) + '، ونسبة الأداء ' + t.performance.toFixed(1) + '%.';
  }

  function refreshUI() {
    document.body.classList.toggle('dark-theme', Boolean(appState.settings.dark));
    if ($('currencySelect')) $('currencySelect').value = appState.settings.currency;
    if ($('langSelect')) $('langSelect').value = appState.settings.lang;
    if ($('periodSelect')) $('periodSelect').value = appState.settings.period;

    drawDashboard();
    drawBreakdown();
    drawLedger();
    drawLab();
    updatePreview();
  }

  function wireEvents() {
    document.querySelectorAll('.nav-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openTab(btn.dataset.target);
      });
    });

    document.querySelectorAll('[data-jump]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openTab(btn.dataset.jump);
      });
    });

    if ($('quickAddBtn')) {
      $('quickAddBtn').addEventListener('click', function () {
        openTab('variance');
        if ($('itemTitle')) $('itemTitle').focus();
      });
    }

    if ($('currencySelect')) {
      $('currencySelect').addEventListener('change', function (e) {
        appState.settings.currency = e.target.value;
        persistSettings();
        refreshUI();
      });
    }

    if ($('langSelect')) {
      $('langSelect').addEventListener('change', function (e) {
        appState.settings.lang = e.target.value;
        document.documentElement.lang = e.target.value;
        document.documentElement.dir = e.target.value === 'ar' ? 'rtl' : 'ltr';
        persistSettings();
      });
    }

    if ($('periodSelect')) {
      $('periodSelect').addEventListener('change', function (e) {
        appState.settings.period = e.target.value;
        persistSettings();
        refreshUI();
      });
    }

    if ($('themeToggle')) {
      $('themeToggle').addEventListener('click', function () {
        appState.settings.dark = !appState.settings.dark;
        persistSettings();
        refreshUI();
      });
    }

    if ($('plannedAmount')) $('plannedAmount').addEventListener('input', updatePreview);
    if ($('actualAmount')) $('actualAmount').addEventListener('input', updatePreview);

    if ($('varianceForm')) {
      $('varianceForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const title = ($('itemTitle').value || '').trim();
        const category = $('itemCategory').value;
        const planned = Number($('plannedAmount').value);
        const actual = Number($('actualAmount').value);
        const note = ($('itemNote').value || '').trim();

        if (!title || isNaN(planned) || isNaN(actual)) return;

        const now = new Date();
        const stamp =
          now.getFullYear() +
          '-' +
          String(now.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(now.getDate()).padStart(2, '0') +
          ' ' +
          String(now.getHours()).padStart(2, '0') +
          ':' +
          String(now.getMinutes()).padStart(2, '0');

        appState.records.unshift({
          id: 'item-' + Date.now(),
          period: appState.settings.period,
          title: title,
          category: category,
          planned: planned,
          actual: actual,
          note: note,
          date: stamp
        });

        persistRecords();
        e.target.reset();
        refreshUI();
        openTab('ledger');
      });
    }

    if ($('fullLedgerList')) {
      $('fullLedgerList').addEventListener('click', function (e) {
        const id = e.target.dataset.del;
        if (!id) return;
        appState.records = appState.records.filter(function (r) {
          return r.id !== id;
        });
        persistRecords();
        refreshUI();
      });
    }

    if ($('clearLedgerBtn')) {
      $('clearLedgerBtn').addEventListener('click', function () {
        appState.records = appState.records.filter(function (r) {
          return r.period !== appState.settings.period;
        });
        persistRecords();
        refreshUI();
      });
    }

    if ($('ledgerSearch')) $('ledgerSearch').addEventListener('input', drawLedger);
    if ($('ledgerFilter')) $('ledgerFilter').addEventListener('change', drawLedger);

    if ($('simVolumeSlider')) $('simVolumeSlider').addEventListener('input', drawLab);
    if ($('simPriceSlider')) $('simPriceSlider').addEventListener('input', drawLab);

    if ($('saveScenarioBtn')) {
      $('saveScenarioBtn').addEventListener('click', function () {
        const v = Number($('simVolumeSlider').value);
        const p = Number($('simPriceSlider').value);
        const t = calcTotals(currentRecords());
        const base = t.actual > 0 ? t.actual : t.planned;
        const simActual = Math.round(base * (1 + v / 100) * (1 + p / 100));

        const now = new Date();
        const stamp =
          now.getFullYear() +
          '-' +
          String(now.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(now.getDate()).padStart(2, '0');

        appState.records.unshift({
          id: 'sim-' + Date.now(),
          period: appState.settings.period,
          title: 'محاكاة (كمية ' + (v >= 0 ? '+' : '') + v + '%، سعر ' + (p >= 0 ? '+' : '') + p + '%)',
          category: 'مختبر المحاكاة',
          planned: t.planned,
          actual: simActual,
          note: 'محفوظ من مختبر المحاكاة',
          date: stamp
        });

        persistRecords();
        refreshUI();
        openTab('ledger');
      });
    }

    if ($('aiChatForm')) {
      $('aiChatForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const inp = $('aiPromptInput');
        const txt = (inp.value || '').trim();
        if (!txt) return;
        pushChat(txt, 'user');
        inp.value = '';
        setTimeout(function () {
          pushChat(replyAi(txt), 'bot');
        }, 160);
      });
    }

    document.querySelectorAll('.prompt-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        const txt = chip.dataset.prompt || chip.textContent;
        pushChat(txt, 'user');
        setTimeout(function () {
          pushChat(replyAi(txt), 'bot');
        }, 140);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadData();
    wireEvents();
    refreshUI();
    pushChat('مرحباً بكِ في مساعد ECARTIX الذكي! اسأليني عن الفروقات أو السجل أو وضع الموازنة.', 'bot');
  });
})();
