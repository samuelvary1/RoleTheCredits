// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { firebaseConfig } from './firebaseConfig'; // Ensure this is correctly configured

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firestore
// const db = getFirestore(app);

// // Example function to add a movie to a user's watchlist
// async function addToWatchlist(userId: string, movie: { movieId: string; title: string; posterPath: string }) {
//   try {
//     const watchlistRef = doc(collection(db, 'watchlist'), userId); // Correctly referencing collection and doc
//     await updateDoc(watchlistRef, {
//       movies: arrayUnion(movie),
//     });
//     console.log('Movie added to watchlist!');
//   } catch (error) {
//     console.error('Error adding movie to watchlist:', error);
//   }
// }

// // Example usage
// addToWatchlist('user123', { movieId: 'm001', title: 'Inception', posterPath: '/posterPath.jpg' });


