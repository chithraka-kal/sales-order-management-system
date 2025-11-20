// Simple Input Field
export const LabelInput = ({ label, value, onChange, name, type = "text", readOnly = false }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 ${
        readOnly ? "bg-gray-100" : "bg-white"
      }`}
    />
  </div>
);

// Select Dropdown
export const LabelSelect = ({ label, value, onChange, name, options, placeholder = "Select..." }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-500"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);