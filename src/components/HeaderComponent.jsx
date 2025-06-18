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
const HeaderComponent = () => {
  const bag = useSelector((store) => store.bag) || [];
  const items = useSelector((store) => store.items);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDropDown, setIsDropDown] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const { currentUser } = useAuth();

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
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowResults(false);
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

  return (
    <header className={styles.header}>
      <div className={styles.logo_container}>
        <Link to={"/"}>
          <h1>Easy BUY</h1>
        </Link>
      </div>

      <nav className="nav_bar">
        <a href="#">Shop</a>
        <a href="#">About</a>
        <a href="#">Wholesale</a>
        
      </nav>
      <div className="search_bar" ref={searchContainerRef}>
        <span className="material-symbols-outlined search_icon">search</span>
        <input
          className="search_input"
          placeholder="Search for products, brands and more"
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setShowResults(true)}
        />
        {showResults && search && (
          <div className="search_results_container">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="search_result_item"
                  onClick={() => showItem(item.id)}
                >
                  <img
                    src={`/${item.image}`}
                    alt={item.item_name}
                    className="search_result_image"
                  />
                  <div className="search_result_details">
                    <p className="search_result_name">{item.item_name}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="search_result_item">
                <p className="search_result_name">No results found</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="action_bar">
        {currentUser ? (
          <div
            className="action_container"
            onClick={() => setIsDropDown((prev) => !prev)}
          >
            <FaUserAstronaut />
            <span className="action_name">Profile</span>
            {isDropDown && (
              <div className="profile-dropdown">
                <div>User Profile</div>
                <div onClick={handleSignOut}>Sign Out</div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="action_container">
            <FaUserAstronaut />
            <span className="action_name">Login</span>
          </Link>
        )}

        <div className="action_container">
          <FaRegHeart />
          <span className="action_name">Wishlist</span>
        </div>

        <Link to={"/bag"} className="action_container">
          <BsFillHandbagFill />
          <span className="action_name">Bag</span>
          {bagCount > 0 && <span className="bag-item-count">{bagCount}</span>}
        </Link>
      </div>
    </header>
  );
};

export default HeaderComponent;
