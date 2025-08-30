import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import styles from "./HomeCarousel.module.css";

const HomeCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const carouselItems = [
    {
        id: 1,
        image: "/images/zip8.jpg",
        title: "Quality Fabrics",
        subtitle: "Crafted with premium materials",
        cta: "Learn More"
      },
   
    {
      id: 2,
      image: "/images/zip11.jpeg",
      title: "New Arrivals",
      subtitle: "Fresh styles for every season",
      cta: "Explore"
    },
    {
        id: 3,
        image: "/images/zip10.jpg",
        title: "Premium Collection",
        subtitle: "Discover our latest styles",
        cta: "Shop Now"
      },
   
    {
      id: 4,
      image: "/images/zip9.jpg",
      title: "Trending Now",
      subtitle: "Stay ahead of the curve",
      cta: "View Collection"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const swipeConfidenceThreshold = 8000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1;
      }
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className={styles.carouselSection}>
      <motion.div 
        className={styles.carouselContainer}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = swipePower(offset.x, velocity.x);

          if (swipe < -swipeConfidenceThreshold) {
            paginate(1);
          } else if (swipe > swipeConfidenceThreshold) {
            paginate(-1);
          }
        }}
      >
        {/* All images pre-rendered in DOM for instant switching */}
        {carouselItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={styles.carouselSlide}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentIndex ? 1 : 0,
              zIndex: index === currentIndex ? 1 : 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0,
              zIndex: index === currentIndex ? 1 : 0,
            }}
            transition={{ 
              opacity: { duration: 0.2, ease: "easeInOut" },
              zIndex: { duration: 0 }
            }}
          >
            <img 
              src={item.image} 
              alt={item.title}
              className={styles.carouselImage}
              loading="eager"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                objectPosition: 'top'
              }}
            />
            <div className={styles.carouselOverlay}>
              <div className={styles.carouselContent}>
                <motion.h2 
                  className={styles.carouselTitle}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: index === currentIndex ? 1 : 0, y: index === currentIndex ? 0 : 30 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                >
                  {item.title}
                </motion.h2>
                <motion.p 
                  className={styles.carouselSubtitle}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: index === currentIndex ? 1 : 0, y: index === currentIndex ? 0 : 30 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                >
                  {item.subtitle}
                </motion.p>
                <motion.button 
                  className={styles.carouselCTA}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: index === currentIndex ? 1 : 0, y: index === currentIndex ? 0 : 30 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.cta}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Arrows */}
      <button 
        className={`${styles.navButton} ${styles.prevButton}`}
        onClick={() => paginate(-1)}
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className={styles.navIcon} />
      </button>
      <button 
        className={`${styles.navButton} ${styles.nextButton}`}
        onClick={() => paginate(1)}
        aria-label="Next slide"
      >
        <ChevronRightIcon className={styles.navIcon} />
      </button>

      {/* Dots Indicator */}
      <div className={styles.dotsContainer}>
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeCarousel;
