import Products from './components/Products';
import Categories from './components/Categories';
import Customers from "./components/Customers";

function App() {
  return (
    <div>
      <h1>Electronics Store</h1>
      <Products />

      <Categories />

      <Customers />
    </div>
  );
}

export default App;