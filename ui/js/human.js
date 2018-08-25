// TODO
// 1. create a ajax call to get json data
// 2. create a function to display the timeline 
// 3. Add function to add 
// 4. Add function to remove 
// 5. 

// let humanData = {};

class TimeLine {
    constructor() {
        this.humanJsonData = '';
        this.timelineParsedObjects = '';
        this.timelineHtmlOuput = '';
    }

    getHumanData() {
        let self = this;
        self.makeAjaxCallFunction('/ui/data/human.json', function (humanData) {
            self.humanJsonData = humanData;
        });
    }

    createTimeline() {
        let humanData = this.humanJsonData;
        let html = "";
        let timelineRow = [];
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < humanData.length; i++) {
            // Add the range of the teacher in the hash
            // example: timelineRow[0] = 1797-1849
            if (humanData[i]["death"] === -1) {
                humanData[i]["death"] = currentYear;
            }
            // multiplying by a standared number (5) for calculating the UI width
            let widthOfDiv = (humanData[i]["death"] - humanData[i]["birth"]) * 5;
            if (timelineRow.length === 0) {
                timelineRow.push(
                    {
                        data: `<div data-start="${humanData[i]["birth"]}" data-end="${humanData[i]["death"]}" class="d-inline-block" style="width:${widthOfDiv}px"><div class="alert alert-primary" role="alert"><p class="bd-notification is-primary"><code>${humanData[i]["name"]} : ${humanData[i]["birth"]}-${humanData[i]["death"]}</code></p></div></div>`,
                        death: humanData[i]["death"],
                        birth: humanData[i]["birth"],
                        count: 1
                    }
                );
            } else {
                timelineRow.map(function (row) {
                    if (humanData[i]["birth"] > row.death) {
                        let margin = humanData[i]["birth"] - row.death;
                        // the humans birth date is after the death of the current human
                        row.data = row.data + `<div data-start="${humanData[i]["birth"]}" data-end="${humanData[i]["death"]}" class="d-inline-block" style="width:${widthOfDiv}px;margin-left:${margin}px"><div class="alert alert-primary" role="alert"><p class="bd-notification is-primary"><code>${humanData[i]["name"]} : ${humanData[i]["birth"]}-${humanData[i]["death"]}</code></p></div></div>`;
                        row.death = humanData[i]["death"];
                        row.count++;
                    } else if (humanData[i]["birth"] > row.birth && humanData[i]["birth"] < row.death) {
                        // the humans birth date is in between the life time of the current human
                        // in this case we will move on to next row
                        timelineRow.push(
                            {
                                data: `<div data-start="${humanData[i]["birth"]}" data-end="${humanData[i]["death"]}" class="d-inline-block" style="width:${widthOfDiv}px"><div class="alert alert-primary" role="alert"><p class="bd-notification is-primary"><code>${humanData[i]["name"]} : ${humanData[i]["birth"]}-${humanData[i]["death"]}</code></p></div></div>`,
                                death: humanData[i]["death"],
                                count: 1
                            }
                        );
                    } else if (humanData[i]["birth"] < row.birth && humanData[i]["death"] < row.birth) {
                        let margin = row.death - humanData[i]["birth"];
                        row.data = row.data + `<div data-start="${humanData[i]["birth"]}" data-end="${humanData[i]["death"]}" class="d-inline-block" style="width:${widthOfDiv}px;margin-left:${margin}px"><div class="alert alert-primary" role="alert"><p class="bd-notification is-primary"><code>${humanData[i]["name"]} : ${humanData[i]["birth"]}-${humanData[i]["death"]}</code></p></div></div>`;
                        row.birth = humanData[i]["birth"];
                        // row.death = humanData[i]["death"];
                        row.count++;
                    }
                });
            }
        }
        timelineRow.map(function (row) {
            html += `<div>${row.data}</div>`;
        });
        console.log(timelineRow);
        // html = Object.values(timelineRow).map(function(obj) {
        //     return `<div class="columns is-multiline is-mobile">` + obj + `</div>`;
        // }).join('');
        document.getElementById("timeline-container").innerHTML = html;
    }

    makeAjaxCallFunction(url, callback) {
        let xmlhttp = new XMLHttpRequest();
        let data;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // console.log('responseText:' + xmlhttp.responseText);
                try {
                    data = JSON.parse(xmlhttp.responseText);
                } catch (err) {
                    console.log(err.message + " in " + xmlhttp.responseText);
                    return;
                }
                callback(data);
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
}

$(document).ready(function() {
    let createTimeLineObj = new TimeLine();
    createTimeLineObj.getHumanData();

    $("#create-timeline").click(function(event){
        createTimeLineObj.createTimeline();
    });
});