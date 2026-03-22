def preprocess_text(bill_text: str) -> str:
    """Clean extra spaces and normalize text."""
    # Replace multiple spaces/newlines with a single space
    clean_text = " ".join(bill_text.split())
    # Return cleaned text
    return clean_text.strip()
