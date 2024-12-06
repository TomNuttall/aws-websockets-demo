# Web Socket Demo

Demo Project: Web socket api used to handle communication between connected game clients and host.

The api has an endpoint for connecting to and an endpoint to send messages back.



https://github.com/user-attachments/assets/59d749e1-802c-40ad-b6f1-131464f46752



## Game Flow

Note: Websocket handles unique connection id

1. Client connects and _connect route lamdba_ adds entry into table
2. Table stream triggers _game state lamdba_ updating game logic and sending update to all connected clients
3. Client sends message with character selection and _send message route lambda_ updates entry into table
4. Table stream triggers _game state lamdba_ updating game logic and sending update to all connected clients
5. Host _sends host message_ with start/finish and _send host route lambda_ updates entry into table
6. Table stream triggers _game state lamdba_ updating game logic and sending update to all connected clients
7. Client disconnects and _disconnect route lamdba_ removes entry into table

## Frontend

| Package                                                                  | For                                   |
| ------------------------------------------------------------------------ | ------------------------------------- |
| [Pixi React](https://pixijs.io/pixi-react/)                              | Rendering, react binidngs for Pixi.js |
| [React Spring](https://www.react-spring.dev)                             | Tween animations                      |
| [React Use Websocket](https://github.com/robtaussig/react-use-websocket) | Web socket Hook                       |
| [React Hot Toast](https://react-hot-toast.com)                           | Toasts                                |
| [React Hook Form](https://react-hook-form.com)                           | Form                                  |
| [Texture Packer](https://www.codeandweb.com/texturepacker)               | Packing spritesheets                  |

## Backend

Uses S3, Route53, Cloudfront, API Gateway, DynamoDB, Lambda and IAM AWS Services.

- CDK used for IaC
- DynamoDB table stores connection id and player/host state
- DynamoDB streams trigger a lambda to handle game logic and 'broadcast' to all connections
- WebSocket API Gateway with lambda route integrations

## GitHub

Github actions used for CI/CD

| Name                | Reason                                         |
| ------------------- | ---------------------------------------------- |
| AWS_BUCKET_ROLE_ARN | Role for put/delete S3 + invalidate Cloudfront |
| AWS_BUCKET_PATH     | S3 Projects                                    |
| AWS_DISTRIBUTION_ID | Cloudfront id                                  |
| AWS_LAMBDA_ROLE_ARN | Role for update lambda code                    |
