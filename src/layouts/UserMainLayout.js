import { Outlet } from 'react-router-dom';
import Navbar from '../components/Header/Navbar';
import Footer from '../components/Footer/Footer';
import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { readUser } from '../services/crud';
import UserNavigationMenu from '../components/utilities/UserNavigationMenu';

function UserMainLayout(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    readUser(auth.currentUser?.uid)
      .then((snapshot) => {
        setUser(snapshot.val());
      })
      .catch((e) => console.log(e));
  }, []);
  return (
    <div className="themain">
      <Navbar />
      <div className="outlet_main">
        <section className="userprofile_container">
          <span>
            <img
              className="useravatar"
              src={
                user?.profile_url
                  ? user?.profile_url
                  : 'https://picsum.photos/100'
              }
              alt="useravatar"
            />
            <p className="welcomeUser">
              Welcome {user?.username && user?.username}!
            </p>
          </span>
          <div className="userNavMenu_container">
            <UserNavigationMenu />
          </div>
        </section>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default UserMainLayout;
