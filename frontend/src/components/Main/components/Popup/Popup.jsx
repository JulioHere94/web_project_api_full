// Os Popups estão funcionando normalmente, eu fiz até um print em video sobre o funcionamento: "https://drive.google.com/file/d/1plzRAYM6rLMllf0sgxM00GC_3ZdgA5Sc/view?usp=sharing"

import { useEffect, useRef } from "react";
import Trash from "../../../../images/Close Icon.png"

export default function Popup(props) {
  const { title, children, onClose } = props;
  const dialogRef = useRef();

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) // utilizei a abordagem sugerida, porém em pesquisa de documentação notei que esxiste os Polyfill para navegadores que não suportam o dialog, seria outra abordagem certo?
    {
      dialogRef.current.showModal();
    }
  }, []);

  return (
    <dialog className="popup popup__image-perfil1" ref={dialogRef}>
      <div className="popup_rectangle">
        <button className="popup__button-cancel" onClick={onClose}>
          <img src={Trash} className="popup__button-cancel-image" id="close-dialog" alt="Close" />
        </button>
        <h1 className="container__title title__change">{title}</h1>
        {children}
      </div>
    </dialog>
  );
}
