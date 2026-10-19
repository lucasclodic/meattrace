# MeatTrace — IS511E Midterm 1

Group project for IS511E — Midterm 1.

**Team:** Lucas Clodic, Elisa Ouillet, Julia Kozhina

MeatTrace is a blockchain traceability solution for the meat supply chain, built around the 2013 horse-meat scandal. Fictional client: FreshMeals SA (ready-meal maker). Recommendation: a permissioned consortium blockchain with 4 validators.

## Folder structure

| Folder | Content |
|---|---|
| `slides/` | Slide deck (HTML + PDF export). Latest PDF: [version 4](slides/v4/IS511E_Midterm1_MeatTrace_v4.pdf) |
| `prototype/` | Python demo: SHA-256 hashing, tamper detection, role-based access control |
| `notebook/` | Executed Jupyter notebook with the full prototype |
| `oral/` | Speaker script, Q&A defense kit, slides audit |
| `consignes_teams.md` | Submission rules from the Teams message |

## Run the prototype

```bash
python3 prototype/meattrace_demo.py
```

The script only uses the Python standard library. Expected output: `prototype/demo_output.txt`.

## Run the notebook

```bash
cd notebook
python3 -m venv .venv
source .venv/bin/activate
pip install -r ../requirements.txt
jupyter notebook IS511E_Midterm1_MeatTrace.ipynb
```

## Submission

Each member submits the group PDF individually on Teams as `IS511E_Midterm1_Firstname_Lastname.pdf`.
