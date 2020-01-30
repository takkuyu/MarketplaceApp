import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Container, ListGroup, ListGroupItem, Input, Button, Form
} from 'reactstrap';
import Navbar from "./navbar.component";

import "../styles/comment.css"


export default class Comment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            posting: [],
            comment: '',
            comments: [],
            title: '',
            location: '',
            price: 0,
            image: '',
            description: '',
            liked: false,
            likedId: '',
            createdby: '',
            postedby: '',
            notification: ''
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onSetComment = this.onSetComment.bind(this);
        this.getComments = this.getComments.bind(this);
        this.getLikes = this.getLikes.bind(this);
        this.postLikes = this.postLikes.bind(this);
    }

    componentDidMount() {

        // console.log(JSON.parse(sessionStorage.getItem('liked')))

        // this.setState({
        //     liked: JSON.parse(sessionStorage.getItem('liked'))
        // })

        if (this.props.location.id === undefined) {
            this.setState({
                posting: JSON.parse(sessionStorage.getItem('posting')),
                comments: JSON.parse(sessionStorage.getItem('comments')),
                // liked: JSON.parse(sessionStorage.getItem('liked'))
            })
            return;
        }
        // sessionStorage.setItem('author', JSON.stringify(this.props.location.user));


        axios.get("http://localhost:3000/postings/" + this.props.location.id)
            .then(res => {

                // res.data.comments.map(comment => {
                //     console.log(comment.author)
                // })

                this.setState({
                    posting: res.data,
                    comments: res.data.comments,
                })
            })
    }

    componentDidUpdate() {
        sessionStorage.setItem('posting', JSON.stringify(this.state.posting));
        sessionStorage.setItem('comments', JSON.stringify(this.state.comments));
        // sessionStorage.setItem('liked', JSON.stringify(this.state.liked));

    }

    getComments() {
        return this.state.comments.map(com => {
            return (
                <ListGroupItem key={new Date().getTime().toString(36) + '-' + Math.random().toString(36)} style={{ border: 'none', borderBottom: '1px solid', borderRadius: '0', fontWeight: 'bold', color: 'black' }}>
                    <span style={{ fontSize: '10px', color: '#44a038' }}>{com.author}</span> - {com.comment}
                </ListGroupItem>
            );
        });
    }

    onSubmit(e) {
        e.preventDefault();

        if (this.state.comment === '') {
            return;
        }

        // const author = JSON.parse(sessionStorage.getItem('posting'))

        const comment = {
            author: JSON.parse(sessionStorage.getItem('username')),
            comment: this.state.comment
        }

        axios.post('http://localhost:3000/postings/update/comments/' + this.state.posting._id, comment)
            .then(() => {
                axios.get('http://localhost:3000/postings/' + this.state.posting._id)
                    .then(response => {
                        this.setState({
                            comments: response.data.comments,
                            comment: ''
                        })
                    })
                    .catch((error) => { console.log(error) });
            })
            .catch((error) => { console.log(error) })

    }

    onSetComment(e) {
        this.setState({
            comment: e.target.value
        });
    }

    // state is set after render() (re-rendered), so use didUpdate, otherwise setState isn't applied
    postLikes() {
        //  console.log('likedid: '+ this.state.likedId)
        // sessionStorage.setItem('liked', JSON.stringify(this.state.liked));

        const like = {
            likedId: this.state.likedId,
            createdby: this.state.createdby,
            title: this.state.title,
            location: this.state.location,
            price: this.state.price,
            image: this.state.image,
            description: this.state.description,
            // liked: !this.state.liked,
        }

        // console.log('test')
        axios.post('http://localhost:3000/likes/post', like)
            .then(response => {
                console.log(response);
            })
            .catch((error) => { console.log(error) });
    }


    getLikes(id) {

        this.setState({
            likedId: id
        })


        const log = {
            likedId: id
        }

        axios.post('http://localhost:3000/likes/isLiked', log)
            .then(res => {

                if (res.data !== null) {
                    this.setState({
                        liked: true
                    })
                    return;
                }

                axios.get('http://localhost:3000/postings/' + id)
                    .then(response => {
                        this.setState({
                            createdby: response.data.createdby,
                            title: response.data.title,
                            location: response.data.location,
                            price: response.data.price,
                            image: response.data.image,
                            description: response.data.description,
                            liked: true,
                            notification: 'Added Successfully to favorite !'
                        })

                        // sessionStorage.setItem('liked', JSON.stringify(this.state.liked));

                        this.postLikes();
                    })
                    .catch((error) => { console.log(error) });

            })
    }

    render() {

        console.log(this.state.posting)

        const date = new Date(this.state.posting.createdAt);

        return (
            <Container>
                <Navbar />
                <div className="product_details">
                    <div className="container">
                        <div className="row details_row">
                            {/* <!-- Product Image --> */}
                            <div className="col-lg-6">
                                <div className="details_image">
                                    <div className="details_image_large"><img src={this.state.posting.image} alt="" /></div>
                                </div>
                            </div>

                            {/* <!-- Product Content --> */}
                            <div className="col-lg-6">
                                <div className="details_content">
                                    <div className="details_name">{this.state.posting.title}</div>
                                    {/* <div className="details_discount">$890</div> */}
                                    <div className="details_price">${this.state.posting.price}</div>

                                    {/* <!-- In Stock --> */}
                                    <div className="in_stock_container">
                                        <div className="availability">Location:</div>
                                        <span>{this.state.posting.location}</span>
                                    </div>
                                    <div className="details_text">
                                        <h4>Description</h4>
                                        <p>{this.state.posting.description}</p>
                                    </div>

                                    {/* <!-- Product Quantity --> */}
                                    <div className="product_quantity_container">
                                        {
                                            this.state.posting.createdby === this.props.location.user ?
                                                (<div style={{ marginTop: '12px' }}>
                                                    <p>You posted this item on: <span style={{ color: '#44a038' }}>{date.getDate() + " / " + date.getMonth() + 1 + " / " + date.getFullYear()}</span></p>
                                                    <div className="button cart_button" style={{ marginTop: '0px' }}><Link to={"/update/" + this.state.posting._id}>Edit</Link></div>
                                                </div>
                                                )
                                                :
                                                this.state.liked ?
                                                    (<div style={{ marginTop: '12px' }}>
                                                        <p style={{ color: '#ff0000', height: '29px', marginLeft: '13px' }}>{this.state.notification}</p>
                                                        <div style={{ marginTop: '0px' }} className="button cart_button"><a style={{ backgroundColor: 'black' }} onClick={() => this.getLikes(this.state.posting._id)}>Already Added!</a></div>
                                                    </div>)
                                                    :
                                                    <div className="button cart_button"><a onClick={() => this.getLikes(this.state.posting._id)}>Add to Favorite</a></div>
                                        }

                                    </div>

                                    {/* <!-- Share --> */}
                                    <div className="details_share">
                                        <span>Share:</span>
                                        <ul>
                                            <li><a title="pinterest" target="_blank" href="https://www.pinterest.com/"><i className="fab fa-pinterest" aria-hidden="true"></i></a></li>
                                            <li><a title="instagram" target="_blank" href="https://www.instagram.com/"><i className="fab fa-instagram" aria-hidden="true"></i></a></li>
                                            <li><a href="https://www.facebook.com/" target="_blank" title="Facebook"><i className="fab fa-facebook" aria-hidden="true"></i></a></li>
                                            <li><a href="https://twitter.com" target="_blank" title="Twitter"><i className="fab fa-twitter" aria-hidden="true"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row description_row">
                            <div className="col">
                                <div className="description_title_container">
                                    <div className="description_title">Comments<span>({this.state.comments.length})</span></div>
                                </div>
                                {/* <div className="description_text">
                                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. Phasellus id nisi quis justo tempus mollis sed et dui. In hac habitasse platea dictumst. Suspendisse ultrices mauris diam. Nullam sed aliquet elit. Mauris consequat nisi ut mauris efficitur lacinia.</p>
                            </div> */}
                                <ListGroup style={{ overflow: 'scroll', maxHeight: "400px", height: "400px", border: "1px solid black" }}>
                                    {this.getComments()}
                                </ListGroup>
                                <Form className="form" onSubmit={this.onSubmit} style={{ paddingBottom: '100px' }}>
                                    <Input
                                        type="text"
                                        name="text"
                                        id="comment"
                                        value={this.state.comment}
                                        placeholder="Enter a comment"
                                        onChange={this.onSetComment}
                                        style={{ marginTop: "15px", width: '80%', display: 'inline-block' }}
                                    />
                                    <Button style={{ marginLeft: '20px' }}>Comment</Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div >
            </Container>
        );
    }
};
