#!/bin/bash
# Copy this file to nginx www directory
rm -rf ./Digitrans-FE-WebComponent/
cp -R /home/nekoconnoisseur/Digitrans-FE-WebComponent/ .
chown -R www-data:www-data ./Digitrans-FE-WebComponent/
chmod 755 -R ./Digitrans-FE-WebComponent/
