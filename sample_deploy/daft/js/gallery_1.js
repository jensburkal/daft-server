var topPhotoUrl = 'http://macserver:8080/daft/metadata/sample/gallery_view';
var queryBaseUrl = 'http://macserver:8080/daft/metadata/sample/gallery_view';
var quickSearchBaseUrl = 'http://macserver:8080/daft/metadata/sample/gallery_view/quicksearch';
var galleryPhotos = null;
var request = null;
var p_first=0;
var p_count=100;
var topImageId = -1;
var galleryCount = 5;
var cursorPos = 0;
var topImageHolderSize = new Dimension(460, 460);
var maxImageSize = topImageHolderSize.width-20;
var galleryImageSize = 60;
var currentQLabel = null;
var galleryTip = null;

var getPhotoForElement = function(element) {
    var selectIndex = element.id.slice(element.id.lastIndexOf("_")+1);
    try {
        return galleryPhotos[selectIndex-1+cursorPos];
    }
    catch (err) {
        return null;
    }
}

function initTips() {
    galleryTip = new Tips("", {
        showDelay: 800,
        hideDelay: 400,
        onShow: function(tip, el) {
            buildTip(el.retrieve('gallery_photo'), el);
            // Moo Tips clear out the 'text:tip' div
            tip.setStyle('display', 'block');
        }
    });
}

function initGalleryStuff() {
    // handle carriage return in the quicksearch field
	$('q_quick_search').addEvent('keydown', function(event) {
		if (event.code == 13) {
			// prevent the event from propagating to default browser behaviour - i.e. reload page	
			event.stop();
			doQuickSearch();
		}
	});
	
    // handle carriage return in the photographer field
	$('q_photographer').addEvent('keydown', function(event) {
		if (event.code == 13) {
			// prevent the event from propagating to default browser behaviour - i.e. reload page	
			event.stop();
			doQuerySearch();
		}
	});

    buildGallery($('gallery_images'));
    topImageId = $('top_image_id').value;
    var url = topPhotoUrl + "/" + topImageId;
    request = new Request.JSON({
        url: url,
        method: 'get',
        onSuccess: function(responseJson) {
            doTopImage(responseJson);
        },
        onFailure: function(xhr) {
            alert("problem");
        }
    });
    request.get();
}

var scrollGalleryForward = function() {
    if (galleryPhotos == null) return;
    if (cursorPos < galleryPhotos.length-galleryCount) {
        cursorPos++;
        updateGallery();
    }
}

var scrollGalleryBackward = function() {
    if (galleryPhotos == null) return;
    if (cursorPos > 0) {
        cursorPos--;
        updateGallery();
    }
}

function doTopImage() {
    topImageId = $('top_image_id').value;
    var url = topPhotoUrl + "/" + topImageId +"?csharp";
    request = new Request.JSON({
        url: url,
        method: 'get',
        onSuccess: function(responseJson) {
            showTopImage(responseJson);
        },
        onFailure: function() {
        }
    });
    request.get();
}

function showTopImage(responseJson) {
    topPhoto = responseJson;
    updatePhoto();
}

function highlightQLabel(labelElement) {
    if (currentQLabel != null) currentQLabel.removeClass("q_label_highlight");
    currentQLabel = labelElement;
    currentQLabel.addClass("q_label_highlight");
}

function doGallery(responseJson) {
    galleryPhotos = responseJson;
    cursorPos = 0;
    updateGallery();
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

function clearGallery() {
    for (var i=0;i<galleryCount;i++) {
        $('gallery_image_'+(i+1)).empty();
    }
}

function buildGallery(parent) {
    for (var i=0;i<galleryCount;i++) {
    }
    initTips();
    $('gallery_previous').addEvent('click', scrollGalleryBackward);
    $('gallery_next').addEvent('click', scrollGalleryForward);
}

function updateGallery() {
    clearGallery();
    if (galleryPhotos == null || galleryPhotos.length == 0) return;
    var size = galleryCount;
    if (galleryPhotos.length < size) size = galleryPhotos.length;
    for (var i=0;i<galleryCount;i++) {
        $('gallery_image_'+(i+1)).empty();
        var photo = galleryPhotos[cursorPos+i];
        var imgUrl = photo.preview_gallerysmall+'?size='+galleryImageSize+'&compressionLevel=7';
        var imgElement = new Element('img', {
            id: 'gallery_image_img_'+(i+1),
            src:imgUrl
        }).inject($('gallery_image_'+(i+1)));
        buildTip(photo, imgElement);
        imgElement.addEvent('click', selectPhoto);
        imgElement.store('gallery_photo',  photo);
        galleryTip.attach(imgElement);
    }
}

function getTipBody(photo, el) {
    var infoElement = new Element('div');
    new Element('img', {
        'src': photo.preview_gallerytip+'?maxSize=180&compressionLevel=5'
    }).inject(infoElement);
    var p = new Element('p', {
        'text': 'Date Taken: ' + photo.User_Comment
    }).inject(infoElement);
    p.setStyle('text-align', 'left');
    p = new Element('p', {
        'text': 'Caption: ' + photo.Caption
    }).inject(infoElement);
    p.setStyle('text-align', 'left');
    return infoElement;
}
function buildTip(photo, el) {
    infoElement = getTipBody(photo, el);
    el.store('tip:title',  "Date Taken: "+photo.User_Comment);
    el.store('tip:text', infoElement);
}

var selectPhoto = function() {
    galleryTip.hide();
    topPhoto = getPhotoForElement(this);
    updatePhoto();
}

function updatePhoto() {
    try {
       var holderElement = $('top_image_picture');
       holderElement.empty();
       if (topPhoto == null) return;
        if ($('top_image_picture_img') == null) {
            // create the image
 
            holderElement.empty();
            var positioningElement = new Element('div').inject(holderElement);
            positioningElement.setStyles({
                margin: 0,
                top: topImageHolderSize.height/2.0,
                position: 'relative',
                height: '1px',
                overflow: 'visible'
            });
            new Element('img', {
                id: 'top_image_picture_img',
                src:'gfx/loading-bar-black.gif'
            }).inject(positioningElement);
        }
        //var imgUrl = topPhoto.preview_topphoto+'?w='+topImageHolderSize.width+"&height="+topImageHolderSize.height+"&compressionLevel=10";
        var imgUrl = topPhoto.preview_topphoto+'?maxSize='+maxImageSize+'&compressionLevel=10';
        $('top_image_picture_img').set('src', imgUrl);
        var dimension = scaleImage(topPhoto.Horizontal_Pixels, topPhoto.Vertical_Pixels);
        $('top_image_picture_img').setStyles({
            position: 'absolute',
            left:'50%',
            width: dimension.width,
            height: dimension.height,
            top: -(dimension.height/2),
            'margin-left':-(dimension.width/2)
        });
        updatePhotoMetadata();
    }
    catch (err) {
    // do nothing, just go on
    }
}

function updatePhotoMetadata() {
    if (topPhoto < 0) {
        try {
            $('cumulus:Copyright Notice').set('html', "");
            $('cumulus:User Comment').set('html', "");
            $('cumulus:Caption').set('html', "");
            $('cumulus:Byline').set('html', "");
            $('cumulus:Description').set('html', "");
            $('cumulus:Notes').set('html', "");
        }
        catch (err) {
        // do nothing, just go on
        }
    }
    else {
        try {
            $('cumulus:Copyright Notice').set('html', (topPhoto.Copyright_Notice != null) ? topPhoto.Copyright_Notice : "");
            $('cumulus:User Comment').set('html', (topPhoto.User_Comment != null) ? topPhoto.User_Comment : "");
            $('cumulus:Caption').set('html', (topPhoto.Caption != null) ? topPhoto.Caption : "");
            $('cumulus:Byline').set('html', (topPhoto.Byline != null) ? topPhoto.Byline : "");
            $('cumulus:Description').set('html', (topPhoto.Description != null) ? topPhoto.Description : "");
            $('cumulus:Notes').set('html', (topPhoto.Notes != null) ? topPhoto.Notes : "");
        }
        catch (err) {
        // do nothing, just go on
        }
    }
}

function doQuerySearch() {
    galleryPhotos = null;
    var query = buildQuery();
    if (query != null) {
        request = new Request.JSON({
            url: queryBaseUrl,
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
            'q': query,
            'f': p_first,
            'c': p_count
        };
        request.post(queryParams);
        highlightQLabel($('headerQuery'));
    }
}

function doQuickSearch() {
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
        'text': $('q_quick_search').value,
        'f': p_first,
        'c': p_count
    };
    request.post(queryParams);
    highlightQLabel($('headerQuickSearch'));
}

function buildQuery() {
    var query = '';
    var month = $('q_month').value;
    var year = $('q_year').value;
    var photographer = $('q_photographer').value;

    if (photographer != '') {
        query = '"Copyright Notice" == "' + photographer + '"';
    }

    // Special Instructions will be dd-mm-yyyy
    // so if a month, do a contains search for -mm-, if a year check for -yyyy if both, check for -mm-yyyy
    var dateString = '';
    if (month != "-1") {
        dateString += '-'+month+'-';
    }
    if (year != "-1") {
        if (dateString == '') dateString += '-'
        dateString += year;
    }

    // %26 is & (&& => and)
    // %3f is ? (? is contains)
    if (dateString != '') {
        if (query != '') {
        query += ' %26%26 "User Comment" %3f "' + dateString+'"';
        }
        else {
        query = '"User Comment" %3f "' + dateString+'"';
        }
    }
    return query;
}

