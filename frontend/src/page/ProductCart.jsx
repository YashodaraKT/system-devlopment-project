import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function ProductChart() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch Product data from the backend when the component mounts
    fetch('http://localhost:8081/viewProducts')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log data to check the structure and image paths
        setProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: '20px', margin: '40px' }}>
        {products.map(product => {
          // Correct the image path and handle empty paths
          const imagePath = product.Image_Path ? `http://localhost:8081/${product.Image_Path.replace(/\\/g, '/')}` : 'default-image-url';

          return (
            <Card key={product.Product_ID} sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image={imagePath}
                title={product.Product_Name}
                onError={(e) => { e.target.onerror = null; e.target.src = 'fallback-image-url'; }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.Product_Name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.Description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default ProductChart;
