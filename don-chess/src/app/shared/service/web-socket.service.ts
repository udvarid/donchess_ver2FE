import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const SockJs = require('sockjs-client');
const Stomp = require('stompjs/lib/stomp.js').Stomp;

@Injectable()
export class WebSocketService {
    route = environment.apiUrl === '' ? 'http://localhost:8080' : environment.apiUrl; 

    // Open connection with the back-end socket
    public connect() {
        const socket = new SockJs(this.route + '/socket');

        const stompClient = Stomp.over(socket);

        return stompClient;
    }
}
