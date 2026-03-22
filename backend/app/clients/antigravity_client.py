import os
import json
import socket
import time
import urllib.request
import urllib.error

def call_gemini(prompt: str) -> str:
    """Shared reusable function to call Gemini API natively with timeout constraints and retries."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY is not set.")
        return "AI processing failed"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode("utf-8"), 
        headers={"Content-Type": "application/json"}
    )
    
    for attempt in range(2):
        try:
            # Enforcing a 10s timeout constraint on network processing
            with urllib.request.urlopen(req, timeout=10) as response:
                result = json.loads(response.read().decode("utf-8"))
                return result["candidates"][0]["content"]["parts"][0]["text"]
                
        except urllib.error.HTTPError as e:
            # Safely capture Google's explicit API rejection reason
            try:
                error_details = e.read().decode('utf-8')
                print(f"=== GEMINI API REJECTED REQUEST ===\nHTTP {e.code}: {error_details}\n===================================")
            except Exception:
                print(f"Gemini HTTP Error: {e.code}")
            
            if attempt == 1:
                return "AI processing failed"
                
        except (socket.timeout, TimeoutError):
            print(f"Attempt {attempt+1}: Gemini API timed out...")
            if attempt == 1:
                return "AI processing timed out"
                
        except urllib.error.URLError as e:
            if hasattr(e, 'reason') and isinstance(e.reason, socket.timeout):
                print(f"Attempt {attempt+1}: Gemini API timed out...")
                if attempt == 1:
                    return "AI processing timed out"
            print(f"Attempt {attempt+1}: URLError: {e.reason}")
            if attempt == 1:
                return "AI processing failed"
                
        except Exception as e:
            print(f"Attempt {attempt+1}: Unexpected Error: {str(e)}")
            if attempt == 1:
                return "AI processing failed"
                
        time.sleep(1) # Backoff before retrying
        
    return "AI processing failed"
