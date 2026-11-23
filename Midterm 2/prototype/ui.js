"use strict";

const byId = id => document.getElementById(id);
const count = value => value.toLocaleString("en-GB",{maximumFractionDigits:6});
const safe = value => String(value ?? "").replace(/[&<>"']/g, c =>
  ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const options = rows => rows.map(([value,label]) =>
  `<option value="${safe(value)}">${safe(label)}</option>`).join("");
const auditButtons = ["propose","approve","verify","tamper"];
let data;
let records;
let ledger;
let result;
const ledgers = new WeakMap();

function selectView(showAudit) {
  byId("audit").hidden = !showAudit;
  byId("traceView").hidden = showAudit;
  byId("viewAudit").setAttribute("aria-pressed",String(showAudit));
  byId("viewTrace").setAttribute("aria-pressed",String(!showAudit));
  if (showAudit && result?.lab && byId("auditRecord").value !== result.lab.id) {
    byId("auditRecord").value = result.lab.id;
    byId("ledgerStatus").textContent = "";
    updateLedger();
  }
}

function loadReports() {
  const available = data.labReports.filter(report => report.lot === byId("inputLot").value);
  byId("report").innerHTML = options([["",available.length ? "Choose lab report" : "No linked lab report"],
    ...available.map(row => [row.id,row.id])]);
  byId("report").value = "";
  byId("report").disabled = available.length === 0;
  byId("tracePrompt").textContent = available.length ?
    "Select the lab report to see which stock and shipments need review." :
    "There is no lab report linked to this lot.";
}

function loadNetwork(next) {
  data = validateNetwork(next);
  const sample = data === DATA.freshmeals;
  records = recordsForNetwork(data).filter(record => record.type === "Lab report");
  if (!ledgers.has(data)) ledgers.set(data,{pending:[], blocks:[]});
  ledger = ledgers.get(data);
  byId("networkName").textContent = data.name;
  byId("networkMeta").textContent = sample ? `· sample data · ${data.unit}` : `· imported data · ${data.unit}`;
  byId("workspaceStatus").textContent = sample ? "" : "Network loaded for this browser session.";
  byId("restoreNetwork").hidden = sample;
  const reportedLots = new Set(data.labReports.map(report => report.lot));
  const selectable = data.inputs.filter(lot => reportedLots.has(lot.id));
  byId("inputLot").innerHTML = options((selectable.length ? selectable : data.inputs).map(lot => [lot.id,
    `${lot.id} · ${agency(data,lot.organization).name}`]));
  byId("auditRecord").innerHTML = options(records.map(record => [record.id,record.id]));
  byId("auditRecordField").hidden = records.length < 2;
  byId("ledgerStatus").textContent = "";
  updateLedger();
  loadReports();
  render();
  selectView(false);
}

function render() {
  const report = byId("report").value;
  const hasReport = Boolean(report);
  byId("findings").hidden = !hasReport;
  byId("tracePrompt").hidden = hasReport;
  result = hasReport ? trace(data,{input:byId("inputLot").value,report}) : undefined;
  if (!result) return;
  const {origin,lab}=result;
  byId("decision").classList.toggle("neutral",result.validLab && !result.mismatch);
  byId("decision").innerHTML = `<strong>${result.status}</strong><p>${result.action}</p>`;
  const totals = [[result.affected,"Affected total"],[result.onHold,"On-site hold"],
    [result.affected-result.onHold,"Affected shipped"]];
  if (result.unresolvedQuantity) totals.push([result.unresolvedQuantity,"Unresolved"]);
  byId("stats").innerHTML = totals.map(([value,label]) =>
    `<div><strong>${count(value)}</strong><span>${label} · ${safe(data.unit)}</span></div>`).join("");
  const evidence = [["Lab",agency(data,lab.organization).name],["Report",lab.id],
    ["Declared species",origin.declaredSpecies],["Reported species",lab.species],
    ["Sample link",`${lab.sample} · ${result.validLab ? "matched" : "unverified"}`]];
  byId("evidence").innerHTML = evidence.map(([label,value]) => `<dt>${label}</dt><dd>${safe(value)}</dd>`).join("");
  const committed = ledger.blocks.some(block => block.record.id === lab?.id);
  byId("evidenceHint").textContent = committed ? "Lab report committed in the local audit simulation." :
    "Scope preview uses the supplied records. Verify lab authenticity and custody before acting.";
  byId("lots").innerHTML = result.rows.filter(row => row.state !== "Outside recorded lineage").map(row => `<tr><th scope="row">${safe(row.id)}</th>
    <td class="scope ${row.state === "Unresolved" ? "unresolved" : ""}">${row.state}</td>
    <td class="num">${count(row.quantity)}</td><td class="num">${count(row.onsite)}</td>
    <td class="num">${count(row.shipped)}</td></tr>`).join("");
  byId("paths").innerHTML = result.events.filter(event => result.linked.has(event.output) || !event.complete)
    .map(event => `<li>${safe(event.stage)} · ${safe(event.inputs.join(", ") || "Unknown input")} to ${safe(event.output)}${event.complete ? "" : " (incomplete)"}</li>`).join("");
  byId("shipmentBox").innerHTML = result.shipments.length ?
    `<div class="table-wrap"><table><thead><tr><th scope="col">Shipment</th><th scope="col">Lot</th>
    <th scope="col">Recipient</th><th class="num" scope="col">${safe(data.unit)}</th></tr></thead><tbody>${
      result.shipments.map(shipment => `<tr><th scope="row">${safe(shipment.id)}</th><td>${safe(shipment.lot)}</td>
        <td>${safe(shipment.recipient)}</td><td class="num">${count(shipment.quantity)}</td></tr>`).join("")
    }</tbody></table></div>` : "<p>No confirmed affected shipment is listed for this selection.</p>";
  byId("shipNote").textContent = result.canNarrow ? "QA can review the destinations before deciding on withdrawal." :
    result.mismatch ? "This list covers known affected shipments. Keep unresolved lots in the investigation." : "";
  byId("triage").open = false;
  byId("note").value = data === DATA.freshmeals ? DATA.exampleNote : "";
  byId("triageResult").textContent = "";
}

function download(filename, type, content) {
  const url = URL.createObjectURL(new Blob([content],{type}));
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
}

function updateLedger() {
  const id = byId("auditRecord").value;
  const record = records.find(row => row.id === id);
  const block = ledger.blocks.find(row => row.record.id === id);
  const pending = ledger.pending.find(row => row.record.id === id);
  const eligible = pending ? data.validators.filter(org =>
    org !== record.organization && !pending.approvals.includes(org)) : [];
  const previousActor = byId("auditActor").value;
  byId("auditActor").innerHTML = options(eligible.map(org => [org,agency(data,org).name]));
  byId("auditActor").value = eligible.includes(previousActor) ? previousActor : eligible[0] || "";
  byId("auditActorField").hidden = eligible.length < 2;
  byId("actingName").textContent = !record || block ? "" : !pending ?
    `Submitting lab · ${agency(data,record.organization).name}` :
    eligible.length === 1 ? `Approving organization · ${agency(data,eligible[0]).name}` : "";
  byId("auditReportLabel").textContent = record && records.length === 1 ? `Lab report · ${record.id}` : "";
  byId("propose").hidden = !record || Boolean(pending || block);
  byId("approve").hidden = eligible.length === 0;
  byId("recordState").textContent = !record ? "No lab reports in this network." :
    block ? "Committed · 3 approvals" : pending ? `Pending · ${pending.approvals.length} of 3 approvals` : "Ready to submit";
  byId("committedSection").hidden = ledger.blocks.length === 0;
  byId("blocks").innerHTML = ledger.blocks.map(row => `<li><strong>${safe(row.record.id)}</strong>
    <br>Submitted by ${safe(agency(data,row.record.organization).name)}
    <br>Approved by ${row.approvals.map(id => safe(agency(data,id).name)).join(", ")}
    <details><summary>Record hash</summary><code>${row.hash}</code></details></li>`).join("");
}

async function audit(action) {
  const current = ledger;
  const network = data;
  const id = byId("auditRecord").value;
  const actor = byId("auditActor").value;
  for (const button of auditButtons) byId(button).disabled = true;
  try {
    let message;
    if (action === "propose") {
      const record = records.find(row => row.id === id);
      if (!record) throw new Error("Choose a lab report first.");
      proposeRecord(current,network,record.organization,record);
      message = "Record proposed. Collect three validator approvals.";
    } else if (action === "approve") {
      message = await approveRecord(current,network,actor,id) ?
        "Quorum reached. Record committed to the chain." : "Validator approval recorded.";
    } else {
      if (!current.blocks.length) throw new Error("Commit a record first.");
      const blocks = action === "tamper" ? structuredClone(current.blocks) : current.blocks;
      if (action === "tamper") blocks[0].record.payload.demoChange = "altered";
      const valid = await verifyChain(blocks,network);
      message = valid ? "Ledger verified." : action === "tamper" ?
        "Altered copy rejected. The original ledger was preserved." : "Verification failed.";
    }
    if (current === ledger) {
      byId("ledgerStatus").textContent = message;
      updateLedger();
      if (result?.lab) byId("evidenceHint").textContent = current.blocks.some(block => block.record.id === result.lab.id) ?
        "Lab report committed in the local audit simulation." :
        "Scope preview uses the supplied records. Verify lab authenticity and custody before acting.";
    }
  } catch (error) {
    if (current === ledger) byId("ledgerStatus").textContent = error.message;
  } finally {
    for (const button of auditButtons) byId(button).disabled = false;
  }
}

for (const button of auditButtons) byId(button).addEventListener("click",()=>audit(button));
byId("auditRecord").addEventListener("change",()=>{byId("ledgerStatus").textContent="";updateLedger();});
byId("viewTrace").addEventListener("click",()=>selectView(false));
byId("viewAudit").addEventListener("click",()=>selectView(true));
byId("inputLot").addEventListener("change",()=>{loadReports();render();});
byId("report").addEventListener("change",render);
byId("restoreNetwork").addEventListener("click",()=>loadNetwork(DATA.freshmeals));
byId("importNetwork").addEventListener("click",()=>byId("networkFile").click());
byId("networkFile").addEventListener("change",async event=>{
  const file=event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 1024 * 1024) throw new Error("Choose a JSON file of at most 1 MB.");
    const next=JSON.parse(await file.text());
    loadNetwork(next);
    byId("networkSettings").open = false;
  } catch (error) {
    byId("workspaceStatus").textContent="Network import failed. " + error.message;
  } finally {
    event.target.value="";
  }
});
byId("sampleNetwork").addEventListener("click",()=>download("meattrace-network-example.json","application/json",
  JSON.stringify(DATA.northValley,null,2)+"\n"));
byId("note").addEventListener("input",()=>{byId("triageResult").textContent="";});
byId("classify").addEventListener("click",()=>{
  const note=byId("note").value.trim();
  if (!note) {
    byId("triageResult").textContent="Enter an incident note.";
    return;
  }
  const prediction=route(note,MODEL);
  byId("triageResult").textContent=prediction.label === -1 ? "Manual review suggested" :
    MODEL.labels[prediction.label] + " suggested";
});
byId("export").addEventListener("click",()=>download("meattrace-scope.csv","text/csv;charset=utf-8",scopeCSV(data,result)));
loadNetwork(DATA.freshmeals);
