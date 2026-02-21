#!/usr/bin/env node
/* ============================================
   OPTKAS — Institutional Summary PDF Generator
   Renders the web manual to a branded PDF using Puppeteer.
   Usage:  node scripts/build-pdf.js
   Output: releases/OPTKAS-Institutional-Manual-v<version>.pdf
   ============================================ */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');

const VERSION = pkg.version || '1.0';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'releases');
const OUTPUT_FILE = path.join(OUTPUT_DIR, `OPTKAS-Institutional-Manual-v${VERSION}.pdf`);
const HTML_FILE = path.resolve(__dirname, '..', 'public', 'index.html');

(async () => {
    console.log(`\n  OPTKAS Institutional PDF Generator`);
    console.log(`  Version: ${VERSION}`);
    console.log(`  Source:  ${HTML_FILE}`);
    console.log(`  Output:  ${OUTPUT_FILE}\n`);

    // Ensure releases directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log('  Created releases/ directory');
    }

    // Launch headless browser
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Load the manual
    await page.goto(`file://${HTML_FILE}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
    });

    // Inject print-friendly overrides
    await page.addStyleTag({
        content: `
            /* Print overrides */
            body { overflow: visible !important; height: auto !important; }
            #app { display: block !important; height: auto !important; }
            .sidebar { display: none !important; }
            .top-bar { display: none !important; }
            .tts-panel { display: none !important; }
            .training-toggle { display: none !important; }
            .training-progress { display: none !important; }
            .auto-scroll-indicator { display: none !important; }
            .audio-section-controls { display: none !important; }
            .content { overflow: visible !important; height: auto !important; padding: 20px !important; }
            .section { display: block !important; page-break-inside: avoid; margin-bottom: 40px; }
            .section-header { page-break-after: avoid; }
            @page {
                margin: 20mm 15mm;
                @bottom-center {
                    content: "OPTKAS Institutional Operating Manual — v${VERSION} — CONFIDENTIAL";
                    font-size: 8pt;
                    color: #666;
                }
            }
        `
    });

    // Wait for styles to apply
    await page.waitForTimeout(1000);

    // Generate PDF
    await page.pdf({
        path: OUTPUT_FILE,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: `
            <div style="width:100%; text-align:center; font-size:8pt; color:#999; padding:8px 0;">
                OPTKAS Sovereign Platform — Institutional Operating Manual
            </div>
        `,
        footerTemplate: `
            <div style="width:100%; display:flex; justify-content:space-between; font-size:8pt; color:#999; padding:8px 20px;">
                <span>CONFIDENTIAL — For Authorized Recipients Only</span>
                <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
            </div>
        `,
        margin: {
            top: '25mm',
            bottom: '20mm',
            left: '15mm',
            right: '15mm'
        }
    });

    await browser.close();

    const stats = fs.statSync(OUTPUT_FILE);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`  ✓ PDF generated successfully`);
    console.log(`  ✓ Size: ${sizeMB} MB`);
    console.log(`  ✓ Path: ${OUTPUT_FILE}\n`);
})();
