# GrowEasy AI CSV Importer

An AI-powered CSV importer that intelligently extracts CRM lead information from any CSV format — regardless of column names, layout, or structure — and maps it into GrowEasy's standardized CRM format.

**Live App:** https://groweasy-csv-importer-iota.vercel.app/
**Backend API:** https://groweasy-csv-importer-production-b105.up.railway.app

---

## The Problem

Leads come in from many sources — Facebook exports, Google Ads, manually created spreadsheets, other CRMs — and each one uses different column names and layouts. Manually mapping every format is unsustainable.

This tool solves that by using an LLM to understand the *meaning* of each column and value, rather than relying on hardcoded column-name rules. Any CSV goes in; a clean, standardized set of CRM records comes out.

---

## How It Works

1. **Upload** — User uploads a CSV (drag & drop or file picker).
2. **Preview** — The raw CSV is parsed and shown in a table exactly as uploaded. No AI processing happens at this stage.
3. **Confirm** — Only after the user clicks "Confirm Import" does the data get sent to the backend for AI processing.
4. **AI Mapping** — The backend batches the rows and sends them to an LLM (Llama 3.3 70B via Groq) with a structured prompt that:
   - Maps arbitrary columns to the 15 required CRM fields
   - Detects email/phone values even in oddly-named or ambiguous columns
   - Enforces the fixed enum values for `crm_status` and `data_source`
   - Moves extra emails, phone numbers, and remarks into `crm_note`
   - Marks records with neither an email nor a phone number as skipped
5. **Result** — The frontend displays imported records, skipped records, and totals in a responsive table.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), Tailwind CSS |
| Backend | Node.js, Express |
| AI | Groq API — Llama 3.3 70B Versatile |
| CSV Parsing | `csv-parse` |
| File Upload | Multer |
| Deployment | Vercel (frontend), Railway (backend) |

The project is intentionally stateless — no database. CSVs are processed in memory per request and nothing is persisted server-side, per the assignment's "database optional" allowance.

---

## Features

- Drag & drop and file-picker CSV upload
- Responsive preview table with sticky headers and horizontal/vertical scroll
- AI-powered field mapping that works across arbitrary column layouts
- Batch processing (20 rows per AI call) for scalability on large files
- Automatic retry (up to 2 retries) if an AI batch call fails
- Skip logic for records with no usable contact info
- Dark mode
- Loading and progress indicators during upload and AI processing
- Graceful error handling on both frontend and backend

---

## Project Structure

```
groweasy-csv-importer/
├── client/                    # Next.js frontend
│   ├── app/
│   │   └── page.js            # Main page — state and API calls
│   └── components/
│       ├── UploadBox.js       # Drag & drop / file picker
│       ├── PreviewTable.js    # Raw CSV preview
│       └── ResultTable.js     # AI-processed results
│
└── server/                    # Express backend
    ├── index.js                # App entry point
    ├── routes/
    │   └── uploadRoutes.js      # /api/upload/preview, /api/upload/process
    ├── controllers/
    │   └── uploadController.js  # Request handling, batching
    └── services/
        └── aiService.js         # Prompt design, Groq API calls, retry logic
```

---

## API Endpoints

### `POST /api/upload/preview`
Accepts a CSV file (`multipart/form-data`, field name `file`), parses it, and returns the raw rows.

```json
{
  "success": true,
  "totalRows": 3,
  "data": [ { "...": "..." } ]
}
```

### `POST /api/upload/process`
Accepts confirmed rows and returns AI-mapped CRM records.

**Request:**
```json
{ "rows": [ { "...": "..." } ] }
```

**Response:**
```json
{
  "success": true,
  "totalImported": 10,
  "totalSkipped": 3,
  "importedRecords": [ { "...": "..." } ],
  "skippedRecords": [ { "...": "..." } ]
}
```

---

## Running Locally

### Prerequisites
- Node.js (v18+)
- A free Groq API key from [console.groq.com/keys](https://console.groq.com/keys)

### 1. Clone the repo
```bash
git clone https://github.com/kanhapatidar45/groweasy-csv-importer.git
cd groweasy-csv-importer
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
```

Run the backend:
```bash
npm run dev
```
Backend runs on `http://localhost:5000`.

### 3. Frontend setup
```bash
cd ../client
npm install
```

(Optional) Create a `.env.local` in `client/` if you want to point at a different backend:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api/upload
```

Run the frontend:
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`.

---

## Design Decisions

**Why no hardcoded column-mapping rules?**
A rules-based approach (`if column name includes "phone"...`) breaks the moment a new, unanticipated column name appears. Since the assignment's core challenge is handling arbitrary, messy formats, the mapping logic is delegated to the LLM, which reasons over actual field values rather than just column labels.

**Why Groq (Llama 3.3) instead of OpenAI/Gemini/Claude?**
The assignment permits "any equivalent LLM." Groq's free tier was used for cost-effective, fast inference during development, with an OpenAI-compatible API that makes it straightforward to swap providers if needed.

**Why stateless (no database)?**
The assignment explicitly allows this. Since there's no requirement to persist import history, keeping the app stateless reduces complexity and surface area for bugs.

**Batching and retries**
Rows are sent to the AI in batches of 20 to stay within reasonable token limits per request and to keep failures isolated to a single batch rather than the whole import. Each batch automatically retries up to twice on failure before surfacing an error.

---

## Known Limitations

- LLM output has minor non-determinism — in rare cases, an optional field's formatting (e.g. `+91` vs `91` for `country_code`) may vary slightly between runs of the same input. Core mapping accuracy and skip logic remain consistent.
- Very large CSVs (thousands of rows) will take proportionally longer as batches are processed sequentially.

---

## Submission

**Position applied for:** Software Developer Intern
