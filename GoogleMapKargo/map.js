$: mongodb = require("mongodb")

function initMap() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    
    var options = {
        zoom: 10,
        center: {
            lat: 42.3611,
            lng: -71.057
        }
    }
    //harita
    dict = {
        "a": 1
    }
    localStorage.setItem("key", JSON.stringify(dict))

    let window2 = window.open("map.html")

    window.addEventListener("message", (e) => {
        console.log(e.data)
        const directionsService1 = new google.maps.DirectionsService();
        const directionsRenderer1 = new google.maps.DirectionsRenderer();
        if (e.data == "window2") {
            dict = JSON.parse(localStorage.getItem("key"))

            window2.document.getElementById("yaziii").style.visibility = "hidden"


            console.log(window2.document.getElementById("map2"))
            let op = {

                zoom: 8,
                center: {
                    lat: 42.3601,
                    lng: -71.0589
                }
            }
            var map = new google.maps.Map(window2.document.getElementById("map2"), op);

            console.log("çizdiriliyor")
            directionsRenderer.setMap(map);


            console.log(dict)
            console.log("ikinci ekran wypts", wypts)


        }
    }, false)


    function update_sifre(myquery, newvalues) {
        let MongoClient = require('mongodb').MongoClient;
        let url = "mongodb+srv://bugrahan:Bugra_01@database.ibnls.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            let dbo = db.db("mydb");

            dbo.collection("mapapp").updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });
        });
    }


    let giris_durumu
    let kayit_durumu

    function database_kayit(myobj) {
        let MongoClient = mongodb.MongoClient;
        let url = "mongodb+srv://bugrahan:Bugra_01@database.ibnls.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            let dbo = db.db("mydb");

            dbo.collection("mapapp").insertOne(myobj, function (err, res) {
                if (err) throw err;
                console.log("Yeni kayıt olundu");
                kayit_durumu = 1
                db.close();
            });
        });
    }

    function giris_yapfunc(giris) {
        let MongoClient = mongodb.MongoClient;
        let url = "mongodb+srv://bugrahan:Bugra_01@database.ibnls.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            let dbo = db.db("mydb");
            dbo.collection("mapapp").find(giris).toArray(function (err, result) {
                if (err) throw err;
                if (result.length > 0) {
                    console.log("giris basarili")
                    giris_durumu = 1
                } else {

                    console.log("giris basarisiz")
                    giris_durumu = 0
                }
                db.close();
            });
        });
    }

    var map = new google.maps.Map(document.getElementById("map"), options);
    var markers = {
        coords: [],

    }


    var marker1 = new google.maps.Marker({
        position: {
            lat: 42.2926,
            lng: -71.0904
        },
        map: map,
        icon: 'kargo.png',
    })

    markers.coords.push(marker1.position)

    google.maps.event.addListener(map, 'click', function (event) {
        postaci_adim = 1
        markers.coords.push(event.latLng)
        addMarker({
            coords: event.latLng
        });

    });

    document.getElementById("sifre_degis_buton").addEventListener("click", () => {
        console.log(document.getElementById("sifre_degis_password").value)
        let newpassword = document.getElementById("sifre_degis_password").value
        let myquery = {
            name: username_value,
            password: password_value
        };

        let newvalues = {
            $set: {
                name: username_value,
                password: newpassword
            }
        };

        update_sifre(myquery, newvalues)
    });
    let sifre_degis_tut = 0
    document.getElementById("sifre_degis").addEventListener("click", () => {
        if (sifre_degis_tut % 2 == 0) {
            document.getElementById("sifre_degis_table").style.visibility = "visible"
        }
        if (sifre_degis_tut % 2 == 1) {
            document.getElementById("sifre_degis_table").style.visibility = "hidden"
        }
        sifre_degis_tut++
        console.log("sifreni değistirdim")
    });

    document.getElementById("kayit_gonder").addEventListener("click", () => {

        let new_acaunt = document.getElementById("kayit_user").value
        let new_acaunt_pas = document.getElementById("kayit_password").value

        let myobj = {
            name: new_acaunt,
            password: new_acaunt_pas
        };

        database_kayit(myobj)

        setTimeout(() => {
            console.log(kayit_durumu)
            if (kayit_durumu) {
                document.getElementById("kayit_table").style.visibility = "hidden"
                document.getElementById("giris_table").style.visibility = "visible"


            } else {
                alert("kayıt Yapılamadı ")
            }
        }, 1000);

    });
    let kayit_sayisi = 0
    document.getElementById("kayitol").addEventListener("click", () => {


        if (kayit_sayisi % 2 == 0) {
            document.getElementById("kayit_table").style.visibility = "visible"
            document.getElementById("giris_table").style.visibility = "hidden"
        }
        if (kayit_sayisi % 2 == 1) {
            document.getElementById("kayit_table").style.visibility = "hidden"
            document.getElementById("giris_table").style.visibility = "visible"
        }
        kayit_sayisi++


    });
    let username_value
    let password_value
    document.getElementById("gonder").addEventListener("click", () => {

        username_value = document.getElementById("username").value
        password_value = document.getElementById("password").value
        let giris = {
            name: username_value,
            password: password_value
        };
        console.log(username_value, password_value)
        giris_yapfunc(giris)
        setTimeout(() => {
            console.log(giris_durumu)
            if (giris_durumu) {
                document.getElementById("map").style.visibility = "visible"
                document.getElementById("sayfa").style.display = "none"
                document.getElementById("kargo_dagit").style.visibility = "visible"
                for (let i = 0; i < document.getElementsByClassName("butonlar").length; i++) {
                    document.getElementsByClassName("butonlar")[i].style.visibility = "visible"
                }

            } else {
                alert("Yanlış Giriş Yaptınız")
            }
        }, 1000);

    });

    let postaci_adim = 1
    let tut = 0
    var marker2 = new google.maps.Marker({
        position: {
            lat: 0,
            lng: 0
        },
        map: map,
        icon: 'postacıman.png',
    })
    document.getElementById("sec").addEventListener("click", () => {
        let lat = document.getElementById("kargoadres").value
        let lng = document.getElementById("kargoadres1").value
        let lat1 = parseFloat(lat)
        let lng1 = parseFloat(lng)
        var marker2 = new google.maps.Marker({
            position: {
                lat: lat1,
                lng: lng1
            },
            map: map,
        })
        markers.coords.push(marker2.position)

    });
    document.getElementById("courier").addEventListener("click", () => {


        if (postaci_adim < wypts.length) {
            let a = wypts[0].location
            marker2.setPosition(new google.maps.LatLng(wypts[postaci_adim].location.lat(), wypts[postaci_adim].location.lng()));

            for (let i = 0; i < markers.coords.length; i++) {
                if (wypts[postaci_adim].location == markers.coords[i]) {

                    markers.coords[0] = markers.coords[i]
                    markers.coords.splice(i, 1)
                    for (let i = 0; i < markerpost.length; i++) {
                        if (markers.coords[0] == markerpost[i].markerr.position) {
                            markerpost[i].durum = true
                        }
                    }
                    console.log("DURUM BİLGİSİ", markerpost)

                }
            }


            console.log("girdi:", wypts.length, "postacıadım:", postaci_adim)
        }
        postaci_adim++



    });

    let waypts = [];

    directionsRenderer.setMap(map);

    document.getElementById("submit").addEventListener("click", () => {
        let itsdone = false
        waypts = []


        console.log("markers.corrds", markers.coords)

        for (let i = 0; i < markers.coords.length; i++) {

            waypts.push({
                location: markers.coords[i],
                stopover: true,
            });
            console.log(markers.coords[i])
        }

        console.log("aaaaaaaaaaaaaa", waypts[0].location)
        let delay = 0
        let DELAY_FACTOR = 1000
        let counter = 0
        let COUNTER_LIMIT = 10

        dizi = []
        dizi1 = []
        for (let i = 0; i < markers.coords.length; i++) {
            for (let j = i + 1; j < markers.coords.length; j++) {

                setTimeout(function () {

                    ters_konum_al(directionsService, directionsRenderer, waypts[j], waypts[i])

                    console.log(j, "     ", i)

                }, delay)

                delay += DELAY_FACTOR
                counter += 1
                if (counter == COUNTER_LIMIT) {
                    DELAY_FACTOR = 1000
                }
                setTimeout(function () {

                    konum_al(directionsService, directionsRenderer, waypts[i], waypts[j])

                    console.log(i, "     ", j)




                }, delay)
                delay += DELAY_FACTOR
                counter += 1
                console.log(counter)
                if (counter == COUNTER_LIMIT) {
                    DELAY_FACTOR = 1000
                }

            }
        }
        console.log("marker sayısı", markers.coords.length)
        let dom = document.getElementById("list_ul")
        dom.innerHTML=""
        console.log(markerpost.length)
        for (let i = 0; i < markerpost.length; i++) {
            let li = document.createElement("li")
            li.innerHTML = `id= ${markerpost[i].id} olan kargonun durumu ${markerpost[i].durum}`           
            dom.append(li)

        }




        console.log("MARKERPOST", markerpost)

    });
    let max = Number.POSITIVE_INFINITY;
    let toplam = 0;
    let yedek = 0;

    function factorialize(num) {
        if (num < 0)
            return -1;
        else if (num == 0)
            return 1;
        else {
            return (num * factorialize(num - 1));
        }
    }



    let dizi = []
    let a = 0
    let b = 0
    let matris = [];
    let dizi2 = [];
    let wypts = []
    let markicin = [{

        id: 0,
        yol: 0

    }]



    document.getElementById("dizi").addEventListener("click", () => {
        markicin = []
        max = Number.POSITIVE_INFINITY;
        for (let i = 0; i < markers.coords.length; i++) {
            matris[i] = new Array(markers.coords.length)

        }
        dizi2 = []
        for (let i = 0; i < markers.coords.length; i++) {
            dizi2.push(i);

        }
        console.log("dizi1", dizi1)
        console.log("dizi", dizi)
        a = 0, b = 0

        for (let i = 0; i < markers.coords.length; i++) {
            for (let j = 0; j < markers.coords.length; j++) {
                if (i == j) {
                    matris[i][j] = 0
                } else if (j > i) {

                    matris[i][j] = dizi[b]

                    matris[j][i] = dizi1[a]
                    a++
                    b++
                }
            }
        }

        a = 0, b = 1, k = 0;

        let fak = factorialize(markers.coords.length - 1);
        k = markers.coords.length - 1;

        if (markers.coords.length <= 2) {
            wypts = []
            wypts.push({

                location: markers.coords[0],
                stopover: true,
            });
            wypts.push({

                location: markers.coords[1],
                stopover: true,
            });
            setTimeout(() => {
                console.log("wyptrs", wypts)
                yol_cizdir3(directionsService, directionsRenderer, wypts)
                window.postMessage("window2")
            }, 1000);

        } else {
            for (let i = 0; i < fak; i++) {
                toplam = 0;
                a = 0, b = 1;
                yedek = dizi2[k];
                dizi2[k] = dizi2[k - 1];
                dizi2[k - 1] = yedek;
                k--;



                if (k == 1) {
                    k = markers.coords.length - 1;
                }


                console.log("Matris", matris)
                for (let j = 0; j < markers.coords.length - 1; j++) {
                    toplam = toplam + matris[dizi2[a]][dizi2[b]];
                    a++;
                    b++;

                }
                console.log("dizi2", dizi2)
                console.log(toplam)
                if (toplam < max) {
                    console.log("asıl dizi2", dizi2)

                    max = toplam;
                    console.log(max);
                    let waypts2 = []
                    for (let i = 0; i < dizi2.length; i++) {


                        waypts2.push({

                            location: markers.coords[dizi2[i]],
                            stopover: true,
                        });
                    }
                    console.log("girdi")

                    wypts = []
                    for (let i = 0; i < waypts2.length; i++) {
                        wypts.push(waypts2[i])
                    }

                    waypts2 = []

                }
            }
            setTimeout(() => {
                console.log("wyptrs", wypts)
                yol_cizdir3(directionsService, directionsRenderer, wypts)
                window.postMessage("window2")
            }, 1000);
        }




    });


    let dizi1 = []

    function uzaklık_dizi_at(response) {
        dizi.push(response.routes[0].legs[0].distance.value)

    }


    function uzaklık_dizi_at1(response) {

        dizi1.push(response.routes[0].legs[0].distance.value)

    }

    let markerpost = []
    let marker = []

    let basilan_deger = 1


    function addMarker(props) {

        //işaret

        marker = new google.maps.Marker({
            position: props.coords,
            map: map
        })
        //check content
        if (props.content) {
            var infoWindow = new google.maps.InfoWindow({
                content: props.content
            });

            marker.addListener('click', function () {
                infoWindow.open(map, marker);
                markers.push()
            });

        }
        let marker_list_icin = {
            id: basilan_deger,
            durum: false,
            markerr: marker
        }
        markerpost.push(marker_list_icin)
        basilan_deger++;

    }

    function konum_al(directionsService, directionsRenderer, i, j) {

        directionsService
            .route({
                origin: i.location,
                destination: j.location,
                // waypoints: waypts.slice(0, markers.coords.length - 1),
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING,

            })
            .then((response) => {

                // directionsRenderer.setDirections(response);//Çizdiren Fonksiyon burada bu olmadan hata yemiyoruz ama yol çizdirmiyor

                const route = response.routes[0];
                const summaryPanel = document.getElementById("directions-panel");

                summaryPanel.innerHTML = "";
                // For each route, display summary information.
                for (let i = 0; i < route.legs.length; i++) {
                    const routeSegment = i + 1;

                    summaryPanel.innerHTML +=
                        "<b>Gidilecek Yol: " + routeSegment + "</b><br>";
                    summaryPanel.innerHTML += route.legs[i].start_address + " to ";
                    summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
                    summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
                }


                console.log(response.routes[0].legs[0].distance.value)
                console.log(response)
                uzaklık_dizi_at(response)


            })

    }

    function ters_konum_al(directionsService, directionsRenderer, i, j) {

        directionsService
            .route({
                origin: i.location,
                destination: j.location,
                // waypoints: waypts.slice(0, markers.coords.length - 1),
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING,

            })
            .then((response) => {

                // directionsRenderer.setDirections(response);//Çizdiren Fonksiyon burada bu olmadan hata yemiyoruz ama yol çizdirmiyor

                const route = response.routes[0];
                const summaryPanel = document.getElementById("directions-panel");

                summaryPanel.innerHTML = "";
                // For each route, display summary information.
                for (let i = 0; i < route.legs.length; i++) {
                    const routeSegment = i + 1;

                    summaryPanel.innerHTML +=
                        "<b>Gidilecek Yol: " + routeSegment + "</b><br>";
                    summaryPanel.innerHTML += route.legs[i].start_address + " to ";
                    summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
                    summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
                }


                console.log(response.routes[0].legs[0].distance.value)
                console.log(response)
                uzaklık_dizi_at1(response)


            })

    }

    function yol_cizdir3(directionsService, directionsRenderer, i) {
        console.log("çizdiriliyor")
        directionsService
            .route({
                origin: i[0].location,
                destination: i[i.length - 1].location,
                waypoints: i.slice(1, i.length - 1),
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING,

            })
            .then((response) => {

                directionsRenderer.setDirections(response); //Çizdiren Fonksiyon burada bu olmadan hata yemiyoruz ama yol çizdirmiyor

                const route = response.routes[0];
                const summaryPanel = document.getElementById("directions-panel");

                summaryPanel.innerHTML = "";
                // For each route, display summary information.
                for (let i = 0; i < route.legs.length; i++) {
                    const routeSegment = i + 1;

                    summaryPanel.innerHTML +=
                        "<b>Gidilecek Yol: " + routeSegment + "</b><br>";
                    summaryPanel.innerHTML += route.legs[i].start_address + " to ";
                    summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
                    summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
                }
            })
    }

}