import React, { useState, useEffect } from 'react';
import './home.css';
import DataLoadImg from '../be/getData';
import logo from '../khaluLogo.jpg';

const Home: React.FC = () => {
  const [data, setData] = useState<any[]>([]); // State để lưu trữ dữ liệu
  const [isLoading, setIsLoading] = useState(true); // State để kiểm tra dữ liệu đang được tải hay không
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State để lưu trữ URL của ảnh được click
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // State để lưu trữ chỉ số của ảnh đang được hiển thị trong modal
  const [urlZalo, setUrlZalo] = useState<string>("");  // State để lưu URL của Zalo
  const [showCount, setShowCount] = useState<number>(30); // State để lưu số lượng dữ liệu hiển thị

  useEffect(() => {
    const fetchData = async () => {
      const { dataAll, urlZalo } = await DataLoadImg();
      if (dataAll) {
        const newData = dataAll.slice(0, showCount).reverse(); // Đảo ngược mảng newData
        setData((prevData) => {
          const filteredData = newData.filter((item) => !prevData.some((prevItem) => prevItem.title === item.title));
          return [...filteredData, ...prevData]; // Thêm dữ liệu mới vào đầu mảng
        }); 
        setIsLoading(false);
      }
      setUrlZalo(urlZalo);
    };
    fetchData();
  }, [showCount]);

  // Hàm xử lý khi click vào ảnh
  const handleImageClick = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl); 
    setSelectedIndex(index); 
  };

  const handleTitleClick = (title: string) => {
    if (urlZalo) {
      window.location.href = urlZalo;
    } else {
      console.error("Zalo URL is not available!");
    }
  };

  const closeModal = () => {
    setSelectedImage(null); // Đặt selectedImage về null để đóng modal
  };

  const handleLoadMore = () => {
    setShowCount((prevCount) => prevCount + 20); // Tăng số lượng dữ liệu hiển thị lên 20
  };

  return (
    <div className="center">
      <div className="rectangle" >
        <div className='button-container'>
          {/* <button className='loadData-btn' onClick={handleLoadMore}>
            <a>
              Load more
            </a>
          </button> */}
        </div>
        {data.map((item, index) => (
          <div key={index} className="list-item">
            <div className="title-container">
              <img src={logo} alt="Logo" className="logo" />
              <span className="title">{item.title}</span>
            </div>
            <div className="image-list">
              <div className="image-block">
                {item.img_list.split(',').map((img: string, imgIndex: number) => (
                  <React.Fragment key={imgIndex}>
                    {(imgIndex > 0 && imgIndex % 3 === 0) && <br />} {/* Thêm line break sau mỗi 3 ảnh */}
                    <img
                      src={img.trim()}
                      alt={`Image ${imgIndex}`}
                      className="image"
                      onClick={() => handleImageClick(img.trim(), imgIndex)} // Xử lý khi click vào ảnh
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <img src={selectedImage} alt="Selected Image" className="modal-image" />
        </div>
      )}
      <div className='process-zalo' onClick={() => handleTitleClick("title")}>
      <span className='highlight-text'>Liên hệ zalo để đặt hàng nhanh nhất</span>:
  <a href={urlZalo} className='zalo-btn' target='_blank'>
    <img src='zaloIcon.png' className='zalo-icon' />
  </a>
      </div>
    </div>
  );
}

export default Home;
