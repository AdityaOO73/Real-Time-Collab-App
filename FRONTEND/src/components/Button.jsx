const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-full bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition flex items-center justify-center"
    >
      {text}
    </button>
  );
};

export default Button;
