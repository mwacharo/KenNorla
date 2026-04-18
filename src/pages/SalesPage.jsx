import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

import { createOrder } from "../api/orders";
import { FloatingWhatsApp } from 'react-floating-whatsapp';


/* ─── GOOGLE FONTS ────────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');
  `}</style>
);

/* ══════════════════════════════════════════════════════════════
   GTM — GOOGLE TAG MANAGER
   ══════════════════════════════════════════════════════════════ */

const GTM_ID = import.meta.env.VITE_GTM_ID || "GTM-XXXXXXX";

const initGTM = () => {
  if (window.__gtm_injected) return;
  window.__gtm_injected = true;

  window.dataLayer = window.dataLayer || [];

  const script = document.createElement("script");
  script.id    = "gtm-script";
  script.async = true;
  script.innerHTML = `
    (function(w,d,s,l,i){
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
  `;
  document.head.appendChild(script);

  const noscript = document.createElement("noscript");
  noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  document.body.insertBefore(noscript, document.body.firstChild);
};

const pushEvent = (eventName, params = {}) => {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({ event: eventName, ...params });
  } catch (e) {
    console.warn("dataLayer push failed:", e);
  }
};

/* ─── DESIGN TOKENS ──────────────────────────────────────────── */
const STYLES = `
  :root {
    --gold:         #d97706;
    --gold-light:   #f59e0b;
    --gold-dark:    #b45309;
    --ink:          #0C0C0E;
    --ink2:         #161618;
    --ink3:         #1F1F22;
    --ink4:         #2A2A2E;
    --smoke:        #F5F0E8;
    --text:         #E8E2D6;
    --muted:        #9A9488;
    --red:          #C0392B;
    --green:        #27AE60;
    --ff-display:   'Playfair Display', serif;
    --ff-body:      'Barlow', sans-serif;
    --ff-condensed: 'Barlow Condensed', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--ink); color: var(--text); font-family: var(--ff-body); }
  .sales-page { overflow-x: hidden; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer  { 0%,100%{ background-position:200% center; } }
  @keyframes pulse    { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.04); } }
  @keyframes ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes spin     { to{transform:rotate(360deg)} }

  .anim-fade-up   { animation: fadeUp .7s ease both; }
  .anim-fade-in   { animation: fadeIn .6s ease both; }
  .anim-pulse     { animation: pulse 2.4s ease-in-out infinite; }

  .gold-text {
    background: linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-dark));
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .gold-divider {
    width: 60px; height: 3px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    margin: 1rem auto;
  }

  .section { padding: 80px 24px; }
  .section-inner { max-width: 900px; margin: 0 auto; }
  .section-title {
    font-family: var(--ff-display);
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 900; line-height: 1.15;
    text-align: center; color: var(--smoke);
    margin-bottom: 0.4rem;
  }

  .cta-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: linear-gradient(to right, #d97706, #ea580c);
    color: #ffffff;
    font-family: var(--ff-condensed);
    font-size: 1.1rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
    border: none; border-radius: 6px; cursor: pointer;
    padding: 16px 36px;
    transition: transform .15s, box-shadow .15s;
    box-shadow: 0 4px 24px rgba(217,119,6,.35);
    text-decoration: none;
  }
  .cta-btn:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(217,119,6,.55); }
  .cta-btn:active { transform:translateY(0); }
  .cta-btn.large { padding:20px 52px; font-size:1.25rem; }
  .cta-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }

  /* TICKER */
  .ticker-wrap { background: var(--gold-dark); overflow: hidden; padding: 10px 0; }
  .ticker-track {
    display: flex; width: max-content;
    animation: ticker 22s linear infinite;
  }
  .ticker-item {
    font-family: var(--ff-condensed); font-size: .9rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase; color: #ffffff;
    padding: 0 28px; white-space: nowrap;
  }
  .ticker-dot { color: var(--gold-light); }

  /* HERO */
  .hero {
    min-height: 100svh;
    background: radial-gradient(ellipse at 70% 50%, #1a1208 0%, var(--ink) 70%);
    display: flex; flex-direction: column; justify-content: center;
    position: relative; overflow: hidden;
    padding: 80px 24px;
  }
  .hero::before {
    content:''; position:absolute; inset:0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity:.6;
  }
  .hero-inner { max-width:760px; margin:0 auto; position:relative; z-index:1; text-align:center; }
  .hero-badge {
    display:inline-flex; align-items:center; gap:6px;
    background: rgba(217,119,6,.12); border:1px solid rgba(217,119,6,.3);
    border-radius:100px; padding:6px 16px;
    font-family:var(--ff-condensed); font-size:.8rem; font-weight:700;
    letter-spacing:.12em; text-transform:uppercase; color:var(--gold-light);
    margin-bottom:1.5rem;
  }
  .hero-title {
    font-family:var(--ff-display);
    font-size: clamp(2.2rem, 7vw, 4.8rem);
    font-weight:900; line-height:1.05; color:var(--smoke);
    margin-bottom:1rem;
  }
  .hero-subtitle {
    font-size:clamp(1rem,2.5vw,1.2rem);
    color:var(--muted); line-height:1.75; margin-bottom:2rem;
    font-weight:300; max-width:560px; margin-left:auto; margin-right:auto;
  }
  .hero-meta {
    display:flex; flex-wrap:wrap; gap:12px; justify-content:center;
    margin-top:1.5rem;
  }
  .hero-meta-item {
    font-family:var(--ff-condensed); font-size:.82rem; font-weight:600;
    letter-spacing:.06em; color:var(--muted); text-transform:uppercase;
  }

  .hero-image-wrap {
    display: flex; justify-content: center;
    margin-bottom: 2rem; padding: 0 1rem;
  }
  .hero-image-box {
    width: 100%; max-width: 420px; aspect-ratio: 1 / 1;
    background: #ffffff; border-radius: 20px; padding: 1.2rem;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  }
  .hero-image-box img {
    max-width: 100%; max-height: 100%; width: auto; height: auto;
    object-fit: contain; display: block;
  }
  @media (max-width: 480px) {
    .hero-image-box { max-width: 100%; padding: 0.8rem; }
  }

  /* PROOF BAR */
  .proof-bar {
    background:var(--ink2); border-top:1px solid rgba(217,119,6,.15);
    border-bottom:1px solid rgba(217,119,6,.15); padding:20px 24px;
  }
  .proof-bar-inner {
    max-width:900px; margin:0 auto;
    display:flex; flex-wrap:wrap; gap:24px; justify-content:center; align-items:center;
  }
  .proof-stat { text-align:center; }
  .proof-stat-num {
    font-family:var(--ff-condensed); font-size:1.8rem; font-weight:800; color:var(--gold); line-height:1;
  }
  .proof-stat-label {
    font-size:.72rem; font-weight:500; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); margin-top:2px;
  }
  .proof-divider { width:1px; height:40px; background:rgba(217,119,6,.2); }

  /* ABOUT */
  .about { background:var(--ink2); }
  .about-body {
    font-size:clamp(1rem,2.2vw,1.1rem); line-height:1.9; color:var(--text);
    text-align:center; font-weight:300; max-width:680px; margin:1.5rem auto 0;
  }

  /* PROBLEM */
  .problem { background:var(--ink); }
  .problem-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
    gap:12px; margin-top:2rem;
  }
  .problem-item {
    display:flex; align-items:flex-start; gap:10px;
    background:rgba(192,57,43,.07); border:1px solid rgba(192,57,43,.18);
    border-radius:6px; padding:14px;
    font-size:.88rem; color:var(--text); line-height:1.55;
  }
  .problem-closing {
    text-align:center; margin-top:2.5rem;
    font-family:var(--ff-display); font-size:1.25rem; font-style:italic; color:var(--gold-light);
  }

  /* BENEFITS */
  .benefits { background:var(--ink2); }
  .benefits-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr));
    gap:16px; margin-top:2rem;
  }
  .benefit-card {
    background:var(--ink3); border:1px solid rgba(217,119,6,.12);
    border-radius:8px; padding:20px;
    transition:border-color .2s, transform .2s, box-shadow .2s;
  }
  .benefit-card:hover {
    border-color:rgba(217,119,6,.4); transform:translateY(-4px);
    box-shadow:0 12px 32px rgba(0,0,0,.4);
  }
  .benefit-icon { font-size:1.6rem; margin-bottom:10px; }
  .benefit-title {
    font-family:var(--ff-condensed); font-size:.95rem; font-weight:700;
    letter-spacing:.06em; text-transform:uppercase; color:var(--gold-light); margin-bottom:6px;
  }
  .benefit-detail { font-size:.85rem; color:var(--muted); line-height:1.6; }

  /* WHY CHOOSE */
  .why-choose { background:var(--ink); }
  .why-list { display:flex; flex-direction:column; gap:14px; margin-top:2rem; }
  .why-item {
    display:flex; gap:16px; align-items:flex-start;
    background:var(--ink2); border-left:3px solid var(--gold);
    border-radius:0 8px 8px 0; padding:18px 20px;
  }
  .why-num {
    font-family:var(--ff-condensed); font-size:1.8rem; font-weight:800; color:var(--gold-dark);
    line-height:1; flex-shrink:0; width:34px;
  }
  .why-title {
    font-family:var(--ff-condensed); font-size:.95rem; font-weight:700;
    text-transform:uppercase; letter-spacing:.06em; color:var(--smoke); margin-bottom:4px;
  }
  .why-detail { font-size:.85rem; color:var(--muted); line-height:1.65; }

  /* HOW TO USE */
  .how-to-use { background:var(--ink2); }
  .steps { display:flex; flex-direction:column; gap:0; margin-top:2rem; position:relative; }
  .steps::before {
    content:''; position:absolute; left:20px; top:0; bottom:0;
    width:2px; background:linear-gradient(to bottom, var(--gold), transparent);
  }
  .step { display:flex; gap:20px; align-items:flex-start; padding:14px 0; position:relative; }
  .step-num {
    width:42px; height:42px; border-radius:50%;
    background:linear-gradient(135deg, var(--gold-dark), var(--gold));
    display:flex; align-items:center; justify-content:center;
    font-family:var(--ff-condensed); font-size:1rem; font-weight:800; color:#ffffff;
    flex-shrink:0; position:relative; z-index:1;
    box-shadow:0 0 0 4px var(--ink2);
  }
  .step-text { font-size:.95rem; line-height:1.75; color:var(--text); padding-top:10px; }

  /* REVIEWS */
  .reviews { background:var(--ink); }
  .reviews-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(255px,1fr));
    gap:16px; margin-top:2rem;
  }
  .review-card {
    background:var(--ink2); border:1px solid rgba(217,119,6,.1);
    border-radius:8px; padding:20px;
  }
  .review-stars { display:flex; gap:3px; margin-bottom:10px; }
  .star { color:var(--gold); font-size:1rem; }
  .review-text { font-size:.88rem; line-height:1.75; color:var(--text); font-style:italic; margin-bottom:14px; }
  .review-author { display:flex; align-items:center; gap:10px; }
  .review-avatar {
    width:36px; height:36px; border-radius:50%;
    background:linear-gradient(135deg, var(--gold-dark), var(--gold));
    display:flex; align-items:center; justify-content:center;
    font-family:var(--ff-condensed); font-weight:800; font-size:.9rem; color:#ffffff;
  }
  .review-name { font-weight:600; font-size:.85rem; color:var(--smoke); }
  .review-badge { font-size:.7rem; color:var(--green); letter-spacing:.04em; font-family:var(--ff-condensed); font-weight:600; }

  /* ═══════════════════════════════════════════════
     PACKAGES + ORDER FORM
     ═══════════════════════════════════════════════ */
  .packages-section { background:var(--ink2); }

  /* ── ORDER FORM ── */
  .order-form-wrap {
    background:var(--ink3); border:1px solid rgba(217,119,6,.2);
    border-radius:12px; padding:28px 24px; margin-top:2rem;
  }
  .order-form-title {
    font-family:var(--ff-condensed); font-size:1.15rem; font-weight:700;
    letter-spacing:.06em; text-transform:uppercase; color:var(--smoke);
    margin-bottom:4px;
  }
  .order-form-subtitle {
    font-size:.82rem; color:var(--muted); margin-bottom:1.4rem; line-height:1.5;
  }
  .order-selected-pkg {
    display:flex; align-items:center; justify-content:space-between;
    background:rgba(217,119,6,.08); border:1px solid rgba(217,119,6,.25);
    border-radius:8px; padding:12px 16px; margin-bottom:1.2rem;
  }
  .order-selected-pkg-name {
    font-family:var(--ff-condensed); font-weight:700; font-size:.9rem; color:var(--smoke);
  }
  .order-selected-pkg-price {
    font-family:var(--ff-condensed); font-weight:800; font-size:1.1rem; color:var(--gold);
  }
  .form-row { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
  .form-label {
    font-family:var(--ff-condensed); font-size:.8rem; font-weight:700;
    letter-spacing:.08em; text-transform:uppercase; color:var(--muted);
  }
  .form-input {
    background:var(--ink4); border:1px solid rgba(217,119,6,.15);
    border-radius:6px; padding:13px 14px;
    font-family:var(--ff-body); font-size:.95rem; color:var(--smoke);
    outline:none; transition:border-color .2s, box-shadow .2s;
    width:100%;
  }
  .form-input::placeholder { color:var(--muted); }
  .form-input:focus {
    border-color:rgba(217,119,6,.5);
    box-shadow:0 0 0 3px rgba(217,119,6,.1);
  }
  .form-input.error { border-color:rgba(192,57,43,.6); box-shadow:0 0 0 3px rgba(192,57,43,.1); }
  .form-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); cursor:pointer; }
  .form-input[type="date"] { color-scheme: dark; }

  /* Package select dropdown */
  select.form-input {
    color-scheme: dark;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23d97706' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
    cursor: pointer;
  }
  select.form-input option {
    background: #2A2A2E;
    color: #F5F0E8;
    padding: 10px;
  }
  select.form-input option:disabled {
    color: #9A9488;
  }

  .form-error { font-size:.76rem; color:#e57373; margin-top:2px; }
  .form-submit-row { margin-top:18px; text-align:center; }
  .form-submit-btn {
    width:100%; max-width:420px;
    display:inline-flex; align-items:center; justify-content:center; gap:10px;
    background:linear-gradient(to right, #d97706, #ea580c);
    color:#ffffff; font-family:var(--ff-condensed);
    font-size:1.15rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase;
    border:none; border-radius:8px; cursor:pointer;
    padding:18px 36px;
    transition:transform .15s, box-shadow .15s, opacity .15s;
    box-shadow:0 4px 24px rgba(217,119,6,.35);
  }
  .form-submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 32px rgba(217,119,6,.55); }
  .form-submit-btn:disabled { opacity:.7; cursor:not-allowed; }
  .btn-spinner {
    width:18px; height:18px; border-radius:50%;
    border:2px solid rgba(255,255,255,.3); border-top-color:#fff;
    animation: spin .7s linear infinite; display:inline-block;
  }
  .form-trust {
    display:flex; flex-wrap:wrap; gap:10px; justify-content:center;
    margin-top:12px;
  }
  .form-trust-item {
    font-family:var(--ff-condensed); font-size:.74rem; font-weight:600;
    letter-spacing:.06em; text-transform:uppercase; color:var(--muted);
  }
  .urgency {
    margin-top:1rem; font-size:.78rem; letter-spacing:.08em; text-transform:uppercase;
    color:var(--muted); font-family:var(--ff-condensed); font-weight:600;
    text-align:center;
  }
  .urgency span { color:var(--gold-light); }

  /* SUCCESS STATE */
  .order-success {
    text-align:center; padding:40px 20px;
  }
  .order-success-icon { font-size:3.5rem; margin-bottom:1rem; }
  .order-success-title {
    font-family:var(--ff-display); font-size:1.8rem; font-weight:900;
    color:var(--smoke); margin-bottom:.6rem;
  }
  .order-success-sub { font-size:.95rem; color:var(--muted); line-height:1.75; max-width:460px; margin:0 auto; }
  .order-success-detail {
    margin-top:1.5rem;
    background:rgba(39,174,96,.08); border:1px solid rgba(39,174,96,.2);
    border-radius:8px; padding:16px 20px;
    font-size:.88rem; color:var(--green); line-height:1.7;
    max-width:460px; margin:1.2rem auto 0;
  }

  /* DELIVERY */
  .delivery { background:var(--ink); }
  .delivery-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr));
    gap:16px; margin-top:2rem;
  }
  .delivery-card {
    background:var(--ink2); border:1px solid rgba(217,119,6,.1);
    border-radius:8px; padding:22px; text-align:center;
  }
  .delivery-icon { font-size:2rem; margin-bottom:10px; }
  .delivery-title {
    font-family:var(--ff-condensed); font-size:.9rem; font-weight:700;
    text-transform:uppercase; letter-spacing:.06em; color:var(--gold-light); margin-bottom:6px;
  }
  .delivery-detail { font-size:.82rem; color:var(--muted); line-height:1.65; }

  /* FAQ */
  .faq-section { background:var(--ink2); }
  .faq-list { display:flex; flex-direction:column; gap:0; margin-top:2rem; }
  .faq-item { border-bottom:1px solid rgba(217,119,6,.1); }
  .faq-q {
    width:100%; background:none; border:none; cursor:pointer;
    display:flex; justify-content:space-between; align-items:center;
    padding:18px 4px; gap:16px;
    font-family:var(--ff-condensed); font-size:1rem; font-weight:600;
    letter-spacing:.04em; color:var(--smoke); text-align:left;
    transition:color .2s;
  }
  .faq-q:hover { color:var(--gold-light); }
  .faq-icon { color:var(--gold); flex-shrink:0; font-size:1.2rem; transition:transform .25s; display:block; }
  .faq-icon.open { transform:rotate(45deg); }
  .faq-a {
    overflow:hidden; max-height:0; transition:max-height .35s ease, padding .25s;
    font-size:.9rem; color:var(--muted); line-height:1.8; padding:0 4px;
  }
  .faq-a.open { max-height:200px; padding:0 4px 18px; }

  /* STICKY BAR */
  .sticky-bar {
    position:fixed; bottom:0; left:0; right:0; z-index:100;
    background:rgba(12,12,14,.94); backdrop-filter:blur(12px);
    border-top:1px solid rgba(217,119,6,.25);
    padding:12px 20px;
    display:flex; align-items:center; justify-content:space-between; gap:12px;
    transform:translateY(100%); transition:transform .4s ease;
  }
  .sticky-bar.visible { transform:translateY(0); }
  .sticky-bar-text { font-family:var(--ff-condensed); font-size:.9rem; font-weight:600; color:var(--text); line-height:1.4; }
  .sticky-bar-text strong { color:var(--gold); }
  .sticky-bar-btn {
    background:linear-gradient(to right, #d97706, #ea580c);
    color:#ffffff;
    font-family:var(--ff-condensed); font-size:.9rem; font-weight:800;
    letter-spacing:.08em; text-transform:uppercase;
    border:none; border-radius:6px; padding:10px 22px; cursor:pointer; white-space:nowrap; flex-shrink:0;
  }

  /* FOOTER */
  .footer {
    background:var(--ink); border-top:1px solid rgba(217,119,6,.1);
    padding:36px 24px; text-align:center;
  }
  .footer-logo { font-family:var(--ff-display); font-size:1.3rem; font-weight:900; color:var(--gold); margin-bottom:10px; }
  .footer-text { font-size:.72rem; color:var(--muted); line-height:1.8; }

  /* LOADING */
  .loading-screen { min-height:100svh; display:flex; align-items:center; justify-content:center; background:var(--ink); }
  .loader {
    width:40px; height:40px; border-radius:50%;
    border:3px solid rgba(217,119,6,.2); border-top-color:var(--gold);
    animation: spin .8s linear infinite;
  }

  @media (max-width:600px) {
    .proof-divider { display:none; }
    .steps::before { display:none; }
    .sticky-bar-text { display:none; }
    .hero { padding:60px 20px; }
    .order-form-wrap { padding:20px 16px; }
  }
`;

/* ─── HELPERS ─────────────────────────────────────────────────── */
const BENEFIT_ICONS = {
  "Stronger Erections":"⚡","Longer Stamina":"🔥","Boosted Libido":"💪",
  "Improved Sperm Quality":"🌱","More Energy":"✨","100% Natural":"🌿",
  "Prostate Support":"🛡️","Improved Circulation":"❤️",
};
const DELIVERY_ICONS = {
  "Free Delivery":"🚚","Pay on Delivery":"💳",
  "Discreet Packaging":"📦","14-Day Money-Back Guarantee":"✅",
};

const Stars = ({ rating = 5 }) => (
  <div className="review-stars">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="star" style={{ opacity: i < rating ? 1 : 0.25 }}>★</span>
    ))}
  </div>
);

/* ─── GOOGLE SHEETS WEBHOOK ──────────────────────────────────── */
const SHEETS_WEBHOOK_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL || "";

/* ─── UTM / SOURCE HELPERS ────────────────────────────────────── */
const getTrafficSource = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source:   params.get("utm_source")   || "",
      utm_medium:   params.get("utm_medium")   || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content:  params.get("utm_content")  || "",
      utm_term:     params.get("utm_term")     || "",
      ttclid:       params.get("ttclid")       || "",
      fbclid:       params.get("fbclid")       || "",
      gclid:        params.get("gclid")        || "",
      referrer:     document.referrer          || "",
      landing_url:  window.location.href       || "",
    };
  } catch { return {}; }
};

/* ════════════════════════════════════════════════════════════════
   ORDER FORM
   ════════════════════════════════════════════════════════════════ */
const OrderForm = ({ selectedPkg, packages = [], onSelect, product, onSuccess }) => {
  const [name,         setName]         = useState("");
  const [phone,        setPhone]        = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [whatsapp,     setWhatsapp]     = useState("");
  const [city,         setCity]         = useState("");
  const [town,         setTown]         = useState("");
  const [address,      setAddress]      = useState("");
  const [errors,       setErrors]       = useState({});
  const [loading,      setLoading]      = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const validate = () => {
    const e = {};

    if (!selectedPkg)
      e.package = "Please select a package to continue";

    if (!name.trim())
      e.name = "Please enter your full name";

    if (!/^[0-9+\s]{9,15}$/.test(phone.trim()))
      e.phone = "Enter a valid phone number (e.g. 0712 345 678)";

    if (whatsapp && !/^[0-9+\s]{9,15}$/.test(whatsapp.trim()))
      e.whatsapp = "Enter a valid WhatsApp number (e.g. 0712 345 678)";

    if (!deliveryDate)
      e.deliveryDate = "Please select an expected delivery date";

    if (!city.trim())
      e.city = "Please enter your city";

    if (!town.trim())
      e.town = "Please enter your town";

    if (!address.trim())
      e.address = "Please enter your address";

    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);

    const source  = getTrafficSource();
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const ecomItem = {
      item_id:       String(selectedPkg?.id || ""),
      item_name:     selectedPkg?.label || "",
      item_category: product?.name || "",
      price:         selectedPkg?._rawPrice || 0,
      quantity:      selectedPkg?._qty || 1,
    };

    pushEvent("begin_checkout", {
      ecommerce: {
        currency: "KES",
        value:    selectedPkg?._rawPrice || 0,
        items:    [ecomItem],
      },
    });

    // ── 1. Google Sheets — fire-and-forget ────────────────────────
    if (SHEETS_WEBHOOK_URL) {
      const sheetsPayload = {
        order_id:          orderId,
        timestamp:         new Date().toISOString(),
        product_name:      product?.name || "",
        bundle_label:      selectedPkg?.label || "",
        bundle_price:      selectedPkg?._rawPrice || 0,
        bundle_qty:        selectedPkg?._qty || 1,
        customer_name:     name.trim(),
        customer_phone:    phone.trim(),
        customer_whatsapp: whatsapp.trim(),
        customer_city:     city.trim(),
        customer_town:     town.trim(),
        customer_address:  address.trim(),
        delivery_date:     deliveryDate,
        utm_source:        source.utm_source,
        utm_medium:        source.utm_medium,
        utm_campaign:      source.utm_campaign,
        landing_url:       source.landing_url,
        status:            "New",
      };
      const qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries(sheetsPayload).map(([k, v]) => [k, String(v)])
        )
      ).toString();
      fetch(`${SHEETS_WEBHOOK_URL}?${qs}`, { method: "GET", mode: "no-cors" })
        .catch(err => console.warn("Sheets write failed (non-blocking):", err));
    }

    // ── 2. Backend API ─────────────────────────────────────────────
    if (API_URL) {
      try {
        const orderData = {
          order_no:         orderId,
          warehouse_id:     1,
          status_id:        1,
          total_price:      selectedPkg?._rawPrice || 0,
          sub_total:        selectedPkg?._rawPrice || 0,
          amount_paid:      0,
          shipping_charges: 0,
          paid:             false,
          platform:         "web",
          source:           "sales_page",
          customer_notes: `Bundle: ${selectedPkg?.label || ""} | Delivery: ${deliveryDate}`,
          customer: {
            name:     name.trim(),
            phone:    phone.trim(),
            email:    null,
            address:  address.trim(),
            city:     city.trim(),
            region:   town.trim(),
            zone_id:  null,
            zipcode:  null,
          },
          order_items: [
            {
              product_id:  product?.id    || null,
              sku:         product?.sku   || "",
              name:        selectedPkg?.label || product?.name || "",
              quantity:    selectedPkg?._qty  || 1,
              unit_price:  selectedPkg?._rawPrice || 0,
              total_price: selectedPkg?._rawPrice || 0,
            },
          ],
          addresses: [
            {
              type:      "shipping",
              full_name: name.trim(),
              phone:     phone.trim(),
              email:     null,
              address:   address.trim(),
              city:      city.trim(),
              region:    town.trim(),
              zipcode:   null,
            },
          ],
          utm_source:   source.utm_source,
          utm_medium:   source.utm_medium,
          utm_campaign: source.utm_campaign,
          utm_content:  source.utm_content,
          utm_term:     source.utm_term,
          ttclid:       source.ttclid,
          fbclid:       source.fbclid,
          gclid:        source.gclid,
          referrer:     source.referrer,
          landing_url:  source.landing_url,
          whatsapp:       whatsapp.trim(),
          delivery_date:  deliveryDate,
        };

        console.log("📦 Sending order data:", orderData);
        const response = await createOrder(orderData);
        console.log("✅ Order created:", response);

      } catch (apiErr) {
        console.warn("API write failed (non-blocking):", apiErr.message);
      }
    }

    // ── 3. GTM purchase ────────────────────────────────────────────
    pushEvent("purchase", {
      ecommerce: {
        transaction_id: orderId,
        currency:       "KES",
        value:          selectedPkg?._rawPrice || 0,
        items:          [ecomItem],
      },
    });

    setLoading(false);
    onSuccess({ name: name.trim(), pkg: selectedPkg, order: { order_id: orderId } });
  };

  return (
    <div className="order-form-wrap">
      <div className="order-form-title">📋 Complete Your Order</div>
      <div className="order-form-subtitle">
        Fill in your details — our team will confirm &amp; arrange free delivery.
      </div>

      {/* ── Package dropdown ── */}
      <div className="form-row">
        <label className="form-label">Select Your Package</label>
        <select
          className={`form-input${errors.package ? " error" : ""}`}
          value={selectedPkg ? packages.findIndex(p => p.id === selectedPkg.id) : ""}
          onChange={e => {
            const idx = e.target.value;
            if (idx !== "") onSelect(Number(idx));
          }}
        >
          <option value="" disabled>— Choose a package —</option>
          {packages.map((pkg, i) => (
            <option key={pkg.id ?? i} value={i}>
              {pkg.label}{pkg._qty > 1 ? ` ×${pkg._qty}` : ""} — {pkg.price}
              {pkg.saving ? `  ✦ ${pkg.saving}` : ""}
            </option>
          ))}
        </select>
        {errors.package && <span className="form-error">⚠ {errors.package}</span>}
      </div>

      {/* Confirmation strip — shown once a package is picked */}
      {selectedPkg && (
        <div className="order-selected-pkg">
          <div className="order-selected-pkg-name">
            ✅ {selectedPkg.label}
            {selectedPkg._qty > 1 && ` (×${selectedPkg._qty})`}
          </div>
          <div className="order-selected-pkg-price">{selectedPkg.price}</div>
        </div>
      )}

      {/* Expected delivery date */}
      <div className="form-row">
        <label className="form-label">Expected Delivery Date</label>
        <input
          className={`form-input${errors.deliveryDate ? " error" : ""}`}
          type="date"
          value={deliveryDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={e => setDeliveryDate(e.target.value)}
        />
        {errors.deliveryDate && <span className="form-error">⚠ {errors.deliveryDate}</span>}
      </div>

      {/* Full Name */}
      <div className="form-row">
        <label className="form-label">Full Name</label>
        <input
          className={`form-input${errors.name ? " error" : ""}`}
          type="text"
          placeholder="e.g. James Mwangi"
          value={name}
          onChange={e => setName(e.target.value)}
          autoComplete="name"
        />
        {errors.name && <span className="form-error">⚠ {errors.name}</span>}
      </div>

      {/* Phone */}
      <div className="form-row">
        <label className="form-label">Phone Number</label>
        <input
          className={`form-input${errors.phone ? " error" : ""}`}
          type="tel"
          placeholder="e.g. 0712 345 678"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          autoComplete="tel"
        />
        {errors.phone && <span className="form-error">⚠ {errors.phone}</span>}
      </div>

      {/* WhatsApp */}
      <div className="form-row">
        <label className="form-label">WhatsApp Number (optional)</label>
        <input
          className={`form-input${errors.whatsapp ? " error" : ""}`}
          type="tel"
          placeholder="e.g. 0712 345 678"
          value={whatsapp}
          onChange={e => setWhatsapp(e.target.value)}
          autoComplete="tel"
        />
        {errors.whatsapp && <span className="form-error">⚠ {errors.whatsapp}</span>}
      </div>

      {/* City */}
      <div className="form-row">
        <label className="form-label">City</label>
        <input
          className={`form-input${errors.city ? " error" : ""}`}
          type="text"
          placeholder="e.g. Nairobi"
          value={city}
          onChange={e => setCity(e.target.value)}
          autoComplete="address-level2"
        />
        {errors.city && <span className="form-error">⚠ {errors.city}</span>}
      </div>

      {/* Town */}
      <div className="form-row">
        <label className="form-label">Town / Estate</label>
        <input
          className={`form-input${errors.town ? " error" : ""}`}
          type="text"
          placeholder="e.g. Westlands"
          value={town}
          onChange={e => setTown(e.target.value)}
          autoComplete="address-level3"
        />
        {errors.town && <span className="form-error">⚠ {errors.town}</span>}
      </div>

      {/* Full Address */}
      <div className="form-row">
        <label className="form-label">Full Address</label>
        <input
          className={`form-input${errors.address ? " error" : ""}`}
          type="text"
          placeholder="e.g. 123 Main Street, Apt 4B"
          value={address}
          onChange={e => setAddress(e.target.value)}
          autoComplete="street-address"
        />
        {errors.address && <span className="form-error">⚠ {errors.address}</span>}
      </div>

      <div className="form-submit-row">
        <button
          className="form-submit-btn anim-pulse"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <><span className="btn-spinner" /> Processing…</>
            : "🛒 Place My Order Now"}
        </button>
      </div>

      <div className="form-trust">
        {["🚚 Free Delivery", "💳 Pay on Delivery", "🔒 Discreet Packaging", "✅ 14-Day Guarantee"].map(t => (
          <span className="form-trust-item" key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
};

/* ─── ORDER SUCCESS ───────────────────────────────────────────── */
const OrderSuccess = ({ name, pkg }) => (
  <div className="order-success">
    <div className="order-success-icon">🎉</div>
    <div className="order-success-title">Order Placed, {name?.split(" ")[0]}!</div>
    <div className="order-success-sub">
      Thank you for your order. Our team will call you shortly to confirm delivery details.
      No payment needed now — you pay on delivery.
    </div>
    <div className="order-success-detail">
      📦 <strong>{pkg?.label}</strong> — {pkg?.price}<br />
      🚚 Free delivery to your door<br />
      📞 Expect a call from us within 1–2 hours
    </div>
  </div>
);

/* ─── SECTION COMPONENTS ──────────────────────────────────────── */

const HeroSection = ({ product, data }) => {
  const BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL || "";

  const imageUrl = product?.images?.[0]?.image_path
    ? `${BASE_URL}${product.images[0].image_path}`
    : "https://via.placeholder.com/260x260?text=No+Image";

  const scrollToCTA = () =>
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="hero">
      <FloatingWhatsApp
        phoneNumber="254110771426"
        accountName="AlphaHerb"
        chatMessage="Hello 👋 How can we help you today?"
        statusMessage="Typically replies within 3 minutes"
      />

      <div className="hero-inner">
        {product && (
          <div className="hero-image-wrap anim-fade-in">
            <div className="hero-image-box">
              <img
                src={imageUrl}
                alt={product.name}
                loading="lazy"
                onError={e => { e.target.src = "https://via.placeholder.com/260x260?text=No+Image"; }}
              />
            </div>
          </div>
        )}

        <div className="anim-fade-up" style={{ animationDelay: "0ms" }}>
          <div className="hero-badge">⭐ Trusted by 11,750+ Men Across Africa</div>
        </div>

        <h1 className="hero-title anim-fade-up" style={{ animationDelay: "120ms" }}>
          <span className="gold-text">{data?.title || product?.name}</span>
        </h1>

        <p className="hero-subtitle anim-fade-up" style={{ animationDelay: "220ms" }}>
          {data?.supporting_text}
        </p>

        <div className="anim-fade-up anim-pulse" style={{ animationDelay: "340ms" }}>
          <button className="cta-btn large" onClick={scrollToCTA}>
            🛒 {data?.cta_text || "Order Now"}
          </button>
        </div>

        <div className="hero-meta anim-fade-up" style={{ animationDelay: "440ms" }}>
          {["🚚 Free Delivery", "💳 Pay on Delivery", "🔒 Discreet Packaging", "✅ 14-Day Guarantee"].map(m => (
            <div className="hero-meta-item" key={m}>{m}</div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProofBar = () => (
  <div className="proof-bar">
    <div className="proof-bar-inner">
      {[["11,750+", "Happy Customers"], ["4.9/5", "Average Rating"], ["100%", "Natural Formula"], ["Free", "Delivery"]].map(
        ([num, label], i, arr) => (
          <React.Fragment key={label}>
            <div className="proof-stat">
              <div className="proof-stat-num">{num}</div>
              <div className="proof-stat-label">{label}</div>
            </div>
            {i < arr.length - 1 && <div className="proof-divider" />}
          </React.Fragment>
        )
      )}
    </div>
  </div>
);

const AboutSection = ({ data, product }) => (
  <section className="section about">
    <div className="section-inner">
      <h2 className="section-title">What Is <span className="gold-text">{product?.name}</span></h2>
      <div className="gold-divider" />
      <p className="about-body">{data?.body}</p>
    </div>
  </section>
);

const ProblemSection = ({ data }) => (
  <section className="section problem">
    <div className="section-inner">
      <h2 className="section-title">Are You Struggling With <span className="gold-text">Any of These?</span></h2>
      <div className="gold-divider" />
      <div className="problem-grid">
        {data?.items?.map((item, i) => (
          <div className="problem-item" key={i}>
            <span style={{ flexShrink: 0, marginTop: 1 }}>❌</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      {data?.closing_line && <p className="problem-closing">"{data.closing_line}"</p>}
    </div>
  </section>
);

const BenefitsSection = ({ data,product }) => (
  <section className="section benefits">
    <div className="section-inner">
      <h2 className="section-title">What <span className="gold-text">{product?.name}</span> Does For You</h2>
      <div className="gold-divider" />
      <div className="benefits-grid">
        {data?.items?.map((item, i) => (
          <div className="benefit-card" key={i}>
            <div className="benefit-icon">{BENEFIT_ICONS[item.title] || "✦"}</div>
            <div className="benefit-title">{item.title}</div>
            <div className="benefit-detail">{item.detail}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const WhyChooseSection = ({ data, product }) => (
  <section className="section why-choose">
    <div className="section-inner">
      <h2 className="section-title">Why <span className="gold-text">{product?.name}</span> Over Everything Else?</h2>
      <div className="gold-divider" />
      <div className="why-list">
        {data?.items?.map((item, i) => (
          <div className="why-item" key={i}>
            <div className="why-num">0{i + 1}</div>
            <div>
              <div className="why-title">{item.title}</div>
              <div className="why-detail">{item.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HowToUseSection = ({ data }) => (
  <section className="section how-to-use">
    <div className="section-inner">
      <h2 className="section-title">Simple to Use. <span className="gold-text">Powerful Results.</span></h2>
      <div className="gold-divider" />
      <div className="steps">
        {data?.steps?.map((step, i) => (
          <div className="step" key={i}>
            <div className="step-num">{i + 1}</div>
            <div className="step-text">{step}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ReviewsSection = ({ reviews }) => {
  if (!reviews?.length) return null;
  return (
    <section className="section reviews">
      <div className="section-inner">
        <h2 className="section-title">What <span className="gold-text">Customers</span> Are Saying</h2>
        <div className="gold-divider" />
        <div className="reviews-grid">
          {reviews.map(r => (
            <div className="review-card" key={r.id}>
              <Stars rating={r.rating} />
              <p className="review-text">"{r.comment}"</p>
              <div className="review-author">
                <div className="review-avatar">{r.name?.[0]}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  {r.is_verified && <div className="review-badge">✔ Verified Purchase</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════════
   PACKAGES + ORDER FORM (combined)
   ══════════════════════════════════════════════════════════════ */
const PackagesSection = ({ data, bundles, offers, product }) => {
  const [selected,    setSelected]    = useState(null);
  const [orderDone,   setOrderDone]   = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  const buildPackages = () => {
    if (bundles?.length) {
      const badges = ["Starter", "Best Seller", "Recommended"];
      const notes  = ["Great for first-time users", "Ongoing support & maintenance", "Complete treatment course"];
      return bundles.map((b, i) => {
        const originalPrice = b.quantity * 4000;
        const finalPrice    = Number(b.price);
        const saving        = originalPrice - finalPrice;
        return {
          id:         b.id,
          label:      b.title,
          price:      `KSh ${finalPrice.toLocaleString()}`,
          oldPrice:   saving > 0 ? `KSh ${originalPrice.toLocaleString()}` : null,
          saving:     saving > 0 ? `Save KSh ${saving.toLocaleString()}` : null,
          badge:      badges[i] || null,
          note:       notes[i] || null,
          _rawPrice:  finalPrice,
          _qty:       b.quantity || 1,
        };
      });
    }
    return (data?.packages || []).map((p, i) => ({
      ...p,
      id: p.id || i,
      _rawPrice: parseInt(String(p.price).replace(/\D/g, "")) || 0,
      _qty: 1,
    }));
  };

  const packages = buildPackages();

  useEffect(() => {
    if (packages.length) {
      pushEvent("view_item", {
        ecommerce: {
          currency: "KES",
          value:    packages[0]?._rawPrice || 0,
          items:    packages.map((p, i) => ({
            item_id:       String(p.id),
            item_name:     p.label,
            item_category: product?.name || "",
            price:         p._rawPrice,
            quantity:      p._qty || 1,
            index:         i,
          })),
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (idx) => {
    setSelected(idx);
    pushEvent("select_item", {
      ecommerce: {
        currency: "KES",
        value:    packages[idx]?._rawPrice || 0,
        items: [{
          item_id:       String(packages[idx]?.id),
          item_name:     packages[idx]?.label,
          item_category: product?.name || "",
          price:         packages[idx]?._rawPrice || 0,
          quantity:      packages[idx]?._qty || 1,
          index:         idx,
        }],
      },
    });
  };

  const selectedPkg = selected !== null ? packages[selected] : null;

  if (orderDone && successInfo) {
    return (
      <section className="section packages-section" id="order-section">
        <div className="section-inner">
          <OrderSuccess name={successInfo.name} pkg={successInfo.pkg} />
        </div>
      </section>
    );
  }

  return (
    <section className="section packages-section" id="order-section">
      <div className="section-inner">
        <h2 className="section-title">Take Back <span className="gold-text">Control Today</span></h2>
        <div className="gold-divider" />

        <OrderForm
          selectedPkg={selectedPkg}
          packages={packages}
          onSelect={handleSelect}
          product={product}
          onSuccess={(info) => {
            setSuccessInfo(info);
            setOrderDone(true);
            document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <p className="urgency" style={{ marginTop: "1.4rem" }}>
          <span>✔ Free Delivery</span> &nbsp;|&nbsp;
          <span>✔ Pay on Delivery</span> &nbsp;|&nbsp;
          <span>✔ 14-Day Guarantee</span>
        </p>
      </div>
    </section>
  );
};

const DeliverySection = ({ data }) => (
  <section className="section delivery">
    <div className="section-inner">
      <h2 className="section-title">Our <span className="gold-text">Promise</span> to You</h2>
      <div className="gold-divider" />
      <div className="delivery-grid">
        {data?.items?.map((item, i) => (
          <div className="delivery-card" key={i}>
            <div className="delivery-icon">{DELIVERY_ICONS[item.title] || "✦"}</div>
            <div className="delivery-title">{item.title}</div>
            <div className="delivery-detail">{item.detail}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQSection = ({ faqs }) => {
  const [open, setOpen] = useState(null);
  if (!faqs?.length) return null;
  return (
    <section className="section faq-section">
      <div className="section-inner">
        <h2 className="section-title">Frequently Asked <span className="gold-text">Questions</span></h2>
        <div className="gold-divider" />
        <div className="faq-list">
          {faqs.map(faq => (
            <div className="faq-item" key={faq.id}>
              <button className="faq-q" onClick={() => setOpen(open === faq.id ? null : faq.id)}>
                <span>{faq.question}</span>
                <span className={`faq-icon ${open === faq.id ? "open" : ""}`}>✕</span>
              </button>
              <div className={`faq-a ${open === faq.id ? "open" : ""}`}>{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Ticker = () => {
  const items = ["Free Delivery", "Pay on Delivery", "100% Natural", "14-Day Guarantee", "Discreet Packaging", "Trusted by 11,750+ Men"];
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span className="ticker-item" key={i}>
            {item} <span className="ticker-dot">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const StickyBar = ({ product }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div className={`sticky-bar ${visible ? "visible" : ""}`}>
      <div className="sticky-bar-text">
        <strong>{product?.name}</strong><br />KSh 3,500 – Free Delivery
      </div>
      <button
        className="sticky-bar-btn"
        onClick={() => document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" })}
      >
        Order Now 🛒
      </button>
    </div>
  );
};

/* ─── MAIN PAGE ───────────────────────────────────────────────── */
const SalesPage = () => {
  const { slug } = useParams();
  const [product,  setProduct]  = useState(null);
  const [sections, setSections] = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [faqs,     setFaqs]     = useState([]);
  const [bundles,  setBundles]  = useState([]);
  const [offers,   setOffers]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => { initGTM(); }, []);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res  = await fetch(`${API_URL}/product/${slug}`);
        const data = await res.json();
        setProduct(data.product   || null);
        setSections(data.sections || []);
        setReviews(data.reviews   || []);
        setFaqs(data.faqs         || []);
        setBundles(data.bundles   || []);
        setOffers(data.offers     || []);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const renderSection = (section) => {
    if (!section?.is_active) return null;
    const key = section.id;
    switch (section.type) {
      case "hero":               return <HeroSection        key={key} product={product} data={section.content} />;
      case "about":              return <AboutSection       key={key} data={section.content} product={product} />;
      case "problem":            return <ProblemSection     key={key} data={section.content} />;
      case "benefits":           return <BenefitsSection    key={key} data={section.content} />;
      case "why_choose":         return <WhyChooseSection   key={key} data={section.content} />;
      case "how_to_use":         return <HowToUseSection    key={key} data={section.content} />;
      case "delivery_guarantee": return <DeliverySection    key={key} data={section.content} />;
      case "cta":                return (
        <PackagesSection
          key={key}
          data={section.content}
          bundles={bundles}
          offers={offers}
          product={product}
        />
      );
      default: return null;
    }
  };

  if (loading)
    return (<><FontLoader /><style>{STYLES}</style><div className="loading-screen"><div className="loader" /></div></>);

  if (!product)
    return (<><FontLoader /><style>{STYLES}</style><div className="loading-screen"><p style={{ color: "var(--muted)" }}>Product not found.</p></div></>);

  const sorted = [...sections].sort((a, b) => a.sort_order - b.sort_order);
  const final  = [];
  sorted.forEach(s => {
    final.push(s);
    if (s.type === "benefits" && reviews.length)
      final.push({ id: "__reviews", type: "__reviews", is_active: true });
  });
  const ctaIdx = final.findIndex(s => s.type === "cta");
  if (ctaIdx > -1 && faqs.length)
    final.splice(ctaIdx, 0, { id: "__faqs", type: "__faqs", is_active: true });

  return (
    <>
      <FontLoader />
      <style>{STYLES}</style>
      <div className="sales-page">
        <StickyBar product={product} />
        <Ticker />
        {final.map(section => {
          if (section.type === "__reviews") return <ReviewsSection key="reviews" reviews={reviews} />;
          if (section.type === "__faqs")    return <FAQSection     key="faqs"    faqs={faqs} />;
          return renderSection(section);
        })}
        <ProofBar />
        <footer className="footer">
          <div className="footer-logo">{product.name}</div>
          <p className="footer-text">
            © {new Date().getFullYear()} AlphaHerb. All rights reserved.<br />
            Results may vary. This product is not intended to diagnose, treat, cure, or prevent any disease.<br />
            Free delivery within Kenya. Pay on delivery available.
          </p>
        </footer>
      </div>
    </>
  );
};

export default SalesPage;