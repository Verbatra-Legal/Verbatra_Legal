/* ============================================================
   Verbatra — Shared Certificate Generator
   Used by ALL course quiz pages. Edit design HERE only.
   
   Usage in any course page:
     <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
     <script src="/verbatra-certificate.js"></script>
     ...
     generateCertificatePDF(studentName, courseTitle, certId, onDoneCallback);
   ============================================================ */

function generateCertificatePDF(name, courseTitle, certId, onDone){
  if(typeof window.jspdf === 'undefined'){
    alert('Certificate generator is still loading. Please wait a moment and try again.');
    return;
  }
  const jsPDF = window.jspdf.jsPDF;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
  const W = 297, H = 210;
  
  // Brand colors
  const GREEN = [31, 61, 48];
  const CREAM = [244, 239, 228];
  const GOLD = [168, 132, 63];
  const OXBLOOD = [122, 46, 38];
  const INK = [35, 33, 28];
  const INK_SOFT = [110, 105, 95];
  
  // --- Helper: arc text, fixed degrees-per-char ---
  function vbArc(text, ccx, ccy, rad, centerDeg, degPerChar, fontSize, color, flip){
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fontSize);
    doc.setTextColor.apply(doc, color);
    const n = text.length, total = (n-1)*degPerChar;
    for(let i = 0; i < n; i++){
      const aDeg = flip ? (centerDeg + total/2 - i*degPerChar) : (centerDeg - total/2 + i*degPerChar);
      const ang = aDeg * Math.PI/180;
      const lx = ccx + rad*Math.cos(ang), ly = ccy + rad*Math.sin(ang);
      doc.text(text[i], lx, ly, { align:'center', baseline:'middle', angle: -(aDeg + (flip?-90:90)) });
    }
  }
  const sigData = "data:image/png;base64,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";
  
  // --- Helper: centered text WITH letter-spacing (jsPDF center+charSpace is buggy) ---
  function vbCenterText(txt, centerX, y, fontSize, charSpace){
    doc.setFontSize(fontSize);
    const baseW = doc.getTextWidth(txt);
    const renderedW = baseW + (txt.length - 1) * charSpace;
    doc.text(txt, centerX - renderedW/2, y, { align: 'left', charSpace: charSpace });
  }
  
  // ===== Page geometry & equal margins =====
  const M = 0;                       // border at page edge — no outside white margin
  const cx = W / 2;                  // horizontal center = 148.5
  
  // Background cream
  doc.setFillColor.apply(doc, CREAM);
  doc.rect(0, 0, W, H, 'F');
  
  // Double border. Outer line is INSET by half its width so it sits fully inside the page
  // (otherwise half the stroke would fall outside the page and be clipped).
  doc.setDrawColor.apply(doc, GREEN);
  doc.setLineWidth(0.8);
  const outerInset = 0.4;
  doc.rect(M + outerInset, M + outerInset, W - 2*M - 2*outerInset, H - 2*M - 2*outerInset);  // outer
  doc.setLineWidth(0.3);
  doc.rect(M + 2.5, M + 2.5, W - 2*M - 5, H - 2*M - 5);   // inner
  
  // Top stripe (sits on the outer border, symmetric L/R)
  doc.setFillColor.apply(doc, GREEN);
  doc.rect(M, M, W - 2*M, 5, 'F');
  
  // ---------- HEADER ----------
  doc.setFont('helvetica', 'bold');
  doc.setTextColor.apply(doc, GREEN);
  doc.setFontSize(12);
  // Compute total assembly width = wordmark + gap + dot, then center it on cx
  const wmRenderedW = doc.getTextWidth('VERBATRA') + ('VERBATRA'.length - 1) * 0.5;
  const wmDotGap = 3.5;        // center-to-center distance from wordmark right edge to dot
  const wmDotRadius = 1.0;
  const wmAssemblyW = wmRenderedW + wmDotGap + wmDotRadius;
  const wmShift = (wmDotGap + wmDotRadius) / 2;  // how far LEFT to shift wordmark so assembly midpoint = cx
  vbCenterText('VERBATRA', cx - wmShift, 27, 12, 0.5);
  doc.setFillColor.apply(doc, GOLD);
  doc.circle(cx - wmShift + wmRenderedW/2 + wmDotGap, 26, wmDotRadius, 'F');
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor.apply(doc, OXBLOOD);
  vbCenterText('CERTIFICATE OF COMPLETION', cx, 44, 8, 2);
  
  // ---------- RECIPIENT ----------
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor.apply(doc, INK_SOFT);
  doc.text('This is to certify that', cx, 63, { align: 'center' });
  
  // Name (auto-shrink for long names)
  let nameSize = 34;
  doc.setFont('times', 'normal');
  doc.setFontSize(nameSize);
  while(doc.getTextWidth(name) > (W - 90) && nameSize > 18){ nameSize -= 1; doc.setFontSize(nameSize); }
  doc.setTextColor.apply(doc, INK);
  doc.text(name, cx, 82, { align: 'center' });
  
  const nameW = doc.getTextWidth(name);
  const ulHalf = Math.min(nameW/2 + 6, 88);
  doc.setDrawColor.apply(doc, GOLD);
  doc.setLineWidth(0.4);
  doc.line(cx - ulHalf, 87.5, cx + ulHalf, 87.5);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor.apply(doc, INK_SOFT);
  doc.text('has successfully completed the Verbatra course', cx, 99, { align: 'center' });
  
  // Course title (wraps if long)
  doc.setFont('times', 'italic');
  doc.setFontSize(22);
  doc.setTextColor.apply(doc, GREEN);
  const titleLines = doc.splitTextToSize(courseTitle, W - 70);
  let titleY = 114;
  titleLines.forEach(line => { doc.text(line, cx, titleY, { align: 'center' }); titleY += 9; });
  
  // Date
  const today = new Date();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dateStr = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear();
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor.apply(doc, INK_SOFT);
  doc.text('on ' + dateStr, cx, titleY + 4, { align: 'center' });
  
  // ========== BOTTOM ZONE — symmetric outer edges (LHS = RHS) ==========
  // Note: columns have DIFFERENT widths (signature rule wider than seal),
  // so we anchor on OUTER EDGES rather than column centers. The OUTER constant
  // is the distance from page center cx to the outermost edge of each column.
  const OUTER = 90;              // distance from cx to outer edge of each column
  const ruleHalf = 32;           // half-width of signature rule (defined here for use below)
  const sealR = 15;              // seal radius
  const LX = cx - (OUTER - ruleHalf);  // signature column center: cx - 58
  const RX = cx + (OUTER - sealR);      // seal column center:      cx + 75
  const colMid = 161;            // shared vertical midline for both columns
  
  // --- LEFT column: signature image + rule + name + title, vertically centered on colMid ---
  const sigH = 13;
  const sigW = sigH * 1.901;
  const ruleY = colMid + 2;                 // signature rule
  doc.addImage(sigData, 'PNG', LX - sigW/2, ruleY - sigH - 3, sigW, sigH);
  doc.setDrawColor.apply(doc, GREEN);
  doc.setLineWidth(0.3);
  doc.line(LX - ruleHalf, ruleY, LX + ruleHalf, ruleY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor.apply(doc, INK);
  doc.text('Arnav Bhardwaj', LX, ruleY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor.apply(doc, INK_SOFT);
  vbCenterText('Corporate Lawyer & Founder, Verbatra', LX, ruleY + 9, 7, 0.2);
  
  // --- RIGHT column: navy seal, vertically centered on colMid ---
  const NAVY = [28, 42, 74];
  const stampCx = RX, stampCy = colMid, R = sealR;
  doc.setDrawColor.apply(doc, NAVY);
  // Three concentric circles — outer heavy, mid hairline, inner hairline
  doc.setLineWidth(R*0.05); doc.circle(stampCx, stampCy, R, 'S');
  doc.setLineWidth(R*0.02); doc.circle(stampCx, stampCy, R*0.86, 'S');
  doc.setLineWidth(R*0.02); doc.circle(stampCx, stampCy, R*0.42, 'S');
  // Center monogram V — proportionate, not crowding the inner ring
  doc.setFont('times', 'normal');
  doc.setFontSize(R*1.15);
  doc.setTextColor.apply(doc, NAVY);
  doc.text('V', stampCx, stampCy, { align:'center', baseline:'middle' });
  // Gold dot — tightly after V, baseline-aligned (echoes wordmark "VERBATRA •")
  const vW = doc.getTextWidth('V');
  doc.setFillColor.apply(doc, GOLD);
  doc.circle(stampCx + vW/2 + R*0.08, stampCy - R*0.05, R*0.045, 'F');
  // Arc text — TIGHT spacing so VERBATRA spans only ~77deg at top, CERTIFIED ~88deg at bottom
  const textRad = R*0.66, afs = R*0.34, dpc = 11;
  vbArc('VERBATRA', stampCx, stampCy, textRad, -90, dpc, afs, NAVY, false);
  vbArc('CERTIFIED', stampCx, stampCy, textRad, 90, dpc, afs, NAVY, true);
  // Side ornaments — small navy diamonds at 9 and 3 o'clock, well clear of arc text termini
  // (no more tiny asterisks or specks)
  const ornR = R*0.04;
  function navyDiamond(x, y, s){
    doc.setFillColor.apply(doc, NAVY);
    doc.triangle(x-s, y, x, y-s, x+s, y, 'F');
    doc.triangle(x-s, y, x, y+s, x+s, y, 'F');
  }
  navyDiamond(stampCx - textRad, stampCy, ornR);
  navyDiamond(stampCx + textRad, stampCy, ornR);
  
  // ---------- CENTERED FOOTER (cert ID + URL), inside the border ----------
  // Both centered on page center, stacked, with equal margin from the bottom border.
  doc.setFont('helvetica', 'normal');
  doc.setTextColor.apply(doc, INK_SOFT);
  vbCenterText('Certificate ID:  ' + certId, cx, 182, 8, 0.3);
  doc.setTextColor.apply(doc, GOLD);
  vbCenterText('verbatra.com/course-verify.html?id=' + certId, cx, 187, 7.5, 0.2);
  
  // Save
  const filename = 'Verbatra_Certificate_' + name.replace(/\s+/g, '_') + '.pdf';
  doc.save(filename);
  if(onDone) onDone();
}
