import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductPage = ({ location }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [allCategories, setAllCategories] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allPriceRanges, setAllPriceRanges] = useState([]);
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = `${import.meta.env.VITE_REACT_APP_API_ENDPOINT}/get-products`;

        if (query) {
          endpoint = `${import.meta.env.VITE_REACT_APP_API_ENDPOINT}/products/search?query=${query}`;
        }

        const response = await axios.get(endpoint);
        const filteredData = response.data.filter((product) => product.isApproved);
        setProducts(filteredData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, [query]);

  useEffect(() => {
    const categories = [...new Set(products.map(product => product.category))];
    setAllCategories(categories);
  }, [products]);

  useEffect(() => {
    const cities = [...new Set(products.map(product => product.location))];
    setAllCities(cities);
  }, [products]);

  useEffect(() => {
    // Define price range options based on your requirement
    const priceRanges = [
      { label: '$0 - $1000', value: '0-1000' },
      { label: '$1001 - $5000', value: '1001-5000' },
      { label: '$5001 - $10000', value: '5001-10000' },
      // Add more price range options based on your requirement
    ];
    setAllPriceRanges(priceRanges);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedPrice, selectedCity, selectedFeatures, products]);

  const applyFilters = () => {
    let filteredProducts = [...products];
  
    // Filter by category
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }
  
    // Filter by price range
    if (selectedPrice) {
      const [minPrice, maxPrice] = selectedPrice.split('-').map(Number);
      filteredProducts = filteredProducts.filter(product => {
        const productPrice = Number(product.Price);
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
    }
  
    // Filter by city
    if (selectedCity) {
      filteredProducts = filteredProducts.filter(product => product.location === selectedCity);
    }
  
  

   
  
    setFilteredProducts(filteredProducts);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  console.log("fuel", selectedFeatures);

  // Additional filter options for vehicles
 // Additional filter options for vehicles
const vehicleFilterOptions = (
  <>
    <select
      className="border border-gray-300 rounded-md p-2 mr-2"
      value={selectedFeatures.manufacturer || ""}
      onChange={(e) => setSelectedFeatures({ ...selectedFeatures, manufacturer: e.target.value })}
    >
      <option value="">Select Manufacturer</option>
      {/* Extract and map unique manufacturer names from products array */}
      {filteredProducts.map(product => product.category === 'vehicles' && product.features.manufacturer)
                     .filter((value, index, self) => self.indexOf(value) === index)
                     .map((manufacturer, index) => (
        <option key={index} value={manufacturer}>{manufacturer}</option>
      ))}
    </select>
    <select
      className="border border-gray-300 rounded-md p-2 mr-2"
      value={selectedFeatures.fuelType || ""}
      onChange={(e) => setSelectedFeatures({ ...selectedFeatures, fuelType: e.target.value })}
    >
      <option value="">Select Fuel Type</option>
      {/* Extract and map unique fuel types from products array */}
      {filteredProducts.map(product => product.category === 'vehicles' && product.features.fuelType)
                     .filter((value, index, self) => self.indexOf(value) === index)
                     .map((fuelType, index) => (
        <option key={index} value={fuelType}>{fuelType}</option>
      ))}
    </select>
  </>
);

  return (
    <div className="flex flex-col gap-10 items-center px-4 py-8">
      <Navbar />
      <div className="mt-[100px]  flex flex-col overflow-x-auto lg:overflow-y-hidden overflow-y-scroll border-solid border-black border-[2px] rounded-md   justify-center items-center h-auto">
        <div>
          <select
            className="border border-gray-300 rounded-md p-2 mr-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {allCategories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-md p-2 mr-2"
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
          >
            <option value="">Select Price</option>
            {allPriceRanges.map((range, index) => (
              <option key={index} value={range.value}>{range.label}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-md p-2 mr-2"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">Select City</option>
            {allCities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
          {selectedCategory === 'vehicles' && vehicleFilterOptions}
        </div>
        
      </div>
      <div>
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white shadow-md flex flex-col gap-5 rounded-lg p-4">
                <Slider {...settings}>
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={`${import.meta.env.VITE_REACT_APP_IMAGE_ENDPOINT}/${image}`}
                      alt={product.name}
                      className="object-cover h-48 w-full"
                    />
                  ))}
                  {product.videos.map((video, index) => (
                    <video
                      key={index}
                      src={`${import.meta.env.VITE_REACT_APP_VIDEO_ENDPOINT}/${video}`}
                      alt={product.name}
                      className="object-cover h-48 w-full"
                      controls
                    />
                  ))}
                </Slider>
                <div>
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-sm text-gray-500">{product.description}</p>
                  <p className="text-lg font-bold mt-2">{product.Price} AED</p>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">Features:</h3>
                    <ul className="text-sm text-gray-500">
                      {Object.entries(product.features).map(([key, value]) => (
                        <li key={key}>
                          <span className="font-semibold">{key}: </span>
                          {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
