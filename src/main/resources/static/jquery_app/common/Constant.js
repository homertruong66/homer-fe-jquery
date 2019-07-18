// init global object
globalObject = {};
globalObject.apiUrl = 'http://localhost:9090';
globalObject.headerSecurityTokenKey = 'X-Security-Token';
globalObject.headerUserProfileKey = 'X-User-Profile';

// General
var CONFIRM_DELETE = 'Are you sure you want to delete?';
var CONFIRM_DISABLE = 'Are you sure you want to disable?';
var DATE_OFFSET = -7 * 60 * 60 * 1000;   // 7 hours - GMT+7