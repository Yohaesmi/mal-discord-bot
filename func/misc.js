export const fc = {
  weekDay: function(day, e){
    const days = {
      monday: ['понедельник', ['', 'ам']],
      tuesday: ['вторник', ['', 'ам']],
      wednesday: ['среда', ['', 'м']],
      thursday: ['четверг', ['', 'ам']],
      friday: ['пятница', ['', 'м']],
      saturday: ['суббота', ['', 'м']],
      sunday: ['воскресень', ['е', 'ям']]
    };

    if(!e) return days[day][0]+days[day][1][0];
    else return days[day][0]+days[day][1][1];
  }
};