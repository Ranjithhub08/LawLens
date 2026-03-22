import * as pdfjsLib from 'pdfjs-dist';

// Map generic CDN worker natively to bypass Vite's localized module build constraints.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const extractTextFromRawFile = async (file) => {
    return new Promise((resolve, reject) => {
        if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const typedarray = new Uint8Array(e.target.result);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let fullText = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(" ");
                        fullText += pageText + "\n";
                    }
                    resolve(fullText);
                } catch (err) {
                    reject("PDF Parse Error: " + err.message);
                }
            };
            reader.onerror = () => reject("Failed to read the binary file streams.");
            reader.readAsArrayBuffer(file);
        } else {
            // Standard generic fallback for unstructured TXT files
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject("Failed to read the raw text document.");
            reader.readAsText(file);
        }
    });
};
