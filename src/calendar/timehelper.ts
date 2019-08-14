export function timeArrays() {
  const x = 30; // minutes interval
  const times = []; // time array
  let tt = 0; // start time
  const ap = ['AM', 'PM']; // AM-PM

  // loop to increment the time and push results in array
  for (let i = 0; tt < 24 * 60; i++) {
    const hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
    const mm = (tt % 60); // getting minutes of the hour in 0-55 format
    // tslint:disable-next-line:max-line-length
    // times[i] = ('0' + (hh % 12)).slice(-2) + ':' + ('0' + mm).slice(-2) + ' ' + ap[Math.floor(hh / 12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
    tt = tt + x;

    // const extTime = {
    //   // tslint:disable-next-line:max-line-length
    //   time: hh + ':' + ('0' + mm).slice(-2) + ' ' + ap[Math.floor(hh / 12)], // pushing data in array in [00:00 - 12:00 AM/PM format]
    //   ext: ''
    // };

    times[i] = hh + ':' + ('0' + mm).slice(-2) + ' ' + ap[Math.floor(hh / 12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]

    times.push(times[i]);
  }
  return times;
}

export function currentTimeArray(startDate) {
  // get the current datetime
  const interval = 30;
  const arr = [];
  const tt = 0; // start time
  const ap = ['AM', 'PM']; // AM-PM

  // loop to increment the time and push results in array
  for (let i = 0; i < 48; i++) {
    //  const hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
    startDate.setMinutes(startDate.getMinutes() + interval);
    const minutes = i * interval + interval;
    const extTime = {
      // tslint:disable-next-line:max-line-length
      time: startDate.getHours() + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' ' + ap[Math.floor(startDate.getHours() / 12)],
      ext: ' (' + convertToMinutes(minutes) + ')'
    };
    // tslint:disable-next-line:max-line-length
    arr[i] = startDate.getHours() + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' ' + ap[Math.floor(startDate.getHours() / 12)];

    arr.push(arr[i]);
  }
  // this.endTime = arr;
  return arr;
}

export function setStartTime() {
  // get the current datetime
  const date = new Date();
  const interval = 30;
  const tt = 0; // start time
  const ap = ['AM', 'PM']; // AM-PM
  const minutes = interval;
  // tslint:disable-next-line:max-line-length
  return date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)];

  // tslint:disable-next-line:max-line-length
  // return ('0' + (date.getHours() % 12)).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)];
}

export function setDefaultTime() {
  return '00:00:00';
}

export function mergeDefaultTime(day) {

  const d = new Date(day);
  const n = d.toISOString().substring(0, 10);
  const newDate = new Date(n + 'T00:00:00');
  return newDate;
}

export function setEndTime() {
  // get the current datetime
  const date = new Date();
  const interval = 30;
  const arr = [];
  const tt = 0; // start time
  const ap = ['AM', 'PM']; // AM-PM

  date.setMinutes(date.getMinutes() + interval);
  const minutes = interval;
  const extTime = {
    // tslint:disable-next-line:max-line-length
    time: ('0' + (date.getHours() % 12)).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)],
    ext: ' (' + convertToMinutes(minutes) + ')'
  };

  // tslint:disable-next-line:max-line-length
  // return ('0' + (date.getHours() % 12)).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)];

  // tslint:disable-next-line:max-line-length
  return date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)];
}

export function eventEndTime(date) {
  // get the current datetime
  // const date = new Date();
  const interval = 30;
  const arr = [];
  const tt = 0; // start time
  const ap = ['AM', 'PM']; // AM-PM

  date.setMinutes(date.getMinutes() + interval);
  const minutes = interval;
  const extTime = {
    // tslint:disable-next-line:max-line-length
    time: ('0' + (date.getHours() % 12)).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)],
    ext: ' (' + convertToMinutes(minutes) + ')'
  };

  // tslint:disable-next-line:max-line-length
  // return ('0' + (date.getHours() % 12)).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)];

  // tslint:disable-next-line:max-line-length
  return date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ap[Math.floor(date.getHours() / 12)];
}

/* covert to minutes */
export function convertToMinutes(n) {
  const num = n;
  const hours = (num / 60);
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return rhours + 'hr ' + rminutes + ' mins';
}

export function convertToDuration(n) {
  const num = n;
  const hours = (num / 60);
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return rhours + ':' + rminutes;
}

export function mergeDateTime(day, time) {

  //  console.log(time);
  let hours = Number(time.match(/^(\d+)/)[1]);
  const minutes = Number(time.match(/:(\d+)/)[1]);
  const AMPM = time.match(/\s(.*)$/)[1];

  if (AMPM === 'PM' && hours < 12) {
    hours = hours + 12;
  }
  if (AMPM === 'AM' && hours === 12) {
    hours = hours - 12;
  }
  let sHours = hours.toString();
  let sMinutes = minutes.toString();
  if (hours < 10) {
    sHours = '0' + sHours;
  }
  if (minutes < 10) {
    sMinutes = '0' + sMinutes;
  }
  time = sHours + ':' + sMinutes + ':00';

  const d = new Date(day);
  const n = d.toISOString().substring(0, 10);
  const newDate = new Date(n + 'T' + time);
  return newDate;
}