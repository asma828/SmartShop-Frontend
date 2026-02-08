function ItemsPerPageSelector({ value, onChange }) {
  const options = [6, 9, 12, 18, 24]

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
        Éléments par page:
      </label>
      <select
        id="itemsPerPage"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="input-field py-1 px-2 text-sm w-20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ItemsPerPageSelector