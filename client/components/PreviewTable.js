export default function PreviewTable({ previewData, onConfirm, processing }) {
  if (!previewData) return null;

  const columns = Object.keys(previewData.data[0] || {});

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
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
            {previewData.data.map((row, i) => (
              <tr key={i} className="border-t">
                {Object.values(row).map((val, j) => (
                  <td key={j} className="px-4 py-2 text-gray-600 whitespace-nowrap">
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