# Portfolio API

This service splits investment orders based on model portfolios.

## Tech Stack

Node.js: 24.14.0
TypeScript  
Express  
TypeORM  
SQLite (in-memory) 
Jest  

## Run

Install dependency

`npm install`

RUN in dev mode
`npm run dev`  

Create Build
`npm run build`

RUN in production
`npm start`

RUN unit test cases
`npm run test:unit`

RUN integration test cases
`npm run test:int`

RUN All test cases
`npm run test`

RUN test with coverage
`npm run test:coverage`

Configure decimal in .env (default 3)
`SHARE_PRECISION=3` 

## API

Postman collecion `portfolio.postman_collection.json`

POST [/api/v1/orders/split](http://localhost:3000/api/v1/orders/split)

Example request

```
{
    "orderType": "BUY",
    "totalAmount": 100,
    "portfolio": [
        {
            "symbol": "AAPL",
            "weight": 60
        },
        {
            "symbol": "TSLA",
            "weight": 40
        }
    ]
}
```

Example response

```
{
    "success": true,
    "data": {
        "executionTime": "2026-04-07T07:55:09.937Z",
        "orders": [
            {
                "id": "975650e6-fd66-4363-ba06-19e2ff225b16",
                "symbol": "AAPL",
                "orderType": "BUY",
                "amount": 60,
                "shares": 0.6,
                "price": 100,
                "executionTime": "2026-04-07T07:55:09.937Z",
                "createdAt": "2026-04-07T07:55:09.000Z"
            },
            {
                "id": "728abd57-617c-4813-852a-30dc048bc891",
                "symbol": "TSLA",
                "orderType": "BUY",
                "amount": 40,
                "shares": 0.4,
                "price": 100,
                "executionTime": "2026-04-07T07:55:09.937Z",
                "createdAt": "2026-04-07T07:55:09.000Z"
            }
        ]
    }
}
```

GET [/api/v1/orders](http://localhost:3000/api/v1/orders)

Example response

```
{
    "success": true,
    "data": {
        "data": [
            {
                "id": "975650e6-fd66-4363-ba06-19e2ff225b16",
                "symbol": "AAPL",
                "orderType": "BUY",
                "amount": 60,
                "shares": 0.6,
                "price": 100,
                "executionTime": "2026-04-07T07:55:09.937Z",
                "createdAt": "2026-04-07T07:55:09.000Z"
            },
            {
                "id": "728abd57-617c-4813-852a-30dc048bc891",
                "symbol": "TSLA",
                "orderType": "BUY",
                "amount": 40,
                "shares": 0.4,
                "price": 100,
                "executionTime": "2026-04-07T07:55:09.937Z",
                "createdAt": "2026-04-07T07:55:09.000Z"
            }
        ],
        "meta": {
            "page": 1,
            "limit": 10,
            "total": 2,
            "totalPages": 1
        }
    }
}
```

## Notes: 
```
All timestamps are returned in UTC format (ISO 8601) to ensure consistency across systems. Clients can convert the timestamp to their local timezone if required.

market timezone can set in `src/config/constants.ts` file

export const MARKET_TIMEZONE = "Asia/Kolkata";
```

## not consider in assesemnts
Authentication / Authorisation
Swagger documentaion
Add unit test cases for all use cases and files (due to time constrains only added important / critical test cases)
Redis caching
Market price API integration
Rate limiting
Observability (Prometheus + Grafana)
CI/CD pipelines
