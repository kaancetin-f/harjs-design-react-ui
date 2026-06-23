import { Direction, Status } from "../../../libs/core/application/contexts/Notification";

interface IProps {
  title: string;
  message?: string;
  status: Status | number;
  direction: Direction;
  trigger: boolean;
}

export default IProps;
