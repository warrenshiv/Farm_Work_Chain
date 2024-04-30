import React, { useCallback, useEffect, useState } from "react";
import { createJobOffer, getManagerByOwner } from "../../utils/farmWorkChain";
import { Notification } from "../../components/utils/Notifications";
import Wallet from "../../components/Wallet";
import ManagerDashboard from "./ManagerDashboard";
import CreateManagerProfile from "../../components/manager/CreateManagerProfile";
import Loader from "../../components/utils/Loader";
import Cover from "../../components/utils/Cover";
import { login } from "../../utils/auth";
import { Nav } from "react-bootstrap";

const Manager = () => {
  const [manager, setManager] = useState({});
  const [loading, setLoading] = useState(false);

  const isAuthenticated = window.auth.isAuthenticated;
  
  const fetchManager = useCallback(async () => {
    try {
      setLoading(true);
      setManager(
        await getManagerByOwner().then(async (res) => {
          console.log(res);
          return res.Ok;
        })
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchManager();
  }, []);

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        !loading ? (
          manager?.name ? (
            <>
              <Nav className="justify-content-end pt-3 pb-5 mr-4">
                <Nav.Item>
                  <Wallet />
                </Nav.Item>
              </Nav>
              <main>
                <ManagerDashboard manager={manager} />
              </main>
            </>
          ) : (
            <CreateManagerProfile fetchManager={fetchManager} />
          )
        ) : (
          <Loader />
        )
      ) : (
        <Cover login={login} />
      )}
    </>
  );
};

export default Manager;
