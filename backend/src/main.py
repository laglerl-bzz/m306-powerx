from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from .json_parser import convert_input

app = FastAPI()

# allow your React dev server to call us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        # read raw bytes
        raw_bytes = await upload.read()
        try:
            # decode to text (assuming UTF-8 XML)
            content = raw_bytes.decode("utf-8")
        except UnicodeDecodeError:
            # fallback to latin-1 if needed
            content = raw_bytes.decode("latin-1")

        raw_results.append({
            "filename": upload.filename,
            "content": content,
        })

    data = {
        "type": ft,
        "files": raw_results
    }

    convert_input(data)

    return data
