  const WiseInput = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-[14px] font-semibold mb-2 text-[#454745]">{label}</label>
    <input 
      {...props}
      className="w-full p-4 border border-[rgba(14,15,12,0.12)] rounded-[10px] focus:ring-1 focus:ring-inset focus:ring-[#868685] outline-none transition-all"
    />
  </div>
);


export default WiseInput;