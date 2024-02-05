import { useState, useEffect } from "react";
import axios from "axios";
import L, { map } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Menu from "../components/Menu";
import { useParams } from "react-router-dom";

const MapComponent = () => {
  const markerIcon = L.icon({
    iconUrl: "/marker.png",
    iconSize: [35, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [userLatitude, setUserLatitude] = useState(0);
  const [userLongitude, setUserLongitude] = useState(0);
  const [status, setStatus] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const userLocation = [userLatitude, userLongitude];
  const { mapId } = useParams();

  const apiUrl = "https://map-back.onrender.com/api/v1/markers";
  const apiUrlAth = "https://map-back.onrender.com/api/v1/auth";
  // const apiUrl = "http://localhost:3000/api/v1/markers";
  // const apiUrlAth = "http://localhost:3000/api/v1/auth";

  // получение собственного гео
  const getLocation = () => {
    if (navigator.geolocation) {
      // Поддержка геолокации доступна

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLatitude(position.coords.latitude);
          setUserLongitude(position.coords.longitude);
          const { longitude, latitude } = position.coords;
          console.log(latitude);

          console.log("Ваши координаты:", latitude, longitude);

          // Здесь вы можете выполнить дополнительные действия с полученными координатами
        },
        (error) => {
          console.error("Ошибка при получении координат:", error.message);
        }
      );
    } else {
      console.error("Геолокация не поддерживается в вашем браузере");
    }
  };

  // put http://localhost:3000/api/v1/markers/set-marker
  // get http://localhost:3000/api/v1/markers/search-marker

  // const getMarkerById = () => {};

  // отправка гео
  const updateData = async () => {
    if (userLatitude !== 0 || userLongitude !== 0) {
      try {
        console.log(dataUser.marker_id === null);
        console.log(dataUser);
        if (dataUser.marker_id === null) {
          // установка координаты в бд координат
          const response = await axios.post(apiUrl, {
            latitude: userLatitude,
            longitude: userLongitude,
          });

          //поиск id координаты
          const dbResponse = await axios.get(`${apiUrl}/search-marker-id`, {
            params: {
              latitude: userLatitude,
              longitude: userLongitude,
            },
          });
          // установка координаты к пользователю
          const addMarker = await axios.put(`${apiUrl}/set-marker`, {
            id: dbResponse.data.result,
            name: mapId,
          });
        }

        const currentDbResponses = await axios.get(
          `${apiUrl}/search-marker-coor`,
          {
            params: {
              id: dataUser.marker_id,
            },
          }
        );
        console.log(dataUser.marker_id);

        // const dbCoorUser = await axios.get(`${apiUrl}/search-marker-coor`, {
        //   params: {
        //     latitude: userLatitude,
        //     longitude: userLongitude,
        //   },
        // });
        // Сравнить id метки у пользователя с действующей
        if (
          Number(currentDbResponses.data.result.latitude === userLatitude) &&
          Number(currentDbResponses.data.result.longitude === userLongitude)
        ) {
          return;
        } else {
          // установка координаты в бд координат

          const response = await axios.post(apiUrl, {
            latitude: userLatitude,
            longitude: userLongitude,
          });

          //поиск id координаты
          const dbResponse = await axios.get(`${apiUrl}/search-marker-id`, {
            params: {
              latitude: userLatitude,
              longitude: userLongitude,
            },
          });

          // установка координаты к пользователю
          const addMarker = await axios.put(`${apiUrl}/set-marker`, {
            id: dbResponse.data.result,
            name: mapId,
          });
        }

        // const dbResponse = await axios.get(`${apiUrl}/search-marker`, {
        //   params: {
        //     latitude: userLatitude,
        //     longitude: userLongitude,
        //   },
        // });

        // const addMarker = await axios.put(`${apiUrl}/set-marker`, {
        //   id: dbResponse.data.result,
        //   name: mapId,
        // });

        // if (dbResponse && dbResponse.data && dbResponse.data.length > 0) {
        //   // Проверяем, есть ли хотя бы один объект с координатами из базы данных, совпадающий с координатами пользователя
        //   const coordinatesMatch = dbResponse.data.some((item) => {
        //     return (
        //       item.latitude === userLatitude && item.longitude === userLongitude
        //     );
        //   });
        //   console.log("coordinatesMatch " + coordinatesMatch);

        //   if (coordinatesMatch) {
        //     console.log(
        //       "Координаты пользователя совпадают с координатами из базы данных"
        //     );
        //     return; // Прерываем выполнение функции
        //   }
        // }

        // for (let i = 0; i < dbResponse.data.length; i++) {
        //   const item = dbResponse.data[i];
        //   console.log(Number(item.latitude) === userLatitude); // Выводим каждый элемент в консоль для отладки

        //   // Сравниваем координаты из базы данных с координатами пользователя
        //   if (
        //     Number(item.latitude) === userLatitude &&
        //     Number(item.longitude) === userLongitude
        //   ) {
        //     console.log(
        //       "Координаты пользователя совпадают с координатами из базы данных"
        //     );
        //     return; // Прерываем выполнение функции
        //   }
        //   console.log();
        // }

        // const response = await axios.post(apiUrl, {
        //   latitude: userLatitude,
        //   longitude: userLongitude,
        // });

        // if (response.data === "Marker create") {
        //   console.log("Данные успешно обновлены");
        // } else {
        //   console.error("Ошибка при обновлении данных:", response.data.message);
        // }
      } catch (error) {
        console.error("Ошибка при отправке запроса:", error.message);
      }
    }
  };

  // получение гео
  const getData = () => {
    axios
      .get(`${apiUrl}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  // получение гео пользователей
  const getUsers = () => {
    axios
      .get(`${apiUrl}/users`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // получение данных о пользователи

  const getDataUser = async () => {
    const result = await axios.get(`${apiUrlAth}/search-user`, {
      params: {
        name: mapId,
      },
    });

    setDataUser(result.data.user);
  };

  // при зашрузки получение гео
  useEffect(() => {
    const intervalId = setInterval(() => {
      getLocation();
    }, 5000); // 2000 миллисекунд = 2 секунды
    getDataUser();

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []);

  // отправка гео после получения личного гео
  useEffect(() => {
    updateData();
    getData();
    getUsers();
    setStatus(true);
  }, [userLongitude, userLatitude]);

  //получение всех гео после отправки гео
  // useEffect(() => {
  //   getData();
  //   setStatus(false);
  // }, [status]);

  return (
    userLocation[0] !== 0 && (
      <>
        <div className=" relative z-0">
          <MapContainer
            center={userLocation}
            zoom={15}
            style={{ height: "100vh", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {user && user.length > 0 ? (
              user.map((point, index) => (
                <Marker
                  key={index}
                  position={[point.latitude, point.longitude]}
                  icon={markerIcon}
                >
                  <Popup>{mapId}</Popup>
                </Marker>
              ))
            ) : (
              <Marker position={userLocation} icon={markerIcon}>
                <Popup>это ты</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        <Menu />
      </>
    )
  );
};

export default MapComponent;
