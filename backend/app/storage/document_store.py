# In-memory document storage implementation
_documents = {}

def save_document(doc_id: str, text: str) -> None:
    """Store document text in a dictionary persistently during the session."""
    _documents[doc_id] = text

def get_document(doc_id: str) -> str:
    """Return stored document text natively traversing the dictionary key."""
    return _documents.get(doc_id, "")
