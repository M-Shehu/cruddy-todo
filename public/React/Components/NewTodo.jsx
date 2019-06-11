var NewTodo = (props) => {
    <div className="search-bar form-inline">
        <input className="form-control" type="text" />
        <button className="btn hidden-sm-down" onClick={props.onChange}>
        </button>
    </div> 
}

export default NewTodo;