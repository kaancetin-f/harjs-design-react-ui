import React, { memo } from "react";
import { ColumnGroupSegment } from "../Helpers";

type Props = {
  groups: ColumnGroupSegment[];
  hasSelection?: boolean;
  hasSubrow?: boolean;
};

const GroupRow = ({ groups, hasSelection, hasSubrow }: Props) => {
  return (
    <tr className="column-groups">
      {hasSelection && (
        <th className="selection-col sticky sticky-left" data-sticky-position="left" aria-hidden="true" />
      )}
      {hasSubrow && (
        <th className="subrow-col sticky sticky-left" data-sticky-position="left" aria-hidden="true" />
      )}

      {groups.map((segment) => {
        // refs
        const _className = [
          "column-group",
          segment.title ? "has-title" : "is-empty",
          segment.color && `color-${segment.color}`,
          `align-${segment.align}`,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <th key={segment.key} colSpan={segment.colSpan} className={_className} scope="colgroup">
            {segment.title ? <span className="column-group-title">{segment.title}</span> : null}
          </th>
        );
      })}
    </tr>
  );
};

export default memo(GroupRow);
