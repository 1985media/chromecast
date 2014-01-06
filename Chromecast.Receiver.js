var Chromecast = Chromecast || {};

Chromecast.Receiver = function (debugString, messageCommands) {
    this.messageCommands = messageCommands;
    this.receiver = new cast.receiver.Receiver(Chromecast.Settings.appId, [Chromecast.Settings.namespace], '', 5);
    this.mChannelHandler = new cast.receiver.ChannelHandler(debugString);
    this.mChannelHandler.addEventListener(cast.receiver.Channel.EventType.MESSAGE, this.onMessage.bind(this));
    this.mChannelHandler.addChannelFactory(this.receiver.createChannelFactory(Chromecast.Settings.namespace));  
    this.receiver.start();
};

Chromecast.Receiver.prototype = {
    onMessage: function (event) {
        if (typeof this.messageCommands[event.message.command] == 'function') {
            this.messageCommands[event.message.command](event.message.content);
        } else {
            console.error('message unknown:', event);
        }
    }
};