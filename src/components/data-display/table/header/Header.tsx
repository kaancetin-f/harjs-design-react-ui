import React, { Dispatch, memo, ReactNode, SetStateAction } from "react";
import { Actions } from "../IProps";
import ActionButtons from "./ActionButtons";
import Flex from "../../../layout/grid-system/flex/Flex";

interface IProps {
  states: {
    createTrigger: { get: boolean; set: Dispatch<SetStateAction<boolean>> };
  };
  title?: string;
  titleId?: string;
  description?: string;
  actions?: Actions;
  extra?: ReactNode;
  tools?: ReactNode;
  locale?: Intl.LocalesArgument;
}

const Header = ({ states, title, titleId, description, actions, extra, tools, locale }: IProps) => {
  const hasTitle = Boolean(title || description);
  const hasToolbar = Boolean(extra || tools || actions);

  return (
    <div className="header">
      {hasTitle && (
        <div className="title">
          {title ? <h4 id={titleId}>{title}</h4> : null}
          {description && <h5>{description}</h5>}
        </div>
      )}

      {hasToolbar && (
        <Flex className="toolbar" flexWrap="wrap" alignItems="center" gap="var(--space-8)">
          {extra ? (
            <Flex className="toolbar-start" flexWrap="wrap" alignItems="center" gap="var(--space-8)">
              {extra}
            </Flex>
          ) : null}

          {extra && (tools || actions) ? <span className="toolbar-divider" aria-hidden /> : null}

          {(tools || actions) && (
            <Flex className="toolbar-end" flexWrap="wrap" alignItems="center" gap="var(--space-8)">
              {tools}
              {tools && actions ? <span className="toolbar-divider" aria-hidden /> : null}
              {actions && <ActionButtons states={states} actions={actions} locale={locale} />}
            </Flex>
          )}
        </Flex>
      )}
    </div>
  );
};

Header.displayName = "Table.Header";
export default memo(Header);
