// heavily inspired by kristof
// https://github.com/kristof/sketch-i18n

var com = {};

com.getflourish = {

	debugLog: function(msg) {
		if(this.debug) log(msg);
	},

	alert: function (msg, title) {
		title = title || 'Sketch Strings';
		var app = [NSApplication sharedApplication];
		[app displayDialog:msg withTitle:title];
	},
	getTextLayersForPage: function(page) {
		var layers = [page children],
				textLayers = [];

		for (var i = 0; i < layers.count(); i++) {
			var layer = [layers objectAtIndex:i];
			if (this.isTextLayer(layer)) {
				textLayers.push(layer);
			}
		}

		return textLayers;
	},
	getTextLayersFromDocument: function () {

		var doc = context.document;
		var textLayers = [];
		var pages = doc.pages();
		var json;

		for (var i = 0; i < pages.count(); i++) {
			var page = pages[i].children();

			// calculate the bottom position of the selected layer
			var type = MSTextLayer;

			// set up the predicate and receive an array of matched layers
			var predicate = NSPredicate.predicateWithFormat("class == %@", type);

			var newLayers = arrayFromImmutableArray(page.filteredArrayUsingPredicate(predicate));
			// push layers
			textLayers.push(newLayers);

			// get locales for page
		}

		return [].concat.apply([],textLayers);
	},

	isTextLayer: function(layer) {
		if (layer.class() === MSTextLayer) {
			return true;
		}
		return false;
	},

	// todo: exclude layers that have the same name as the string (probably unnamed then)

	stringsFromTextLayers: function(textLayers) {
		var localeObject = {};

		var pageName = doc.currentPage().name();

		var data = [];

		for (var i = 0; i < textLayers.length; i++) {
			var textLayer = textLayers[i],
					stringValue = unescape(textLayer.stringValue());

			localeObject[textLayer.name()] = stringValue;
		}

		return localeObject;
	},

	getStringsForAllPages: function () {

		var pages = context.document.pages();
		var data = {};
		var page;

		for (var i = 0; i < pages.count(); i++) {
			page = pages[i];
			if (page.name().charAt(0) != "-") data[page.name()] = this.getStringsForPage(page)
		}
		var localeJsonString = JSON.stringify(data, undefined, 2);
		return localeJsonString;
	},

	getStringsForPage: function(page) {
		var textLayers = this.getTextLayersForPage(page);
		return this.stringsFromTextLayers(textLayers);
	},
	copyStringToClipboard: function(string) {
		var clipboard = NSPasteboard.generalPasteboard();
		clipboard.declareTypes_owner([NSPasteboardTypeString], null);
		clipboard.setString_forType(string , NSPasteboardTypeString);
		this.alert('The strings have been copied to your clipboard.', null);
		return true;
	},
	debug: false

};


function arrayFromImmutableArray (nsarray) {
	var output = [];
	// convert immutable NSArray to mutable array
	for (var i = 0; i < nsarray.count(); i++) {
	    output.push(nsarray[i]);
	}
	return output;
}