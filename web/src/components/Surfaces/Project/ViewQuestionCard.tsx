import { PlusIcon } from "@heroicons/react/24/outline";

import CircularProgress from "../../Feedback/CircularProgress";
import Button from "../../Inputs/Button";
import CustomPopover from "../../Inputs/CustomPopover";
import Card from "../Card";

interface Props {
  isLoading?: boolean;
  className?: string;
}

export default function ViewQuestionCard({ isLoading, className = "" }: Props) {
  return (
    <Card className={`p-4 ${className}`}>
      <div className={"flex items-center justify-between"}></div>
      {isLoading ? (
        <CircularProgress className={"mx-auto my-12 scale-[200%]"} />
      ) : (
        <div className={"flex flex-col gap-4"}>
          Captions will be displayed here
        </div>
      )}
    </Card>
  );
}
