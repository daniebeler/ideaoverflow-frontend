import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SanitizerService {

  constructor(private sanitizer: DomSanitizer) { }

  getSanitizedUrlFromArrayBuffer(data: any) {
    let imageURL = '../assets/icon/favicon.png';
    if (data) {
      const arrayBuffer = new Uint8Array(data.data).buffer;
      const blob = new Blob([arrayBuffer], { type: 'image/png' });
      imageURL = URL.createObjectURL(blob);
    }

    return this.sanitizer.bypassSecurityTrustUrl(imageURL);
  }
}
