# openHAB Multi-User support for the REST API

This project aims to provide a secure multiuser support for the [openHAB REST API](https://www.openhab.org/docs/configuration/restdocs.html#openhab-rest-api).
It is utilising a NodeJS application and the popular [NGINX](https://www.nginx.com/) webserver to proxy and filter requests to the REST API.

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/standard/semistandard)
[![npm version](https://badge.fury.io/js/openhab-multiuser-proxy.svg)](https://badge.fury.io/js/openhab-multiuser-proxy)

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [NodeJS package](#nodejs-package)
  - [Installation](#installation)
  - [Configuration options](#configuration-options)
  - [Documentation](#documentation)
- [NGINX setup](#nginx-setup)
- [Firewall setup](#firewall-setup)

## Introduction

This project currently allows multiple users to access different Sitemaps with the openHAB mobile app.
It relies on mTLS (client certificate auth) to get user id and org memberships.

Each client has its own username (as *Common Name*) and can be in multiple organizations (as comma seperated list in *Organizational Unit*), for certificate config refer to [mTLS Certificate Authority](nginx/README.md#mtls-certificate-authority).

openHAB Sitemaps must be named after an user or an org.

## NodeJS package

The npm package *openhab-multiuser-proxy* provides filters and access control mechanisms.
**It depends on NGINX (or Apache) as reverse proxy.** 

### Installation
- Install via npm: ``npm install -g openhab-multiuser-proxy``
- Copy the [openhab-multiuser.service](nodejs/openhab-multiuser.service) file to */etc/systemd/system/openhab-multiuser-proxy.service* or paste into ``sudo systemctl edit --force --full openhab-multiuser.service``
- ``sudo systemctl daemon-reload``
- ``sudo systemctl enable --now openhab-multiuser.service``
  - The service by default tries to connect to localhost as openHAB server and exposes itself on port 8081.
  - Logging is performed on level info to */var/log/openhab/multiuser-proxy.log* (JSON-formatted).
- To change the configuration, edit the systemd file with ``sudo systemctl edit --full openhab-multiuser.service``

### Configuration options

Option | Description | Command line argument | Environment variable | Example | Default
-|-|-|-|-|-
`PORT` | Port to server the application. | -p, --port | PORT | --port=8081 | ``8081``
`HOST` | URL for backend openHAB server. | -h, --host | HOST | --host=http://127.0.0.1:8080 | ``http://127.0.0.1:8080``
`PINO_LOG_LEVEL` | Log level, available: fatal, error, warn, info, debug, trace | none | PINO_LOG_LEVEL | PINO_LOG_LEVEL=info | ``info``
`PINO_LOG_FILE` | Log file. | none | PINO_LOG_FILE | ./log | none, outputs to console

These options are all present in the systemd file, either as param in ``ExecStart`` or as ``Environment`` variable.

### Documentation

JSDoc documentation is available at https://florian-h05.github.io/openhab-multiuser-proxy/nodejs/jsdoc/.

REST API documentation is local available at the ``/swagger/`` path.

## NGINX setup

Refer to [nginx/README](nginx/README.md).

## Firewall setup

Use ufw to block direct access to openHAB & the NodeJS app:
```shell
sudo ufw deny from any to any port 8080 comment "openHAB HTTP"
sudo ufw deny from any to any port 8443 comment "openHAB HTPPS"
sudo ufw deny from any to any port 8081 comment "openHAB Multi-User"
```
