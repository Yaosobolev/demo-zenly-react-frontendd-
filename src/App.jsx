import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/login`);
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
