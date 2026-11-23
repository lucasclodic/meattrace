"use strict";

function descendants(origin, edges) {
  const seen = new Set([origin]);
  const pending = [origin];
  while (pending.length) {
    const next = pending.pop();
    for (const [parent, child] of edges) {
      if (parent === next && !seen.has(child)) {
        seen.add(child);
        pending.push(child);
      }
    }
  }
  return seen;
}

function trace(data, scenario) {
  const edges = data.edges.filter(([from, to]) =>
    from !== scenario.omit?.[0] || to !== scenario.omit?.[1]);
  const linked = descendants(data.origin.id, edges);
  const validLab = scenario.lab.lot === data.origin.id && scenario.lab.chainOfCustody;
  const mismatch = validLab && scenario.lab.species !== data.origin.declared;
  const unresolved = new Set(data.lots.filter(lot =>
    !edges.some(([, child]) => child === lot.id) ||
    lot.onsite + lot.shipments.reduce((sum, s) => sum + s.packs, 0) !== lot.packs ||
    lot.shipments.some(s => !s.recipient)
  ).map(lot => lot.id));
  if (scenario.omit) {
    for (const id of descendants(scenario.omit[1], edges)) unresolved.add(id);
  }
  const rows = data.lots.map(lot => ({
    ...lot,
    state: unresolved.has(lot.id) ? "Unresolved" : linked.has(lot.id) ? "Linked" : "Outside lineage"
  }));
  const confirmed = rows.filter(row => row.state === "Linked");
  const knownImpacted = mismatch ? confirmed.filter(row => !unresolved.has(row.id)) : [];
  const affected = knownImpacted.reduce((sum, row) => sum + row.packs, 0);
  const onHold = knownImpacted.reduce((sum, row) => sum + row.onsite, 0);
  const shipments = knownImpacted.flatMap(row => row.shipments.map(shipment => ({...shipment, lot: row.id})));
  const linePacks = rows.reduce((sum, row) => sum + row.packs, 0);
  const unresolvedPacks = rows.filter(row => row.state === "Unresolved").reduce((sum, row) => sum + row.packs, 0);
  const canNarrow = mismatch && unresolved.size === 0 && knownImpacted.length > 0;
  const status = !validLab ? "Evidence incomplete" : !mismatch ? "No mismatch in linked sample" :
    canNarrow ? "Species mismatch" : "Species mismatch · scope incomplete";
  const action = !validLab ? "Hold the selected batch for QA and reconcile the sample ID." :
    !mismatch ? "Send to QA for release review. Follow normal checks." :
    canNarrow ? "Hold affected on-site packs and review the shipment records for withdrawal." :
    "Hold known affected inventory. Keep scope broad until the missing lineage is reconciled.";
  return { edges, confirmed, rows, knownImpacted, affected, onHold, shipments, linePacks,
    unresolvedPacks, canNarrow, status, action, validLab, mismatch };
}

function scopeCSV(data, scenario, result) {
  const quote = value => '"' + String(value).replaceAll('"', '""') + '"';
  const rows = [["scenario","input_lot","lab_report","decision","finished_lot","lineage",
    "position","shipment_id","recipient","packs"]];
  for (const row of result.rows) {
    if (row.state === "Outside lineage") continue;
    const common = [scenario.name, data.origin.id, scenario.lab.id, result.status, row.id, row.state];
    rows.push([...common,"On site","","FreshMeals",row.onsite]);
    for (const s of row.shipments) rows.push([...common,"Shipped",s.id,s.recipient,s.packs]);
  }
  return rows.map(row => row.map(quote).join(",")).join("\r\n") + "\r\n";
}
