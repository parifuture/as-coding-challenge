// TODO
// 1. create a ajax call to get json data
// 2. create a function to display the timeline 
// 3. Add function to add 
// 4. Add function to remove 

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

    sortByBirthYear(a, b) {
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
    /**
     *
     *
     * @param {*} birthYear
     * @param {*} deathYear
     * @param {*} nameOfPerson
     * @memberof TimeLine
     * The function is responsible for add new humans in construct 
     * object scope
     */
    createElement(birthYear, deathYear, nameOfPerson) {
        let marginLeft = 0;
        const marginTop = 180;
        let currentMarginTop = 0;
        let isHumanAliveClass = '';
        const currentYear = new Date().getFullYear();
        // Add the range of the teacher in the hash
        // example: timelineRow[0] = 1797-1849
        if (deathYear === -1) {
            isHumanAliveClass = 'human-alive';
            deathYear = currentYear;
        }

        // multiplying by a standared number (5) for calculating the UI width
        let widthOfDiv = (deathYear - birthYear) * 5;
        marginLeft = (birthYear - this.startRange) * 5;
        if (this.timelineParsedObjects.length === 0) {
            this.timelineParsedObjects.push({
                data: `<div data-start="${birthYear}" data-end="${deathYear}" class="hvr-push time-block ${isHumanAliveClass}" style="width:${widthOfDiv}px;left:${marginLeft}px;top:${marginTop}px;"><div class="alert alert-primary" role="alert"><p class="bd-notification is-primary"><code>${nameOfPerson} : ${birthYear}-${deathYear}</code></p></div></div>`,
                death: deathYear,
                birth: birthYear,
                // birth: this.startRange,
                count: 1
            });
        } else {
            for (let j = 0; j < this.timelineParsedObjects.length; j++) {
                // this.timelineParsedObjects.map(function (row) {
                // Case: When birth is greater than death of human
                // Logic: Add the new human in the same row
                if (parseInt(birthYear) > parseInt(this.timelineParsedObjects[j].death)) {
                    currentMarginTop = marginTop;
                    if (j > 0) {
                        currentMarginTop = marginTop - (35 * j);
                    }
                    // the humans birth date is after the death of the current human
                    this.timelineParsedObjects[j].data = this.timelineParsedObjects[j].data + `<div data-start="${birthYear}" data-end="${deathYear}" class="hvr-push time-block ${isHumanAliveClass}" style="width:${widthOfDiv}px;left:${marginLeft}px;top:${currentMarginTop}px;"><div class="alert alert-primary" role="alert"><p class="bd-notification is-primary"><code>${nameOfPerson} : ${birthYear}-${deathYear}</code></p></div></div>`;
                    // always updating the death to the latest year value
                    this.timelineParsedObjects[j].death = deathYear;
                    this.timelineParsedObjects[j].count++;
                    break;
                    // Case: When birth of new human lies between the birth-death of added human OR death of new human lies between the birth-death of human
                    // Logic: Add the new human in a new row
                } else if ((birthYear > this.timelineParsedObjects[j].birth && birthYear < this.timelineParsedObjects[j].death)) {
                    // just for create a new row we need to make sure that we have looped thru 
                    // all of the values in timelineparsedobjects to check if the new human
                    // can be added in another row
                    if ((this.timelineParsedObjects.length - 1) === j) {
                        currentMarginTop = marginTop - (35 * (this.timelineParsedObjects.length));
                        this.timelineParsedObjects.push({
                            data: `<div data-start="${birthYear}" data-end="${deathYear}" class="hvr-push time-block ${isHumanAliveClass}" style="width:${widthOfDiv}px;left:${marginLeft}px;top:${currentMarginTop}px;"><div class="alert alert-primary" role="alert"><p class="bd-notification is-primary"><code>${nameOfPerson} : ${birthYear}-${deathYear}</code></p></div></div>`,
                            death: deathYear,
                            birth: birthYear,
                            count: 1
                        });
                        break;
                    }
                }
            }
        }
    }

    createTimeline() {
        let humanData = this.humanJsonData;
        humanData = humanData.sort(this.sortByBirthYear);
        let html = "";
        let totalHumanCount = 0;

        // Re-set the parsed object values
        this.timelineParsedObjects = [];

        for (let i = 0; i < humanData.length; i++) {
            this.createElement(humanData[i].birth, humanData[i].death, humanData[i].name);
        }
        this.timelineParsedObjects.map(function (row) {
            html += `<div>${row.data}</div>`;
            totalHumanCount += row.count;
        });
        // html = Object.values(this.timelineParsedObjects).map(function(obj) {
        //     return `<div class="columns is-multiline is-mobile">` + obj + `</div>`;
        // }).join('');
        document.getElementById("timeline-container").innerHTML = '';
        document.getElementById("timeline-container").innerHTML = html;
        document.getElementById("human-count").innerHTML = totalHumanCount;
    }

    // Code makes a ajax call 
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

$(document).ready(function () {
    let createTimeLineObj = new TimeLine();
    createTimeLineObj.getHumanData();

    $("#create-timeline").click(function (event) {
        createTimeLineObj.createTimeline();
        ScrollReveal().reveal('.time-block', { interval: 200, distance: '150px' });
        ScrollReveal().reveal('.add-human-modal', { interval: 200 });
    });

    $("#add-human-btn").click(function () {
        let name = document.getElementById('human-name').value;
        let birth = document.getElementById('birth-year').value;
        let death = document.getElementById('death-year').value;
        let summary = document.getElementById('summary-text').value;
        if (name.length > 0 && birth.length > 0 && death.length > 0) {
            createTimeLineObj.humanJsonData.push({name:name,birth:birth,death:death,summary:summary});
            createTimeLineObj.createTimeline();
            $("#addHuman").modal('hide');
            ScrollReveal().reveal('.time-block', { interval: 200, distance: '150px' });
        }
    });

    $("#timeline-container").dblclick(function(event) {
        $(event.target.parentElement.parentElement).hide();
        event.target.parentElement.parentElement.remove();
    });

    $(".time-block").hover(function() {
        ScrollReveal().reveal($(this), { interval: 200, scale: 0.85 });
    })

    // ScrollReveal().reveal('.headline', { duration: 2000 });


});