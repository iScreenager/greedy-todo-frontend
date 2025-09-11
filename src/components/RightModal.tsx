"use client";

import { X } from "lucide-react";

interface RightModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export default function RightModal({
  isOpen,
  onClose,
  title,
  children,
  width = "w-80",
}: RightModalProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "translate-x-full"} ${width}`}>
        <div className="flex items-center justify-between p-6 ">
          <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer">
            <X size={20} color="grey" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-full pb-20">{children}</div>
      </div>
    </>
  );
}
