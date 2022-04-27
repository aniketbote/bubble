export default function timeDifference(timeStamp){
    const timeDiff = parseInt((Date.now() - new Date(timeStamp))/1000)
    if(timeDiff <=  (119)){
        return 'just now';
    }
    else if(timeDiff <  3600){
        return parseInt(timeDiff/60).toString() + ' minutes ago'
    }
    else if(timeDiff  < 7140){
        return 'an hour ago';
    }
    else if (timeDiff < 86400){
        return parseInt(timeDiff/3600).toString()+' hours ago';
    }
    else if (timeDiff <  169200){
        return 'a day ago';
    }
    else if (timeDiff <  604800){
        return parseInt(timeDiff/86400).toString()+' days ago';
    }
    else if (timeDiff <  1123200){
        return 'a week ago';
    }
    else if (timeDiff <  2419200){
        return parseInt(timeDiff/604800).toString()+' weeks ago';
    }

    else if (timeDiff <  29030400){
        const x = parseInt(timeDiff/2419200).toString();
        if(x === "1"){
            return 'a month ago';
        }
        else{
            return x + ' months ago';
        }       
    }
    else {
        const y = parseInt(timeDiff/29030400).toString();
        if (y === "1"){
            return 'a years ago';   
        }
        else{
            return y +' years ago';
        }    
    }
}