/*function checkIfFileExists(src, callback) { //https://stackoverflow.com/questions/3646914/how-do-i-check-if-file-exists-in-jquery-or-pure-javascript //this broken
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
            callback()
        }
    }
    xhr.open('HEAD', src)
}*/


function getDate(){
    let today = new Date;
    return today
}

var uploadedvids;

var yeardate = getDate();
var yearrn = yeardate.getFullYear();
var monthrn = yeardate.getMonth()+1;
var dayrn = yeardate.getDate();
const today = yearrn+"-"+monthrn+"-"+dayrn

if(navigator.userAgent.match(/Mobile/)){
    mobile=true
    document.getElementById("wrapper").style.display = "contents";
}else{
    mobile=false
}


var calendar = document.getElementById('calendar');
const monthnames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

//uploadedvids = [{upload_date:'2022-12-25',link:'-Y6K7F58ee0',thumbnail:"https://i.ytimg.com/vi/-Y6K7F58ee0/maxresdefault.jpg"},{upload_date:'2022-8-26',link:'YTZBh-WpIEo',thumbnail:"https://i.ytimg.com/vi/YTZBh-WpIEo/maxresdefault.jpg"}]
//uploadedvids = [{"link": "https://www.youtube.com/watch?v=9LypMPrHmEA", "thumbnail": "https://i.ytimg.com/vi/9LypMPrHmEA/maxresdefault.jpg?v=61f1d68d", "title": "The World Record History of New Super Mario Bros. DS", "view_count": "228.5K", "duration": "41:32", "upload_date": "2022-1-27"}, {"link": "https://www.youtube.com/watch?v=gds7tj0yYmg", "thumbnail": "https://i.ytimg.com/vi/gds7tj0yYmg/maxresdefault.jpg", "title": "The World Record History of Minecraft Speedruns", "view_count": "1.6M", "duration": "55:03", "upload_date": "2020-7-2"}, {"link": "https://www.youtube.com/watch?v=PFL0Y_Cdz5c", "thumbnail": "https://i.ytimg.com/vi/PFL0Y_Cdz5c/maxresdefault.jpg", "title": "The World Record History of New Super Mario Bros. Wii", "view_count": "1.1M", "duration": "40:03", "upload_date": "2020-3-28"}]
//const uploadedvids = JSON.parse("uploads.json")
// put the code inside the fetch function -------------------------------------------------------------------------------------------------------------------------------------------------------->>>>

/*
var apikey = ''

async function getuploadedvids(){

    var response = await fetch ('https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&id=UCZyxY8Q7xgUCXfFViWkjrSw&key='+apikey)
    var data = await response.json()

    uploadid = data.items[0].contentDetails.relatedPlaylists.uploads

    response = await fetch('https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId='+uploadid+'&key='+apikey)
    uploads = await response.json()

    var playlistpages = Math.ceil(uploads.pageInfo.totalResults/50)
    var nextpagetoken;
    for (var i = 0; i < playlistpages; i++){
        for (var j = 0; j < uploads.items.length; j++){
            var video = {upload_date:"",link:"",thumbnail:""}

            video.link = uploads.items[j].snippet.resourceId.videoId
            video.upload_date = uploads.items[j].snippet.publishedAt

            thumbnails = uploads.items[j].snippet.thumbnails
            if (thumbnails.maxres != undefined){
                video.thumbnail = thumbnails.maxres.url
            }else if (thumbnails.standard != undefined){
                video.thumbnail = thumbnails.standard.url
            }else if (thumbnails.high != undefined){
                video.thumbnail = thumbnails.high.url
            }else if (thumbnails.medium != undefined){
                video.thumbnail = thumbnails.medium.url
            }else if (thumbnails.default != undefined){
                video.thumbnail = thumbnails.default.url
            }

            uploadedvids.push(video)

        }
        nextpagetoken = uploads.nextPageToken
        response = await fetch('https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&pageToken='+nextpagetoken+'&playlistId='+uploadid+'&key='+apikey)
        uploads = await response.json()
    }
    
}
*/
//https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&pageToken=EAAaBlBUOkNESQ&playlistId=UUZyxY8Q7xgUCXfFViWkjrSw&key=[YOUR_API_KEY]
/*
getuploadedvids()
    .then (data => {loadyear(yearrn);})
*/
fetch('uploads.json')
    .then(response => response.json())
    .then(data => {
        uploadedvids = data;
        loadyear(yearrn);
    })

//uploadedvids.items[0].contentDetails.relatedPlaylists.uploads

function addslashes( str ) { //https://stackoverflow.com/questions/770523/escaping-strings-in-javascript thanks lol
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function setimg(img){
    const thumbnail = document.getElementById('thumbnail');
    thumbnail.src = img

}

function setuploaddate(date){
    const uploadheading = document.getElementById('uploaddate');
    uploadheading.innerText = date
}

function settitle(title){
    const vidtitle = document.getElementById('vidtitle');
    vidtitle.innerText = title
}

function setviews(views,daysago){
    var text = views + ' views - ' + daysago;
    const viewselement = document.getElementById('views');
    viewselement.innerText = text
}

function setiframe(link){
    const uploadvid = document.getElementById('uploadiframe');
    uploadvid.src = link
}

function setduration(duration){
    const vidduration = document.getElementById('vidduration');
    vidduration.innerText = duration
}

function loadmonth(cyear,cmonth){
    const monthz = document.createElement('div');
    monthz.classList.add('month');
    calendar.appendChild(monthz);

    const monthheader = document.createElement('div')
    monthheader.classList.add('monthheader')
    monthheader.innerText = monthnames[cmonth]
    monthz.appendChild(monthheader);

    const dt = new Date(cyear,cmonth)

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const paddingDays = new Date(year, month, 1).getDay();

    for(let i = 1; i <= paddingDays + daysInMonth; i++){
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');
        monthz.appendChild(daySquare);

        if (i > paddingDays){
            daySquare.innerText = i - paddingDays
            const iday = i-paddingDays
            const imonth = month+1

            //imgfilepath = "uploads/" + year + "-" + imonth + "-" + iday + ".png"


            const vid = uploadedvids.find(x => x.upload_date === year + "-" + imonth + "-" + iday)
            
            if ( vid != undefined ){
                imgfilepath = vid.thumbnail

                if (mobile) {//
                    //nothing
                }else{
                    daySquare.setAttribute("onclick","window.open('" + "https://www.youtube.com/watch?v=" + vid.link + "','_blank');")
                }
                daySquare.setAttribute("onmouseover","setimg('" + imgfilepath + "'); setiframe('" + "https://www.youtube.com/embed/" + vid.link + "'); setuploaddate('"+year + "-" + imonth + "-" + iday+"'); settitle('" + addslashes(vid.title) + "'); setviews('" + vid.view_count + "', '"+vid.daysago + "'); setduration('"+vid.duration+"');")
                daySquare.classList.add("highlighted")
            }
            if (year+"-"+imonth+"-"+iday==today){
                daySquare.classList.add("today")
            }
            //const upload = checkUpload("uploads/" + year + "-" + imonth + "-" + iday + ".png");
            //console.log(upload);
            //console.log("uploads/" + year + "-" + imonth + "-" + iday + ".png");    
        }else{
            daySquare.classList.add('padding');
        } 
    }


}

function loadyear(year){
    yearheader = document.getElementById('yearheader');
    yearheader.innerText = year;
    for(let i = 0; i <= 11; i++){
        loadmonth(year,i);
    }
}

function prevyear(){
    document.getElementById('calendar').remove()
    cal = document.createElement('div');
    cal.setAttribute('id','calendar')
    document.getElementById('container').appendChild(cal)
    calendar = document.getElementById('calendar');
    yearrn--;
    loadyear(yearrn);
}

function nextyear(){
    document.getElementById('calendar').remove()
    cal = document.createElement('div');
    cal.setAttribute('id','calendar')
    document.getElementById('container').appendChild(cal)
    calendar = document.getElementById('calendar');
    yearrn++;
    loadyear(yearrn);
}

//loadyear(2022);

