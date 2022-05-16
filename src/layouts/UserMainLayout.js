import { Outlet } from 'react-router-dom';
import Navbar from '../components/Header/Navbar';
import Footer from '../components/Footer/Footer';

function UserMainLayout(props) {
  return (
    <div className="themain">
      <Navbar loggedUserID={props.loggedUserID} />
      <Outlet />
      <Footer />
    </div>
  );
}

export default UserMainLayout;
