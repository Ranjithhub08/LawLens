from pydantic import BaseModel, Field

class AnalyzeRequest(BaseModel):
    bill_text: str = Field(..., min_length=1)
    question: str = Field(..., min_length=1)
    language: str = "English"
    demo_mode: bool = False

class CompareRequest(BaseModel):
    old_bill: str = Field(..., min_length=1)
    new_bill: str = Field(..., min_length=1)
    question: str = "What changed?"
    demo_mode: bool = False
