function getTimezoneMoment() {
  const timeZones = timezone.tz.names();
  const offsetTimezone = [];

  const abbrs = {
    EST: 'Eastern Standard Time',
    EAT: 'Eastern African Time',
    EDT: 'Eastern Daylight Time',
    CST: 'Central Standard Time',
    CDT: 'Central Daylight Time',
    MST: 'Mountain Standard Time',
    MDT: 'Mountain Daylight Time',
    PST: 'Pacific Standard Time',
    PDT: 'Pacific Daylight Time',
    CAT: 'Central African Time',
    GMT: 'Greenwich Mean Time',
  };

  timezone.fn.zoneName = function () {
    const abbr = this.zoneAbbr();
    return abbrs[abbr] || abbr;
  };

  timeZones.forEach(element => {
    offsetTimezone.push('(GMT ' + timezone().tz(element).format('Z') + ') ' + timezone().tz(element).format('zz'));
  });
}
