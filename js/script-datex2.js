'use strict';

const TRAFFIC_MESSAGES_URL = "https://tie.digitraffic.fi/api/v3/data/traffic-messages/simple";
const TRAFFIC_MESSAGES_DATEX2_URL = "https://tie.digitraffic.fi/api/v3/data/traffic-messages/datex2";
const TYPE_EXEMPTED_TRANSPORT = "EXEMPTED_TRANSPORT";
const TYPE_ROAD_WORK = "ROAD_WORK";
const TYPE_TRAFFIC_ANNOUNCEMENT = "TRAFFIC_ANNOUNCEMENT";
const TYPE_WEIGHT_RESTRICTION = "WEIGHT_RESTRICTION";

function initTable(datexType, tableTitle) {
      $("#" + datexType).append([
        $("<colgroup>").append([
          $("<col>", {"class": "datex2-col1"}),
          $("<col>", {"class": "datex2-col2"}),
          $("<col>", {"class": "datex2-col3"}),
          $("<col>", {"class": "datex2-col4"}),
          $("<col>", {"class": "datex2-col5"}),
          $("<col>", {"class": "datex2-col6"}),
          $("<col>", {"class": "datex2-col7"}),
          $("<col>", {"class": "datex2-col8"})
        ]),
        $("<thead/>").append([
          $("<tr/>", {"class": "row.nowrap"}).append([
                    $("<th/>", {"class": "datex2-col-1-2", "colspan": 2}).text(tableTitle),
                    $("<th/>", {"class": "datex2-col-3-8", "id": "date_" + datexType, "colspan": 6}).text("-")
          ]),
          $("<tr/>", {"class": "row.nowrap"}).append([
                    $("<th/>", {"class": "datex2-col1"}).text("GUID"),
                    $("<th/>", {"class": "datex2-col2"}).text("Ver"),
                    $("<th/>", {"class": "datex2-col3"}).text("Start"),
                    $("<th/>", {"class": "datex2-col4"}).text("End / Open"),
                    $("<th/>", {"class": "datex2-col5"}).text("Title"),
                    $("<th/>", {"class": "datex2-col6"}).text("Xml"),
                    $("<th/>", {"class": "datex2-col7"}).text("Json"),
                    $("<th/>", {"class": "datex2-col8"}).text("Map")
          ])
        ]),
        $("<tbody/>")
      ]);
}

function loadContent(requestType) {
  console.info("Load traffic messages of type", requestType);
  let xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      try {
        processResponse(JSON.parse(this.responseText), requestType);
      } catch(e) {
        console.error(e);
      }
    }
  };

  xmlhttp.onerror = function() {
    console.error(this);
  };

  xmlhttp.open("GET", TRAFFIC_MESSAGES_URL + "?situationType=" + requestType, true);
  xmlhttp.send();
}

function processResponse(resp, requestType) {
    if (resp) {
        console.log("Response:", resp);

        $("#date_" + requestType).text("Updated: " + toLocalDate(resp.dataUpdatedTime) + " / " + resp.features.length + " pcs");

        const sorted = resp.features.sort(function(a, b) {
          const timeDurA = getDateTime(a.properties.announcements);
          const timeDurB = getDateTime(b.properties.announcements);
          const startA = new Date(timeDurA.startTime);
          const startB = new Date(timeDurB.startTime);
          return startA - startB;
        });
        for (var item of sorted) {
            addMessage(requestType, item);
        }
    }
}

function addMessage(clazz, message) {
    let warn = "";
    let start = "-";
    let end = "-";
    let timeDur = getDateTime(message.properties.announcements);
    if (timeDur) {

        start = toIsoLocalDate(timeDur.startTime);

        if (timeDur.endTime) {
            end = toIsoLocalDate(timeDur.endTime);
            let days = Math.round((Date.parse(timeDur.endTime) - Date.parse(timeDur.startTime)) / 86400000);

            end = end + " (" + days + " days)";
            if (Date.parse(timeDur.endTime) < new Date().getTime()) {
                warn = " warn";
            }
        } else {

          let days = Math.round((new Date() - Date.parse(timeDur.startTime)) / 86400000);
          end = "(" + days + " days)";

          if (days > 14) {
            warn = " warn";
          }
        }
    }

    $('#' + clazz + ' > tbody:last-child').append(
        $('<tr/>', {"class": "row.nowrap" + warn}).append([
            $('<td/>', {"class": "datex2-col1"}).text(message.properties.situationId),
            $('<td/>', {"class": "datex2-col2"}).text(message.properties.version),
            $('<td/>', {"class": "datex2-col3"}).text(start),
            $('<td/>', {"class": "datex2-col4" + warn}).text(end),
            $('<td/>', {"class": "datex2-col5"}).text(getTitle(message.properties.announcements)),
            $('<td/>', {"class": "datex2-col6"}).append(
                    $('<a />', { "target" : "_blank", "href": TRAFFIC_MESSAGES_DATEX2_URL + "/" + message.properties.situationId + "?latest=true" }).text("xml")
            ),
            $('<td/>', {"class": "datex2-col7"}).append(
                    $('<a />', { "target" : "_blank", "href": TRAFFIC_MESSAGES_URL + "/" + message.properties.situationId + "?latest=true" }).text("json")
            ),
            $('<td/>', {"class": "datex2-col8"}).append(
                    $('<a />', { "target" : "_blank", "href": "https://geojson.tools/?url=" + TRAFFIC_MESSAGES_URL + "/" + message.properties.situationId + "?latest=true" }).text("map")
            )
        ])
    )
}

function getDateTime(announcements) {
    for (var ann of announcements) {
        if (ann.timeAndDuration) {
            return ann.timeAndDuration;
        }
    }

    return null;
}

function getTitle(announcements) {
    for (var ann of announcements) {
        if (ann.title) {
            return ann.title;
        }
    }

    return "-";
}

function loadDatex2() {
  initTable(TYPE_TRAFFIC_ANNOUNCEMENT, "Traffic announcements");
  initTable(TYPE_EXEMPTED_TRANSPORT, "Exempted transports");
  initTable(TYPE_ROAD_WORK, "Road works");
  initTable(TYPE_WEIGHT_RESTRICTION, "Weight restrictions");

  loadContent(TYPE_TRAFFIC_ANNOUNCEMENT);
  loadContent(TYPE_EXEMPTED_TRANSPORT);
  loadContent(TYPE_ROAD_WORK);
  loadContent(TYPE_WEIGHT_RESTRICTION);
}
