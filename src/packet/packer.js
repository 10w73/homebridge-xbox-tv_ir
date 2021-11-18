const SimplePacket = require('./simple');
const MessagePacket = require('./message');

const Types = {
    d00d: 'message',
    cc00: 'simple.connectRequest',
    cc01: 'simple.connectResponse',
    dd00: 'simple.discoveryRequest',
    dd01: 'simple.discovery',
    dd02: 'simple.powerOn',
}

class PACKER {
    constructor(config) {
        this.type = config.type || '';
        this.structure = '';

        const packetType = this.type.slice(0, 2).toString('hex');
        if (packetType in Types) {
            const packetValue = this.type;
            this.type = Types[packetType];
            this.structure = this.loadPacketStructure(this.type, packetValue);
        } else {
            this.structure = this.loadPacketStructure(this.type);
        };

    };

    loadPacketStructure(type, value = false) {
        if (type.slice(0, 6) == 'simple') {
            return new SimplePacket(type.slice(7), value);
        } else if (type.slice(0, 7) == 'message') {
            return new MessagePacket(type.slice(8), value);
        } else {
            return false;
        };
    };

    set(key, value, protectedPayload = false) {
        this.structure.set(key, value, protectedPayload);
    };

    pack(xbox = undefined) {
        return this.structure.pack(xbox);
    };

    unpack(xbox = undefined) {
        return this.structure.unpack(xbox);
    };

    setChannel(channel) {
        this.structure.setChannel(channel);
    };
};
module.exports = PACKER;