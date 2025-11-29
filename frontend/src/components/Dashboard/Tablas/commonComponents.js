import PropTypes from 'prop-types'

export function TableRow({ row, idx }) {
  const rowKey = row._id || row.id || Object.values(row).join('-') + '-' + idx;
  return (
    <tr className="hover:bg-gray-50">
      {Object.entries(row).map(([colKey, value]) => (
        <td key={rowKey + '-' + colKey} className="px-4 py-3 text-sm text-gray-900">
          {String(value)}
        </td>
      ))}
    </tr>
  );
}
TableRow.propTypes = {
  row: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
};

export function MobileCard({ row, idx }) {
  return (
    <div className="bg-white rounded-lg shadow p-3 mb-2 border md:hidden">
      {Object.entries(row).map(([key, value]) => (
        <div key={key} className="flex justify-between py-1 text-sm">
          <span className="font-semibold text-gray-700">{key}:</span>
          <span className="text-gray-900">{String(value)}</span>
        </div>
      ))}
    </div>
  );
}
MobileCard.propTypes = {
  row: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
};
