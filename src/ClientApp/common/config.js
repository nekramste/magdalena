const isProduction = 0;

const API_ROUTE_DEVELOPMENT ='https://localhost:5001';
const API_ROUTE_PRODUCTION = 'https://i.preprod.youwager.lv/webs';

const WS_ROUTE_DEVELOPMENT ='wss://localhost:5001';
const WS_ROUTE_PRODUCTION = 'https://i.preprod.youwager.lv/webs';

export default {
    API_URL: isProduction? API_ROUTE_PRODUCTION : API_ROUTE_DEVELOPMENT,
    WS_URL: isProduction? WS_ROUTE_PRODUCTION : WS_ROUTE_DEVELOPMENT,
}