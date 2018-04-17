import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../../services/messaging.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chatinput',
  templateUrl: './chatinput.component.html',
  styleUrls: ['./chatinput.component.css']
})
export class ChatinputComponent implements OnInit {
  
  message: string;

  constructor(private chat: MessagingService, private route: ActivatedRoute) { }
  private id;
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('chatID');
  }

  send(){
    this.chat.sendMessage(this.message,this.id);
    this.message=''
  }
  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }
}
