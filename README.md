    ## Project folder structure

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
