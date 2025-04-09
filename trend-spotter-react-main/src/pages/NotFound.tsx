
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from '@/components/Layout';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-analytics-purple mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <Link 
          to="/" 
          className="bg-analytics-blue hover:bg-analytics-blue/80 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
