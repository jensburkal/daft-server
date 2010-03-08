/*
 * Point Portal core functions
 */
 
var mediaManagerBaseUrl = 'http://localhost:8080/mediamanager/ws';

var userDb = [];
var fileMenuStart = null;
var fileMenu = null;
var projectMenu = null;
var projectStartTabs = null;
var session = null;

USER_KEY = 'point_user';

function initPointStuff() {
    session = new MooWindowSession();    // just for initial testing of course!!!!!!
    userDb['point'] = 'point';
    userDb['client'] = 'client';
    userDb['agency'] = 'agency';
    userDb['supplier'] = 'supplier';
	
    projectStartTabs = new MGFX.Tabs('.tab_psf', '.feature_psf');
	
    // support menus etc.
    document.addEvent('contextmenu', function(e) {
        e.preventDefault();
    });
	
    $('login_form').addEvent('submit', function(e) {
        e.stop();
        doTryLogin();
    });
		
    $('login_submit').addEvent('keydown', function(e) {
        if (e.code == 13) {
            e.stop();
            doTryLogin();
        }
    });
    
    projectTree = new Mif.Tree({
        initialize: function() {
            this.initSortable();
        },
        container: $('projectTree'), // tree container
        types: { // node types
            folder:{
                openIcon: 'mif-tree-open-icon', //css class open icon
                closeIcon: 'mif-tree-close-icon' // css class close icon
            }
        },
        dfltType:'folder', //default node type
        height: 18, //node height
        forest: true
    });
	
    fileStartMenu = new Mif.Menu({
        contextmenu: true,
        list: {
            items: [
            {
                name: 'Login',
                onAction: function() {
                    showLogin();
                }
            }
            ]
        }
    });
	
    fileMenu = new Mif.Menu({
        contextmenu: true,
        list: {
            items: [
            {
                name: 'Goto Noosh',
                onAction: function() {
                    doGotoNoosh();
                }
            },
            {
                name: 'New Project',
                onAction: function() {
                    doNewProject();
                }
            },
            '-',
            {
                name: 'Logout',
                onAction: function() {
                    doLogout();
                }
            }
            ]
        }
    });
	
	
    $('file_menu_button').removeEvents();
    fileStartMenu.attachTo($('file_menu_button'));
	
}

function buildProjectMenu() {
    if (typeof(projectMenu) == "undefined" || projectMenu == null) {
        projectMenu = new Mif.Menu({
            contextmenu: true,
            list: {
                items: [
                {
                    name: 'Save as',
                    onAction: function() {
                    },
                    list: {
                        items: [
                        {
                            name: 'Draft',
                            onAction: function() {
                            }
                        },
                        {
                            name: 'Template',
                            onAction: function() {
                            }
                        }
                        ]
                    }
                },
                {
                    name: 'Send to Point',
                    onAction: function() {
                        doLogout();
                    }
                },
                {
                    name: 'Send to Noosh',
                    onAction: function() {
                        doLogout();
                    }
                },
                '-',
                {
                    name: 'Reset',
                    onAction: function() {
                        doLogout();
                    }
                }
                ]
            }
        });
    }
    $('project_menu_button').removeEvents();
    projectMenu.attachTo($('project_menu_button'));
}

function doGotoNoosh() {

}

function doNewProject() {
    $('project_menu_button').show();
    $('project_start_panel').show();
}

function doLogout() {
    session.empty();
    $('project_start_panel').hide();
    $('welcome_message').set('html', '');
    $('welcome_message').hide();
    $('file_menu_button').removeEvents();
    fileStartMenu.attachTo($('file_menu_button'));
}

function doLogin(response) {
    alert(response);
    /*
    var u = encodeURIComponent($('login_username').value);
    var p = encodeURIComponent($('login_password').value);
    var x = userDb[u];
    if (typeof(x)=="undefined" || (x != p)) {
        // login failed
        $('login_working').hide();
        $('login_submit').show();
        $('login_failed').show('inline');
    } else {
        // login succeeded
        session.set(USER_KEY, u);
        buildProjectMenu();
        $('file_menu_button').removeEvents();
        fileMenu.attachTo($('file_menu_button'));
        $('welcome_message').set('html', 'Welcome '+session.get(USER_KEY));
        $('welcome_message').show();
        resetLoginForm();
        $('login_dialog').hide();
    }
    */
}
  
function showLogin() {
    $('login_dialog').move();
    $('login_dialog').show();
}
 
function resetLoginForm() {
    $('login_working').hide();
    $('login_failed').hide();
    $('login_submit').show();
}
 
function cancelLogin() {
    resetLoginForm();
    $('login_dialog').hide();
}

function doTryLogin() {
    $('login_submit').hide();
    $('login_working').show('inline');
    alert('post url: '+mediaManagerBaseUrl)
    request = new Request.JSON({
        url: mediaManagerBaseUrl,
        method: 'post',
        onSuccess: function(responseJson) {
            doLogin(responseJson);
        },
        onFailure: function(response) {
            alert('failed:'+response)
            $('login_working').hide();
            $('login_submit').show();
            $('login_failed').show('inline');
        }
    });
    queryParams = {
        'username': encodeURIComponent($('login_username').value),
        'password': encodeURIComponent($('login_password').value)
    };
    alert('query params: '+queryParams)
    request.post(queryParams);
//doLogin("");
}




