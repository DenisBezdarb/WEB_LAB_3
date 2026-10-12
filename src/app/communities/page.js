'use client';

import React from 'react';
import Link from 'next/link';
import styles from './communities.module.css';

const STORAGE_KEY = 'communities';

function loadCommunities() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCommunities(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function defaultAvatar(name) {
    const letter = name?.charAt(0)?.toUpperCase() || '?';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
    <rect width="100" height="100" fill="#0070f3"/>
    <text x="50%" y="50%" font-size="48" fill="white" text-anchor="middle" dominant-baseline="central" font-family="Arial">${letter}</text>
  </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function CreateCommunityForm({ onCreate, onCancel }) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [avatar, setAvatar] = React.useState(null);
    const [avatarPreview, setAvatarPreview] = React.useState(null);

    function handleAvatarChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setAvatar(reader.result);
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) {
            alert('Название сообщества обязательно');
            return;
        }
        onCreate({
            id: crypto.randomUUID(),
            name: name.trim(),
            description: description.trim(),
            avatar: avatar || defaultAvatar(name),
            createdAt: new Date().toISOString(),
        });
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Новое сообщество</h2>

            <label className={styles.label}>
                Название*
                <input
                    className={styles.input}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </label>

            <label className={styles.label}>
                Описание
                <textarea
                    className={styles.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                />
            </label>

            <label className={styles.label}>
                Аватарка
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </label>

            {avatarPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Предпросмотр" className={styles.avatarPreview} />
            )}

            <div className={styles.formButtons}>
                <button type="submit" className={styles.primaryButton}>
                    Создать
                </button>
                <button type="button" onClick={onCancel} className={styles.secondaryButton}>
                    Отмена
                </button>
            </div>
        </form>
    );
}

export default function CommunitiesPage() {
    const [communities, setCommunities] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);

    React.useEffect(() => {
        setCommunities(loadCommunities());
    }, []);

    function handleCreate(newCommunity) {
        const updated = [...communities, newCommunity];
        setCommunities(updated);
        saveCommunities(updated);
        setShowForm(false);
    }

    function handleDelete(id) {
        if (!confirm('Удалить сообщество?')) return;
        const updated = communities.filter((c) => c.id !== id);
        setCommunities(updated);
        saveCommunities(updated);
    }

    return (
        <div className={styles.container}>
            <Link href="/">← На главную</Link>
            <h1>Мои сообщества</h1>

            {!showForm && (
                <button className={styles.primaryButton} onClick={() => setShowForm(true)}>
                    + Создать сообщество
                </button>
            )}

            {showForm && (
                <CreateCommunityForm onCreate={handleCreate} onCancel={() => setShowForm(false)} />
            )}

            <ul className={styles.list}>
                {communities.length === 0 && <p>У вас пока нет сообществ</p>}
                {communities.map((community) => (
                    <li key={community.id} className={styles.card}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={community.avatar} alt={community.name} className={styles.avatar} />
                        <div className={styles.cardBody}>
                            <h3>{community.name}</h3>
                            <p>{community.description}</p>
                        </div>
                        <button className={styles.deleteButton} onClick={() => handleDelete(community.id)}>
                            Удалить
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}