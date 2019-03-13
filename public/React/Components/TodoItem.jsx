var TodoItem = (props) => (
    <div data-id={props.id} class="todo">
        
        <span>{props.text}</span>
        <button data-action="edit">edit</button>
        <button data-action="done">&#x2714;</button>
        <span>{props.time}</span>
        <span>{props.status}</span>
       

    </div>
);

export default TodoItem;