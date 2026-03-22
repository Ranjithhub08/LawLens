from app.clients.antigravity_client import call_gemini

def translate_text(answer: str, language: str) -> str:
    """Translate answer conditionally based on target language using Gemini."""
    if language.strip().lower() in ["en", "english"]:
        return answer
        
    prompt = (
        f"Translate the following text into {language}. "
        "Keep meaning exact and simple.\n\n"
        f"Text:\n{answer}"
    )
    
    try:
        response = call_gemini(prompt)
        return response
    except Exception:
        return "AI processing failed"
