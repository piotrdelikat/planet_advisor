import React, { Component } from 'react';


class Planet extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    }
  }

  handleAddComment(e) {
    e.preventDefault();
    const comment = e.target.name.value;
    const planetId = e.target.parentNode.previousSibling.id;
    fetch('/api/comments', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "id": planetId,
          "comment": comment
        })
      }).then(response => {
        return response.json();
      }).then(data => {
    });
  };

  handleDeletePlanet(e) {
    if(e.target.className === 'planet-delete') {
      const planetId = e.target.parentNode.id;
      let token = prompt("Only Darth Vader have access The Death Star. Pass the token to authorize.")
      fetch('/api/planets/' + planetId, {
          method: 'delete',
          headers: {
            'Content-Type':'application/json',
            'Authorization': "Bearer " + token
          }
        }).then(response => {
          return response.json();
        }).then(data => {
      });
    }
  }

  render () {
    let comments = this.props.comments.map(comment => {
      return <li className="comment">{comment}</li>}
    );

    return(
      <div className="row">
        <hr></hr>
        <li className="planet" id={this.props.id} key={this.props.id} onClick={e => this.handleDeletePlanet(e)}>{this.props.name}
          <span className="planet-delete"> &#215;</span>
        </li>
        <div className="comments">
          <ul>
            {comments}
          </ul>
          <form onSubmit={e => this.handleAddComment(e)}>
            <input type='text' name="name" placeholder="Add comment" />
          </form>
        </div>
      </div>
    )
  }
}

export default Planet;
