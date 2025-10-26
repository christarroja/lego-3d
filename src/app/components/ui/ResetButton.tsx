"use client";

interface ResetButtonProps {
  onReset: () => void;
}

export function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button
      onClick={onReset}
      className="fixed top-5 right-5 z-[1000] px-6 py-3 bg-[#0055BF] hover:bg-[#003D8F] text-white rounded-lg cursor-pointer text-base font-bold shadow-lg transition-colors"
    >
      🔄 Reset
    </button>
  );
}
