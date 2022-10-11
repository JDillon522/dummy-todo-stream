import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Observable, from, map, interval, timeInterval } from 'rxjs';
import { dummyTasks, dummyUsers } from './dummyTasks';
import { sample } from 'lodash';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  public dummyTasks(@MessageBody() data: any): Observable<any> {
    return interval(+(process.env.INTERVAL || '5000')).pipe(
      timeInterval(),
      map((val) => {
        console.log('New Interval')
        const random = Math.random() * 10;

        if (random > 5) {
          console.log('Sending New Message')
          const task = sample(dummyTasks);
          const user = sample(dummyUsers);

          return { event: 'events', data: {text: `From ${user}:  ${task}`}}
        }

        return {}
      })
    )
  }
}
