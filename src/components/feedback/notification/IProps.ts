import {
  Direction,
  NotificationCommand,
  Status,
} from "../../../libs/core/application/contexts/Notification";

interface IProps {
  title?: string;
  message?: string;
  status?: Status | number;
  direction?: Direction;
  trigger?: boolean;
  /**
   * Auto-dismiss delay in milliseconds. Default `3000`.
   * `0` or `Infinity` keeps the toast until it is updated or closed.
   */
  duration?: number;
  command?: NotificationCommand | null;
}

export default IProps;
