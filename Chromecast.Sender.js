var Chromecast = Chromecast || {};

Chromecast.Sender = function () {
    var self = this;
    this.api = null,
    this.activity = null;
    this.receiverList = null;
    
    if (typeof cast != 'undefined' && cast.isAvailable) {
        self.initializeApi();
    } else {
        window.addEventListener('message', function (event) {
            if (event.source == window && event.data &&
                event.data.source == 'CastApi' &&
                event.data.event == 'Hello')
                self.initializeApi();
        });
    }
};

Chromecast.Sender.receiverList = null;

Chromecast.Sender.prototype = {
    initializeApi: function () {
        this.api = new window.cast.Api();
        this.api.addReceiverListener(Chromecast.Settings.appId, this.onReceiverList);
    },
    
    onReceiverList: function(list) {
        Chromecast.Sender.receiverList = list;
    },
    
    doLaunch: function(receiver, parameters, descriptionText, descriptionUrl, onLaunch) {
        var self = this;

        var request = new window.cast.LaunchRequest(Chromecast.Settings.appId, receiver);
        request.parameters = parameters;
        request.description = new window.cast.LaunchDescription();
        request.description.text = descriptionText;
        request.description.url = descriptionUrl;

        this.api.launch(request, function (activity) {
            if (activity.status == 'running') {
                self.activity = activity;
                self.api.addMessageListener(self.activity.activityId, Chromecast.Settings.namespace, self.onMessage.bind(self));
                onLaunch(activity);
            } else if (activity.status == 'error') {
                self.activity = null;
            }
        });
    },
    
    stopPlayback: function() {
        if (this.activity) {
            this.api.stopActivity(this.activity.activityId);
        }
    },
    
    onMessage: function(message) {
        if (message.event === 'say') {
            this.onSayEvent(message);
        }
    },
    
    bind: function(event, handler) {
        $(window).bind(this._e(event), handler);
    },

    sendMessage: function(command, attrs, callback) {
        this.api.sendMessage(this.activity.activityId, Chromecast.Settings.namespace,
            $.extend({ command: command }, attrs), callback);
    },

    _e: function(eventName) {
        return 'gc-' + this.id + '.' + eventName;
    }
};