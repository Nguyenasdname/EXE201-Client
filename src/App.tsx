import AppRouter from "./routes/AppRouter";
import { ToastContainer } from 'react-toastify';

export default function App() {

  return (
    <>
      <AppRouter />
      <ToastContainer
        position="top-right"    
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
        />
    </>
  );
}
