# CareerGap AI — Security, Privacy & Compliance Architecture

## 1. Threat Model & Defenses

CareerGap AI processes untrusted PDF documents and job descriptions. Below are the defenses deployed across every layer:

### 1.1 Document Upload Sanitization
* **File Type Verification**: Validates file extension (`.pdf`), MIME type (`application/pdf`), and standard PDF magic header bytes (`%PDF-`). Non-compliant files are rejected with HTTP 422.
* **Payload Size Limits**: Strict 10 MB maximum request entity size enforced at both reverse proxy and FastAPI application layers (`HTTP 413`).
* **Decompression Bomb Protection**: PyMuPDF stream parsing enforces a hard limit of 20 pages per document.
* **Safe Parser Sandbox**: Document execution engines (JavaScript in PDF, embedded binary macros) are disabled during text extraction.

### 1.2 Prompt Injection & Adversarial Text Defense
* **Untrusted Input Boundaries**: Resume text and user-submitted job descriptions are treated as untrusted strings.
* **Isolation from System Instructions**: Document text is never interpolated into privileged system instructions or executable shell commands.
* **Deterministic Fallback Independence**: The deterministic scoring and parsing engines run independently of external LLM APIs, preventing prompt injection attacks from manipulating scores.

### 1.3 Data Privacy & Zero Retention Policy
* **Zero Commercial Retention**: Candidate documents are never used to train public machine learning models.
* **Client-Side Session Isolation**: Session data and local history remain in client storage unless explicitly synced.
* **User-Initiated Purge**: Users can permanently delete their resumes, analyses, and learning roadmaps via the Settings page (`DELETE /api/resumes/{id}` and client localStorage purge).

### 1.4 API Security & CORS
* **CORS Restrictions**: Configured strictly for authorized frontend origins (`localhost:3000`, `127.0.0.1:3000`).
* **Safe Error Handling**: Unhandled exceptions are intercepted by a global exception handler that logs internally while returning generic error IDs without leaking call stacks or database credentials.
* **Environment Credentials**: API keys (`AI_API_KEY`, database secrets) are stored exclusively in environment variables and never bundled in client-side JavaScript.
