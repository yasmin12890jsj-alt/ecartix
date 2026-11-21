const CURRENCIES = {
  DZD: { symbol: 'د.ج', rateFromDZD: 1 },
  EUR: { symbol: '€', rateFromDZD: 0.0068 },
  USD: { symbol: '$', rateFromDZD: 0.0074 },
  GBP: { symbol: '£', rateFromDZD: 0.0058 },
  CAD: { symbol: 'CA$', rateFromDZD: 0.0102 },
  CHF: { symbol: 'CHF', rateFromDZD: 0.0065 },
  SAR: { symbol: '﷼', rateFromDZD: 0.0278 },
  AED: { symbol: 'د.إ', rateFromDZD: 0.0272 },
  MAD: { symbol: 'د.م', rateFromDZD: 0.0740 },
  TND: { symbol: 'د.ت', rateFromDZD: 0.0231 }
};

const I18N = {
  ar: {
    dir: 'rtl',
    tagline: 'افهم كل فرق — Understand Every Difference',
    tabs: {
      dashboard: 'لوحة القيادة',
      variance: 'تحليل الفروقات',
      lab: 'مختبر المحاكاة LAB',
      formulas: 'مكتبة القوانين',
      calendar: 'التقويم والزمن',
      currencies: 'العملات',
      statistics: 'الإحصاء والرسوم',
      reports: 'التقارير',
      data: 'إدارة البيانات'
    },
    kpi: {
      planned: 'إجمالي المخطط',
      actual: 'إجمالي الفعلي',
      variance: 'إجمالي الفارق',
      perf: 'نسبة الأداء',
      count: 'عدد البنود',
      favUnfav: 'ملائم / غير ملائم'
    },
    fav: 'ملائم (Favorable)',
    unfav: 'غير ملائم (Unfavorable)',
    neutral: 'متعادل (Neutral)',
    categories: {
      sales: 'فارق المبيعات (Sales)',
      purchase: 'فارق الشراء (Purchase)',
      production: 'فارق الإنتاج (Production)',
      material: 'فارق تكلفة المواد (Material Cost)',
      labor: 'فارق الأجور (Labor)',
      fixed_cost: 'فارق التكاليف الثابتة (Fixed Cost)',
      variable_cost: 'فارق التكاليف المتغيرة (Variable Cost)',
      revenue: 'فارق الإيرادات (Revenue)',
      expense: 'فارق المصروفات (Expense)',
      budget: 'فارق الميزانية (Budget)',
      profit: 'فارق الربح (Profit)',
      price_qty: 'فارق السعر والكمية (Price & Qty)',
      efficiency: 'فارق الكفاءة والإنتاجية (Efficiency & Productivity)'
    }
  },
  fr: {
    dir: 'ltr',
    tagline: 'Comprendre chaque différence — Understand Every Difference',
    tabs: {
      dashboard: 'Tableau de bord',
      variance: 'Analyse des écarts',
      lab: 'VARIANCE LAB',
      formulas: 'Formules',
      calendar: 'Calendrier',
      currencies: 'Devises',
      statistics: 'Statistiques',
      reports: 'Rapports',
      data: 'Données'
    },
    kpi: {
      planned: 'Total Prévu',
      actual: 'Total Réel',
      variance: 'Écart Total',
      perf: 'Performance %',
      count: 'Nombre d’éléments',
      favUnfav: 'Favorable / Défavorable'
    },
    fav: 'Favorable',
    unfav: 'Défavorable',
    neutral: 'Neutre',
    categories: {
      sales: 'Écart sur ventes',
      purchase: 'Écart sur achats',
      production: 'Écart sur production',
      material: 'Écart coût matières',
      labor: 'Écart main-d’œuvre',
      fixed_cost: 'Écart charges fixes',
      variable_cost: 'Écart charges variables',
      revenue: 'Écart produits / revenus',
      expense: 'Écart charges / dépenses',
      budget: 'Écart budgétaire',
      profit: 'Écart de résultat / profit',
      price_qty: 'Écart prix & quantité',
      efficiency: 'Écart efficience & productivité'
    }
  },
  en: {
    dir: 'ltr',
    tagline: 'Understand Every Difference',
    tabs: {
      dashboard: 'Dashboard',
      variance: 'Variance Analysis',
      lab: 'VARIANCE LAB',
      formulas: 'Formula Library',
      calendar: 'Calendar & Time',
      currencies: 'Currencies',
      statistics: 'Statistics & Charts',
      reports: 'Reports',
      data: 'Data Management'
    },
    kpi: {
      planned: 'Total Planned',
      actual: 'Total Actual',
      variance: 'Total Variance',
      perf: 'Achievement %',
      count: 'Items Count',
      favUnfav: 'Favorable / Unfavorable'
    },
    fav: 'Favorable',
    unfav: 'Unfavorable',
    neutral: 'Neutral',
    categories: {
      sales: 'Sales Variance',
      purchase: 'Purchase Variance',
      production: 'Production Variance',
      material: 'Material Cost Variance',
      labor: 'Labor Variance',
      fixed_cost: 'Fixed Cost Variance',
      variable_cost: 'Variable Cost Variance',
      revenue: 'Revenue Variance',
      expense: 'Expense Variance',
      budget: 'Budget Variance',
      profit: 'Profit Variance',
      price_qty: 'Price & Quantity Variance',
      efficiency: 'Efficiency & Productivity Variance'
    }
  }
};

function createSampleState() {
  return {
    lang: 'ar',
    dark: false,
    currency: 'DZD',
    rates: { ...CURRENCIES },
    liveRatesEnabled: false,
    passwordHash: '',
    activeProjectId: 'proj-1',
    reportMeta: {
      company: 'ECARTIX Finance DZ',
      period: '2026-11',
      notes: 'تقرير تحليل الفروقات المالية والموازنات'
    },
    projects: [
      {
        id: 'proj-1',
        name: 'الموازنة التشغيلية — نوفمبر 2026',
        items: [
          { id: 1, name: 'مبيعات المنتجات الرئيسية', category: 'sales', date: '2026-11-05', planned: 1200000, actual: 1350000, stdPrice: 1200, actPrice: 1350, stdQty: 1000, actQty: 1000, ratePerDZD: 1 },
          { id: 2, name: 'مواد أولية إنتاجية', category: 'material', date: '2026-11-10', planned: 450000, actual: 495000, stdPrice: 450, actPrice: 495, stdQty: 1000, actQty: 1000, ratePerDZD: 1 },
          { id: 3, name: 'أجور العمال المباشرة', category: 'labor', date: '2026-11-15', planned: 280000, actual: 260000, stdPrice: 280, actPrice: 260, stdQty: 1000, actQty: 1000, ratePerDZD: 1 },
          { id: 4, name: 'مصاريف إدارية ثابتة', category: 'fixed_cost', date: '2026-11-18', planned: 150000, actual: 150000, stdPrice: 150000, actPrice: 150000, stdQty: 1, stdQtyActual: 1, actQty: 1, ratePerDZD: 1 },
          { id: 5, name: 'صافي الربح التشغيلي', category: 'profit', date: '2026-11-20', planned: 320000, actual: 445000, stdPrice: 320, actPrice: 445, stdQty: 1000, actQty: 1000, ratePerDZD: 1 }
        ]
      },
      {
        id: 'proj-2',
        name: 'مشروع الربع الرابع 2026',
        items: [
          { id: 101, name: 'عقود توريد إقليمية', category: 'revenue', date: '2026-10-12', planned: 900000, actual: 840000, stdPrice: 900, actPrice: 840, stdQty: 1000, actQty: 1000, ratePerDZD: 1 },
          { id: 102, name: 'شحن ونقل وتوزيع', category: 'expense', date: '2026-10-22', planned: 110000, actual: 98000, stdPrice: 110, actPrice: 98, stdQty: 1000, actQty: 1000, ratePerDZD: 1 }
        ]
      }
    ]
  };
}

let state = loadState();
let editingItemId = null;

function loadState() {
  try {
    const raw = localStorage.getItem('ecartix_state_v1');
    if (!raw) return createSampleState();
    const parsed = JSON.parse(raw);
    return { ...createSampleState(), ...parsed };
  } catch {
    return createSampleState();
  }
}

function saveState() {
  try {
    localStorage.setItem('ecartix_state_v1', JSON.stringify(state));
  } catch (e) {
    console.warn('Storage save issue:', e);
  }
}

function getActiveProject() {
  return state.projects.find((p) => p.id === state.activeProjectId) || state.projects[0];
}

function isCostCategory(cat) {
  return ['purchase', 'material', 'labor', 'fixed_cost', 'variable_cost', 'expense'].includes(cat);
}

function computeVariance(item) {
  const planned = Number(item.planned) || 0;
  const actual = Number(item.actual) || 0;
  const absVar = actual - planned;
  const varPct = planned !== 0 ? (absVar / Math.abs(planned)) * 100 : (actual === 0 ? 0 : 100);
  const achievePct = planned !== 0 ? (actual / planned) * 100 : (actual > 0 ? 100 : 0);

  let status = 'neutral';
  if (absVar !== 0) {
    if (isCostCategory(item.category)) {
      status = absVar < 0 ? 'fav' : 'unfav';
    } else {
      status = absVar > 0 ? 'fav' : 'unfav';
    }
  }

  const sp = Number(item.stdPrice) || 0;
  const ap = Number(item.actPrice) || 0;
  const sq = Number(item.stdQty) || 0;
  const aq = Number(item.actQty) || 0;
  const priceVar = (ap - sp) * aq;
  const qtyVar = (aq - sq) * sp;

  return { absVar, varPct, achievePct, status, priceVar, qtyVar };
}

function formatMoney(amountDZD, customRate) {
  const cur = state.currency || 'DZD';
  const rate = typeof customRate === 'number' && customRate > 0 ? customRate : (state.rates[cur]?.rateFromDZD || 1);
  const symbol = state.rates[cur]?.symbol || cur;
  const val = (Number(amountDZD) || 0) * rate;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
  return `${formatted} ${symbol}`;
}

function setLanguage(lang) {
  state.lang = ['ar', 'fr', 'en'].includes(lang) ? lang : 'ar';
  const dict = I18N[state.lang];
  document.documentElement.lang = state.lang;
  document.documentElement.dir = dict.dir;
  document.getElementById('langSelect').value = state.lang;
  document.getElementById('splashTagline').textContent = dict.tagline;

  document.querySelectorAll('[data-tab]').forEach((btn) => {
    const key = btn.getAttribute('data-tab');
    if (dict.tabs[key]) btn.textContent = dict.tabs[key];
  });

  saveState();
  renderAll();
}

function toggleDarkMode() {
  state.dark = !state.dark;
  document.body.classList.toggle('dark', state.dark);
  saveState();
  renderCharts();
}

function switchTab(tabName) {
  document.querySelectorAll('.nav-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
  });
  document.querySelectorAll('.section').forEach((sec) => {
    sec.classList.toggle('active', sec.id === `sec-${tabName}`);
  });
  if (tabName === 'statistics' || tabName === 'dashboard') {
    renderCharts();
  }
}

function skipSplash() {
  document.getElementById('splashScreen').classList.add('hidden');
}

function renderProjectSelects() {
  const selects = ['projectSelect', 'dataProjectSelect'];
  selects.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = state.projects
      .map((p) => `<option value="${p.id}" ${p.id === state.activeProjectId ? 'selected' : ''}>${escapeHtml(p.name)}</option>`)
      .join('');
  });
}

function switchProject(projId) {
  if (state.projects.some((p) => p.id === projId)) {
    state.activeProjectId = projId;
    saveState();
    renderAll();
  }
}

function createProject() {
  const input = document.getElementById('newProjectName');
  const name = (input.value || '').trim();
  if (!name) return;
  const newProj = {
    id: 'proj-' + Date.now(),
    name,
    items: []
  };
  state.projects.push(newProj);
  state.activeProjectId = newProj.id;
  input.value = '';
  saveState();
  renderAll();
}

function deleteActiveProject() {
  if (state.projects.length <= 1) {
    alert(state.lang === 'ar' ? 'يجب الإبقاء على مشروع واحد على الأقل.' : 'At least one project must remain.');
    return;
  }
  const proj = getActiveProject();
  const msg = state.lang === 'ar'
    ? `هل أنت متأكد من حذف المشروع "${proj.name}" وجميع بنوده؟`
    : `Delete project "${proj.name}" and all its items?`;
  if (!confirm(msg)) return;
  state.projects = state.projects.filter((p) => p.id !== proj.id);
  state.activeProjectId = state.projects[0].id;
  saveState();
  renderAll();
}

function populateCategorySelects() {
  const dict = I18N[state.lang].categories;
  const opts = Object.entries(dict)
    .map(([k, label]) => `<option value="${k}">${label}</option>`)
    .join('');
  const itemCat = document.getElementById('itemCategory');
  const filterCat = document.getElementById('filterCategory');
  if (itemCat) itemCat.innerHTML = opts;
  if (filterCat) filterCat.innerHTML = `<option value="all">${state.lang === 'ar' ? 'كل الفئات' : 'All Categories'}</option>` + opts;
}

function saveVarianceItem(e) {
  e.preventDefault();
  const name = document.getElementById('itemName').value.trim();
  const category = document.getElementById('itemCategory').value;
  const date = document.getElementById('itemDate').value || '2026-11-21';
  const planned = Number(document.getElementById('itemPlanned').value);
  const actual = Number(document.getElementById('itemActual').value);
  const stdPrice = Number(document.getElementById('itemStdPrice').value) || 0;
  const actPrice = Number(document.getElementById('itemActPrice').value) || 0;
  const stdQty = Number(document.getElementById('itemStdQty').value) || 0;
  const actQty = Number(document.getElementById('itemActQty').value) || 0;

  if (!name || Number.isNaN(planned) || Number.isNaN(actual)) return;

  const proj = getActiveProject();
  if (editingItemId !== null) {
    const idx = proj.items.findIndex((i) => i.id === editingItemId);
    if (idx > -1) {
      proj.items[idx] = {
        ...proj.items[idx],
        name, category, date, planned, actual, stdPrice, actPrice, stdQty, actQty
      };
    }
    editingItemId = null;
    document.getElementById('cancelEditBtn').style.display = 'none';
  } else {
    proj.items.push({
      id: Date.now(),
      name, category, date, planned, actual, stdPrice, actPrice, stdQty, actQty,
      ratePerDZD: state.rates[state.currency]?.rateFromDZD || 1
    });
  }

  document.getElementById('varianceForm').reset();
  document.getElementById('itemDate').value = '2026-11-21';
  saveState();
  renderAll();
}

function editItem(id) {
  const proj = getActiveProject();
  const item = proj.items.find((i) => i.id === id);
  if (!item) return;
  editingItemId = id;
  document.getElementById('itemName').value = item.name;
  document.getElementById('itemCategory').value = item.category;
  document.getElementById('itemDate').value = item.date;
  document.getElementById('itemPlanned').value = item.planned;
  document.getElementById('itemActual').value = item.actual;
  document.getElementById('itemStdPrice').value = item.stdPrice || '';
  document.getElementById('itemActPrice').value = item.actPrice || '';
  document.getElementById('itemStdQty').value = item.stdQty || '';
  document.getElementById('itemActQty').value = item.actQty || '';
  document.getElementById('cancelEditBtn').style.display = 'inline-flex';
  switchTab('variance');
}

function cancelEdit() {
  editingItemId = null;
  document.getElementById('varianceForm').reset();
  document.getElementById('itemDate').value = '2026-11-21';
  document.getElementById('cancelEditBtn').style.display = 'none';
}

function deleteItem(id) {
  const msg = state.lang === 'ar' ? 'هل تريد حذف هذا البند نهائياً؟' : 'Delete this item permanently?';
  if (!confirm(msg)) return;
  const proj = getActiveProject();
  proj.items = proj.items.filter((i) => i.id !== id);
  saveState();
  renderAll();
}

function renderDashboard() {
  const proj = getActiveProject();
  const items = proj.items || [];
  let totalPlanned = 0;
  let totalActual = 0;
  let favCount = 0;
  let unfavCount = 0;

  items.forEach((it) => {
    totalPlanned += Number(it.planned) || 0;
    totalActual += Number(it.actual) || 0;
    const c = computeVariance(it);
    if (c.status === 'fav') favCount++;
    else if (c.status === 'unfav') unfavCount++;
  });

  const totalVar = totalActual - totalPlanned;
  const perfPct = totalPlanned !== 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : '0.0';
  const k = I18N[state.lang].kpi;

  document.getElementById('kpiGrid').innerHTML = `
    <div class="kpi-card kpi-lavender">
      <div class="kpi-label">${k.planned}</div>
      <div class="kpi-value">${formatMoney(totalPlanned)}</div>
    </div>
    <div class="kpi-card kpi-mint">
      <div class="kpi-label">${k.actual}</div>
      <div class="kpi-value">${formatMoney(totalActual)}</div>
    </div>
    <div class="kpi-card ${totalVar >= 0 ? 'kpi-yellow' : 'kpi-peach'}">
      <div class="kpi-label">${k.variance}</div>
      <div class="kpi-value">${totalVar >= 0 ? '+' : ''}${formatMoney(totalVar)}</div>
    </div>
    <div class="kpi-card kpi-surface">
      <div class="kpi-label">${k.perf}</div>
      <div class="kpi-value">${perfPct}%</div>
    </div>
    <div class="kpi-card kpi-surface">
      <div class="kpi-label">${k.count}</div>
      <div class="kpi-value">${items.length}</div>
    </div>
    <div class="kpi-card kpi-surface">
      <div class="kpi-label">${k.favUnfav}</div>
      <div class="kpi-value">${favCount} / ${unfavCount}</div>
    </div>
  `;

  document.getElementById('recentProjectsList').innerHTML = state.projects
    .map((p) => {
      const pSum = p.items.reduce((acc, x) => acc + ((Number(x.actual) || 0) - (Number(x.planned) || 0)), 0);
      return `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;border-bottom:1px solid var(--border);gap:8px;">
          <div>
            <strong>${escapeHtml(p.name)}</strong><br>
            <small style="color:var(--text-muted)">${p.items.length} ${state.lang === 'ar' ? 'بند' : 'items'}</small>
          </div>
          <div style="text-align:end;">
            <span class="badge ${pSum >= 0 ? 'badge-fav' : 'badge-unfav'}">${pSum >= 0 ? '+' : ''}${formatMoney(pSum)}</span>
            <button class="btn btn-outline" style="padding:5px 10px;margin-inline-start:6px;" onclick="switchProject('${p.id}')">${state.lang === 'ar' ? 'فتح' : 'Open'}</button>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderVarianceTable() {
  const proj = getActiveProject();
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const catFilter = document.getElementById('filterCategory')?.value || 'all';
  const statusFilter = document.getElementById('filterStatus')?.value || 'all';
  const catLabels = I18N[state.lang].categories;

  const filtered = (proj.items || []).filter((item) => {
    const c = computeVariance(item);
    const matchName = !q || item.name.toLowerCase().includes(q) || (catLabels[item.category] || '').toLowerCase().includes(q);
    const matchCat = catFilter === 'all' || item.category === catFilter;
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchName && matchCat && matchStatus;
  });

  const tbody = document.getElementById('varianceTableBody');
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:20px;">${state.lang === 'ar' ? 'لا توجد بنود مطابقة.' : 'No matching items.'}</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered
    .map((item) => {
      const c = computeVariance(item);
      const badgeClass = c.status === 'fav' ? 'badge-fav' : c.status === 'unfav' ? 'badge-unfav' : 'badge-neutral';
      const statusText = c.status === 'fav' ? I18N[state.lang].fav : c.status === 'unfav' ? I18N[state.lang].unfav : I18N[state.lang].neutral;
      return `
        <tr>
          <td><strong>${escapeHtml(item.name)}</strong><br><small style="color:var(--text-muted)">${item.date || ''}</small></td>
          <td>${catLabels[item.category] || item.category}</td>
          <td>${formatMoney(item.planned)}</td>
          <td>${formatMoney(item.actual)}</td>
          <td><strong>${c.absVar >= 0 ? '+' : ''}${formatMoney(c.absVar)}</strong></td>
          <td>${c.varPct.toFixed(1)}% (${c.achievePct.toFixed(1)}%)</td>
          <td><span class="badge ${badgeClass}">${statusText}</span></td>
          <td>
            <button class="btn btn-outline" style="padding:5px 9px;" onclick="editItem(${item.id})">✏️</button>
            <button class="btn btn-danger" style="padding:5px 9px;" onclick="deleteItem(${item.id})">🗑️</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderFormulas() {
  const list = [
    {
      title: '1. الفارق المطلق (Absolute Variance)',
      formula: 'Variance = Actual - Planned',
      example: 'مثال: فعلي 1,350,000 د.ج − مخطط 1,200,000 د.ج = +150,000 د.ج'
    },
    {
      title: '2. نسبة الفارق (Variance %)',
      formula: 'Variance % = ((Actual - Planned) / |Planned|) × 100',
      example: 'مثال: (+150,000 / 1,200,000) × 100 = +12.5%'
    },
    {
      title: '3. نسبة الإنجاز (Achievement %)',
      formula: 'Achievement % = (Actual / Planned) × 100',
      example: 'مثال: (1,350,000 / 1,200,000) × 100 = 112.5%'
    },
    {
      title: '4. فارق السعر وفارق الكمية (Price & Volume Variance)',
      formula: 'Price Var = (AP - SP) × AQ | Volume Var = (AQ - SQ) × SP',
      example: 'مثال: إذا ارتفع سعر الوحدة من 1,200 إلى 1,350 لـ 1,000 وحدة فالفارق السعري +150,000'
    },
    {
      title: '5. المؤشرات الإحصائية (Mean, Median, Mode, StdDev, CV, Correlation)',
      formula: 'Mean = Σx/n | CV = (σ / Mean) × 100',
      example: 'يحسب التطبيق تلقائياً الوسط، الوسيط، المنوال، المدى، التباين، الانحراف المعياري، معامل الاختلاف، والارتباط من بيانات مشروعك.'
    }
  ];

  document.getElementById('formulasList').innerHTML = list
    .map((f) => `
      <div class="formula-box">
        <strong>${f.title}</strong><br>
        <span class="formula-math">${f.formula}</span><br>
        <small style="color:var(--text-muted)">${f.example}</small>
      </div>
    `)
    .join('');

  const items = getActiveProject().items || [];
  const vals = items.map((i) => (Number(i.actual) || 0) - (Number(i.planned) || 0));
  const stats = calcStatsArray(vals);
  document.getElementById('liveStatsBox').innerHTML = `
    <div class="grid-3">
      <div class="kpi-card kpi-lavender"><div class="kpi-label">الوسط الحسابي (Mean)</div><div class="kpi-value">${formatMoney(stats.mean)}</div></div>
      <div class="kpi-card kpi-mint"><div class="kpi-label">الوسيط (Median)</div><div class="kpi-value">${formatMoney(stats.median)}</div></div>
      <div class="kpi-card kpi-yellow"><div class="kpi-label">المنوال (Mode)</div><div class="kpi-value">${stats.mode !== null ? formatMoney(stats.mode) : '—'}</div></div>
      <div class="kpi-card kpi-surface"><div class="kpi-label">المدى (Range)</div><div class="kpi-value">${formatMoney(stats.range)}</div></div>
      <div class="kpi-card kpi-surface"><div class="kpi-label">الانحراف المعياري (σ)</div><div class="kpi-value">${formatMoney(stats.stdDev)}</div></div>
      <div class="kpi-card kpi-peach"><div class="kpi-label">معامل الاختلاف (CV%)</div><div class="kpi-value">${stats.cv.toFixed(1)}%</div></div>
    </div>
  `;
}

function calcStatsArray(arr) {
  if (!arr.length) return { mean: 0, median: 0, mode: null, range: 0, variance: 0, stdDev: 0, cv: 0 };
  const n = arr.length;
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const sorted = [...arr].sort((a, b) => a - b);
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
  const freq = {};
  let maxF = 1;
  let mode = null;
  arr.forEach((v) => {
    freq[v] = (freq[v] || 0) + 1;
    if (freq[v] > maxF) { maxF = freq[v]; mode = v; }
  });
  const range = sorted[n - 1] - sorted[0];
  const variance = arr.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  const cv = mean !== 0 ? Math.abs((stdDev / mean) * 100) : 0;
  return { mean, median, mode, range, variance, stdDev, cv };
}

function runCalendarAnalysis() {
  const year = document.getElementById('calYear')?.value || '2026';
  const month = document.getElementById('calMonth')?.value || 'all';
  const quarter = document.getElementById('calQuarter')?.value || 'all';
  const fromDate = document.getElementById('calFrom')?.value || '';
  const toDate = document.getElementById('calTo')?.value || '';

  const allItems = state.projects.flatMap((p) => p.items || []);
  const matched = allItems.filter((it) => {
    const d = it.date || '';
    if (year !== 'all' && !d.startsWith(year)) return false;
    const m = d.split('-')[1] || '';
    if (month !== 'all' && m !== month) return false;
    if (quarter !== 'all') {
      const mNum = Number(m);
      const qNum = Math.ceil(mNum / 3);
      if (String(qNum) !== quarter) return false;
    }
    if (fromDate && d < fromDate) return false;
    if (toDate && d > toDate) return false;
    return true;
  });

  const sumPlan = matched.reduce((s, x) => s + (Number(x.planned) || 0), 0);
  const sumAct = matched.reduce((s, x) => s + (Number(x.actual) || 0), 0);
  const sumVar = sumAct - sumPlan;

  document.getElementById('calResultBox').innerHTML = `
    <div class="grid-3">
      <div class="kpi-card kpi-lavender"><div class="kpi-label">عدد البنود للفترة</div><div class="kpi-value">${matched.length}</div></div>
      <div class="kpi-card kpi-mint"><div class="kpi-label">إجمالي الفعلي</div><div class="kpi-value">${formatMoney(sumAct)}</div></div>
      <div class="kpi-card kpi-yellow"><div class="kpi-label">الفارق الزمني</div><div class="kpi-value">${sumVar >= 0 ? '+' : ''}${formatMoney(sumVar)}</div></div>
    </div>
  `;
}

function renderCurrencies() {
  const sel = document.getElementById('currencySelect');
  if (sel) sel.value = state.currency;

  const grid = document.getElementById('currencyRatesGrid');
  if (!grid) return;
  grid.innerHTML = Object.entries(state.rates)
    .map(([code, obj]) => `
      <div class="form-group">
        <label>${code} (${obj.symbol}) — مقابل 1 د.ج</label>
        <input type="number" step="0.0001" value="${obj.rateFromDZD}" onchange="updateRate('${code}', this.value)">
      </div>
    `)
    .join('');
}

function changeCurrency(code) {
  if (state.rates[code]) {
    state.currency = code;
    saveState();
    renderAll();
  }
}

function updateRate(code, val) {
  const num = Number(val);
  if (num > 0 && state.rates[code]) {
    state.rates[code].rateFromDZD = num;
    saveState();
    renderAll();
  }
}

async function fetchLiveRates() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/DZD');
    const data = await res.json();
    if (data && data.rates) {
      Object.keys(state.rates).forEach((code) => {
        if (code !== 'DZD' && typeof data.rates[code] === 'number') {
          state.rates[code].rateFromDZD = Number(data.rates[code].toFixed(5));
        }
      });
      saveState();
      renderAll();
      alert(state.lang === 'ar' ? 'تم تحديث أسعار الصرف بنجاح.' : 'Exchange rates updated.');
    }
  } catch {
    alert(state.lang === 'ar' ? 'تعذر الاتصال بخدمة الأسعار الحية؛ يمكنكِ إدخال السعر يدوياً.' : 'Live rates unavailable; edit manually.');
  }
}

function runSimulation() {
  const proj = getActiveProject();
  const basePlan = proj.items.reduce((s, x) => s + (Number(x.planned) || 0), 0);
  const baseAct = proj.items.reduce((s, x) => s + (Number(x.actual) || 0), 0);
  const baseVar = baseAct - basePlan;

  const expPct = Number(document.getElementById('labExpensePct')?.value || 0);
  const pricePct = Number(document.getElementById('labPricePct')?.value || 0);
  const prodPct = Number(document.getElementById('labProdPct')?.value || 0);

  const simAct = baseAct * (1 + pricePct / 100) * (1 + prodPct / 100) - baseAct * 0.35 * (expPct / 100);
  const simVar = simAct - basePlan;
  const impact = simVar - baseVar;

  const advice = [];
  if (pricePct > 0) advice.push('رفع أسعار البيع يعزز الإيرادات والهوامش بشرط الحفاظ على حجم الطلب.');
  if (expPct < 0) advice.push('تخفيض المصروفات يحسّن الفروقات الملائمة مباشرة.');
  if (prodPct > 0) advice.push('زيادة الإنتاج تحسّن امتصاص التكاليف الثابتة لكل وحدة.');
  if (!advice.length) advice.push('عدّلي نسب المحاكاة لاختبار سيناريوهات الأسعار والتكاليف والإنتاج.');

  document.getElementById('labResultBox').innerHTML = `
    <span class="badge badge-neutral">نتيجة محاكاة (Simulated Result)</span>
    <div class="grid-3" style="margin-top:12px;">
      <div class="kpi-card kpi-surface"><div class="kpi-label">الفارق قبل المحاكاة</div><div class="kpi-value">${formatMoney(baseVar)}</div></div>
      <div class="kpi-card kpi-mint"><div class="kpi-label">الفارق بعد المحاكاة</div><div class="kpi-value">${formatMoney(simVar)}</div></div>
      <div class="kpi-card kpi-lavender"><div class="kpi-label">الأثر الصافي للتعديل</div><div class="kpi-value">${impact >= 0 ? '+' : ''}${formatMoney(impact)}</div></div>
    </div>
    <ul style="margin-top:12px;padding-inline-start:18px;">
      ${advice.map((a) => `<li>${a}</li>`).join('')}
    </ul>
  `;
}

function renderCharts() {
  const items = getActiveProject().items || [];
  const barCanvas = document.getElementById('barChart');
  const lineCanvas = document.getElementById('lineChart');
  const pieCanvas = document.getElementById('pieChart');
  if (!barCanvas || !lineCanvas || !pieCanvas) return;

  drawBarChart(barCanvas, items);
  drawLineChart(lineCanvas, items);
  drawPieChart(pieCanvas, items);
}

function drawBarChart(canvas, items) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.parentElement.clientWidth || 340;
  const h = canvas.height = 220;
  ctx.clearRect(0, 0, w, h);

  if (!items.length) return;
  const slice = items.slice(0, 5);
  const maxVal = Math.max(...slice.map((i) => Math.max(Math.abs(i.planned || 0), Math.abs(i.actual || 0))), 1);
  const barW = Math.max(18, Math.floor((w - 60) / (slice.length * 2.5)));

  slice.forEach((it, idx) => {
    const xBase = 36 + idx * (barW * 2.4);
    const pH = ((Number(it.planned) || 0) / maxVal) * (h - 60);
    const aH = ((Number(it.actual) || 0) / maxVal) * (h - 60);

    ctx.fillStyle = '#D8CBFF';
    ctx.fillRect(xBase, h - 30 - Math.max(0, pH), barW, Math.max(2, Math.abs(pH)));

    ctx.fillStyle = '#7655E8';
    ctx.fillRect(xBase + barW + 4, h - 30 - Math.max(0, aH), barW, Math.max(2, Math.abs(aH)));

    ctx.fillStyle = state.dark ? '#F4F5FF' : '#131B3A';
    ctx.font = '10px sans-serif';
    ctx.fillText(it.name.slice(0, 8), xBase, h - 12);
  });
}

function drawLineChart(canvas, items) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.parentElement.clientWidth || 340;
  const h = canvas.height = 220;
  ctx.clearRect(0, 0, w, h);
  if (!items.length) return;

  const vars = items.map((i) => (Number(i.actual) || 0) - (Number(i.planned) || 0));
  const maxAbs = Math.max(...vars.map((v) => Math.abs(v)), 1);
  const midY = h / 2;

  ctx.strokeStyle = '#999';
  ctx.beginPath();
  ctx.moveTo(20, midY);
  ctx.lineTo(w - 20, midY);
  ctx.stroke();

  ctx.strokeStyle = '#7655E8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  vars.forEach((v, idx) => {
    const x = 30 + (idx * (w - 60)) / Math.max(vars.length - 1, 1);
    const y = midY - (v / maxAbs) * (h * 0.36);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function drawPieChart(canvas, items) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.parentElement.clientWidth || 340;
  const h = canvas.height = 220;
  ctx.clearRect(0, 0, w, h);

  let fav = 0;
  let unfav = 0;
  items.forEach((it) => {
    const c = computeVariance(it);
    if (c.status === 'fav') fav++;
    else if (c.status === 'unfav') unfav++;
  });
  const total = Math.max(fav + unfav, 1);
  const cx = w / 2;
  const cy = h / 2;
  const r = 68;

  const favAngle = (fav / total) * Math.PI * 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, 0, favAngle);
  ctx.fillStyle = '#5FD3A5';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, favAngle, Math.PI * 2);
  ctx.fillStyle = '#FFB37B';
  ctx.fill();
}

function exportCSV() {
  const items = getActiveProject().items || [];
  const rows = [['Name', 'Category', 'Date', 'Planned', 'Actual', 'Variance', 'Status']];
  items.forEach((it) => {
    const c = computeVariance(it);
    rows.push([it.name, it.category, it.date, it.planned, it.actual, c.absVar, c.status]);
  });
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  downloadBlob(csv, 'ecartix-report.csv', 'text/csv;charset=utf-8;');
}

function exportExcelXML() {
  const items = getActiveProject().items || [];
  let xml = '<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="ECARTIX"><Table>';
  xml += '<Row><Cell><Data ss:Type="String">Item</Data></Cell><Cell><Data ss:Type="String">Planned</Data></Cell><Cell><Data ss:Type="String">Actual</Data></Cell><Cell><Data ss:Type="String">Variance</Data></Cell></Row>';
  items.forEach((it) => {
    const c = computeVariance(it);
    xml += `<Row><Cell><Data ss:Type="String">${escapeXml(it.name)}</Data></Cell><Cell><Data ss:Type="Number">${it.planned}</Data></Cell><Cell><Data ss:Type="Number">${it.actual}</Data></Cell><Cell><Data ss:Type="Number">${c.absVar}</Data></Cell></Row>`;
  });
  xml += '</Table></Worksheet></Workbook>';
  downloadBlob(xml, 'ecartix-report.xls', 'application/vnd.ms-excel');
}

function backupJSON() {
  downloadBlob(JSON.stringify(state, null, 2), 'ecartix-backup.json', 'application/json');
}

function restoreJSON(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (parsed && Array.isArray(parsed.projects)) {
        state = { ...createSampleState(), ...parsed };
        saveState();
        renderAll();
        alert(state.lang === 'ar' ? 'تمت استعادة النسخة الاحتياطية بنجاح.' : 'Backup restored.');
      }
    } catch {
      alert('Invalid JSON file.');
    }
  };
  reader.readAsText(file);
}

function clearSampleData() {
  if (!confirm(state.lang === 'ar' ? 'مسح البيانات التجريبية والبدء بصفحة نظيفة؟' : 'Clear sample data?')) return;
  state.projects = [{ id: 'proj-' + Date.now(), name: 'مشروع جديد', items: [] }];
  state.activeProjectId = state.projects[0].id;
  saveState();
  renderAll();
}

function setPasswordLock() {
  const pass = (document.getElementById('lockPassInput')?.value || '').trim();
  state.passwordHash = pass;
  saveState();
  alert(pass ? (state.lang === 'ar' ? 'تم تفعيل كلمة المرور.' : 'Password set.') : (state.lang === 'ar' ? 'تم إلغاء كلمة المرور.' : 'Password removed.'));
}

function unlockApp() {
  const entered = (document.getElementById('unlockInput')?.value || '').trim();
  if (entered === state.passwordHash) {
    document.getElementById('lockModal').classList.remove('show');
  } else {
    alert(state.lang === 'ar' ? 'كلمة المرور غير صحيحة.' : 'Incorrect password.');
  }
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function escapeXml(s) {
  return escapeHtml(s);
}

function renderAll() {
  renderProjectSelects();
  populateCategorySelects();
  renderDashboard();
  renderVarianceTable();
  renderFormulas();
  runCalendarAnalysis();
  renderCurrencies();
  runSimulation();
  renderCharts();
}

document.addEventListener('DOMContentLoaded', () => {
  if (state.dark) document.body.classList.add('dark');
  setLanguage(state.lang || 'ar');
  setTimeout(() => {
    document.getElementById('splashScreen')?.classList.add('hidden');
  }, 3500);
  if (state.passwordHash) {
    document.getElementById('lockModal')?.classList.add('show');
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
