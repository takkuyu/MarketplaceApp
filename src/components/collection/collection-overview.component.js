import React from 'react';
import { Link } from 'react-router-dom';
import SmallItemCard from '../item-card/small-item-card.component';
import { Row, Col } from 'reactstrap';

const CollectionOverview = ({ posts, category }) => {
  return (
    <div className="collection-overview">
      <h2>{category.heading}</h2>
      <Row>
        {
          posts.map((post, index) => <SmallItemCard post={post} key={index} md={2} currentCategory={category.id}/>)
        }
        <Col sm={3} md={2}>
          <p className="see-all-btn">
            <Link to={`/${category.linkUrl}`}>See all</Link>
          </p>
        </Col>
      </Row>
    </div>
  );
};


export default CollectionOverview;
