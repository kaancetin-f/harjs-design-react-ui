import INotificationLocale from "./INotificationLocale";

const NotificationEN: INotificationLocale = {
  // 200 OK -> GET Processes
  "Notification.200.Title": "Operation Successful",
  "Notification.200.Message": "Data was successfully retrieved.",
  "Notification.200.Login.Title": "Login Successful",
  "Notification.200.Login.Message": "Your login was successfully completed. You now have access to all features.",

  // 201 Created -> POST Processes
  "Notification.201.Title": "Record Created",
  "Notification.201.Message": "The record was successfully created.",

  // 202 Accepted -> Processing
  "Notification.202.Title": "Request Accepted",
  "Notification.202.Message": "The request has been accepted and is being processed.",

  // 204 No Content -> PUT Processes
  "Notification.204.Title": "Operation Successful",
  "Notification.204.Message": "The content has been updated.",
  "Notification.204.Delete.Title": "Removal Successful",
  "Notification.204.Delete.Message": "The removal process was successful.",

  // 301 Moved Permanently
  "Notification.301.Title": "Moved Permanently",
  "Notification.301.Message": "The resource has been permanently moved to a new location.",

  // 302 Found
  "Notification.302.Title": "Temporary Redirect",
  "Notification.302.Message": "The resource is temporarily located at a different location.",

  // 304 Not Modified
  "Notification.304.Title": "No Changes",
  "Notification.304.Message": "No changes were made to the resource.",

  // 307 Temporary Redirect
  "Notification.307.Title": "Temporary Redirect",
  "Notification.307.Message": "The resource has been temporarily redirected to another location.",

  // 400 Bad Request
  "Notification.400.Title": "Invalid Request",
  "Notification.400.Message": "The request is invalid. Please check the data you submitted.",

  // 401 Unauthorized
  "Notification.401.Title": "Unauthorized Access",
  "Notification.401.Message": "Valid authentication credentials are required to perform this action.",

  // 403 Forbidden
  "Notification.403.Title": "Access Denied",
  "Notification.403.Message": "You do not have permission to access this resource.",

  // 404 Not Found
  "Notification.404.Title": "Resource Not Found",
  "Notification.404.Message": "The resource you are looking for could not be found. Please check the URL.",

  // 405 Method Not Allowed
  "Notification.405.Title": "Invalid Method",
  "Notification.405.Message": "The HTTP method used is not allowed for this resource.",

  // 406 Not Acceptable
  "Notification.406.Title": "Not Acceptable",
  "Notification.406.Message": "The server cannot provide the content requested by the client.",

  // 408 Request Timeout
  "Notification.408.Title": "Request Timeout",
  "Notification.408.Message": "The request timed out. Please try again.",

  // 409 Conflict
  "Notification.409.Title": "Conflict",
  "Notification.409.Message": "The request conflicts with an existing resource.",

  // 410 Gone
  "Notification.410.Title": "Resource No Longer Available",
  "Notification.410.Message": "The requested resource is no longer available.",

  // 413 Payload Too Large
  "Notification.413.Title": "Payload Too Large",
  "Notification.413.Message": "The data being sent is too large.",

  // 415 Unsupported Media Type
  "Notification.415.Title": "Unsupported Media Type",
  "Notification.415.Message": "The server does not support the media type sent by the client.",

  // 429 Too Many Requests
  "Notification.429.Title": "Too Many Requests",
  "Notification.429.Message": "Too many requests were sent. Please try again later.",

  // 500 Internal Server Error
  "Notification.500.Title": "Server Error",
  "Notification.500.Message": "An error occurred. Please try again or contact your administrator.",

  // 501 Not Implemented
  "Notification.501.Title": "Not Implemented",
  "Notification.501.Message": "The server does not support this functionality.",

  // 502 Bad Gateway
  "Notification.502.Title": "Bad Gateway",
  "Notification.502.Message": "The server received an invalid response.",

  // 503 Service Unavailable
  "Notification.503.Title": "Service Unavailable",
  "Notification.503.Message": "The server is temporarily unavailable. Please try again later.",

  // 504 Gateway Timeout
  "Notification.504.Title": "Gateway Timeout",
  "Notification.504.Message": "The server did not receive a response from another server.",

  // 505 HTTP Version Not Supported
  "Notification.505.Title": "HTTP Version Not Supported",
  "Notification.505.Message": "The server does not support the HTTP version used.",
};

export default NotificationEN;
