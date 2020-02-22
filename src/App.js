import React, { useState } from "react";
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { generateDocFile } from "./generateDoc";

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
    reason: "",
    post: "",
    name: "",
    days: [
      {
        date: new Date(),
        type: "Лабораторная работа",
        discipline: "",
        group: "",
        class: 1,
        substitutesName: "Козлова Л.А."
      }
    ]
  });

  const [rescheduleState, rescheduleSetState] = useState({
    rescheduleReason: "",
    reschedulePost: "",
    rescheduleName: "",
    rescheduleHeaderDays: [new Date()],
    rescheduleMainComponents: [
      {
        type: "Лабораторная работа",
        discipline: "",
        group: "",
        date: new Date(),
        newDate: new Date(),
        class: 1,
        newClass: 1,
        room: ""
      }
    ]
  });

  const handleRescheduleHeaderDaysAdd = () => {
    const headerDays = [...rescheduleState.rescheduleHeaderDays];
    headerDays.push(new Date());
    rescheduleSetState({
      ...rescheduleState,
      rescheduleHeaderDays: headerDays
    });
  };

  const handleRescheduleHeaderDaysChange = (date, i) => {
    const headerDays = [...rescheduleState.rescheduleHeaderDays];
    headerDays[i] = date;
    rescheduleSetState({
      ...rescheduleState,
      rescheduleHeaderDays: headerDays
    });
  };

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

  const handleChangeMainRescheduleInputs = (e, i) => {
    const value = e.target.value;
    const component = [...rescheduleState.rescheduleMainComponents];
    component[i][e.target.name] = value;
    rescheduleSetState({
      ...rescheduleState,
      rescheduleMainComponents: component
    });
  };

  const handleChangeRescheduleInputs = e => {
    const value = e.target.value;
    rescheduleSetState({
      ...rescheduleState,
      [e.target.name]: value
    });
  };

  const handleRescheduleMainComponentsAdd = () => {
    const components = [...rescheduleState.rescheduleMainComponents];
    components.push({
      type: "Лабораторная работа",
      discipline: "",
      group: "",
      date: new Date(),
      newDate: new Date(),
      class: 1,
      newClass: 1,
      room: ""
    });
    rescheduleSetState({
      ...rescheduleState,
      rescheduleMainComponents: components
    });
  };

  const handleRescheduleMainComponentsDateChange = (date, index, name) => {
    const mainComponentDate = [...rescheduleState.rescheduleMainComponents];
    mainComponentDate[index][name] = date;
    rescheduleSetState({
      ...rescheduleState,
      rescheduleMainComponents: mainComponentDate
    });
  };

  const RescheduleMemo = () => {
    return (
      <div className="reschedule__wrapper">
        <div className="reschedule__header">
          <p>В связи с</p>
          <input
            placeholder="укажите причину"
            name="rescheduleReason"
            type="text"
            value={rescheduleState.rescheduleReason}
            onChange={handleChangeRescheduleInputs}
          />
          <p>у</p>
          <input
            placeholder="укажите должность"
            name="reschedulePost"
            type="text"
            value={rescheduleState.reschedulePost}
            onChange={handleChangeRescheduleInputs}
          />
          <input
            placeholder="укажите имя"
            name="rescheduleName"
            type="text"
            value={rescheduleState.rescheduleName}
            onChange={handleChangeRescheduleInputs}
          />
          <p>прошу</p>
          <div className="reschedule__header__dates">
            {rescheduleState.rescheduleHeaderDays.map((date, index) => {
              return (
                <div className={"datepicker__wrapper"} key={index}>
                  {rescheduleState.rescheduleHeaderDays.length > 1 && (
                    <span>,</span>
                  )}
                  <DatePicker
                    selected={rescheduleState.rescheduleHeaderDays[index]}
                    locale={ru}
                    onChange={date =>
                      handleRescheduleHeaderDaysChange(date, index)
                    }
                    name="date"
                    dateFormat={"dd.MM.yyyy"}
                  />
                </div>
              );
            })}
            <button
              style={{ marginRight: "20px" }}
              className="btn-floating btn-small waves-effect waves-light"
              onClick={handleRescheduleHeaderDaysAdd}
            >
              <i className="material-icons">add</i>
            </button>
          </div>
          <p>перенести занятия по следующим дисциплинам:</p>
        </div>
        <div className={"reschedule__main__components"}>
          {rescheduleState.rescheduleMainComponents.map((component, index) => {
            return (
              <div className="reschedule__main__component" key={index}>
                <h5>{index + 1}. </h5>
                <select
                  name="type"
                  className="browser-default"
                  onChange={e => handleChangeMainRescheduleInputs(e, index)}
                >
                  <option>Лабораторная работа</option>
                  <option>Практическое занятие</option>
                  <option>Лекционное занятие</option>
                </select>
                <p>по дисциплине</p>
                <input
                  type="text"
                  name="discipline"
                  placeholder="Название дисциплины"
                  onChange={e => handleChangeMainRescheduleInputs(e, index)}
                />
                <span>&#040;</span>
                <span>гр. </span>
                <input
                  type="text"
                  name="group"
                  placeholder="Группа"
                  onChange={e => handleChangeMainRescheduleInputs(e, index)}
                />
                <span>,</span>
                <div className="datepicker__wrapper">
                  <DatePicker
                    selected={
                      rescheduleState.rescheduleMainComponents[index].date
                    }
                    locale={ru}
                    onChange={date =>
                      handleRescheduleMainComponentsDateChange(
                        date,
                        index,
                        "date"
                      )
                    }
                    name="date"
                    dateFormat={"dd.MM.yyyy"}
                  />
                </div>
                <div className="datepicker__wrapper">
                  <input
                    placeholder="№ пары"
                    type="number"
                    name="class"
                    value={rescheduleState.rescheduleMainComponents.class}
                    onChange={e => handleChangeMainRescheduleInputs(e, index)}
                  />
                </div>
                <span>пара</span>
                <span>&#041;</span>
                <p>&nbsp;будет перенесено на</p>
                <div className="datepicker__wrapper">
                  <DatePicker
                    selected={
                      rescheduleState.rescheduleMainComponents[index].newDate
                    }
                    locale={ru}
                    onChange={date =>
                      handleRescheduleMainComponentsDateChange(
                        date,
                        index,
                        "newDate"
                      )
                    }
                    name="newDate"
                    dateFormat={"dd.MM.yyyy"}
                  />
                </div>
                <span>,</span>
                <div className="datepicker__wrapper">
                  <input
                    placeholder="№ пары"
                    type="number"
                    name="newClass"
                    value={rescheduleState.rescheduleMainComponents.newClass}
                    onChange={e => handleChangeMainRescheduleInputs(e, index)}
                  />
                </div>
                <span>пара</span>
                <span>, ауд. </span>
                <div className="datepicker__wrapper">
                  <input
                    placeholder="№ ауд."
                    type="number"
                    name="room"
                    value={rescheduleState.rescheduleMainComponents.room}
                    onChange={e => handleChangeMainRescheduleInputs(e, index)}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="btn-floating btn-small waves-effect waves-light"
          onClick={handleRescheduleMainComponentsAdd}
        >
          <i className="material-icons">add</i>
        </button>
      </div>
    );
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

  const handleSaveClick = () => {
    let doc = generateDocFile(
      state,
      state.theme === "О замене преподавателя"
        ? substitutingState
        : rescheduleState
    );
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "Служебная записка.docx");
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
                <div className="datepicker__wrapper">
                  <DatePicker
                    selected={item.date}
                    locale={ru}
                    onChange={date => handleSubstituteDayDateChange(date, i)}
                    name="date"
                    dateFormat={"dd.MM.yyyy"}
                  />
                </div>
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
                  />
                </div>
                <div className="body__list__row">
                  <span>группа</span>
                  <input
                    type="text"
                    name="group"
                    value={item.group}
                    onChange={e => handleSubstituteDayChange(e, i)}
                  />
                  <div className="datepicker__wrapper">
                    <input
                      type="number"
                      name="class"
                      value={item.class}
                      onChange={e => handleSubstituteDayChange(e, i)}
                    />
                  </div>

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
          <button
            className="btn-floating btn-small waves-effect waves-light"
            onClick={handleAddDayClick}
          >
            <i className="material-icons">add</i>
          </button>
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
            <div className={"datepicker__wrapper"}>
              <DatePicker
                selected={state.date}
                locale={ru}
                onChange={handleChangeDate}
                name="date"
                dateFormat={"dd.MM.yyyy"}
              />
            </div>
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
          <button
            className="waves-effect waves-light btn"
            onClick={handleSaveClick}
          >
            сохранить записку
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="wrapper">
      {renderHeader()}
      <div className="main">
        {state.theme === "О переносе занятий"
          ? RescheduleMemo()
          : SubstitutingBody()}
      </div>
      {renderFooter()}
    </div>
  );
}

export default App;
