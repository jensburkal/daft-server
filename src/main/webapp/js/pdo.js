var quickSearchBaseUrl = 'http://macserver:8080/daft/metadata/sample/pdo_view/quicksearch';
var categorySearchBaseUrl = 'http://macserver:8080/daft/metadata/sample/category/get';
var categoryCreateBaseUrl = 'http://macserver:8080/daft/metadata/sample/category/create';
var metadataUrl = 'http://macserver:8080/daft/metadata/sample/pdo_view';

var galleryPhotos = null;
var request = null;
var p_first=0;
var p_count=1000;
var galleryCount = 24;
var maxImageSize=100;
var galleryPages = 1;
var gallaryPage = 0;
var keywordTree = null;
var categoryTree = null;
var categoryTabs = null;
var categoryTrees = [];

var getPhotoForElement = function(element) {
	 var cursorPos = (galleryPage * galleryCount);
    var selectIndex = element.id.slice(element.id.lastIndexOf("_")+1);
    try {
        return galleryPhotos[selectIndex-1+cursorPos];
    }
    catch (err) {
        return null;
    }
}

var getPageForElement = function(element) {
    return element.id.slice(element.id.lastIndexOf("_")+1);
}

function initUploadStuff() {
	categoryTabs = new MGFX.Tabs('.tab', '.feature_upload');

	categoryTree = new Mif.Tree({
		initialize: function() {
        this.initSortable();
		},
		container: $('categoryTree'), // tree container
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
	categoryTree.addEvent('select',function(node) {
		doFindCategoryAssets(node.id);
	});
	doCategorySearch(categoryTree, '$Categories');
	
	keywordTree = new Mif.Tree({
		initialize: function() {
        this.initSortable();
		},
		container: $('keywordTree'), // tree container
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
	keywordTree.addEvent('select',function(node) {
		doFindCategoryAssets(node.id);
	});
	doCategorySearch(keywordTree, '$Keywords');
	categoryTrees['$Categories'] = categoryTree;
	categoryTrees['$Keywords'] = keywordTree;
}

function initSearchStuff() {
	
    // handle carriage return in the quicksearch field
	$('q_quick_search').addEvent('keydown', function(event) {
		if (event.code == 13) {
			// prevent the event from propagating to default browser behaviour - i.e. reload page	
			event.stop();
			doQuickSearch();
		}
	});
	
	categoryTabs = new MGFX.Tabs('.tab', '.feature');

	categoryTree = new Mif.Tree({
		initialize: function() {
        this.initSortable();
		},
		container: $('categoryTree'), // tree container
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
	categoryTree.addEvent('select',function(node) {
		doFindCategoryAssets(node.id);
	});
	doCategorySearch(categoryTree, '$Categories');
	
	keywordTree = new Mif.Tree({
		initialize: function() {
        this.initSortable();
		},
		container: $('keywordTree'), // tree container
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
	keywordTree.addEvent('select',function(node) {
		doFindCategoryAssets(node.id);
	});
	doCategorySearch(keywordTree, '$Keywords');
	categoryTrees['$Categories'] = categoryTree;
	categoryTrees['$Keywords'] = keywordTree;
}


function doGallery(responseJson) {
	 $('page_navigator').empty();
    galleryPhotos = responseJson;
	 galleryPages = 1;
	 if (galleryPhotos != null && galleryPhotos.length > galleryCount) {
	    galleryPages = parseInt(galleryPhotos.length / galleryCount);
		 if ((galleryPhotos % galleryCount) > 0) galleryPages++;
    }
    galleryPage = 0;
 	 if (galleryPages > 1) showPager();
   updateGallery();
}


function clearGallery() {
    for (var i=0;i<galleryCount;i++) {
        $('gallery_image_'+(i+1)).setStyle('visibility', 'hidden');
    }
}

function showPager() {
   new Element('li', {
	    'id': 'current_page',
	   'html': 'Page 1'
		}).inject($('page_navigator'));
	var l = new Element('li', {
		   'id': 'first_page',
			'html': '|'
			});
	l.inject($('page_navigator'));
   l.addEvent('click', selectPage);
	for (var i=0;i<galleryPages;i++) {
	   var pl = new Element('li', {
		   'id': 'page_'+(i+1)
			});
		new Element ('a', {
			'href': '#',
			'html': (i+1),
			'hover': 'cursor:pointer'
			}).inject(pl);
			
	   pl.inject($('page_navigator'));
      pl.addEvent('click', selectPage);
 	}
	var l = new Element('li', {
		   'id': 'last_page',
			'html': '|'
			});
	l.inject($('page_navigator'));
   l.addEvent('click', selectPage);
}

var selectPage = function() {   
	galleryPage = getPageForElement(this);
	$('current_page').set('html', 'Page '+galleryPage);
	updateGallery();
}

function updateGallery() {
    clearGallery();
    if (galleryPhotos == null || galleryPhotos.length == 0) return;
    var size = galleryCount;
    if (galleryPhotos.length < size) size = galleryPhotos.length;
	 var cursorPos = (galleryPage * galleryCount);
    for (var i=0;i<size;i++) {
        $('gallery_image_'+(i+1)).empty();
        var photo = galleryPhotos[cursorPos+i];
		  var thumb = getThumbBody(photo, 'gallery_image_'+(i+1))
		  thumb.inject($('gallery_image_'+(i+1)));
        thumb.addEvent('click', selectPhoto);
        thumb.store('gallery_photo',  photo);
        $('gallery_image_'+(i+1)).setStyle('visibility', 'visible');
    }
}

function getThumbBody(photo, thumbId) {
	 var infoElement = new Element('a', {
	 'id': thumbId
	 });
	 var span1 = new Element('span', {
	    'class': 'wrimg'
	 }).inject(infoElement);
	 var span11 = new Element('span').inject(span1);
	 
    //var dimension = scaleImage(photo.Horizontal_Pixels, photo.Vertical_Pixels);
 	 var imgElement = new Element('img', {
		  'border': 0,
		  'width': maxImageSize,
		  'height': maxImageSize.height,
        'src': photo.preview_pdosmall+'?size='+maxImageSize
   }).inject(span1);
     
    var span2 = new Element('span', {
        'class': 'caption'
    }).inject(infoElement);
	 span2.set('html', photo.Record_Name);
  
    return infoElement;
}

var selectPhoto = function() {
   photo = getPhotoForElement(this);
	var caption = '<table cellpadding=2px style="border:0px;"';
	caption += '<tr><td width="70">File:</td><td>'+photo.Record_Name+'</td></tr>';
	caption += '<tr><td width="70">Caption:</td><td>'+photo.Caption+'</td></tr>';
	caption +='<tr><td width="70">Width:</td><td>'+photo.Horizontal_Pixels+ ' pixels</td></tr>';
	caption +='<tr><td width="70">Height:</td><td>'+photo.Vertical_Pixels+ ' pixels</td></tr>';
	caption +='</table>';
    Slimbox.open(photo.preview_pdobig+'?maxSize=400', caption);
}


function doQuickSearch() {
	keywordTree.unselect();
	categoryTree.unselect();
   galleryPhotos = null;
   request = new Request.JSON({
        url: quickSearchBaseUrl,
        method: 'post',
        onSuccess: function(responseJson) {
            doGallery(responseJson);
        },
        onFailure: function() {
        }
    });
    p_first = 0;
    queryParams = {
        'csharp': '',
        'text': encodeURIComponent($('q_quick_search').value),
        'f': p_first,
        'c': p_count
    };
    request.post(queryParams);
}

function doFindCategoryAssets(id) {
    galleryPhotos = null;
    request = new Request.JSON({
        url: metadataUrl,
        method: 'get',
        onSuccess: function(responseJson) {
            doGallery(responseJson);
        },
        onFailure: function() {
        }
    });
    p_first = 0;
    queryParams = {
        'csharp': '',
        'q': 'Categories is :'+id+':',
        'f': p_first,
        'c': p_count
    };
    request.get(queryParams);
}


function doCategorySearch(tree, category) {
   request = new Request.JSON({
        url: categorySearchBaseUrl,
        method: 'post',
        onSuccess: function(responseJson) {
            doCategory(tree, responseJson);
        },
        onFailure: function() {
        }
    });
    queryParams = {
        'csharp': '',
        'path': encodeURIComponent(category)
    };
    request.post(queryParams);
}

function doCategory(tree, json) {
   var treeJson = [];
	for (var i=0;i<json.SubCategories.length;i++) {
		treeJson[i] = buildCategoryTreeItem(json.SubCategories[i]);    
	}
   tree.load({json: treeJson});
}

function buildCategoryTreeItem(category) {
   var children = [];
	for (var i=0;i<category.SubCategories.length;i++) {
			children[i] = buildCategoryTreeItem(category.SubCategories[i]);
		}
	result = {
		'property': {'name': category.Category_Name, 'id': category.ID},
		'children': children
	}
	return result;
}

function doAddCategory(rootPath, categoryElement) {
   var categoryName = $(categoryElement).value;
	var selectedCategory = categoryTrees[rootPath].getSelected();
   request = new Request.JSON({
        url: categoryCreateBaseUrl,
        method: 'post',
        onSuccess: function(responseJson) {
				var tree = categoryTrees[rootPath];
				var selectedCategory = tree.getSelected();
				var newNode = new Mif.Tree.Node({
						tree: tree,
						parentNode: selectedCategory
					}, 
					{ property: {
						name: responseJson.Category_Name, 
						id: responseJson.ID
					}
				});
				tree.add(newNode, selectedCategory, 'inside');
				selectedCategory.sort();
				tree.expandTo(newNode);
        },
        onFailure: function() {
        }
    });
	if (selectedCategory == null) {
	   newPath = rootPath + ':' + categoryName;
      queryParams = {
        'csharp': '',
        'path': newPath
		}
	}
	else {
      queryParams = {
        'csharp': '',
        'id': selectedCategory.id,
		  'name': categoryName
		}
    };
    request.post(queryParams);
}

function Dimension(width, height) {
    this.width = width;
    this.height = height;
}

function Box(top, left, width, height) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
}

function scaleImage(w, h) {
    var result = new Dimension(maxImageSize, maxImageSize);
    if (w > h) {
        result.width = maxImageSize;
        result.height = parseInt(parseFloat(maxImageSize) * parseFloat(h/w));
    } else if (h > w) {
        result.height = maxImageSize;
        result.width = parseInt(parseFloat(maxImageSize) * parseFloat(w/h));
    }
    return result;
}

