# ⚖️ LawLens -- AI Legislative Analyzer

[![FastAPI](https://img.shields.io/badge/FastAPI-0.128.0+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.0.0+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Gemini 1.5-Flash](https://img.shields.io/badge/AI-Gemini%201.5--Flash-4285F4?style=flat-square&logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**LawLens** is a state-of-the-art, AI-powered legislative analysis platform. It translates complex legal jargon into clear, actionable insights in seconds. Built for legal professionals, researchers, and policy-makers, LawLens uses advanced LLM orchestration to provide deep document synthesis and version-to-version comparisons.

---

## 🌟 Why LawLens?

Legal documents are often dense, opaque, and historically difficult to navigate. LawLens bridges the gap between complex legislation and human understanding.

- **🚀 0s to Insight**: Skip the reading; get the summary.
- **🔍 100% Context-Aware**: Answers are grounded strictly in the provided legal text.
- **⚖️ Version Delta**: Effortlessly track exactly what changed between two drafts.
- **🌍 Vernacular First**: High-quality translation into regional languages (Hindi, Tamil).

---

## 🔥 Core Capabilities

- **🧠 AI Synthesis Engine**: Leverages Gemini 1.5-Flash for high-speed, high-accuracy legal reasoning.
- **📄 Native Document Extraction**: Direct client-side PDF/TXT parsing.
- **🎭 Glassmorphism UI**: A premium, dark-themed dashboard with fluid animations and responsive layout.
- **🧬 Modular Monolith Architecture**: A robust, scalable backend designed for reliability and maintainability.
- **🛡️ Secure-by-Design**: Client-side parsing ensures minimal data exposure.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: `React 18`, `Vite`, `Tailwind CSS`, `Framer Motion`, `PDF.js`
- **Backend**: `FastAPI`, `Uvicorn`, `Pydantic`
- **Orchestration**: Custom Modular Monolith with sequential stage-gate processing.
- **AI Stack**: `Gemini-1.5-Flash` via native REST integration.

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API Key

### 2. Installation & Launch

#### **Backend Setup**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export GEMINI_API_KEY="your_api_key"
uvicorn app.main:app --port 8000 --reload
```

#### **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

---

## 🤝 Contributors & Collaborators

The LawLens project is proudly supported by:

- **Priyadonthireddy** ([@priyadonthireddy2975](https://github.com/priyadonthireddy2975))
- **Sambasiva Kankatala** ([@sambasivakankatala](https://github.com/sambasivakankatala))

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
