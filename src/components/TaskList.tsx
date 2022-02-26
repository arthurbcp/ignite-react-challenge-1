import { useState } from 'react'
import '../styles/tasklist.scss'

import { FiTrash, FiCheckSquare } from 'react-icons/fi'

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Uma melhor solução seria utilizando um uuid mas estou respeitando o tipo númerico da interface e o escopo de um id aleatório e não sequêncial
  // Possui graves issues de performance e limite máximo de tarefas
  function generateNewId()  {
    const maxItems = 1000;
    if(tasks.length === maxItems) {
      setErrorMessage('Limite de tarefas atingido!')
      return;
    }

    const min = 1;
    const max = maxItems;
    const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
    if (tasks.some(x => x.id === randomId)) {
     generateNewId()
     return;
    }

    return randomId
  }

  function handleCreateNewTask() {
    if(!newTaskTitle) {
      setErrorMessage('Informe o titulo da tarefa.');
      return;
    } 
    const newId =  generateNewId()
    if(newId) {
      const newTask: Task = {
        id: newId,
        title: newTaskTitle,
        isComplete: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setErrorMessage('');
    }
  }

  function handleToggleTaskCompletion(id: number) {
    const currentTaskIndex = tasks.findIndex(t => t.id === id);
    const tasksList = [...tasks];
    tasksList[currentTaskIndex].isComplete = !tasksList[currentTaskIndex].isComplete;
    setTasks(tasksList);
  }

  function handleRemoveTask(id: number) {
 //   if(confirm('Deseja realmente remover essa tarefa?'))
      setTasks(tasks.filter(t => t.id !== id));
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

      <section>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Adicionar novo todo" 
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <button type="submit" data-testid="add-task-button" onClick={handleCreateNewTask}>
            <FiCheckSquare size={16} color="#fff"/>
          </button>
        </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </section>
      </header>

      <main>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                <label className="checkbox-container">
                  <input 
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button type="button" data-testid="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                <FiTrash size={16}/>
              </button>
            </li>
          ))}
          
        </ul>
      </main>
    </section>
  )
}