import { useState } from "react";
import { useParams } from "react-router-dom";
const Menu = () => {
  const [isOpen, setIsOpen] = useState(1);
  const { mapId } = useParams();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className=" ">
      <button
        className={`burger-menu-btn cursor-pointer absolute top-5 right-5 z-50 transition-all duration-300  ${
          isOpen ? "rotate-90" : ""
        }`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="burger-menu-line block w-6 h-1 bg-gray-700 mb-1"></span>
        <span className="burger-menu-line block w-6 h-1 bg-gray-700 mb-1"></span>
        <span className="burger-menu-line block w-6 h-1 bg-gray-700"></span>
      </button>
      <div
        className={`burger-menu fixed top-0 right-0 bottom-0 bg-white w-64 p-4 z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-800 mb-1">
            Имя:
          </label>
          <input
            type="text"
            id="name"
            disabled
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={mapId}
          />
        </div>
        <div className="mb-4">
          <i>s</i>
          <button>Друзья</button>
        </div>

        <button className="burger-menu-item block py-2 text-gray-800">
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default Menu;
