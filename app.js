
// ==========================================
// ECARTIX 2.0
// FINANCIAL MANAGEMENT ENGINE
// ==========================================

"use strict";

// ---------- STORAGE ----------

const STORAGE = {
  transactions: "ecartix_transactions_v2",
  budget: "ecartix_budget_v2",
  currency: "ecartix_currency_v2",
  theme: "ecartix_theme_v2"
};

function loadData(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error("Storage error:", error);
    return fallback;
  }
}

let transactions = loadData(STORAGE.transactions, []);
let budget = loadData(STORAGE.budget, 0);
let currency = loadData(STORAGE.currency, "DZD");

function saveData() {
  try {
    localStorage.setItem(STORAGE.transactions, JSON.stringify(transactions));
    localStorage.setItem(STORAGE.budget, JSON.stringify(budget));
    localStorage.setItem(STORAGE.currency, currency);
  } catch (error) {
    alert("Unable to save data. Your browser storage may be full.");
    console.error(error);
  }
}

// ---------- HELPERS ----------

const $ = id => document.getElementById(id);

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value) || 0);
}

function money(value) {
  return `${formatMoney(value)} ${currency}`;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function createReference() {
  return "ECX-" + Date.now().toString(36).toUpperCase();
}

function getExpenses() {
  return transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

function getIncome() {
  return transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

function getVariance() {
  return Number(budget) - getExpenses();
}

function getUtilization() {
  return Number(budget) > 0
    ? (getExpenses() / Number(budget)) * 100
    : 0;
}

// ---------- NAVIGATION ----------

function showSection(sectionId) {
  document.querySelectorAll(".dashboard-section").forEach(section => {
    section.classList.toggle("hidden", section.id !== sectionId);
  });

  document.querySelectorAll(".sidebar nav a").forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === "#" + sectionId
    );
  });

  const titles = {
    dashboard: "Financial Dashboard",
    ledger: "Financial Ledger",
    budget: "Budget Management",
    variance: "Variance Analysis",
    simulation: "Simulation Lab",
    reports: "Reports Center",
    settings: "Settings"
  };

  const title = document.querySelector(".topbar h1");
  if (title) title.textContent = titles[sectionId] || "ECARTIX";

  history.replaceState(null, "", "#" + sectionId);
}

document.querySelectorAll(".sidebar nav a").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    const section = link.getAttribute("href").slice(1);
    showSection(section);
  });
});

document.querySelectorAll("[onclick]").forEach(() => {
  // Inline actions are handled by their functions below.
});

// ---------- TRANSACTIONS ----------

let editingId = null;

function renderTransactions() {
  const table = $("transactionList");
  const recent = $("recentTransactions");

  if (!table || !recent) return;

  const search = $("searchInput")?.value.toLowerCase() || "";

  const filtered = transactions.filter(t =>
    [t.description, t.category, t.reference, t.type]
      .join(" ")
      .toLowerCase()
      .includes(search)
  );

  if (filtered.length === 0) {
    table.innerHTML = `
      <tr><td colspan="6">No transactions found.</td></tr>
    `;
  } else {
    table.innerHTML = filtered.map(t => `
      <tr>
        <td>${escapeHTML(t.description)}</td>
        <td>${escapeHTML(t.category)}</td>
        <td>
          <span class="badge ${t.type === "income" ? "success" : "danger"}">
            ${t.type === "income" ? "Income" : "Expense"}
          </span>
        </td>
        <td>${money(t.amount)}</td>
        <td>${escapeHTML(t.date)}</td>
        <td>
          <button onclick="editTransaction('${t.id}')">Edit</button>
          <button onclick="deleteTransaction('${t.id}')">Delete</button>
        </td>
      </tr>
    `).join("");
  }

  const recentTransactions = [...transactions]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  recent.innerHTML = recentTransactions.length
    ? recentTransactions.map(t => `
      <tr>
        <td>${escapeHTML(t.description)}</td>
        <td>${escapeHTML(t.category)}</td>
        <td>${escapeHTML(t.type)}</td>
        <td>${money(t.amount)}</td>
        <td>${escapeHTML(t.date)}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="5">No transactions yet.</td></tr>`;

  const count = $("tableCount");
  if (count) count.textContent = `${filtered.length} transactions`;
}

$("transactionForm")?.addEventListener("submit", event => {
  event.preventDefault();

  const description = $("description").value.trim();
  const category = $("category").value.trim();
  const amount = Number($("amount").value);
  const type = $("type").value;
  const date = $("date").value;

  if (!description || !category || !date || !Number.isFinite(amount) || amount <= 0) {
    alert("Please enter valid transaction information.");
    return;
  }

  if (!["income", "expense"].includes(type)) {
    alert("Invalid transaction type.");
    return;
  }

  if (editingId) {
    const transaction = transactions.find(t => t.id === editingId);

    if (transaction) {
      transaction.description = description;
      transaction.category = category;
      transaction.amount = amount;
      transaction.type = type;
      transaction.date = date;
      transaction.updatedAt = Date.now();
    }

    editingId = null;
  } else {
    transactions.push({
      id: createReference(),
      reference: createReference(),
      description,
      category,
      amount,
      type,
      date,
      createdAt: Date.now()
    });
  }

  saveData();
  updateDashboard();
  event.target.reset();

  const button = $("transactionForm").querySelector('button[type="submit"]');
  if (button) button.textContent = "Save Transaction";

  alert("Transaction saved successfully!");
});

function editTransaction(id) {
  const t = transactions.find(item => item.id === id);
  if (!t) return;

  editingId = id;

  $("description").value = t.description;
  $("category").value = t.category;
  $("amount").value = t.amount;
  $("type").value = t.type;
  $("date").value = t.date;

  const button = $("transactionForm").querySelector('button[type="submit"]');
  if (button) button.textContent = "Update Transaction";

  showSection("ledger");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteTransaction(id) {
  if (!confirm("Are you sure you want to delete this transaction?")) return;

  transactions = transactions.filter(t => t.id !== id);

  if (editingId === id) editingId = null;

  saveData();
  updateDashboard();
}

$("searchInput")?.addEventListener("input", renderTransactions);

// ---------- BUDGET MANAGEMENT ----------

$("budgetForm")?.addEventListener("submit", event => {
  event.preventDefault();

  const amount = Number($("budgetAmount").value);
  const selectedCurrency = $("currency").value;

  if (!Number.isFinite(amount) || amount < 0) {
    alert("Enter a valid budget amount.");
    return;
  }

  if (currency !== selectedCurrency && transactions.length > 0) {
    if (!confirm("Changing currency does not convert existing amounts. Continue?")) {
      return;
    }
  }

  budget = amount;
  currency = selectedCurrency;

  saveData();
  updateDashboard();

  alert("Budget saved successfully!");
});

// ---------- DASHBOARD ----------

function updateDashboard() {
  const expenses = getExpenses();
  const income = getIncome();
  const variance = getVariance();
  const utilization = getUtilization();

  if ($("totalPlan")) $("totalPlan").textContent = formatMoney(budget);
  if ($("totalActual")) $("totalActual").textContent = formatMoney(expenses);

  if ($("totalVariance")) {
    $("totalVariance").textContent = formatMoney(variance);
    $("totalVariance").className = variance >= 0 ? "positive" : "negative";
  }

  if ($("performanceIndex")) {
    $("performanceIndex").textContent = formatMoney(utilization) + "%";
  }

  if ($("analysisBudget")) $("analysisBudget").textContent = formatMoney(budget);
  if ($("analysisActual")) $("analysisActual").textContent = formatMoney(expenses);
  if ($("analysisVariance")) $("analysisVariance").textContent = formatMoney(variance);

  if ($("analysisUtilization")) {
    $("analysisUtilization").textContent = formatMoney(utilization) + "%";
  }

  const varianceDetails = $("varianceDetails");

  if (varianceDetails) {
    varianceDetails.innerHTML = `
      <p>Planned expenses: <strong>${money(budget)}</strong></p>
      <p>Actual expenses: <strong>${money(expenses)}</strong></p>
      <p>Budget variance: <strong class="${variance >= 0 ? "positive" : "negative"}">${money(variance)}</strong></p>
      <p>Actual income: <strong>${money(income)}</strong></p>
      <p>Net result: <strong>${money(income - expenses)}</strong></p>
      <p>Status: <strong>${budget === 0 ? "Budget not configured" : variance >= 0 ? "Within budget" : "Over budget"}</strong></p>
    `;
  }

  const recentTotal = $("totalTransactions");
  if (recentTotal) recentTotal.textContent = transactions.length;

  renderTransactions();
  updateCharts();
}

// ---------- CHARTS ----------

let budgetChart = null;
let overviewChart = null;

function updateCharts() {
  if (typeof Chart === "undefined") return;

  const budgetCanvas = $("budgetChart");
  const overviewCanvas = $("overviewChart");

  if (budgetCanvas) {
    if (budgetChart) budgetChart.destroy();

    budgetChart = new Chart(budgetCanvas, {
      type: "bar",
      data: {
        labels: ["Budget", "Actual Expenses"],
        datasets: [{
          label: "Amount",
          data: [Number(budget), getExpenses()],
          backgroundColor: ["#3978f6", "#e99b42"],
          borderRadius: 8,
          maxBarThickness: 65
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  if (overviewCanvas) {
    if (overviewChart) overviewChart.destroy();

    overviewChart = new Chart(overviewCanvas, {
      type: "doughnut",
      data: {
        labels: ["Income", "Expenses"],
        datasets: [{
          data: [getIncome(), getExpenses()],
          backgroundColor: ["#16a779", "#e99b42"],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      }
    });
  }
}

// ---------- SIMULATION LAB ----------

function runSimulation() {
  const rate = Number($("simulationRate")?.value);

  if (!Number.isFinite(rate) || rate < -100 || rate > 1000) {
    alert("Enter a simulation rate between -100% and 1000%.");
    return;
  }

  const projected = getExpenses() * (1 + rate / 100);
  const projectedVariance = Number(budget) - projected;

  const result = $("simulationResult");

  if (result) {
    result.innerHTML = `
      Projected expenses: <strong>${money(projected)}</strong><br>
      Projected variance: <strong class="${projectedVariance >= 0 ? "positive" : "negative"}">${money(projectedVariance)}</strong><br>
      Scenario: <strong>${rate}% change in expenses</strong>
    `;
  }
}

// ---------- CSV EXPORT ----------

function exportCSV() {
  if (!transactions.length) {
    alert("There are no transactions to export.");
    return;
  }

  const headers = [
    "Reference",
    "Description",
    "Category",
    "Type",
    "Amount",
    "Currency",
    "Date"
  ];

  const rows = transactions.map(t => [
    t.reference,
    t.description,
    t.category,
    t.type,
    t.amount,
    currency,
    t.date
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(value =>
      '"' + String(value ?? "").replace(/"/g, '""') + '"'
    ).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "ecartix-financial-ledger.csv";
  link.click();

  URL.revokeObjectURL(url);
}

window.exportCSV = exportCSV;
window.editTransaction = editTransaction;
window.deleteTransaction = deleteTransaction;
window.runSimulation = runSimulation;
window.showSection = showSection;

// ---------- THEME ----------

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");

  const button = $("themeToggle");
  if (button) button.textContent = theme === "dark" ? "☀" : "☾";
}

applyTheme(loadData(STORAGE.theme, "light"));

$("themeToggle")?.addEventListener("click", () => {
  const next = document.body.classList.contains("dark") ? "light" : "dark";

  localStorage.setItem(STORAGE.theme, JSON.stringify(next));
  applyTheme(next);
});

// ---------- LANGUAGE ----------

const translations = {
  en: {
    dashboard: "Financial Dashboard",
    ledger: "Financial Ledger",
    budget: "Budget Management",
    variance: "Variance Analysis",
    simulation: "Simulation Lab",
    reports: "Reports Center",
    settings: "Settings"
  },
  fr: {
    dashboard: "Tableau de bord financier",
    ledger: "Journal financier",
    budget: "Gestion du budget",
    variance: "Analyse des écarts",
    simulation: "Laboratoire de simulation",
    reports: "Centre de rapports",
    settings: "Paramètres"
  },
  ar: {
    dashboard: "لوحة التحكم المالية",
    ledger: "السجل المالي",
    budget: "إدارة الميزانية",
    variance: "تحليل الفروقات",
    simulation: "مختبر المحاكاة",
    reports: "مركز التقارير",
    settings: "الإعدادات"
  }
};

$("languageSelect")?.addEventListener("change", event => {
  const language = event.target.value;
  const rtl = language === "ar";

  document.documentElement.lang = language;
  document.documentElement.dir = rtl ? "rtl" : "ltr";

  document.querySelectorAll(".sidebar nav a").forEach(link => {
    const section = link.getAttribute("href").slice(1);
    if (translations[language][section]) {
      const icon = link.querySelector("span");
      link.textContent = translations[language][section];
      if (icon) link.prepend(icon);
    }
  });

  const active = location.hash.slice(1) || "dashboard";
  showSection(active);
});

// ---------- INITIALIZATION ----------

function initializeECARTIX() {
  if ($("currency")) $("currency").value = currency;

  if ($("budgetAmount")) $("budgetAmount").value = budget;

  if ($("date")) {
    $("date").value = new Date().toISOString().slice(0, 10);
  }

  updateDashboard();

  const initialPage = location.hash.replace("#", "");
  const validPages = [
    "dashboard",
    "ledger",
    "budget",
    "variance",
    "simulation",
    "reports",
    "settings"
  ];

  showSection(validPages.includes(initialPage) ? initialPage : "dashboard");

  console.log("ECARTIX 2.0 initialized successfully.");
}

initializeECARTIX();
