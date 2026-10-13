"""Secure PDF Parser with PyMuPDF & PyPDF fallback, structure validation, and page boundary tracking."""

import io
import time
from typing import Optional
from pydantic import BaseModel

try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False

try:
    import pypdf
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False


class PageText(BaseModel):
    page_number: int
    text: str
    char_count: int


class ParsedPDFResult(BaseModel):
    success: bool
    page_count: int
    total_characters: int
    pages: list[PageText]
    raw_text: str
    is_scanned: bool = False
    ocr_applied: bool = False
    ocr_message: Optional[str] = None
    extraction_engine: str
    processing_time_ms: float
    error_message: Optional[str] = None


class PDFParserError(Exception):
    """Custom exception for invalid or malicious PDF files."""
    pass


def validate_pdf_bytes(file_bytes: bytes, max_bytes: int = 10 * 1024 * 1024) -> None:
    """Validate file size and standard PDF magic header (%PDF-)."""
    if not file_bytes:
        raise PDFParserError("Uploaded file is empty (0 bytes).")
    
    if len(file_bytes) > max_bytes:
        raise PDFParserError(
            f"File size exceeds maximum allowed limit ({len(file_bytes)} bytes > {max_bytes} bytes)."
        )
    
    # Check PDF magic bytes (%PDF-)
    if not file_bytes.startswith(b"%PDF-"):
        # Check first 1024 bytes in case of leading BOM or whitespace
        leading = file_bytes[:1024]
        if b"%PDF-" not in leading:
            raise PDFParserError("Invalid file signature: Document does not contain valid PDF magic header.")


def extract_text_from_pdf(
    file_bytes: bytes,
    max_pages: int = 20,
    enable_ocr_if_empty: bool = True
) -> ParsedPDFResult:
    """Extract page-by-page text from PDF with PyMuPDF and fallback to PyPDF."""
    start_time = time.perf_counter()
    validate_pdf_bytes(file_bytes)

    pages_output: list[PageText] = []
    total_chars = 0
    engine_used = "unknown"
    is_encrypted = False

    # 1. Primary Engine: PyMuPDF (fitz)
    if PYMUPDF_AVAILABLE:
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            engine_used = "PyMuPDF"
            if doc.is_encrypted:
                is_encrypted = True
                raise PDFParserError("PDF is password encrypted. Please provide an unencrypted document.")
            
            page_count = len(doc)
            if page_count == 0:
                raise PDFParserError("PDF document has 0 pages.")
            
            pages_to_process = min(page_count, max_pages)
            for idx in range(pages_to_process):
                page = doc[idx]
                text = page.get_text("text").strip()
                chars = len(text)
                total_chars += chars
                pages_output.append(PageText(
                    page_number=idx + 1,
                    text=text,
                    char_count=chars
                ))
            doc.close()
        except PDFParserError:
            raise
        except Exception as e:
            # Fallback to PyPDF if PyMuPDF encounters formatting issues
            pages_output = []
            total_chars = 0
            engine_used = "PyMuPDF_Failed_Fallback"

    # 2. Secondary Engine Fallback: PyPDF
    if (not pages_output or engine_used == "PyMuPDF_Failed_Fallback") and PYPDF_AVAILABLE:
        try:
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            engine_used = "PyPDF"
            if reader.is_encrypted:
                raise PDFParserError("PDF is password encrypted. Please provide an unencrypted document.")
            
            page_count = len(reader.pages)
            if page_count == 0:
                raise PDFParserError("PDF document has 0 pages.")
            
            pages_to_process = min(page_count, max_pages)
            for idx in range(pages_to_process):
                page = reader.pages[idx]
                text = (page.extract_text() or "").strip()
                chars = len(text)
                total_chars += chars
                pages_output.append(PageText(
                    page_number=idx + 1,
                    text=text,
                    char_count=chars
                ))
        except PDFParserError:
            raise
        except Exception as e:
            raise PDFParserError(f"Failed to parse PDF document structure: {str(e)}")

    if not pages_output:
        raise PDFParserError("Could not extract document pages using available PDF engines.")

    # 3. Detect Scanned / Low-Text Documents
    is_scanned = total_chars < 50
    ocr_applied = False
    ocr_message = None

    if is_scanned:
        ocr_message = (
            "Document contains little or no extractable digital text (< 50 characters). "
            "It appears to be a scanned image or raster PDF. System attempted standard extraction; "
            "OCR engine is not enabled in this lightweight development configuration."
        )

    all_text = "\n\n--- Page Break ---\n\n".join(
        [f"[Page {p.page_number}]\n{p.text}" for p in pages_output]
    )

    elapsed_ms = (time.perf_counter() - start_time) * 1000

    return ParsedPDFResult(
        success=True,
        page_count=len(pages_output),
        total_characters=total_chars,
        pages=pages_output,
        raw_text=all_text,
        is_scanned=is_scanned,
        ocr_applied=ocr_applied,
        ocr_message=ocr_message,
        extraction_engine=engine_used,
        processing_time_ms=round(elapsed_ms, 2),
    )
