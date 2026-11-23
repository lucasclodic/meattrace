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
let active;
let ledger;
let result;
let importedNetwork;
const ledgers = new Map();

for (const drill of DATA.drills) {
  const button = document.createElement("button");
  button.textContent = drill.name;
  button.dataset.scenario = drill.id;
  button.addEventListener("click", () => {
    byId("inputLot").value = drill.input;
    loadReports(drill.report);
    render(drill);
  });
  byId("scenarios").append(button);
}

function selectView(showAudit) {
  byId("audit").hidden = !showAudit;
  byId("traceView").hidden = showAudit;
  byId("viewAudit").setAttribute("aria-pressed",String(showAudit));
  byId("viewTrace").setAttribute("aria-pressed",String(!showAudit));
}

function loadReports(preferred) {
  const lot = byId("inputLot").value;
  const reports = data.labReports;
  byId("report").innerHTML = options([["","No lab report selected"], ...reports.map(row =>
    [row.id,`${row.id} · ${row.lot} · ${row.species}`])]);
  byId("report").value = reports.some(report => report.id === preferred) ? preferred : reports.find(report => report.lot === lot)?.id || "";
}

function loadNetwork(next, key) {
  data = validateNetwork(next);
  records = recordsForNetwork(data);
  if (!ledgers.has(data)) ledgers.set(data,{pending:[], blocks:[]});
  ledger = ledgers.get(data);
  byId("networkName").textContent = data.name;
  byId("networkMeta").textContent = key === "imported" ? `· imported data · ${data.unit}` : `· sample data · ${data.unit}`;
  byId("workspaceStatus").textContent = key === "imported" ? "Network loaded for this browser session." : "";
  byId("demoControls").hidden = key !== "freshmeals";
  byId("inputLot").innerHTML = options(data.inputs.map(lot => [lot.id,
    `${lot.id} · ${agency(data,lot.organization).name}`]));
  byId("validatorNames").textContent = "Validators: " + data.validators.map(id => agency(data,id).name).join(" · ");
  byId("auditRecord").innerHTML = options(records.map(record => [record.id,`${record.type} · ${record.id}`]));
  byId("auditActor").innerHTML = options(data.organizations.map(org => [org.id,`${org.name} · ${org.role}`]));
  byId("auditActor").value = records[0].organization;
  byId("ledgerStatus").textContent = "";
  updateLedger();
  loadReports();
  render(key === "freshmeals" ? DATA.drills[0] : null);
}

function render(drill) {
  active = drill;
  result = trace(data, drill || {input:byId("inputLot").value,report:byId("report").value});
  const {origin,lab}=result;
  for (const button of byId("scenarios").children) {
    button.setAttribute("aria-pressed",String(button.dataset.scenario === active?.id));
  }
  byId("description").textContent = drill?.description || `Investigating incoming lot ${origin.id}.`;
  byId("decision").classList.toggle("neutral",result.validLab && !result.mismatch);
  byId("decision").innerHTML = `<strong>${result.status}</strong><p>${result.action}</p>`;
  const extras = result.canNarrow ? [result.affected-result.onHold,"Affected shipped"] :
    [result.unresolvedQuantity,"Unresolved"];
  byId("stats").innerHTML = [[result.total,"Network scope"],[result.affected,"Known affected"],
    [result.onHold,"Affected on site"],extras].map(([value,label]) =>
    `<div><strong>${count(value)}</strong><span>${label} · ${safe(data.unit)}</span></div>`).join("");
  const evidence = [["Intake",origin.recordId],["Supplier",agency(data,origin.organization).name],
    ["Declared",origin.declaredSpecies],["Lab",agency(data,lab?.organization)?.name || "—"],
    ["Report",lab?.id || "—"],["Sample",lab?.sample || "—"],["Reported",lab?.species || "—"],
    ["Sample link",result.validLab ? "Matched" : "Unverified"]];
  byId("evidence").innerHTML = evidence.map(([label,value]) => `<dt>${label}</dt><dd>${safe(value)}</dd>`).join("");
  const committed = ledger.blocks.some(block => block.record.id === lab?.id);
  byId("evidenceHint").textContent = committed ? "Lab report committed in the local audit simulation." :
    "Scope preview uses the supplied records. Verify lab authenticity and custody before acting.";
  byId("lots").innerHTML = result.rows.map(row => `<tr><th scope="row">${safe(row.id)}</th>
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
  byId("note").value = drill?.note || "";
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
  const block = ledger.blocks.find(row => row.record.id === id);
  const pending = ledger.pending.find(row => row.record.id === id);
  const record = records.find(row => row.id === id);
  byId("recordState").textContent = block ? "Committed · 3 approvals" : pending ?
    `Pending · ${pending.approvals.length} of 3 approvals` : `Ready to propose · ${agency(data,record.organization).name}`;
  byId("emptyLedger").hidden = ledger.blocks.length > 0;
  byId("blocks").innerHTML = ledger.blocks.map(row => `<li><strong>${safe(row.record.id)} · ${safe(row.record.type)}</strong>
    <br>Approved by ${row.approvals.map(id => safe(agency(data,id).name)).join(", ")}
    <br><code>${row.hash}</code></li>`).join("");
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
      proposeRecord(current,network,actor,records.find(record => record.id === id));
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
      if (result.lab) byId("evidenceHint").textContent = current.blocks.some(block => block.record.id === result.lab.id) ?
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
byId("auditRecord").addEventListener("change",updateLedger);
byId("viewTrace").addEventListener("click",()=>selectView(false));
byId("viewAudit").addEventListener("click",()=>selectView(true));
byId("inputLot").addEventListener("change",()=>{loadReports();render(null);});
byId("report").addEventListener("change",()=>render(null));
byId("networkSelect").addEventListener("change",event=>{
  const key=event.target.value;
  loadNetwork(key === "imported" ? importedNetwork : DATA[key],key);
});
byId("importNetwork").addEventListener("click",()=>byId("networkFile").click());
byId("networkFile").addEventListener("change",async event=>{
  const file=event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 1024 * 1024) throw new Error("Choose a JSON file of at most 1 MB.");
    const next=JSON.parse(await file.text());
    loadNetwork(next,"imported");
    if (importedNetwork) ledgers.delete(importedNetwork);
    importedNetwork=next;
    byId("networkSelect").innerHTML=options([
      ["freshmeals",DATA.freshmeals.name],["northValley",DATA.northValley.name],["imported",next.name]
    ]);
    byId("networkSelect").value="imported";
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
loadNetwork(DATA.freshmeals,"freshmeals");
