from app.clients.antigravity_client import call_gemini

def generate_answer(validated_text: str, question: str) -> str:
    """Prompt Gemini to answer the question using ONLY the provided clauses."""
    prompt = (
        "Answer the question using ONLY the provided legal clauses. "
        "Use simple language. Avoid legal jargon. Mention sections. "
        "Do not use external knowledge.\n\n"
        f"Clauses:\n{validated_text}\n\n"
        f"Question:\n{question}"
    )
    
    try:
        response = call_gemini(prompt)
        return response
    except Exception:
        return "AI processing failed"
