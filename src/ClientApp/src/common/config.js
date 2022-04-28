const isProduction = 1;

const API_ROUTE_DEVELOPMENT ='http://localhost:5000';
const API_ROUTE_PRODUCTION = 'https://agadmin';

const WS_ROUTE_DEVELOPMENT ='ws://localhost:50000';
const WS_ROUTE_PRODUCTION = 'https://agadmin';

export default {
    API_URL: isProduction? API_ROUTE_PRODUCTION : API_ROUTE_DEVELOPMENT,
    WS_URL: isProduction? WS_ROUTE_PRODUCTION : WS_ROUTE_DEVELOPMENT,
}
