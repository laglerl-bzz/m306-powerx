import os
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from .json_parser import convert_input, is_valid_sdat_entry

app = FastAPI()

# Allow your React dev server to call us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Where to keep your aggregated JSON ---
DATA_DIR = "data"
ESL_STORE = os.path.join(DATA_DIR, "esl-total.json")
SDAT_STORE = os.path.join(DATA_DIR, "sdat-total.json")

@app.on_event("startup")
def ensure_data_store():
    """Make sure data directory and files exist."""
    os.makedirs(DATA_DIR, exist_ok=True)
    for path in (ESL_STORE, SDAT_STORE):
        if not os.path.isfile(path):
            with open(path, "w") as f:
                json.dump([], f, indent=2)


def save_batch(file_type: str, batch: Dict[str, Any]):
    """
    Merge `batch["esl-data"]` or `batch["sdat-data"]` into the
    corresponding store, deduplicating exact dicts.
    """
    if file_type == "esl":
        store_path = ESL_STORE
        key = "esl-data"
    else:
        store_path = SDAT_STORE
        key = "sdat-data"

    # Load existing data
    with open(store_path, "r") as f:
        existing = json.load(f)

    # Append only new, valid entries
    to_add = batch.get(key, [])
    for entry in to_add:
        if file_type == "sdat" and not is_valid_sdat_entry(entry):
            continue
        if entry not in existing:
            existing.append(entry)

    # Write back
    with open(store_path, "w") as f:
        json.dump(existing, f, indent=2)


@app.post("/upload")
async def upload_files(
    file_type: str = Form(...),                     # 'sdat' or 'esl'
    files: List[UploadFile] = File(...),            # one or more uploaded XMLs
) -> Dict[str, Any]:
    ft = file_type.lower()
    if ft not in ("sdat", "esl"):
        raise HTTPException(400, "Invalid file_type; must be 'sdat' or 'esl'")

    raw_results = []
    for upload in files:
        raw_bytes = await upload.read()
        try:
            content = raw_bytes.decode("utf-8")
        except UnicodeDecodeError:
            content = raw_bytes.decode("latin-1")

        raw_results.append({
            "filename": upload.filename,
            "content": content,
        })

    payload = {"type": ft, "files": raw_results}
    converted = convert_input(payload)

    # Persist & dedupe into our aggregate store
    save_batch(ft, converted)

    # Return only the converted batch back to caller
    return converted


@app.get("/data-esl")
def get_all_esl() -> Dict[str, Any]:
    """Return the full stored ESL aggregate."""
    with open(ESL_STORE, "r") as f:
        data = json.load(f)
    return {"esl-data": data}


@app.get("/data-sdat")
def get_all_sdat() -> Dict[str, Any]:
    """Return the full stored SDAT aggregate."""
    with open(SDAT_STORE, "r") as f:
        data = json.load(f)
    return {"sdat-data": data}

@app.get("/clear")
def clear_data() -> Dict[str, str]:
    """Wipe all stored data clean by emptying the JSON files."""
    for path in (ESL_STORE, SDAT_STORE):
        with open(path, "w") as f:
            json.dump([], f, indent=2)
    return {"message": "All data stores have been cleared."}
