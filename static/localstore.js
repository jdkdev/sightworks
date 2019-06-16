function toBinArray(str) {
    var l = str.length,
        arr = new Uint8Array(l);
    for (var i = 0; i < l; i++) arr[i] = str.charCodeAt(i);
    return arr;
}
function toBinString(arr) {
    var uarr = new Uint8Array(arr);
    var strings = [], chunksize = 0xffff;
    // There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want
    for (var i = 0; i * chunksize < uarr.length; i++) {
        strings.push(String.fromCharCode.apply(null, uarr.subarray(i * chunksize, (i + 1) * chunksize)));
    }
    return strings.join('');
}
// Normally Sql.js tries to load sql-wasm.wasm relative to the page, not relative to the javascript
// doing the loading. So, we help it find the .wasm file with this function.
var config = {
    locateFile: filename => `${baseUrl}/${filename}`
}
initSqlJs(config).then(function (SQL) {
    var dbstr = window.localStorage.getItem("viewcount.sqlite");
    if (dbstr) {
        var db = new SQL.Database(toBinArray(dbstr));
    } else {
        var db = new SQL.Database();
        db.run("CREATE TABLE views (date INTEGER PRIMARY KEY)");
    }
    db.run("INSERT INTO views(date) VALUES (?)", [Date.now()]);
    document.getElementById('views').textContent = db.exec("SELECT COUNT(*) FROM views")[0].values[0][0];
    var count = 0,
        dates = document.getElementById("dates");
    db.each("SELECT date FROM views ORDER BY date ASC",
        function callback(row) {
            var li = document.createElement("li");
            li.textContent = new Date(row.date);
            dates.appendChild(li);
        }, function done() {
            var dbstr = toBinString(db.export());
            window.localStorage.setItem("viewcount.sqlite", dbstr);
        }
    );
});
