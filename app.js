const STORAGE_KEY = 'ecartix_records_v2';
const PREFS_KEY = 'ecartix_prefs_v2';

const CURRENCY_RATES = {
  DZD: { symbol: 'د.ج', rate: 1, label: 'د.ج DZD' },
  EUR: { symbol: '€', rate: 1 / 145, label: '€ EUR' },
  USD: { symbol: '$', rate: 1 / 134, label: '$ USD' }
};

const DEFAULT_RECORDS = [
  {
    id: 'rec-1',
    period: 'nov-2026',
    title: 'الإنتاج والتشغيل الأساسي',
    category: 'الإنتاج والتشغيل',
    planned: 1500000,
    actual: 1700000,
    note: 'زيادة نشاط تشغيلية خلال الشهر',
    createdAt: '2026-11-05 10:30'
  },
  {
    id: 'rec-2',
    period: 'nov-2026',
    title: 'المبيعات والإيرادات التجارية',
    category: 'المبيعات والإيرادات',
    planned: 900000,
    actual: 1000000,
    note: 'تحسن الطلب والكميات المباعة',
    createdAt: '2026-11-12 16:15'
  },
  {
    id: 'rec-3',
    period: 'oct-2026',
    title: 'المصاريف الإدارية والتشغيلية',
    category: 'المصاريف الإدارية',
    planned: 1200000,
    actual: 1120000,
    note: 'انضباط في بنود الصرف الإداري',
    createdAt: '2026-10-20 11:00'
  }
];

let state = {
  records: [],
  prefs: {
    currency: 'DZD',
    lang: 'ar',
    period: 'nov-2026',
    dark: false
  }
};

function loadState() {
  try {
    const savedRecords = localStorage.getItem(STORAGE_KEY);
    state.records = savedRecords ? JSON.parse(savedRecords) : [...DEFAULT_RECORDS];
  } catch (e) {
    state.records = [...DEFAULT_RECORDS];
  }

  try {
    const savedPrefs = localStorage.getItem(PREFS_KEY);
    if (savedPrefs) {
      state.prefs = { ...state.prefs, ...JSON.parse(savedPrefs) };
    }
  } catch (e) {}
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

function savePrefs() {
  localStorage.setItem(PREFS_KEY, JSON.stringify(state.prefs));
}

function formatMoney(amountInDzd, includeSign = false) {
  const curr = CURRENCY_RATES[state.prefs.currency] || CURRENCY_RATES.DZD;
  const converted = amountInDzd * curr.rate;
  const absFormatted = Math.abs(converted).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  if (includeSign) {
    const sign = converted > 0 ? '+' : converted < 0 ? '-' : '';
    return `${sign}${absFormatted} ${curr.symbol}`;
  }
  const prefix = converted < 0 ? '-' : '';
  return `${prefix}${absFormatted} ${curr.symbol}`;
}

function getPeriodRecords() {
  return state.records.filter(r => r.period === state.prefs.period);
}

function computeSummary(list) {
  const planned = list.reduce((sum, item) => sum + Number(item.planned || 0), 0);
  const actual = list.reduce((sum, item) => sum + Number(item.actual || 0), 0);
  const variance = actual - planned;
  const performance = planned > 0 ? (actual / planned) * 100 : 0;
  return { planned, actual, variance, performance };
}

function switchTab(targetName) {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === targetName);
  });
  document.querySelectorAll('.tab-view').forEach(sec => {
    sec.classList.toggle('active', sec.id === `view-${targetName}`);
  });
}

function renderDashboard() {
  const periodList = getPeriodRecords();
  const { planned, actual, variance, performance } = computeSummary(periodList);

  document.getElementById('kpiPlanned').textContent = formatMoney(planned);
  document.getElementById('kpiActual').textContent = formatMoney(actual);
  document.getElementById('kpiVariance').textContent = formatMoney(variance, true);
  document.getElementById('kpiPerformance').textContent = `${performance.toFixed(1)}%`;

  const statusEl = document.getElementById('kpiVarianceStatus');
  if (variance > 0) {
    statusEl.textContent = 'انحراف إيجابي (+ أعلى من المخطط)';
  } else if (variance < 0) {
    statusEl.textContent = 'انحراف سلبي (- أقل من المخطط)';
  } else {
    statusEl.textContent = 'تطابق كامل مع المخطط';
  }

  const clampedBar = Math.max(0, Math.min(100, (performance / 150) * 100));
  document.getElementById('performanceBar').style.width = `${clampedBar}%`;
  document.getElementById('progressCaption').textContent = `نسبة التحقق الحالية: ${performance.toFixed(1)}%`;
  document.getElementById('recordCountChip').textContent = `${periodList.length} سجل محفوظ`;

  const recentBox = document.getElementById('recentLedgerList');
  const topThree = periodList.slice(0, 3);
  if (topThree.length === 0) {
    recentBox.innerHTML = `<div class="ledger-sub">لا توجد سجلات بعد لهذه الفترة. أضف بنداً من تبويب "الفروقات".</div>`;
  } else {
    recentBox.innerHTML = topThree.map(item => {
      const diff = Number(item.actual) - Number(item.planned);
      const diffClass = diff >= 0 ? 'pos-text' : 'neg-text';
      return `
        <div class="ledger-item">
          <div class="ledger-main">
            <div class="ledger-title">${escapeHtml(item.title)}</div>
            <div class="ledger-sub">${escapeHtml(item.category)} • ${escapeHtml(item.createdAt)}</div>
          </div>
          <div class="ledger-side">
            <div class="ledger-amount ${diffClass}">${formatMoney(diff, true)}</div>
            <div class="ledger-sub">فعلي: ${formatMoney(item.actual)}</div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function renderVarianceBreakdown() {
  const periodList = getPeriodRecords();
  const box = document.getElementById('varianceBreakdownList');
  if (periodList.length === 0) {
    box.innerHTML = `<div class="ledger-sub">أدخل أول بند أعلاه ليظهر تفصيل الفارق هنا.</div>`;
    return;
  }

  box.innerHTML = periodList.map(item => {
    const diff = Number(item.actual) - Number(item.planned);
    const pct = Number(item.planned) > 0 ? ((diff / Number(item.planned)) * 100).toFixed(1) : '0.0';
    const cls = diff >= 0 ? 'pos-text' : 'neg-text';
    return `
      <div class="ledger-item">
        <div class="ledger-main">
          <div class="ledger-title">${escapeHtml(item.title)}</div>
          <div class="ledger-sub">مخطط: ${formatMoney(item.planned)} | فعلي: ${formatMoney(item.actual)}</div>
        </div>
        <div class="ledger-side">
          <div class="ledger-amount ${cls}">${formatMoney(diff, true)}</div>
          <div class="ledger-sub">(${diff >= 0 ? '+' : ''}${pct}%)</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderLedger() {
  const query = (document.getElementById('ledgerSearch').value || '').trim().toLowerCase();
  const filter = document.getElementById('ledgerFilter').value;
  const listEl = document.getElementById('fullLedgerList');

  const filtered = getPeriodRecords().filter(item => {
    const diff = Number(item.actual) - Number(item.planned);
    const matchesFilter =
      filter === 'all' ||
      (filter === 'favorable' && diff >= 0) ||
      (filter === 'unfavorable' && diff < 0);

    const hay = `${item.title} ${item.category} ${item.note || ''}`.toLowerCase();
    const matchesQuery = !query || hay.includes(query);
    return matchesFilter && matchesQuery;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="ledger-sub">لا توجد عمليات مطابقة في السجل حالياً.</div>`;
    return;
  }

  listEl.innerHTML = filtered.map(item => {
    const diff = Number(item.actual) - Number(item.planned);
    const cls = diff >= 0 ? 'pos-text' : 'neg-text';
    return `
      <div class="ledger-item">
        <div class="ledger-main">
          <div class="ledger-title">${escapeHtml(item.title)}</div>
          <div class="ledger-sub">${escapeHtml(item.category)} • ${escapeHtml(item.createdAt)}</div>
          ${item.note ? `<div class="ledger-sub">ملاحظة: ${escapeHtml(item.note)}</div>` : ''}
        </div>
        <div class="ledger-side">
          <div class="ledger-amount ${cls}">${formatMoney(diff, true)}</div>
          <div class="ledger-sub">فعلي: ${formatMoney(item.actual)}</div>
          <button class="delete-mini-btn" data-delete-id="${item.id}">حذف</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderSimulation() {
  const vol = Number(document.getElementById('simVolumeSlider').value);
  const price = Number(document.getElementById('simPriceSlider').value);
  document.getElementById('simVolumeVal').textContent = `${vol >= 0 ? '+' : ''}${vol}%`;
  document.getElementById('simPriceVal').textContent = `${price >= 0 ? '+' : ''}${price}%`;

  const { planned, actual } = computeSummary(getPeriodRecords());
  const baseActual = actual > 0 ? actual : planned;
  const projectedActual = baseActual * (1 + vol / 100) * (1 + price / 100);
  const projectedVariance = projectedActual - planned;

  document.getElementById('simProjectedActual').textContent = formatMoney(projectedActual);
  document.getElementById('simProjectedVariance').textContent = formatMoney(projectedVariance, true);
}

function appendAiMessage(text, sender = 'bot') {
  const box = document.getElementById('aiChatBox');
  const div = document.createElement('div');
  div.className = `chat-msg ${sender}`;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function generateAiReply(promptText) {
  const periodList = getPeriodRecords();
  const { planned, actual, variance, performance } = computeSummary(periodList);
  const p = promptText.toLowerCase();

  if (p.includes('إحصاء') || p.includes('سجل')) {
    return `يوجد في سجل هذه الفترة ${periodList.length} عملية محفوظة. إجمالي المخطط ${formatMoney(planned)} وإجمالي الفعلي ${formatMoney(actual)}.`;
  }
  if (p.includes('سبب') || p.includes('تفسير') || p.includes('تعامل')) {
    if (variance > 0) {
      return `الفارق الحالي موجب بمقدار ${formatMoney(variance, true)}. يُنصح بفصل أثر الحجم عن أثر السعر/التكلفة للتأكد ما إذا كان ناتجاً عن نمو فعلي أو ارتفاع تكاليف.`;
    }
    if (variance < 0) {
      return `الفارق الحالي سالب بمقدار ${formatMoney(variance, true)}. راجعي البنود الأقل من المخطط وتحققّي مما إذا كان هناك تأخير تنفيذي أو وفر حقيقي.`;
    }
    return `الفعلي مطابق تماماً للمخطط (${formatMoney(0)}). الأداء متوازن حالياً.`;
  }
  return `ملخص الفترة الحالية: المخطط ${formatMoney(planned)}، الفعلي ${formatMoney(actual)}، الفارق ${formatMoney(variance, true)}، ونسبة الأداء ${performance.toFixed(1)}%.`;
}

function updateLivePreview() {
  const planned = Number(document.getElementById('plannedAmount').value || 0);
  const actual = Number(document.getElementById('actualAmount').value || 0);
  const diff = actual - planned;
  const pct = planned > 0 ? ((diff / planned) * 100).toFixed(1) : '0.0';
  const el = document.getElementById('previewDiffValue');
  el.textContent = `${formatMoney(diff, true)} (${diff >= 0 ? '+' : ''}${pct}%)`;
  el.className = diff >= 0 ? 'pos-text' : 'neg-text';
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderAll() {
  document.body.classList.toggle('dark-theme', Boolean(state.prefs.dark));
  document.getElementById('currencySelect').value = state.prefs.currency;
  document.getElementById('langSelect').value = state.prefs.lang;
  document.getElementById('periodSelect').value = state.prefs.period;

  renderDashboard();
  renderVarianceBreakdown();
  renderLedger();
  renderSimulation();
  updateLivePreview();
}

function bindEvents() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.target));
  });

  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.jump));
  });

  document.getElementById('quickAddBtn').addEventListener('click', () => {
    switchTab('variance');
    document.getElementById('itemTitle').focus();
  });

  document.getElementById('currencySelect').addEventListener('change', e => {
    state.prefs.currency = e.target.value;
    savePrefs();
    renderAll();
  });

  document.getElementById('langSelect').addEventListener('change', e => {
    state.prefs.lang = e.target.value;
    document.documentElement.lang = e.target.value;
    document.documentElement.dir = e.target.value === 'ar' ? 'rtl' : 'ltr';
    savePrefs();
  });

  document.getElementById('periodSelect').addEventListener('change', e => {
    state.prefs.period = e.target.value;
    savePrefs();
    renderAll();
  });

  document.getElementById('themeToggle').addEventListener('click', () => {
    state.prefs.dark = !state.prefs.dark;
    savePrefs();
    renderAll();
  });

  document.getElementById('plannedAmount').addEventListener('input', updateLivePreview);
  document.getElementById('actualAmount').addEventListener('input', updateLivePreview);

  document.getElementById('varianceForm').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('itemTitle').value.trim();
    const category = document.getElementById('itemCategory').value;
    const planned = Number(document.getElementById('plannedAmount').value);
    const actual = Number(document.getElementById('actualAmount').value);
    const note = document.getElementById('itemNote').value.trim();

    if (!title || Number.isNaN(planned) || Number.isNaN(actual)) return;

    const now = new Date();
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    state.records.unshift({
      id: `rec-${Date.now()}`,
      period: state.prefs.period,
      title,
      category,
      planned,
      actual,
      note,
      createdAt: stamp
    });

    saveRecords();
    e.target.reset();
    renderAll();
    switchTab('ledger');
  });

  document.getElementById('fullLedgerList').addEventListener('click', e => {
    const delId = e.target.dataset.deleteId;
    if (!delId) return;
    state.records = state.records.filter(item => item.id !== delId);
    saveRecords();
    renderAll();
  });

  document.getElementById('clearLedgerBtn').addEventListener('click', () => {
    state.records = state.records.filter(item => item.period !== state.prefs.period);
    saveRecords();
    renderAll();
  });

  document.getElementById('ledgerSearch').addEventListener('input', renderLedger);
  document.getElementById('ledgerFilter').addEventListener('change', renderLedger);

  document.getElementById('simVolumeSlider').addEventListener('input', renderSimulation);
  document.getElementById('simPriceSlider').addEventListener('input', renderSimulation);

  document.getElementById('saveScenarioBtn').addEventListener('click', () => {
    const vol = Number(document.getElementById('simVolumeSlider').value);
    const price = Number(document.getElementById('simPriceSlider').value);
    const { planned, actual } = computeSummary(getPeriodRecords());
    const baseActual = actual > 0 ? actual : planned;
    const projectedActual = Math.round(baseActual * (1 + vol / 100) * (1 + price / 100));

    const now = new Date();
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    state.records.unshift({
      id: `sim-${Date.now()}`,
      period: state.prefs.period,
      title: `محاكاة (كمية ${vol >= 0 ? '+' : ''}${vol}%، سعر ${price >= 0 ? '+' : ''}${price}%)`,
      category: 'مختبر المحاكاة',
      planned,
      actual: projectedActual,
      note: 'تم حفظه من مختبر المحاكاة',
      createdAt: stamp
    });

    saveRecords();
    renderAll();
    switchTab('ledger');
  });

  document.getElementById('aiChatForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('aiPromptInput');
    const text = input.value.trim();
    if (!text) return;
    appendAiMessage(text, 'user');
    input.value = '';
    setTimeout(() => {
      appendAiMessage(generateAiReply(text), 'bot');
    }, 180);
  });

  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.dataset.prompt;
      appendAiMessage(text, 'user');
      setTimeout(() => {
        appendAiMessage(generateAiReply(text), 'bot');
      }, 150);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  bindEvents();
  renderAll();
  appendAiMessage('أهلاً بكِ في مساعد ECARTIX الذكي! اسأليني عن وضع الموازنة أو سبب الفارق أو إحصاء السجلات المحفوظة.', 'bot');
});
