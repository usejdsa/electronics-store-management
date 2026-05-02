import Products from './components/Products';
import Categories from './components/Categories';
import Customers from "./components/Customers";
import Orders from './components/Orders';
import OrderDetails from './components/OrderDetails';
import Suppliers from './components/Suppliers';
import PurchaseOrders from './components/PurchaseOrders';

function App() {
  return (
    <div>
      <h1>Electronics Store</h1>
      <Products />

      <Categories />

      <Customers />

      <Orders/>

      <OrderDetails/>

      <Suppliers />
      
      <PurchaseOrders />
    </div>
  );
}

export default App;