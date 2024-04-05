import React, { useCallback, useEffect, useState } from 'react'
import { getWorkerByOwner } from '../../utils/farmWorkChain';
import { Notification } from '../../components/utils/Notifications';
import Wallet from '../../components/Wallet';
import WorkerDashboard from './WorkerDashboard';
import CreateWorkerProfile from '../../components/worker/CreateWorkerProfile';
import Loader from '../../components/utils/Loader';
import Cover from '../../components/utils/Cover';
import { login } from '../../utils/auth';
import { Nav } from 'react-bootstrap';

const Worker = () => {

  const [worker, setWorker] = useState({})
  const [loading, setLoading] = useState(false);

  const isAuthenticated = window.auth.isAuthenticated;

  const fetchWorker = useCallback(async () => {
    try {
      setLoading(true);
      setWorker(
        await getWorkerByOwner().then(async (res) => {
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
    fetchWorker();
  } , []);

  return (
    <>
    <Notification />
    {isAuthenticated ? (
      !loading ? (
        worker?.name ? (
          <>
          <Nav className="justify-content-end pt-3 pb-5">
            <Nav.Item>
              <Wallet />
            </Nav.Item>
          </Nav>
          <main>
            <WorkerDashboard worker={worker} />
          </main>
          </>
        ) : (
          <CreateWorkerProfile
            fetchWorker={fetchWorker}
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

export default Worker