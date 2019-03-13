
import NewTodo from './Components/NewTodo.js'
import TodoListItems from './Components/TodoListItems.js' ;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        <div>
            <div>
                <NewTodo />
            </div>
            <div>
                <TodoListItems />
            </div>
        </div>
    }

}

export default App;