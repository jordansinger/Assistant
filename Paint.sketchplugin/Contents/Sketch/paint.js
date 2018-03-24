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

function createWindow(context) {
  initVars(context);

  // Setup the window
  var alert = COSAlertWindow.new();
  alert.setMessageText("Paint")
  alert.addButtonWithTitle("Ok");
  alert.addButtonWithTitle("Cancel");


  // Create the main view
  var viewWidth = 400;
  var viewHeight = 70;
  var viewSpacer = 10;
  var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view);

  // Create labels
  // var infoLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 33, (viewWidth - 100), 35));
  var horizontalLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 20, (viewWidth / 2) - 10, 20));

  horizontalLabel.setStringValue("Talk to Sketch");
  horizontalLabel.setSelectable(false);
  horizontalLabel.setEditable(false);
  horizontalLabel.setBezeled(false);
  horizontalLabel.setDrawsBackground(false);

  // Add labels
  // view.addSubview(infoLabel);
  view.addSubview(horizontalLabel);

  // Create textfields
  horizontalTextField = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 65, viewWidth - 100, 40));
  horizontalTextField.setPlaceholderString("draw a rectangle...");

  // view.makeFirstResponder(horizontalTextField);
  alert.alert().window().setInitialFirstResponder(horizontalTextField);


  // Add textfields
  view.addSubview(horizontalTextField);

  // Show the dialog window
  return [alert];
}

function settings(context){
  // Display settings window

  // Create and show dialog window

  var window = createWindow(context);
  var alert = window[0];

  var response = alert.runModal()

  if(response == "1000"){

    horizontalInput = horizontalTextField.stringValue();
    if(horizontalInput != "") {
      var request = send_message(horizontalInput);
      process_action(request);
    }
    return true;
  }
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
