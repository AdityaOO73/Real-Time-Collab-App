const Input = ({ type = "text", placeholder, value, onChange, error }) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-3xl bg-[var(--card)] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
