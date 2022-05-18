import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'externalHref'
})
export class ExternalHrefPipe implements PipeTransform {

  transform(href: string): string {
    return /^https?/.test(href) ? href : `//${href}`;
  }
}
