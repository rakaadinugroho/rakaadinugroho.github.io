var dbPromised = idb.open("spain-league", 2, function(upgradeDb) {
    var articlesObjectStore = upgradeDb.createObjectStore("profiles", {
        keyPath: "id"
    });
    articlesObjectStore.createIndex("name", "name", {
        unique: false
    });
    upgradeDb.createObjectStore("matches", {
        keyPath: "id"
    });
});

function saveProfileTeam(profile) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("profiles", "readwrite");
      var store = tx.objectStore("profiles");
      console.log(profile);
      store.add(profile);
      return tx.complete;
    })
    .then(function() {
        M.toast({html: 'Data berhasil disimpan!'})
    });
}

function saveMatches(matches, key) {
    dbPromised
        .then(function (db) {
            var tx = db.transaction("matches", "readwrite");
            var store = tx.objectStore("matches");
            var dataToSave = {
                id: key,
                data: matches
            };
            store.add(dataToSave);
            return tx.complete;
        })
        .then(function () {
            M.toast({html: "Daftar Match disimpan"})
        })
}


function getFavoriteTeam() {
    return new Promise(resolve => {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("profiles", "readonly");
                var store = tx.objectStore("profiles");
                return store.getAll();
            })
            .then(function (favteam) {
                resolve(favteam);
            });
    })
}

function getFavoriteTeamById(id) {
    return new Promise(resolve => {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("profiles", "readonly");
                var store = tx.objectStore("profiles");
                return store.get(parseInt(id));
            })
            .then(function (team) {
                resolve(team);
            })
    });
}

function getMatchTeamById(id) {
    return new Promise(resolve => {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("matches", "readonly");
                var store = tx.objectStore("matches");
                return store.get(parseInt(id));
            })
            .then(function (team) {
                resolve(team);
            })
    });
}

function deleteFavoriteTeamById(id) {
    return new Promise(resolve => {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("profiles", "readwrite");
                tx.objectStore("profiles").delete(parseInt(id));
                return tx.complete;
            })
            .then(function () {
                M.toast({html: 'Data berhasil dihapus!'})
            })
    });
}

function deleteFavoriteMatchById(id) {
    return new Promise(resolve => {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("matches", "readwrite");
                tx.objectStore("matches").delete(parseInt(id));
                return tx.complete;
            })
            .then(function () {
                M.toast({html: 'Data Matches dihapus!'})
            })
    });
}