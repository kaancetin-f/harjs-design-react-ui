export type CalendarEvent = {
  start: Date;
  end: Date;
};

interface IProps<T> {
  trackedBy: keyof (T & CalendarEvent);
  data: (T & CalendarEvent)[];
  renderItem: (item: T, index: number) => React.JSX.Element;
  config?: {
    locale?: Intl.LocalesArgument;
    weekStartsOn?: number;
  };
}

export default IProps;
