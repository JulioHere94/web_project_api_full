import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Main from "../components/Main/Main";
import Footer from "../components/Footer/Footer";
import { api } from "../utils/api";
import { register, login, validateToken } from "../utils/auth";
import CurrentUserContext from "../contexts/CurrentUserContext";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .getUserInfo()
        .then((userData) => {
          setCurrentUser(userData);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          console.error("Erro ao buscar usuário:", err);
          localStorage.removeItem("token");
        });

      api
        .getInitialCards()
        .then((cardsData) => {
          setCards(cardsData);
        })
        .catch((err) => console.error("Erro ao buscar os cartões:", err));
    }
  }, []);

  function handleOpenPopup(popupData) {
    setPopup(popupData);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  const handleUpdateUser = (data) => {
    api
      .updateUserInfo(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  };

  const handleUpdateAvatar = (data) => {
    api
      .updateUserAvatar(data.avatar)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        handleClosePopup();
      })
      .catch((error) => console.error("Erro ao atualizar o avatar:", error));
  };

  const handleCardLike = async (card) => {
    const isLiked = (card.likes || []).includes(currentUser?._id);
    try {
      const newCard = await api.toggleLike(card._id, !isLiked);
      newCard.isLiked = !isLiked;
      if (newCard.likes === undefined) {
        newCard.likes = newCard.isLiked
          ? [...(card.likes || []), currentUser?._id]
          : (card.likes || []).filter((id) => id !== currentUser?._id);
      }
      setCards((state) =>
        state.map((currentCard) =>
          currentCard._id === card._id ? newCard : currentCard
        )
      );
    } catch (error) {
      console.error("Erro ao curtir/descurtir o cartão:", error);
    }
  };

  const handleCardDelete = async (card) => {
    try {
      await api.deleteCard(card._id);
      setCards((state) =>
        state.filter((currentCard) => currentCard._id !== card._id)
      );
    } catch (error) {
      console.error("Erro ao excluir o cartão:", error);
    }
  };

  const handleAddCard = async (newCardData) => {
    try {
      // Usando o método correto de addCard
      const newCard = await api.addCard(newCardData);
      setCards((prevCards) => [newCard, ...prevCards]); // Atualiza o estado com o novo card
    } catch (error) {
      console.error("Erro ao adicionar novo cartão:", error);
      // Adicionando feedback para o usuário
      alert("Ocorreu um erro ao adicionar o cartão. Tente novamente.");
    }
  };

  const handleRegister = async (email, password) => {
    try {
      await register(email, password);
      alert("Registro bem-sucedido! Faça login para continuar.");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert("Erro ao registrar. Tente novamente.");
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      const userData = await validateToken(data.token);
      setCurrentUser(userData.data);
      setIsLoggedIn(true);
      alert("Login bem-sucedido!");
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      alert("Erro ao autenticar. Verifique suas credenciais.");
    }
  };

  const handleLogout = () => {
    // Limpa os dados do usuário e atualiza o estado
    setIsLoggedIn(false);
    setCurrentUser(null);

    // Redireciona para a tela de login
    navigate("/signin");
  };

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, handleUpdateUser, handleUpdateAvatar }}
    >
      <div className="page">
        <Header
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
          email={currentUser?.email} // Fallback para evitar valores indefinidos
        />
        {isLoggedIn ? (
          <Main
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            onAddCard={handleAddCard}
            onOpenPopup={handleOpenPopup}
            onClosePopup={handleClosePopup}
            popup={popup}
          />
        ) : (
          <p>Faça login ou registre-se para acessar o conteúdo.</p>
        )}
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
