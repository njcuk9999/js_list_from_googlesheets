// function to build matrix (2D array)
function matrix(rows, cols, defaultValue){
  var arr = [];
  // Creates all lines:
  for(var i=0; i < cols; i++){
      // Creates an empty line
      arr.push([]);
      // Adds cols to the empty line:
      arr[i].push( new Array(rows));
      for(var j=0; j < rows; j++){
        // Initializes:
        arr[i][j] = defaultValue;
      }
  }
return arr;
};

// function to parse JSON data into 2D array (as in googlesheets)
function parse_googlesheet(data) {
  var entries = data.feed.entry;
  
  var Ncol = data.feed.gs$colCount.$t;
  var Nrow = data.feed.gs$rowCount.$t;
  // create an array to hold data
  result = matrix(Nrow, Ncol, "");
  // Fill columns
  var cols = [];
  for (var i=0; i<entries.length; i++) {
    var entry = entries[i];
    var colnum = parseInt(entry.gs$cell.col) - 1;
    var rownum = parseInt(entry.gs$cell.row) - 1;
    var value = entry.content.$t;
    result[colnum][rownum] = value;
  }
  // convert into columns
  var d = [];
  d.columns = [];
  for (var j=0; j<result.length; j++) {
    var key = result[j][0];
    var values = result[j].slice(1, result[j].length-1);
    d.columns[key] = values;
  }
  return d;
};

// function to define python-like mask for a column
function define_filter(column, query) {
  var mask = new Array(column.length);
  for (var i=0; i < column.length; i++) {
    var cond = (column[i] === query);
    mask[i] = cond;
  }
  return mask;
};

// function to apply python-like mask to column (mask.length === column.length)
function apply_filter(column, mask) {
  if (column.length > mask.length) {
    console.log("Error: Mask too short for column");
    return [];
  }
  var fcolumn = [];
  for (var i=0; i < column.length; i++) {
    if (mask[i]) {
      fcolumn.push(column[i]);
    }
  }
  return fcolumn;
};

// function to filter full data set (using define_filter and apply_filter)
function data_filter(data, column, query) {
  var mask = define_filter(column, query);
  var newdata = [];
  newdata.columns = [];
  for (var key in data.columns) {
    var newvalues = apply_filter(data.columns[key], mask);
    newdata.columns[key] = newvalues;
  }
  return newdata;
};

// ---------------------------------------------------------
// Define URL variables
// ---------------------------------------------------------
// The URL to the google sheet
var start = "https://spreadsheets.google.com/feeds/cells/";
var defaultKey = "12W99mv2eN0ZX2P1t6jP3_oZUL2JF5BJqL5BI7CVVdfU";
var end= "/od6/public/values?alt=json";
// ---------------------------------------------------------
// Define html to add
// ---------------------------------------------------------
// html that comes before list items (in this order)
var pre1 = "<div class=\"w3-container w3-text-black w3-large\">";
var sectionTitle = "";
var pre2 = "</div><div class=\"w3-container w3-text-grey\" id=\"text\"><ul>";
// html that forms the list items (in this order)
var listHtml1 = "<li>"
var listHtml2 = "<a target=\"";
var listHtml3 = "\" href=\"";
var listHtml4 = "\">";
var listHtml5 = "</a>";
var listNote1 = "<div class=\"w3-container w3-text-brown w3-small\""
var listNote2 = " id=\"text\">"
var listNote3 = "</div>"
var listHtml6 = "</li>";
// html that comes after the list items
var post = "</ul></div>";
// ---------------------------------------------------------
// function to make the data list
// ---------------------------------------------------------
function makeList(key){
  var mydata = [];
  // If key is none use the default (provided here)
  if (key == "None") {
    key = defaultKey;
  }
  // Construct URL
  var url = start + key + end;
  console.log("Getting JSON with query: " + url);
  // JSON query
  $.ajax({
  dataType: "json",
  url: url,
  async: false,
  success: function(data) {
    console.log("JSON Query Successful");
    // load data into array
    mydata = parse_googlesheet(data);
    }
  });
  // return array version of spreadsheet
  return mydata;
}
// ---------------------------------------------------------
// function to filter the data list
// ---------------------------------------------------------
function filterList(querytag, d){
      // filter data
      data = data_filter(d, d.columns.tag, querytag);
      
      if (data.columns.tag.length > 0) {
        // populate arrays
        var tag = data.columns.tag;
        var sections = data.columns.section;
        var targets = data.columns.listtarget;
        var descriptions = data.columns.desc;
        var urls = data.columns.listurl;
        var notes = data.columns.notes;
        // Create output from pre html
        output = pre1 + sections[0] + ":" + pre2;
        // Append list items to output
        for (var i=0; i < tag.length; i++)
        {
          // add the html for list item
          output += listHtml1;
          // if we have a url add it
          if (urls[i] != "None") {
            output += listHtml2 + targets[i];
            output += listHtml3 + urls[i];
            output += listHtml4 + descriptions[i] + listHtml5;
          } else {
            output += descriptions[i];
          }
          // If we have a note add it
          if (notes[i] != "None") {
            output += listNote1 + listNote2
            output += notes[i] + listNote3
          }
          // add the end of the list item
          output += listHtml6;
        }
        // add post html to output
        output += post;
        // return output
        document.getElementById(querytag).innerHTML = output;
      } else {
        console.log("No rows --> no list")
      }
}

// ---------------------------------------------------------
// To run the code (done from html page)
// ---------------------------------------------------------
// makeList("None");
// var id = "home-most-recent-pub";
// filterList(id);
