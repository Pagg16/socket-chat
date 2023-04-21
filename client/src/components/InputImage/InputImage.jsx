import React from "react";

function InputImage({ pictureInput, setPopup, setInputImage }) {
  function isImage(file) {
    const type = file.type.split("/", 1)[0];
    if (type === "image") {
      return true;
    }

    setPopup((state) => ({
      ...state,
      text: "file must be an image",
      isVisible: true,
    }));

    return false;
  }

  return (
    <input
      ref={pictureInput}
      className="login__input"
      id="picture"
      name="picture"
      placeholder="picture"
      type="file"
      onChange={(e) => {
        if (isImage(e.target.files[0])) {
          setInputImage((state) => ({
            ...state,
            pictureFile: e.target.files[0],
            pictureLinkFile: URL.createObjectURL(e.target.files[0]),
          }));
        } else {
          const defaultText = new File(["Файл не выбран"], "Файл не выбран");
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(defaultText);
          pictureInput.current.files = dataTransfer.files;
        }
      }}
    />
  );
}

export default InputImage;
