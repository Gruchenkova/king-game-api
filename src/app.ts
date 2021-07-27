import { createExpressServer } from 'routing-controllers';
import { GameController } from './Controller';

const app = createExpressServer({
  cors: true,
  controllers: [GameController],
});

const port = 3000;

app.listen(port, function () {
  console.log('started on port ' + port);
});