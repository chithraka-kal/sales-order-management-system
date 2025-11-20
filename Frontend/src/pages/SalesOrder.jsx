import React, { useEffect, useState } from "react";
import { useOrderForm } from "../hooks/useOrderForm"; // Uses the Hook Layer
import { LabelInput, LabelSelect, Button } from "../components/FormElements";
import { salesService } from "../services/salesService";
import { calculateGrandTotals } from "../utils/calculations";

export default function SalesOrder() {
  // 1. Use Custom Hook (Connects to Redux)
  const { 
    currentOrder, setCustomer, updateRow, addRow, removeRow, submitOrder, setInvoiceData 
  } = useOrderForm();

  // Local state for dropdown lists (static data)
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    salesService.getCustomers().then(res => setCustomers(res.data));
    salesService.getItems().then(res => setItems(res.data));
  }, []);

  const { totalExcl, totalTax, totalIncl } = calculateGrandTotals(currentOrder.items || []);

  return (
    <div className="p-card max-w-6xl mx-auto bg-white shadow-lg mt-10 border border-border print:shadow-none print:border-none">
      
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <h1 className="text-heading text-gray-800">
          {currentOrder.id ? "Edit Sales Order" : "New Sales Order"}
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => window.print()} variant="secondary" className="print:hidden">Print</Button>
          <Button onClick={submitOrder} variant="primary" className="print:hidden">
            {currentOrder.id ? "Update Order" : "Save Order"}
          </Button>
        </div>
      </div>

      {/* Header Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="space-y-3 border border-border p-4 rounded bg-surface print:bg-white print:border-none">
          <LabelSelect 
            label="Customer Name" 
            value={currentOrder.customerId}
            onChange={(e) => {
              const cust = customers.find(c => c.id == e.target.value);
              if(cust) setCustomer(cust);
            }}
            options={customers.map(c => ({ value: c.id, label: c.name }))}
          />
          {/* FIX: Removed readOnly - Address is now editable [cite: 91] */}
          <LabelInput 
            label="Address 1" 
            value={currentOrder.customerDetails.address1 || ''} 
            onChange={(e) => setCustomer({...currentOrder.customerDetails, address1: e.target.value})}
          />
          <LabelInput 
            label="Address 2" 
            value={currentOrder.customerDetails.address2 || ''} 
            onChange={(e) => setCustomer({...currentOrder.customerDetails, address2: e.target.value})}
          />
          <LabelInput 
            label="City" 
            value={currentOrder.customerDetails.city || ''} 
            onChange={(e) => setCustomer({...currentOrder.customerDetails, city: e.target.value})}
          />
        </div>

        <div className="space-y-3 border border-border p-4 rounded bg-surface print:bg-white print:border-none">
          <LabelInput label="Invoice No" value={currentOrder.invoiceNo} readOnly />
          <LabelInput 
            label="Invoice Date" type="date" 
            value={currentOrder.invoiceDate} 
            onChange={(e) => setInvoiceData({ invoiceDate: e.target.value })} 
          />
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse border border-border text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border border-border p-2 w-24">Code</th>
              <th className="border border-border p-2 w-48">Description</th>
              <th className="border border-border p-2">Note</th>
              <th className="border border-border p-2 w-16">Qty</th>
              <th className="border border-border p-2 w-24">Price</th>
              <th className="border border-border p-2 w-16">Tax %</th>
              <th className="border border-border p-2 bg-gray-100">Total</th>
              <th className="border border-border p-2 w-10 print:hidden"></th>
            </tr>
          </thead>
          <tbody>
            {(currentOrder.items || []).map((row, index) => (
              <tr key={row.tempId || index}>
                <td className="border p-1">
                   <select className="w-full p-1" value={row.itemCode} onChange={(e) => updateRow(index, 'itemCode', e.target.value, items)}>
                     <option value="">Select</option>
                     {items.map(i => <option key={i.code} value={i.code}>{i.code}</option>)}
                   </select>
                </td>
                <td className="border p-1">
                   <select className="w-full p-1" value={row.description} onChange={(e) => updateRow(index, 'description', e.target.value, items)}>
                     <option value="">Select</option>
                     {items.map(i => <option key={i.code} value={i.description}>{i.description}</option>)}
                   </select>
                </td>
                <td className="border p-1"><input className="w-full p-1" value={row.note || ''} onChange={(e) => updateRow(index, 'note', e.target.value, items)} /></td>
                <td className="border p-1"><input type="number" className="w-full p-1 text-right" value={row.qty} onChange={(e) => updateRow(index, 'qty', e.target.value, items)} /></td>
                <td className="border p-1"><input type="number" className="w-full p-1 text-right" value={row.price} readOnly /></td>
                <td className="border p-1"><input type="number" className="w-full p-1 text-right" value={row.taxRate} onChange={(e) => updateRow(index, 'taxRate', e.target.value, items)} /></td>
                <td className="border p-1 text-right font-bold">{ (row.inclAmount || 0).toFixed(2) }</td>
                <td className="border p-1 text-center print:hidden">
                  <Button onClick={() => removeRow(index)} variant="danger" className="px-2 py-0">X</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button onClick={addRow} variant="success" className="mt-2 print:hidden">+ Add Item</Button>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <div className="w-64 border p-4 bg-surface rounded space-y-2 print:border-none">
          <div className="flex justify-between"><span>Total Excl:</span> <span>{totalExcl.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Total Tax:</span> <span>{totalTax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total Incl:</span> <span>{totalIncl.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}