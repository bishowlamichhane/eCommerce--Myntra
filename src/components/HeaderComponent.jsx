import { FaUserAstronaut } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { BsFillHandbagFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";

const HeaderComponent = () => {
  const bag = useSelector((store) => store.bag);
  const items = useSelector((store) => store.items);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

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

  return (
    <header>
      <div className="logo_container">
        <Link to={"/"}>
          <img
            className="myntra_home"
            src="/images/myntra_logo.webp"
            alt="Myntra Home"
          />
        </Link>
      </div>

      <nav className="nav_bar">
        <a href="#">Men</a>
        <a href="#">Women</a>
        <a href="#">Kids</a>
        <a href="#">Home & Living</a>
        <a href="#">Beauty</a>
        <a href="#">
          Studio <sup>New</sup>
        </a>
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
        <div className="action_container">
          <FaUserAstronaut />
          <span className="action_name">Profile</span>
        </div>

        <div className="action_container">
          <FaRegHeart />
          <span className="action_name">Wishlist</span>
        </div>

        <Link to={"/bag"} className="action_container">
          <BsFillHandbagFill />
          <span className="action_name">Bag</span>
          <span className="bag-item-count">{bag.length}</span>
        </Link>
      </div>
    </header>
  );
};

export default HeaderComponent;
