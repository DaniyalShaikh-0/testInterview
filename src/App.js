import "./App.css";
import sectors from "./Sectors.json";
import React, { useState } from "react";
import { FaChevronDown, FaCheckSquare } from "react-icons/fa";
function App() {
  const getData = async () => {
    const resp = await fetch("http://localhost:8000/getUserData");
    const data = await resp.json();
    if (data?.name) {
      setUsername(data?.name);
    }
    if (data?.sectors) {
      setSectorData(
        sectorData?.map((sector, ind) => {
          const sector_ = data?.sectors?.indexOf(sector?.name);
          return {
            name: sector?.name,
            checked: sector_ ? true : false,
          };
        })
      );
    }
  };
  React.useEffect(() => {
    getData();
  }, []);

  const [showSectors, setShowSectors] = React.useState(false);
  const [sectorData, setSectorData] = React.useState(sectors?.sectors);
  const [isTermsCheck, setIsTermsCheck] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userName, setUsername] = useState("");
  const getSectorOptions = () => {
    const data = searchValue
      ? sectorData?.filter((sector) => sector?.name?.includes(searchValue))
      : sectorData;
    return data?.map((sector, ind) => {
      return (
        <li
          className='test__form__sectors_sector'
          onClick={() => {
            const sects = sectorData;
            const ix = sectorData?.indexOf(sector);
            sects[ix].checked = !sects[ix].checked;
            setSectorData([...sects]);
          }}
        >
          <p>{`${sector?.name}`}</p>
          {sector?.checked ? (
            <div className='checked'>
              <FaCheckSquare size={26} color={"dodgerblue"} />
            </div>
          ) : (
            <div className='square'></div>
          )}
        </li>
      );
    });
  };
  return (
    <div className='App'>
      <header className='test__header'>
        <p>Test Interview React</p>
      </header>
      <div className='test_form'>
        <p className='test_form_text'>
          Please enter your name and pick the Sectors you are currently involved
          in.
        </p>
        <div className='test__form__name'>
          <p>Your Name</p>
          <input
            spellCheck={false}
            type='text'
            placeholder='Name'
            value={userName}
            onInput={(e) => {
              setUsername(e.target.value);
            }}
            maxLength={50}
          ></input>
        </div>
        <div className='test__form__search'>
          <div
            className='test__form__search-dropdown'
            onClick={() => setShowSectors((sector) => !sector)}
          >
            <span>Select Sectors you are currently involved in.</span>
            <FaChevronDown
              className='test__form__search-dropdown-icon'
              style={{
                height: "30px",
                width: "30px",
                rotate: showSectors ? "z 180deg" : "",
              }}
            />
          </div>
          <div
            className={`test__form__search-list ${
              showSectors ? "test__form__search_anim" : ""
            }`}
            style={
              showSectors
                ? {
                    display: "block",
                    opacity: 1,
                    visibility: "visible",
                  }
                : {}
            }
          >
            <div className='test__form__search-searchbar'>
              <input
                spellCheck={false}
                type='text'
                placeholder='Search'
                value={searchValue}
                onInput={(e) => {
                  setSearchValue(e.target.value);
                }}
                maxLength={50}
              ></input>
            </div>
            <ul className='test__form__sectors'>{getSectorOptions()}</ul>
          </div>
        </div>
        {sectorData?.filter((sector) => sector?.checked)?.length && (
          <div className='test__form__sectors_selected'>
            <h3>Selected: </h3>
            &nbsp; [
            {sectorData
              ?.filter((sector) => sector?.checked)
              ?.map((sector, ind) => (
                <p>{`${sector?.name} ,`}</p>
              ))}
            &nbsp; ]
          </div>
        )}
        <div className='test__form__terms'>
          {isTermsCheck ? (
            <FaCheckSquare
              onClick={() => setIsTermsCheck(!isTermsCheck)}
              size={26}
              color={"dodgerblue"}
              style={{ cursor: "pointer" }}
              className='checked'
            />
          ) : (
            <div
              className='square'
              onClick={() => setIsTermsCheck(!isTermsCheck)}
            ></div>
          )}
          <h4>
            &nbsp;&nbsp; I agree to the <a href='/'>Term's and Condition</a>
          </h4>
        </div>
        <button
          className='test__form__button'
          type='button'
          disabled={
            !(
              sectorData?.filter((sector) => sector?.checked)?.length &&
              isTermsCheck &&
              userName
            )
          }
          onClick={async () => {
            await fetch("http://localhost:8000/saveData", {
              method: "POST",
              headers: {
                Accept: "*",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify({
                name: userName,
                sectors: sectorData?.filter((sector) => sector?.checked),
                isTermsCheck: isTermsCheck,
              }),
            });
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default App;
