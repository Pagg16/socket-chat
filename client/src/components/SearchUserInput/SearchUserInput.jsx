import React, { useEffect, useRef, useState } from "react";
import { allUsers } from "../../api/api";
import ButtonLoader from "../ButtonLoader/ButtonLoader";
import searchIcon from "../../images/search.png";

import "./searchUsersInput.css";

function SearchUsersInput({
  isOpenSerch,
  setSearchUsers,
  inputSearch,
  setInputSearch,
}) {
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (inputSearch) {
      if (!isLoadingSearch) setIsLoadingSearch(true);
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        allUsers(inputSearch)
          .then((res) => {
            setSearchUsers(res.data);
          })
          .catch((e) => console.log(e))
          .finally(() => setIsLoadingSearch(false));
      }, 1000);
    }
  }, [inputSearch]);

  useEffect(() => {
    setInputSearch("");
    setSearchUsers([]);
  }, [isOpenSerch]);

  return (
    <div className="searchUsersInput__input-container">
      <input
        type="text"
        className="searchUsersInput__input"
        placeholder="User name or Email"
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
      />
      {isLoadingSearch ? (
        <ButtonLoader addClass={"searchUsersInput__loader"} />
      ) : (
        <img
          className="searchUsersInput__search-icon"
          alt="search-icon"
          src={searchIcon}
        />
      )}
    </div>
  );
}

export default SearchUsersInput;
