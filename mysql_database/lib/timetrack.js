var qs = require('querystring');

exports.sendHtml = function(res, html) { //Send HTML response
	res.setHeader('Content-Type', 'text/html'); 
	res.setHeader('Content-Length', Buffer.byteLength(html)); 
	res.end(html);
};

exports.parseReceivedData = function(req, cb) { //Parse HTTP POST data
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk){ body += chunk });
  req.on('end', function() {
    var data = qs.parse(body);
    cb(data);
  });
};

exports.actionForm = function(id, path, label) { //Render simple form
	var html = '<form method="POST" action="' + path + '">' +
    '<input type="hidden" name="id" value="' + id + '">' +
    '<input type="submit" value="' + label + '" />' +
    '</form>';
  return html;
};

exports.add = function(db, req, res) {
	exports.parseReceivedData(req, function(work) { //Parse HTTP POST data
		db.query(
			  "INSERT INTO work (hours, date, description) " + //SQL to add work record
		      " VALUES (?, ?, ?)",
		      [work.hours, work.date, work.description], //Work record data
		      function(err) {
		        if (err) throw err;
		         exports.show(db, res); //Show user a list of work records
		      }
		);
	});
};

exports.delete = function(db, req, res) {
  exports.parseReceivedData(req, function(work) { //Parse HTTP POST data
	  db.query(
		  "DELETE FROM work WHERE id=?", //SQL to delete work record
		  [work.id], //Work record ID
		  function(err) {
		    if (err) throw err;
		    exports.show(db, res); //Show user a list of work records
		  } 
	  );
  });
};

exports.archive = function(db, req, res) {
  exports.parseReceivedData(req, function(work) { //Parse HTTP POST data
    db.query(
      "UPDATE work SET archived=1 WHERE id=?", //SQL to update work record
      [work.id], //Work record ID
      function(err) {
        if (err) throw err;
        exports.show(db, res); //Show user a list of work records
      }
    );
  });
};

exports.show = function(db, res, showArchived) {
  var query = "SELECT * FROM work " + //SQL to fetch work records
  "WHERE archived=? " +
  "ORDER BY date DESC";
  var archiveValue = (showArchived) ? 1 : 0;
  db.query(
	query,
	[archiveValue], //Desired work-record archive status
	function(err, rows) {
	  if (err) throw err;
	  html = (showArchived)
	  ? ''
	  : '<a href="/archived">Archived Work</a><br/>';
      html += exports.workHitlistHtml(rows); //Format results as HTML table
      html += exports.workFormHtml();
      exports.sendHtml(res, html); //Send HTML response to user
	}
  );
};

exports.showArchived = function(db, res) {
  exports.show(db, res, true); //Show only archived work records
};

exports.workHitlistHtml = function(rows) {
  var html = '<table>';
  for(var i in rows) { //Render each work record as HTML table row
  	html += '<tr>';
	html += '<td>' + rows[i].date + '</td>';
	html += '<td>' + rows[i].hours + '</td>';
	html += '<td>' + rows[i].description + '</td>';
	if (!rows[i].archived) { //Show archive button if work record isn’t already archived
		html += '<td>' + exports.workArchiveForm(rows[i].id) + '</td>';
    }
	html += '<td>' + exports.workDeleteForm(rows[i].id) + '</td>';
    html += '</tr>';
  }
  html += '</table>';
  return html;
};

exports.workFormHtml = function() {
  var html = '<form method="POST" action="/">' + //Render blank HTML form for entering new work record
  '<p>Date (YYYY-MM-DD):<br/><input name="date" type="text"><p/>' +
  '<p>Hours worked:<br/><input name="hours" type="text"><p/>' +
  '<p>Description:<br/>' +
  '<textarea name="description"></textarea></p>' +
  '<input type="submit" value="Add" />' +
  '</form>';
  return html;
};

exports.workArchiveForm = function(id) { //Render Archive button form
  return exports.actionForm(id, '/archive', 'Archive');
};

exports.workDeleteForm = function(id) { //Render Delete button form
  return exports.actionForm(id, '/delete', 'Delete');
};


