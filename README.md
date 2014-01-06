chromecast
==========

Wrapper to use with Google's Chromecast API

Initialize a Sender
-------------------
```javascript
var sender = new Chromecast.Sender();
sender.doLaunch(Chromecast.Sender.receiverList[0], null, 'my description', 'http://myurl.com/', onLaunch);
	function onLaunch(activity) {
	//stuff do do after launch
};
```

Send a message to Receiver from Sender
--------------------------------------
```javascript
var data = {
	item1: 'someValue',
	item2: 'anotherValue'
};
sender.sendMessage('CommandName', { content: data });
```

Initialize a Receiver
---------------------
```javascript
var messageCommands = {
	CommandName: function (data) {
		//stuff do do when this message is received
	}
};
var receiver = new Chromecast.Receiver('debug string', messageCommands);
```