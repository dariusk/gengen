var ds;

function parseUrl(url) {
  return url.substr(url.indexOf('key=')+4, url.indexOf('#')-(url.indexOf('key=')+4));
}

var pick = function(array) {
  array = _.reject(array, function(el) {
    return el === null;
  });
  return array[Math.floor(Math.random()*array.length)];
};

var $genButton = $('<button onclick="generate()">Generate</button><div id="generated">...</div>');

function doIt() {
  url = $('#url').val();

  ds = new Miso.Dataset({
    key : parseUrl(url),
    worksheet : '1',
    importer: Miso.Dataset.Importers.GoogleSpreadsheet,
    parser : Miso.Dataset.Parsers.GoogleSpreadsheet
  });

  ds.fetch({
    success : function() {
      // your success callback here!
      $('#result').text('Success! Now you can generate stuff:');
      $('#result').after($genButton);
    },
    error : function() {
      // your error callback here!
    }
  });
}

function generate() {
  var result = '';
  ds.eachColumn(function(columnName, column, index) {
    a = column.data;
    var uniq = _.uniq(a);
    // if the array is all nulls, just use the column name
    if (uniq.length === 1 && uniq[0] === null) {
      result += columnName + ' ';
    }
    else {
      result += pick(column.data) + ' ';
    }
  });
  $('#generated').text(result);
}
