import TodoItem from "./Components/TodoItem.js";

var TodoListView = (props) => {
    <div className="todo-list">
        {props.items.map((item, index) => 
            <TodoItem />
        )}
    </div>
}

export default TodoListView;