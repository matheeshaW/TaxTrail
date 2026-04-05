export default function CurrencyBadge({ item }) {
  if (item.convertedAmount == null) {
    return <span>{item.amount} LKR</span>;
  }

  return (
    <div>
      <span className="font-semibold">
        {item.convertedAmount} {item.convertedCurrency}
      </span>
      <span className="text-xs text-gray-500 ml-2">
        ({item.amount} LKR)
      </span>
    </div>
  );
}