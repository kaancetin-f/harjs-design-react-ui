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
  locale?: Intl.LocalesArgument;
}

const Header = ({ states, title, titleId, description, actions, extra, locale }: IProps) => {
  // Başlık solda, aksiyonlar ve extra içerik sağdaki toolbar'da durur.
  return (
    <div className="header">
      <div className="title">
        {title ? <h4 id={titleId}>{title}</h4> : null}
        {description && <h5>{description}</h5>}
      </div>

      <Flex className="toolbar" alignItems="center" gap="var(--space-8)">
        {extra}
        {actions && <ActionButtons states={states} actions={actions} locale={locale} />}
      </Flex>
    </div>
  );
};

Header.displayName = "Table.Header";
export default memo(Header);
