import React from 'react'

class User extends React.Component {
  render() {
    return <h1>User: {this.props.params.id}</h1>
  }
}

module.exports = User
