from app.clients.antigravity_client import call_gemini

def compress_context(clean_text: str, question: str) -> str:
    """Prompt Gemini to extract relevant clauses safely bounding context size."""
    
    # Enforcing strict AI bounds limit before dispatching
    MAX_SAFE_LENGTH = 150000
    if len(clean_text) > MAX_SAFE_LENGTH:
        # Trim intelligently: preserve start meaning cleanly, and inject truncation context 
        # so the model is fully aware that data was chopped.
        clean_text = clean_text[:MAX_SAFE_LENGTH] + "\n...[CONTENT TRUNCATED FOR SIZE SAFETY]..."

    prompt = (
        "Extract ONLY relevant clauses from this legal text based on the question. "
        "Preserve section numbers and meaning. Include referenced sections. "
        "Keep it concise.\n\n"
        f"Text:\n{clean_text}\n\n"
        f"Question:\n{question}"
    )
    
    try:
        response = call_gemini(prompt)
        return response
    except Exception:
        return "AI processing failed"
