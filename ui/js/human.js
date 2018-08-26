// TODO
// 1. create a ajax call to get json data
// 2. create a function to display the timeline 
// 3. Add function to add 
// 4. Add function to remove 
// 5. 

// Assump:
// 5px = 1 year
// 

// let humanData = {};

class TimeLine {
    constructor() {
        this.humanJsonData = '';
        this.timelineParsedObjects = [];
        this.timelineHtmlOuput = '';
        this.startRange = 1700;
        this.endRange = new Date().getFullYear();
    }

    getHumanData() {
        let self = this;
        self.makeAjaxCallFunction('/ui/data/human.json', function (humanData) {
            self.humanJsonData = humanData;
        });
    }

    sortByBirthYear(a,b) {
        if (a.birth < b.birth) {
            return -1;
        } else if (a.birth == b.birth) {
            if (a.death < b.death) {
                return -1;
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    }

    createTimeline() {
        let humanData = this.humanJsonData;
        humanData = humanData.sort(this.sortByBirthYear);
        let html = "";
        let totalHumanCount = 0;
        let marginLeft = 0;
        const marginTop = 180;
        let currentMarginTop = 0;
        
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < humanData.length; i++) {
            let isHumanAliveClass = '';    
            // Add the range of the teacher in the hash
            // example: timelineRow[0] = 1797-1849
            if (humanData[i]["death"] === -1) {
                isHumanAliveClass = 'human-alive';
                humanData[i]["death"] = currentYear;
            }
            // multiplying by a standared number (5) for calculating the UI width
            let widthOfDiv = (humanData[i]["death"] - humanData[i]["birth"]) * 5;
            marginLeft = (humanData[i]["birth"] - this.startRange)*5;
            if (this.timelineParsedObjects.length === 0) {
                this.timelineParsedObjects.push(
                    {
                        data: `<div data-start="${humanData[i]["birth"]}" data-end="${humanData[i]["death"]}" class="time-block ${isHumanAliveClass}" style="width:${widthOfDiv}px;left:${marginLeft}px;top:${marginTop}px;"><div class="alert alert-primary" role="alert"><p class="bd-notification is-primary"><code>${humanData[i]["name"]} : ${humanData[i]["birth"]}-${humanData[i]["death"]}</code></p></div></div>`,
                        death: humanData[i]["death"],
                        birth: humanData[i]["birth"],
                        // birth: this.startRange,
                        count: 1
                    }
                );
            } else {
                for (let j = 0; j < this.timelineParsedObjects.length; j++) {
                // this.timelineParsedObjects.map(function (row) {
                    // Case: When birth is greater than death of human
                    // Logic: Add the new human in the same row
                    if (parseInt(humanData[i]["birth"]) > parseInt(this.timelineParsedObjects[j].death)) {
                        currentMarginTop = marginTop;
                        console.log("if", humanData[i]["name"],humanData[i]["birth"],'>',this.timelineParsedObjects[j].death);
                        if(j > 0) {
                            currentMarginTop = marginTop - (35 * j);
                            console.log("j",j,humanData[i]["name"],humanData[i]["birth"],humanData[i]["death"]);
                        }
                        // the humans birth date is after the death of the current human
                        this.timelineParsedObjects[j].data = this.timelineParsedObjects[j].data + `<div data-start="${humanData[i]["birth"]}" data-end="${humanData[i]["death"]}" class="time-block ${isHumanAliveClass}" style="width:${widthOfDiv}px;left:${marginLeft}px;top:${currentMarginTop}px;"><div class="alert alert-primary" role="alert"><p class="bd-notification is-primary"><code>${humanData[i]["name"]} : ${humanData[i]["birth"]}-${humanData[i]["death"]}</code></p></div></div>`;
                        // always updating the death to the latest year value
                        this.timelineParsedObjects[j].death = humanData[i]["death"];
                        this.timelineParsedObjects[j].count++;
                        break;
                    // Case: When birth of new human lies between the birth-death of added human OR death of new human lies between the birth-death of human
                    // Logic: Add the new human in a new row
                    } else if ((humanData[i]["birth"] > this.timelineParsedObjects[j].birth && humanData[i]["birth"] < this.timelineParsedObjects[j].death)) {
                        // just for create a new row we need to make sure that we have looped thru 
                        // all of the values in timelineparsedobjects to check if the new human
                        // can be added in another row
                        if((this.timelineParsedObjects.length - 1) === j) {
                            currentMarginTop = marginTop - (35*(this.timelineParsedObjects.length));
                            if(humanData[i]["name"] === 'John Dewey') {
                                console.log("else if", humanData[i]["name"],'j',j,'this.timelineParsedObjects',this.timelineParsedObjects);
                            }
                            this.timelineParsedObjects.push(
                                {
                                    data: `<div data-start="${humanData[i]["birth"]}" data-end="${humanData[i]["death"]}" class="time-block ${isHumanAliveClass}" style="width:${widthOfDiv}px;left:${marginLeft}px;top:${currentMarginTop}px;"><div class="alert alert-primary" role="alert"><p class="bd-notification is-primary"><code>${humanData[i]["name"]} : ${humanData[i]["birth"]}-${humanData[i]["death"]}</code></p></div></div>`,
                                    death: humanData[i]["death"],
                                    birth: humanData[i]["birth"],
                                    count: 1
                                }
                            );
                            break;
                        }
                    // Case: When birth and death date is before the birth of human
                    // Logic: Add the new human in the same row
                    // } else if (humanData[i]["birth"] < row.birth && humanData[i]["death"] < row.birth) {
                    //     let margin = row.death - humanData[i]["birth"];
                    //     row.data = row.data + `<div data-start="${humanData[i]["birth"]}" data-end="${humanData[i]["death"]}" class="time-block" style="width:${widthOfDiv}px;left:${marginLeft}px;top:${marginTop}px;"><div class="alert alert-primary" role="alert"><p class="bd-notification is-primary"><code>${humanData[i]["name"]} : ${humanData[i]["birth"]}-${humanData[i]["death"]}</code></p></div></div>`;
                    //     row.birth = humanData[i]["birth"];
                    //     // row.death = humanData[i]["death"];
                    //     row.count++;
                    }
                }
            }
        }
        this.timelineParsedObjects.map(function (row) {
            html += `<div>${row.data}</div>`;
            totalHumanCount += row.count;
        });
        console.log(this.timelineParsedObjects);
        // html = Object.values(this.timelineParsedObjects).map(function(obj) {
        //     return `<div class="columns is-multiline is-mobile">` + obj + `</div>`;
        // }).join('');
        document.getElementById("timeline-container").innerHTML = html;
        document.getElementById("human-count").innerHTML = totalHumanCount;
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