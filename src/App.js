import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import ru from 'date-fns/locale/ru';

import './App.css';
import 'materialize-css/dist/css/materialize.min.css'
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [state, setState] = useState({
    from: 'Зав. кафедрой КБМОИС',
    to: 'Начальнику учебного отдела',
    theme: 'О переносе занятий',
    date: new Date(),
    fromName: 'Влацкой И.В.',
    toName: 'Зинюхиной Н.А.',
    footerWho: 'Зав. кафедрой КБМОИС',
    footerWhoName: 'И. В. Влацкая'
  })

  const handleChange = (e) => {
    const value = e.target.value
    setState({
      ...state,
      [e.target.name]: value
    })
  }

  const handleChangeDate = (date) => {
    setState({
      date
    })
  }

  const renderHeader = () => {
    return (
      <div className='header'>
        <div>
          <p>СЛУЖЕБНАЯ ЗАПИСКА</p>
        </div>
        <div className='header__fields'>
          <div className='header__fields__item'>
            <p className='header__fields__item__title'>
              Кому:
              </p>
            <input
              type='text'
              value={state.to}
              onChange={handleChange}
              name='to'
            />
            <input
              type='text'
              value={state.toName}
              onChange={handleChange}
              name='toName'
            />
          </div>
          <div className='header__fields__item'>
            <p className='header__fields__item__title'>
              От кого:
              </p>
            <input
              type='text'
              value={state.from}
              onChange={handleChange}
              name='from'
            />
            <input
              type='text'
              value={state.fromName}
              onChange={handleChange}
              name='fromName'
            />
          </div>
          <div className='header__fields__item'>
            <p className='header__fields__item__title'>
              Дата:
              </p>
            <DatePicker
              selected={state.date}
              locale={ru}
              onChange={handleChangeDate}
              name='date'
              dateFormat={'dd.MM.yyyy'}
            />
          </div>
          <div className='header__fields__item'>
            <p className='header__fields__item__title'>
              Тема:
              </p>
            <select name='theme' onChange={handleChange} className='browser-default header__select' >
              <option>О переносе занятий</option>
              <option>О замене преподавателя</option>
            </select>
          </div>
        </div>
      </div>
    )
  }

  const renderFooter = () => {
    return (
      <div className='footer'>
        <div>
          <div className='footer__inputs'>
            <input
              type='text'
              value={state.footerWho}
              onChange={handleChange}
              name='footerWho'
            />
            <input
              type='text'
              value={state.footerWhoName}
              onChange={handleChange}
              name='footerWhoName'
            />
          </div>
          <a className="waves-effect waves-light btn">сохранить записку</a>
        </div>
      </div>
    )
  }

  return (
      <div className='wrapper'>
        {
          renderHeader()
        }
        <div className='main'>
          main template
          здесь тернарником сделать условие если выбрана "о переносе занятий", то ее конструктор, иначе другой
        </div>
        {
          renderFooter()
        }
      </div>
  );
}

export default App;
