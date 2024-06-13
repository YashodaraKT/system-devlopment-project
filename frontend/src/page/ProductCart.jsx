import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Hnbar from '../component/Hnbar';

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
      <div><Hnbar /></div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '40px' }}>
        <Card sx={{ maxWidth: 1000 }}>
          <CardContent>
           
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
              At our farm, we are committed to providing high-quality agricultural products that support sustainable and humane farming practices. Our range of products includes pigs, chickens, and raw fishmeal, all of which are produced with the utmost care and attention to detail.
            </Typography>

            <ul >
            
            <li><Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
              <strong>Pigs-</strong>We raise our pigs in a healthy and humane environment, ensuring they receive a balanced diet and excellent care. Our focus is on producing premium pork products that meet the highest standards of safety and nutrition, providing our customers with delicious and wholesome meat.
            </Typography> </li>
          
            <li><Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
            <strong>Poultry</strong>Our chickens are raised in clean, spacious environments that promote their natural behaviors and growth. We are dedicated to offering top-quality chicken products, free from antibiotics and hormones. Our practices ensure that our poultry is both nutritious and sustainably produced.
            </Typography> </li>
            
            <li><Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
            <strong>Raw Fishmeal</strong>Fishmeal is a crucial component of animal feed, rich in protein and essential nutrients. We source our raw fishmeal from sustainable fisheries and process it to maintain its nutritional value. By incorporating fishmeal into our feeds, we support the health and growth of our pigs, chickens, and other livestock.
            </Typography> </li>
            </ul>
            <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }} sx={{ fontSize: '1.2rem' }}>
              Our commitment to quality and sustainability ensures that our products are not only good for your table but also good for the environment. We take pride in our farming practices and strive to deliver the best products to our customers.
            </Typography>
            
          </CardContent>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', margin: '40px' }}>
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
                <Typography variant="h6" color="text.primary">
                  Rs {product.Selling_Price} (per kg)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.Description}
                </Typography>
              </CardContent>
              <CardActions>
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
