import type { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Props {
  qNumber: number;
  question: string;
  options: string[];
  selected: number | number[];
  onSelect: (idx: number) => void;
  multiple?: boolean; // если true — несколько вариантов можно выбрать
}

const QuestionCard: FC<Props> = ({
  qNumber,
  question,
  options,
  selected,
  onSelect,
  multiple,
}) => {
  const selectedArray = Array.isArray(selected) ? selected : [];

  return (
    <div className="border p-5 rounded-lg shadow-sm bg-white">
      <p className="font-semibold mb-4 text-lg">
        {qNumber}. {question}
      </p>

      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => (
          <label
            key={idx}
            className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {multiple ? (
              <>
                <Checkbox
                  checked={selectedArray.includes(idx)}
                  onCheckedChange={() => onSelect(idx)}
                  className="w-5 h-5"
                />
                <span className="text-base font-semibold">{opt}</span>
              </>
            ) : (
              <RadioGroup
                value={
                  typeof selected === "number" ? String(selected) : undefined
                }
                onValueChange={(val) => onSelect(Number(val))}
                className="flex items-center gap-3 w-full"
              >
                <RadioGroupItem
                  id={`q${qNumber}-opt${idx}`}
                  value={String(idx)}
                  className="w-5 h-5"
                />
                <Label
                  htmlFor={`q${qNumber}-opt${idx}`}
                  className="text-base font-semibold"
                >
                  {opt}
                </Label>
              </RadioGroup>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
