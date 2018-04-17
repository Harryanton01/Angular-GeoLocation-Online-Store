import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Message } from '../../services/message'

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent implements OnInit {
  @Input() message: Message;
  userEmail: string;
  userName: string;
  messageContent: string;
  timeStamp: string;
  isOwnMessage: boolean;
  ownEmail: string;

  constructor(private authService: AuthenticationService) {
    authService.getUser().subscribe(user => {
      this.ownEmail = user.email;
      this.isOwnMessage = this.ownEmail === this.userEmail;
    });
  }

  ngOnInit(messageParsed = this.message) {
    this.messageContent = messageParsed.message;
    this.timeStamp = messageParsed.timeSent;
    this.userEmail = messageParsed.email;
    this.userName = messageParsed.userName;
  }
}
