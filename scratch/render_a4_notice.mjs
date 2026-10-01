import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const WIDTH = 1240;
const HEIGHT = 1754;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <!-- Background and Brand Gradients -->
    <linearGradient id="ezyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6A00" />
      <stop offset="50%" stop-color="#FF5100" />
      <stop offset="100%" stop-color="#E53935" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF500" />
      <stop offset="100%" stop-color="#FFB300" />
    </linearGradient>
    <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A7F3D0" />
      <stop offset="25%" stop-color="#BAE6FD" />
      <stop offset="50%" stop-color="#DDD6FE" />
      <stop offset="75%" stop-color="#FBCFE8" />
      <stop offset="100%" stop-color="#FED7AA" />
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
  </defs>

  <style>
    .font-sans { font-family: 'Arial', 'Aptos', 'Segoe UI', Helvetica, sans-serif; }
    .font-mono { font-family: 'Consolas', 'Courier New', monospace; }
  </style>

  <!-- Page Background: Clean White -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#FFFFFF" />

  <!-- Security Double Hairline Border -->
  <rect x="36" y="36" width="${WIDTH - 72}" height="${HEIGHT - 72}" fill="none" stroke="#E2E8F0" stroke-width="2" rx="4" />
  <rect x="42" y="42" width="${WIDTH - 84}" height="${HEIGHT - 84}" fill="none" stroke="#CBD5E1" stroke-width="1" rx="2" stroke-dasharray="8 4" />

  <!-- Corner Security Accents -->
  <circle cx="36" cy="36" r="4" fill="#FF5100" />
  <circle cx="${WIDTH - 36}" cy="36" r="4" fill="#FF5100" />
  <circle cx="36" cy="${HEIGHT - 36}" r="4" fill="#FF5100" />
  <circle cx="${WIDTH - 36}" cy="${HEIGHT - 36}" r="4" fill="#FF5100" />

  <!-- ======================================================== -->
  <!-- WATERMARK (Subtle, Translucent behind content)           -->
  <!-- ======================================================== -->
  <g transform="translate(620, 880) rotate(-25)" opacity="0.04">
    <rect x="-350" y="-350" width="700" height="700" rx="170" fill="#000000" />
    <text x="0" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="280" fill="#000000">ezy1</text>
    <text x="0" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="52" letter-spacing="8" fill="#000000">OFFICIAL AUTHENTICATED</text>
  </g>

  <!-- ======================================================== -->
  <!-- 1. HEADER: Logo + Corporate Entity + HoloMark Security   -->
  <!-- ======================================================== -->
  <g transform="translate(60, 56)">
    <!-- Official EZY1 Squircle Logo -->
    <rect x="0" y="0" width="84" height="84" rx="20" fill="url(#ezyGrad)" />
    <rect x="1" y="1" width="82" height="82" rx="19" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5" />
    
    <text x="42" y="52" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="30" letter-spacing="-0.5">
      <tspan fill="#FFFFFF">ezy</tspan><tspan fill="url(#goldGrad)" font-size="34">1</tspan>
    </text>
    
    <rect x="22" y="60" width="34" height="4" rx="2" fill="url(#goldGrad)" />
    <circle cx="16" cy="62" r="2" fill="#FFFFFF" />
    <circle cx="62" cy="62" r="2" fill="url(#goldGrad)" />
    <polygon points="68,26 70,30 74,31 70,32 68,36 66,32 62,31 66,30" fill="url(#goldGrad)" />

    <!-- Corporate Title & Tagline -->
    <text x="104" y="32" class="font-sans" font-weight="800" font-size="24" fill="#0F172A" letter-spacing="-0.5">
      EZY1 PLATFORM TECHNOLOGIES PVT. LTD.
    </text>
    <text x="104" y="54" class="font-sans" font-weight="700" font-size="13" fill="#FF5100" letter-spacing="0.5">
      Local Super App for Everything
    </text>
    <text x="104" y="74" class="font-sans" font-weight="500" font-size="12" fill="#64748B">
      CIN: U72900DL2024PTC123456 • Official Portal: https://ezy1.site • New Delhi, India
    </text>

    <!-- HoloMark Holographic Security Seal (Top Right) -->
    <g transform="translate(940, -4)">
      <!-- Outer holographic rainbow rosette -->
      <circle cx="90" cy="46" r="44" fill="url(#holoGrad)" stroke="#CBD5E1" stroke-width="1.5" />
      <circle cx="90" cy="46" r="38" fill="#FFFFFF" fill-opacity="0.9" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3 2" />
      
      <!-- Seal Content -->
      <polygon points="90,14 94,22 103,24 96,30 98,39 90,34 82,39 84,30 77,24 86,22" fill="#E2E8F0" />
      <text x="90" y="38" text-anchor="middle" class="font-sans" font-weight="900" font-size="9" fill="#0F172A" letter-spacing="1.5">★ EZY1 ★</text>
      <text x="90" y="52" text-anchor="middle" class="font-sans" font-weight="800" font-size="12" fill="#059669">VERIFIED</text>
      <text x="90" y="64" text-anchor="middle" class="font-sans" font-weight="700" font-size="7.5" fill="#475569" letter-spacing="1">AUTHENTIC</text>
      <circle cx="90" cy="46" r="42" fill="none" stroke="url(#holoGrad)" stroke-width="2" />
    </g>
  </g>

  <!-- Corporate Header Divider -->
  <line x1="60" y1="156" x2="1180" y2="156" stroke="#0F172A" stroke-width="2.5" />
  <line x1="60" y1="160" x2="1180" y2="160" stroke="#FF5100" stroke-width="1.5" />

  <!-- ======================================================== -->
  <!-- 2. DOCUMENT TITLES & METADATA STRIP                      -->
  <!-- ======================================================== -->
  <g transform="translate(60, 192)">
    <text x="0" y="0" class="font-sans" font-weight="900" font-size="21" fill="#0F172A" letter-spacing="0.3">
      EZY1 OFFICIAL COMMUNICATION &amp; BRAND NOTICE
    </text>
    <text x="0" y="22" class="font-sans" font-weight="800" font-size="13" fill="#EA580C" letter-spacing="1.2">
      PUBLIC ADVISORY FOR ALL USERS, MERCHANTS, RIDERS &amp; PARTNERS
    </text>

    <!-- Metadata Strip Card -->
    <rect x="0" y="34" width="1120" height="38" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.2" />
    
    <text x="18" y="58" class="font-sans" font-size="11" font-weight="700" fill="#475569">Notice Ref No: <tspan font-weight="800" fill="#0F172A">EZY1/SEC/2026/09-AUTH</tspan></text>
    <line x1="285" y1="42" x2="285" y2="64" stroke="#CBD5E1" stroke-width="1" />
    
    <text x="300" y="58" class="font-sans" font-size="11" font-weight="700" fill="#475569">Effective Date: <tspan font-weight="800" fill="#059669">Active &amp; Ongoing</tspan></text>
    <line x1="535" y1="42" x2="535" y2="64" stroke="#CBD5E1" stroke-width="1" />
    
    <text x="550" y="58" class="font-sans" font-size="11" font-weight="700" fill="#475569">Issuer: <tspan font-weight="800" fill="#0F172A">EZY1 Platform Technologies Pvt. Ltd.</tspan></text>
    <line x1="885" y1="42" x2="885" y2="64" stroke="#CBD5E1" stroke-width="1" />

    <text x="900" y="58" class="font-sans" font-size="11" font-weight="700" fill="#475569">Official Domain: <tspan font-weight="800" fill="#FF5100">https://ezy1.site</tspan></text>
  </g>

  <!-- Preamble Notice Statement -->
  <g transform="translate(60, 290)">
    <text x="0" y="0" class="font-sans" font-size="11.5" fill="#334155" line-height="1.5">
      <tspan x="0" dy="0">EZY1 Platform Technologies Pvt. Ltd. is issuing this public advisory to help users, merchants, vendors, riders, hospitals, partners,</tspan>
      <tspan x="0" dy="18">and other members of the EZY1 community identify legitimate EZY1 communications and protect themselves from phishing, fraud, and impersonation.</tspan>
      <tspan x="0" dy="18">All legitimate platform communications originate strictly from authenticated sender identities ending in <tspan font-weight="700" fill="#0F172A">@ezy1.site</tspan>.</tspan>
    </text>
  </g>

  <!-- ======================================================== -->
  <!-- 3. EMAIL DIRECTORY TABLE (Compact 4-Column Layout)       -->
  <!-- ======================================================== -->
  <g transform="translate(60, 370)">
    <!-- Section Heading -->
    <rect x="0" y="0" width="4" height="15" fill="#FF5100" />
    <text x="12" y="12" class="font-sans" font-weight="800" font-size="13" fill="#0F172A" letter-spacing="0.5">
      AUTHENTICATED SENDER IDENTITY &amp; COMMUNICATION DIRECTORY
    </text>
    
    <!-- Table Container -->
    <g transform="translate(0, 26)">
      <!-- Table Header -->
      <rect x="0" y="0" width="1120" height="32" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1" />
      <text x="16" y="21" class="font-sans" font-weight="800" font-size="11" fill="#0F172A">Department / Purpose</text>
      <text x="320" y="21" class="font-sans" font-weight="800" font-size="11" fill="#0F172A">Official Email Address</text>
      <text x="560" y="21" class="font-sans" font-weight="800" font-size="11" fill="#0F172A">Security Level</text>
      <text x="710" y="21" class="font-sans" font-weight="800" font-size="11" fill="#0F172A">Intended Recipient &amp; Scope</text>

      <!-- Row 1: Orders -->
      <g transform="translate(0, 32)">
        <rect x="0" y="0" width="1120" height="34" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="0.8" />
        <text x="16" y="22" class="font-sans" font-weight="700" font-size="11" fill="#0F172A">Orders, Bookings &amp; Invoices</text>
        <text x="320" y="22" class="font-mono" font-weight="700" font-size="11.5" fill="#FF5100">orders@ezy1.site</text>
        <rect x="560" y="7" width="60" height="20" rx="4" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
        <text x="590" y="21" text-anchor="middle" class="font-sans" font-weight="800" font-size="10" fill="#065F46">High</text>
        <text x="710" y="22" class="font-sans" font-size="10.5" fill="#334155">Customers, Store Vendors, Riders (Receipts, Tracking)</text>
      </g>

      <!-- Row 2: Support -->
      <g transform="translate(0, 66)">
        <rect x="0" y="0" width="1120" height="34" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="0.8" />
        <text x="16" y="22" class="font-sans" font-weight="700" font-size="11" fill="#0F172A">Customer Support &amp; Inquiries</text>
        <text x="320" y="22" class="font-mono" font-weight="700" font-size="11.5" fill="#FF5100">support@ezy1.site</text>
        <rect x="560" y="7" width="60" height="20" rx="4" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
        <text x="590" y="21" text-anchor="middle" class="font-sans" font-weight="800" font-size="10" fill="#065F46">High</text>
        <text x="710" y="22" class="font-sans" font-size="10.5" fill="#334155">All Users &amp; Inbound Customer Support (Replies, Tickets)</text>
      </g>

      <!-- Row 3: Partner -->
      <g transform="translate(0, 100)">
        <rect x="0" y="0" width="1120" height="34" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="0.8" />
        <text x="16" y="22" class="font-sans" font-weight="700" font-size="11" fill="#0F172A">Merchant &amp; Partner Onboarding</text>
        <text x="320" y="22" class="font-mono" font-weight="700" font-size="11.5" fill="#FF5100">partner@ezy1.site</text>
        <rect x="560" y="7" width="60" height="20" rx="4" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
        <text x="590" y="21" text-anchor="middle" class="font-sans" font-weight="800" font-size="10" fill="#065F46">High</text>
        <text x="710" y="22" class="font-sans" font-size="10.5" fill="#334155">Stores, Hospitals, Drivers, Fleet Partners &amp; Technicians</text>
      </g>

      <!-- Row 4: No-Reply OTP -->
      <g transform="translate(0, 134)">
        <rect x="0" y="0" width="1120" height="34" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="0.8" />
        <text x="16" y="22" class="font-sans" font-weight="700" font-size="11" fill="#0F172A">Security, OTP &amp; Password Reset</text>
        <text x="320" y="22" class="font-mono" font-weight="700" font-size="11.5" fill="#2563EB">no-reply@ezy1.site</text>
        <rect x="560" y="7" width="76" height="20" rx="4" fill="#FEF3C7" stroke="#FDE68A" stroke-width="1" />
        <text x="598" y="21" text-anchor="middle" class="font-sans" font-weight="800" font-size="10" fill="#92400E">Automated</text>
        <text x="710" y="22" class="font-sans" font-size="10.5" fill="#334155">User Authentication &amp; Logins Only (Do Not Reply)</text>
      </g>

      <!-- Row 5: Offers -->
      <g transform="translate(0, 168)">
        <rect x="0" y="0" width="1120" height="34" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="0.8" />
        <text x="16" y="22" class="font-sans" font-weight="700" font-size="11" fill="#0F172A">Promotions, Offers &amp; Newsletters</text>
        <text x="320" y="22" class="font-mono" font-weight="700" font-size="11.5" fill="#FF5100">offers@ezy1.site</text>
        <rect x="560" y="7" width="76" height="20" rx="4" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1" />
        <text x="598" y="21" text-anchor="middle" class="font-sans" font-weight="800" font-size="10" fill="#1E40AF">Marketing</text>
        <text x="710" y="22" class="font-sans" font-size="10.5" fill="#334155">Opted-in Customers &amp; Subscribers (With Unsubscribe Link)</text>
      </g>

      <!-- Row 6: Corporate Affairs -->
      <g transform="translate(0, 202)">
        <rect x="0" y="0" width="1120" height="34" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="0.8" />
        <text x="16" y="22" class="font-sans" font-weight="700" font-size="11" fill="#0F172A">Corporate &amp; Management Affairs</text>
        <text x="320" y="22" class="font-mono" font-weight="700" font-size="11.5" fill="#DC2626">owner@ezy1.site</text>
        <rect x="560" y="7" width="76" height="20" rx="4" fill="#FEE2E2" stroke="#FECACA" stroke-width="1" />
        <text x="598" y="21" text-anchor="middle" class="font-sans" font-weight="800" font-size="10" fill="#991B1B">Executive</text>
        <text x="710" y="22" class="font-sans" font-size="10.5" fill="#334155">Official Escalations, Regulatory &amp; Corporate Governance</text>
      </g>

      <!-- Row 7: Administrative Alerts -->
      <g transform="translate(0, 236)">
        <rect x="0" y="0" width="1120" height="34" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="0.8" />
        <text x="16" y="22" class="font-sans" font-weight="700" font-size="11" fill="#0F172A">Administrative &amp; System Alerts</text>
        <text x="320" y="22" class="font-mono" font-weight="700" font-size="11.5" fill="#475569">admin@ezy1.site</text>
        <rect x="560" y="7" width="60" height="20" rx="4" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1" />
        <text x="590" y="21" text-anchor="middle" class="font-sans" font-weight="800" font-size="10" fill="#334155">Internal</text>
        <text x="710" y="22" class="font-sans" font-size="10.5" fill="#334155">Platform Administrators, Security &amp; Compliance Audits</text>
      </g>
    </g>
  </g>

  <!-- ======================================================== -->
  <!-- 4. HOW TO VERIFY LEGITIMATE COMMUNICATIONS               -->
  <!-- ======================================================== -->
  <g transform="translate(60, 680)">
    <rect x="0" y="0" width="4" height="15" fill="#FF5100" />
    <text x="12" y="12" class="font-sans" font-weight="800" font-size="13" fill="#0F172A" letter-spacing="0.5">
      HOW TO VERIFY LEGITIMATE EZY1 COMMUNICATIONS
    </text>

    <!-- 3 Verification Principle Cards -->
    <g transform="translate(0, 24)">
      <!-- Principle 1 -->
      <rect x="0" y="0" width="360" height="106" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      <circle cx="24" cy="24" r="10" fill="#FF5100" />
      <text x="24" y="28" text-anchor="middle" class="font-sans" font-weight="800" font-size="11" fill="#FFFFFF">1</text>
      <text x="44" y="28" class="font-sans" font-weight="800" font-size="12" fill="#0F172A">Sender Domain Check</text>
      <text x="16" y="52" class="font-sans" font-size="10.5" fill="#475569" line-height="1.4">
        <tspan x="16" dy="0">Legitimate emails arrive <tspan font-weight="700">only from @ezy1.site</tspan>.</tspan>
        <tspan x="16" dy="16">EZY1 will never contact you regarding orders</tspan>
        <tspan x="16" dy="16">from @gmail.com, @yahoo.com, or @outlook.com.</tspan>
      </text>

      <!-- Principle 2 -->
      <g transform="translate(380, 0)">
        <rect x="0" y="0" width="360" height="106" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
        <circle cx="24" cy="24" r="10" fill="#FF5100" />
        <text x="24" y="28" text-anchor="middle" class="font-sans" font-weight="800" font-size="11" fill="#FFFFFF">2</text>
        <text x="44" y="28" class="font-sans" font-weight="800" font-size="12" fill="#0F172A">Official Logo &amp; Tagline</text>
        <text x="16" y="52" class="font-sans" font-size="10.5" fill="#475569" line-height="1.4">
          <tspan x="16" dy="0">Authentic emails display the official <tspan font-weight="700">EZY1 logo</tspan></tspan>
          <tspan x="16" dy="16">in the header alongside the registered tagline:</tspan>
          <tspan x="16" dy="16" font-style="italic" fill="#FF5100">"Local Super App for Everything"</tspan>
        </text>
      </g>

      <!-- Principle 3 -->
      <g transform="translate(760, 0)">
        <rect x="0" y="0" width="360" height="106" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
        <circle cx="24" cy="24" r="10" fill="#059669" />
        <text x="24" y="28" text-anchor="middle" class="font-sans" font-weight="800" font-size="11" fill="#FFFFFF">3</text>
        <text x="44" y="28" class="font-sans" font-weight="800" font-size="12" fill="#0F172A">Cryptographic DKIM / SPF</text>
        <text x="16" y="52" class="font-sans" font-size="10.5" fill="#475569" line-height="1.4">
          <tspan x="16" dy="0">Every email is cryptographically signed with</tspan>
          <tspan x="16" dy="16"><tspan font-weight="700">DKIM</tspan> (brevo1._domainkey.ezy1.site) and</tspan>
          <tspan x="16" dy="16">validated by SPF &amp; DMARC domain policy.</tspan>
        </text>
      </g>
    </g>
  </g>

  <!-- ======================================================== -->
  <!-- 5. CONFIDENTIALITY & OTP SECURITY ADVISORY               -->
  <!-- ======================================================== -->
  <g transform="translate(60, 835)">
    <rect x="0" y="0" width="1120" height="88" rx="8" fill="#FFF7ED" stroke="#FFEDD5" stroke-width="1.5" />
    
    <g transform="translate(20, 20)">
      <!-- Security Shield Icon -->
      <rect x="0" y="0" width="32" height="32" rx="8" fill="#FF5100" />
      <path d="M 16 8 L 24 11 L 24 19 C 24 23 16 26 16 26 C 16 26 8 23 8 19 L 8 11 Z" fill="#FFFFFF" />
      <polyline points="12,17 15,20 20,14" fill="none" stroke="#FF5100" stroke-width="2" />
      
      <text x="44" y="14" class="font-sans" font-weight="800" font-size="12.5" fill="#9A3412">
        CONFIDENTIALITY &amp; OTP SECURITY MANDATE
      </text>
      <text x="44" y="32" class="font-sans" font-size="11" fill="#7C2D12" line-height="1.4">
        <tspan x="44" dy="0">EZY1 staff, support executives, and delivery personnel will <tspan font-weight="800">NEVER ask users for passwords, UPI PINs, or One-Time Passwords (OTP)</tspan></tspan>
        <tspan x="44" dy="16">via phone, email, SMS, or WhatsApp. OTP emails are dispatched exclusively by <tspan font-family="monospace" font-weight="700">no-reply@ezy1.site</tspan> and expire in 5 minutes.</tspan>
      </text>
    </g>
  </g>

  <!-- ======================================================== -->
  <!-- 6. REPORTING SUSPICIOUS ACTIVITY                         -->
  <!-- ======================================================== -->
  <g transform="translate(60, 945)">
    <rect x="0" y="0" width="1120" height="92" rx="8" fill="#FEF2F2" stroke="#FEE2E2" stroke-width="1.5" />
    
    <g transform="translate(20, 20)">
      <!-- Alert Warning Icon -->
      <rect x="0" y="0" width="32" height="32" rx="8" fill="#DC2626" />
      <polygon points="16,8 24,24 8,24" fill="#FFFFFF" />
      <text x="16" y="22" text-anchor="middle" class="font-sans" font-weight="900" font-size="11" fill="#DC2626">!</text>

      <text x="44" y="14" class="font-sans" font-weight="800" font-size="12.5" fill="#991B1B">
        ⚠️ REPORTING SUSPICIOUS ACTIVITY &amp; FRAUDULENT SOLICITATIONS
      </text>
      <text x="44" y="32" class="font-sans" font-size="11" fill="#7F1D1D" line-height="1.4">
        <tspan x="44" dy="0">If you receive an unauthenticated email claiming to represent EZY1 from another domain, or requesting financial credentials:</tspan>
        <tspan x="44" dy="16">• <tspan font-weight="700">Do not click embedded links or download attachments.</tspan></tspan>
        <tspan x="44" dy="16">• Forward the raw email directly to: <tspan font-family="monospace" font-weight="800">support@ezy1.site</tspan> with subject line: <tspan font-weight="800">[FRAUD REPORT] Suspicious Email Alert</tspan>.</tspan>
      </text>
    </g>
  </g>

  <!-- ======================================================== -->
  <!-- 7. OFFICIAL CORPORATE FOOTER & SIGN-OFF                  -->
  <!-- ======================================================== -->
  <g transform="translate(60, 1590)">
    <line x1="0" y1="0" x2="1120" y2="0" stroke="#CBD5E1" stroke-width="1.5" />
    
    <g transform="translate(0, 16)">
      <!-- Left side: Company Details -->
      <text x="0" y="14" class="font-sans" font-weight="800" font-size="12" fill="#0F172A" letter-spacing="0.2">
        EZY1 PLATFORM TECHNOLOGIES PRIVATE LIMITED
      </text>
      <text x="0" y="30" class="font-sans" font-size="10.5" fill="#475569">
        Everything You Need, One Platform • Local Super App for Everything
      </text>
      <text x="0" y="46" class="font-sans" font-size="10.5" fill="#64748B">
        Official Website: <tspan font-weight="700" fill="#FF5100">https://ezy1.site</tspan>  •  Verified Support: <tspan font-weight="700" fill="#FF5100">support@ezy1.site</tspan>  •  Grievances: <tspan font-weight="700">compliance@ezy1.site</tspan>
      </text>

      <!-- Right side: Authentication Badge & Stamp -->
      <g transform="translate(860, 2)">
        <rect x="0" y="0" width="260" height="46" rx="6" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1" />
        <circle cx="24" cy="23" r="10" fill="#059669" />
        <polyline points="19,23 23,27 29,19" fill="none" stroke="#FFFFFF" stroke-width="2" />
        <text x="42" y="19" class="font-sans" font-weight="800" font-size="10" fill="#0F172A">Official Communication</text>
        <text x="42" y="33" class="font-sans" font-weight="600" font-size="9" fill="#059669">Security Advisory • Verified A4</text>
      </g>
    </g>
  </g>
</svg>
`;

async function generate() {
  console.log('Rendering 1-page A4 document SVG via Sharp...');
  const svgBuffer = Buffer.from(svg);
  
  // Render to JPEG 95% quality, 1240x1754
  const targetPath1 = 'EZY1_Official_Communication_Security_Notice_2026.jpeg';
  const targetPath2 = 'src/frontend/public/EZY1_Official_Communication_Security_Notice_2026.jpeg';
  const targetPath3 = 'src/frontend/public/ezy1-official-notice.jpg';

  await sharp(svgBuffer)
    .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
    .toFile(targetPath1);
  console.log('Created:', targetPath1, fs.statSync(targetPath1).size, 'bytes');

  fs.copyFileSync(targetPath1, targetPath2);
  console.log('Copied to:', targetPath2);

  fs.copyFileSync(targetPath1, targetPath3);
  console.log('Updated:', targetPath3);
}

generate().catch(console.error);
