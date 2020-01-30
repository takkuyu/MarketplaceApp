import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Container, Col, Row
} from 'reactstrap';
// import {
//     Card, CardText, CardBody, CardLink,
//     CardTitle
// } from 'reactstrap';
import Navbar from "./navbar.component";

const FavoriteList = props => (
    // <Col sm="4">
    //     <Card style={{ marginTop: '20px' }}>
    //         <CardBody>
    //             <CardTitle style={{ height: '20px' }}>{props.like.title}</CardTitle>
    //         </CardBody>
    //         <img width="100%" src={props.like.image} alt="Card image cap" />
    //         <CardBody>
    //             <CardText>{props.like.description}</CardText>
    //             <Button color="danger" onClick={() => props.deleteLike(props.like._id)} style={{ display: 'inline-block' }}>Unlike</Button>
    //         </CardBody>
    //     </Card>
    // </Col>

    <Col md={'4'}>
        <div className="product">
            <div className="in_stock_container">
                <div className="availability" >Added on:</div>
                <span>{props.date.getDate() + " / " + props.date.getMonth() + 1 + " / " + props.date.getFullYear()}</span>
            </div>
            <div className="product_image">
                <Link to={{
                    pathname: "/comments",
                    id: props.like.likedId,
                    user: JSON.parse(sessionStorage.getItem('username'))
                }}>
                    <img src={props.like.image} alt="" />
                </Link>
            </div>
            <div className="product_content">
                <div className="product_title">{props.like.title}</div>
                <div className="product_price">${props.like.price}</div>
                <div className="in_stock_container" style={{ marginTop: '10px' }}>
                    <div className="availability" >Location:</div>
                    <span>{props.like.location}</span>
                </div>
                <a style={{ cursor: 'pointer', color: "red" }} onClick={() => props.deleteLike(props.like._id)}>Unlike</a>
            </div>
        </div>
    </Col >
);



export default class Favorite extends Component {

    constructor(props) {
        super(props);

        this.state = {
            likes: []
        }
        this.deleteLike = this.deleteLike.bind(this);

    }

    componentDidMount() {
        axios.get('http://localhost:3000/likes/')
            .then(response => {
                this.setState({
                    likes: response.data,
                })
            })
            .catch((error) => { console.log(error) });
    }

    deleteLike(id) {
        axios.delete('http://localhost:3000/likes/' + id)
            .then(response => console.log(response.data));

        this.setState({
            likes: this.state.likes.filter(el => el._id !== id) // this filter returns all the elements in the db whose id does not match the deleted id.
        })

    }

    postingList() {
        return this.state.likes.map(like => {
            const date = new Date(like.createdAt)
            // console.log(d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear())
            return (
                <FavoriteList
                    date={date}
                    like={like}
                    key={like._id}
                    deleteLike={this.deleteLike}
                // deletePosting={this.deletePosting}
                />

            );
        })
    }

    render() {
        // if(this.state.likes.length === 0){

        //     return(

        //     );
        // }

        return (
            // <Container className="App">
            //     <Navbar/>
            //   {/* <h1>{this.props.location.aboutProps}</h1> */}
            //   <h1>{this.state.id}</h1>
            // </Container>
            <Container className="App">
                <Navbar />
                <Row>
                    {!this.state.likes.length ?
                        <h4 style={{ textAlign: 'center', width: '100%', paddingTop: '100px' }}>There are no items added to favorite</h4>
                        : this.postingList()
                    }
                </Row>
            </Container>

            // <Col sm="4">
            //     <Card style={{ marginTop: '20px' }}>
            //         <CardBody>
            //             <CardTitle style={{ height: '20px' }}>{this.props.posting.title}</CardTitle>
            //         </CardBody>
            //         <img width="100%" src={this.props.posting.image} alt="Card image cap" />
            //         <CardBody>
            //             <CardText>{this.props.posting.description}</CardText>
            //             {/* <CardLink href="#" onClick={() => { this.props.deletePosting(this.props.posting._id) }}>Delete</CardLink> */}
            //         </CardBody>
            //     </Card>
            // </Col>
        );
    }
}