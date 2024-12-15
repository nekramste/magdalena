const isProduction = 1;
const debugMode = 0;
const showTimer = 0;
const useDifferentWaitingTimeForSoccer = 1;
const showDetailDebug = 0;
const showDeleteButton = 0;

const API_ROUTE_DEVELOPMENT ='http://localhost:5000';
const API_ROUTE_PRODUCTION = 'https://agadmin.sport.local';

const WS_ROUTE_DEVELOPMENT ='wss://localhost:50000';
const WS_ROUTE_PRODUCTION = 'https://agadmin.sport.local';

export default {
    API_URL: isProduction? API_ROUTE_PRODUCTION : API_ROUTE_DEVELOPMENT,
    WS_URL: isProduction? WS_ROUTE_PRODUCTION : WS_ROUTE_DEVELOPMENT,
    IS_PRODUCTION: isProduction,
    IS_DEBUG_MODE: debugMode,
    SHOW_TIMER: showTimer,
    USE_DIFFERENT_WAITING_TIME_SOCCER: useDifferentWaitingTimeForSoccer,
    SHOW_DETAIL_DEBUG: showDetailDebug,
    SHOW_DELETE_ICON: showDeleteButton
}
