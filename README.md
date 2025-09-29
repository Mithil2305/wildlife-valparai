# 🐾 Wildlife Valparai – Community Content Platform

Wildlife Valparai is a **creator-driven platform** that allows users to share wildlife sightings and stories in an **immersive audio-visual blog format**.  
Creators can upload photos with short audio narrations or write blogs, while viewers enjoy a seamless content experience.  
The platform rewards top performers with **points, recognition, and monthly cash payouts**, while monetizing via **Google Ads and sponsored ads**.

---

## 🚀 Application Workflow

### 📌 User Flow

1. **User/Creator** registers or logs in.
2. **Viewers/Audience** can:
   - View photos with an **audio experience** (default).
   - Switch to blogs view.
3. **Creators** access their dashboard to:
   - Upload photos + 1-minute audio.
   - Write and publish blogs.
   - Earn points for contributions.
4. **Top members/performers** get rewarded with **cash payouts every month**.

### 📌 Admin Flow

1. Admins access an **Admin Dashboard** to:
   - Monitor top performers.
   - Manage user content and performance.
   - Process payments to creators.
2. Admins initiate payments via the **Payment Page**.

💡 **Monetization**: The website earns through **Google Ads** and **Sponsored Ads**.

---

## 🔄 Workflow Diagram

![Application Workflow](./wv%20workflow.png)

---

## 📂 Project Folder Structure

```
wildlife-valparai/
    │
    ├── public/
    │   ├── index.html
    │   ├── manifest.json
    │   └── assets/
    │       ├── images/
    │       │   ├── logo.png
    │       │   └── ads/
    │       │       ├── google-ads-script.js
    │       │       └── sponsored-banners/
    │       │
    │       ├── icons/
    │       │   └── favicon.ico
    │       │
    │       ├── audio/
    │       │   └── default-audio-experience/
    │       │
    │       └── translations/
    │           ├── en.json
    │           ├── ta.json
    │           └── hi.json
    │
    ├── src/
    │   ├── api/
    │   │   ├── firebaseConfig.js
    │   │   ├── authApi.js
    │   │   ├── blogApi.js
    │   │   ├── firestoreApi.js
    │   │   ├── sightingApi.js
    │   │   ├── storageApi.js
    │   │   ├── audioApi.js
    │   │   ├── pointsApi.js
    │   │   ├── paymentApi.js
    │   │   └── adsApi.js
    │   │
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── LoadingSpinner.jsx
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   ├── AdminRoute.jsx
    │   │   │   ├── AudioPlayer.jsx
    │   │   │   ├── ViewToggle.jsx
    │   │   │   └── AdsContainer.jsx
    │   │   │
    │   │   ├── content/
    │   │   │   ├── PostCard.jsx
    │   │   │   ├── CommentBox.jsx
    │   │   │   ├── PhotoWithAudio.jsx
    │   │   │   ├── BlogPost.jsx
    │   │   │   └── ContentSwitcher.jsx
    │   │   │
    │   │   ├── forms/
    │   │   │   ├── DonationForm.jsx
    │   │   │   ├── PhotoUploadForm.jsx
    │   │   │   ├── AudioUploadForm.jsx
    │   │   │   ├── BlogEditor.jsx
    │   │   │   └── PaymentForm.jsx
    │   │   │
    │   │   └── dashboard/
    │   │       ├── Leaderboard.jsx
    │   │       ├── PointsDisplay.jsx
    │   │       ├── PerformanceMetrics.jsx
    │   │       └── CreatorStats.jsx
    │   │
    │   ├── contexts/
    │   │   ├── AuthContext.js
    │   │   ├── ThemeContext.js
    │   │   ├── LanguageContext.js
    │   │   ├── PointsContext.js
    │   │   └── ContentViewContext.js
    │   │
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useFirestore.js
    │   │   ├── useStorage.js
    │   │   ├── useAudio.js
    │   │   ├── usePoints.js
    │   │   ├── useContentToggle.js
    │   │   └── usePayment.js
    │   │
    │   ├── layouts/
    │   │   ├── MainLayout.jsx
    │   │   ├── AdminLayout.jsx
    │   │   └── CreatorLayout.jsx
    │   │
    │   ├── pages/
    │   │   ├── public/
    │   │   │   ├── Home.jsx
    │   │   │   ├── About.jsx
    │   │   │   ├── Contact.jsx
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   └── NotFound.jsx
    │   │   │
    │   │   ├── content/
    │   │   │   ├── Sightings.jsx
    │   │   │   ├── SightingDetail.jsx
    │   │   │   ├── Blogs.jsx
    │   │   │   ├── BlogDetail.jsx
    │   │   │   └── ContentFeed.jsx
    │   │   │
    │   │   ├── creator/
    │   │   │   ├── CreatorDashboard.jsx
    │   │   │   ├── SubmitSighting.jsx
    │   │   │   ├── CreateBlog.jsx
    │   │   │   ├── EditBlog.jsx
    │   │   │   ├── UploadPhotoAudio.jsx
    │   │   │   └── MyContent.jsx
    │   │   │
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminSightings.jsx
    │   │   │   ├── AdminUsers.jsx
    │   │   │   ├── AdminBlogs.jsx
    │   │   │   ├── AdminPayments.jsx
    │   │   │   ├── AdminPerformance.jsx
    │   │   │   └── AdminAds.jsx
    │   │   │
    │   │   └── user/
    │   │       ├── Profile.jsx
    │   │       ├── LeaderboardPage.jsx
    │   │       └── PointsHistory.jsx
    │   │
    │   ├── services/
    │   │   ├── authService.js
    │   │   ├── userService.js
    │   │   ├── postService.js
    │   │   ├── paymentService.js
    │   │   ├── pointsService.js
    │   │   ├── audioService.js
    │   │   ├── analyticsService.js
    │   │   └── adsService.js
    │   │
    │   ├── utils/
    │   │   ├── validators.js
    │   │   ├── formatDate.js
    │   │   ├── imageCompressor.js
    │   │   ├── audioCompressor.js
    │   │   ├── pointsCalculator.js
    │   │   ├── paymentCalculator.js
    │   │   ├── constants.js
    │   │   ├── rateLimiter.js
    │   │   └── adsManager.js
    │   │
    │   ├── styles/
    │   │   ├── ads.css
    │   │   └── audio-player.css
    │   │
    │   ├── App.jsx
    │   ├── index.js
    │   └── routes.js
    │
    ├── functions/
    │   ├── index.js
    │   ├── blogTriggers.js
    │   ├── uploadTriggers.js
    │   ├── paymentTriggers.js
    │   ├── adminTriggers.js
    │   ├── pointsTriggers.js
    │   ├── audioProcessing.js
    │   └── analyticsTriggers.js
    │
    ├── tests/
    │   ├── auth.test.js
    │   ├── firestore.test.js
    │   ├── points.test.js
    │   ├── audio.test.js
    │   ├── payment.test.js
    │   └── ui.test.js
    │
    ├── firebase.json
    ├── firestore.rules
    ├── storage.rules
    ├── tailwind.config.js
    ├── package.json
    └── README.md

```

## 🛠️ Tech Stack

Frontend: React + TailwindCSS

Backend: Firebase (Firestore, Functions, Storage, Auth)

Audio Processing: Custom Firebase Functions

Payments: Integrated Payment API

Monetization: Google Ads + Sponsored Ads

## 📌 Features

🔊 Photo + Audio storytelling

✍️ Blog creation & publishing

🏆 Points & leaderboard system

💰 Monthly creator payouts

📊 Admin performance tracking

🌐 Multi-language support (EN, TA, HI)

## 📖 License

This project is licensed under the MIT License.
Feel free to contribute and build upon it.
