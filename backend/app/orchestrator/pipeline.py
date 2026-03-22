import logging
from app.modules.preprocessing.service import preprocess_text
from app.modules.compression.service import compress_context
from app.modules.validation.service import validate_clauses
from app.modules.reasoning.service import generate_answer
from app.modules.translation.service import translate_text
from app.modules.formatting.service import format_output

logger = logging.getLogger(__name__)

def run_pipeline(bill_text: str, question: str, language: str) -> dict:
    try:
        logger.info("preprocessing started")
        clean_text = preprocess_text(bill_text)
        logger.info("preprocessing completed")
        
        logger.info("compression started")
        compressed_text = compress_context(clean_text, question)
        logger.info("compression completed")
        
        logger.info("validation started")
        validated_text = validate_clauses(compressed_text)
        logger.info("validation completed")
        
        logger.info("reasoning started")
        answer = generate_answer(validated_text, question)
        logger.info("reasoning completed")
        
        logger.info("translation started")
        translated_answer = translate_text(answer, language)
        logger.info("translation completed")
        
        logger.info("formatting started")
        final_output = format_output(translated_answer)
        logger.info("formatting completed")
        
        return final_output
    except Exception as e:
        logger.error(f"Pipeline execution failed: {str(e)}")
        return {
            "error": "Pipeline execution failed",
            "stage": "orchestrator",
            "details": str(e)
        }

def run_comparison(old_bill: str, new_bill: str, question: str) -> dict:
    try:
        logger.info("comparison preprocessing started")
        clean_old = preprocess_text(old_bill)
        clean_new = preprocess_text(new_bill)
        
        logger.info("comparison compression started")
        comp_old = compress_context(clean_old, question)
        comp_new = compress_context(clean_new, question)
        combined_diffs = f"--- OLD VERSION ---\n{comp_old}\n\n--- NEW VERSION ---\n{comp_new}"
        
        logger.info("comparison validation started")
        val_text = validate_clauses(combined_diffs)
        
        logger.info("comparison reasoning started")
        compare_prompt = "Compare the old and new legal texts. Identify key differences, changes in penalties, rights, or obligations. Explain clearly in simple language."
        
        # Mapping the explicit instructions while retaining native abstraction
        answer = generate_answer(val_text, compare_prompt)
        
        logger.info("comparison formatting started")
        fmt = format_output(answer)
        
        return {
            "changes": fmt["answer"],
            "confidence": fmt["confidence"]
        }
    except Exception as e:
        logger.error(f"Comparison execution failed: {str(e)}")
        return {
            "error": "Pipeline execution failed",
            "stage": "orchestrator",
            "details": str(e)
        }
