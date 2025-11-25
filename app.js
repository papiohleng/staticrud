const API = "https://script.google.com/macros/s/AKfycbydPsC0BPK4cVw7cSLhdpwcrwLQ0L6n7yYVfj0WyF-rOVjeZxJD2E4pU0L1iN7SVoNDzg/exec";

let sheets = [];
let currentSheet = null;
let sheetData = [];
let headers = [];

window.addEventListener("DOMContentLoaded", async () => loadSheets());

async function loadSheets() {
    try {
        const res = await fetch(`${API}?action=listSheets`);
        sheets = await res.json();
        renderSheetTabs();
        if (sheets.length > 0) switchSheet(sheets[0]);
    } catch (err) {
        console.error(err);
        alert("Failed to load sheets data.");
    }
}

function renderSheetTabs() {
    const nav = document.getElementById("sheet-tabs");
    nav.innerHTML = "";
    sheets.forEach(name => {
        const btn = document.createElement("button");
        btn.textContent = name;
        btn.className = "nav-btn";
        btn.onclick = () => switchSheet(name);
        nav.appendChild(btn);
    });
}

async function switchSheet(name) {
    currentSheet = name;
    document.getElementById("current-sheet-title").textContent = name;

    try {
        const res = await fetch(`${API}?action=get&sheet=${encodeURIComponent(name)}`);
        const json = await res.json();
        headers = json.headers;
        sheetData = json.rows;
        renderTable();
        renderKanban();
    } catch (err) {
        console.error(err);
        alert("Failed to load sheet data.");
    }
}

function renderTable() {
    const container = document.getElementById("table-view");
    container.innerHTML = "";

    if (!headers || headers.length === 0) {
        container.innerHTML = "<p>No data available.</p>";
        return;
    }

    const table = document.createElement("table");

    const tr = document.createElement("tr");
    headers.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        tr.appendChild(th);
    });
    table.appendChild(tr);

    sheetData.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    container.appendChild(table);
}

function switchView(view) {
    document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
    document.getElementById(view + "-view").classList.remove("hidden");
}

function renderKanban() {
    const wrap = document.getElementById("kanban-view");
    wrap.innerHTML = "";

    if (!headers.includes("Status")) {
        wrap.innerHTML = "<p>No 'Status' column found.</p>";
        return;
    }

    const statusIndex = headers.indexOf("Status");
    const groups = {};

    sheetData.forEach(row => {
        const status = row[statusIndex] || "Unassigned";
        if (!groups[status]) groups[status] = [];
        groups[status].push(row);
    });

    Object.keys(groups).forEach(status => {
        const col = document.createElement("div");
        col.className = "kanban-column";
        col.innerHTML = `<h3>${status}</h3>`;

        groups[status].forEach(row => {
            const card = document.createElement("div");
            card.className = "kanban-card";
            card.textContent = row[0];
            col.appendChild(card);
        });

        wrap.appendChild(col);
    });
}

