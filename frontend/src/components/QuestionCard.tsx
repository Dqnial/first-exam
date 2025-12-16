import type { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  qNumber: number;
  question: string;
  options: string[];
  selected: number | number[];
  onSelect: (idx: number) => void;
  multiple?: boolean;
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
    <div className="rounded-xl border bg-background p-6 shadow-sm text-foreground">
      <p className="mb-5 text-lg font-semibold">
        {qNumber}. {question}
      </p>

      {multiple ? (
        <div className="space-y-3">
          {options.map((opt, idx) => {
            const isSelected = selectedArray.includes(idx);
            return (
              <div
                key={idx}
                onClick={() => onSelect(idx)}
                className={`flex items-center gap-3 rounded-lg border p-3 transition cursor-pointer
                  ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  }
                `}
              >
                <Checkbox checked={isSelected} />
                <span className="text-sm font-medium select-none">{opt}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <RadioGroup
          value={selected !== undefined ? String(selected) : undefined}
          onValueChange={(val) => onSelect(Number(val))}
          className="space-y-3"
        >
          {options.map((opt, idx) => {
            const isSelected = selected === idx;
            return (
              <div
                key={idx}
                onClick={() => onSelect(idx)}
                className={`flex items-center gap-3 rounded-lg border p-3 transition cursor-pointer
                  ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  }
                `}
              >
                <RadioGroupItem
                  id={`q${qNumber}-opt${idx}`}
                  value={String(idx)}
                  className="cursor-pointer"
                />
                <span className="text-sm font-medium select-none">{opt}</span>
              </div>
            );
          })}
        </RadioGroup>
      )}
    </div>
  );
};

export default QuestionCard;
