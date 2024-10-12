import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col, Card, Form } from 'react-bootstrap';

const App = () => {
  const [tasks, setTasks] = useState([
    { id: '1', content: 'Task 1' },
    { id: '2', content: 'Task 2' },
    { id: '3', content: 'Task 3' }
  ]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: `${tasks.length + 1}`, content: newTask }]);
      setNewTask('');
    }
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4">Task Management with Drag and Drop</h1>
          
          <Form className="mb-4">
            <Form.Group>
              <Form.Control
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task"
              />
            </Form.Group>
            <Button className="mt-2" variant="primary" onClick={addTask}>
              Add Task
            </Button>
          </Form>

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <ul className="list-group" {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks.map(({ id, content }, index) => (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <li
                          className="list-group-item mb-2 p-3 bg-light border rounded"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card className="p-2">
                            <Row>
                              <Col>{content}</Col>
                              <Col xs="auto">
                                <Button variant="danger" size="sm" onClick={() => deleteTask(id)}>
                                  Delete
                                </Button>
                              </Col>
                            </Row>
                          </Card>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
