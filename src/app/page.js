'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

function SimpleSlider({ children }) {
  const [index, setIndex] = React.useState(0);
  const slides = React.Children.toArray(children);
  const count = slides.length;

  function prev() {
    setIndex((i) => (i - 1 + count) % count);
  }
  function next() {
    setIndex((i) => (i + 1) % count);
  }

  if (count === 0) return <p>Нет данных</p>;

  return (
      <div className={styles.slider}>
        <button className={styles.sliderArrowLeft} onClick={prev} aria-label="Назад">
          ‹
        </button>
        {slides[index]}
        <button className={styles.sliderArrowRight} onClick={next} aria-label="Вперёд">
          ›
        </button>
      </div>
  );
}

const headerStyle = {
  color: 'white',
  position: 'absolute',
  zIndex: 4,
  top: '30%',
  left: '40%',
};

const contentStyle = {
  color: 'white',
  textAlign: 'center',
  top: '50%',
  left: '25%',
  position: 'absolute',
  zIndex: 4,
};

const bgImg = {
  position: 'absolute',
  zIndex: 3,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

function sendEmail(email) {
  const body = `Здравствуйте, я нашел вашего питомца.%0A-----------%0AС уважением, ${localStorage.getItem(
      'user'
  )}`;
  window.open(`mailto:${email}?subject=Потерянный зверь&body=${body}`);
}

function Animal({ data }) {
  if (!data) return <p>Loading</p>;
  const { header, content, img } = data;
  return (
      <div className={styles.slide}>
        <h1 style={headerStyle}>{header}</h1>
        <br />
        <h2 style={contentStyle}>{content}</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img style={bgImg} alt={header} src={`/${img}`} />
      </div>
  );
}

export default function Home() {
  const [animals, setAnimals] = React.useState([]);

  React.useEffect(() => {
    fetch('/animals.json')
        .then((res) => res.json())
        .then((data) => setAnimals(data));
  }, []);

  React.useEffect(() => {
    let user = localStorage.getItem('user');
    if (user === null) {
      while (user === null) {
        user = prompt('Введите ваше имя пользователя');
        if (!user) {
          alert('Обязательно!');
        } else {
          localStorage.setItem('user', user);
        }
      }
    }
  }, []);

  function logout() {
    localStorage.clear();
    location.reload();
  }

  return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.topBar}>
            <button onClick={logout}>logout</button>
            <Link href="/communities">Мои сообщества →</Link>
          </div>

          <h1>Пропали питомцы. Помогите найти! Срочно!</h1>

          <SimpleSlider>
            {animals.map((data, i) => (
                <div
                    key={i}
                    className={styles.slideWrapper}
                    onClick={() => sendEmail(data?.email)}
                >
                  <Animal data={data} />
                </div>
            ))}
          </SimpleSlider>
        </main>

        <footer className={styles.footer}>New Petto, (c) 2026</footer>
      </div>
  );
}