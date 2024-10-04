from googleapiclient.discovery import build
import datetime
import json
import re

hours_pattern = re.compile(r'(\d+)H')
minutes_pattern = re.compile(r'(\d+)M')
seconds_pattern = re.compile(r'(\d+)S')

def timestamp(duration):
    hours = hours_pattern.search(duration)
    minutes = minutes_pattern.search(duration)
    seconds = seconds_pattern.search(duration)

    hours = int(hours.group(1)) if hours else 0
    minutes = int(minutes.group(1)) if minutes else 0
    seconds = int(seconds.group(1)) if seconds else 0

    if seconds < 10:
        seconds = '0' + str(seconds)

    if hours:
        return str(hours)+':'+str(minutes)+':'+str(seconds)
    else:
        return str(minutes)+':'+str(seconds)

def abbviews(views):
    B = 1000000000
    M = 1000000
    K = 1000
    if views >= B:
        return str(round(views/B,1)) + "B"
    elif views >= M:
        return str(round(views/M,1)) + "M"
    elif views >= K:
        return str(round(views/K,1)) + "K"
    else:
        return views

def stringdate(date):
    date = str(date)
    year = date[:4]
    month = date[5:7]
    month = str(int(month))
    day = date[8:10]
    day = str(int(day))
    return year + "-" + month + "-" + day

def urlid(url):
    return url[32:43]

def daysago(date):
    date = str(date)
    year = int(date[:4])
    month = int(date[5:7])
    day = int(date[8:10])
    d1 = datetime.date(year,month,day)

    d2 = datetime.date.today()

    delta = d2 - d1
    deltadays = delta.days
    if delta.days < 7:
        return str(deltadays)+" days ago"
    elif int(deltadays/7) <= 4:
        return str(int(deltadays/7))+" weeks ago"
    elif int(deltadays/30) <= 11:
        return str(int(deltadays/30))+" months ago"
    elif deltadays<=365:
        return "11 months ago"
    else:
        return str(int(deltadays/365))+" years ago"

def bestthumbnail(vid):
    try:
        return vid['maxres']['url']
    except:
        try:
            return vid['standard']['url']
        except:
            try:
                return vid['high']['url']
            except:
                try:
                    return vid['medium']['url']
                except:
                    try:
                        return vid['default']['url']
                    except:
                        pass

#put a link of a video uploaded by the channel that you want to be scraped
link = 'https://www.youtube.com/watch?v=YHGMfQ1TDPA&ab_channel=Dream'
#put youtube api key here
apikey = "AIzaSyBD9vhklKwshAGGjnKPS_oTlzJfWA7Sf8Q"
uploadlist = []
print('youtube api')

vidid = urlid(link)

youtube = build('youtube', 'v3', developerKey=apikey)

#get vid to get channelid
request = youtube.videos().list(
    part = "snippet",
    id = vidid
)
response = request.execute()

channelid = response['items'][0]['snippet']['channelId'] 

#get channel to get uploadid
request = youtube.channels().list(
    part = 'contentDetails',
    id = channelid
)
response = request.execute()

uploadid = response['items'][0]['contentDetails']['relatedPlaylists']['uploads']

#get uploadedvids
request = youtube.playlistItems().list(
    part = 'snippet',
    playlistId = uploadid,
    maxResults = 50
)
response = request.execute()

for i in range(int(response['pageInfo']['totalResults']/50)+1):

    vidlist = []
    for vid in response['items']:
        vidlist.append(vid['snippet']['resourceId']['videoId'])

    vidrequest = youtube.videos().list(
        part = "snippet,contentDetails,statistics",
        id = ','.join(vidlist)
    )
    vidresponse = vidrequest.execute()

    for vid in vidresponse['items']:

        try:
            viewCount = abbviews(int(vid['statistics']['viewCount']))
        except:
            viewCount = 0

        uploadlist.append({ 
            'link':vid['id'],
            'thumbnail':bestthumbnail(vid['snippet']['thumbnails']),
            'title':vid['snippet']['title'],
            'view_count': viewCount,
            'duration':timestamp(vid['contentDetails']['duration']),
            'upload_date':stringdate(vid['snippet']['publishedAt']),
            'daysago':daysago(vid['snippet']['publishedAt'])
        })
    

    try:
        request = youtube.playlistItems().list_next(request,response)
        response = request.execute()
    except:
        pass

#response['items'][0]['snippet']['resourceId']['videoId']

print('done')
print('dumping json')

with open("uploads.json","w") as f:
    json.dump(uploadlist,f)

print('done')

input('bruh')
