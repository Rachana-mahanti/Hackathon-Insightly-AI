# 🧠 Insightly AI – FinSight Hackathon Project

Insightly AI (FinSight) is an intelligent financial chatbot that allows users to upload annual reports and instantly get AI-powered summaries, insights, and visual analytics through natural language conversations.

---

## 🚀 Live Demo

- 🔧 **Backend (FastAPI on Replit)**:  
  [https://5b4a092e-8a8a-480b-b1fa-82e953a2732-00-l2ws0gwwlzby.worf.replit.dev](https://5b4a092e-8a8a-480b-b1fa-82e953a2732-00-l2ws0gwwlzby.worf.replit.dev)

- 🌐 **Frontend (Netlify)**:  
  [https://phenomenal-kelpie-023a67.netlify.app](https://phenomenal-kelpie-023a67.netlify.app)

---

## 🧩 Features

- 📄 Upload PDF annual reports
- 💬 Ask questions in natural language (e.g. “What’s the net income in 2023?”)
- 📊 View visual analytics and financial summaries
- 🧠 Powered by Cohere AI for financial language understanding

---

## 🛠️ Tech Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Frontend    | HTML, CSS, JavaScript (Bolt)|
| Backend     | FastAPI (Python)            |
| AI/ML       | Cohere API, PyMuPDF         |
| Deployment  | Replit (Backend), Netlify (Frontend) |

---

## 📁 Project Structure

```
Hackathon-Insightly-AI/
├── frontend/          # UI built with Bolt (hosted on Netlify)
├── backend/           # FastAPI backend (deployed on Replit)
├── README.md          # Project documentation
```

---

## 🧪 How to Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main: app-- reload
```

### Frontend
- Open `frontend/index.html` in a browser
- Or deploy using Netlify/Vercel for public access

---

## 🧠 AI Integration

- Uses **Cohere** for natural language financial Q&A
- Converts PDF content to text using **PyMuPDF**
- FastAPI endpoints serve parsed data and AI responses

---

## 🤝 Team & Credits

Built by **Rachana Venkumahanti**  
Master's in IT & Management @ UT Dallas

---

## 📜 License

MIT License – feel free to fork, modify, and build on it!
