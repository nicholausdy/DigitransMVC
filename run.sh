#!/bin/bash

 pm2 start --name=Digitrans -i 2 ./api/api.js
 pm2 start --name=Digitrans-Worker -i 2 ./api/worker/EventListener.js
 pm2 start --name=Digitrans-DeletionNotifier ./cronjobs/DeletionNotifier.js --cron="00 00 * * *"
