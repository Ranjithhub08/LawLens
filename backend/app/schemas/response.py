from pydantic import BaseModel

class AnalyzeResponse(BaseModel):
    answer: str
    formatted_output: str
    metadata: dict = {}
