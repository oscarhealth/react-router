import React from 'react'
import { render, findDOMNode } from 'react-dom'
import { browserHistory, Router, Route, IndexRoute, Link, withRouter } from 'react-router'

import withExampleBasename from '../withExampleBasename'
import ContactStore from './ContactStore'

import './app.css'

class App extends React.Component {
  state = {
    contacts: ContactStore.getContacts(),
    loading: true
  };

  componentWillMount() {
    ContactStore.init()
  }

  componentDidMount() {
    ContactStore.addChangeListener(this.updateContacts)
  }

  componentWillUnmount() {
    ContactStore.removeChangeListener(this.updateContacts)
  }

  updateContacts = () => {
    this.setState({
      contacts: ContactStore.getContacts(),
      loading: false
    })
  };

  render() {
    const contacts = this.state.contacts.map(function (contact) {
      return <li key={contact.id}><Link to={`/contact/${contact.id}`}>{contact.first}</Link></li>
    })

    return (
      <div className="App">
        <div className="ContactList">
          <Link to="/contact/new">New Contact</Link>
          <ul>
            {contacts}
          </ul>
        </div>
        <div className="Content">
          {this.props.children}
        </div>
      </div>
    )
  }
}

class Index extends React.Component {
  render() {
    return <h1>Address Book</h1>
  }
}

const Contact = withRouter(class extends React.Component {
  getStateFromStore = (props) => {
    const { id } = props ? props.params : this.props.params

    return {
      contact: ContactStore.getContact(id)
    }
  };

  componentDidMount() {
    ContactStore.addChangeListener(this.updateContact)
  }

  componentWillUnmount() {
    ContactStore.removeChangeListener(this.updateContact)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromStore(nextProps))
  }

  updateContact = () => {
    this.setState(this.getStateFromStore())
  };

  destroy = () => {
    const { id } = this.props.params
    ContactStore.removeContact(id)
    this.props.router.push('/')
  };

  state = this.getStateFromStore();

  render() {
    const contact = this.state.contact || {}
    const name = contact.first + ' ' + contact.last
    const avatar = contact.avatar || 'http://placecage.com/50/50'

    return (
      <div className="Contact">
        <img height="50" src={avatar} key={avatar} />
        <h3>{name}</h3>
        <button onClick={this.destroy}>Delete</button>
      </div>
    )
  }
})

const NewContact = withRouter(class extends React.Component {
  createContact = (event) => {
    event.preventDefault()

    ContactStore.addContact({
      first: findDOMNode(this.refs.first).value,
      last: findDOMNode(this.refs.last).value
    }, (contact) => {
      this.props.router.push(`/contact/${contact.id}`)
    })
  };

  render() {
    return (
      <form onSubmit={this.createContact}>
        <p>
          <input type="text" ref="first" placeholder="First name" />
          <input type="text" ref="last" placeholder="Last name" />
        </p>
        <p>
          <button type="submit">Save</button> <Link to="/">Cancel</Link>
        </p>
      </form>
    )
  }
})

class NotFound extends React.Component {
  render() {
    return <h2>Not found</h2>
  }
}

render((
  <Router history={withExampleBasename(browserHistory, __dirname)}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
      <Route path="contact/new" component={NewContact} />
      <Route path="contact/:id" component={Contact} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
), document.getElementById('example'))
