import React from 'react'
import "./axiosInstance"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home'
import { Toaster } from 'sonner'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CollectionPage from './pages/CollectionPage'
import ProductDetails from './components/Products/ProductDetails'
import Checkout from './components/Cart/Checkout'
import AdminLayout from './components/Admin/AdminLayout'
import AdminHomePage from './pages/AdminHomePage'
import UserManagement from './components/Admin/UserManagement'
import ProductManagement from './components/Admin/ProductManagement'
import EditProduct from './components/Admin/EditProduct'
import AddUser from './components/Admin/AddUser'
import AddProduct from './components/Admin/AddProduct'
import OrderManagement from './components/Admin/OrderManagement'
import ContactPage from './pages/ContactPage'
import ReclamationManagement from './components/Admin/ReclamationManagement'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import MyOrdersPage from './pages/MyOrdersPage'
import { Provider } from 'react-redux'
import store from './redux/store'
import ProtectedRoute from './components/Common/ProtectedRoute'
import ProfileManagement from './pages/ProfileManagement'
import OrderDetailsAdmin from './components/Admin/OrderDetailsAdmin'
import MaterialManagement from './components/Admin/MaterialManagement'
import AddMaterial from './components/Admin/AddMaterial'
import EditMaterial from './components/Admin/EditMaterial'
import BrandHistoryPage from './pages/BrandHistoryPage'
import DevisFormPage from './pages/DevisFormPage'
import CategoryManagement from './components/Admin/CategoryManagement'
import SubCategoryManagement from './components/Admin/SubCategoryManagement'
import EditCategory from './components/Admin/EditCategory'
import AddCategory from './components/Admin/AddCategory'
import AddSubCategory from './components/Admin/AddSubCategory'
import EditSubCategory from './components/Admin/EditSubCategory'
import DevisManagement from './components/Admin/DevisManagement'
import DevisDetails from './components/Admin/DevisDetails'
import ScrollToTop from './ScrollToTop'
import ConvertDevisForm from './components/Admin/ConvertDevisForm'
import Chatbot from './chatbot/Chatbot'
import ProductCustomization from './pages/ProductCustomization'
import CustomizationManagement from './components/Admin/CustomizationManagement'
import CustomizationDetails from './components/Admin/CustomizationDetails'
import ConvertCustomizationForm from './components/Admin/ConvertCustomizationForm'

const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter>
    <ScrollToTop />
    <Toaster position="top-right"/>
    <Routes>
      {/* user layout */}
      <Route path="/" element={<UserLayout/>}>
      <Route index element={<Home/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="profile" element={<Profile/>}/>
      <Route path="contact" element={<ContactPage/>}/>
      <Route path="history" element={<BrandHistoryPage/>}/>
      <Route path="devis" element={<DevisFormPage/>}/>
      <Route path="collections/:category" element={<CollectionPage/>}/>
      <Route path="product/:id" element={<ProductDetails/>}/>
      <Route path="checkout" element={<Checkout/>}/>
      <Route path="order-confirmation" element={<OrderConfirmationPage/>}/>
      <Route path="order/:id" element={<OrderDetailsPage/>}/>
      <Route path="my-orders" element={<MyOrdersPage/>}/>
      <Route path="profile-management" element={<ProfileManagement/>}/>
      <Route path="chatbot" element={<Chatbot/>}/>
      <Route path="personnalisation" element={<ProductCustomization/>}/>
      </Route>
      {/* admin layout */}
      <Route path="/admin" element={<ProtectedRoute roles={["admin", "artisan"]}> <AdminLayout/> </ProtectedRoute>}>
      <Route index element={<AdminHomePage/>}/>
      <Route path="users" element={<UserManagement/>}/>
      <Route path="users/add" element={<AddUser/>}/>
      <Route path="products" element={<ProductManagement/>}/>
      <Route path="products/add" element={<AddProduct/>}/>
      <Route path="products/:id/edit" element={<EditProduct/>}/>
      <Route path="categories" element={<CategoryManagement/>}/>
      <Route path="categories/add" element={<AddCategory/>}/>
      <Route path="categories/:id/edit" element={<EditCategory/>}/>
      <Route path="subcategories" element={<SubCategoryManagement/>}/>
      <Route path="subcategories/add" element={<AddSubCategory/>}/>
      <Route path="subcategories/:id/edit" element={<EditSubCategory/>}/>
      <Route path="orders" element={<OrderManagement/>}/>
      <Route path="orders/:orderId" element={<OrderDetailsAdmin/>}/>
      <Route path="reclamation" element={<ReclamationManagement/>}/>
      <Route path="materials" element={<MaterialManagement/>}/>
      <Route path="materials/add" element={<AddMaterial/>}/>
      <Route path="materials/:id/edit" element={<EditMaterial/>}/>
      <Route path="devis" element={<DevisManagement/>}/>
      <Route path="devis/:devisId" element={<DevisDetails/>}/>
      <Route path="/admin/devis/:devisId/convert" element={<ConvertDevisForm />} />
      <Route path="customization" element={<CustomizationManagement/>}/>
      <Route path="/admin/customization/:customizationId" element={<CustomizationDetails />} />
      <Route path="/admin/customization/:customizationId/convert" element={<ConvertCustomizationForm />} />

      </Route>
    </Routes>
    </BrowserRouter>
    </Provider>
  )
}

export default App
