const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { mapRowsWithAI } = require('../services/aiService');
const previewCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const fileContent = fs.readFileSync(req.file.path, 'utf-8');

    const results = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      totalRows: results.length,
      data: results,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to parse CSV', details: err.message });
  }
};

// Step 2: Take confirmed CSV rows, send to AI in batches, return CRM formatted result
const processWithAI = async (req, res) => {
  const { rows } = req.body; // frontend se confirmed rows aayenge

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'No rows provided' });
  }

  try {
    const BATCH_SIZE = 20; // ek baar mein AI ko 20 rows bhejenge
    const batches = [];

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      batches.push(rows.slice(i, i + BATCH_SIZE));
    }

    let allResults = [];

    for (const batch of batches) {
      const mapped = await mapRowsWithAI(batch);
      allResults = allResults.concat(mapped);
    }

    const imported = allResults.filter((r) => !r.skip);
    const skipped = allResults.filter((r) => r.skip);

    res.json({
      success: true,
      totalImported: imported.length,
      totalSkipped: skipped.length,
      importedRecords: imported,
      skippedRecords: skipped,
    });
  } catch (err) {
    res.status(500).json({ error: 'AI processing failed', details: err.message });
  }
};
module.exports = { previewCSV, processWithAI };