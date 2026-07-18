/*
Bokbindarvägen id: 1734
Telefonplan id: 9263
Örnsberg id: 9292

Bokbindarvägen linje: 147
Telefonplan linje: 14
Örnsberg linje: 13

*/
const SL_stations_ids = [1734, 9263, 9292]; // these need to be in number form
const approved_lines = ["147", "14", "13"]; // these need to be in string form

document.addEventListener("DOMContentLoaded", () => {
    generate_line_next_stop_times();
    get_temprature();
});
setInterval(() => {
    generate_line_next_stop_times();
    get_temprature();
}, 20000); // 10 sec

function generate_line_next_stop_times() {
    // clear all line container elements
    const all_line_container_elements = document.querySelectorAll(".line_container .inner");
    all_line_container_elements.forEach(line_element => {
        line_element.innerHTML = "";
    });

    for (let id_nr = 0; id_nr < SL_stations_ids.length; id_nr++) {
        const fetch_url = "https://transport.integration.sl.se/v1/sites/" + SL_stations_ids[id_nr] + "/departures";

        let count = 0;

        fetch(fetch_url)
        .then(response => response.json())
        .then(data => {
            data.departures.forEach(departure => {
                if (count < 5) {
                    const line_nr = departure.line.designation;
                    const time_left = departure.display;
                    const destination = departure.destination;
                    if (approved_lines.includes(line_nr)) {
                        const line_container_element = document.querySelector(".line_container#line_" + line_nr + " .inner");
                        const p_element = document.createElement("p");
                        p_element.innerHTML = "Mot " + destination + " går om " + time_left;
                        const created_p_element = line_container_element.appendChild(p_element);

                        console.log(`Linje ${departure.line.designation} mot ${departure.destination}: ${time_left}`);
                    };
                    count += 1;
                    console.log(count)
                };
            });
        })
        .catch(error => console.error('Fel:', error));
    };
};

function get_temprature() {
    const fetch_url = "https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.0686/lat/59.3293/data.json"

    fetch(fetch_url)
    .then(response => response.json())
    .then(data => {
        data.timeSeries.forEach(Times => {
            const now = new Date();
            const year = now.getUTCFullYear();  // 2026
            let month = now.getUTCMonth() + 1;    // 0-11 (0 = January) + 1
            if (month < 10) {
                month = `0${month}`
            };
            const day = now.getUTCDate();       // 1-31
            let hours = now.getUTCHours();    // 0-23
            const minutes = now.getUTCMinutes();  // 0-59
            if (minutes > 0) {
                hours += 1;
            };
            const rounded_up_utc_datetime = year + "-" + month + "-" + day + "T" + hours + ":00:00Z";
            if (rounded_up_utc_datetime == Times.time) {
                const currant_temp = Math.round(Times.data.air_temperature);
                const temp_element = document.querySelector("#deg_outside");
                temp_element.innerHTML = currant_temp;
                console.log("Currant temprature: " + currant_temp);
            };
        });
    })
    .catch(error => console.error('Fel:', error));
};