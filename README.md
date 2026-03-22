# LawLens: AI Legislative Analyzer

LawLens is a modern, AI-powered legislative analyzer designed to help users understand complex legal documents instantly. Built with a modular monolith architecture, it leverages Google Gemini to extract key clauses, answer legal questions, and compare different versions of bills.

## ✨ Features

- **AI Synthesis**: Instant analysis of legislative documents using Gemini 1.5-Flash.
- **Bi-Directional Comparison**: Side-by-side delta extraction between old and new bill versions.
- **Multilingual Support**: Supports English, Hindi, and Tamil.
- **Glassmorphism UI**: A premium, modern dashboard built with React and Tailwind CSS.
- **PDF/TXT Support**: Natively parse and extract text from uploaded documents.
- **In-Memory Storage**: Lightweight document persistence for session tracking.

## 🚀 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, PDF.js.
- **Backend**: FastAPI, Uvicorn, Pydantic, urllib (Gemini Client).
- **AI**: Google Gemini 1.5-Flash.

## 🛠️ Setup & Installation

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Set your Gemini API Key:
   ```bash
   export GEMINI_API_KEY="your-api-key"
   ```
4. Start the server:
   ```bash
   uvicorn app.main:app --port 8000 --reload
   ```

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Collaborators

- Priyadonthireddy (@priyadonthireddy2975)
- Sambasiva Kankatala (@sambasivakankatala)
