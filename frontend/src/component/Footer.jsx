import React from 'react';
import Card from 'react-bootstrap/Card';

function Footer() {
  return (
    <div>
        <Card>
          <Card.Footer style={{ backgroundColor: 'gray' }} className="text-muted"></Card.Footer>
        </Card>
    </div>
  );
}

export default Footer;
