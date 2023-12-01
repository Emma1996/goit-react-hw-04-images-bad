import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import { Button } from './Button/Button';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = async term => {
    const apiKey = '39759882-73fa965e3ac5dd440dc8af6ef';
    const apiUrl = `https://pixabay.com/api/?q=${term}&page=1&key=${apiKey}&image_type=photo&orientation=horizontal&per_page=12`;

    setIsLoading(true);

    try {
      const response = await axios.get(apiUrl);
      setImages(response.data.hits);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleImageClick = largeImageUrl => {
    setIsModalOpen(true);
    setModalImageUrl(largeImageUrl);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalImageUrl('');
  };

  const fetchMoreImages = async () => {
    const apiKey = '39759882-73fa965e3ac5dd440dc8af6ef';
    const perPage = 12;
    const apiUrl = `https://pixabay.com/api/?q=${searchTerm}&page=${
      page + 1
    }&key=${apiKey}&image_type=photo&orientation=horizontal&per_page=${perPage}`;

    setIsLoading(true);

    try {
      const response = await axios.get(apiUrl);
      setImages([...images, ...response.data.hits]);
      setIsLoading(false);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: '16px',
        paddingBottom: '24px',
      }}
    >
      <SearchBar onSubmit={handleSearch} />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <ImageGallery images={images} onImageClick={handleImageClick} />
          {images.length > 0 && (
            <Button onClick={fetchMoreImages} disabled={isLoading}>
              Load More
            </Button>
          )}
          <Modal isOpen={isModalOpen} handleClose={handleCloseModal}>
            <img src={modalImageUrl} alt="Modal" style={{ width: '100%' }} />
          </Modal>
        </>
      )}
    </div>
  );
};

export default App;
