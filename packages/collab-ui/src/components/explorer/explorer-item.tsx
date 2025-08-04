import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export function ExplorerItem({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <ul>
      <li>
        <div className="flex items-center bg-neutral-400 px-1">
          <div
            className="flex-grow cursor-pointer flex gap-1 items-center"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <span>
              {isExpanded ? (
                <ChevronDown size={"1em"} />
              ) : (
                <ChevronRight size={"1em"} />
              )}
            </span>
            <span>{title}</span>
          </div>
          <div>{actions}</div>
        </div>
        {isExpanded && children}
      </li>
    </ul>
  );
}
