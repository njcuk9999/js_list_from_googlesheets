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
}

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
}

// function to define python-like mask for a column
function define_filter(column, query) {
  var mask = new Array(column.length);
  for (var i=0; i < column.length; i++) {
    var cond = (column[i] === query);
    mask[i] = cond;
  }
  return mask;
}

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
}

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
}


// The URL to the google sheet
var start = "https://spreadsheets.google.com/feeds/cells/";
var key = "12W99mv2eN0ZX2P1t6jP3_oZUL2JF5BJqL5BI7CVVdfU";
var end= "/od6/public/values?alt=json";
var url = start + key + end;

// html that comes before list items (in this order)
var pre1 = "<div class=\"w3-container w3-text-black w3-large\">";
var sectionTitle = "";
var pre2 = "</div><div class=\"w3-container w3-text-grey\" id=\"text\"><ul>";
// html that forms the list items (in this order)
var listHtml1 = "<li><a target=\"";
var listHtml2 = "\" href=\"";
var listHtml3 = "\">";
var listHtml4 = "</a><br></li>";
// html that comes after the list items
var post = "</ul></div>";

// function makeList(tag) {



// function expects data.feed.entry
// where entry is an array of objects with each object having
// object.title.$t   and    object.content.$t


function makeList(id, querytag){

  // JSON query
  $.getJSON(url, function() {console.log("success");})
    .done(function(data){
      // load data into array
      data = parse_googlesheet(data);

      // filter data
      data = data_filter(data, data.columns.tag, querytag);
      
      if (data.columns.tag.length > 1) {
        // populate arrays
        var tag = data.columns.tag;
        var sections = data.columns.section;
        var targets = data.columns.listtarget;
        var descriptions = data.columns.desc;
        var urls = data.columns.listurl;
        // Create output from pre html
        output = pre1 + sections[0] + pre2;

        // Append list items to output
        for (var i=0; i < tag.length; i++)
        {
          output += listHtml1 + targets[i];
          output += listHtml2 + urls[i];
          output += listHtml3 + descriptions[i];
          output += listHtml4;
        }
        // add post html to output
        output += post;
        // return output
        document.getElementById(id).innerHTML = output;
      } else {
        console.log("No rows --> no list")
      }

      // return output
      })
    .fail(function() {
      console.log( "getJSON error");
      });
    }


var querytag = "home-poster";
var id = "location display";
makeList(id, querytag);