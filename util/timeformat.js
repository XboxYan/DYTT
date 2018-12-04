export const timeFormat =(timeSec, containHours) => {
    function zeroPad(s) {
      if (s.length === 1) {
        return '0' + s;
      }
      return s;
    }
  
    let hours = Math.floor(timeSec / 60.0 / 60.0).toFixed(0);
    let minutes = containHours? Math.floor(timeSec / 60.0 % 60.0).toFixed(0):Math.floor(timeSec / 60.0).toFixed(0);
    let seconds = Math.floor(timeSec % 60.0).toFixed(0);
  
    if(hours < 0) {
      hours = 0;
    }
    if (minutes < 0) {
      minutes = 0;
    }
    if(seconds < 0) {
      seconds = 0;
    }
  
    hours = zeroPad(hours);
    minutes = zeroPad(minutes);
    seconds = zeroPad(seconds);
  
    if (containHours) {
      return hours + ':' + minutes + ':' + seconds;
    }
    return minutes + ':' + seconds;
  }
