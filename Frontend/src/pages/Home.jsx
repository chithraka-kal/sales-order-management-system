import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/slices/salesSlice";
import { OrdersTable } from "../components/OrdersTable";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const { list: orders, status, error } = useSelector((state) => state.sales);

  useEffect(() => {
    
    dispatch(fetchOrders());
  }, [dispatch]);

  // Loading / Error States
  if (status === 'loading') return <div className="p-8 text-gray-500">Loading orders...</div>;
  if (status === 'failed') return <div className="p-8 text-red-500">Error loading data: {error}</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales Orders</h1>
        <Link to="/order" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-md">
          + Add New Order
        </Link>
      </div>

      
      <OrdersTable orders={orders || []} onRowClick={(id) => navigate(`/order/${id}`)} />
    </div>
  );
}