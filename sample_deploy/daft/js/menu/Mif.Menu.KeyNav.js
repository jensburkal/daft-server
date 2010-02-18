/*Mif.Menu.KeyNav*/Mif.Menu.KeyNav=new Class({		initialize: function(menu){		this.menu=menu;		this.bound={			attach: this.attach.bind(this),			detach: this.detach.bind(this),			keyaction: this.keyaction.bind(this)		};		this.keyevent=Browser.Engine.presto ? 'keypress' : 'keydown';		menu.addEvent('show', this.bound.attach);		menu.addEvent('hide', this.bound.detach);	},		attach: function(){		document.addEvent(this.keyevent, this.bound.keyaction);	},		detach: function(){		document.removeEvent(this.keyevent, this.bound.keyaction);	},		keyaction: function(event){		if(!['down','left','right','up','enter'].contains(event.key)) return;			var list=this.menu.showed.getLast();			if(!list.selected){				if(event.key=='down'){					list.select(list.items[0]);				};				if(event.key=='up'){					list.select(list.items[list.items.length-1]);				};			}else{				var current=list.selected;				switch (event.key){					case 'down': this.goForward(current);break;  					case 'up': this.goBack(current);break;   					case 'left': this.goLeft(current);break;					case 'right': this.goRight(current);break;					case 'enter': this.action(current);				}				return false;			}	},	goForward: function(current){				var list=current.list;		var items=list.items;		var pos=items.indexOf(current)+1;		if(pos>items.length-1) pos=0;		list.select(items[pos]);	},		goBack: function(current){		var list=current.list;		var items=list.items;		var pos=items.indexOf(current)-1;		if(pos<0) pos=items.length-1;		list.select(items[pos]);	},		goLeft: function(current){		if(current.list.parentItem){			current.list.hide();		};	},		goRight: function(current){		var child=current.childList;		if(child){			child.show();			child.select(child.items[0]);		};	},		action: function(current){		current.list.action();	}});