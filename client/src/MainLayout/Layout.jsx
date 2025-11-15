import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../Components/User/NavBar';
import Footer from '../Components/User/Footer';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../Config/axiosInstance';
import { clearUserData, saveUserData } from '../store/slice/userSlice';
import {
  useState, useEffect

} from 'react';
const Layout = () => {
  const location = useLocation();
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (userData) {
      setLoading(false);
      return;
    }
    checkUser();
  }, [userData]);

  function checkUser() {
    axiosInstance.get('/user/check-user')
      .then((res) => {
        dispatch(saveUserData(res.data.data));
        setLoading(false);
      })
      .catch((err) => {
        dispatch(clearUserData());
        setLoading(false);
      });
  }


  const mainClasses = location.pathname === '/'
    ? 'min-h-[50vh] '
    : 'min-h-[50vh] pt-24';

  return (
    <div className='min-h-screen flex flex-col justify-between'>
      <NavBar />
      <main className={mainClasses}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
