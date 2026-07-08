export default function ResultTable({ resultData, darkMode }) {
  if (!resultData) return null;

  const { importedRecords, skippedRecords, totalImported, totalSkipped } = resultData;
  const columns = importedRecords.length > 0
    ? Object.keys(importedRecords[0]).filter((k) => k !== 'skip')
    : [];

  return (
    <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Processing Result</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`border rounded-md p-4 ${darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'}`}>
          <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Total Imported</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>{totalImported}</p>
        </div>
        <div className={`border rounded-md p-4 ${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>Total Skipped</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>{totalSkipped}</p>
        </div>
      </div>

      {importedRecords.length > 0 && (
        <div className="mb-6">
          <h3 className={`text-md font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Successfully Parsed Records
          </h3>
          <div className={`overflow-x-auto max-h-96 overflow-y-auto border rounded-md ${darkMode ? 'border-gray-700' : ''}`}>
            <table className="min-w-full text-sm">
              <thead className={`sticky top-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <tr>
                  {columns.map((col) => (
                    <th key={col} className={`px-4 py-2 text-left font-medium whitespace-nowrap ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importedRecords.map((row, i) => (
                  <tr key={i} className={`border-t ${darkMode ? 'border-gray-700' : ''}`}>
                    {columns.map((col, j) => (
                      <td key={j} className={`px-4 py-2 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
          <h3 className={`text-md font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Skipped Records ({skippedRecords.length})
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            These records had neither an email nor a mobile number.
          </p>
        </div>
      )}
    </div>
  );
}