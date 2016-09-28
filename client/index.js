import React, {Component} from 'react'
import ReactDOM from 'react-dom'

const rootEl = document.querySelector('#root')

class App extends Component {
  constructor() {
    super()
    this.sendMessage = this.sendMessage.bind(this)
    this.state = {
      messages: [],
      users: [],
      room: ''
    }
  }

  sendMessage(e) {
    e.preventDefault()
    this.socket.emit('chatMessage', {
      text: this.input.value,
      name: this.name,
      id: this.id,
      room: this.state.room
    })
    this.input.value = ''
  }

  sendRoom(room) {
    this.socket.emit('room', room)
  }

  joinRoom(e) {
    e.preventDefault()
    this.setState({room: this.roomInput.value, messages: []})
    this.sendRoom(this.roomInput.value)
    this.roomInput.value = ''
    console.log(this.roomInput)
  }

  receiveMessage(message) {
    this.setState({messages: this.state.messages.concat(message)})
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight
  }

  receiveId(id) {
    this.id = id
    this.socket.emit('sendUser', {name: this.name, id: this.id})
  }

  receiveUsers(users) {
    this.setState({users: users})
  }

  componentWillMount () {
    this.name = localStorage.getItem('name') || prompt('Enter your name') || 'Anon'
    localStorage.setItem('name', this.name)
  }

  componentDidMount() {
    this.socket = io()
    this.socket.on('receiveMessage', this.receiveMessage.bind(this))
    this.socket.on('receiveId', this.receiveId.bind(this))
    this.socket.on('receiveUsers', this.receiveUsers.bind(this))
  }

  render() {
    return (
      <div>
        <div className="col-sm-3">
          <form onSubmit={e => this.joinRoom(e)}>
            <input className="form-control" ref={node => this.roomInput = node} placeholder="Room Name" />
          </form>
        </div>
        <div className="col-sm-6">
          <div style={{height:400, overflowY:'auto'}} ref={node => this.chatContainer = node}>
            <table className="table table-striped table-hover">
              <tbody>
                {this.state.messages.map(function(message, index) {
                  return <tr key={index}><td>{message.name} : {message.text}</td></tr>
                })}
              </tbody>
            </table>
          </div>
          <form onSubmit={this.sendMessage}>
            <div className="row">
              <div className="col-xs-10" style={{paddingRight: 0}}>
                <input className="form-control" ref={node => this.input = node} />
              </div>
              <div className="col-xs-2" style={{paddingLeft: 0}}>
                <button className="btn btn-primary">Send</button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-sm-3">
          <div className="panel panel-primary">
            <div className="panel-heading">
              Online Users {this.state.room ? ` (${this.state.room})` : ''}
            </div>
            <div className="panel-body">
              {this.state.users.map(function(user, index) {
                return <li key={index}>{user.name}</li>
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, rootEl)
