export default function PreviewTable({ previewData, onConfirm, processing, darkMode }) {
  if (!previewData) return null;

  const columns = Object.keys(previewData.data[0] || {});

  return (
    <div className={`rounded-lg shadow p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-4">
       <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Preview ({previewData.totalRows} rows)
        </h2>
        <button
          onClick={onConfirm}
          disabled={processing}
          className="bg-green-600 text-white px-6 py-2 rounded-md
                     hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
        >
          {processing && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {processing ? 'Processing with AI...' : 'Confirm Import'}
        </button>
      </div>

      <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-md">
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
            {previewData.data.map((row, i) => (
              <tr key={i} className="border-t">
                {Object.values(row).map((val, j) => (
                  <td key={j} className={`px-4 py-2 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}