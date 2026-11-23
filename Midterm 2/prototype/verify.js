"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {webcrypto} = require("node:crypto");
const read = name => fs.readFileSync(path.join(__dirname,name),"utf8");
const {validateNetwork, trace, scopeCSV, recordsForNetwork, proposeRecord, approveRecord, verifyChain} =
  vm.runInNewContext(read("workflow.js")+"\n"+read("ledger.js")+
    "\n({validateNetwork,trace,scopeCSV,recordsForNetwork,proposeRecord,approveRecord,verifyChain})",
    {structuredClone,crypto:webcrypto,TextEncoder});

async function verify() {
  const {freshmeals} = JSON.parse(read("cases.json"));
  const northValley = JSON.parse(read("network_example.json"));
  for (const network of [freshmeals,northValley]) validateNetwork(network);
  const selection={input:"RO-2026-0412",report:"LAB-204"};
  assert.equal(freshmeals.labReports.length,1);
  const mismatch=trace(freshmeals,selection);
  const missingLink=structuredClone(freshmeals);
  const event=missingLink.transformations.find(row=>row.output==="LAS-02");
  event.inputs=[];
  event.complete=false;
  const gap=trace(validateNetwork(missingLink),selection);
  const reference=structuredClone(freshmeals);
  reference.labReports[0].species="BEEF";
  const match=trace(reference,selection);
  reference.labReports[0].custodyVerified=false;
  const unlinked=trace(reference,selection);
  assert.deepEqual([mismatch.total,mismatch.affected,mismatch.onHold,mismatch.affected-mismatch.onHold,
    mismatch.shipments.length,mismatch.canNarrow],[12000,3000,1200,1800,2,true]);
  assert.equal(mismatch.shipments.map(row => row.id).join(","),"SHP-101,SHP-102");
  assert.deepEqual([gap.affected,gap.unresolvedQuantity,gap.canNarrow,gap.shipments.length],[1200,1800,false,1]);
  assert.match(scopeCSV(freshmeals,gap),/"LAS-02","Unresolved"/);
  assert.doesNotMatch(scopeCSV(freshmeals,mismatch),/LAS-03/);
  assert.deepEqual([match.validLab,match.canNarrow,unlinked.validLab,unlinked.canNarrow],[true,false,false,false]);
  const boxed = trace(northValley,{input:"NV-110",report:"R-501"});
  assert.deepEqual([boxed.total,boxed.affected,boxed.onHold,boxed.affected-boxed.onHold,boxed.canNarrow],
    [250.5,180.5,40.5,140,true]);
  assert.match(scopeCSV(northValley,boxed),/"Riverbend Packing","15.5","kg"/);
  assert.equal(trace(northValley,{input:"NV-111",report:"R-501"}).validLab,false);
  assert.equal(trace(northValley,{input:"NV-111",report:""}).validLab,false);
  for (const modify of [
    network => network.finishedLots[0].onsite++,
    network => network.finishedLots[0].shipments[0].recipient="",
    network => network.transformations[0].complete=false
  ]) {
    const incomplete = structuredClone(northValley);
    modify(incomplete);
    validateNetwork(incomplete);
    assert.equal(trace(incomplete,{input:"NV-110",report:"R-501"}).canNarrow,false);
  }
  const cycle=structuredClone(northValley);
  cycle.transformations[0].inputs.push("BOX-A");
  assert.throws(()=>validateNetwork(cycle),/acyclic/);
  const forged=structuredClone(northValley);
  forged.labReports[0].organization="wholesale";
  assert.throws(()=>validateNetwork(forged),/registered lab/);
  const spreadsheet=structuredClone(northValley);
  spreadsheet.finishedLots[0].shipments[0].recipient="=1+1";
  assert.match(scopeCSV(spreadsheet,trace(spreadsheet,{input:"NV-110",report:"R-501"})),/"'=1\+1"/);

  const ledger={pending:[],blocks:[]};
  const records=recordsForNetwork(northValley);
  const lab=records.find(row=>row.id==="R-501");
  assert.throws(()=>proposeRecord(ledger,northValley,"plant",lab),/authorized organization/);
  proposeRecord(ledger,northValley,"lab",lab);
  await assert.rejects(approveRecord(ledger,northValley,"lab",lab.id),/own record/);
  await assert.rejects(approveRecord(ledger,northValley,"farm",lab.id),/configured validators/);
  assert.equal(await approveRecord(ledger,northValley,"plant",lab.id),false);
  await assert.rejects(approveRecord(ledger,northValley,"plant",lab.id),/once/);
  assert.equal(await approveRecord(ledger,northValley,"wholesale",lab.id),false);
  assert.equal(await approveRecord(ledger,northValley,"market",lab.id),true);
  const intake=records.find(row=>row.id==="RCV-110");
  proposeRecord(ledger,northValley,"farm",intake);
  for (const id of ["lab","plant","market"]) await approveRecord(ledger,northValley,id,intake.id);
  assert.equal(ledger.blocks[1].previous,ledger.blocks[0].hash);
  assert.equal(await verifyChain(ledger.blocks,northValley),true);
  const altered=structuredClone(ledger.blocks);
  altered[0].record.payload.species="BEEF";
  assert.equal(await verifyChain(altered,northValley),false);
  assert.equal(await verifyChain(ledger.blocks,northValley),true);
  console.log("Verified the FreshMeals case, a second network, incomplete and invalid records, CSV safety, roles, quorum and SHA-256 chain integrity.");
}
verify().catch(error=>{console.error(error);process.exitCode=1;});
