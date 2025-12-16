import type { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface QuestionCardProps {
  qNumber: number;
  question: string;
  options: string[];
  selected?: number;
  onSelect: (index: number) => void;
}

const QuestionCard: FC<QuestionCardProps> = ({
  qNumber,
  question,
  options,
  selected,
  onSelect,
}) => {
  return (
    <Card className="mb-4">
      <CardContent>
        <p className="font-medium mb-2">
          {qNumber}. {question}
        </p>
        {options.map((opt, idx) => (
          <label key={idx} className="block cursor-pointer mb-1">
            <input
              type="radio"
              className="mr-2"
              checked={selected === idx}
              onChange={() => onSelect(idx)}
            />
            {opt}
          </label>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
