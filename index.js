import express from 'express';
import pkg from 'pg';
const { Client } = pkg;

const app = express();
const port = 5000;  

app.use(express.json());

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres-basic',
  password: '101325',
  port: 5432,
});

client.connect()
.then(() => console.log('Connected to PostgreSQL!'))
  .catch(err => console.error('Connection Error!', err.stack));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/tasks', (req, res) => {
  client.query('SELECT * FROM tasks', (err, response) => {
    if (err) {
      console.error('Error Executing Query!', err.stack);
    } else {
      res.send(response.rows);
    }
  });
});

app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM tasks WHERE id = $1';
  client.query(query, [id], (err, response) => {
    if (err) {
      console.error('Error Executing Query!', err.stack);
    } else {
      res.send(response.rows);

    }
  });
});

app.post('/tasks', (req, res) => {
  const { id, title, description } = req.body;
  const post_query = 'INSERT INTO tasks(id,title,description) VALUES($1, $2, $3)';
  client.query(post_query , [id, title, description], (err, response) => {
    if (err) {
      console.error('Error Executing Query!', err.stack);
    } else {
      res.send('Task Added Successfully!');
    }
  });
});

app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  const put_query = 'UPDATE tasks SET title = $1, description = $2 WHERE id = $3';
  client.query(put_query, [title, description, id], (err, response) => {
    if (err) {
      console.error('Error Executing Query!', err.stack);
    } else {
      res.send('Task Updated Successfully!');
    }
  });
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const delete_query = 'DELETE FROM tasks WHERE id = $1';
  client.query(delete_query, [id], (err, response) => {
    if (err) {
      console.error('Error Executing Query!', err.stack);
    } else {
      res.send('Task Deleted Successfully!');
    }
  });
});

app.listen(port, () => {
  console.log(`Tasks API listening at http://localhost:${port}`);
});