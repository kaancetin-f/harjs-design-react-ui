import { Property } from "csstype";
import { IChildrenProps } from "../../../../libs/infrastructure/types/IGlobalProps";

interface IProps extends IChildrenProps {
  flexDirection?: Property.FlexDirection;
  flexWrap?: Property.FlexWrap;

  justifyContent?: Property.JustifyContent;
  alignItems?: Property.AlignItems;
  alignContent?: Property.AlignContent;
  alignSelf?: Property.AlignSelf;

  flex?: Property.Flex;
  flexGrow?: Property.FlexGrow;
  flexShrink?: Property.FlexShrink;
  flexBasis?: Property.FlexBasis;

  gap?: Property.Gap;
  rowGap?: Property.RowGap;
  columnGap?: Property.ColumnGap;
}

export default IProps;
