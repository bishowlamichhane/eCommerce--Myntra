import { Outlet } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import HeaderComponent from "../components/HeaderComponent";
import FetchItems from "../components/FetchItems";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
const App = () => {
  //ignore
  const fetchStatus = useSelector((store) => store.fetchStatus);

  return (
    <div>
      <HeaderComponent />
      <FetchItems />
      {fetchStatus.currentlyFetching ? <LoadingSpinner /> : <Outlet />}
      <FooterComponent />
    </div>
  );
};

export default App;
