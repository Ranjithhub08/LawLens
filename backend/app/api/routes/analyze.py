import uuid
from fastapi import APIRouter
from app.orchestrator.pipeline import run_pipeline, run_comparison
from app.schemas.request import AnalyzeRequest, CompareRequest
from app.storage.document_store import save_document

router = APIRouter()
SAFE_SIZE_LIMIT = 500_000

@router.post("/analyze")
def analyze(request: AnalyzeRequest):
    if len(request.bill_text) > SAFE_SIZE_LIMIT:
        return {
            "error": "Input too large",
            "stage": "api_layer"
        }

    # Generate isolated document ID and trigger local storage persistence
    doc_id = str(uuid.uuid4())
    save_document(doc_id, request.bill_text)

    try:
        result = run_pipeline(request.bill_text, request.question, request.language)
        
        # Transparently inject doc_id into response mapping for frontend tracking
        if isinstance(result, dict) and "error" not in result:
            result["doc_id"] = doc_id
            
        return result
        
    except Exception as e:
        return {
            "error": "API request failed",
            "stage": "api_layer",
            "details": str(e)
        }

@router.post("/compare")
def compare(request: CompareRequest):
    if len(request.old_bill) > SAFE_SIZE_LIMIT or len(request.new_bill) > SAFE_SIZE_LIMIT:
        return {
            "error": "Input too large",
            "stage": "api_layer"
        }
        
    # Generate isolated storage indices cleanly tracking chronological pairs
    old_id = str(uuid.uuid4())
    new_id = str(uuid.uuid4())
    save_document(old_id, request.old_bill)
    save_document(new_id, request.new_bill)

    try:
        result = run_comparison(request.old_bill, request.new_bill, request.question)
        
        # Transparently bundle the document IDs securely if needed
        if isinstance(result, dict) and "error" not in result:
            result["old_doc_id"] = old_id
            result["new_doc_id"] = new_id
            
        return result
        
    except Exception as e:
        return {
            "error": "API request failed",
            "stage": "api_layer",
            "details": str(e)
        }
