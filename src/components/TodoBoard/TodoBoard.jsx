import React, { useEffect, useState } from 'react'
import s from './TodoBoard.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button } from '@material-ui/core'
import { toast } from 'react-toastify'
import { TodoList } from './TodoList'
import { editTask } from '../../redux/actions'
import { fetchAddingTask, fetchFinishEditingTask, fetchDeletingTask, fetchDoneTask } from '../../redux/actions/asyncTaskActions'
import { SimpleSelect } from '../Select'
import 'react-toastify/dist/ReactToastify.css'

toast.configure({ autoClose: false })

export const TodoBoard = () => {
  const [inputTaskValue, setInputTaskValue] = useState('')
  const [descriptionTaskValue, setDescriptionTaskValue] = useState('')
  const [count, setCount] = useState(0)

  const dispatch = useDispatch()
  const loading = useSelector(state => state.todos.loading)
  const notify = () => toast.error("A Field Should Be Filled")
  const todos  = useSelector(
    state => {
      if (state.todos.activeType === null) {
        return state.todos.taskList
      } else {
        if (state.todos.activeType) {
          return state.todos.taskList.filter(i => i.isDone)
        } else {
          return state.todos.taskList.filter(i => !i.isDone)
        }
      }
  })

  const handleAddingTask = () => {
    if (inputTaskValue !== '') {
      dispatch(fetchAddingTask({todo: inputTaskValue, description: descriptionTaskValue}))
      setInputTaskValue('')
      setDescriptionTaskValue('')
    } else {
      notify()
    }
  }

  const handleEditingTaskMessage = id => dispatch(editTask(id))

  const handleFinishEditingTask = ({id, value}) => dispatch(fetchFinishEditingTask({id, value}))

  const handleDeletingTask = id => dispatch(fetchDeletingTask(id))

  const handleDoneTask = ({id, isDone}) => dispatch(fetchDoneTask({id, isDone}))

  useEffect(() => {
    todos.filter(item => !item.isDone)
    setCount(todos.length)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos])

  return (
    <div className={s.todoBoard}>
      <div className={s.boardWrapper}>
        <TextField
          className={s.taskInpt}
          onChange={e => setInputTaskValue(e.target.value)}
          id="outlined-basic"
          label="Type your task"
          value={inputTaskValue}
          variant="outlined"
          onKeyPress={event => {
            if (event.key === "Enter") {
              handleAddingTask();
            }
          }}
        />
        <Button
          onClick={handleAddingTask}
          color="primary"
          variant="contained">
          Add Task
        </Button>
      </div>
      <TextField
          className={s.taskDescription}
          onChange={e => setDescriptionTaskValue(e.target.value)}
          id="outlined-basic"
          label="Type description"
          value={descriptionTaskValue}
          variant="outlined"
        />
      <div className={s.todoFilter}>
        <SimpleSelect />
      </div>
        <TodoList
          loading={loading}
          todos={todos}
          editTaskMessage={handleEditingTaskMessage}
          finishEditingTask={handleFinishEditingTask}
          deleteTask={handleDeletingTask}
          handleDoneTask={handleDoneTask}
        />
      <div className={s.todoCounter}>
        <p className={s.counter}>{count <= 1 ? `${count} todo left` : `${count} todos left`}</p>
      </div>
    </div>
  )
}
