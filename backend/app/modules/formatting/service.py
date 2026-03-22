import re
from typing import List

def format_output(answer: str) -> dict:
    """Format the final output into a structured dictionary."""
    ans_len = len(answer.strip())
    
    if ans_len > 250:
        confidence = "High"
    elif ans_len > 80:
        confidence = "Medium"
    else:
        confidence = "Low"

    # Base length filtering
    raw_lines = [line.strip().lstrip("- *") for line in answer.split('\n') if len(line.strip()) > 15]
    
    # Prioritize lines containing specific structural keywords or numeric patterns
    priority_clauses: List[str] = []
    fallback_clauses: List[str] = []
    
    pattern = re.compile(r'(?i)(section|clause|\b\d+\.|\([a-z0-9]\))')
    
    for line in raw_lines:
        if pattern.search(line):
            priority_clauses.append(line)
        else:
            fallback_clauses.append(line)
            
    # Merge prioritizing the strong pattern matches first, removing duplicates while preserving order
    clauses: List[str] = list(dict.fromkeys(priority_clauses + fallback_clauses))

    return {
        "answer": answer,
        "clauses": clauses[:3],
        "confidence": confidence
    }
