import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      const temp = new Date(value);
        const seconds = Math.floor((+new Date() - +temp) / 1000);
        if (seconds < 604800){
          if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
              {return 'Just now';}
          const intervals: any = {
              year: 31536000,
              month: 2592000,
              week: 604800,
              day: 86400,
              hour: 3600,
              min: 60,
              sec: 1
          };
          let counter;
          // eslint-disable-next-line guard-for-in
          for (const i in intervals) {
              counter = Math.floor(seconds / intervals[i]);
              if (counter > 0)
                  {if (counter === 1) {
                      return counter + ' ' + i + ''; // singular (1 day ago)
                  } else {
                      return counter + ' ' + i + 's'; // plural (2 days ago)
                  }}
          }
        }else { // if it's more than 1 day ago
          const options: any = { year: '2-digit', month: '2-digit', day: '2-digit' };
          return new Date(value).toLocaleDateString(undefined, options);
      }
    }
    return value;
}

}
