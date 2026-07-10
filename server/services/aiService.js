const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Allowed values (assignment ke rules ke according)
const CRM_STATUS_VALUES = ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE'];
const DATA_SOURCE_VALUES = ['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots'];

// Ek batch ko AI ko bhejne wala function
const mapRowsWithAI = async (rows) => {
  const today = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const rowsWithIndex = rows.map((row, i) => ({ _idx: i, ...row }));

  const prompt = `You are a CRM data mapping assistant. You will receive raw CSV rows with unknown/inconsistent column names.
Each row has an "_idx" field. You MUST include this exact same "_idx" value (unchanged) in your output for that row.
Map each row into this exact CRM JSON structure:
- created_at (must be parseable by JavaScript's new Date(). If no date/timestamp information exists in the row, use "${today}" instead of leaving it blank or using a placeholder date like 1970-01-01)
- name
- email
- country_code
- mobile_without_country_code
- company
- city
- state
- country
- lead_owner
- crm_status (ONLY one of: ${CRM_STATUS_VALUES.join(', ')}, else leave blank)
- crm_note (put remarks, extra emails/phones, extra info here)
- data_source (ONLY one of: ${DATA_SOURCE_VALUES.join(', ')}, else leave blank)
- possession_time
- description (put any general remarks, comments, or lead-stage descriptions here that aren't already captured elsewhere)

Important: Column names can be misleading or generic. Always check the ACTUAL VALUE in each field, not just the column header. If a column named "city" or "notes" contains a value like "someone@email.com", you MUST extract it and place it in the "email" field — do not just note it exists, actually move the value to the correct output field. Do NOT treat a lead owner/assigned-to email as the lead's own email or contact info.

Rules:
- If multiple emails exist, use the first one; put the rest in crm_note.
- If multiple phone numbers exist, use the first one; put the rest in crm_note.
- If a row has neither an email nor a phone number (excluding any lead owner/assigned-to field), mark it as "skip": true.
- In crm_note, only include labels for fields that actually have a non-empty value. Do not include empty or blank labels like "Field Name: " with nothing after it.
- Do NOT include the lead owner/assigned-to email or phone number anywhere in crm_note, email, or mobile_without_country_code — that information belongs only in the lead_owner field.
- Return ONLY a valid JSON array, no explanation, no markdown formatting, no backticks.
- country_code (the phone/calling code only, e.g. "+91" or "91" — NOT the country name. Leave blank if not determinable from a phone number.)
Raw rows:
${JSON.stringify(rowsWithIndex, null, 2)}

Return format (JSON array only):
[
  { "_idx": 0, "skip": false, "created_at": "...", "name": "...", "email": "...", ... },
  { "_idx": 1, "skip": true }
]`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
    max_tokens: 8000,
  });

  const responseText = completion.choices[0].message.content;
  const cleaned = responseText.replace(/```json|```/g, '').trim();

  let results;
  try {
    results = JSON.parse(cleaned);
  } catch (parseErr) {
    console.log('RAW AI RESPONSE (parse failed):', responseText);
    throw new Error('AI returned invalid JSON: ' + parseErr.message);
  }

  return results.map(({ _idx, ...rest }) => rest);
};

// Retry wrapper - agar AI call fail ho jaye, thoda ruk ke dobara try karo
const mapRowsWithRetry = async (rows, maxRetries = 2) => {
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await mapRowsWithAI(rows);
    } catch (err) {
      console.log(`Attempt ${attempt} failed:`, err.message);
      if (attempt === maxRetries + 1) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

module.exports = { mapRowsWithAI, mapRowsWithRetry };
