import React from 'react';

interface TabButtonProps {
  active?: boolean;
  label: string;
  onClick?: () => void;
};

const TabButton = ({ label, active, onClick }: TabButtonProps) => {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "rounded-lg px-3 py-1.5 text-sm outline-none",
        active
          ? "bg-white/10 text-white shadow-inner ring-1 ring-white/20"
          : "text-white/70 hover:bg-white/5 hover:text-white",
      ].join(" ")}
    >
      {label}
    </button>
  );
};

export default TabButton;
