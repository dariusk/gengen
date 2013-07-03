var ds,
    generated = false;

function parseUrl(url) {
  return url.substr(url.indexOf('key=')+4, url.indexOf('#')-(url.indexOf('key=')+4));
}

var pick = function(array) {
  array = _.reject(array, function(el) {
    return el === null;
  });
  return array[Math.floor(Math.random()*array.length)];
};

function doIt(key) {
  url = $('#url').val();
  var key = parseUrl(url);
  var $genButton = $('<div id="generator"><button onclick="generate()">Generate</button><h3 id="title">...</h3><h4 id="author"></h4><div id="generated">...</div><p><a href="gen.html?key=' + key + '">Share this link with your friends!</a></div>');

  ds = new Miso.Dataset({
    key : key,
    worksheet : '1',
    importer: Miso.Dataset.Importers.GoogleSpreadsheet,
    parser : Miso.Dataset.Parsers.GoogleSpreadsheet
  });

  ds.fetch({
    success : function() {
      if (generated) {
        $('#generator').remove();
      }
      $('#result').text('Success! Now you can generate stuff:');
      $('#result').after($genButton);
      generated = true;
    },
    error : function() {
      $('#result').text('Um, something went wrong...');
    }
  });
}

function generate() {
  var result = '';
  var title = 'My Generator';
  var author = 'Someone';
  ds.eachColumn(function(columnName, column, index) {
    a = column.data;
    var uniq = _.uniq(a);
    // if it's a title, do special stuff
    if (columnName.toLowerCase() === 'title') {
      title = column.data[0];
    }
    else if (columnName.toLowerCase() === 'author') {
      author = column.data[0];
    }
    else {
      result += pick(column.data) + ' ';
    }
  });
  $('#title').text(title);
  $('#author').text('by ' + author);
  $('#generated').text(result);
}

function showHelp() {
  $('#help').fadeToggle();
}
