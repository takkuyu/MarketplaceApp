import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Col } from 'reactstrap';
import { connect } from 'react-redux';
import {
  storeUsername,
  storeUserId,
  storeUserPic,
} from '../../redux/user/user.actions';

//tell me what state I need to listen to and send down as props.
const mapStateToProps = (state) => {
  return {
    this_userid: state.user.this_userid,
    this_username: state.user.this_username,
    userPic: state.user.userPic,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeUsername: (value) => dispatch(storeUsername(value)),
    storeUserId: (value) => dispatch(storeUserId(value)),
    storeUserPic: (value) => dispatch(storeUserPic(value)),
  };
};

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: '',
      username: '',
      userPic: '',
    };
  }

  componentDidMount() {
    //@ GET request
    //@ desc: get username and user profile picture of each posting
    axios
      .get('http://localhost:3000/users/' + this.props.posting.createdby) // this props returns each id of postings on postings table
      .then((res) => {
        // console.log(res.data._id)
        this.setState({
          userid: res.data._id,
          username: res.data.username,
          userPic: res.data.picture,
        });

        // this.props.storeUsername(res.data.username);
        // this.props.storeUserId(res.data._id);
        // this.props.storeUserPic(res.data.picture);
      })
      .catch(console.log);
  }

  render() {
    // console.log(this.state.username)
    // console.log('render')
    return (
      <Col md={'4'}>
        <div className="product">
          <div className="userIcon">
            <div className="postedby">Posted by:</div>
            <span>{this.state.username}</span>
            <img src={this.state.userPic} alt="" />
          </div>
          <div className="product_image">
            <Link to={`postings/comments/${this.props.posting._id}`}>
              <img src={this.props.posting.image} alt="" />
            </Link>
          </div>
          <div className="product_content">
            <div className="product_title">{this.props.posting.title}</div>
            <div className="product_price">${this.props.posting.price}</div>
            {this.state.userid === this.props.userid ? (
              <div>
                <Link
                  to={'/update/' + this.props.posting._id}
                  style={{
                    float: 'left',
                    marginLeft: '30px',
                    color: '#44a038',
                  }}
                >
                  Edit
                </Link>
                <span
                  style={{
                    cursor: 'pointer',
                    color: 'red',
                    float: 'right',
                    marginRight: '30px',
                  }}
                  onClick={() => {
                    this.props.deletePosting(this.props.posting._id);
                  }}
                >
                  Delete
                </span>
              </div>
            ) : (
              <div>
                <p style={{ color: '#44a038', marginTop: '5px' }}>
                  {this.props.createdAt}
                </p>
              </div>
            )}
          </div>
        </div>
      </Col>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Card);
