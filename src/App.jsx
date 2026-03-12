import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

/* ═══════════════════════════════════════════
   CONFIG & DATA
   ═══════════════════════════════════════════ */

const INITIAL_CATEGORIES = [
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

const BAKERY_NAMES = [
  "Khan Bakery",
  "Malik Sweets",
  "Al-Madina Bakery",
  "City Bakery",
  "Royal Sweets",
  "New Karachi Bakery",
  "Fresho Bakery",
  "Taj Mahal Sweets",
  "Gulshan Bakery",
  "Star Bakery",
  "United Bakery",
  "Bismillah Sweets",
];

const DEMO_ACCOUNTS = [
  { email: "admin@bakeryflow.com", password: "admin123", role: "admin", label: "👑 Admin" },
  { email: "factory@bakeryflow.com", password: "factory123", role: "factory", label: "🏭 Factory" },
  { email: "driver@bakeryflow.com", password: "driver123", role: "driver", label: "🚚 Driver" },
  { email: "khan@bakeryflow.com", password: "bakery123", role: "bakery", label: "🏪 Khan Bakery" },
  { email: "malik@bakeryflow.com", password: "bakery123", role: "bakery", label: "🏪 Malik Sweets" },
];

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
    { id: "c4", name: "Pineapple Cake", unit: "kg", step: 0.5 }
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

const STATUS_FLOW = ["pending", "packed", "dispatching", "delivered"];
const STATUS_CFG = {
  pending: { label: "Pending", color: "#F59E0B", bg: "#FEF3C7", icon: "⏳" },
  packed: { label: "Packed", color: "#3B82F6", bg: "#DBEAFE", icon: "📦" },
  dispatching: { label: "Dispatching", color: "#8B5CF6", bg: "#EDE9FE", icon: "🚚" },
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

/* ─── Storage (Deprecated - Now using Supabase) ─── */
// async function sGet(key) { try { const r = await window.storage.get(key, true); return r ? JSON.parse(r.value) : null; } catch { return null; } }
// async function sSet(key, val) { try { await window.storage.set(key, JSON.stringify(val), true); } catch (e) { console.error(e); } }

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

/* CSS REVAMP FOR DESKTOP */
.app{width:100%;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;background:var(--bg);position:relative;}
.layout-grid { display: block; }
.layout-sidebar { display: block; padding: 8px 12px; }
.layout-sidebar .cats { flex-direction: row; flex-wrap: nowrap; overflow-x: auto; }
.layout-main { width: 100%; }

@media (min-width: 768px) {
  .app { max-width: 1400px; }
  .app-hdr { border-radius: 0 0 16px 16px; margin-bottom: 20px; }
  .layout-grid { display: grid; grid-template-columns: 240px 1fr; gap: 24px; padding: 0 20px; align-items: start; }
  .layout-sidebar { display: block; position: sticky; top: 90px; padding: 0; }
  .layout-sidebar .cats { flex-direction: column; flex-wrap: wrap; overflow-x: visible; align-items: stretch; gap: 4px; }
  .layout-sidebar .chip { text-align: left; padding: 10px 14px; border: none; border-radius: 12px; font-size: 13px; }
  .layout-sidebar .chip:not(.on) { background: transparent; color: var(--text); }
  .layout-sidebar .chip.on { background: var(--bg2); color: var(--accent); border: none; }
  .layout-main { background: transparent; padding: 0; min-height: calc(100vh - 120px); }
  .prod-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; padding: 10px 0 130px; }
  .orders { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; padding: 10px 0 130px; align-items: start; }
  .pm { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; padding: 20px 0 130px; }
  .cart-bar { max-width: 1360px; border-radius: 16px; margin-bottom: 12px; }
}

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
.modal{background:var(--bg);border-radius:0;width:100vw;height:100vh;max-width:none;max-height:none;display:flex;flex-direction:column;animation:slideUp .25s ease-out;}
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

/* ═══ RESPONSIVE MOBILE ═══ */
@media (max-width: 480px) {
  .hdr { padding: 10px 12px; }
  .hdr h1 { font-size: 16px; gap: 4px; }
  .hdr-btn { padding: 5px 8px; font-size: 10px; }
  .hdr-sub { font-size: 9px; letter-spacing: 0.8px; }

  /* Login */
  .login { padding: 24px 16px; }
  .login-logo { font-size: 40px; margin-bottom: 10px; }
  .login h2 { font-size: 22px; }
  .login p { font-size: 12px; margin-bottom: 20px; }
  .login-card { padding: 16px; }
  .login-input { padding: 10px 12px; font-size: 13px; }

  /* Products */
  .prod-list { padding: 2px 10px 120px; }
  .prod { padding: 8px 10px; }
  .prod-img { width: 40px; height: 40px; margin-right: 8px; }
  .prod-name { font-size: 12.5px; }
  .prod-unit { font-size: 10px; }
  .qty-b { width: 28px; height: 28px; font-size: 14px; }
  .qty-in { width: 46px; font-size: 13px; }

  /* Cart */
  .cart-bar { padding: 10px 14px; border-radius: 14px 14px 0 0; }
  .cart-cnt { width: 22px; height: 22px; font-size: 11px; }

  /* Orders */
  .orders { padding: 6px 10px 120px; gap: 6px; }
  .o-card { border-radius: 10px; }
  .o-top { padding: 10px 12px; }
  .o-id { font-size: 12px; }
  .o-items { padding: 0 12px 6px; }
  .o-line { font-size: 11px; }
  .o-acts { padding: 6px 12px 10px; }
  .s-badge { font-size: 9px; padding: 2px 7px; }

  /* Category chips */
  .cats { padding: 4px 10px 8px; gap: 5px; }
  .chip { padding: 6px 10px; font-size: 11px; }

  /* Search */
  .search { margin: 0 10px 6px; }
  .search input { padding: 8px 12px 8px 30px; font-size: 12px; }

  /* Quick add */
  .quick-add { margin: 0 10px 6px; padding: 8px 12px; font-size: 11px; }

  /* Modals */
  .m-hdr { padding: 14px 14px 8px; }
  .m-hdr h2 { font-size: 16px; }
  .m-body { padding: 10px 14px; }
  .m-foot { padding: 10px 14px; }
  
  /* Product manager compact */
  .pm-add { gap: 4px; }
  .pm-add input, .pm-add select { padding: 7px 8px; font-size: 12px; min-width: 50px; }
  .pm-item { padding: 7px 8px; gap: 6px; }
  .pm-item span { font-size: 11px; }

  /* Buttons compact */
  .btn { padding: 11px; font-size: 13px; }
  .btn-o { padding: 6px 10px; font-size: 11px; }
  .btn-s { padding: 4px 8px; font-size: 10px; }

  /* Toast */
  .toast { font-size: 12px; padding: 8px 16px; top: 60px; max-width: calc(100vw - 32px); text-align: center; }

  /* Filter tabs */
  .f-tabs { margin: 8px 10px; }
  .f-tab { padding: 6px 2px; font-size: 10px; }

  /* Bakery filter */
  .bk-filter { padding: 4px 10px 6px; gap: 4px; }
  .bk-chip { padding: 4px 9px; font-size: 10px; }

  /* Empty state */
  .empty { padding: 30px 16px; }
  .empty .ic { font-size: 32px; }
  .empty p { font-size: 12px; }
}

/* Tablet tweaks */
@media (min-width: 481px) and (max-width: 767px) {
  .orders { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; }
  .prod-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 8px; }
}
`;

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [screen, setScreenState] = useState("loading");
  
  function navigate(newScreen) {
    setScreenState(newScreen);
  }
  
  // To avoid stale closures in the Supabase real-time callback, track these in refs
  const screenRef = useRef(screen);
  const bakeryNameRef = useRef("");
  
  const [bakeryName, setBakeryNameState] = useState("");
  
  function setBakeryName(name) {
    bakeryNameRef.current = name;
    setBakeryNameState(name);
  }
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  function handleSession(session) {
    setSession(session);
    if (session) {
      const role = session.user.user_metadata?.role || "bakery";
      setUserRole(role);
      const name = session.user.user_metadata?.name || session.user.email;
      setBakeryName(name);

      if (screenRef.current === "loading" || screenRef.current === "login") {
         if (role === "admin") navigate("admin");
         else if (role === "factory") navigate("factory");
         else if (role === "driver") navigate("driver");
         else navigate("bakery-orders");
      }
    } else {
      navigate("login");
      setUserRole(null);
      setBakeryName("");
    }
  }

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  const [bakeryInput, setBakeryInput] = useState("");

  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [orders, setOrders] = useState([]);

  const [bakeries, setBakeries] = useState([]);
  const [dbCategories, setDbCategories] = useState(INITIAL_CATEGORIES);

  const [cart, setCart] = useState({});
  const [activeCat, setActiveCat] = useState("mithai");
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [toast, setToast] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showCatMan, setShowCatMan] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [statusFilter, setStatusFilter] = useState("pending");
  const [adminTab, setAdminTab] = useState("overview");
  const [bakeryFilter, setBakeryFilter] = useState("all");
  const [showPM, setShowPM] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [printOrder, setPrintOrder] = useState(null);

  useEffect(() => {
    (async () => {
      // Fetch initial data from Supabase
      const [
        { data: oData },
        { data: pData },
        { data: bData }
      ] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*'),
        supabase.from('bakeries').select('*')
      ]);

      if (oData) {
        // Map from Supabase format to local format
        const formattedOrders = oData.map(o => ({
          id: o.id,
          bakery: o.bakery_name,
          status: o.status,
          note: o.note,
          items: o.items,
          timestamp: new Date(o.created_at).getTime()
        }));
        setOrders(formattedOrders);
        lastPollOrders = formattedOrders; // Initialize tracker
      }

      if (pData) {
        // Group flat product list into the category object structure
        const prodMap = { ...DEFAULT_PRODUCTS };
        // Empty out arrays that have data to avoid mixing placeholders with real data if we want
        for (const cat in prodMap) { prodMap[cat] = []; } // Let's clear defaults and only show real DB products

        pData.forEach(p => {
          if (!prodMap[p.category_id]) prodMap[p.category_id] = [];
          prodMap[p.category_id].push({
            id: p.id,
            name: p.name,
            unit: p.unit,
            step: Number(p.step),
            image: p.image_url || "",
            is_available: p.is_available !== false // handle missing col via default true
          });
        });
        setProducts(prodMap);
      }

      if (bData) {
        setBakeries(bData.map(b => b.name));
      }
      
      setIsAppLoading(false);
    })();
    
    let lastPollOrders = []; // Outer variable out of react's scope

    // Polling fallback mechanism in case Supabase real-time is disabled on the backend table
    const pollInterval = setInterval(async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error || !data) return;
      
      const formattedData = data.map(o => ({
        id: o.id,
        bakery: o.bakery_name,
        status: o.status,
        note: o.note,
        items: o.items || [],
        timestamp: new Date(o.created_at).getTime()
      }));
      
      // Perform strict local comparison outside of React State
      if (lastPollOrders.length > 0) {
        formattedData.forEach(newOrder => {
          const oldOrder = lastPollOrders.find(o => o.id === newOrder.id);
          if (oldOrder && oldOrder.status !== newOrder.status) {
            if (screenRef.current === 'bakery-orders' && newOrder.bakery === bakeryNameRef.current) {
               showToast(`Order #${newOrder.id.slice(-6).toUpperCase()} is now ${STATUS_CFG[newOrder.status].label}!`);
               if (Notification.permission === "granted") {
                  new Notification("Order Updated", { body: `Your order is now ${STATUS_CFG[newOrder.status].label}` });
               }
            }
          }
        });
      }
      
      lastPollOrders = formattedData;
      setOrders(formattedData);
      
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    // Setup real-time subscriptions for live synced updates
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
           if (screenRef.current === 'factory') {
              if (Notification.permission === "granted") {
                 new Notification("New Order!", { body: `Order received from ${payload.new.bakery_name}` });
              }
              const audio = new Audio("https://actions.google.com/sounds/v1/alarms/positive_notification.ogg");
              audio.play().catch(() => {});
           }
           setOrders(prev => [{
              id: payload.new.id,
              bakery: payload.new.bakery_name,
              status: payload.new.status,
              note: payload.new.note,
              items: payload.new.items,
              timestamp: new Date(payload.new.created_at).getTime()
           }, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
           // Because Postgres REPLICA IDENTITY might not be FULL or RLS might strip payload data,
           // we act on the ping by re-fetching the updated row explicitly.
           supabase.from('orders').select('*').eq('id', payload.new.id).single()
             .then(({ data: updatedRow }) => {
               if (!updatedRow) return;
               
               setOrders(prev => {
                 const existing = prev.find(o => o.id === updatedRow.id);
                 if (!existing) return prev;
                 
                 return prev.map(o => o.id === updatedRow.id ? {
                    id: updatedRow.id,
                    bakery: updatedRow.bakery_name,
                    status: updatedRow.status,
                    note: updatedRow.note,
                    items: updatedRow.items || [], // ensure array
                    timestamp: new Date(updatedRow.created_at).getTime()
                 } : o);
               });
             });
        } else if (payload.eventType === 'DELETE') {
           setOrders(prev => prev.filter(o => o.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async (payload) => {
         // for products, a refetch is safer to ensure categories stay grouped correctly, 
         // but we can optimize it if it becomes a bottleneck. It happens much less frequently than orders.
         const { data } = await supabase.from('products').select('*');
         if (data) {
           const pm = {};
           dbCategories.forEach(c => pm[c.id] = []);
           data.forEach(p => {
             if (pm[p.category_id]) pm[p.category_id].push({ 
               id: p.id, name: p.name, unit: p.unit, step: Number(p.step), image: p.image_url || "", is_available: p.is_available !== false 
             });
           });
           setProducts(pm);
         }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (Notification.permission === "default") {
       Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (printOrder) {
      setTimeout(() => window.print(), 100);
    }
  }, [printOrder]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  async function logout() {
    await supabase.auth.signOut();
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

    const formattedItems = cartItems.map(([pid, qty]) => {
      const p = findProduct(pid);
      return { productId: pid, name: p?.name || pid, qty, unit: p?.unit || "", step: p?.step || 1, image: p?.image || "" };
    });

    // 1. Insert into Supabase Orders
    const { data: insertedOrder, error: oErr } = await supabase.from('orders').insert([{
      bakery_name: bakeryName,
      status: 'pending',
      note: orderNote.trim(),
      items: formattedItems
    }]).select().single();

    if (oErr) {
      console.error("Order error", oErr);
      showToast("Failed to place order.");
      return;
    }

    // 2. Insert into Supabase Logs
    await supabase.from('logs').insert([{
      action: 'ORDER_PLACED',
      details: `${bakeryName} placed an order with ${formattedItems.length} items.`
    }]);

    const newOrderLocal = {
      id: insertedOrder.id,
      bakery: insertedOrder.bakery_name,
      timestamp: new Date(insertedOrder.created_at).getTime(),
      status: insertedOrder.status,
      note: insertedOrder.note,
      items: insertedOrder.items
    };

    setOrders([newOrderLocal, ...orders]);
    setCart({});
    setOrderNote("");
    setShowCart(false);
    showToast("Order placed successfully!");
  }

  async function updateStatus(oid, ns) {
    // 1. Update in Supabase
    const { error } = await supabase.from('orders').update({ status: ns, updated_at: new Date().toISOString() }).eq('id', oid);
    if (!error) {
      setOrders(orders.map((o) => o.id === oid ? { ...o, status: ns, [`${ns}At`]: Date.now() } : o));

      const targetOrder = orders.find(o => o.id === oid);
      await supabase.from('logs').insert([{
        action: 'STATUS_UPDATED',
        details: `Order for ${targetOrder?.bakery || 'Unknown'} updated to ${ns}.`
      }]);
    }
  }

  async function cancelOrder(oid) {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    const { error } = await supabase.from('orders').delete().eq('id', oid);
    if (!error) {
      setOrders(orders.filter(o => o.id !== oid));
      showToast("Order cancelled.");
    }
  }

  async function addProduct(catId, prod) {
    const newP = { ...prod, is_available: true };
    setProducts(prev => ({
      ...prev, [catId]: [...(prev[catId] || []), newP]
    }));

    const { error } = await supabase.from('products').insert([{
      name: prod.name, category_id: catId, unit: prod.unit, step: prod.step, image_url: prod.image || null, is_available: true
    }]);

    if (error) {
      console.error("Add Product Error:", error);
      showToast("Failed to add product");
      // Rollback optimistic update
      setProducts(prev => ({
        ...prev, [catId]: (prev[catId] || []).filter(p => p.id !== newP.id)
      }));
    } else {
      await supabase.from('logs').insert([{ action: 'PRODUCT_ADDED', details: `Added ${prod.name} to ${catId}` }]);
    }
  }

  async function updateProductDetails(catId, pid, updatedProd) {
    const pOrg = findProduct(pid);
    if (!pOrg) return;

    setProducts(prev => {
       const updated = { ...prev };
       updated[catId] = updated[catId].map(p => p.id === pid ? { ...p, ...updatedProd } : p);
       return updated;
    });

    await supabase.from('products').update({
       name: updatedProd.name,
       unit: updatedProd.unit,
       step: updatedProd.step,
       image_url: updatedProd.image || null
    }).eq('name', pOrg.name); // Using name as fallback identifier
  }

  async function removeProduct(catId, pid) {
    // Optimistic local state update
    setProducts(prev => ({
      ...prev, [catId]: (prev[catId] || []).filter(p => p.id !== pid)
    }));
    const { error } = await supabase.from('products').delete().eq('id', pid);
    if (!error) {
      await supabase.from('logs').insert([{ action: 'PRODUCT_REMOVED', details: `Removed product ID ${pid}` }]);
    }
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
    text += `📊 Status: ${(STATUS_CFG[order.status] || {}).label || order.status}\n`;
    text += `⏰ ${fmtDate(order.timestamp)}\n\n`;
    text += `*Items:*\n`;
    (order.items || []).forEach(i => {
      text += `• ${i.name} - ${fmtQty(i.qty, i.unit)}\n`;
    });
    if (order.note) text += `\n📝 Note: ${order.note}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  if (isAppLoading || screen === "loading") {
    return (
      <div className="app" style={{ alignItems: "center", justifyContent: "center" }}>
        <style>{CSS}</style>
        <div style={{ textAlign: "center" }}>
          <div className="login-logo" style={{ fontSize: 40, marginBottom: 16 }}>🍞</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>Loading BakeryFlow...</h2>
        </div>
      </div>
    );
  }

  if (printOrder) {
    return (
      <>
        <style>{CSS}</style>
        <div className="app print-active">
            <div className="print-sec" style={{ display: 'block', padding: 20, minHeight: '100vh', background: '#fff' }}>
              <div style={{ paddingBottom: 20, borderBottom: "2px solid #000", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>
                  {screen === "bakery-orders" ? `${printOrder.bakery} - Invoice` : "BakeryFlow Dispatch Slip"}
                </h2>
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
        </div>
      </>
    );
  }

  /* ── LOGIN ── */
  if (!session && screen === "login") {
    return (
      <>
        <style>{CSS}</style>
        <AuthScreen showToast={showToast} bakeryNames={bakeries.length > 0 ? bakeries : BAKERY_NAMES} />
        {toast && <div className="toast">✅ {toast}</div>}
      </>
    );
  }

  /* ── ADMIN ── */
  if (screen === "admin" && userRole === "admin") {
    const deliveredCount = orders.filter(o => o.status === "delivered").length;
    const activeBakeries = new Set(orders.map(o => o.bakery)).size;
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todaysOrders = orders.filter(o => o.timestamp >= todayStart.getTime());
    const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";


    // Bakery performance data
    const bakeryPerf = [...new Set(orders.map(o => o.bakery))].map(b => {
      const bOrders = orders.filter(o => o.bakery === b);
      return {
        name: b,
        total: bOrders.length,
        pending: bOrders.filter(o => o.status === "pending").length,
        delivered: bOrders.filter(o => o.status === "delivered").length,
        items: bOrders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.qty, 0), 0),
      };
    }).sort((a, b) => b.total - a.total);

    return (
      <>
        <style>{CSS}</style>
        <div className="app">
          <div className="hdr app-hdr" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)" }}>
            <div className="hdr-row">
              <div>
                <h1 style={{ fontSize: 18 }}>👑 BakeryFlow</h1>
                <div className="hdr-sub">ADMIN CONTROL CENTER</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="hdr-btn" onClick={() => navigate("factory")}>🏭</button>
                <button className="hdr-btn" onClick={() => navigate("driver")}>🚚</button>
                <button className="hdr-btn" onClick={logout}>🚪</button>
              </div>
            </div>
          </div>

          <div style={{ padding: "16px 16px 0" }}>
            {/* Welcome Banner */}
            <div style={{ background: "linear-gradient(135deg, #1E1208 0%, #3D2B1A 50%, #5C3D1E 100%)", borderRadius: 16, padding: "24px 24px 20px", color: "#fff", marginBottom: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: 16, top: 12, fontSize: 48, opacity: 0.15 }}>👑</div>
              <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>{greeting} 👋</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif", marginBottom: 8 }}>
                {session?.user?.user_metadata?.name || "Admin"}
              </div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>
                📊 {todaysOrders.length} orders today · {orders.filter(o => o.status === "pending").length} awaiting action
              </div>
            </div>

            {/* Quick Access */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginBottom: 16 }}>
              <button className="o-card" style={{ padding: "14px 12px", border: "1px solid var(--border)", cursor: "pointer", textAlign: "center", background: "var(--card)", transition: "all .15s" }}
                onClick={() => navigate("factory")}
                onMouseOver={e => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🏭</div>
                <div style={{ fontSize: 11, fontWeight: 600 }}>Factory</div>
              </button>
              <button className="o-card" style={{ padding: "14px 12px", border: "1px solid var(--border)", cursor: "pointer", textAlign: "center", background: "var(--card)", transition: "all .15s" }}
                onClick={() => navigate("driver")}
                onMouseOver={e => e.currentTarget.style.borderColor = "#8B5CF6"}
                onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🚚</div>
                <div style={{ fontSize: 11, fontWeight: 600 }}>Driver</div>
              </button>
              {bakeries.slice(0, 4).map(b => (
                <button key={b} className="o-card" style={{ padding: "14px 12px", border: "1px solid var(--border)", cursor: "pointer", textAlign: "center", background: "var(--card)", transition: "all .15s" }}
                  onClick={() => { setBakeryName(b); navigate("bakery-orders"); }}
                  onMouseOver={e => e.currentTarget.style.borderColor = "#10B981"}
                  onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>🏪</div>
                  <div style={{ fontSize: 10, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b}</div>
                </button>
              ))}
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Total Orders", value: orders.length, icon: "📦", color: "var(--accent)", bg: "linear-gradient(135deg, #FEF3C7, #FDE68A)" },
                { label: "Today", value: todaysOrders.length, icon: "📅", color: "#059669", bg: "linear-gradient(135deg, #D1FAE5, #A7F3D0)" },
                { label: "Pending", value: orders.filter(o => o.status === "pending").length, icon: "⏳", color: "#D97706", bg: "linear-gradient(135deg, #FEF3C7, #FDE68A)" },
                { label: "Delivered", value: deliveredCount, icon: "✅", color: "#059669", bg: "linear-gradient(135deg, #D1FAE5, #A7F3D0)" },
                { label: "Total Items", value: Math.round(totalItems), icon: "🛒", color: "#7C3AED", bg: "linear-gradient(135deg, #EDE9FE, #DDD6FE)" },
                { label: "Bakeries", value: activeBakeries, icon: "🏪", color: "#2563EB", bg: "linear-gradient(135deg, #DBEAFE, #BFDBFE)" },
              ].map((kpi, i) => (
                <div key={i} className="o-card" style={{ padding: "14px 16px", background: kpi.bg, border: "none", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: 8, top: 8, fontSize: 28, opacity: 0.3 }}>{kpi.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: kpi.color, opacity: 0.8, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Tab Navigation */}
            <div style={{ display: "flex", gap: 0, marginBottom: 16, background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
              {[
                { id: "overview", label: "📊 Overview" },
                { id: "orders", label: "📋 Orders" },
                { id: "bakeries", label: "🏪 Bakeries" },
                { id: "manage", label: "⚙️ Manage" },
              ].map(tab => (
                <button key={tab.id} onClick={() => setAdminTab(tab.id)}
                  style={{ flex: 1, padding: "10px 8px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                    background: adminTab === tab.id ? "var(--accent)" : "transparent",
                    color: adminTab === tab.id ? "#fff" : "var(--text3)",
                    transition: "all .15s" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {adminTab === "overview" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 16 }}>
                  <div className="o-card" style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>📊 Status Distribution</h3>
                    <div style={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={STATUS_FLOW.map(s => ({ name: STATUS_CFG[s].label, value: orders.filter(o => o.status === s).length })).filter(d => d.value > 0)}
                            cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value"
                            label={({ name, value, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={{ stroke: "var(--text3)", strokeWidth: 1 }}
                          >
                            {STATUS_FLOW.map(s => <Cell key={s} fill={STATUS_CFG[s].color} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="o-card" style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>🏆 Top Products Today</h3>
                    {getDailySummary().length === 0 ? (
                      <div className="empty" style={{ padding: 30 }}><div className="ic">📭</div><p>No orders today yet</p></div>
                    ) : (
                      <div style={{ height: 220 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getDailySummary().slice(0, 8)} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-35} textAnchor="end" height={55} />
                            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", fontSize: 12 }} />
                            <Bar dataKey="qty" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>

                <div className="o-card" style={{ padding: 20, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 13, marginBottom: 16 }}>📈 Orders by Bakery</h3>
                  <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bakeryPerf.slice(0, 8)} margin={{ top: 0, right: 0, left: -10, bottom: 0 }} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                        <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", fontSize: 12 }} />
                        <Bar dataKey="total" fill="#8B5CF6" radius={[0, 6, 6, 0]} name="Orders" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {adminTab === "orders" && (
              <div style={{ marginBottom: 20 }}>
                {orders.slice(0, 20).map(order => {
                  const sc = STATUS_CFG[order.status] || { bg: "#e5e7eb", color: "#4b5563", icon: "❓", label: order.status || "Unknown" };
                  return (
                    <div key={order.id} className="o-card" style={{ marginBottom: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>#{order.id.slice(-6).toUpperCase()}</span>
                          <span className="s-badge" style={{ background: sc.bg, color: sc.color }}>{sc.icon} {sc.label}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>{order.bakery} · {(order.items || []).length} items · {fmtDate(order.timestamp)}</div>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn-o" style={{ fontSize: 10, padding: "4px 8px" }} onClick={() => setPrintOrder(order)}>🖨️</button>
                        <button className="btn-o" style={{ fontSize: 10, padding: "4px 8px" }} onClick={() => shareWhatsApp(order)}>💬</button>
                      </div>
                    </div>
                  );
                })}
                {orders.length === 0 && <div className="empty"><div className="ic">📭</div><p>No orders yet</p></div>}
              </div>
            )}

            {adminTab === "bakeries" && (
              <div style={{ marginBottom: 20 }}>
                {bakeryPerf.length === 0 ? (
                  <div className="empty"><div className="ic">🏪</div><p>No bakery data yet</p></div>
                ) : (
                  bakeryPerf.map((bp, i) => (
                    <div key={bp.name} className="o-card" style={{ marginBottom: 8, padding: "14px 16px", cursor: "pointer" }}
                      onClick={() => { setBakeryName(bp.name); navigate("bakery-orders"); }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, var(--accent), var(--accent2))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{bp.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text3)" }}>{bp.total} orders · {bp.items} items total</div>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>→</div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {bp.pending > 0 && <span className="s-badge" style={{ background: "#FEF3C7", color: "#D97706" }}>⏳ {bp.pending}</span>}
                        {bp.delivered > 0 && <span className="s-badge" style={{ background: "#D1FAE5", color: "#059669" }}>✅ {bp.delivered}</span>}
                        <span className="s-badge" style={{ background: "var(--bg2)", color: "var(--text2)" }}>📦 {bp.total}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {adminTab === "manage" && (
              <BakeryManager bakeries={bakeries} onUpdate={(updated) => setBakeries(updated)} showToast={showToast} />
            )}
          </div>
          {toast && <div className="toast">✅ {toast}</div>}
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
          <div className="hdr app-hdr">
            <div className="hdr-row">
              <div>
                <h1>🍞 BakeryFlow</h1>
                <div className="hdr-sub">🏪 {bakeryName}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="hdr-btn" onClick={() => navigate("bakery-orders")}>📋 My Orders</button>
                {userRole === "admin" ? (
                   <button className="hdr-btn" style={{ background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" }} onClick={() => navigate("admin")}>👑 Admin</button>
                ) : (
                   <button className="hdr-btn" onClick={logout}>🚪 Logout</button>
                )}
              </div>
            </div>
          </div>

          <div className="layout-grid">
            <div className="layout-sidebar">
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text3)", marginBottom: 8, paddingLeft: 8 }}>CATEGORIES</div>
              <div className="cats" style={{ gap: 6, overflow: "auto", flexWrap: "nowrap" }}>
                {dbCategories.map((c) => (
                  <button key={c.id} className={`chip ${activeCat === c.id ? "on" : ""}`}
                    onClick={() => { setActiveCat(c.id); setSearch(""); }}>
                    <span style={{ marginRight: 4 }}>{c.icon}</span> {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="layout-main">
              <div className="search" style={{ margin: "0 0 16px 0" }}>
                <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>

              <div className="quick-add" style={{ margin: "0 0 16px 0" }} onClick={() => setShowQuickAdd(true)}>
                + Add Custom Item to {dbCategories.find(c => c.id === activeCat)?.name || "list"}
              </div>

              {showQuickAdd && (
                <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowQuickAdd(false)}>
                  <div className="modal">
                    <div className="m-hdr">
                      <h2>Add Custom Item</h2>
                      <button className="m-close" onClick={() => setShowQuickAdd(false)}>✕</button>
                    </div>
                    <div className="m-body">
                      <ProductForm onSubmit={(prod) => { addProduct(activeCat, prod); setShowQuickAdd(false); showToast(`${prod.name} added!`); }} submitLabel="+ Add" />
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
                          <div className="prod-name" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ textDecoration: p.is_available === false ? "line-through" : "none", opacity: p.is_available === false ? 0.5 : 1 }}>{p.name}</span>
                            {p.is_available === false && <span style={{ fontSize: 10, background: "#FEE2E2", color: "#DC2626", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>SOLD OUT</span>}
                          </div>
                          <div className="prod-unit">
                            {p.unit === "g" ? `step: ${p.step}g` :
                              p.unit === "ml" ? `step: ${p.step}ml` :
                                p.unit === "kg" && p.step < 1 ? `step: ${p.step * 1000}g` :
                                  p.unit === "ltr" && p.step < 1 ? `step: ${p.step * 1000}ml` :
                                    `step: ${p.step} ${p.unit}`}
                          </div>
                        </div>
                        {p.is_available === false ? (
                           <div className="qty-area" style={{ background: "transparent" }}>
                             <button className="qty-b" style={{ background: "#F3F4F6", color: "#9CA3AF", cursor: "not-allowed", border: "1px solid #E5E7EB", width: "100%", borderRadius: "8px" }} disabled>Unavailable</button>
                           </div>
                        ) : (
                          <div className="qty-area">
                            <button className="qty-b" onClick={() => adjQty(p.id, -1)}>−</button>
                            <input className="qty-in" type="number" step={p.step} min="0"
                              value={qty || ""} placeholder="0"
                              onChange={(e) => setQtyDirect(p.id, e.target.value)} />
                            <span className="qty-unit-tag">{p.unit}</span>
                            <button className="qty-b" onClick={() => adjQty(p.id, 1)}>+</button>
                          </div>
                        )}
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

            </div>{/* end layout-main */}
          </div>{/* end layout-grid */}

          {toast && <div className="toast">✅ {toast}</div>}
        </div>
      </>
    );
  }

  /* ── BAKERY ORDERS ── */
  if (screen === "bakery-orders") {
    const myOrders = orders.filter(o => o.bakery === bakeryName);

    return (
      <>
        <style>{CSS}</style>
        <div className="app">
          <div className="hdr app-hdr">
            <div className="hdr-row">
              <div>
                <h1>📦 My Orders</h1>
                <div className="hdr-sub">🏪 {bakeryName}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="hdr-btn" onClick={() => navigate("bakery")}>← Back to Menu</button>
                {userRole === "admin" && <button className="hdr-btn" style={{ background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" }} onClick={() => navigate("admin")}>👑 Admin</button>}
              </div>
            </div>
          </div>

          <div className="layout-grid">
            <div className="layout-sidebar">
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text3)", marginBottom: 8, paddingLeft: 8 }}>FILTER</div>
              <div className="cats" style={{ gap: 6, overflow: "auto", flexWrap: "nowrap" }}>
                <button className={`chip ${statusFilter === "all" ? "on" : ""}`} onClick={() => setStatusFilter("all")}>All ({myOrders.length})</button>
                {STATUS_FLOW.map((s) => (
                  <button key={s} className={`chip ${statusFilter === s ? "on" : ""}`} onClick={() => setStatusFilter(s)}>
                    {STATUS_CFG[s].icon} {STATUS_CFG[s].label} ({myOrders.filter(o => o.status === s).length})
                  </button>
                ))}
              </div>
            </div>

            <div className="layout-main">
              {/* Status Summary Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 8, marginBottom: 16 }}>
                {STATUS_FLOW.map(s => {
                  const count = myOrders.filter(o => o.status === s).length;
                  return (
                    <div key={s} className="o-card" style={{ padding: "10px 12px", textAlign: "center", cursor: "pointer", borderLeft: `3px solid ${STATUS_CFG[s].color}`, background: statusFilter === s ? STATUS_CFG[s].bg : "var(--card)" }}
                      onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: STATUS_CFG[s].color }}>{count}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)" }}>{STATUS_CFG[s].label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Bakery Stats Chart */}
              <div className="orders" style={{ padding: "0 0 16px" }}>
                 <div className="o-card" style={{ padding: 16, marginBottom: 16 }}>
                    <h3 style={{ fontSize: 14, marginBottom: 12 }}>Your Order Volume (Last 7 Orders)</h3>
                    <div style={{ height: 160 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[...myOrders].reverse().slice(-7).map((o, i) => ({ name: `Order ${i+1}`, items: o.items.reduce((sum, item) => sum + item.qty, 0) }))}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                          <XAxis dataKey="name" hide />
                          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--text3)' }} width={30} />
                          <Tooltip cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow)', fontSize: 12 }} />
                          <Line type="monotone" dataKey="items" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
              </div>

              <div className="orders" style={{ padding: "0 0 130px" }}>
                {myOrders.filter(o => statusFilter === "all" || o.status === statusFilter).length === 0 ? (
                  <div className="empty"><div className="ic">📭</div><p>No {statusFilter !== "all" ? statusFilter : ""} orders yet</p></div>
                ) : (
                  myOrders.filter(o => statusFilter === "all" || o.status === statusFilter).map((order) => {
                    const sc = STATUS_CFG[order.status] || { bg: "#e5e7eb", color: "#4b5563", icon: "❓", label: order.status || "Unknown" };
                    return (
                      <div className="o-card" key={order.id}>
                        <div className="o-top" style={{ background: "var(--bg2)" }}>
                          <div>
                            <div className="o-id">#{order.id.slice(-6).toUpperCase()}</div>
                            <div className="o-time">{fmtDate(order.timestamp)}</div>
                          </div>
                          <span className="s-badge" style={{ background: sc.bg, color: sc.color }}>
                            {sc.icon} {sc.label}
                          </span>
                        </div>
                        <div className="o-items" style={{ paddingTop: 12 }}>
                          {(order.items || []).map((item, i) => (
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
                        <div className="o-acts" style={{ justifyContent: "flex-start" }}>
                           {order.status === "pending" && (
                             <button className="btn-s btn-d" onClick={() => cancelOrder(order.id)}>🗑 Cancel Order</button>
                           )}
                           {order.status === "delivered" ? (
                             <>
                               <span style={{ fontSize: 13, color: "#10B981", fontWeight: 600 }}>✅ Delivered</span>
                               <button className="btn-s btn-o" style={{ marginLeft: "auto" }} onClick={() => setPrintOrder(order)}>🖨️ Print Invoice</button>
                             </>
                           ) : order.status !== "pending" && (
                             <span style={{ fontSize: 13, color: "var(--text3)", fontStyle: "italic" }}>Waiting for Factory/Driver...</span>
                           )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── DRIVER ── */
  if (screen === "driver") {
    const dispatching = orders.filter(o => o.status === "dispatching");

    return (
      <>
        <style>{CSS}</style>
        <div className="app">
          <div className="hdr app-hdr">
            <div className="hdr-row">
              <div>
                <h1>🚚 BakeryFlow</h1>
                <div className="hdr-sub">Driver Dispatch</div>
              </div>
              {userRole === "admin" ? (
                <button className="hdr-btn" style={{ background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" }} onClick={() => navigate("admin")}>👑 Admin</button>
              ) : (
                <button className="hdr-btn" onClick={logout}>🚪 Logout</button>
              )}
            </div>
          </div>
          <div className="layout-grid">
            <div className="layout-main" style={{ marginTop: 2 }}>
              <div className="orders" style={{ padding: "0 10px 130px" }}>
                {dispatching.length === 0 ? (
                  <div className="empty"><div className="ic">📭</div><p>No orders currently out for delivery</p></div>
                ) : (
                  dispatching.map(order => (
                    <div className="o-card" key={order.id}>
                      <div className="o-top" style={{ background: "#EDE9FE" }}>
                        <div>
                          <div className="o-id">#{order.id.slice(-6).toUpperCase()}</div>
                          <div className="o-from">To: 🏪 {order.bakery}</div>
                          <div className="o-time">{fmtDate(order.timestamp)}</div>
                        </div>
                        <span className="s-badge" style={{ background: "#8B5CF6", color: "#fff" }}>
                          🚚 Dispatching
                        </span>
                      </div>
                      <div className="o-items" style={{ paddingTop: 12 }}>
                        {(order.items || []).map((item, i) => (
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
                         <button className="btn" style={{ background: "#10B981", borderRadius: "10px", width: "100%" }} onClick={() => updateStatus(order.id, "delivered")}>
                           ✅ Mark as Delivered
                         </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
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
                {userRole === "admin" && <button className="hdr-btn" style={{ background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" }} onClick={() => navigate("admin")}>👑 Admin</button>}
                {!showPM && <button className="hdr-btn" onClick={() => setShowSummary(true)}>📊 Today</button>}
                <button className="hdr-btn" onClick={() => setShowPM(!showPM)}>
                  {showPM ? "📋 Orders" : "⚙️ Products"}
                </button>
                <button className="hdr-btn" onClick={logout}>🚪 Logout</button>
              </div>
            </div>
          </div>

          {showSummary && (
            <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowSummary(false)}>
              <div className="modal">
                <div className="m-hdr">
                  <h2>📊 Today's Summary</h2>
                  <button className="m-close" onClick={() => setShowSummary(false)}>✕</button>
                </div>
                <div className="m-body">
                  <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>Total quantities ordered today across all bakeries.</div>
                  {getDailySummary().length === 0 ? (
                    <div className="empty"><div className="ic">🤷</div><p>No orders today</p></div>
                  ) : (
                    <>
                      <div style={{ height: 200, marginBottom: 24 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getDailySummary().slice(0, 5)} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 24 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow)', fontSize: 12, fontWeight: 600, color: 'var(--text)' }} itemStyle={{ color: 'var(--accent)' }}/>
                            <Bar dataKey="qty" fill="var(--accent)" radius={[0, 4, 4, 0]} barSize={24} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, margin: "20px 0 10px" }}>All Items</div>
                      {getDailySummary().map((item, idx) => (
                        <div key={idx} className="c-item" style={{ padding: "10px 0" }}>
                          {item.image ? <img src={item.image} style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover", marginRight: 10 }} alt="" loading="lazy" /> : <div className="pm-img" style={{ width: 28, height: 28, fontSize: 14, marginRight: 10 }}>🍞</div>}
                          <span className="c-item-info c-item-name">{item.name}</span>
                          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--accent)" }}>{fmtQty(item.qty, item.unit)}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="layout-grid">
            <div className="layout-sidebar">
              {!showPM ? (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text3)", marginBottom: 8, paddingLeft: 8 }}>STATUS FILTER</div>
                  <div className="cats" style={{ gap: 6, overflow: "auto", flexWrap: "nowrap" }}>
                    <button className={`chip ${statusFilter === "all" ? "on" : ""}`} onClick={() => setStatusFilter("all")}>All ({orders.length})</button>
                    {STATUS_FLOW.map((s) => (
                      <button key={s} className={`chip ${statusFilter === s ? "on" : ""}`} onClick={() => setStatusFilter(s)}>
                        {STATUS_CFG[s].icon} {STATUS_CFG[s].label} ({statusCounts[s]})
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text3)", marginBottom: 8, paddingLeft: 8 }}>CATEGORIES</div>
                  <div className="cats" style={{ gap: 6, overflow: "auto", flexWrap: "nowrap" }}>
                    {dbCategories.map((c) => (
                      <button key={c.id} className={`chip ${activeCat === c.id ? "on" : ""}`} onClick={() => setActiveCat(c.id)}>
                        {c.icon} {c.name} ({(products[c.id] || []).length})
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="layout-main">
              {!showPM ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 16 }}>
                    <div className="o-card" style={{ padding: 16 }}>
                      <h3 style={{ fontSize: 14, marginBottom: 8, color: "var(--text)" }}>Order Status Distribution</h3>
                      <div style={{ height: 160, display: "flex", alignItems: "center" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={STATUS_FLOW.map(s => ({ name: STATUS_CFG[s].label, value: orders.filter(o => o.status === s).length, color: STATUS_CFG[s].color }))}
                              cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none"
                            >
                              {STATUS_FLOW.map((s, index) => (
                                <Cell key={`cell-${index}`} fill={STATUS_CFG[s].color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow)', fontSize: 12 }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flex: 1, fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                          {STATUS_FLOW.map(s => {
                            const count = orders.filter(o => o.status === s).length;
                            return count > 0 ? (
                              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ width: 8, height: 8, borderRadius: 4, background: STATUS_CFG[s].color }}></div>
                                <span style={{ color: "var(--text3)", flex: 1 }}>{STATUS_CFG[s].label}</span>
                                <span style={{ fontWeight: 600 }}>{count}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {uniqueBakeries.length > 1 && (
                    <div className="bk-filter" style={{ marginBottom: 16 }}>
                      <button className={`bk-chip ${bakeryFilter === "all" ? "on" : ""}`} onClick={() => setBakeryFilter("all")}>All Bakeries</button>
                      {uniqueBakeries.map((b) => (
                        <button key={b} className={`bk-chip ${bakeryFilter === b ? "on" : ""}`} onClick={() => setBakeryFilter(b)}>🏪 {b}</button>
                      ))}
                    </div>
                  )}

                  <div className="orders" style={{ padding: "0 0 130px" }}>
                    {filteredOrders.length === 0 ? (
                      <div className="empty"><div className="ic">📭</div><p>No {statusFilter !== "all" ? statusFilter : ""} orders</p></div>
                    ) : (
                      filteredOrders.map((order) => {
                        const sc = STATUS_CFG[order.status] || { bg: "#e5e7eb", color: "#4b5563", icon: "❓", label: order.status || "Unknown" };
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
                              {(order.items || []).map((item, i) => (
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
                              {prev && prev !== "delivered" && (
                                <button className="btn-s" style={{ background: "var(--bg2)", color: "var(--text3)" }}
                                  onClick={() => updateStatus(order.id, prev)}>← {STATUS_CFG[prev].label}</button>
                              )}
                              {next && next !== "delivered" && (
                                <button className="btn-s" style={{ background: STATUS_CFG[next].color, color: "#fff" }}
                                  onClick={() => updateStatus(order.id, next)}>{STATUS_CFG[next].icon} Mark {STATUS_CFG[next].label}</button>
                              )}
                              {next === "delivered" && order.status === "dispatching" && (
                                <span style={{ fontSize: 12, color: "var(--text3)", fontStyle: "italic", alignSelf: "center", marginLeft: 6 }}>
                                  Waiting on Bakery to Confirm Receipt...
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              ) : (
                <div className="pm" style={{ padding: "0 0 130px" }}>
                  <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, background: "var(--card)", padding: 16, borderRadius: "var(--r)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 13, color: "var(--text3)" }}>
                      Manage <strong>{dbCategories.find(c => c.id === activeCat)?.name}</strong> products (Global scope)
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                       <button className="btn-o" style={{ width: "auto", padding: "8px 16px" }} onClick={() => setShowCatMan(true)}>
                         ⚙️ Categories
                       </button>
                       <button className="btn" style={{ width: "auto", padding: "8px 16px" }} onClick={() => setShowQuickAdd(true)}>
                         + Add Item
                       </button>
                    </div>
                  </div>

                  {(products[activeCat] || []).map((p) => (
                    <div className="pm-item" key={p.id}>
                      {p.image ? <img src={p.image} className="pm-img" alt="" loading="lazy" /> : <div className="pm-img">🍞</div>}
                      <span style={{ textDecoration: p.is_available === false ? "line-through" : "none", opacity: p.is_available === false ? 0.5 : 1 }}>{p.name}</span>
                      <span className="pm-meta">{p.unit} · step {p.unit === "g" || p.unit === "ml" ? p.step + p.unit : p.unit === "kg" && p.step < 1 ? (p.step * 1000) + "g" : p.step + " " + p.unit}</span>
                      <button className="btn-s" style={{ marginLeft: "auto", background: p.is_available === false ? "#FCA5A5" : "#D1FAE5", color: p.is_available === false ? "#991B1B" : "#065F46", border: "none" }} onClick={() => toggleAvailability(activeCat, p.id)}>
                        {p.is_available === false ? "❌ Sold Out" : "✅ Available"}
                      </button>
                      <button className="btn-s btn-o" onClick={() => setEditProduct({ ...p, catId: activeCat })}>✏️</button>
                      <button className="btn-s btn-d" onClick={() => removeProduct(activeCat, p.id)}>🗑</button>
                    </div>
                  ))}

                  {showQuickAdd && (
                    <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowQuickAdd(false)}>
                      <div className="modal">
                        <div className="m-hdr">
                          <h2>Add Custom Item to {dbCategories.find(c => c.id === activeCat)?.name}</h2>
                          <button className="m-close" onClick={() => setShowQuickAdd(false)}>✕</button>
                        </div>
                        <div className="m-body">
                          <ProductForm 
                             onSubmit={(prod) => { addProduct(activeCat, prod); setShowQuickAdd(false); showToast(`${prod.name} added!`); }} 
                             submitLabel="+ Add"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {editProduct && (
                    <div className="overlay" onClick={(e) => e.target === e.currentTarget && setEditProduct(null)}>
                      <div className="modal">
                        <div className="m-hdr">
                          <h2>Edit {editProduct.name}</h2>
                          <button className="m-close" onClick={() => setEditProduct(null)}>✕</button>
                        </div>
                        <div className="m-body">
                          <ProductForm 
                             initialData={editProduct}
                             onSubmit={(prod) => { updateProductDetails(editProduct.catId, editProduct.id, prod); setEditProduct(null); showToast(`${prod.name} updated!`); }} 
                             submitLabel="Save Changes"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {showCatMan && (
                    <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowCatMan(false)}>
                      <div className="modal">
                        <div className="m-hdr">
                          <h2>Manage Categories</h2>
                          <button className="m-close" onClick={() => setShowCatMan(false)}>✕</button>
                        </div>
                        <div className="m-body">
                          <CategoryManager
                             categories={dbCategories}
                             onUpdate={async (cats) => {
                               setDbCategories(cats);
                               setShowCatMan(false);
                               showToast("Categories updated!");
                               // Ensure products maps the new categories, creating empty arrays if needed
                               setProducts(prev => {
                                 const next = { ...prev };
                                 cats.forEach(c => { if (!next[c.id]) next[c.id] = []; });
                                 return next;
                               });
                             }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>{/* layout-main */}
          </div>{/* layout-grid */}
        </div>
      </>
    );
  }

  return null;
}

/* ═══════════════════════════════════════════
   PRODUCT REUSABLE FORM (Add / Edit)
   ═══════════════════════════════════════════ */
function ProductForm({ initialData, onSubmit, submitLabel }) {
  const [name, setName] = useState(initialData?.name || "");
  const [unit, setUnit] = useState(initialData?.unit || "kg");
  const [step, setStep] = useState(initialData?.step ? String(initialData.step) : "0.25");
  const [file, setFile] = useState(null);

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

  async function handleSubmit() {
    if (!name.trim()) return;
    let imgUrl = initialData?.image || "";

    if (file) {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uid()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload to Supabase Storage Bucket
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload Error:", uploadError);
        alert("Failed to upload image. " + uploadError.message);
      } else {
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        imgUrl = publicUrl;
      }
    }

    onSubmit({ id: initialData?.id || uid(), name: name.trim(), unit, step: parseFloat(step), image: imgUrl });
    if (!initialData) {
      setName("");
      setFile(null);
    }
  }

  return (
    <div className="pm-add">
      <input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()} style={{ flex: "2 1 100px" }} />
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}
        style={{ flex: "2 1 100px", padding: "6px" }} title={initialData?.image ? "Upload new image" : "Upload image"}/>
      <select value={unit} onChange={(e) => onUnitChange(e.target.value)} style={{ flex: "1 1 60px" }}>
        {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
      </select>
      <select value={step} onChange={(e) => setStep(e.target.value)} style={{ flex: "1 1 70px" }}>
        {(stepOpts[unit] || ["1"]).map((s) => <option key={s} value={s}>step {s}</option>)}
      </select>
      <button className="btn" style={{ flex: "0 0 auto", width: "auto", padding: "9px 18px" }} onClick={handleSubmit}>{submitLabel || "Save"}</button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CATEGORY MANAGER (Admin feature)
   ═══════════════════════════════════════════ */
function CategoryManager({ categories, onUpdate }) {
  const [cats, setCats] = useState(categories);
  const [newIcon, setNewIcon] = useState("📦");
  const [newName, setNewName] = useState("");

  async function handleAdd() {
    if (!newName.trim()) return;
    const cid = newName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cats.find(c => c.id === cid)) return alert("Category already exists!");
    
    const newCat = { id: cid, name: newName.trim(), icon: newIcon };
    const updated = [...cats, newCat];
    
    // Optimistic
    setCats(updated);
    setNewName("");
    setNewIcon("📦");

    // Supabase
    await supabase.from('categories').insert([{ id: newCat.id, name: newCat.name, icon: newCat.icon }]);
  }

  async function handleDelete(id) {
    if (id === 'other') return alert("Cannot delete 'Other'");
    const updated = cats.filter(c => c.id !== id);
    setCats(updated);
    await supabase.from('categories').delete().eq('id', id);
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {cats.map(c => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--bg)", padding: 12, borderRadius: 8, border: "1px solid var(--border)" }}>
            <span style={{ fontSize: 24 }}>{c.icon}</span>
            <span style={{ flex: 1, fontWeight: 600 }}>{c.name}</span>
            {c.id !== 'other' && (
               <button className="btn-s btn-d" onClick={() => handleDelete(c.id)}>🗑</button>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", background: "var(--card)", padding: 16, borderRadius: 8, border: "1px solid var(--border)" }}>
        <input value={newIcon} onChange={e => setNewIcon(e.target.value)} style={{ width: 60, fontSize: 18, textAlign: "center" }} placeholder="Icon" />
        <input value={newName} onChange={e => setNewName(e.target.value)} style={{ flex: 1 }} placeholder="New Category Name..." onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
        <button className="btn" style={{ width: "auto", padding: "10px 16px" }} onClick={handleAdd}>Add</button>
      </div>
      <div style={{ marginTop: 20, textAlign: "right" }}>
        <button className="btn" style={{ width: "auto" }} onClick={() => onUpdate(cats)}>Save & Close</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BAKERY MANAGER (Admin feature)
   ═══════════════════════════════════════════ */
function BakeryManager({ bakeries, onUpdate, showToast }) {
  const [newName, setNewName] = useState("");
  const [editingIdx, setEditingIdx] = useState(-1);
  const [editName, setEditName] = useState("");

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    if (bakeries.includes(name)) { showToast("Bakery already exists!"); return; }

    const updated = [...bakeries, name];
    onUpdate(updated);
    setNewName("");

    const { error } = await supabase.from('bakeries').insert([{ name }]);
    if (error) {
      console.error("Add bakery error:", error);
      showToast("Failed to add bakery");
      onUpdate(bakeries); // rollback
    } else {
      showToast(`${name} added!`);
    }
  }

  async function handleDelete(name) {
    if (!window.confirm(`Delete "${name}"? This won't delete their orders.`)) return;
    const updated = bakeries.filter(b => b !== name);
    onUpdate(updated);

    const { error } = await supabase.from('bakeries').delete().eq('name', name);
    if (error) {
      console.error("Delete bakery error:", error);
      onUpdate(bakeries); // rollback
    } else {
      showToast(`${name} removed`);
    }
  }

  async function handleRename(oldName) {
    const name = editName.trim();
    if (!name || name === oldName) { setEditingIdx(-1); return; }
    if (bakeries.includes(name)) { showToast("Name already exists!"); return; }

    const updated = bakeries.map(b => b === oldName ? name : b);
    onUpdate(updated);
    setEditingIdx(-1);

    const { error } = await supabase.from('bakeries').update({ name }).eq('name', oldName);
    if (error) {
      console.error("Rename bakery error:", error);
      onUpdate(bakeries); // rollback
    } else {
      showToast(`Renamed to ${name}`);
    }
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div className="o-card" style={{ padding: 20, marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, marginBottom: 16 }}>🏪 Manage Bakery Names</h3>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>
          Add, rename, or remove bakeries. These names appear in the signup dropdown.
        </p>

        {/* Add New */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <input className="login-input" style={{ flex: 1, marginBottom: 0 }} placeholder="New bakery name..."
            value={newName} onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()} />
          <button className="btn" style={{ width: "auto", padding: "10px 20px" }} onClick={handleAdd} disabled={!newName.trim()}>
            + Add
          </button>
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {bakeries.length === 0 ? (
            <div className="empty" style={{ padding: 20 }}><div className="ic">🏪</div><p>No bakeries yet. Add one above!</p></div>
          ) : (
            bakeries.map((b, i) => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </div>
                {editingIdx === i ? (
                  <>
                    <input className="login-input" style={{ flex: 1, marginBottom: 0, padding: "6px 10px", fontSize: 13 }}
                      value={editName} onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleRename(b)}
                      autoFocus />
                    <button className="btn-s" style={{ background: "#10B981", color: "#fff", padding: "5px 12px" }} onClick={() => handleRename(b)}>✓</button>
                    <button className="btn-s" style={{ background: "var(--bg2)", color: "var(--text3)", padding: "5px 10px" }} onClick={() => setEditingIdx(-1)}>✕</button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{b}</span>
                    <button className="btn-s" style={{ background: "var(--bg2)", color: "var(--text2)", padding: "4px 10px" }} onClick={() => { setEditingIdx(i); setEditName(b); }}>✏️</button>
                    <button className="btn-s btn-d" style={{ padding: "4px 10px" }} onClick={() => handleDelete(b)}>🗑</button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   AUTH SCREEN COMPONENT
   ═══════════════════════════════════════════ */
function AuthScreen({ showToast, bakeryNames }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpRole, setSignUpRole] = useState("bakery");
  const [signUpBakery, setSignUpBakery] = useState((bakeryNames && bakeryNames[0]) || "");
  const [authLoading, setAuthLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  async function handleAuth() {
    setAuthLoading(true);
    if (isSignUp) {
      const name = signUpRole === "bakery" ? signUpBakery : signUpRole;
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { role: signUpRole, name } }
      });
      if (error) showToast(error.message);
      else showToast("Account created! You are now logged in.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) showToast(error.message);
      else showToast("Welcome back!");
    }
    setAuthLoading(false);
  }

  function loginDemo(acc) {
    setEmail(acc.email);
    setPassword(acc.password);
    setIsSignUp(false);
  }

  return (
    <div className="login">
      <div className="login-logo">🍞</div>
      <h2>BakeryFlow</h2>
      <p>Secure Dispatch & Tracking</p>

      <div className="login-card">
        <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "var(--bg)", padding: 4, borderRadius: 12 }}>
          <button className={`chip ${!isSignUp ? "on" : ""}`} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", fontSize: 13 }} onClick={() => setIsSignUp(false)}>Login</button>
          <button className={`chip ${isSignUp ? "on" : ""}`} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", fontSize: 13 }} onClick={() => setIsSignUp(true)}>Sign Up</button>
        </div>

        <h3 style={{ textAlign: "center", marginBottom: 16 }}>{isSignUp ? "Create new account" : "Sign in to your account"}</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input className="login-input" type="email" placeholder="Email Address" 
            value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="login-input" type="password" placeholder="Password" 
            value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAuth()} />

          {isSignUp && (
            <>
              <select className="login-input" value={signUpRole} onChange={(e) => setSignUpRole(e.target.value)} style={{ padding: "12px 16px" }}>
                <option value="bakery">Bakery (Customer)</option>
                <option value="factory">Factory Staff</option>
                <option value="driver">Delivery Driver</option>
                <option value="admin">Owner / Admin</option>
              </select>
              {signUpRole === "bakery" && (
                <select className="login-input" value={signUpBakery} onChange={(e) => setSignUpBakery(e.target.value)} style={{ padding: "12px 16px" }}>
                  {(bakeryNames || BAKERY_NAMES).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              )}
            </>
          )}

          <button className="btn" onClick={handleAuth} disabled={authLoading || !email || !password}>
            {authLoading ? "Please wait..." : (isSignUp ? "Create Account" : "Login  →")}
          </button>
        </div>
      </div>

      {/* Demo Accounts */}
      <div style={{ width: "100%", maxWidth: 360 }}>
        <button onClick={() => setShowDemo(!showDemo)} style={{ background: "none", border: "none", color: "var(--text3)", fontSize: 12, cursor: "pointer", padding: "8px 0", width: "100%", textAlign: "center", fontWeight: 600 }}>
          {showDemo ? "▲ Hide Demo Accounts" : "▼ Demo Accounts (for testing)"}
        </button>
        {showDemo && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.email} className="btn-o" style={{ width: "100%", padding: "10px 14px", fontSize: 12, textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onClick={() => loginDemo(acc)}>
                <span>{acc.label}</span>
                <span style={{ fontSize: 10, color: "var(--text3)" }}>{acc.email}</span>
              </button>
            ))}
            <div style={{ fontSize: 10, color: "var(--text3)", textAlign: "center", marginTop: 4 }}>
              Click any account above, then press "Login →"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
