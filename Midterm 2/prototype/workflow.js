"use strict";

const roles = ["supplier", "processor", "lab", "distributor", "retailer", "observer"];
const textValue = value => typeof value === "string" && value.trim() === value && value.length > 0 && value.length <= 160;
const amount = value => Number.isFinite(value) && value >= 0 && value <= 1e12;
const agency = (data, id) => data.organizations.find(organization => organization.id === id);

function validateNetwork(data) {
  function require(valid, message) {
    if (!valid) throw new Error(message);
  }
  function unique(items, label) {
    require(items.every(textValue) && new Set(items).size === items.length, label + " must be nonempty and unique.");
  }
  require(data?.schemaVersion === 1 && textValue(data.name) && textValue(data.unit), "Provide schemaVersion 1, a network name and a reporting unit.");
  for (const key of ["organizations", "validators", "inputs", "transformations", "finishedLots", "labReports"]) {
    require(Array.isArray(data[key]), "Provide an array for " + key + ".");
  }
  const {organizations, validators, inputs, transformations, finishedLots, labReports} = data;
  require(organizations.every(row => row && textValue(row.name) && roles.includes(row.role)), "Each organization needs a name and a recognized role.");
  unique(organizations.map(row => row.id), "Organization IDs");
  require(validators.length === 4 && new Set(validators).size === 4 &&
    validators.every(id => agency(data,id) && agency(data,id).role !== "observer") &&
    validators.some(id => agency(data,id).role === "lab"), "Configure four distinct validators, including an independent lab.");
  require(inputs.length > 0 && inputs.every(row => row && textValue(row.id) && textValue(row.recordId) &&
    textValue(row.declaredSpecies) && ["supplier","processor"].includes(agency(data,row.organization)?.role)),
    "Each incoming lot needs a lot ID, a record ID, a declared species and a supplier or processor.");
  require(transformations.every(row => row && textValue(row.id) && agency(data,row.organization)?.role === "processor" &&
    textValue(row.stage) && textValue(row.output) && Array.isArray(row.inputs) && typeof row.complete === "boolean"),
    "Each transformation needs a processor, stage, input list, output lot and completeness flag.");
  unique([...inputs.map(row => row.id), ...transformations.map(row => row.output)], "Incoming and produced lot IDs");
  const sourceLots = new Set([...inputs.map(row => row.id), ...transformations.map(row => row.output)]);
  for (const transformation of transformations) {
    unique(transformation.inputs,"Transformation input IDs");
    require(transformation.inputs.every(id => sourceLots.has(id)), "Unknown input in event " + transformation.id + ". Mark incomplete events with complete: false.");
    require(!transformation.complete || transformation.inputs.length > 0, "A complete event needs at least one input.");
  }
  const edges = buildEdges(transformations);
  const parents = new Map(transformations.map(event => [event.output,event.inputs.length]));
  const children = childIndex(edges);
  const ready = [...sourceLots].filter(id => !parents.get(id));
  for (let i = 0; i < ready.length; i++) {
    for (const id of children.get(ready[i]) || []) {
      const remaining = parents.get(id) - 1;
      parents.set(id,remaining);
      if (remaining === 0) ready.push(id);
    }
  }
  require(ready.length === sourceLots.size, "The production graph must be acyclic.");
  require(finishedLots.length > 0 && finishedLots.every(row => row && sourceLots.has(row.id) && !children.has(row.id) &&
    agency(data,row.organization)?.role === "processor" && amount(row.quantity) && amount(row.onsite) &&
    Array.isArray(row.shipments) && row.shipments.every(s => s && textValue(s.id) &&
      (s.recipient === "" || textValue(s.recipient)) && amount(s.quantity))),
    "Finished lots need a terminal lot, processor, quantities and shipment rows. Use an empty recipient to flag a gap.");
  unique(finishedLots.map(row => row.id), "Finished lot IDs");
  require(labReports.every(row => row && textValue(row.id) && textValue(row.sample) && textValue(row.lot) &&
    textValue(row.species) && agency(data,row.organization)?.role === "lab" && typeof row.custodyVerified === "boolean"),
    "Each lab report needs a registered lab, species, sample ID, source lot ID and custody flag.");
  unique([...inputs.map(row => row.recordId), ...transformations.map(row => row.id),
    ...labReports.map(row => row.id), ...finishedLots.flatMap(row => row.shipments.map(s => s.id))], "Record IDs");
  return data;
}

function buildEdges(events) {
  return events.flatMap(event => event.inputs.map(input => [input,event.output]));
}

function childIndex(edges) {
  const children = new Map();
  for (const [from,to] of edges) {
    if (!children.has(from)) children.set(from,[]);
    children.get(from).push(to);
  }
  return children;
}

function reachable(roots, children) {
  const seen = new Set(roots);
  const pending = [...roots];
  while (pending.length) {
    for (const child of children.get(pending.pop()) || []) {
      if (seen.has(child)) continue;
      seen.add(child);
      pending.push(child);
    }
  }
  return seen;
}

function trace(data, selection) {
  const origin = data.inputs.find(input => input.id === selection.input);
  const lab = data.labReports.find(report => report.id === selection.report);
  const events = data.transformations.map(event => event.id === selection.missingEvent ?
    {...event, inputs:[], complete:false} : event);
  const edges = buildEdges(events);
  const children = childIndex(edges);
  const linked = reachable([origin.id], children);
  const uncertain = reachable(events.filter(event => !event.complete).map(event => event.output), children);
  const validLab = Boolean(lab && lab.lot === origin.id && lab.custodyVerified);
  const mismatch = validLab && lab.species.toUpperCase() !== origin.declaredSpecies.toUpperCase();
  const rows = data.finishedLots.map(lot => {
    const shipped = lot.shipments.reduce((sum, shipment) => sum + shipment.quantity, 0);
    const incomplete = uncertain.has(lot.id) || Math.abs(lot.onsite + shipped - lot.quantity) > 1e-8 ||
      lot.shipments.some(shipment => !shipment.recipient);
    const state = incomplete ? "Unresolved" : linked.has(lot.id) ? "Linked" : "Outside recorded lineage";
    return {...lot, state, shipped};
  });
  const knownImpacted = mismatch ? rows.filter(row => row.state === "Linked") : [];
  const affected = knownImpacted.reduce((sum, row) => sum + row.quantity, 0);
  const onHold = knownImpacted.reduce((sum, row) => sum + row.onsite, 0);
  const shipments = knownImpacted.flatMap(row => row.shipments.map(shipment => ({...shipment, lot:row.id})));
  const total = rows.reduce((sum, row) => sum + row.quantity, 0);
  const unresolved = rows.filter(row => row.state === "Unresolved");
  const unresolvedQuantity = unresolved.reduce((sum, row) => sum + row.quantity, 0);
  const canNarrow = mismatch && unresolved.length === 0 && knownImpacted.length > 0;
  const status = !validLab ? "Evidence incomplete" : !mismatch ? "No mismatch in linked sample" :
    canNarrow ? "Species mismatch" : "Species mismatch · scope incomplete";
  const action = !validLab ? "Hold the selected batch for QA and reconcile or obtain lab evidence." :
    !mismatch ? "Send to QA for release review. Follow normal checks." :
    canNarrow ? "Hold affected on-site stock and review shipment records for withdrawal." :
    "Hold known affected stock. Keep the scope broad until the lineage is reconciled.";
  return {origin, lab, events, edges, linked, rows, knownImpacted, affected, onHold, shipments,
    total, unresolvedQuantity, canNarrow, status, action, validLab, mismatch};
}

function scopeCSV(data, result) {
  const quote = value => {
    const normalized = String(value);
    const safe = typeof value === "string" && /^[\s]*[=+@-]|^[\t\r\n]/.test(normalized) ? "'" + normalized : normalized;
    return '"' + safe.replaceAll('"', '""') + '"';
  };
  const rows = [["network","input_lot","lab_report","decision","finished_lot","lineage","position",
    "shipment_id","recipient","quantity","unit"]];
  for (const row of result.rows) {
    if (row.state === "Outside recorded lineage") continue;
    const common = [data.name,result.origin.id,result.lab?.id || "",result.status,row.id,row.state];
    rows.push([...common,"On site","",agency(data,row.organization).name,row.onsite,data.unit]);
    for (const s of row.shipments) rows.push([...common,"Shipped",s.id,s.recipient,s.quantity,data.unit]);
  }
  return rows.map(row => row.map(quote).join(",")).join("\r\n") + "\r\n";
}

function recordsForNetwork(data) {
  const wrap = (type, id, organization, payload) => ({type,id,organization,payload});
  return [
    ...data.inputs.map(row => wrap("Intake",row.recordId,row.organization,row)),
    ...data.transformations.map(row => wrap("Transformation",row.id,row.organization,row)),
    ...data.labReports.map(row => wrap("Lab report",row.id,row.organization,row)),
    ...data.finishedLots.flatMap(lot => lot.shipments.map(s =>
      wrap("Shipment",s.id,lot.organization,{...s,lot:lot.id})))
  ];
}
