import HomeItem from "../components/HomeItem";
import { useSelector } from "react-redux";
import { PiNetworkXLight } from "react-icons/pi";

const Home = () => {
  const items = useSelector((store) => store.items);

  return (
    <main>
      {
        items.length>0?  <div className="items-container">
        {items.map((item) => (
          <HomeItem item={item} key={item.id} />
        ))}
      </div>  :
      <div className="network-error">
        <span><PiNetworkXLight/></span>
         <p> Unable to connect to the internet</p>
      </div>
      }
     
    </main>
  );
};

export default Home;
