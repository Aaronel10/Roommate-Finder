import { Bars4Icon } from "@heroicons/react/24/outline";

import CircularProgress from "../../Feedback/CircularProgress";
import Button from "../../Inputs/Button";
import CustomPopover from "../../Inputs/CustomPopover";
import Card from "../Card";

interface Props {
  titlesData: {
    type: "Imagined" | "Imported";
    titles: string[];
  }[];
  isLoading?: boolean;
  className?: string;
}

export default function QuestionsCard({
  titlesData,
  isLoading,
  className = "",
}: Props) {
  return (
    <Card className={`p-4 ${className}`}>
      <div className={"flex items-center justify-between"}>
        <h1 className={"text-xl"}>Survey Questions</h1>
      </div>
      {isLoading ? (
        <CircularProgress className={"mx-auto my-12 scale-[200%]"} />
      ) : (
        <div className={"flex flex-col gap-4"}>
          {titlesData.map((data, index) => (
            <div key={index} className={"flex flex-col gap-2"}>
              <h1 className={"text-lg"}>{data.type}</h1>
              <div className={"flex flex-col gap-2"}>
                {data.titles.map((title, index) => (
                  <div key={index} className={"flex items-center gap-2"}>
                    <div className={"h-4 w-4 rounded-full bg-blue-500"} />
                    <p>{title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
