export default function ResultTable({ resultData }) {
  if (!resultData) return null;

  const { importedRecords, skippedRecords, totalImported, totalSkipped } = resultData;
  const columns = importedRecords.length > 0
    ? Object.keys(importedRecords[0]).filter((k) => k !== 'skip')
    : [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">AI Processing Result</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-sm text-green-700">Total Imported</p>
          <p className="text-2xl font-bold text-green-800">{totalImported}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-700">Total Skipped</p>
          <p className="text-2xl font-bold text-red-800">{totalSkipped}</p>
        </div>
      </div>

      {importedRecords.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2 text-gray-700">
            Successfully Parsed Records
          </h3>
          <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-md">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importedRecords.map((row, i) => (
                  <tr key={i} className="border-t">
                    {columns.map((col, j) => (
                      <td key={j} className="px-4 py-2 text-gray-600 whitespace-nowrap">
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {skippedRecords.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-2 text-gray-700">
            Skipped Records ({skippedRecords.length})
          </h3>
          <p className="text-sm text-gray-500">
            These records had neither an email nor a mobile number.
          </p>
        </div>
      )}
    </div>
  );
}