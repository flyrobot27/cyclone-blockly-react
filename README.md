# CYCLONE Frontend (Blockly)

This is the frontend blockly editor for the CYCLONE model

Framework / Language Used:
- React
- Typescript
- Tailwind CSS
- [reaflow](https://github.com/reaviz/reaflow)

App created using Vite

## Deployment

Build the application using docker. A Dockerfile is provided.\
A docker compose file is also provided to bring up the application.\
Update the environment variable `VITE_API_URL` (As seen in `.env` and under `args` in `docker-compose.yml`) to the URL of the [CYCLONE Backend](https://github.com/flyrobot27/cyclone-backend)\
The app will be listening on Port 5173
