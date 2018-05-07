import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';

export interface Message{
  content: string;
  style: string;
}
@Injectable()
export class AlertService {

  private _msgSource = new Subject<Message | null>();    

    msg = this._msgSource.asObservable();
  
    update(content: string, style: 'error' | 'info' | 'success') {
      const msg: Message = { content, style };
      this._msgSource.next(msg);
      setTimeout(()=>{
        this._msgSource.next(null);
      },5300);
    }
  
    clear() {
      this._msgSource.next(null);
    }
}
