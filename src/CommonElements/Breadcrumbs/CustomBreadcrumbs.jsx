import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import H3 from '../Headings/H3Element';

const CustomBreadcrumbs = ({ mainTitle }) => {
  return (
    <Container fluid={true}>
      <div className='page-title'>
        <Row>
          <Col xs='6'>
            <H3>{mainTitle}</H3>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default CustomBreadcrumbs;
    