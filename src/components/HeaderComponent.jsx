import { FaUserAstronaut } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { BsFillHandbagFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/useAuth";
import { doSignOut } from "../firebase/auth";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import styles from "./HeaderComponent.module.css"
import SideMenu from "./SideMenu";

const HeaderComponent = () => {
  const bag = useSelector((store) => store.bag) || [];
  const items = useSelector((store) => store.items);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDropDown, setIsDropDown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const { currentUser } = useAuth();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrollAmount = Math.abs(currentScrollY - lastScrollY.current);

      // Only trigger hide/show if scrolled more than 10px
      if (scrollAmount > 10) {
        setIsVisible(!scrollingDown);
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (currentUser) {
      const bagRef = collection(db, "users", currentUser.uid, "bag");
      unsubscribe = onSnapshot(bagRef, (snapshot) => {
        setBagCount(snapshot.size);
      }, (error) => {
        console.error("Error listening to bag changes:", error);
      });
    } else {
      setBagCount(0);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  const showItem = (id) => {
    navigate(`/item/${id}`);
    setShowSearch(false);
  };

  useEffect(() => {
    if (!search.trim()) {
      setFilteredItems([]);
      return;
    }

    const filtered = items.filter((item) =>
      item.item_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [search, items]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.search_button}`)
      ) {
        setShowSearch(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowResults(true);
  };

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => {
        const searchInput = document.querySelector(`.${styles.search_input}`);
        if (searchInput) searchInput.focus();
      }, 100);
    } else {
      setSearch("");
    }
  };

  return (
    <>
      <header className={`${styles.header} ${isVisible ? styles.visible : styles.hidden}`}>
        <button
          className={styles.hamburger_menu}
          onClick={() => setSideMenuOpen(true)}
          aria-label="Open menu"
        >
          &#9776;
        </button>
        <nav className={styles.nav_bar}>
          <a href="#" onClick={e => { e.preventDefault(); setSideMenuOpen(true); }}>Shop</a>
          <a href="#">About</a>
          <a href="#">Wholesale</a>
        </nav>

        <div className={styles.logo_container}>
          <Link to={"/"}>
            <h1>NOVA WEAR</h1>
          </Link>
        </div>

        <div className={styles.right_section}>
          <button className={styles.search_button} onClick={toggleSearch}>
            Search
          </button>
          <div className={styles.currency}>USD $</div>
          {currentUser ? (
            <div className={styles.account_section}>
              <button onClick={() => setIsDropDown(!isDropDown)}>Account</button>
              {isDropDown && (
                <div className={styles.profile_dropdown}>
                  <div>User Profile</div>
                  <div onClick={handleSignOut}>Sign Out</div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={styles.account_section}>
              <button>Account</button>
            </Link>
          )}
          <Link to="/bag" className={styles.cart_section}>
            Cart {bagCount > 0 && <span>({bagCount})</span>}
          </Link>
        </div>

        {showSearch && (
          <div className={styles.search_overlay} ref={searchContainerRef}>
            <div className={styles.search_container}>
              <input
                className={styles.search_input}
                placeholder="Search..."
                value={search}
                onChange={handleSearchChange}
                onFocus={() => setShowResults(true)}
              />
              <button className={styles.close_search} onClick={toggleSearch}>
                ✕
              </button>
            </div>
            {showResults && search && (
              <div className={styles.search_results}>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={styles.search_result_item}
                      onClick={() => showItem(item.id)}
                    >
                      <img src={`/${item.image}`} alt={item.item_name} />
                      <div className={styles.result_details}>
                        <p>{item.item_name}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.no_results}>No results found</div>
                )}
              </div>
            )}
          </div>
        )}
      </header>
      <SideMenu open={sideMenuOpen} onClose={() => setSideMenuOpen(false)} highlight="Shop" />
      <div className={styles.header_spacer} />
    </>
  );
};

export default HeaderComponent;
