import React, { useState } from "react";
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import locale from "date-fns/esm/locale/ru";

import "./App.css";
import "materialize-css/dist/css/materialize.min.css";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [state, setState] = useState({
    from: "Зав. кафедрой КБМОИС",
    to: "Начальнику учебного отдела",
    theme: "О переносе занятий",
    date: new Date(),
    fromName: "Влацкой И.В.",
    toName: "Зинюхиной Н.А.",
    footerWho: "Зав. кафедрой КБМОИС",
    footerWhoName: "И. В. Влацкая"
  });

  const [substitutingState, substitutingSetState] = useState({
    reason: "семейными обстоятельствами",
    post: "старшего преподавателя каф. КБМОИС",
    name: "Москалевой Татьяны Сергеевны",
    days: [
      {
        date: new Date(),
        type: "Лабораторная работа",
        discipline: "Криптографические методы защиты информации",
        group: "17КБ(с)РЗПО",
        class: 1,
        substitutesName: "Козлова Л.А."
      }
    ]
  });

  const handleChange = e => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value
    });
  };

  const handleChangeDate = date => {
    setState({
      ...state,
      date
    });
  };

  const RescheduleMemo = () => {
    return <p>RescheduleMemo</p>;
  };

  const handleSubstituteChange = e =>
    substitutingSetState({
      ...substitutingState,
      [e.target.name]: e.target.value
    });

  const handleSubstituteDayChange = (e, i) => {
    let newDays = [...substitutingState.days];
    newDays[i][e.target.name] = e.target.value;
    substitutingSetState({
      ...substitutingState,
      days: newDays
    });
  };

  const handleSubstituteDayDateChange = (date, i) => {
    let newDays = [...substitutingState.days];
    newDays[i].date = date;
    substitutingSetState({
      ...substitutingState,
      days: newDays
    });
  };

  const handleAddDayClick = () => {
    let newDays = [...substitutingState.days];
    newDays.push({
      date: new Date(),
      type: "Лабораторная работа",
      discipline: "",
      group: "",
      class: 1,
      substitutesName: ""
    });
    substitutingSetState({
      ...substitutingState,
      days: newDays
    });
  };

  const SubstitutingBody = () => {
    return (
      <div className="body">
        <div className="body__main">
          <span>В связи с</span>
          <input
            type="text"
            value={substitutingState.reason}
            onChange={handleSubstituteChange}
            name="reason"
          />
          <span>прошу осуществить замену занятий</span>
          <br />
          <input
            placeholder="должность"
            className="col s6"
            type="text"
            value={substitutingState.post}
            name="post"
            onChange={handleSubstituteChange}
          />
          <input
            placeholder="ФИО преподавателя"
            type="text"
            value={substitutingState.name}
            name="name"
            onChange={handleSubstituteChange}
          />
        </div>
        <div className="body__list">
          <ol>
            {substitutingState.days.map((item, i) => (
              <li key={i}>
                <DatePicker
                  selected={item.date}
                  locale={ru}
                  onChange={date => handleSubstituteDayDateChange(date, i)}
                  name="date"
                  dateFormat={"dd.MM.yyyy"}
                />
                <div className="body__list__row">
                  <select
                    name="type"
                    onChange={e => handleSubstituteDayChange(e, i)}
                    className="browser-default"
                  >
                    <option>Лабораторная работа</option>
                    <option>Практическое занятие</option>
                    <option>Лекционное занятие</option>
                  </select>
                  <span>по дисциплине</span>
                  <input
                    type="text"
                    name="discipline"
                    value={item.discipline}
                    onChange={e => handleSubstituteDayChange(e, i)}
                  ></input>
                </div>
                <div className="body__list__row">
                  <span>группа</span>
                  <input
                    type="text"
                    name="group"
                    value={item.group}
                    onChange={e => handleSubstituteDayChange(e, i)}
                  ></input>
                  {/*locale.localize.day(item.date.getDay())}*/}
                  <input
                    type="number"
                    name="class"
                    value={item.class}
                    onChange={e => handleSubstituteDayChange(e, i)}
                  ></input>
                  <p>пара</p>
                </div>
                <input
                  placeholder="Заменяющий преподаватель"
                  type="text"
                  name="substitutesName"
                  value={item.substitutesName}
                  onChange={e => handleSubstituteDayChange(e, i)}
                />
              </li>
            ))}
          </ol>
          <a
            class="btn-floating btn-small waves-effect waves-light"
            onClick={handleAddDayClick}
          >
            <i class="material-icons">add</i>
          </a>
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="header">
        <div>
          <p>СЛУЖЕБНАЯ ЗАПИСКА</p>
        </div>
        <div className="header__fields">
          <div className="header__fields__item">
            <p className="header__fields__item__title">Кому:</p>
            <input
              type="text"
              value={state.to}
              onChange={handleChange}
              name="to"
            />
            <input
              type="text"
              value={state.toName}
              onChange={handleChange}
              name="toName"
            />
          </div>
          <div className="header__fields__item">
            <p className="header__fields__item__title">От кого:</p>
            <input
              type="text"
              value={state.from}
              onChange={handleChange}
              name="from"
            />
            <input
              type="text"
              value={state.fromName}
              onChange={handleChange}
              name="fromName"
            />
          </div>
          <div className="header__fields__item">
            <p className="header__fields__item__title">Дата:</p>
            <DatePicker
              selected={state.date}
              locale={ru}
              onChange={handleChangeDate}
              name="date"
              dateFormat={"dd.MM.yyyy"}
            />
          </div>
          <div className="header__fields__item">
            <p className="header__fields__item__title">Тема:</p>
            <select
              name="theme"
              onChange={handleChange}
              className="browser-default header__select"
            >
              <option>О переносе занятий</option>
              <option>О замене преподавателя</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <div className="footer">
        <div>
          <div className="footer__inputs">
            <input
              type="text"
              value={state.footerWho}
              onChange={handleChange}
              name="footerWho"
            />
            <input
              type="text"
              value={state.footerWhoName}
              onChange={handleChange}
              name="footerWhoName"
            />
          </div>
          <a className="waves-effect waves-light btn">сохранить записку</a>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="wrapper">
        {renderHeader()}
        <div className="main">
          {state.theme === "О переносе занятий"
            ? RescheduleMemo()
            : SubstitutingBody()}
        </div>
        {renderFooter()}
      </div>
    </div>
  );
}

export default App;
