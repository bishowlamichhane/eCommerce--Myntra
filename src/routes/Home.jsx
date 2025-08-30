import HomeItem from "../components/HomeItem";
import HomeCarousel from "../components/HomeCarousel";
import { useSelector } from "react-redux";
import { PiNetworkXLight } from "react-icons/pi";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { addToUserBag, removeFromUserBag, getUserBag } from "../firebase/firebase";
import { motion } from "framer-motion";

const Home = () => {
  const items = useSelector((store) => store.items);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bagItems, setBagItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchBagItems = async () => {
      if (currentUser) {
        try {
          const items = await getUserBag(currentUser.uid);
          setBagItems(items);
          // Set initial quantities for items in bag
          const qtyObj = {};
          items.forEach((bagItem) => {
            qtyObj[bagItem.productId] = bagItem.quantity;
          });
          setQuantities(qtyObj);
        } catch (error) {
          console.error("Error fetching bag items:", error);
        }
      }
    };
    fetchBagItems();
  }, [currentUser]);

  const handleAdded = async (item, quantity) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      const productData = {
        productId: item.id,
        companyId: item.company || 'default',
        quantity: quantity,
        priceAtPurchase: item.current_price || 0,
        itemDetails: {
          name: item.item_name || '',
          image: item.image || '',
          company: item.company || '',
          current_price: item.current_price || 0,
          original_price: item.original_price || 0,
          discount_percentage: item.discount_percentage || 0
        }
      };
      await addToUserBag(currentUser.uid, productData);
      setBagItems(prev => {
        const filtered = prev.filter(bagItem => bagItem.productId !== item.id);
        return [...filtered, { ...productData, id: Date.now() }];
      });
      setQuantities(q => ({ ...q, [item.id]: quantity }));
    } catch (error) {
      console.error("Error adding item to bag:", error);
    }
  };

  const handleRemoved = async (itemId) => {
    if (!currentUser) return;
    try {
      await removeFromUserBag(currentUser.uid, itemId);
      setBagItems(prev => prev.filter(item => item.productId !== itemId));
      setQuantities(q => {
        const newQ = { ...q };
        delete newQ[itemId];
        return newQ;
      });
    } catch (error) {
      console.error("Error removing item from bag:", error);
    }
  };

  const isInBag = (itemId) => bagItems.some(bagItem => bagItem.productId === itemId);
  const getQuantity = (itemId) => quantities[itemId] || 1;

  return (
    <main >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <HomeCarousel />
      </motion.div>

      <motion.section
        className={styles.new_arrivals}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <h1 className={styles.new_arrivals_title}>NEW ARRIVALS</h1>
        <p className={styles.new_arrivals_text}>
          Check out our new styles for $25. From the Oversized Boxy T-shirts and the Slub
          Pocket T-shirt to new colours in our classic styles, there is something for
          everyone's wardrobe.
        </p>
      </motion.section>

      <motion.section
        className={styles.new_items_section}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className={styles.new_items_header}>
          <h2 className={styles.new_items_title}>NEW ITEMS</h2>
          <Link to="/shop" className={styles.view_all_button}>
            View all
          </Link>
        </div>

        {items.length > 0 ? (
          <motion.div
            className={styles.items_grid}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.18,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {items.slice(0, 4).map((item) => {
              const quantity = getQuantity(item.id);
              return (
                <motion.div
                  key={item.id}
                  className={styles.product_card}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
                  }}
                >
                  <div className={styles.product_image} style={{ position: 'relative' }} onClick={()=>navigate(`/item/${item.id}`)}>
                    <img 
                      src={`/${item.image}`} 
                      alt={item.item_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0 }}
                    />
                    <div className={styles.save_badge}>
                      BUY 3 – SAVE 10%
                    </div>
                    <div className="size-bar">
                      <span>XS</span>
                      <span>S</span>
                      <span>M</span>
                      <span>L</span>
                      <span>XL</span>
                      <span>XXL</span>
                    </div>
                  </div>
                  <div className={styles.product_info}>
                    <h3 className={styles.product_title}>{item.item_name}</h3>
                    <p className={styles.product_subtitle}>{item.company_name}</p>
                    <div className={styles.product_price_row}>
                      <span className={styles.product_price}>Rs {item.current_price}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="minimal-qty-btn"
                          style={{ border: 'none', background: 'none', fontSize: 16, color: '#333', padding: 0, width: 24, height: 24, cursor: 'pointer' }}
                          onClick={() => quantity > 1 && setQuantities(q => ({ ...q, [item.id]: quantity - 1 }))}
                        >
                          –
                        </button>
                        <span style={{ minWidth: 20, textAlign: 'center', fontSize: 14 }}>{quantity}</span>
                        <button
                          className="minimal-qty-btn"
                          style={{ border: 'none', background: 'none', fontSize: 16, color: '#333', padding: 0, width: 24, height: 24, cursor: 'pointer' }}
                          onClick={() => setQuantities(q => ({ ...q, [item.id]: quantity + 1 }))}
                        >
                          +
                        </button>
                      </div>
                      {isInBag(item.id) ? (
                        <button
                          className="minimal-bag-btn"
                          style={{ border: 'none', background: 'none', color: '#b00', fontSize: 13, marginLeft: 10, cursor: 'pointer', padding: '4px 8px', borderRadius: 3 }}
                          onClick={() => handleRemoved(item.id)}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          className="minimal-bag-btn"
                          style={{ border: '1px solid #222', background: 'none', color: '#222', fontSize: 13, marginLeft: 10, cursor: 'pointer', padding: '4px 12px', borderRadius: 3 }}
                          onClick={() => handleAdded(item, quantity)}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="network-error">
            <span><PiNetworkXLight/></span>
            <p>Unable to connect to the internet</p>
          </div>
        )}
      </motion.section>

      <motion.section className={styles.our_production_section}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
        viewport={{ once: true, amount: 0.2 }}>
        <h2 className={styles.our_production_heading}>OUR PRODUCTION<span style={{ fontWeight: 100 }}>__</span></h2>
        <motion.div
          className={styles.our_production_row}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.22,
              },
            },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            className={styles.our_production_col}
            variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } } }}
          >
            <img src="/images/prod1.jpg" alt="Knitting Mill" className={styles.our_production_img} />
            <h3 className={styles.our_production_title}>KNITTING MILL</h3>
            <p className={styles.our_production_text}>
              Our parent company Roopa Knitting Mills has been manufacturing world class knit textiles for the last 30 years in Toronto, Canada. Our knowledge base and state of the art knitting machines allow us to create the highest quality fabrics for every product in our line.
            </p>
          </motion.div>
          <motion.div
            className={styles.our_production_col}
            variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } } }}
          >
            <img src="/images/prod2.jpg" alt="Dye House" className={styles.our_production_img} />
            <h3 className={styles.our_production_title}>DYE HOUSE</h3>
            <p className={styles.our_production_text}>
              Milling fabrics to the highest quality specifications is only the first part of our process. Our dye house is located a few meters from the mill and allows us the opportunity to be hands on with our products every step of the way.
            </p>
          </motion.div>
          <motion.div
            className={styles.our_production_col}
            variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } } }}
          >
            <img src="/images/prod3.jpg" alt="Sewing Factory" className={styles.our_production_img} />
            <h3 className={styles.our_production_title}>SEWING FACTORY</h3>
            <p className={styles.our_production_text}>
              Located only 15 km from the mill, our sewing operation is where art and manufacturing connect with unparalleled construction techniques and an extreme attention to detail. Every product is carefully sewn to the highest quality specification and quality assured before shipping to you.
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section className={styles.speial_items}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
        viewport={{ once: true, amount: 0.2 }}>
        <div className={styles.new_items_header}>
          <h2 className={styles.new_items_title}>SPECIAL ITEMS</h2>
          <Link to="/shop" className={styles.view_all_button}>
            View all
          </Link>
        </div>
        {items.length > 4 ? (
          <motion.div
            className={styles.items_grid}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.18,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {items.slice(4, 8).map((item) => {
              const quantity = getQuantity(item.id);
              return (
                <motion.div
              
                  key={item.id}
                  className={styles.product_card}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                  }}
                >
                  <div className={styles.product_image}   onClick={()=>navigate(`/item/${item.id}`)} style={{ position: 'relative' }}>
                    <img 
                      src={`/${item.image}`} 
                      alt={item.item_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0 }}
                    />
                    <div className={styles.save_badge}>
                      BUY 3 – SAVE 10%
                    </div>
                    <div className="size-bar">
                      <span>XS</span>
                      <span>S</span>
                      <span>M</span>
                      <span>L</span>
                      <span>XL</span>
                      <span>XXL</span>
                    </div>
                  </div>
                  <div className={styles.product_info}>
                    <h3 className={styles.product_title}>{item.item_name}</h3>
                    <p className={styles.product_subtitle}>{item.company_name}</p>
                    <div className={styles.product_price_row}>
                      <span className={styles.product_price}>Rs {item.current_price}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="minimal-qty-btn"
                          style={{ border: 'none', background: 'none', fontSize: 16, color: '#333', padding: 0, width: 24, height: 24, cursor: 'pointer' }}
                          onClick={() => quantity > 1 && setQuantities(q => ({ ...q, [item.id]: quantity - 1 }))}
                        >
                          –
                        </button>
                        <span style={{ minWidth: 20, textAlign: 'center', fontSize: 14 }}>{quantity}</span>
                        <button
                          className="minimal-qty-btn"
                          style={{ border: 'none', background: 'none', fontSize: 16, color: '#333', padding: 0, width: 24, height: 24, cursor: 'pointer' }}
                          onClick={() => setQuantities(q => ({ ...q, [item.id]: quantity + 1 }))}
                        >
                          +
                        </button>
                      </div>
                      {isInBag(item.id) ? (
                        <button
                          className="minimal-bag-btn"
                          style={{ border: 'none', background: 'none', color: '#b00', fontSize: 13, marginLeft: 10, cursor: 'pointer', padding: '4px 8px', borderRadius: 3 }}
                          onClick={() => handleRemoved(item.id)}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          className="minimal-bag-btn"
                          style={{ border: '1px solid #222', background: 'none', color: '#222', fontSize: 13, marginLeft: 10, cursor: 'pointer', padding: '4px 12px', borderRadius: 3 }}
                          onClick={() => handleAdded(item, quantity)}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : null}
      </motion.section>


      <motion.section className={styles.our_fabrics}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
        viewport={{ once: true, amount: 0.2 }}>
          <img src="/images/fabrics.png" alt="Our Fabrics" />
          <div className={styles.our_fabrics_overlay}>
            <h2 className={styles.our_fabrics_title}>OUR FABRICS</h2>
            <p className={styles.our_fabrics_text}>
              All of our garments are manufactured in Toronto, Canada. We are uniquely able to mill and dye our own fabrics to the highest quality specifications required for each garment in the collection.
            </p>
          </div>
        </motion.section>
    </main>
  );
};

export default Home;
