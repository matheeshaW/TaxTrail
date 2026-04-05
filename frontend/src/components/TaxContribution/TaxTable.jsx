import useAuth from "../../hooks/useAuth";

export default function TaxTable({ data, onEdit, onDelete }) {
  const { user } = useAuth();


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
            {user?.role === "Admin" && <th className="p-2">Actions</th>}
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
              {user?.role === "Admin" && (
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded bg-amber-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-amber-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}