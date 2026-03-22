import logging
from app.modules.preprocessing.service import preprocess_text
from app.modules.compression.service import compress_context
from app.modules.validation.service import validate_clauses
from app.modules.reasoning.service import generate_answer
from app.modules.translation.service import translate_text
from app.modules.formatting.service import format_output

logger = logging.getLogger(__name__)

def run_pipeline(bill_text: str, question: str, language: str, demo_mode: bool = False) -> dict:
    if demo_mode:
        logger.info("Demo mode active: Returning simulated high-fidelity synthesis")
        demo_answer = (
            "The Legislative Data Privacy Act (LDPA) establishes a comprehensive framework for the "
            "protection of sensitive personal information. Under Section 1, the penalty for "
            "unauthorized data sharing or distribution is strictly defined as an immediate fine of "
            "$10,000, coupled with mandatory platform suspension. The document further mandates "
            "strict anonymization protocols for all shared datasets to ensure compliance with "
            "global privacy standards.\n\n"
            "**Core Legal Findings**:\n"
            "- **Statutory Penalty**: Immediate $10,000 fine per violation (Section 1)\n"
            "- **Liability**: Unauthorized data distribution or secondary sharing\n"
            "- **Enforcement**: Automatic platform suspension and protocol auditing"
        )
        return format_output(demo_answer)

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

def run_comparison(old_bill: str, new_bill: str, question: str, demo_mode: bool = False) -> dict:
    if demo_mode:
        logger.info("Demo mode active: Returning simulated high-fidelity comparison")
        compare_demo = (
            "The comparison between Version A and Version B reveals a significant escalation in enforcement. "
            "The penalty for unauthorized data sharing has increased from a $2,000 fine (Old Version) "
            "to a mandatory $10,000 fine coupled with immediate platform suspension (New Version). "
            "Additionally, the new draft introduces strict anonymization protocols (LDPA Section 4.5) "
            "not present in the original legislation."
        )
        fmt = format_output(compare_demo)
        return {
            "changes": fmt["answer"],
            "confidence": "High"
        }

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
