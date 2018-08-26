class TimeLine {
    constructor() {
        this.humanJsonData = '';
        this.timelineParsedObjects = [];
        this.timelineHtmlOuput = '';    
        this.pixelMultiplier = 5;
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
        console.log("humanData",humanData);
        let html = "";
        let totalHumanCount = 0;
        let marginLeft = 0;
        // const marginTop = 180;
        this.currentMarginTop = 180;
        
        this.firstBirthYear = humanData[0].birth;
        this.timelineBirthYear = humanData[0].birth;
        this.timelineDeathYear = humanData[0].death;

        
        const currentYear = new Date().getFullYear();
        // html = this.createElement(humanData[0].birth, humanData[0].death, humanData[0].name);
        // let anotherHtml = this.createElement(humanData[1].birth, humanData[1].death, humanData[1].name);
        // document.getElementById("timeline-container").innerHTML = html + anotherHtml + this.createElement(humanData[2].birth, humanData[2].death, humanData[2].name) + this.createElement(humanData[3].birth, humanData[3].death, humanData[3].name);
        
        humanData.forEach(element => {
            html += this.createElement(element.birth, element.death, element.name);
        });
        document.getElementById("timeline-container").innerHTML = html;
    }

    createElement(birthYear, deathYear, nameOfPerson) {
        let colorClass = ""
        let deathOrCurrentYear = deathYear;
        let marginLeft = (birthYear - this.firstBirthYear) * this.pixelMultiplier;
        if(birthYear > this.timelineBirthYear && birthYear < this.timelineDeathYear) {
            this.currentMarginTop = this.currentMarginTop - 35;
        } else if(deathOrCurrentYear > this.timelineDeathYear){
            this.currentMarginTop = 180;
            this.timelineDeathYear = deathOrCurrentYear;
        }        
        if (deathYear == -1) {
            colorClass = "human-alive";
            deathOrCurrentYear = new Date().getFullYear();
        }                
        let widthOfDiv = (deathOrCurrentYear - birthYear) * this.pixelMultiplier;

        let element  = `<div class="time-block ${colorClass}" style="width:${widthOfDiv}px;left:${marginLeft}px;top:${this.currentMarginTop}px;"><div class="alert alert-primary" role="alert"><p class="bd-notification is-primary"><code>${nameOfPerson} : ${birthYear}-${deathOrCurrentYear}</code></p></div></div>`;
        return element;
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