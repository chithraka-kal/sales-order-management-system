import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { salesService } from '../services/salesService';
import { 
  resetCurrentOrder, 
  setCurrentOrder, 
  updateHeader, 
  setItems, 
  saveOrder 
} from '../redux/slices/salesSlice';
import { calculateLineItem } from '../utils/calculations';

export const useOrderForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentOrder } = useSelector((state) => state.sales);

  // Initialize Form (New vs Edit)
  useEffect(() => {
    if (id) {
      salesService.getById(id).then(res => {
        dispatch(setCurrentOrder(res.data));
      }).catch(() => toast.error("Failed to load order"));
    } else {
      dispatch(resetCurrentOrder());
    }
  }, [id, dispatch]);

  // Form Handlers
  const setCustomer = (cust) => {
    dispatch(updateHeader({ 
      customerId: cust.id, 
      customerDetails: cust 
    }));
  };

  const updateRow = (index, field, value, itemList) => {
    const newRows = [...currentOrder.items];
    let row = { ...newRows[index], [field]: value };

    // Auto-fill logic
    if (field === 'itemCode' || field === 'description') {
      const found = itemList.find(i => i.code === value || i.description === value);
      if (found) {
        row.itemCode = found.code;
        row.description = found.description;
        row.price = found.price;
      }
    }

    newRows[index] = calculateLineItem(row);
    dispatch(setItems(newRows));
  };

  const addRow = () => {
    dispatch(setItems([...currentOrder.items, { tempId: Date.now(), qty: 0, price: 0, taxRate: 0 }]));
  };

  const removeRow = (index) => {
    dispatch(setItems(currentOrder.items.filter((_, i) => i !== index)));
  };

  const submitOrder = async () => {
    if (!currentOrder.customerId) return toast.warning("Select Customer");
    
    // Dispatch the Async Thunk
    const result = await dispatch(saveOrder(currentOrder));
    
    if (saveOrder.fulfilled.match(result)) {
      toast.success(id ? "Order Updated!" : "Order Created!");
      setTimeout(() => navigate('/'), 1000);
    } else {
      toast.error("Save Failed");
    }
  };

  return {
    currentOrder,
    setCustomer,
    updateRow,
    addRow,
    removeRow,
    submitOrder,
    // Update invoice details directly
    setInvoiceData: (data) => dispatch(updateHeader(data))
  };
};