"use strict";

const byId = id => document.getElementById(id);
const count = n => n.toLocaleString("en-GB");
const shipmentTotal = lot => lot.shipments.reduce((sum, shipment) => sum + shipment.packs, 0);
const scenarios = byId("scenarios");
let active;

for (const scenario of DATA.scenarios) {
  const button = document.createElement("button");
  button.textContent = scenario.name;
  button.dataset.scenario = scenario.id;
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => render(scenario));
  scenarios.append(button);
}

function render(scenario) {
  active = scenario;
  const result = trace(DATA, scenario);
  for (const button of scenarios.children) {
    button.setAttribute("aria-pressed", String(button.dataset.scenario === scenario.id));
  }
  byId("description").textContent = scenario.description;
  byId("decision").classList.toggle("neutral", result.validLab && !result.mismatch);
  byId("decision").innerHTML = `<strong>${result.status}</strong><p>${result.action}</p>`;
  const extras = result.canNarrow ? [result.affected - result.onHold, "Affected shipped"] :
    [result.unresolvedPacks, "Unresolved lineage"];
  byId("stats").innerHTML = [[result.linePacks,"Line-wide reference"],[result.affected,"Known affected"],
    [result.onHold,"Affected on site"],extras].map(([value,label]) =>
    `<div><strong>${count(value)}</strong><span>${label} packs</span></div>`).join("");
  const lab = scenario.lab;
  const evidence = [["Intake",DATA.origin.record],["Supplier",DATA.origin.site],
    ["Declared",DATA.origin.declared],["Lab",lab.source],["Report",lab.id],
    ["Sample",lab.sample],["Reported",lab.species],["Link",result.validLab ? "Matched" : "Unverified"]];
  byId("evidence").innerHTML = evidence.map(([key,value]) => `<dt>${key}</dt><dd>${value}</dd>`).join("");
  byId("lots").innerHTML = result.rows.map(row => `<tr><th scope="row">${row.id}</th>
    <td class="scope ${row.state === "Unresolved" ? "unresolved" : ""}">${row.state}</td>
    <td class="num">${count(row.packs)}</td><td class="num">${count(row.onsite)}</td>
    <td class="num">${count(shipmentTotal(row))}</td></tr>`).join("");
  const linked = descendants(DATA.origin.id, result.edges);
  byId("paths").innerHTML = result.edges.filter(([from]) => linked.has(from))
    .map(([from,to]) => `<li>${from} to ${to}</li>`).join("");
  byId("shipmentBox").innerHTML = result.shipments.length ?
    `<div class="table-wrap"><table><thead><tr><th scope="col">Shipment</th><th scope="col">Lot</th>
    <th scope="col">Recipient</th><th scope="col" class="num">Packs</th></tr></thead><tbody>${
      result.shipments.map(s => `<tr><th scope="row">${s.id}</th><td>${s.lot}</td>
        <td>${s.recipient}</td><td class="num">${count(s.packs)}</td></tr>`).join("")
    }</tbody></table></div>` : "<p>No shipment investigation was triggered by the linked evidence in this scenario.</p>";
  byId("shipNote").textContent = result.canNarrow ? "QA can review the listed destinations before deciding on withdrawal." :
    result.mismatch ? "Known affected shipments only. The unresolved lot remains in the broader investigation." : "";
  byId("note").value = scenario.note;
  byId("triageResult").textContent = "";
}

byId("note").addEventListener("input", () => { byId("triageResult").textContent = ""; });
byId("classify").addEventListener("click", () => {
  const note = byId("note").value.trim();
  if (!note) {
    byId("triageResult").textContent = "Enter an incident note.";
    return;
  }
  const prediction = route(note, MODEL);
  byId("triageResult").textContent = prediction.label === -1 ? "Manual review suggested" :
    MODEL.labels[prediction.label] + " suggested";
});
byId("export").addEventListener("click", () => {
  const blob = new Blob([scopeCSV(DATA, active, trace(DATA, active))], {type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `meattrace-${active.id}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
render(DATA.scenarios[0]);
