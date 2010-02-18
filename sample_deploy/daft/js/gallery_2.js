var quickSearchBaseUrl = 'http://macserver:8080/daft/metadata/sample/pdo_view/quicksearch';
var categorySearchBaseUrl = 'http://macserver:8080/daft/metadata/sample/category/get';
var categoryCreateBaseUrl = 'http://macserver:8080/daft/metadata/sample/category/create';
var categoryAddRecordBaseUrl = 'http://macserver:8080/daft/metadata/sample/category/addrecord';
var metadataUrl = 'http://macserver:8080/daft/metadata/sample/pdo_view';

var galleryPhotos = null;
var request = null;
var p_first=0;
var p_count=1000;
var galleryCount = 18;
var maxImageSize=100;
var galleryPages = 1;
var gallaryPage = 0;
var keywordTree = null;
var categoryTree = null;
var categoryTrees = [];
var categoryTabs = null;
var searchResultsTabs = null;

var basketPhotos = [];
var basketCount = 18;
var basketCurrentCount = 0;
var basketFull = false;
var selectedCategoryNode = null;
var selectedCategoryTitle = null;

// use global to access current indexed gallery/basket photo in various places
var gallerySelectedPhotoIndex = -1;
var basketSelectedPhotoIndex = -1;

var getPhotoForElement = function(element) {
	 var cursorPos = (galleryPage * galleryCount);
    selectIndex = element.id.slice(element.id.lastIndexOf("_")+1);
	 gallerySelectedPhotoIndex = selectIndex-1+cursorPos;
    try {
        return galleryPhotos[gallerySelectedPhotoIndex];
    }
    catch (err) {
        return null;
    }
}


var getPhotoForBasketElement = function(element) {
    var selectIndex = element.id.slice(element.id.lastIndexOf("_")+1);
    basketSelectedPhotoIndex = selectIndex-1;
    try {
        return basketPhotos[basketSelectedPhotoIndex];
    }
    catch (err) {
        return null;
    }
}

var getPageForElement = function(element) {
    return element.id.slice(element.id.lastIndexOf("_")+1);
}

function initSearchStuff() {
    document.ondragstart = function () { return false; }; //IE drag hack 

    // handle carriage return in various input fields
	$('q_quick_search').addEvent('keydown', function(event) {
		if (event.code == 13) {
			// prevent the event from propagating to default browser behaviour - i.e. reload page	
			event.stop();
			doQuickSearch();
		}
	});
	
$('category_name').addEvent('keydown', function(event) {
		if (event.code == 13) {
			// prevent the event from propagating to default browser behaviour - i.e. reload page	
			event.stop();
			doAddCategory('$Categories', 'category_name');
		}
	});
	
$('keyword_name').addEvent('keydown', function(event) {
		if (event.code == 13) {
			// prevent the event from propagating to default browser behaviour - i.e. reload page	
			event.stop();
			doAddCategory('$Keywords', 'keyword_name');
		}
	});
	
	categoryTabs = new MGFX.Tabs('.tab_category', '.feature_category');
	searchResultsTabs = new MGFX.Tabs('.tab_search_results', '.feature_search_results', {
										     onShowSlide: function(slideIndex) {
												  this.tabs.removeClass('active');
												  this.tabs[slideIndex].addClass('active');
												  // hide non visible tab contents, to prevent incorrect event notification
												  switch (slideIndex) {
													  case 0:
													     $('my_basket').hide();
												        $('gallery').show();
												     break;
													  case 1:
													     $('gallery').hide();
												        $('my_basket').show();
													     break;
												  }
											  }
										  });

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
		doFindCategoryAssets('Category', node);
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
		doFindCategoryAssets('Keyword', node);
	});
	doCategorySearch(keywordTree, '$Keywords');
	categoryTrees['$Categories'] = categoryTree;
	categoryTrees['$Keywords'] = keywordTree;
}

function doClearBasket() {
	clearBasket();
}

function doAddBasketToCategory() {
	 if (selectedCategoryNode == null) return;
	    for (var i=0;i<basketCurrentCount;i++) {
        var photo = basketPhotos[i]; 
        request = new Request.JSON({
           url: categoryAddRecordBaseUrl,
           method: 'get',
           onSuccess: function(responseJson) {
           },
           onFailure: function() {
	           }
        });
        queryParams = {
           'category_id': selectedCategoryNode.id,
           'record_id': photo.ID
       };
       request.get(queryParams);
    }
	 
	 // put a wait in to allow aysync stuff to complete
	 updateCategorySearchResults.delay(10);	 
}

var updateCategorySearchResults = function() {
	 // refresh the category view
 	 searchResultsTabs.showSlide(0);
 	 doFindCategoryAssets(selectedCategoryTitle, selectedCategoryNode);
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

function doAddToBasket() {
	if (basketFull) return;
	try {
		var photo = galleryPhotos[gallerySelectedPhotoIndex];
		if (photo != null) {
		  basketPhotos[basketCurrentCount] = photo;
		  $('basket_image_'+(basketCurrentCount+1)).empty();
		  var thumb = getThumbBody(photo, 'thumb_basket_image_'+(basketCurrentCount+1))
		  thumb.inject($('basket_image_'+(basketCurrentCount+1)));
        thumb.addEvent('click', selectBasketPhoto);
        //thumb.store('basket_photo',  photo);
        $('basket_image_'+(basketCurrentCount+1)).setStyle('visibility', 'visible');
        if (basketCurrentCount++ >= basketCount) {
				basketFull = true;
		  }
        $('search_results_two').set('html', 'My Basket ('+basketCurrentCount+')');
		  $('select_photo_add_to_basket').destroy();
		}
	}
	catch (err) {
		// do nothing for now
	}
}

function clearBasket() {
    for (var i=0;i<basketCurrentCount;i++) {
        $('basket_image_'+(i+1)).setStyle('visibility', 'hidden');
    }
	 basketPhotos = [];
	 basketCurrentCount = 0;
	 basketFull = false;
    $('search_results_two').set('html', 'My Basket (0)');
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
		  var thumb = getThumbBody(photo, 'thumb_gallery_image_'+(i+1));
		  thumb.inject($('gallery_image_'+(i+1)));
        thumb.addEvent('click', selectPhoto);
        //thumb.store('gallery_photo',  photo);
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
   var photo = getPhotoForElement(this);
	p_caption = photo.Caption;
	if (p_caption.length > 20) p_caption = p_caption.substring(0,19)+" ...";
	var caption = '<table cellpadding=2px style="border:0px;"';
	caption += '<tr><td width="70">File:</td><td>'+photo.Record_Name+'</td></tr>';
	caption += '<tr><td width="70">Caption:</td><td>'+p_caption+'</td></tr>';
	caption +='<tr><td width="70">Width:</td><td>'+photo.Horizontal_Pixels+ ' pixels</td></tr>';
	caption +='<tr><td width="70">Height:</td><td>'+photo.Vertical_Pixels+ ' pixels</td></tr>';
	caption +='</table>';
	caption +="<input id='select_photo_add_to_basket' type='button' class='button' value='Add To basket' To Category onclick='javascript:doAddToBasket()' />";
   Slimbox.open(photo.preview_pdobig+'?maxSize=400', caption);
}

var selectBasketPhoto = function() {
   var photo = getPhotoForBasketElement(this);
	p_caption = photo.Caption;
	if (p_caption.length > 25) p_caption = p_caption.substring(0,24)+" ...";
	var caption = '<table cellpadding=2px style="border:0px;"';
	caption += '<tr><td width="70">File:</td><td>'+photo.Record_Name+'</td></tr>';
	caption += '<tr><td width="70">Caption:</td><td>'+p_caption+'</td></tr>';
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
            searchResultsTabs.showSlide(0);
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

function doFindCategoryAssets(title, node) {
    galleryPhotos = null;
	 selectedCategoryNode = node;
	 selectedCategoryTitle = title;
	 $('basket_add_category_button').set('value', 'Add to '+title+' "'+node.name+'"');
	 $('basket_add_category_button').show('inline');
    request = new Request.JSON({
        url: metadataUrl,
        method: 'get',
        onSuccess: function(responseJson) {
            doGallery(responseJson);
            searchResultsTabs.showSlide(0);
        },
        onFailure: function() {
        }
    });
    p_first = 0;
    queryParams = {
        'csharp': '',
        'q': 'Categories is :'+node.id+':',
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
				var rootNode = tree.root;
				var selectedCategory = tree.getSelected();
				if (selectedCategory != null) {
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
		          Mif.Tree.Draw.children(selectedCategory);
			    }
				else {
				  var newNode = new Mif.Tree.Node({
						  tree: tree
					  }, 
					  { property: {
						  name: responseJson.Category_Name, 
						  id: responseJson.ID
					  }
				  });
				  tree.add(newNode, rootNode, 'inside');
				  rootNode.sort();
		          Mif.Tree.Draw.update(rootNode);
		    }
			tree.select(newNode);
            $(categoryElement).set('value', '');
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

function waitForMilliSeconds(millis) {
	var date = new Date();
	var curDate = null;	
	do {
		curDate = new Date();
	}
	while (curDate-date < millis);
} 

