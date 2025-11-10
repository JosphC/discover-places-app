# Aplicație Discover Places - Flask & ReactJS

O aplicație full-stack de gestionare a sarcinilor construită cu Flask (backend) și React TypeScript (frontend). Organizați-vă sarcinile, colaborați prin comentarii, gestionați postări cu locații geografice și urmăriți evaluări pe conținut partajat.

## 🚀 Caracteristici

### Funcționalități Principale

- **Gestionarea Sarcinilor**: Creați, citiți, actualizați și ștergeți sarcini cu etichete și urmărire status
- **Autentificare Utilizatori**: Autentificare bazată pe JWT cu parolă criptată securizat
- **Comentarii**: Adăugați și gestionați comentarii pe sarcini pentru colaborare
- **Postări & Locații**: Creați postări cu date geografice, imagini și status
- **Evaluări**: Evaluați și recenzionați postări cu calcularea ratingului mediu
- **Favorite**: Marcheți postări favorite pentru acces rapid
- **Categorii**: Organizați conținut cu sistem de categorii
- **Sistem de Etichete**: Sistem flexibil de etichete pentru organizare mai bună

### Evidențiiri Tehnice

- **Frontend Type-Safe**: Suport complet TypeScript cu validare Zod
- **Migrații Baze de Date**: Gestionare automată schema cu Alembic
- **Încărcare Fișiere**: Suport upload imagini cu validare și denumire unică
- **API RESTful**: Endpoint-uri REST bine structurate cu Flask-Smorest
- **Actualizări Real-Time**: React Query pentru invalidare automată cache și sincronizare stare
- **Gestionare Formulare**: React Hook Form cu validare
- **UI Responsive**: TailwindCSS cu componente shadcn/ui

## 📋 Structura Proiectului

```
todo-app-flask-reactjs/
├── backend/
│   ├── flaskr/
│   │   ├── controllers/      # Logică de afaceri pentru fiecare resursă
│   │   ├── models/           # Modele bază de date SQLAlchemy
│   │   ├── routes/           # Definiții endpoint-uri API
│   │   ├── schemas/          # Scheme validare Marshmallow
│   │   ├── db.py             # Inițializare bază de date
│   │   ├── extensions.py     # Setup extensii Flask
│   │   ├── utils.py          # Funcții utilitate
│   │   └── __init__.py       # Flask app factory
│   ├── migrations/           # Migrații bază de date Alembic
│   ├── instance/             # Fișiere specifice instanței
│   ├── uploads/              # Fișiere încărcate utilizatori (imagini)
│   ├── application.py        # Punct de intrare aplicație
│   ├── config.py             # Setări configurație
│   ├── requirements.txt      # Dependențe Python
│   └── Pipfile               # Configurare Pipenv
│
└── frontend/
    ├── src/
    │   ├── components/       # Componente UI reutilizabile
    │   ├── hooks/            # Hook-uri React personalizate
    │   ├── routes/           # Componente pagini și layout-uri
    │   ├── schemas/          # Scheme validare Zod
    │   ├── services/         # Apeluri API și React Query
    │   ├── stores/           # Gestionare stare Zustand
    │   ├── types/            # Definiții tipuri TypeScript
    │   ├── lib/              # Funcții utilitate
    │   ├── main.tsx          # Punct de intrare
    │   └── index.css         # Stiluri globale
    ├── public/               # Resurse statice
    ├── package.json          # Dependențe Node
    ├── vite.config.ts        # Configurare Vite
    ├── tsconfig.json         # Configurare TypeScript
    └── tailwind.config.js    # Configurare TailwindCSS
```

## 🛠️ Stack Tehnologic

### Backend

- **Framework**: Flask cu Flask-Smorest pentru REST API
- **Bază de Date**: SQLite cu ORM SQLAlchemy
- **Autentificare**: Flask-JWT-Extended (token-uri JWT)
- **Validare**: Scheme Marshmallow
- **Migrații**: Alembic cu Flask-Migrate
- **Gestionare Fișiere**: Werkzeug pentru upload-uri fișiere securizate
- **Criptare Parolă**: Utilitare securitate Werkzeug

### Frontend

- **Framework**: React 18 cu TypeScript
- **Instrument Compilare**: Vite
- **Gestionare Stare**: Zustand
- **Preluare Date**: Axios cu React Query (TanStack Query)
- **Gestionare Formulare**: React Hook Form cu validare Zod
- **Styling**: TailwindCSS cu componente shadcn/ui
- **Icoane**: Lucide React
- **Notificări**: Bibliotecă Sonner toast
- **Formatare Date**: date-fns
- **Rutare**: React Router DOM

## 📦 Instalare

### Cerințe Preliminare

- Python 3.8+
- Node.js 16+ (LTS recomandat)
- npm sau yarn

### Setup Backend

1. Navigați în directorul backend:

```bash
cd backend
```

2. Creați mediu virtual (opțional dar recomandat):

```bash
python -m venv venv
source venv/Scripts/activate  # Pe Windows
# sau
source venv/bin/activate      # Pe macOS/Linux
```

3. Instalați dependențe Python:

```bash
pip install -r requirements.txt
```

4. Configurați baza de date:

```bash
flask db upgrade
```

5. (Opțional) Seed cu date inițiale:

```bash
python seed.py
```

6. Porniți serverul Flask development:

```bash
flask run
```

API-ul va fi disponibil la `http://localhost:5000`

### Setup Frontend

1. Navigați în directorul frontend:

```bash
cd frontend
```

2. Instalați dependențe:

```bash
npm install
```

3. Porniți serverul development:

```bash
npm run dev
```

Aplicația va fi disponibilă la `http://localhost:5173`

## 🔌 Endpoint-uri API

### Autentificare

| Metoda | Endpoint               | Descriere                                      |
| ------ | ---------------------- | ---------------------------------------------- |
| POST   | `/api/v1/auth/sign-in` | Autentificare utilizator și obținere token JWT |

### Utilizatori

| Metoda | Endpoint                | Descriere                                 |
| ------ | ----------------------- | ----------------------------------------- |
| GET    | `/api/v1/users`         | Obțineți toți utilizatorii                |
| POST   | `/api/v1/users`         | Creați utilizator nou                     |
| GET    | `/api/v1/users/<id>`    | Obțineți utilizator după ID               |
| GET    | `/api/v1/users/me`      | Obțineți utilizatorul autentificat curent |
| PUT    | `/api/v1/users/account` | Actualizați profil utilizator curent      |
| DELETE | `/api/v1/users/account` | Ștergeți cont utilizator curent           |

### Sarcini

| Metoda | Endpoint             | Descriere                                      |
| ------ | -------------------- | ---------------------------------------------- |
| GET    | `/api/v1/tasks`      | Obțineți toate sarcinile utilizatorului curent |
| POST   | `/api/v1/tasks`      | Creați sarcină nouă                            |
| GET    | `/api/v1/tasks/<id>` | Obțineți sarcină după ID                       |
| PUT    | `/api/v1/tasks/<id>` | Actualizați sarcină                            |
| DELETE | `/api/v1/tasks/<id>` | Ștergeți sarcină                               |

### Etichete

| Metoda | Endpoint                   | Descriere                   |
| ------ | -------------------------- | --------------------------- |
| GET    | `/api/v1/tags`             | Obțineți toate etichetele   |
| POST   | `/api/v1/tags`             | Creați etichetă nouă        |
| PUT    | `/api/v1/tags/<id>`        | Actualizați etichetă        |
| DELETE | `/api/v1/tags/<id>`        | Ștergeți etichetă           |
| POST   | `/api/v1/tags/bulk-delete` | Ștergeți mai multe etichete |

### Comentarii

| Metoda | Endpoint                           | Descriere                                  |
| ------ | ---------------------------------- | ------------------------------------------ |
| GET    | `/api/v1/tasks/<task_id>/comments` | Obțineți toate comentariile pentru sarcină |
| POST   | `/api/v1/tasks/<task_id>/comments` | Creați comentariu pe sarcină               |
| PUT    | `/api/v1/comments/<id>`            | Actualizați comentariu                     |
| DELETE | `/api/v1/comments/<id>`            | Ștergeți comentariu                        |

### Postări

| Metoda | Endpoint             | Descriere                                |
| ------ | -------------------- | ---------------------------------------- |
| GET    | `/api/v1/posts`      | Obțineți toate postările                 |
| POST   | `/api/v1/posts`      | Creați postare nouă cu imagine           |
| GET    | `/api/v1/posts/user` | Obțineți postările utilizatorului curent |
| PUT    | `/api/v1/posts/<id>` | Actualizați postare                      |
| DELETE | `/api/v1/posts/<id>` | Ștergeți postare                         |

### Evaluări

| Metoda | Endpoint                          | Descriere                                |
| ------ | --------------------------------- | ---------------------------------------- |
| GET    | `/api/v1/posts/<post_id>/reviews` | Obțineți toate evaluările pentru postare |
| POST   | `/api/v1/posts/<post_id>/reviews` | Creați evaluare pentru postare           |
| GET    | `/api/v1/reviews/<id>`            | Obțineți evaluare după ID                |
| PUT    | `/api/v1/reviews/<id>`            | Actualizați evaluare                     |
| DELETE | `/api/v1/reviews/<id>`            | Ștergeți evaluare                        |

### Favorite

| Metoda | Endpoint                           | Descriere                                 |
| ------ | ---------------------------------- | ----------------------------------------- |
| GET    | `/api/v1/favorites`                | Obțineți toate favorite-le utilizatorului |
| POST   | `/api/v1/favorites`                | Adăugați postare la favorite              |
| PUT    | `/api/v1/favorites/<id>`           | Actualizați favorit                       |
| DELETE | `/api/v1/favorites/<id>`           | Eliminați din favorite                    |
| GET    | `/api/v1/posts/<post_id>/favorite` | Verificați dacă postare este în favorite  |
| DELETE | `/api/v1/posts/<post_id>/favorite` | Eliminați postare din favorite            |

### Categorii

| Metoda | Endpoint                  | Descriere                  |
| ------ | ------------------------- | -------------------------- |
| GET    | `/api/v1/categories`      | Obțineți toate categoriile |
| POST   | `/api/v1/categories`      | Creați categorie nouă      |
| GET    | `/api/v1/categories/<id>` | Obțineți categorie după ID |
| PUT    | `/api/v1/categories/<id>` | Actualizați categorie      |
| DELETE | `/api/v1/categories/<id>` | Ștergeți categorie         |

## 🔐 Autentificare

API-ul folosește JWT (JSON Web Tokens) pentru autentificare. Rutele protejate necesită:

```
Authorization: Bearer <token_jwt_vostru>
```

Obțineți token prin autentificare:

```bash
POST /api/v1/auth/sign-in
Content-Type: application/json

{
  "email": "utilizator@exemplu.com",
  "password": "parola"
}
```

Răspuns:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 💾 Schema Bază de Date

### Modele Principale

- **User**: Conturi utilizatori cu autentificare
- **Task**: Sarcini utilizator cu status și etichete
- **Tag**: Sistem etichetare sarcini
- **Post**: Postări utilizatori cu imagini opționale și locație
- **Review**: Evaluări pe postări cu rating-uri
- **Favorite**: Favorite-le utilizatorului (marcaje)
- **Comment**: Comentarii pe sarcini
- **Category**: Categorii conținut

Toate modelele includ relații și constrângeri corespunzătoare pentru integritate date.

## 📝 Configurare

### Configurare Backend (`config.py`)

- **Bază de Date**: Configurație SQLite
- **JWT**: Cheie secretă și setări expirare
- **Upload Fișiere**: Tipuri fișiere permise, limite dimensiune
- **CORS**: Setări resurse partajate între origini

### Mediu Frontend

Setați URL bază API în mediu sau modificați fișiere service:

- Implicit: `http://localhost:5000/api/v1`

## 🧪 Dezvoltare

### Rulare Teste

```bash
# Teste backend
cd backend
pytest

# Teste frontend
cd frontend
npm run test
```

### Compilare pentru Producție

**Frontend:**

```bash
npm run build
```

