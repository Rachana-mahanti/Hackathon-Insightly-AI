import cohere
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from io import BytesIO

# Initialize Cohere client
co = cohere.Client("6FlvtFdmNwoko459GoecQQiSf3TQNRUcvSQEOqgE")

# Initialize FastAPI app
app = FastAPI(
    title="FinSight AI Backend",
    description="Backend API for FinSight AI",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "FinSight AI Backend is running!"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    try:
        contents = await file.read()
        pdf = BytesIO(contents)
        reader = PdfReader(pdf)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted.replace('\n', ' ') + ' '

        # Return a larger portion of the content to the frontend
        response = {
            "success": True,
            "text": text[:12000],  # Increased from 5000 to 12000
            "content_length": len(text)
        }
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class AskRequest(BaseModel):
    context: str
    question: str

@app.post("/ask")
async def ask_question(data: AskRequest):
    if not data.context or not data.question:
        raise HTTPException(status_code=400, detail="Both context and question are required")
    try:
        safe_context = data.context[:12000]  # Keeping under safe token limits

        prompt = f"""
You are a financial analyst. Analyze the below annual report excerpt and answer the user’s question clearly and factually.

Report Excerpt:
\"\"\"{safe_context}\"\"\"

Question:
{data.question}

Answer:
"""

        print("Prompt sent to Cohere:\n", prompt[:400])  # Log for debugging

        response = co.generate(
            model="command",
            prompt=prompt,
            max_tokens=300,
            temperature=0.7
        )

        return {"answer": response.generations[0].text.strip()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    import socket

    def find_free_port():
        sock = socket.socket()
        sock.bind(('', 0))
        port = sock.getsockname()[1]
        sock.close()
        return port

    port = 5001
    try:
        uvicorn.run(app, host="0.0.0.0", port=port)
    except OSError:
        port = find_free_port()
        print(f"Port 5000 was busy, using port {port} instead")
        uvicorn.run(app, host="0.0.0.0", port=port)
