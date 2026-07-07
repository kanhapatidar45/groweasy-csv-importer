const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Allowed values (assignment ke rules ke according)
const CRM_STATUS_VALUES = ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE'];
const DATA_SOURCE_VALUES = ['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots'];

// Ek batch (rows ka chhota group) ko AI ko bhejne wala function
const mapRowsWithAI = async (rows) => {
  const prompt = `You are a CRM data mapping assistant. You will receive raw CSV rows with unknown/inconsistent column names.

Map each row into this exact CRM JSON structure:
- created_at (must be parseable by JavaScript's new Date())
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
- description

Rules:
- If multiple emails exist, use the first one; put the rest in crm_note.
- If multiple phone numbers exist, use the first one; put the rest in crm_note.
- If a row has neither an email nor a phone number, mark it as "skip": true.
- Return ONLY a valid JSON array, no explanation, no markdown formatting, no backticks.

Raw rows:
${JSON.stringify(rows, null, 2)}

Return format (JSON array only):
[
  { "skip": false, "created_at": "...", "name": "...", "email": "...", ... },
  { "skip": true }
]`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  });

  const responseText = completion.choices[0].message.content;

  // AI kabhi-kabhi ```json ... ``` mein wrap kar deta hai, usko clean karte hain
  const cleaned = responseText.replace(/```json|```/g, '').trim();

  return JSON.parse(cleaned);
};

module.exports = { mapRowsWithAI };