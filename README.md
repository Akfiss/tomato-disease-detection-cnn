
# Tomato Disease Detection

A full-stack application for detecting diseases in tomato plants using Convolutional Neural Networks (CNN). This project consists of a Machine Learning model, a mobile application (Android), and a backend API (Cloud Run).



## 🚀 Features

* **Image Classification:** Detects 10 different types of tomato plant diseases (plus one healthy class) from an image.
* **Mobile First:** Easy-to-use Android application to snap a photo or upload from the gallery.
* **User Authentication:** Secure user registration and login system.
* **Prediction History:** Users can view their past detection results.
* **Profile Management:** Users can view and update their profile information.
* **Scalable Backend:** Built with Node.js and Express, ready to be deployed as a container.

---

## 🛠️ Tech Stack

This project is divided into three main components:

* **🤖 Model Detection (ML)**
    * **Framework:** TensorFlow, Keras
    * **Language:** Python
    * **Environment:** Jupyter Notebook (`.ipynb`)

* **☁️ Backend (Cloud Computing)**
    * **Framework:** Node.js, Express.js
    * **Database:** Sequelize (with PostgreSQL dialect)
    * **Authentication:** JWT (JSON Web Tokens), bcrypt
    * **Storage:** Google Cloud Storage (GCS)
    * **Containerization:** Docker
    * **Language:** JavaScript

* **📱 Mobile App (Mobile Development)**
    * **Platform:** Android (Native)
    * **Language:** Kotlin
    * **Architecture:** MVVM (Model-View-ViewModel)
    * **Libraries:**
        * Retrofit2 (Networking)
        * TFLite (On-device ML)
        * Glide (Image Loading)
        * ViewModel & LiveData (Lifecycle)
        * Room (Local Database)
        * DataStore (User Preferences)

---

## 📁 Project Structure

The repository is organized into three main directories:

```

/tomato-disease-detection
├── 📂 Backend-CC/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js         \# Main Express app
│   ├── Dockerfile
│   └── package.json
│
├── 📂 MobileApp-MD/
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/capstone/tomguard/
│   │   │   │   ├── data/      \# Repository, API, Database
│   │   │   │   ├── ui/        \# Activities & Fragments
│   │   │   │   └── ...
│   │   │   ├── res/         \# Layouts, Drawables, Values
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle.kts
│
└── 📂 ModelDetection-ML/
├── TomGuard\_Model.ipynb   \# The main notebook for model training
└── README.md

````

---

## 🔧 Prerequisites & Installation

### 1. Model Detection (ML)

* Open `ModelDetection-ML/TomGuard_Model.ipynb` in a Jupyter environment (like Google Colab).
* Install required Python packages: `tensorflow`, `numpy`, `matplotlib`.
* Run the cells to train the model and export the `.tflite` file.

### 2. Backend (CC)

1.  Navigate to the `Backend-CC` directory:
    ```bash
    cd Backend-CC
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your environment variables (create a `.env` file):
    ```
    PORT=8080
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=your_db_host
    DB_NAME=your_db_name
    JWT_SECRET=your_jwt_secret
    GCS_BUCKET_NAME=your-gcs-bucket-name
    ```
4.  Run the database sync:
    ```bash
    node src/models/sync.js
    ```
5.  Start the server:
    ```bash
    npm run start
    ```
    Or, for development (with nodemon):
    ```bash
    npm run dev
    ```

### 3. Mobile App (MD)

1.  Open the `MobileApp-MD` directory in Android Studio.
2.  Let Gradle sync and build the project.
3.  Ensure you have an Android device or emulator running.
4.  Update the `ApiService.kt` with your backend's base URL.
5.  Run the application from Android Studio.

---

## 📈 API Endpoints (Usage Example)

Here are some of the main endpoints provided by the `Backend-CC`:

* `POST /api/register`: Register a new user.
* `POST /api/login`: Log in a user and receive a JWT token.
* `GET /api/profile`: Get user profile (requires Auth).
* `PUT /api/profile`: Update user profile (requires Auth).
* `POST /api/detect`: Upload an image for disease detection (requires Auth).
* `GET /api/history`: Get the user's prediction history (requires Auth).

**Example: Predict Disease**

Request: `POST /api/detect` (Auth: Bearer Token)
Body: `FormData` with a field `image` (file).

```json
// Successful Response (200 OK)
{
  "status": "success",
  "message": "Image processed successfully",
  "data": {
    "id": "pred-12345",
    "diseaseName": "Tomato_Early_blight",
    "accuracy": 0.95,
    "imageUrl": "[https://storage.googleapis.com/your-bucket/image.jpg](https://storage.googleapis.com/your-bucket/image.jpg)",
    "createdAt": "2025-11-15T08:00:00.000Z"
  }
}
````

-----

## 🤝 Contributing

Contributions, issues, and feature requests are welcome\! Feel free to check the [issues page](https://www.google.com/search?q=https://github.com/akfiss/tomato-disease-detection/issues) (if it exists) or create one.

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

-----

## 📜 License

This project is licensed under the **MIT License**.

See the `LICENSE.txt` file for more information (you would need to create this file).

```
MIT License

Copyright (c) 2025 Akfiss

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
