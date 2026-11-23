"use strict";

const quorum = 3;
const recordRoles = {
  "Intake":["supplier","processor"],
  "Transformation":["processor"],
  "Shipment":["processor","distributor"],
  "Lab report":["lab"]
};

async function hashRecord(content) {
  if (!globalThis.crypto?.subtle) throw new Error("SHA-256 requires a recent browser with Web Crypto. Open the file locally or use HTTPS.");
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(content)));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2,"0")).join("");
}

function proposeRecord(ledger, network, actor, record) {
  if (!record || actor !== record.organization || !recordRoles[record.type]?.includes(agency(network,actor)?.role)) {
    throw new Error("Only the record’s authorized organization can propose it.");
  }
  if (ledger.pending.some(entry => entry.record.id === record.id) || ledger.blocks.some(block => block.record.id === record.id)) {
    throw new Error("This record is already pending or committed.");
  }
  ledger.pending.push({record:structuredClone(record), approvals:[]});
}

async function approveRecord(ledger, network, actor, recordId) {
  if (!network.validators.includes(actor)) throw new Error("Only configured validators can approve.");
  const pending = ledger.pending.find(entry => entry.record.id === recordId);
  if (!pending) throw new Error("Propose the record before approving it.");
  if (pending.record.organization === actor) throw new Error("The submitting organization cannot approve its own record.");
  if (pending.approvals.includes(actor)) throw new Error("Each validator can approve a record once.");
  const approvals = [...pending.approvals,actor];
  if (approvals.length < quorum) {
    pending.approvals = approvals;
    return false;
  }
  const block = { previous:ledger.blocks.at(-1)?.hash || "GENESIS", record:pending.record, approvals };
  ledger.blocks.push({...block, hash:await hashRecord(block)});
  ledger.pending = ledger.pending.filter(entry => entry !== pending);
  return true;
}

async function verifyChain(blocks, network) {
  let previous = "GENESIS";
  for (const {hash,...block} of blocks) {
    if (block.previous !== previous || await hashRecord(block) !== hash ||
      block.approvals.length !== quorum || new Set(block.approvals).size !== quorum ||
      block.approvals.some(id => !network.validators.includes(id) || id === block.record.organization)) return false;
    previous = hash;
  }
  return true;
}
