/*
Script: MooWindowSession.js

License:
	MIT-style license.

Copyright:
	Copyright (c) 2008-2009 [Oskar Krawczyk](http://blog.olicio.us/).
*/

Window.implement({
	options: {
		session: new Window(window)
	},

	set: function(value) {
		switch ($type(value)) {
			case 'object':
				if($chk(this.storage)) this.storage = $merge(value, this.storage);
				else this.storage = value;
				this.options.session.set(JSON.encode(this.storage));
				break;
			case 'string':
				this.options.session.name = value;
		}
		return this;
	},
	
	get: function() {		
		this.storage = this.options.session.name;
		if(this.storage.test(/^{.*?}$/)) this.storage = JSON.decode(this.storage);
		return this.storage;
	},

	empty: function() {
		this.options.session.name = null;
		return this;
	}
});

var MooWindowSession = {
	'version': '0.1'
};

MooWindowSession = new Class({
	Implements: Events,
	
	initialize: function() {
		this.window = new Window(window);
	},
			
	set: function(value) {
		return this.window.set(value);
	},
	
	get: function() {
		return this.window.get();
	},
	
	empty: function() {
		return this.window.empty();
	}
});