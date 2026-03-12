import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   CONFIG & DATA
   ═══════════════════════════════════════════ */

const CATEGORIES = [
  { id: "mithai", name: "Mithai", icon: "🍬" },
  { id: "sweets", name: "Sweets", icon: "🍮" },
  { id: "biscuits", name: "Biscuits", icon: "🍪" },
  { id: "bread", name: "Bread", icon: "🍞" },
  { id: "rusks", name: "Rusks", icon: "🥖" },
  { id: "cakes", name: "Cakes", icon: "🎂" },
  { id: "milk", name: "Milk", icon: "🥛" },
  { id: "yogurt", name: "Yogurt", icon: "🫙" },
  { id: "dryfruit", name: "Dry Fruit", icon: "🥜" },
  { id: "fastfood", name: "Fast Food", icon: "🍔" },
  { id: "other", name: "Other", icon: "📦" },
];

const UNITS = ["kg", "g", "ltr", "ml", "pcs", "dozen", "pkt", "box", "tray", "plate"];

const DEFAULT_PRODUCTS = {
  mithai: [
    { id: "m1", name: "Gulab Jamun", unit: "kg", step: 0.25 },
    { id: "m2", name: "Rasgulla", unit: "kg", step: 0.25 },
    { id: "m3", name: "Barfi", unit: "kg", step: 0.25 },
    { id: "m4", name: "Jalebi", unit: "kg", step: 0.25 },
    { id: "m5", name: "Laddu", unit: "kg", step: 0.25 },
    { id: "m6", name: "Kalakand", unit: "kg", step: 0.25 },
    { id: "m7", name: "Peda", unit: "kg", step: 0.25 },
    { id: "m8", name: "Cham Cham", unit: "kg", step: 0.25 },
    { id: "m9", name: "Kaju Katli", unit: "kg", step: 0.25 },
    { id: "m10", name: "Soan Papdi", unit: "kg", step: 0.25 },
    { id: "m11", name: "Rasmalai", unit: "kg", step: 0.25 },
    { id: "m12", name: "Kheer", unit: "kg", step: 0.5 },
  ],
  sweets: [
    { id: "s1", name: "Sohan Halwa", unit: "kg", step: 0.25 },
    { id: "s2", name: "Patisa", unit: "kg", step: 0.25 },
    { id: "s3", name: "Rewri", unit: "kg", step: 0.5 },
    { id: "s4", name: "Gajak", unit: "kg", step: 0.5 },
    { id: "s5", name: "Petha", unit: "kg", step: 0.5 },
    { id: "s6", name: "Halwa", unit: "kg", step: 0.5 },
    { id: "s7", name: "Motichoor Laddu", unit: "kg", step: 0.25 },
    { id: "s8", name: "Besan Laddu", unit: "kg", step: 0.25 },
  ],
  biscuits: [
    { id: "b1", name: "Zeera Biscuit", unit: "kg", step: 0.25 },
    { id: "b2", name: "Butter Cookies", unit: "kg", step: 0.25 },
    { id: "b3", name: "Nan Khatai", unit: "kg", step: 0.25 },
    { id: "b4", name: "Khari Biscuit", unit: "kg", step: 0.25 },
    { id: "b5", name: "Cake Rusk", unit: "kg", step: 0.25 },
    { id: "b6", name: "Coconut Cookies", unit: "kg", step: 0.25 },
    { id: "b7", name: "Atta Biscuit", unit: "kg", step: 0.25 },
    { id: "b8", name: "Cream Biscuit", unit: "pkt", step: 1 },
  ],
  bread: [
    { id: "br1", name: "White Bread", unit: "pcs", step: 1 },
    { id: "br2", name: "Brown Bread", unit: "pcs", step: 1 },
    { id: "br3", name: "Milk Bread", unit: "pcs", step: 1 },
    { id: "br4", name: "Garlic Bread", unit: "pcs", step: 1 },
    { id: "br5", name: "Bun", unit: "pcs", step: 1 },
    { id: "br6", name: "Pav", unit: "pcs", step: 1 },
    { id: "br7", name: "Sandwich Bread", unit: "pcs", step: 1 },
    { id: "br8", name: "Kulcha", unit: "pcs", step: 1 },
  ],
  rusks: [
    { id: "r1", name: "Plain Rusk", unit: "kg", step: 0.25 },
    { id: "r2", name: "Sweet Rusk", unit: "kg", step: 0.25 },
    { id: "r3", name: "Elaichi Rusk", unit: "kg", step: 0.25 },
    { id: "r4", name: "Suji Rusk", unit: "kg", step: 0.25 },
    { id: "r5", name: "Milk Rusk", unit: "kg", step: 0.25 },
  ],
  cakes: [
    { id: "c1", name: "Vanilla Cake", unit: "kg", step: 0.5 },
    { id: "c2", name: "Chocolate Cake", unit: "kg", step: 0.5 },
    { id: "c3", name: "Black Forest", unit: "kg", step: 0.5 },
    { id: "c4", name: "Pineapple Cake", unit: "kg", step: 0.5 },
    { id: "c5", name: "Red Velvet", unit: "kg", step: 0.5 },
    { id: "c6", name: "Cupcakes", unit: "pcs", step: 1 },
    { id: "c7", name: "Pastry", unit: "pcs", step: 1 },
    { id: "c8", name: "Brownie", unit: "pcs", step: 1 },
    { id: "c9", name: "Muffin", unit: "pcs", step: 1 },
  ],
  milk: [
    { id: "ml1", name: "Full Cream Milk", unit: "ltr", step: 0.5 },
    { id: "ml2", name: "Toned Milk", unit: "ltr", step: 0.5 },
    { id: "ml3", name: "Buttermilk", unit: "ltr", step: 0.5 },
    { id: "ml4", name: "Cream", unit: "kg", step: 0.25 },
    { id: "ml5", name: "Paneer", unit: "kg", step: 0.25 },
    { id: "ml6", name: "Khoya/Mawa", unit: "kg", step: 0.25 },
    { id: "ml7", name: "Desi Ghee", unit: "kg", step: 0.25 },
  ],
  yogurt: [
    { id: "y1", name: "Plain Dahi", unit: "kg", step: 0.5 },
    { id: "y2", name: "Sweet Lassi", unit: "ltr", step: 0.5 },
    { id: "y3", name: "Raita", unit: "kg", step: 0.5 },
    { id: "y4", name: "Shrikhand", unit: "kg", step: 0.25 },
    { id: "y5", name: "Flavored Yogurt", unit: "pcs", step: 1 },
    { id: "y6", name: "Chaach", unit: "ltr", step: 1 },
  ],
  dryfruit: [
    { id: "d1", name: "Badam (Almonds)", unit: "kg", step: 0.25 },
    { id: "d2", name: "Kaju (Cashew)", unit: "kg", step: 0.25 },
    { id: "d3", name: "Pista (Pistachios)", unit: "kg", step: 0.25 },
    { id: "d4", name: "Kishmish (Raisins)", unit: "kg", step: 0.25 },
    { id: "d5", name: "Akhrot (Walnuts)", unit: "kg", step: 0.25 },
    { id: "d6", name: "Mixed Dry Fruit", unit: "kg", step: 0.25 },
    { id: "d7", name: "Khajoor (Dates)", unit: "kg", step: 0.5 },
    { id: "d8", name: "Charoli", unit: "g", step: 100 },
  ],
  fastfood: [
    { id: "f1", name: "Samosa", unit: "pcs", step: 1 },
    { id: "f2", name: "Kachori", unit: "pcs", step: 1 },
    { id: "f3", name: "Patties", unit: "pcs", step: 1 },
    { id: "f4", name: "Sandwich", unit: "pcs", step: 1 },
    { id: "f5", name: "Pizza Slice", unit: "pcs", step: 1 },
    { id: "f6", name: "Burger", unit: "pcs", step: 1 },
    { id: "f7", name: "Spring Roll", unit: "pcs", step: 1 },
    { id: "f8", name: "Puff", unit: "pcs", step: 1 },
    { id: "f9", name: "Veg Roll", unit: "pcs", step: 1 },
  ],
  other: [],
};

const STATUS_FLOW = ["pending", "confirmed", "packed", "dispatched", "delivered"];
const STATUS_CFG = {
  pending: { label: "Pending", color: "#F59E0B", bg: "#FEF3C7", icon: "⏳" },
  confirmed: { label: "Confirmed", color: "#0EA5E9", bg: "#E0F2FE", icon: "👍" },
  packed: { label: "Packed", color: "#3B82F6", bg: "#DBEAFE", icon: "📦" },
  dispatched: { label: "Dispatched", color: "#8B5CF6", bg: "#EDE9FE", icon: "🚚" },
  delivered: { label: "Delivered", color: "#10B981", bg: "#D1FAE5", icon: "✅" },
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 6);

function fmtDate(ts) {
  const d = new Date(ts);
  const dd = d.getDate().toString().padStart(2, "0");
  const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
  const h = d.getHours(), m = d.getMinutes().toString().padStart(2, "0");
  return `${dd} ${mon}, ${h % 12 || 12}:${m} ${h >= 12 ? "PM" : "AM"}`;
}

function fmtQty(qty, unit) {
  if (unit === "kg" && qty < 1) return `${Math.round(qty * 1000)}g`;
  if (unit === "ltr" && qty < 1) return `${Math.round(qty * 1000)}ml`;
  if (Number.isInteger(qty)) return `${qty} ${unit}`;
  return `${qty} ${unit}`;
}

/* ─── Storage ─── */
async function sGet(key) { try { const r = await window.storage.get(key, true); return r ? JSON.parse(r.value) : null; } catch { return null; } }
async function sSet(key, val) { try { await window.storage.set(key, JSON.stringify(val), true); } catch (e) { console.error(e); } }

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --bg:#FAF6F1;--bg2:#F0E9DF;--card:#fff;--text:#1E1208;--text2:#5C4A3A;--text3:#9A8878;
  --accent:#B45309;--accent2:#92400E;--accentL:#FEF3C7;
  --border:#E6DCD0;--shadow:0 2px 10px rgba(30,18,8,0.06);--shadow2:0 6px 24px rgba(30,18,8,0.1);
  --r:14px;--rs:10px;
}
*{margin:0;padding:0;box-sizing:border-box;}
html{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);-webkit-tap-highlight-color:transparent;}
input,select,textarea,button{font-family:inherit;}

.app{max-width:520px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;background:var(--bg);position:relative;}

/* Header */
.hdr{background:linear-gradient(135deg,#1E1208 0%,#3D2B1A 100%);color:#FAF6F1;padding:14px 18px;position:sticky;top:0;z-index:100;}
.hdr h1{font-family:'Playfair Display',serif;font-size:20px;display:flex;align-items:center;gap:8px;}
.hdr-sub{font-size:10px;opacity:.55;letter-spacing:1.2px;text-transform:uppercase;margin-top:2px;}
.hdr-row{display:flex;justify-content:space-between;align-items:center;}
.hdr-btn{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#FAF6F1;padding:6px 12px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;}
.hdr-btn:hover{background:rgba(255,255,255,.2);}

/* Login */
.login{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:40px 24px;text-align:center;background:linear-gradient(180deg,#FAF6F1 0%,#F0E9DF 100%);}
.login-logo{font-size:56px;margin-bottom:16px;}
.login h2{font-family:'Playfair Display',serif;font-size:28px;margin-bottom:6px;}
.login p{color:var(--text3);font-size:14px;margin-bottom:32px;}
.login-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:24px;width:100%;max-width:360px;margin-bottom:16px;}
.login-card h3{font-size:16px;margin-bottom:16px;text-align:left;}
.login-input{width:100%;padding:12px 14px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:14px;outline:none;margin-bottom:10px;}
.login-input:focus{border-color:var(--accent);}
.login-divider{color:var(--text3);font-size:12px;margin:20px 0;position:relative;display:flex;align-items:center;justify-content:center;gap:12px;}
.login-divider::before,.login-divider::after{content:'';flex:1;height:1px;background:var(--border);}

/* Category Chips */
.cats{display:flex;gap:7px;padding:6px 16px 10px;overflow-x:auto;scrollbar-width:none;}
.cats::-webkit-scrollbar{display:none;}
.chip{flex-shrink:0;padding:7px 13px;border-radius:20px;border:1.5px solid var(--border);background:var(--card);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap;}
.chip:hover{border-color:var(--accent);}
.chip.on{background:var(--accent);color:#fff;border-color:var(--accent);}

/* Search */
.search{margin:0 16px 6px;}
.search input{width:100%;padding:10px 14px 10px 34px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:13px;outline:none;background:var(--card) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239A8878' stroke-width='2.5'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='m20 20-3.5-3.5'/%3E%3C/svg%3E") 12px center no-repeat;}
.search input:focus{border-color:var(--accent);}

/* Products */
.prod-list{padding:2px 16px 130px;display:flex;flex-direction:column;gap:5px;}
.prod{display:flex;align-items:center;background:var(--card);border-radius:var(--rs);padding:11px 12px;border:1px solid var(--border);transition:all .15s;}
.prod.has-qty{border-color:var(--accent);background:#FFFBF5;}
.prod-info{flex:1;min-width:0;}
.prod-name{font-weight:600;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.prod-unit{font-size:11px;color:var(--text3);margin-top:1px;}
.qty-area{display:flex;align-items:center;gap:6px;}
.qty-b{width:30px;height:30px;border-radius:50%;border:1.5px solid var(--border);background:var(--card);cursor:pointer;font-size:15px;font-weight:700;display:flex;align-items:center;justify-content:center;transition:all .12s;color:var(--text);}
.qty-b:hover{background:var(--accent);color:#fff;border-color:var(--accent);}
.qty-b:active{transform:scale(.9);}
.qty-in{width:54px;text-align:center;font-weight:700;font-size:14px;border:1.5px solid var(--border);border-radius:7px;padding:4px 2px;outline:none;}
.qty-in:focus{border-color:var(--accent);}
.qty-unit-tag{font-size:10px;color:var(--text3);font-weight:600;min-width:20px;}

/* Cart Bar */
.cart-bar{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:var(--accent);color:#fff;padding:13px 18px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;z-index:90;border-radius:18px 18px 0 0;transition:background .2s;}
.cart-bar:hover{background:var(--accent2);}
.cart-cnt{background:#fff;color:var(--accent);width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;}

/* Modal */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;display:flex;align-items:flex-end;justify-content:center;}
.modal{background:var(--bg);border-radius:22px 22px 0 0;max-width:520px;width:100%;max-height:85vh;display:flex;flex-direction:column;animation:slideUp .25s ease-out;}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.m-hdr{padding:18px 18px 10px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;}
.m-hdr h2{font-family:'Playfair Display',serif;font-size:18px;}
.m-close{width:30px;height:30px;border-radius:50%;border:none;background:var(--bg2);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;}
.m-body{overflow-y:auto;padding:14px 18px;flex:1;}
.m-foot{padding:12px 18px;border-top:1px solid var(--border);}

/* Cart Items */
.c-item{display:flex;align-items:center;padding:9px 0;border-bottom:1px solid var(--border);}
.c-item:last-child{border:none;}
.c-item-info{flex:1;}
.c-item-name{font-weight:600;font-size:13px;}
.c-item-qty{font-size:11px;color:var(--text3);}
.c-item-rm{color:#DC2626;border:none;background:none;cursor:pointer;font-size:16px;padding:4px 6px;}

/* Buttons */
.btn{width:100%;padding:13px;border:none;border-radius:var(--rs);background:var(--accent);color:#fff;font-weight:700;font-size:14px;cursor:pointer;transition:all .15s;}
.btn:hover{background:var(--accent2);}
.btn:disabled{opacity:.35;cursor:not-allowed;}
.btn-o{padding:7px 14px;border:1.5px solid var(--border);border-radius:var(--rs);background:var(--card);color:var(--text);font-weight:600;font-size:12px;cursor:pointer;transition:all .15s;}
.btn-o:hover{border-color:var(--accent);color:var(--accent);}
.btn-s{padding:5px 11px;font-size:11px;border-radius:7px;border:none;cursor:pointer;font-weight:600;transition:all .12s;}
.btn-d{background:#FEE2E2;color:#DC2626;border:1px solid #FECACA;}

/* Orders */
.orders{padding:8px 16px 130px;display:flex;flex-direction:column;gap:8px;}
.o-card{background:var(--card);border-radius:var(--r);border:1px solid var(--border);overflow:hidden;transition:box-shadow .2s;}
.o-card:hover{box-shadow:var(--shadow2);}
.o-top{padding:12px 14px;display:flex;justify-content:space-between;align-items:flex-start;gap:8px;}
.o-id{font-weight:700;font-size:13px;}
.o-from{font-size:11px;color:var(--accent);font-weight:600;margin-top:1px;}
.o-time{font-size:10px;color:var(--text3);margin-top:1px;}
.s-badge{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap;}
.o-items{padding:0 14px 8px;}
.o-line{font-size:12px;color:var(--text2);padding:2px 0;display:flex;justify-content:space-between;}
.o-acts{padding:8px 14px 12px;border-top:1px solid var(--border);display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap;}
.o-note{padding:4px 14px 8px;}
.o-note-t{font-size:11px;color:var(--text3);font-style:italic;background:var(--bg2);padding:5px 9px;border-radius:7px;}

/* Status filter tabs */
.f-tabs{display:flex;gap:0;margin:10px 16px;border:1.5px solid var(--border);border-radius:var(--rs);overflow:hidden;}
.f-tab{flex:1;padding:8px 2px;border:none;cursor:pointer;font-weight:600;font-size:11px;background:var(--card);color:var(--text3);text-align:center;min-width:0;white-space:nowrap;}
.f-tab.on{background:var(--accent);color:#fff;}
.f-tab+.f-tab{border-left:1px solid var(--border);}

/* Bakery filter */
.bk-filter{display:flex;gap:6px;padding:4px 16px 8px;overflow-x:auto;scrollbar-width:none;}
.bk-filter::-webkit-scrollbar{display:none;}
.bk-chip{flex-shrink:0;padding:5px 12px;border-radius:16px;border:1.5px solid var(--border);background:var(--card);font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;}
.bk-chip.on{background:var(--text);color:#fff;border-color:var(--text);}

/* Product manager */
.pm{padding:8px 16px 130px;}
.pm-item{display:flex;align-items:center;gap:8px;padding:9px 10px;background:var(--card);border:1px solid var(--border);border-radius:var(--rs);margin-bottom:5px;}
.pm-item span{flex:1;font-weight:600;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.pm-meta{font-size:11px;color:var(--text3);white-space:nowrap;}
.pm-add{display:flex;gap:6px;margin-top:12px;flex-wrap:wrap;}
.pm-add input,.pm-add select{flex:1;min-width:60px;border:1.5px dashed var(--border);border-radius:8px;padding:9px 10px;font-size:13px;outline:none;}
.pm-add input:focus{border-color:var(--accent);}

/* Quick add */
.quick-add{margin:0 16px 8px;padding:10px 14px;background:var(--card);border:1.5px dashed var(--accent);border-radius:var(--rs);cursor:pointer;text-align:center;font-size:12px;font-weight:600;color:var(--accent);transition:all .15s;}
.quick-add:hover{background:var(--accentL);}

/* Note */
.note{width:100%;padding:9px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:12px;resize:none;outline:none;margin-top:8px;}
.note:focus{border-color:var(--accent);}

/* Empty */
.empty{text-align:center;padding:50px 20px;color:var(--text3);}
.empty .ic{font-size:42px;margin-bottom:10px;}
.empty p{font-size:13px;}

/* Print */
@media print {
  body { background: #fff; color: #000; }
  .no-print { display: none !important; }
  .app > *:not(.print-sec) { display: none !important; }
  .print-sec { display: block !important; }
  .o-card { border: 1px solid #000; box-shadow: none; break-inside: avoid; }
}
.print-sec { display: none; }
.print-active .print-sec { display: block; padding: 20px; background: #fff; min-height: 100vh; }
.print-active > *:not(.print-sec) { display: none; }

/* Toast */
.toast{position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:300;background:#065F46;color:#fff;padding:10px 22px;border-radius:11px;font-weight:600;font-size:13px;box-shadow:0 8px 30px rgba(0,0,0,.2);animation:slideUp .25s ease-out;}

/* Images */
.prod-img{width:48px;height:48px;border-radius:8px;object-fit:cover;border:1px solid var(--border);margin-right:12px;background:var(--bg2);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--text3);flex-shrink:0;}
.pm-img{width:36px;height:36px;border-radius:6px;object-fit:cover;border:1px solid var(--border);margin-right:10px;flex-shrink:0;background:var(--bg2);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--text3);}
`;

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */

export default function App() {
  const [screen, setScreen] = useState("login");
  const [bakeryName, setBakeryName] = useState("");
  const [bakeryInput, setBakeryInput] = useState("");

  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [bakeries, setBakeries] = useState([]);

  const [cart, setCart] = useState({});
  const [activeCat, setActiveCat] = useState("mithai");
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [toast, setToast] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const [statusFilter, setStatusFilter] = useState("pending");
  const [bakeryFilter, setBakeryFilter] = useState("all");
  const [showPM, setShowPM] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [printOrder, setPrintOrder] = useState(null);

  useEffect(() => {
    (async () => {
      const [o, p, b] = await Promise.all([sGet("bf-orders"), sGet("bf-products"), sGet("bf-bakeries")]);
      if (o) setOrders(o);
      if (p) setProducts(p);
      if (b) setBakeries(b);
    })();
  }, []);

  useEffect(() => {
    const iv = setInterval(async () => {
      const [o, p] = await Promise.all([sGet("bf-orders"), sGet("bf-products")]);
      if (o) setOrders(o);
      if (p) setProducts(p);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (printOrder) {
      setTimeout(() => window.print(), 100);
    }
  }, [printOrder]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  async function loginBakery() {
    const name = bakeryInput.trim();
    if (!name) return;
    setBakeryName(name);
    if (!bakeries.includes(name)) {
      const nb = [...bakeries, name];
      setBakeries(nb);
      await sSet("bf-bakeries", nb);
    }
    setScreen("bakery");
  }

  function findProduct(pid) {
    for (const cat of Object.values(products)) {
      const p = cat.find((x) => x.id === pid);
      if (p) return p;
    }
    return null;
  }

  const catProducts = (products[activeCat] || []).filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const cartItems = Object.entries(cart).filter(([, q]) => q > 0);

  function adjQty(pid, delta) {
    const p = findProduct(pid);
    const step = p?.step || 1;
    setCart((prev) => {
      const val = Math.max(0, parseFloat(((prev[pid] || 0) + delta * step).toFixed(3)));
      if (val <= 0) { const { [pid]: _, ...rest } = prev; return rest; }
      return { ...prev, [pid]: val };
    });
  }

  function setQtyDirect(pid, raw) {
    const val = parseFloat(raw);
    setCart((prev) => {
      if (isNaN(val) || val <= 0) { const { [pid]: _, ...rest } = prev; return rest; }
      return { ...prev, [pid]: parseFloat(val.toFixed(3)) };
    });
  }

  async function placeOrder() {
    if (cartItems.length === 0) return;
    const newOrder = {
      id: uid(),
      bakery: bakeryName,
      timestamp: Date.now(),
      status: "pending",
      note: orderNote.trim(),
      items: cartItems.map(([pid, qty]) => {
        const p = findProduct(pid);
        return { productId: pid, name: p?.name || pid, qty, unit: p?.unit || "", step: p?.step || 1, image: p?.image || "" };
      }),
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    await sSet("bf-orders", updated);
    setCart({});
    setOrderNote("");
    setShowCart(false);
    showToast("Order placed successfully!");
  }

  async function updateStatus(oid, ns) {
    const updated = orders.map((o) => o.id === oid ? { ...o, status: ns, [`${ns}At`]: Date.now() } : o);
    setOrders(updated);
    await sSet("bf-orders", updated);
  }

  async function addProduct(catId, prod) {
    const up = { ...products, [catId]: [...(products[catId] || []), prod] };
    setProducts(up);
    await sSet("bf-products", up);
  }

  async function removeProduct(catId, pid) {
    const up = { ...products, [catId]: products[catId].filter((p) => p.id !== pid) };
    setProducts(up);
    await sSet("bf-products", up);
  }

  const uniqueBakeries = [...new Set(orders.map((o) => o.bakery))];
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (bakeryFilter !== "all" && o.bakery !== bakeryFilter) return false;
    return true;
  });
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const statusCounts = {};
  STATUS_FLOW.forEach((s) => statusCounts[s] = orders.filter((o) => o.status === s).length);

  function getDailySummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysOrders = orders.filter(o => o.timestamp >= today.getTime());

    const agg = {};
    todaysOrders.forEach(o => {
      o.items.forEach(i => {
        if (!agg[i.productId]) agg[i.productId] = { name: i.name, unit: i.unit, qty: 0, image: i.image };
        agg[i.productId].qty += i.qty;
      });
    });
    return Object.values(agg).sort((a, b) => b.qty - a.qty);
  }

  function shareWhatsApp(order) {
    let text = `📦 *Order #${order.id.slice(-6).toUpperCase()}*\n`;
    text += `🏪 Bakery: ${order.bakery}\n`;
    text += `📊 Status: ${STATUS_CFG[order.status].label}\n`;
    text += `⏰ ${fmtDate(order.timestamp)}\n\n`;
    text += `*Items:*\n`;
    order.items.forEach(i => {
      text += `• ${i.name} - ${fmtQty(i.qty, i.unit)}\n`;
    });
    if (order.note) text += `\n📝 Note: ${order.note}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  /* ── LOGIN ── */
  if (screen === "login") {
    return (
      <>
        <style>{CSS}</style>
        <div className="login">
          <div className="login-logo">🍞</div>
          <h2>BakeryFlow</h2>
          <p>Order & Dispatch Management</p>

          <div className="login-card">
            <h3>🏪 I'm at a Bakery</h3>
            {bakeries.length > 0 && bakeries.map((b) => (
              <button key={b} className="btn-o" style={{ width: "100%", marginBottom: 6, padding: "11px 14px", fontSize: 13, textAlign: "left" }}
                onClick={() => { setBakeryName(b); setScreen("bakery"); }}>
                🏪 {b}
              </button>
            ))}
            {bakeries.length > 0 && <div style={{ fontSize: 11, color: "var(--text3)", margin: "10px 0 6px" }}>Or add new bakery:</div>}
            <input className="login-input" placeholder="Bakery name (e.g. Khan Bakery)"
              value={bakeryInput} onChange={(e) => setBakeryInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loginBakery()} />
            <button className="btn" onClick={loginBakery} disabled={!bakeryInput.trim()}>Enter as Bakery →</button>
          </div>

          <div className="login-divider">OR</div>

          <div className="login-card">
            <h3>🏭 I'm at the Factory</h3>
            <button className="btn" style={{ background: "var(--text)" }} onClick={() => setScreen("factory")}>
              Enter as Factory →
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── BAKERY ── */
  if (screen === "bakery") {
    return (
      <>
        <style>{CSS}</style>
        <div className="app">
          <div className="hdr">
            <div className="hdr-row">
              <div>
                <h1>🍞 BakeryFlow</h1>
                <div className="hdr-sub">🏪 {bakeryName}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="hdr-btn" onClick={() => {
                  setScreen("factory"); setBakeryFilter(bakeryName); setStatusFilter("all");
                }}>📋 My Orders</button>
                <button className="hdr-btn" onClick={() => setScreen("login")}>↩</button>
              </div>
            </div>
          </div>

          <div className="search" style={{ marginTop: 10 }}>
            <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="cats">
            {CATEGORIES.map((c) => (
              <button key={c.id} className={`chip ${activeCat === c.id ? "on" : ""}`}
                onClick={() => { setActiveCat(c.id); setSearch(""); }}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>

          <div className="quick-add" onClick={() => setShowQuickAdd(true)}>
            + Add Custom Item to {CATEGORIES.find(c => c.id === activeCat)?.name || "list"}
          </div>

          {showQuickAdd && (
            <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowQuickAdd(false)}>
              <div className="modal" style={{ maxHeight: "50vh" }}>
                <div className="m-hdr">
                  <h2>Add Custom Item</h2>
                  <button className="m-close" onClick={() => setShowQuickAdd(false)}>✕</button>
                </div>
                <div className="m-body">
                  <QuickAddForm catId={activeCat} onAdd={(prod) => { addProduct(activeCat, prod); setShowQuickAdd(false); showToast(`${prod.name} added!`); }} />
                </div>
              </div>
            </div>
          )}

          <div className="prod-list">
            {catProducts.length === 0 ? (
              <div className="empty"><div className="ic">📭</div><p>No products here yet. Tap "Add Custom Item" above!</p></div>
            ) : (
              catProducts.map((p) => {
                const qty = cart[p.id] || 0;
                return (
                  <div className={`prod ${qty > 0 ? "has-qty" : ""}`} key={p.id}>
                    {p.image ? <img src={p.image} className="prod-img" alt="" loading="lazy" /> : <div className="prod-img">🍞</div>}
                    <div className="prod-info">
                      <div className="prod-name">{p.name}</div>
                      <div className="prod-unit">
                        {p.unit === "g" ? `step: ${p.step}g` :
                          p.unit === "ml" ? `step: ${p.step}ml` :
                            p.unit === "kg" && p.step < 1 ? `step: ${p.step * 1000}g` :
                              p.unit === "ltr" && p.step < 1 ? `step: ${p.step * 1000}ml` :
                                `step: ${p.step} ${p.unit}`}
                      </div>
                    </div>
                    <div className="qty-area">
                      <button className="qty-b" onClick={() => adjQty(p.id, -1)}>−</button>
                      <input className="qty-in" type="number" step={p.step} min="0"
                        value={qty || ""} placeholder="0"
                        onChange={(e) => setQtyDirect(p.id, e.target.value)} />
                      <span className="qty-unit-tag">{p.unit}</span>
                      <button className="qty-b" onClick={() => adjQty(p.id, 1)}>+</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="cart-bar" onClick={() => setShowCart(true)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="cart-cnt">{cartItems.length}</span>
                <span style={{ fontSize: 13 }}>{cartItems.length} item{cartItems.length > 1 ? "s" : ""}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Review Order →</div>
            </div>
          )}

          {showCart && (
            <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowCart(false)}>
              <div className="modal">
                <div className="m-hdr">
                  <h2>🛒 Review Order</h2>
                  <button className="m-close" onClick={() => setShowCart(false)}>✕</button>
                </div>
                <div className="m-body">
                  {cartItems.map(([pid, qty]) => {
                    const p = findProduct(pid);
                    if (!p) return null;
                    return (
                      <div className="c-item" key={pid}>
                        {p.image && <img src={p.image} style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover", marginRight: 10 }} alt="" loading="lazy" />}
                        <div className="c-item-info">
                          <div className="c-item-name">{p.name}</div>
                          <div className="c-item-qty">{fmtQty(qty, p.unit)}</div>
                        </div>
                        <div className="qty-area" style={{ marginRight: 6 }}>
                          <button className="qty-b" style={{ width: 26, height: 26, fontSize: 13 }} onClick={() => adjQty(pid, -1)}>−</button>
                          <span style={{ fontWeight: 700, fontSize: 13, minWidth: 40, textAlign: "center" }}>{fmtQty(qty, p.unit)}</span>
                          <button className="qty-b" style={{ width: 26, height: 26, fontSize: 13 }} onClick={() => adjQty(pid, 1)}>+</button>
                        </div>
                        <button className="c-item-rm" onClick={() => setQtyDirect(pid, 0)}>🗑</button>
                      </div>
                    );
                  })}
                  <textarea className="note" rows={2} placeholder="Note for factory (optional)..."
                    value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
                </div>
                <div className="m-foot">
                  <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>
                    📦 {cartItems.length} items from <strong>{bakeryName}</strong>
                  </div>
                  <button className="btn" onClick={placeOrder}>Place Order →</button>
                </div>
              </div>
            </div>
          )}

          {toast && <div className="toast">✅ {toast}</div>}
        </div>
      </>
    );
  }

  /* ── FACTORY ── */
  if (screen === "factory") {
    return (
      <>
        <style>{CSS}</style>
        <div className={`app ${printOrder ? "print-active" : ""}`}>
          <div className="hdr">
            <div className="hdr-row">
              <div>
                <h1>🏭 BakeryFlow</h1>
                <div className="hdr-sub">Factory Dispatch</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {!showPM && <button className="hdr-btn" onClick={() => setShowSummary(true)}>📊 Today</button>}
                <button className="hdr-btn" onClick={() => setShowPM(!showPM)}>
                  {showPM ? "📋 Orders" : "⚙️ Products"}
                </button>
                <button className="hdr-btn" onClick={() => { setScreen("login"); setBakeryFilter("all"); }}>↩</button>
              </div>
            </div>
          </div>

          {printOrder && (
            <div className="print-sec">
              <div style={{ paddingBottom: 20, borderBottom: "2px solid #000", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>BakeryFlow Dispatch Slip</h2>
                <div style={{ fontSize: 14, marginTop: 4 }}>🏪 {printOrder.bakery}</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>🔖 Order #{printOrder.id.slice(-6).toUpperCase()}</div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>📅 {fmtDate(printOrder.timestamp)}</div>
              </div>
              <div style={{ marginBottom: 20 }}>
                {printOrder.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed #ccc", fontSize: 15 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {item.image ? <img src={item.image} style={{ width: 20, height: 20, borderRadius: 4, objectFit: "cover" }} alt="" /> : null}
                      {item.name}
                    </span>
                    <span style={{ fontWeight: 700 }}>{fmtQty(item.qty, item.unit)}</span>
                  </div>
                ))}
              </div>
              {printOrder.note && (
                <div style={{ padding: 12, background: "#f9f9f9", borderLeft: "4px solid #000", fontStyle: "italic", fontSize: 14 }}>
                  📝 Note: {printOrder.note}
                </div>
              )}
              <div style={{ marginTop: 40, textAlign: "center", fontSize: 12, color: "#666" }}>--- End of Slip ---</div>
              <div className="no-print" style={{ marginTop: 30, display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="btn" style={{ width: "auto", padding: "10px 20px" }} onClick={() => window.print()}>🖨️ Print Now</button>
                <button className="btn-o" style={{ width: "auto", padding: "10px 20px" }} onClick={() => setPrintOrder(null)}>Done</button>
              </div>
            </div>
          )}

          {showSummary && (
            <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowSummary(false)}>
              <div className="modal" style={{ maxHeight: "80vh" }}>
                <div className="m-hdr">
                  <h2>📊 Today's Summary</h2>
                  <button className="m-close" onClick={() => setShowSummary(false)}>✕</button>
                </div>
                <div className="m-body">
                  <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>Total quantities ordered today across all bakeries.</div>
                  {getDailySummary().length === 0 ? (
                    <div className="empty"><div className="ic">🤷</div><p>No orders today</p></div>
                  ) : (
                    getDailySummary().map((item, idx) => (
                      <div key={idx} className="c-item" style={{ padding: "10px 0" }}>
                        {item.image ? <img src={item.image} style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover", marginRight: 10 }} alt="" loading="lazy" /> : <div className="pm-img" style={{ width: 28, height: 28, fontSize: 14, marginRight: 10 }}>🍞</div>}
                        <span className="c-item-info c-item-name">{item.name}</span>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--accent)" }}>{fmtQty(item.qty, item.unit)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {!showPM ? (
            <>
              {uniqueBakeries.length > 1 && (
                <div className="bk-filter" style={{ marginTop: 8 }}>
                  <button className={`bk-chip ${bakeryFilter === "all" ? "on" : ""}`} onClick={() => setBakeryFilter("all")}>All Bakeries</button>
                  {uniqueBakeries.map((b) => (
                    <button key={b} className={`bk-chip ${bakeryFilter === b ? "on" : ""}`} onClick={() => setBakeryFilter(b)}>🏪 {b}</button>
                  ))}
                </div>
              )}

              <div className="f-tabs">
                <button className={`f-tab ${statusFilter === "all" ? "on" : ""}`} onClick={() => setStatusFilter("all")}>All {orders.length}</button>
                {STATUS_FLOW.map((s) => (
                  <button key={s} className={`f-tab ${statusFilter === s ? "on" : ""}`} onClick={() => setStatusFilter(s)}>
                    {STATUS_CFG[s].icon} {statusCounts[s]}
                  </button>
                ))}
              </div>

              <div className="orders">
                {filteredOrders.length === 0 ? (
                  <div className="empty"><div className="ic">📭</div><p>No {statusFilter !== "all" ? statusFilter : ""} orders</p></div>
                ) : (
                  filteredOrders.map((order) => {
                    const sc = STATUS_CFG[order.status];
                    const si = STATUS_FLOW.indexOf(order.status);
                    const next = si + 1 < STATUS_FLOW.length ? STATUS_FLOW[si + 1] : null;
                    const prev = si - 1 >= 0 ? STATUS_FLOW[si - 1] : null;

                    return (
                      <div className="o-card" key={order.id}>
                        <div className="o-top">
                          <div>
                            <div className="o-id">#{order.id.slice(-6).toUpperCase()}</div>
                            <div className="o-from">🏪 {order.bakery}</div>
                            <div className="o-time">{fmtDate(order.timestamp)}</div>
                          </div>
                          <span className="s-badge" style={{ background: sc.bg, color: sc.color }}>
                            {sc.icon} {sc.label}
                          </span>
                        </div>
                        <div className="o-items">
                          {order.items.map((item, i) => (
                            <div className="o-line" key={i} style={{ alignItems: "center", gap: 8 }}>
                              {item.image ? <img src={item.image} style={{ width: 24, height: 24, borderRadius: 4, objectFit: "cover" }} alt="" loading="lazy" /> : null}
                              <span style={{ flex: 1 }}>{item.name}</span>
                              <span style={{ fontWeight: 600 }}>{fmtQty(item.qty, item.unit)}</span>
                            </div>
                          ))}
                        </div>
                        {order.note && (
                          <div className="o-note"><div className="o-note-t">📝 {order.note}</div></div>
                        )}
                        <div className="o-acts">
                          <button className="btn-s btn-o" onClick={() => setPrintOrder(order)}>🖨️ Print</button>
                          <button className="btn-s" style={{ background: "#25D366", color: "#fff", borderColor: "#25D366" }} onClick={() => shareWhatsApp(order)}>📱 WA</button>
                          <div style={{ flex: 1 }}></div>
                          {prev && (
                            <button className="btn-s" style={{ background: "var(--bg2)", color: "var(--text3)" }}
                              onClick={() => updateStatus(order.id, prev)}>← {STATUS_CFG[prev].label}</button>
                          )}
                          {next && (
                            <button className="btn-s" style={{ background: STATUS_CFG[next].color, color: "#fff" }}
                              onClick={() => updateStatus(order.id, next)}>{STATUS_CFG[next].icon} Mark {STATUS_CFG[next].label}</button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <>
              <div className="cats" style={{ marginTop: 8 }}>
                {CATEGORIES.map((c) => (
                  <button key={c.id} className={`chip ${activeCat === c.id ? "on" : ""}`} onClick={() => setActiveCat(c.id)}>
                    {c.icon} {c.name} ({(products[c.id] || []).length})
                  </button>
                ))}
              </div>
              <div className="pm">
                <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 10 }}>
                  Manage <strong>{CATEGORIES.find(c => c.id === activeCat)?.name}</strong> products — changes sync to all bakeries
                </div>
                {(products[activeCat] || []).map((p) => (
                  <div className="pm-item" key={p.id}>
                    {p.image ? <img src={p.image} className="pm-img" alt="" loading="lazy" /> : <div className="pm-img">🍞</div>}
                    <span>{p.name}</span>
                    <span className="pm-meta">{p.unit} · step {p.unit === "g" || p.unit === "ml" ? p.step + p.unit : p.unit === "kg" && p.step < 1 ? (p.step * 1000) + "g" : p.step + " " + p.unit}</span>
                    <button className="btn-s btn-d" onClick={() => removeProduct(activeCat, p.id)}>✕</button>
                  </div>
                ))}
                <QuickAddForm catId={activeCat} onAdd={(prod) => { addProduct(activeCat, prod); showToast(`${prod.name} added!`); }} />

                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 16, marginTop: 24 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>⚠️ Reset All Data</div>
                  <p style={{ fontSize: 11, color: "var(--text3)", marginBottom: 10 }}>Deletes all orders and restores defaults.</p>
                  <button className="btn-s btn-d" style={{ padding: "8px 16px" }} onClick={async () => {
                    if (confirm("Reset everything?")) {
                      setOrders([]); setProducts(DEFAULT_PRODUCTS); setCart({});
                      await sSet("bf-orders", []); await sSet("bf-products", DEFAULT_PRODUCTS);
                      showToast("All data reset");
                    }
                  }}>Reset Everything</button>
                </div>
              </div>
            </>
          )}

          {toast && <div className="toast">✅ {toast}</div>}
        </div>
      </>
    );
  }
  return null;
}

/* ═══════════════════════════════════════════
   QUICK ADD FORM (used by both bakery + factory)
   ═══════════════════════════════════════════ */
function QuickAddForm({ catId, onAdd }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("kg");
  const [step, setStep] = useState("0.25");
  const [image, setImage] = useState("");

  const stepOpts = {
    kg: ["0.1", "0.25", "0.5", "1"],
    g: ["50", "100", "250", "500"],
    ltr: ["0.25", "0.5", "1"],
    ml: ["100", "250", "500"],
    pcs: ["1", "2", "5", "10"],
    dozen: ["0.5", "1"],
    pkt: ["1", "5", "10"],
    box: ["1"],
    tray: ["1"],
    plate: ["1"],
  };

  function onUnitChange(u) {
    setUnit(u);
    setStep((stepOpts[u] || ["1"])[0]);
  }

  function handleAdd() {
    if (!name.trim()) return;
    onAdd({ id: uid(), name: name.trim(), unit, step: parseFloat(step), image: image.trim() });
    setName("");
    setImage("");
  }

  return (
    <div className="pm-add">
      <input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()} style={{ flex: "2 1 100px" }} />
      <input placeholder="Image URL (optional)" value={image} onChange={(e) => setImage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()} style={{ flex: "2 1 100px" }} />
      <select value={unit} onChange={(e) => onUnitChange(e.target.value)} style={{ flex: "1 1 60px" }}>
        {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
      </select>
      <select value={step} onChange={(e) => setStep(e.target.value)} style={{ flex: "1 1 70px" }}>
        {(stepOpts[unit] || ["1"]).map((s) => <option key={s} value={s}>step {s}</option>)}
      </select>
      <button className="btn" style={{ flex: "0 0 auto", width: "auto", padding: "9px 18px" }} onClick={handleAdd}>+ Add</button>
    </div>
  );
}
