/*
Base URL for Football
 */
let base_url = "https://api.football-data.org/";
let token = "221e269b309544cea2bc76ceb2ca49ff";

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}


/*
Get Articles
 */

function getStandings() {
    /*
    get from caches
    */

    if ("caches" in window) {
        caches.match(base_url + "v2/competitions/2014/standings").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    let standingsHTML = "";
                    data.standings[0].table.forEach(function (standing) {
                        let urlThumbnail = standing.team.crestUrl.replace(/^http:\/\//i, 'https://');
                        standingsHTML += `
                                        <li class="collection-item avatar">
                                            <img src="${urlThumbnail}" alt="" class="circle center-block">
                                            <span class="title"><b>${standing.team.name}</b></span>
                                            <p class="small">
                                                <b class="orange-text">${standing.playedGames} Games</b> <span class="blue-text">${standing.won}W</span>/<span class="grey-text">${standing.draw}D</span>/<span class="red-text">${standing.lost}L</span>
                                            </p>
                                            <span class="chip">${standing.position} Position with ${standing.points} Point</span>
                                            <a href="./profile.html?id=${standing.team.id}&saved=false" target="_blank" class="secondary-content">➤</a>
                                        </li>
                                        `;
                    });
                    document.getElementById("standings").innerHTML = standingsHTML;
                })
            }
        })
    }

    fetch(base_url + "v2/competitions/2014/standings", {
            headers: {
                "X-Auth-Token": token
            },
            credentials: "same-origin"
        }
        ).then(status)
        .then(json)
        .then(function (data) {
            let standingsHTML = "";
            data.standings[0].table.forEach(function (standing) {
                let urlThumbnail = standing.team.crestUrl.replace(/^http:\/\//i, 'https://');
                standingsHTML += `
                <li class="collection-item avatar">
                    <img src="${urlThumbnail}" alt="" class="circle center-block">
                    <span class="title"><b>${standing.team.name}</b></span>
                    <p class="small">
                        <b class="orange-text">${standing.playedGames} Games</b> <span class="blue-text">${standing.won}W</span>/<span class="grey-text">${standing.draw}D</span>/<span class="red-text">${standing.lost}L</span>
                    </p>
                    <span class="chip">${standing.position} Position with ${standing.points} Point</span>
                    <a href="./profile.html?id=${standing.team.id}&saved=false" class="secondary-content">➤</a>
                </li>
                `;
            });
            document.getElementById("standings").innerHTML = standingsHTML;
        })
        .catch(error)
}

/*
Get Detail Articles
 */
function getTeamById() {
    return new Promise(resolve => {
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");

        /*
        from chaches
         */
        if ("caches" in window) {
            caches.match(base_url + "v2/teams/" + idParam).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        let gambar = document.getElementById("thumbnail-profile");
                        gambar.src = data.crestUrl.replace(/^http:\/\//i, 'https://');

                        document.getElementById("founded-profile").innerText = "Founded " + data.founded;
                        document.getElementById("team-profile").innerHTML = `<b>${data.name}</b>`;
                        document.getElementById("address-profile").innerText = data.address;
                        document.getElementById("stadium-profile").innerText = data.venue;

                        let squadTable = "";
                        data.squad.forEach(function (squad) {
                            squadTable +=`
                                        <tr>
                                            <td>${squad.name}</td>
                                            <td>${squad.position}</td>
                                        </tr>
                                        `;
                        });
                        document.getElementById("squad-profile").innerHTML = squadTable;

                        resolve(data);
                    })
                }
            })
        }


        /*
        from Internet
         */
        fetch(base_url + "v2/teams/" + idParam, {
                headers: {
                    "X-Auth-Token": token
                },
                credentials: "same-origin"
            }
        ).then(status)
            .then(json)
            .then(function (data) {
                let gambar = document.getElementById("thumbnail-profile");
                gambar.src = data.crestUrl.replace(/^http:\/\//i, 'https://');

                document.getElementById("founded-profile").innerText = "Founded " + data.founded;
                document.getElementById("team-profile").innerHTML = `<b>${data.name}</b>`;
                document.getElementById("address-profile").innerText = data.address;
                document.getElementById("stadium-profile").innerText = data.venue;

                let squadTable = "";
                data.squad.forEach(function (squad) {
                    squadTable +=`
                <tr>
                    <td>${squad.name}</td>
                    <td>${squad.position}</td>
                </tr>
                `;
                });
                document.getElementById("squad-profile").innerHTML = squadTable;

                resolve(data);
            })
    });
}

/*
Get Detail Articles
 */
function getTeamMatchById() {
    return new Promise(resolve => {
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");

        /*
        from chaches
         */
        if ("caches" in window) {
            caches.match(base_url + "v2/teams/" + idParam + "/matches?status=SCHEDULED").then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        let matchTable = "";
                        data.matches.forEach(function (match) {
                            matchTable += `
                                <tr>
                                    <td>${match.homeTeam.name}</td>
                                    <td>${match.awayTeam.name}</td>
                                    <td>${match.utcDate.replace("Z", '').split("T").join()}</td>
                                    <td>${match.competition.name}</td>
                                </tr>
                                `;
                        });
                        document.getElementById("match-profile").innerHTML = matchTable;
                        resolve(data);
                    })
                }
            })
        }


        /*
        from Internet
         */
        fetch(base_url + "v2/teams/" + idParam + "/matches?status=SCHEDULED", {
                headers: {
                    "X-Auth-Token": token
                },
                credentials: "same-origin"
            }
        ).then(status)
            .then(json)
            .then(function (data) {
                let matchTable = "";
                data.matches.forEach(function (match) {
                    matchTable += `
                    <tr>
                        <td>${match.homeTeam.name}</td>
                        <td>${match.awayTeam.name}</td>
                        <td>${match.utcDate.replace("Z", '').split("T").join()}</td>
                        <td>${match.competition.name}</td>
                    </tr>
                    `;
                });
                document.getElementById("match-profile").innerHTML = matchTable;
                resolve(data);
            })
    });
}

/*
Get Favorite Team
 */
function getSavedFavoriteTeam() {
    getFavoriteTeam().then(function (teams) {
        let favTeamHTML = "";
        teams.forEach(function (team) {
            let urlThumbnail = team.crestUrl.replace(/^http:\/\//i, 'https://');
            favTeamHTML += `
                <li class="collection-item avatar">
                    <img src="${urlThumbnail}" alt="" class="circle center-block">
                    <span class="title"><b>${team.name}</b></span>
                    <span class="chip">${team.activeCompetitions.length} active competitions</span>
                    <a href="./profile.html?id=${team.id}&saved=true" class="secondary-content">➤</a>
                </li>
                `;
        });
        document.getElementById("fav-teams").innerHTML = favTeamHTML;
    })
}

/*
Get Detail Favorite Team
 */
function getSavedFavoriteTeamDetail() {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    getFavoriteTeamById(idParam).then(function (data) {
        let gambar = document.getElementById("thumbnail-profile");
        gambar.src = data.crestUrl.replace(/^http:\/\//i, 'https://');

        document.getElementById("founded-profile").innerText = "Founded " + data.founded;
        document.getElementById("team-profile").innerHTML = `<b>${data.name}</b>`;
        document.getElementById("address-profile").innerText = data.address;
        document.getElementById("stadium-profile").innerText = data.venue;

        let squadTable = "";
        data.squad.forEach(function (squad) {
            squadTable +=`
                <tr>
                    <td>${squad.name}</td>
                    <td>${squad.position}</td>
                </tr>
                `;
        });
        document.getElementById("squad-profile").innerHTML = squadTable;
    });
}

/*
Get Detail Match Team
 */
function getSavedFavoriteMatchDetail() {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    getMatchTeamById(idParam).then(function (data) {
        let matchTable = "";
        data.data.matches.forEach(function (match) {
            matchTable += `
                                <tr>
                                    <td>${match.homeTeam.name}</td>
                                    <td>${match.awayTeam.name}</td>
                                    <td>${match.utcDate.replace("Z", '').split("T").join()}</td>
                                    <td>${match.competition.name}</td>
                                </tr>
                                `;
        });
        document.getElementById("match-profile").innerHTML = matchTable;
    });
}

/*
Delete Favorite Data
 */
function deleteSavedFavoriteTeam() {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    deleteFavoriteMatchById(idParam).then(function () {

    });
    deleteFavoriteTeamById(idParam).then(function () {
        getTeamById();
    })
}

/*
Showing notifications
 */
function showNotifikasiSederhana() {
    const title = "Notifikasi sederhana";
    const options = {
        "body": "Ini sample notifikasi",
        "icon": "/assets/icon.jpg",
        'actions': [
            {
                'action': 'yes-action',
                'title': 'Jelas',
            },
            {
                'action': 'no-action',
                'title': 'Tidak dong',
            }
        ]
    };

    if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(function (registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.log("fitur notifikasi tidak diijinkan");
    }
}