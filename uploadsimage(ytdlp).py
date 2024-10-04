import yt_dlp
import datetime
import json

def seconds_to_timestamp(seconds):
    min = int(seconds / 60)
    sec = int(seconds % 60)
    
    if sec < 10:
        sec = '0' + str(sec)

    return str(min) + ':' + str(sec)

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
    month = date[4:6]
    month = str(int(month))
    day = date[6:]
    day = str(int(day))
    return year + "-" + month + "-" + day

def urlid(url):
    return url[32:]

def daysago(date):
    date = str(date)
    year = int(date[:4])
    month = int(date[4:6])
    day = int(date[6:])
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



class MyLogger(object):
    def debug(self,msg):
        pass

    def warning(self, msg):
        pass

    def error(self, msg):
        print(msg)

def my_hook(d):
    if d['status'] == 'finished':
        print('Done downloading, now converting ...')

ydl_opts = {
    'logger': MyLogger(),
    'progress_hooks': [my_hook]
}

#links = ['https://www.youtube.com/watch?v=YTZBh-WpIEo']
link = 'https://www.youtube.com/@ceeday2293'
uploadlist = []
print('youtubedl')
with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    
    info = ydl.extract_info(link, False)

print('done')
print('compiling uploadlist')

try:
    vidlist = info['entries'][0]['entries']
except:
    vidlist = info['entries']
for vid in vidlist:
    uploadlist.append({ 
        'link':urlid(vid['webpage_url']),
        'thumbnail':vid['thumbnail'],
        'title':vid['title'],
        'view_count':abbviews(vid['view_count']),
        'duration':seconds_to_timestamp(vid['duration']),
        'upload_date':stringdate(vid['upload_date']),
        'daysago':daysago(vid['upload_date'])
    })

print('done')
print('dumping json')

with open("uploads.json","w") as f:
    json.dump(uploadlist,f)

print('done')

"""webpage_url
thumbnail
title
view_count
duration
upload_date
"""
input('bruh')
