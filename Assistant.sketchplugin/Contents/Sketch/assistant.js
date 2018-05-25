var sketch, doc, page, artboard, plugin, selection, app, layer, layers, layerCount;

//Input variables
var horizontalInput;


function initVars(context) {
  sketch = context.api();
  doc = context.document;
  page = doc.currentPage();
  artboard = page.currentArtboard();
  plugin = context.plugin;
  selection = context.selection;

  app = [NSApplication sharedApplication];
}

function settings(context){
  initVars(context);

  var message = sketch.getStringFromUser("Talk to Sketch", 'draw a rectangle');

  if(message == null || message == '') {
    return false;
  }

  var request = send_message(message);
  process_action(request);
}

function send_message(message) {
  var request = NSMutableURLRequest.new();
  var url = encodeURI("https://ai.paint.design/incoming?message=" + encodeURIComponent(message));
  [request setURL: [NSURL URLWithString: url]];
  [request setHTTPMethod: @"GET"];
  var error = null;
  var responseCode = null;
  var oResponseData = [NSURLConnection sendSynchronousRequest: request returningResponse: responseCode error: error];
  if (!oResponseData) {
     log(error);
  }
  var dataString = [[NSString alloc] initWithData: oResponseData encoding: NSUTF8StringEncoding];
  return JSON.parse(dataString);
}

function process_action(response) {
  var message = response["message"];
  var details = response["metadata"];

  if(message != null) {
    doc.showMessage(message);
  }

  if(details["eval"] != null) {
    evaluate_string(details["eval"]);
    return;
  }

  if(details["draw"]) {
    draw_shape(details);
  }

  if(details["svg"] != null) {
    insert_svg(details["svg"]);
  }
}

function draw_shape(details) {
  var shape;

  // determine the shape to draw
  switch(details["shape"]) {
      case "rectangle":
          shape = MSRectangleShape.alloc().init();
          break;
      case "circle":
          shape = MSOvalShape.alloc().init();
          break;
      case "oval":
          shape = MSOvalShape.alloc().init();
          break;
      case "polygon":
          shape = MSPolygonShape.alloc().init();
          break;
      case "star":
          shape = MSStarShape.alloc().init();
          shape.numberOfPoints = 5;
          break;
      case "line":
          shape = MSLine.alloc().init();
          break;
      case "triangle":
          shape = MSTriangleShape.alloc().init();
          break;
      default:
          return;
  }

  // determine the dimensions
  var dimensions = details["dimensions"];
  var coordinates = details["coordinates"];

  var width, height, x, y;

  // set coordinates
  x = coordinates["x"];
  y = coordinates["y"];

  // set dimensions
  width = dimensions["width"];
  height = dimensions["height"];

  shape.frame = MSRect.rectWithRect(NSMakeRect(0, 0, width, height));

  // Place it in the document
  var shapeGroup = MSShapeGroup.shapeWithPath(shape);
  var fill = shapeGroup.style().addStylePartOfType(0);

  // set fill color
  var color = details["color"]; // rgb color
  fill.color = MSColor.colorWithRed_green_blue_alpha(color[0] / 255, color[1] / 255, color[2] / 255, 1);

  // If an artboard is selected place it there otherwise put it in the page
  add_to_artboard(shapeGroup);

  // Select the created shape
  shapeGroup.setIsSelected(true);
}

function evaluate_string(string) {
  eval(string);
}

function insert_svg(url) {
  var logoURL = [NSURL URLWithString:url];
  var request = [NSURLRequest requestWithURL:logoURL];
  var response = NSURLConnection.sendSynchronousRequest_returningResponse_error(request, null, null);

  if (response.length() == 0) {
    [doc showMessage:'No logo with shortname found.'];
  }
  else {
    var svgImporter = MSSVGImporter.svgImporter();
    svgImporter.prepareToImportFromURL(logoURL);
    var importedSVGLayer = svgImporter.importAsLayer();
    importedSVGLayer.name = "SVG";

    var svgFrame = importedSVGLayer.frame();
    var ratio = svgFrame.width() / svgFrame.height();

    [svgFrame setX:0];
    [svgFrame setY:0];
    [svgFrame setWidth:svgFrame.width()];
    [svgFrame setHeight:svgFrame.height()];

    add_to_artboard(importedSVGLayer);
  }
}

function add_to_artboard(object) {
  if (artboard) {
    artboard.addLayers([object]);
  } else {
    page.addLayers([object]);
  }
}
