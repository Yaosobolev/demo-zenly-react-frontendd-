import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    name: "",
    password: "",
  });

  let navigate = useNavigate();

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    console.log(data);
  };

  // const apiUrl = "http://localhost:3000/api/v1/auth/login";
  const apiUrl = "https://map-back.onrender.com/api/v1/auth/login";

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        apiUrl,
        {
          name: data.name,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("response ", response);

      if (response.data.message === "Авторизация успешна") {
        console.log("Данные успешно обновлены");
        const userId = data.name;
        navigate(`/map/${userId}`);
      } else {
        if (response.data.message) {
          console.error("Ошибка при обновлении данных:", response.data.message);
        } else {
          console.error("Ошибка при обновлении данных:", response.data);
        }
      }
    } catch (error) {
      console.error(
        "Ошибка при отправке запроса:",
        error.response.data.message
      );
      alert(error.response.data.message);
    }
  };
  return (
    <form
      onSubmit={handleSignUp}
      className=" h-screen flex flex-col justify-center content-center flex-wrap  px-2"
    >
      <h1 className="text-4xl mb-2 ">Добро пожаловать</h1>
      <p className=" text-lg mb-10 text-center ">Авторизуйся</p>
      <div className="mb-4 space-y-5  ">
        <div className="">
          <label htmlFor="text" className="block mb-1 ">
            Name:
          </label>
          <input
            className=" w-full border border-gray-300 rounded px-2 py-1 bg-slate-100"
            type="text"
            placeholder="name"
            name="name"
            onChange={handleChange}
          />
        </div>
        <div className="">
          <label htmlFor="email" className="block mb-1 ">
            Password:
          </label>
          <input
            className="w-full border border-gray-300 rounded px-2 py-1 bg-slate-100"
            type="password"
            placeholder="password"
            name="password"
            onChange={handleChange}
          />
        </div>
      </div>
      <button
        type="submit"
        className="px-2 py-1 transition-all rounded bg-blue-500 hover:bg-blue-700 text-white text-lg"
      >
        Войти
      </button>
      <span className="text-center text-gray-400 text-opacity-50 text-sm">
        Не создан аккунт?{" "}
        <Link to={`/registration`} className="text-black font-bold ">
          Создай
        </Link>
      </span>
    </form>
  );
};

export default Login;
