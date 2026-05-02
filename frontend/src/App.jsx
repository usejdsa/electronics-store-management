import Products from './components/Products';
import Categories from './components/Categories';
import Customers from "./components/Customers";
import Orders from './components/Orders';
import OrderDetails from './components/OrderDetails';

function App() {
  return (
    <div>
      <h1>Electronics Store</h1>
      <Products />

      <Categories />

      <Customers />

      <Orders/>

      <OrderDetails/>
    </div>
  );
}

export default App;