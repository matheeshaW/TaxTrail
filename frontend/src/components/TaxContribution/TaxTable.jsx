export default function TaxTable({ data }) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Type</th>
            <th className="p-2">Income</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Year</th>
            <th className="p-2">Region</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="border-t">
              <td className="p-2">{item.taxType}</td>
              <td className="p-2">{item.incomeBracket}</td>
              <td className="p-2">
                {item.convertedAmount || item.amount}
              </td>
              <td className="p-2">{item.year}</td>
              <td className="p-2">
                {item.region?.regionName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}