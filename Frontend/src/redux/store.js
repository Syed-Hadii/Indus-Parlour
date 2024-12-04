import { configureStore } from "@reduxjs/toolkit";
// Product dropdown Slcies
import categoriesReducer from "./slices/ProductSlices/categoriesSlice";
import brandsReducer from "./slices/ProductSlices/brandSlice";
import unitsReducer from "./slices/ProductSlices/unitsSlice";
import productsReducer from "./slices/ProductSlices/newProductSlice";
import variationsReducer from "./slices/ProductSlices/variationSlice";
// Service Dropdown Slices
import serviceCategoryReducer from "./slices/ServiceSlices/serviceCategorySlice";
import newServiceReducer from "./slices/ServiceSlices/newServiceSlice";
// Other Link  Slices
import packageReducer from "./slices/packageSlice";
import bookingReducer from "./slices/bookingSlice";
import regularBookingReducer from "./slices/regularBooking_Slice";
import customerReducer from "./slices/customerSlice";
import purchaseReducer from "./slices/purchaseSlice";
import stockReducer from "./slices/stockSlice";
import expenseReducer from "./slices/expenseSlice";
import staffReducer from "./slices/staffSlice";

const store = configureStore({
  reducer: {
    // Product dropdown Reducers
    categories: categoriesReducer,
    brands: brandsReducer,
    units: unitsReducer,
    products: productsReducer,
    variations: variationsReducer,
    // Service dropdown Reducers
    service_categories: serviceCategoryReducer,
    services: newServiceReducer,
    // other Links Reducer
    packages: packageReducer,
    bookings: bookingReducer,
    regularBookings: regularBookingReducer,
    customers: customerReducer,
    purchases: purchaseReducer,
    stocks: stockReducer,
    expenses: expenseReducer,
    staffs: staffReducer,
  },
});
export default store;
