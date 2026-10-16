"""MeatTrace — Python proof of concept for IS511E Midterm 1.

Demonstration A: SHA-256 integrity of a meat batch record.
Demonstration B: role-based access control with separation of duties and revocation.
Extension: one block linked to the previous block by its hash.

Teaching simulation only: a Python dictionary is not a secure database or a real ledger.
"""

import hashlib
import json


def record_hash(record):
    """Stable text (sorted keys) -> SHA-256 fingerprint."""
    text = json.dumps(record, sort_keys=True)
    return hashlib.sha256(text.encode()).hexdigest()


# --------------------------------------------------------------------------
# Demonstration A — data integrity
# --------------------------------------------------------------------------
print("=" * 70)
print("DEMONSTRATION A — data integrity")
print("=" * 70)

slaughter_record = {
    "record_id": "REC-001",
    "event": "SLAUGHTER",
    "batch_id": "RO-2026-0412",
    "species": "HORSE",
    "weight_kg": 2400,
    "site": "Carpati Meat (RO)",
    "date": "2026-10-05",
}

approved_hash = record_hash(slaughter_record)
print("Approved record :", slaughter_record)
print("Approved hash   :", approved_hash)

# The 2013 fraud: the label changes on the way. We build a NEW dict (no mutation).
relabelled_record = {**slaughter_record, "species": "BEEF"}
relabelled_hash = record_hash(relabelled_record)
print("\nRelabelled record:", relabelled_record)
print("Relabelled hash  :", relabelled_hash)
print("Same record?     :", approved_hash == relabelled_hash)


# --------------------------------------------------------------------------
# Extension — one block linked to the previous block
# --------------------------------------------------------------------------
print("\n" + "=" * 70)
print("EXTENSION — block linked by previous hash")
print("=" * 70)

transfer_record = {
    "record_id": "REC-002",
    "event": "TRANSFER",
    "batch_id": "RO-2026-0412",
    "from": "Carpati Meat (RO)",
    "to": "Delta Trading (NL)",
    "species_declared": "HORSE",
    "weight_kg": 2400,
}
dna_test_record = {
    "record_id": "REC-003",
    "event": "DNA_TEST",
    "batch_id": "RO-2026-0412",
    "lab": "GenoLab (DE)",
    "result": "EQUINE 100%",
    "report_sha256": record_hash({"report": "GL-2026-881.pdf"}),
}

previous_block_hash = record_hash({"block": 40, "note": "previous block"})
block_41 = {
    "block_number": 41,
    "timestamp": "2026-10-06T09:14:00Z",
    "previous_hash": previous_block_hash,
    "transactions": [record_hash(r) for r in (slaughter_record, transfer_record, dna_test_record)],
}
block_41_hash = record_hash(block_41)
print("Block 40 hash          :", previous_block_hash)
print("Block 41 previous_hash :", block_41["previous_hash"])
print("Block 41 transactions  :")
for tx in block_41["transactions"]:
    print("   ", tx)
print("Block 41 hash          :", block_41_hash)

# Tampering with an old record breaks the block hash that every partner stored.
tampered_block = {
    **block_41,
    "transactions": [record_hash(relabelled_record)] + block_41["transactions"][1:],
}
print("Block 41 hash after relabelling REC-001:", record_hash(tampered_block))
print("Block still valid?     :", record_hash(tampered_block) == block_41_hash)


# --------------------------------------------------------------------------
# Business rule — the 2013 scenario: a NEW document declares another species
# --------------------------------------------------------------------------
print("\n" + "=" * 70)
print("BUSINESS RULE — declared species must equal the signed history")
print("=" * 70)

resale_transfer = {
    **transfer_record,
    "record_id": "REC-004",
    "from": "Delta Trading (NL)",
    "to": "FreshMeals (FR)",
    "species_declared": "BEEF",
}
signed_species = slaughter_record["species"]
status = "OK" if resale_transfer["species_declared"] == signed_species else "MISMATCH, batch blocked"
print("REC-004 declares       :", resale_transfer["species_declared"])
print("Signed history says    :", signed_species)
print("Check                  :", status)


# --------------------------------------------------------------------------
# Demonstration B — access rights
# --------------------------------------------------------------------------
print("\n" + "=" * 70)
print("DEMONSTRATION B — access rights")
print("=" * 70)

users = {
    "ion":    {"org": "Carpati Meat (RO)",     "role": "abattoir",        "active": True},
    "pieter": {"org": "Delta Trading (NL)",    "role": "trader",          "active": True},
    "dan":    {"org": "Delta Trading (NL)",    "role": "trader",          "active": False},
    "claire": {"org": "FreshMeals (FR)",       "role": "quality_manager", "active": True},
    "anna":   {"org": "GenoLab (DE)",          "role": "lab_inspector",   "active": True},
    "marc":   {"org": "Food Safety Authority", "role": "auditor",         "active": True},
}

role_permissions = {
    "abattoir":        {"create_record", "read_own"},
    "trader":          {"create_record", "read_own"},
    "quality_manager": {"create_record", "approve_record", "read_batch"},
    "lab_inspector":   {"create_test", "approve_record", "read_batch"},
    "auditor":         {"read_audit"},
}
# No role has "edit_record": an approved record is never edited, only corrected by a new record.

records = {
    "REC-001": {"event": "SLAUGHTER", "created_by": "ion"},
    "REC-007": {"event": "RECEPTION", "created_by": "claire"},
}


def can_do(user, action, record_id=None):
    account = users[user]
    if not account["active"]:
        return False, "account revoked"
    if action not in role_permissions[account["role"]]:
        return False, f"role '{account['role']}' has no '{action}' right"
    if action == "approve_record" and records[record_id]["created_by"] == user:
        return False, "separation of duties: cannot approve own record"
    return True, "permission granted"


tests = [
    ("anna",   "approve_record", "REC-001"),
    ("claire", "read_batch",     "REC-001"),
    ("pieter", "edit_record",    "REC-001"),
    ("claire", "approve_record", "REC-007"),
    ("dan",    "create_record",  None),
]

for user, action, record_id in tests:
    allowed, reason = can_do(user, action, record_id)
    verdict = "ALLOWED" if allowed else "DENIED "
    target = record_id or "-"
    print(f"{verdict} | {user:<6} ({users[user]['role']:<15}) | {action:<14} | {target:<7} | {reason}")
