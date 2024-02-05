import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Перенаправление на /login при заходе на сайт
    navigate("/login");
  }, []);
  return (
    <>
      <div className="w-full ">
        <Outlet />
      </div>
    </>
  );
}

export default App;
