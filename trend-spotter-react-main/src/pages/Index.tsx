
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import TopUsers from './TopUsers';
import { initializeData } from '@/services/cache';

const Index = () => {
  useEffect(() => {
    // Initialize data when the app loads
    initializeData();
  }, []);

  return (
    <Layout>
      <TopUsers />
    </Layout>
  );
};

export default Index;
