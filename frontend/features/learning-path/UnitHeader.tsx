import React from "react";
import { BookOpen, Sparkles } from "lucide-react";

interface UnitHeaderProps {
  unitNumber: number;
  title: string;
  description?: string;
  colorHex?: string;
}

export const UnitHeader: React.FC<UnitHeaderProps> = ({
  unitNumber,
  title,
  description = "Form basic sentences, greet people, and introduce yourself.",
  colorHex = "#58CC02",
}) => {
  return (
    <div
      style={{ backgroundColor: colorHex }}
      className="w-full rounded-3xl p-6 text-white shadow-duo relative overflow-hidden mb-8"
    >
      <div className="flex items-center justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 text-white px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-widest">
              Unit {unitNumber}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Fredoka'] mb-1">
            {title}
          </h2>
          <p className="text-white/90 text-sm font-semibold max-w-md">{description}</p>
        </div>

        <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/20 items-center justify-center backdrop-blur-sm">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};
