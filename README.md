# openHAB Multi-User support for the REST API

This project aims to provide a secure multiuser support for the [openHAB REST API](https://www.openhab.org/docs/configuration/restdocs.html#openhab-rest-api).
It is utilising a NodeJS application and the popular [NGINX](https://www.nginx.com/) webserver to proxy and filter requests to the REST API.


**NOTE:** This project is currently under development and documentation will be added later.

- [NodeJS package](#nodejs-package)
  - [Configuration options](#configuration-options)
- [NGINX setup](#nginx-setup)
- [Firewall setup](#firewall-setup)

## NodeJS package

- Install via npm: ``npm install -g openhab-multiuser-proxy``
- Copy the [openhab-multiuser.service](nodejs/openhab-multiuser.service) file to */etc/systemd/system/openhab-multiuser-proxy.service*
- ``sudo systemctl daemon-reload``
- ``sudo systemctl enable --now openhab-multiuser.service``
  - The service by default tries to connect to localhost as openHAB server and exposes itself on port 8081.
  - 
- To change the configuration, edit the systemd file with ``sudo systemctl edit --full openhab-multiuser.service``

### Configuration options
Option | Description | Command line argument | Environment variable | Example | Default
-|-|-|-|-|-
`PORT` | Port to server the application. | -p, --port | PORT | --port=8081 | ``8081``
`HOST` | URL for backend openHAB server. | -h, --host | HOST | --host=http://127.0.0.1:8080 | ``http://127.0.0.1``
`PINO_LOG_LEVEL` | Log level, available: fatal, error, warn, info, debug, trace | none | PINO_LOG_LEVEL | PINO_LOG_LEVEL=info | ``info``
`PINO_LOG_FILE` | Log file. | none | PINO_LOG_FILE | ./log | none, outputs to console

## NGINX setup

To do ...


## Firewall setup

Use ufw to block direct access to openHAB & the NodeJS app:
```shell
sudo ufw deny from any to any port 8080 comment "openHAB HTTP"
sudo ufw deny from any to any port 8443 comment "openHAB HTPPS"
sudo ufw deny from any to any port 8081 comment "openHAB Multi-User"
```