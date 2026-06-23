interface INotificationLocale {
  // 200 OK -> GET Processes
  "Notification.200.Title": string;
  "Notification.200.Message": string;
  "Notification.200.Login.Title": string;
  "Notification.200.Login.Message": string;

  // 201 Created -> POST Processes
  "Notification.201.Title": string;
  "Notification.201.Message": string;

  // 202 Accepted -> Processing
  "Notification.202.Title": string;
  "Notification.202.Message": string;

  // 204 No Content -> PUT Processes
  "Notification.204.Title": string;
  "Notification.204.Message": string;
  "Notification.204.Delete.Title": string;
  "Notification.204.Delete.Message": string;

  // 301 Moved Permanently
  "Notification.301.Title": string;
  "Notification.301.Message": string;

  // 302 Found
  "Notification.302.Title": string;
  "Notification.302.Message": string;

  // 304 Not Modified
  "Notification.304.Title": string;
  "Notification.304.Message": string;

  // 307 Temporary Redirect
  "Notification.307.Title": string;
  "Notification.307.Message": string;

  // 400 Bad Request
  "Notification.400.Title": string;
  "Notification.400.Message": string;

  // 401 Unauthorized
  "Notification.401.Title": string;
  "Notification.401.Message": string;

  // 403 Forbidden
  "Notification.403.Title": string;
  "Notification.403.Message": string;

  // 404 Not Found
  "Notification.404.Title": string;
  "Notification.404.Message": string;

  // 405 Method Not Allowed
  "Notification.405.Title": string;
  "Notification.405.Message": string;

  // 406 Not Acceptable
  "Notification.406.Title": string;
  "Notification.406.Message": string;

  // 408 Request Timeout
  "Notification.408.Title": string;
  "Notification.408.Message": string;

  // 409 Conflict
  "Notification.409.Title": string;
  "Notification.409.Message": string;

  // 410 Gone
  "Notification.410.Title": string;
  "Notification.410.Message": string;

  // 413 Payload Too Large
  "Notification.413.Title": string;
  "Notification.413.Message": string;

  // 415 Unsupported Media Type
  "Notification.415.Title": string;
  "Notification.415.Message": string;

  // 429 Too Many Requests
  "Notification.429.Title": string;
  "Notification.429.Message": string;

  // 500 Internal Server Error
  "Notification.500.Title": string;
  "Notification.500.Message": string;

  // 501 Not Implemented
  "Notification.501.Title": string;
  "Notification.501.Message": string;

  // 502 Bad Gateway
  "Notification.502.Title": string;
  "Notification.502.Message": string;

  // 503 Service Unavailable
  "Notification.503.Title": string;
  "Notification.503.Message": string;

  // 504 Gateway Timeout
  "Notification.504.Title": string;
  "Notification.504.Message": string;

  // 505 HTTP Version Not Supported
  "Notification.505.Title": string;
  "Notification.505.Message": string;
}

export default INotificationLocale;
