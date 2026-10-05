// Builds the printable and Markdown versions of Roland's home OT manual from the
// single source of truth: the DATA block inside app/index.html.
//
//   node tools/build.mjs
//
// Writes MANUAL.md, SHOPPING_LIST.md, print/Roland-Home-OT-Manual.pdf and
// print/Roland-Log-Sheets.pdf. PDF rendering needs Playwright + Chromium.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(ROOT, "app/index.html"), "utf8");
const m = html.match(/\/\*DATA-START\*\/([\s\S]*?)\/\*DATA-END\*\//);
if (!m) throw new Error("DATA block not found in app/index.html");
const DATA = new Function(`${m[1]}; return DATA;`)();
const ACT = Object.fromEntries(DATA.activities.map((a) => [a.id, a]));
const G = DATA.goals;
const R = (n) => "R" + n.toLocaleString("en-ZA").replace(/[ ,]/g, " ");
const sum = (arr) => arr.reduce((a, i) => a + i.price, 0);
const kit = (g) => DATA.kit.filter((i) => i.grp === g);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------------------------------------------------------------- Markdown
function manualMd() {
  const L = [];
  L.push("# Roland's Home OT Manual", "");
  L.push(`For Chrystal, from Roland's parents. Term 4 home programme, ${DATA.programme.weeks} weeks from Monday 5 October 2026.`);
  L.push(`Based on Simóne Vorster's OT progress report (4 October 2026) and current paediatric OT guidance. See [RESEARCH.md](RESEARCH.md) for the evidence and [SHOPPING_LIST.md](SHOPPING_LIST.md) for the kit.`, "");
  L.push("> The interactive version (daily plan, timer, session log and progress charts) is `app/index.html`. This file is the printable reference.", "");
  L.push("## 1. Roland", "");
  L.push("Roland turns 5 on 8 October 2026. He is healthy, bright and **left-handed**. He had 13 OT sessions between May and September 2026 and improved in every area. Therapy is paused for term 4; the OT recommends ongoing support at home.", "");
  L.push("| Area (OT rating 1–5) | May | Sept |", "|---|---|---|");
  DATA.otRatings.forEach((r) => L.push(`| ${r.area} | ${r.may} | ${r.sep} |`));
  L.push("", "1 = definite difficulty · 3 = still needs support and practice · 4 = nearly there, quality or speed still affected · 5 = optimal.", "");
  L.push("## 2. Goals and where he is now", "");
  DATA.otGoals.forEach((x) => L.push(`- **${G[x.g].name}: ${x.goal}**  `, `  Now: ${x.now}`));
  L.push("", "Eyes-closed balance is much harder than eyes-open at 5, so 10 s eyes closed is a stretch goal. Typical egg hold at 5 is about 27 s.", "");
  L.push("## 3. How a session works", "");
  L.push(`About **${DATA.programme.minutes} minutes, ${DATA.programme.sessionsPerWeek} days a week**. Most of the time goes on the real skills; finger games are a short warm-up.`, "");
  L.push("| Block | Minutes | What |", "|---|---|---|");
  DATA.session.forEach((b) => L.push(`| ${b.label} | ${b.min} | ${b.note} |`));
  L.push("", "### Phases", "");
  DATA.phases.forEach((p) => L.push(`- **Weeks ${p.from}–${p.to}: ${p.name}.** ${p.tip}`));
  L.push("", `Check-ins (about 10 minutes, replace the Body block): Friday of weeks ${DATA.programme.checkinWeeks.join(", ")}.`, "");
  L.push("### Golden rules", "");
  DATA.rules.forEach((r) => L.push(`- **${r.t}.** ${r.d}`));
  L.push("", "## 4. Weekly plan", "");
  L.push("First activity in each cell is the default; the others are swaps.", "");
  L.push("| Day | Theme | Warm-up | Body | Hands | Table |", "|---|---|---|---|---|---|");
  DATA.plan.forEach((p) => L.push(`| ${p.day} | ${p.theme} | ${["warm", "body", "hands", "table"].map((k) => p.blocks[k].map((id) => ACT[id].name).join(" / ")).join(" | ")} |`));
  L.push("", "**Weekend:** family play, no formal session.", "");
  DATA.weekend.forEach((x) => L.push(`- ${x}`));
  L.push("", "**Everyday sneak-ins:**", "");
  DATA.sneakIns.forEach((x) => L.push(`- ${x}`));
  L.push("", "## 5. Table set-up for a left-hander", "");
  L.push("1. **Paper** on his left side, turned clockwise about 30–45°: the top of the page leans right and the left corner is higher. The bottom-right corner sits near the middle of his body. The side of the page lines up with his left forearm.");
  L.push("2. **Left forearm** along the page, wrist straight and **below** the line (not hooked). Pencil held 2–3 cm from the tip.");
  L.push("3. **Helper hand** (right) holds the page and slides it up.");
  L.push("4. **Light** from his right.");
  L.push("5. **Chair:** feet flat (step stool), hips/knees/ankles at right angles, table about 5 cm above his bent elbow. Slant board helps.");
  L.push("6. **You:** facing him to show a grip or scissors (mirror); on his right when drawing together. At shared tables he sits at the left end.");
  L.push("7. **Scissors:** true left-handed (blades reversed). Left-handers cut circles clockwise.", "");
  L.push("> **Check with the OT:** the report says \"rotate the page 45 degrees to the left\". In standard wording a tilt \"to the left\" (anticlockwise) is the right-hander's position. She most likely meant the page on his left with the left corner raised, as above. Send Simóne a photo to confirm.", "");
  L.push("## 6. Pencil grip", "");
  L.push("- **Now:** thumb wraps round the crayon, web space closed. **Goal:** three- (or four-) finger pinch with a round open \"O\" between thumb and pointer finger.");
  L.push("- A still tripod or quadrupod is normal at 4–6; the moving tripod comes at about 6–7. Four-finger grips work as well as the tripod. The tight thumb-wrap is the one to change (more pressure, faster fatigue).");
  L.push("- Tricks: broken crayons under 3 cm; short, golf or triangular pencils; a pompom tucked under the ring and little fingers; a sticker where the pointer finger goes; the OT's elastic-loop trick (photo `app/img/grip-elastic.jpg`); upright surfaces; finger warm-up first.");
  L.push("- **Set it at the start** (\"pinch the tip and flip\"), don't interrupt mid-drawing, check at natural pauses, use one word or a silent signal, praise self-correction.", "");
  L.push("## 7. Cue words", "");
  DATA.cues.forEach((c) => L.push(`- **"${c.say}"**: ${c.when}`));
  L.push("", "## 8. Scissor ladder", "", "He is between steps 3 and 4.", "", "| Step | Examples | Typical age |", "|---|---|---|");
  DATA.scissorLadder.forEach((s) => L.push(`| ${s.lvl} | ${s.ex} | ${s.age} |`));
  L.push("", "## 9. Shape copying by age", "", "Copy, don't trace. Next targets: square, diagonals, X, triangle.", "", "| Shape | Typical age |", "|---|---|");
  DATA.shapeAges.forEach((r) => L.push(`| ${r.s.replace("|", "\\|")} | ${r.age} |`));
  L.push("", "## 10. Activities", "");
  for (const g of Object.keys(G)) {
    L.push(`### ${G[g].name}: ${G[g].sub.toLowerCase()}`, "");
    DATA.activities.filter((a) => a.g === g).forEach((a) => {
      L.push(`#### ${a.name}`, "");
      L.push(`*${a.why}*`, "");
      if (a.img) L.push(`![${a.cap || a.name}](app/${a.img})`, "");
      a.steps.forEach((s, i) => L.push(`${i + 1}. ${s}`));
      L.push("", `- **Say:** "${a.say}"`, `- **Easier:** ${a.easier}`, `- **Harder:** ${a.harder}`, `- **How much:** ${a.dose}`, `- **You need:** ${a.kit}`, "");
    });
  }
  L.push("## 11. When to stop", "", "**Tired signs:**", "");
  DATA.tiredSigns.forEach((x) => L.push(`- ${x}`));
  L.push("", "Switch to a movement break, then finish with something easy he enjoys. Never push through tears.", "", "**Safety:** balance work barefoot, clear floor, next to a sofa, your hands hovering at his hips; stay within reach on the gym ball; wheelbarrow held at thighs or knees; count out loud during holds so he keeps breathing.", "");
  L.push("**Tell Roland's parents (they'll check with the OT):**", "");
  DATA.callOT.forEach((x) => L.push(`- ${x}`));
  L.push("", "## 12. Logging and progress", "");
  L.push("- After every session: date, minutes, activities, mood, focus, grip reminders, hand swapping, what went well, what was hard. Use the Log tab in the app (or the paper sheet in `print/Roland-Log-Sheets.pdf`), and send it on WhatsApp.");
  L.push(`- Check-in on Friday of weeks ${DATA.programme.checkinWeeks.join(", ")}: balance (each leg, eyes open and closed, best of 3), egg and superman holds, minutes sitting upright, minutes colouring, hand swaps in 5 minutes of colouring, six skill ratings (${DATA.ratingScale.join(" / ")}), and which shapes he copies.`);
  L.push("- Week 5: send the check-in to Simóne for a quick review. Week 9: send the final check-in and ask about restarting therapy before Grade R.", "");
  return L.join("\n");
}

function shoppingMd() {
  const L = ["# Shopping list: Roland's home OT kit", ""];
  L.push("Prices are rough estimates from Takealot and South African shops, researched on 5 October 2026. They will change.", "");
  const table = (arr) => {
    L.push("| ✓ | Item | Why | Where (approx. price) | Est. |", "|---|---|---|---|---:|");
    arr.forEach((i) => L.push(`| ☐ | **${i.name}** | ${i.why} | ${i.where} | ${R(i.price)} |`));
    L.push("");
  };
  L.push(`## Must-haves (about ${R(sum(kit("must")))})`, "", "Enough for every activity on the weekly plan.", ""); table(kit("must"));
  L.push(`## Nice-to-haves (about ${R(sum(kit("nice")))})`, "", "Bring the clinic's gross-motor games home. Buy over time.", ""); table(kit("nice"));
  L.push("## Check with Simóne first", ""); table(kit("ask"));
  L.push("## Already in the house", "");
  DATA.freeKit.forEach((x) => L.push(`- ${x}`));
  L.push("", "## Where to shop", "");
  DATA.suppliers.forEach((s) => L.push(`- [${s.name}](${s.url}): ${s.note}`));
  L.push("", "**Left-handed scissors:** check the blades are reversed (the top blade is on the left when he holds them). \"Ambidextrous\" scissors usually have right-handed blades.", "");
  return L.join("\n");
}

fs.writeFileSync(path.join(ROOT, "MANUAL.md"), manualMd());
fs.writeFileSync(path.join(ROOT, "SHOPPING_LIST.md"), shoppingMd());
console.log("wrote MANUAL.md, SHOPPING_LIST.md");

// ---------------------------------------------------------------- Print (PDF)
const PRINT_CSS = `
@page { size: A4; margin: 14mm 13mm 16mm; }
* { box-sizing: border-box; }
body { font: 10.5pt/1.42 "DejaVu Sans", "Helvetica Neue", Arial, sans-serif; color: #16203a; margin: 0; }
h1 { font-size: 24pt; margin: 0 0 4pt; letter-spacing: -.01em; }
h2 { font-size: 15pt; margin: 16pt 0 6pt; padding-bottom: 3pt; border-bottom: 1.5pt solid #16203a; break-after: avoid; }
h3 { font-size: 11.5pt; margin: 10pt 0 4pt; break-after: avoid; }
p { margin: 0 0 5pt; } ul, ol { margin: 0 0 6pt; padding-left: 15pt; } li { margin: 0 0 2pt; }
table { border-collapse: collapse; width: 100%; margin: 4pt 0 8pt; font-size: 9.5pt; }
th, td { border: .6pt solid #b9c2d4; padding: 4pt 5pt; text-align: left; vertical-align: top; }
th { background: #e7ecf4; font-size: 8.5pt; text-transform: uppercase; letter-spacing: .04em; }
.muted { color: #55607a; } .small { font-size: 9pt; }
.box { border: 1pt solid #b9c2d4; border-radius: 6pt; padding: 7pt 9pt; margin: 6pt 0; break-inside: avoid; }
.warn { background: #f7efd9; border-color: #e0c27a; }
.tab { display: inline-block; color: #fff; font-size: 7.5pt; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 2pt 6pt; border-radius: 3pt; }
.g-body { background: #c43c35; } .g-balance { background: #187f86; } .g-twohands { background: #5d7c1c; } .g-hands { background: #b55e08; } .g-scissors { background: #e0ab10; color: #231a00; } .g-pencil { background: #5e4bc0; }
.acts { columns: 2; column-gap: 10pt; }
.act { break-inside: avoid; border: .8pt solid #b9c2d4; border-radius: 6pt; padding: 6pt 8pt; margin: 0 0 8pt; }
.act h4 { margin: 3pt 0 2pt; font-size: 10.5pt; }
.act img { width: 100%; height: 34mm; object-fit: cover; border-radius: 4pt; margin: 3pt 0; }
.act ol { padding-left: 13pt; margin: 2pt 0 3pt; } .act p, .act li { font-size: 9pt; }
.say { font-weight: 700; background: #e7ecf4; border-radius: 4pt; padding: 2pt 5pt; display: inline-block; margin: 2pt 0; }
.kv { font-size: 8.6pt; } .kv b { font-weight: 700; }
.pagebreak { break-before: page; }
.check { display: inline-block; width: 9pt; height: 9pt; border: .8pt solid #16203a; border-radius: 2pt; vertical-align: -1pt; }
.write { border-bottom: .6pt solid #8f9ab0; height: 15pt; }
.cover { display: grid; grid-template-columns: 1fr 52mm; gap: 10pt; align-items: start; }
.cover img { width: 100%; border-radius: 6pt; }
`;

function manualHtml() {
  const tab = (g) => `<span class="tab g-${g}">${esc(G[g].name)}</span>`;
  let h = `<!doctype html><html><head><meta charset="utf-8"><title>Roland's Home OT Manual</title><style>${PRINT_CSS}</style></head><body>`;
  h += `<div class="cover"><div><h1>Roland's Home OT Manual</h1>
    <p class="muted">For Chrystal · Term 4 home programme · ${DATA.programme.weeks} weeks from Monday 5 October 2026<br>Based on Simóne Vorster's OT progress report (4 October 2026) and current paediatric OT guidance.</p>
    <p>Roland turns 5 on 8 October. He is healthy, bright and <b>left-handed</b>. After 13 OT sessions he improved in every area. Therapy is paused for term 4, and the OT recommends support at home. That is this programme: about <b>${DATA.programme.minutes} minutes, ${DATA.programme.sessionsPerWeek} days a week</b>, movement first, short and successful table work, and a quick log after each session.</p>
    <table><tr><th>Area (OT 1–5)</th><th>May</th><th>Sept</th></tr>${DATA.otRatings.map((r) => `<tr><td>${esc(r.area)}</td><td>${r.may}</td><td>${r.sep}</td></tr>`).join("")}</table></div>
    <img src="${pathToFileURL(path.join(ROOT, "app/img/cutting-starfish.jpg"))}" alt=""></div>`;
  h += `<h2>Goals and where he is now</h2><table><tr><th>Area</th><th>Goal</th><th>Now (Sept 2026)</th></tr>${DATA.otGoals.map((x) => `<tr><td>${tab(x.g)}</td><td>${esc(x.goal)}</td><td>${esc(x.now)}</td></tr>`).join("")}</table>
    <p class="small muted">Typical at 5: about 10 s on one leg eyes open and about 27 s egg hold. Eyes-closed balance is much harder, so 10 s eyes closed is a stretch goal.</p>`;
  h += `<h2>How a session works</h2><table><tr>${DATA.session.map((b) => `<th>${esc(b.label)} · ${b.min} min</th>`).join("")}</tr><tr>${DATA.session.map((b) => `<td>${esc(b.note)}</td>`).join("")}</tr></table>
    <ul>${DATA.phases.map((p) => `<li><b>Weeks ${p.from}–${p.to}: ${esc(p.name)}.</b> ${esc(p.tip)}</li>`).join("")}<li><b>Check-ins</b> (10 min, instead of the Body block): Friday of weeks ${DATA.programme.checkinWeeks.join(", ")}.</li></ul>
    <h3>Golden rules</h3><ul>${DATA.rules.map((r) => `<li><b>${esc(r.t)}.</b> ${esc(r.d)}</li>`).join("")}</ul>`;
  h += `<h2 class="pagebreak">Weekly plan</h2><p class="small muted">The first activity in each cell is the default; the others are swaps. Full instructions are in the activity cards.</p>
    <table><tr><th>Day</th><th>Warm-up · 2</th><th>Body · 6</th><th>Hands · 3</th><th>Table · 8</th></tr>${DATA.plan.map((p) => `<tr><td><b>${esc(p.day)}</b><br><span class="small muted">${esc(p.theme)}</span></td>${["warm", "body", "hands", "table"].map((k) => `<td>${p.blocks[k].map((id, i) => i ? `<span class="small muted">${esc(ACT[id].name)}</span>` : `<b>${esc(ACT[id].name)}</b>`).join("<br>")}</td>`).join("")}</tr>`).join("")}</table>
    <div class="box"><b>Weekend:</b> family play. ${DATA.weekend.map(esc).join(" ")}</div>
    <h3>Everyday sneak-ins</h3><ul>${DATA.sneakIns.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  h += `<h2>Table set-up for a left-hander</h2><ol>
    <li><b>Paper</b> on his left, turned clockwise 30–45°: top of the page leans right, left corner higher, bottom-right corner near his middle. The side of the page lines up with his left forearm. Mark the angle with tape.</li>
    <li><b>Left forearm</b> along the page, wrist straight and <b>below</b> the line (not hooked). Pencil held 2–3 cm from the tip.</li>
    <li><b>Helper hand</b> (right) holds the page and slides it up. <b>Light</b> from his right.</li>
    <li><b>Chair:</b> feet flat (step stool), hips/knees/ankles at right angles, table about 5 cm above his bent elbow. A slant board helps.</li>
    <li><b>You:</b> facing him to show a grip or scissors (mirror); on his right when drawing together. At shared tables he sits at the left end.</li>
    <li><b>Scissors:</b> true left-handed (blades reversed). Left-handers cut circles clockwise.</li></ol>
    <div class="box warn"><b>Check with the OT:</b> the report says "rotate the page 45 degrees to the left". In standard wording that is the right-hander's tilt. She most likely meant the page on his left with the left corner raised, as above. Send Simóne a photo to confirm.</div>
    <h2>Pencil grip</h2><div class="cover" style="grid-template-columns:1fr 42mm"><div><p><b>Now:</b> thumb wraps round the crayon, web space closed. <b>Goal:</b> a three- or four-finger pinch with a round open "O" between thumb and pointer finger. A still grip is normal at 4–6; the moving tripod comes at about 6–7. The tight thumb-wrap is the one to change.</p>
    <ul><li>Broken crayons under 3 cm; short, golf or triangular pencils.</li><li>Pompom under the ring and little fingers; a sticker where the pointer goes; the OT's elastic loop (photo).</li><li>Upright surfaces; finger warm-up first.</li><li><b>Set the grip at the start</b>, don't interrupt mid-drawing, check at natural pauses, one word or a silent "O" signal, praise self-correction.</li></ul></div>
    <img src="${pathToFileURL(path.join(ROOT, "app/img/grip-elastic.jpg"))}" alt=""></div>
    <h2>Cue words</h2><table>${DATA.cues.map((c) => `<tr><td style="width:42%"><b>"${esc(c.say)}"</b></td><td>${esc(c.when)}</td></tr>`).join("")}</table>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10pt"><div><h3>Scissor ladder (he is at step 3–4)</h3><table><tr><th>Step</th><th>Examples</th><th>Age</th></tr>${DATA.scissorLadder.map((s) => `<tr><td>${esc(s.lvl)}</td><td>${esc(s.ex)}</td><td>${esc(s.age)}</td></tr>`).join("")}</table></div>
    <div><h3>Shape copying by age (copy, don't trace)</h3><table><tr><th>Shape</th><th>Age</th></tr>${DATA.shapeAges.map((r) => `<tr><td>${esc(r.s)}</td><td>${esc(r.age)}</td></tr>`).join("")}</table></div></div>`;
  h += `<h2 class="pagebreak">Activity cards</h2>`;
  for (const g of Object.keys(G)) {
    h += `<h3>${tab(g)} &nbsp;${esc(G[g].sub)}</h3><div class="acts">`;
    DATA.activities.filter((a) => a.g === g).forEach((a) => {
      h += `<div class="act"><h4>${esc(a.name)}</h4><p class="muted">${esc(a.why)}</p>${a.img ? `<img src="${pathToFileURL(path.join(ROOT, "app", a.img))}" alt="">` : ""}
        <ol>${a.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol><span class="say">Say: "${esc(a.say)}"</span>
        <p class="kv"><b>Easier:</b> ${esc(a.easier)}<br><b>Harder:</b> ${esc(a.harder)}<br><b>How much:</b> ${esc(a.dose)}<br><b>You need:</b> ${esc(a.kit)}</p></div>`;
    });
    h += `</div>`;
  }
  h += `<h2 class="pagebreak">When to stop</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:10pt"><div><h3>Tired signs</h3><ul>${DATA.tiredSigns.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><p>Switch to a movement break, then finish with something easy. Never push through tears.</p></div>
    <div><h3>Safety</h3><ul><li>Balance work barefoot, clear floor, next to a sofa, your hands hovering at his hips.</li><li>Stay within reach on the gym ball.</li><li>Wheelbarrow held at thighs or knees.</li><li>Count out loud during holds so he keeps breathing.</li></ul></div></div>
    <h3>Tell Roland's parents (they'll check with the OT)</h3><ul>${DATA.callOT.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  h += `<h2>Shopping list</h2><p class="small muted">Approximate prices, researched 5 October 2026.</p>`;
  for (const [g, title] of [["must", `Must-haves (about ${R(sum(kit("must")))})`], ["nice", `Nice-to-haves (about ${R(sum(kit("nice")))})`], ["ask", "Check with Simóne first"]]) {
    h += `<h3>${title}</h3><table><tr><th></th><th>Item</th><th>Where</th><th>Est.</th></tr>${kit(g).map((i) => `<tr><td><span class="check"></span></td><td><b>${esc(i.name)}</b><br><span class="small muted">${esc(i.why)}</span></td><td class="small">${esc(i.where)}</td><td>${R(i.price)}</td></tr>`).join("")}</table>`;
  }
  h += `<p class="small"><b>Already in the house:</b> ${DATA.freeKit.map(esc).join(" · ")}</p></body></html>`;
  return h;
}

function logHtml() {
  let h = `<!doctype html><html><head><meta charset="utf-8"><title>Roland log sheets</title><style>${PRINT_CSS} td { height: 20pt; }</style></head><body>`;
  h += `<h1>Roland: weekly session log</h1><p class="muted">Week ____ · dates ____________________ · Print one per week. Mood and focus: 1 (low) to 5 (great).</p>
    <table><tr><th style="width:12%">Day</th><th style="width:8%">Min</th><th>What we did</th><th style="width:8%">Mood</th><th style="width:8%">Focus</th><th style="width:10%">Grip reminders<br>0 / few / lots</th><th style="width:10%">Swapped hands?</th></tr>
    ${["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => `<tr><td><b>${d}</b></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`).join("")}</table>
    <h3>What went well</h3>${"<div class='write'></div>".repeat(4)}<h3>What was hard</h3>${"<div class='write'></div>".repeat(4)}
    <h2 class="pagebreak">Fortnightly check-in</h2><p class="muted">Friday of weeks ${DATA.programme.checkinWeeks.join(", ")} · Date ____________ · Week ____ · Best of 3 for timed items.</p>
    <table><tr><th>Measure</th><th>Result</th><th>Reference</th></tr>
    <tr><td>Balance, right leg, eyes open</td><td>______ s</td><td class="small muted">Sept OT: 8 s</td></tr>
    <tr><td>Balance, left leg, eyes open</td><td>______ s</td><td class="small muted">Sept OT: 6 s</td></tr>
    <tr><td>Balance, right leg, eyes closed</td><td>______ s</td><td class="small muted">Goal 10 s (May: 3 s)</td></tr>
    <tr><td>Balance, left leg, eyes closed</td><td>______ s</td><td class="small muted">Goal 10 s (May: 3 s)</td></tr>
    <tr><td>Egg hold</td><td>______ s</td><td class="small muted">Sept OT: 10 s · goal 15 s</td></tr>
    <tr><td>Superman hold</td><td>______ s</td><td></td></tr>
    <tr><td>Sits upright at the table</td><td>______ min</td><td class="small muted">Goal 15–20 min</td></tr>
    <tr><td>Colours a small picture</td><td>______ min</td><td></td></tr>
    <tr><td>Hand swaps in 5 min of colouring</td><td>______ ×</td><td class="small muted">Sept: about 1 in 5 times</td></tr></table>
    <table><tr><th>Skill</th>${DATA.ratingScale.map((s) => `<th>${esc(s)}</th>`).join("")}</tr>${DATA.ratings.map((r) => `<tr><td>${esc(r.label)}</td>${DATA.ratingScale.map(() => `<td><span class="check"></span></td>`).join("")}</tr>`).join("")}</table>
    <p><b>Shapes copied</b> (you draw, he copies next to it): ${DATA.shapes.map((s) => `<span class="check"></span> ${esc(s.label)}`).join(" &nbsp; ")}</p>
    <h3>Notes</h3>${"<div class='write'></div>".repeat(5)}</body></html>`;
  return h;
}

const outDir = path.join(ROOT, "print");
fs.mkdirSync(outDir, { recursive: true });
let chromium;
try {
  const require = createRequire(path.join(process.execPath, "../../lib/node_modules/"));
  ({ chromium } = require("playwright"));
} catch {
  console.log("Playwright not found: skipped PDFs"); process.exit(0);
}
const exe = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find((p) => fs.existsSync(p));
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
for (const [name, content] of [["Roland-Home-OT-Manual", manualHtml()], ["Roland-Log-Sheets", logHtml()]]) {
  const tmp = path.join(outDir, `.${name}.html`);
  fs.writeFileSync(tmp, content);
  const page = await browser.newPage();
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
  await page.pdf({ path: path.join(outDir, `${name}.pdf`), format: "A4", printBackground: true,
    displayHeaderFooter: true, headerTemplate: "<span></span>",
    footerTemplate: `<div style="font:8px Arial;color:#777;width:100%;text-align:center">Roland's Home OT · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`,
    margin: { top: "14mm", bottom: "16mm", left: "13mm", right: "13mm" } });
  await page.close(); fs.unlinkSync(tmp);
  console.log(`wrote print/${name}.pdf`);
}
await browser.close();
