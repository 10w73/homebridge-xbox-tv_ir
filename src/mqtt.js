"use strict";
const Mqtt = require("async-mqtt");
const EventEmitter = require('events');

class MQTTCLIENT extends EventEmitter {
    constructor(config) {
        super();
        this.mqttHost = config.host;
        this.mqttPort = config.port;
        this.mqttPrefix = config.prefix;
        this.mqttAuth = config.auth;
        this.mqttUser = config.user;
        this.mqttPasswd = config.passwd;
        this.mqttDebug = config.debug;
        this.isConnected = false;

        this.connect();
    };

    async connect() {
        try {
            const options = {
                username: this.mqttUser,
                password: this.mqttPasswd
            }
            const url = `mqtt://${this.mqttHost}:${this.mqttPort}`;
            this.mqttClient = await Mqtt.connectAsync(url, options);
            this.isConnected = true;
            this.emit('connected', 'MQTT Connected.');
        } catch (error) {
            this.isConnected = false;
            this.emit('error', `MQTT Connect error: ${error}`);
        };
    };

    async send(topic, message) {
        if (!this.isConnected) {
            const emitDebug = this.mqttDebug ? this.emit('debug', `MQTT client not connected.`) : false;
            return
        };

        try {
            const fullTopic = `${this.mqttPrefix}/${topic}`;
            await this.mqttClient.publish(fullTopic, message);
            const emitDebug = this.mqttDebug ? this.emit('debug', `MQTT publish: ${fullTopic}: ${message}`) : false;
        } catch (error) {
            this.emit('error', `MQTT Publish error: ${error}`);
        };
    };
};
module.exports = MQTTCLIENT;