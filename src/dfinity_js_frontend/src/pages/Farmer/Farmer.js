import React, { useCallback, useEffect, useState } from 'react'
import { createJobOffer, getFarmerByOwner } from '../../utils/farmWorkChain';
import { Notification } from '../../components/utils/Notifications';
import Wallet from '../../components/Wallet';
import FarmerDashboard from './FarmerDashboard';
import CreateFarmerProfile from '../../components/farmer/CreateFarmerProfile';
import Loader from '../../components/utils/Loader';
import Cover from '../../components/utils/Cover';
import { login } from '../../utils/auth';
import { Nav } from 'react-bootstrap';


const Farmer = () => {

  const [farmer, setFarmer] = useState({})
  const [loading, setLoading] = useState(false);

  const isAuthenticated = window.auth.isAuthenticated;



  const fetchFarmer = useCallback(async () => {
    try {
      setLoading(true);
      setFarmer(
        await getFarmerByOwner().then(async (res) => {
          console.log(res);
          return res.Ok;
        })
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  );

  useEffect(() => {
    fetchFarmer();
  }, []);

  return (
    <>

      <Notification />
      {isAuthenticated ? (
        !loading ? (
          farmer?.name ? (
            <>
              <Nav className="justify-content-end pt-3 pb-5 mr-4">
                <Nav.Item>
                  <Wallet />
                </Nav.Item>
              </Nav>
              <main>
                <FarmerDashboard farmer={farmer} />
              </main>
            </>
          ) : (
            <CreateFarmerProfile
              fetchFarmer={fetchFarmer}
            />
          )
        ) : (
          <Loader />
        )
      ) : (
        <Cover login={login} />
      )}
    </>
  )
}

export default Farmer