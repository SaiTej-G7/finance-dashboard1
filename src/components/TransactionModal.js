import { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import "./TransactionModal.css";

function TransactionModal({ closeModal, editData }) {

  const {
    addTransaction,
    updateTransaction,
    expenseCategories,
    incomeCategories
  } = useFinance();

  const [amount,setAmount] = useState("");
  const [type,setType] = useState("");
  const [category,setCategory] = useState("");
  const [subcategory,setSubcategory] = useState("");
  const [date,setDate] = useState("");
  const [paymentMethod,setPaymentMethod] = useState("");

  /* PREFILL DATA WHEN EDITING */

  useEffect(()=>{

    if(editData){

      setAmount(editData.amount);
      setType(editData.type);
      setCategory(editData.category);
      setSubcategory(editData.subcategory);
      setDate(editData.date);
      setPaymentMethod(editData.paymentMethod);

    }

  },[editData]);

  /* CATEGORY LIST */

  const categories =
  type === "expense"
  ? expenseCategories
  : incomeCategories;

  const selectedCategory =
  categories.find(c=>c.name===category);

  /* SUBMIT */

  const handleSubmit = (e)=>{

    e.preventDefault();

    const transaction = {

      id: editData?.id || Date.now().toString(),

      amount,
      type,
      category,
      subcategory,
      date,
      paymentMethod

    };

    if(editData){

      updateTransaction(transaction);

    }else{

      addTransaction(transaction);

    }

    closeModal();

  };

  return(

<div className="modal-overlay">

<div className="glass-modal">

<h3>
{editData ? "Edit Transaction" : "Add Transaction"}
</h3>

<form onSubmit={handleSubmit}>

{/* ROW 1 */}

<input
placeholder="Amount"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
required
/>

<select
value={type}
onChange={(e)=>{

setType(e.target.value);
setCategory("");
setSubcategory("");

}}
required
>

<option value="">Select Type</option>

<option value="expense">Expense</option>
<option value="income">Income</option>

</select>

{/* ROW 2 */}

<select
value={category}
onChange={(e)=>{

setCategory(e.target.value);
setSubcategory("");

}}
required
>

<option value="">Select Category</option>

{categories.map(c=>(

<option key={c.name} value={c.name}>
{c.name}
</option>

))}

</select>

<select
value={subcategory}
onChange={(e)=>setSubcategory(e.target.value)}
required
>

<option value="">Select Subcategory</option>

{selectedCategory?.subcategories.map(sub=>(

<option key={sub} value={sub}>
{sub}
</option>

))}

</select>

{/* ROW 3 */}

<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
required
/>

<select
value={paymentMethod}
onChange={(e)=>setPaymentMethod(e.target.value)}
required
>

<option value="">Select PaymentType</option>

<option value="UPI">UPI</option>
<option value="Cash">Cash</option>
<option value="Bank">Bank</option>
<option value="Card">Card</option>

</select>

<div className="form-actions">

<button type="submit">
Save
</button>

<button type="button" onClick={closeModal}>
Cancel
</button>

</div>

</form>

</div>

</div>

  );

}

export default TransactionModal;