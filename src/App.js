import React, { useState, useEffect, useMemo } from "react";
import {
  Cat,
  Calendar,
  MapPin,
  Phone,
  User,
  Check,
  X,
  Clock,
  ArrowLeft,
  Heart,
  LogIn,
} from "lucide-react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyAfEoUE0lQB1398gPRuN0KPMLqJ7c4GdvI",
  authDomain: "catsitting-rose.firebaseapp.com",
  projectId: "catsitting-rose",
  storageBucket: "catsitting-rose.firebasestorage.app",
  messagingSenderId: "345028811918",
  appId: "1:345028811918:web:fa36e1691a9bb5872e3ddf",
  measurementId: "G-MX63QDVB64",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// ==========================================
// COMPOSANTS INDÉPENDANTS (Corrige le bug du texte)
// ==========================================

const Navbar = ({ setView, isAdmin, setIsAdmin }) => (
  <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => setView("home")}
        >
          <div className="bg-pink-100 p-2 rounded-full group-hover:bg-pink-200 transition-colors">
            <Cat className="h-6 w-6 text-pink-500" />
          </div>
          <span className="font-bold text-xl text-gray-800 tracking-tight">
            Les Chats de <span className="text-pink-500">Rose</span>
          </span>
        </div>
        <div>
          {!isAdmin ? (
            <button
              onClick={() => setView("admin_login")}
              className="text-sm font-medium text-pink-400 hover:text-pink-600 transition-colors flex items-center space-x-1"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Accès Rose</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAdmin(false);
                setView("home");
              }}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 px-3 py-1 rounded-full"
            >
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const HomeView = ({ setView }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6">
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-pink-100/50 p-8 sm:p-12 text-center border border-pink-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50 translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10">
        <div className="inline-flex justify-center items-center w-24 h-24 bg-pink-50 rounded-full mb-6">
          <Cat className="h-12 w-12 text-pink-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-6 tracking-tight">
          Partez l'esprit{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            tranquille
          </span>
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
          Je chouchoute vos petits félins pendant votre absence. Réservez dès
          maintenant pour vous assurer de mes disponibilités ! 🐾
        </p>

        <button
          onClick={() => setView("booking")}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold rounded-full shadow-lg shadow-pink-200 transform hover:-translate-y-1 transition-all duration-200 text-lg flex items-center justify-center space-x-2 mx-auto group"
        >
          <span>Réserver un Catsitting</span>
          <Heart className="w-5 h-5 group-hover:animate-pulse" />
        </button>
      </div>
    </div>
  </div>
);

const BookingView = ({ setView }) => {
  // Les états du formulaire sont gérés ici pour ne pas perturber le reste du site
  const [formData, setFormData] = useState({
    nom: "",
    startDate: "",
    endDate: "",
    adresse: "",
    telephone: "",
  });
  const [formStatus, setFormStatus] = useState("idle");

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      await addDoc(collection(db, "demandes"), {
        ...formData,
        status: "En attente",
        createdAt: new Date().toISOString(),
      });

      setFormStatus("success");
      setTimeout(() => {
        setView("home");
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      setFormStatus("error");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 sm:px-6">
      <button
        onClick={() => setView("home")}
        className="flex items-center space-x-2 text-pink-500 hover:text-pink-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour</span>
      </button>

      <div className="bg-white rounded-3xl shadow-lg border border-pink-100 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
          <Calendar className="text-pink-400 w-6 h-6" />
          <span>Nouvelle réservation</span>
        </h2>
        <p className="text-gray-500 mb-8 text-sm">
          Veuillez remplir ce formulaire pour que Rose puisse étudier votre
          demande.
        </p>

        {formStatus === "success" ? (
          <div className="bg-green-50 text-green-700 p-6 rounded-2xl text-center border border-green-100">
            <Check className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <h3 className="font-bold text-lg mb-1">Demande envoyée !</h3>
            <p>Rose a bien reçu votre demande et vous contactera très vite.</p>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-pink-300" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-shadow bg-gray-50/50"
                  placeholder="Jean Dupont"
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  required
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-shadow bg-gray-50/50"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  required
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-shadow bg-gray-50/50"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse complète
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-pink-300" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-shadow bg-gray-50/50"
                  placeholder="123 rue des minous, 75000 Paris"
                  value={formData.adresse}
                  onChange={(e) =>
                    setFormData({ ...formData, adresse: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-pink-300" />
                </div>
                <input
                  type="tel"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-shadow bg-gray-50/50"
                  placeholder="06 12 34 56 78"
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                />
              </div>
            </div>

            {formStatus === "error" && (
              <p className="text-red-500 text-sm">Une erreur est survenue.</p>
            )}

            <button
              type="submit"
              disabled={formStatus === "submitting"}
              className="w-full py-4 mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {formStatus === "submitting"
                ? "Envoi en cours..."
                : "Confirmer la demande"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const AdminLoginView = ({ setView, setIsAdmin }) => {
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "Rose123*") {
      setIsAdmin(true);
      setView("admin_dashboard");
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <button
        onClick={() => setView("home")}
        className="flex items-center space-x-2 text-pink-500 hover:text-pink-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour au site</span>
      </button>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 text-center">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Cat className="h-8 w-8 text-pink-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Coucou Rose !</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Entre ton mot de passe secret pour accéder à tes demandes.
        </p>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Mot de passe"
            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none text-center text-lg"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
          {loginError && (
            <p className="text-red-500 text-sm">Mot de passe incorrect</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = ({
  pendingBookings,
  acceptedBookings,
  updateBookingStatus,
}) => {
  const [activeTab, setActiveTab] = useState("demandes");

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-gray-500">
            Bienvenue Rose, voici tes missions félines.
          </p>
        </div>

        <div className="flex bg-pink-100/50 p-1 rounded-full shadow-inner border border-pink-100">
          <button
            onClick={() => setActiveTab("demandes")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "demandes"
                ? "bg-white text-pink-600 shadow-sm"
                : "text-gray-600 hover:text-pink-500"
            }`}
          >
            Demandes en attente
            {pendingBookings.length > 0 && (
              <span className="ml-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingBookings.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("planning")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "planning"
                ? "bg-white text-pink-600 shadow-sm"
                : "text-gray-600 hover:text-pink-500"
            }`}
          >
            Mon Planning
          </button>
        </div>
      </div>

      {activeTab === "demandes" && (
        <div className="space-y-4">
          {pendingBookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
              <Cat className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Aucune demande
              </h3>
              <p className="text-gray-500">
                Tu n'as pas de nouvelles demandes pour le moment.
              </p>
            </div>
          ) : (
            pendingBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-sm border border-pink-100 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 flex items-center space-x-2">
                      <User className="w-4 h-4 text-pink-400" />
                      <span>{booking.nom}</span>
                    </h3>
                    <div className="text-gray-500 text-sm mt-2 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{booking.telephone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.adresse}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 h-fit">
                    <div className="flex items-center space-x-2 text-orange-600 font-medium mb-1">
                      <Clock className="w-4 h-4" />
                      <span>Dates souhaitées</span>
                    </div>
                    <div className="text-gray-800 font-semibold">
                      Du {formatDate(booking.startDate)} <br />
                      au {formatDate(booking.endDate)}
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-3 min-w-[140px]">
                  <button
                    onClick={() => updateBookingStatus(booking.id, "Acceptée")}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accepter</span>
                  </button>
                  <button
                    onClick={() => updateBookingStatus(booking.id, "Refusée")}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-1 border border-red-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Refuser</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "planning" && (
        <div className="space-y-4">
          {acceptedBookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Planning vide
              </h3>
              <p className="text-gray-500">
                Tu n'as pas encore de gardes prévues.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acceptedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden relative"
                >
                  <div className="h-2 w-full bg-emerald-400 absolute top-0 left-0"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Validée</span>
                      </span>
                      <Cat className="w-5 h-5 text-gray-300" />
                    </div>

                    <h3 className="font-bold text-xl text-gray-900 mb-1">
                      {booking.nom}
                    </h3>
                    <p className="text-emerald-600 font-semibold mb-4 text-sm bg-emerald-50 inline-block px-2 py-1 rounded-md">
                      Du {formatDate(booking.startDate)} au{" "}
                      {formatDate(booking.endDate)}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <span>{booking.adresse}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <span>{booking.telephone}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Voulez-vous vraiment annuler cette garde ?"
                          )
                        ) {
                          updateBookingStatus(booking.id, "En attente");
                        }
                      }}
                      className="mt-6 w-full text-xs text-gray-400 hover:text-red-500 text-center transition-colors"
                    >
                      Remettre en attente
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// APPLICATION PRINCIPALE
// ==========================================

export default function App() {
  const [view, setView] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState([]);

  // Écoute de Firebase en temps réel
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "demandes"), (snapshot) => {
      const fetchedBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(fetchedBookings);
    });
    return () => unsubscribe();
  }, []);

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const bookingDocRef = doc(db, "demandes", bookingId);
      await updateDoc(bookingDocRef, { status: newStatus });
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  // Filtrage automatique
  const pendingBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "En attente")
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
    [bookings]
  );

  const acceptedBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "Acceptée")
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
    [bookings]
  );

  return (
    <div className="min-h-screen bg-pink-50/50 font-sans text-gray-800">
      <Navbar setView={setView} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      <main className="transition-all duration-300 ease-in-out">
        {view === "home" && <HomeView setView={setView} />}
        {view === "booking" && <BookingView setView={setView} />}
        {view === "admin_login" && (
          <AdminLoginView setView={setView} setIsAdmin={setIsAdmin} />
        )}
        {view === "admin_dashboard" &&
          (isAdmin ? (
            <AdminDashboard
              pendingBookings={pendingBookings}
              acceptedBookings={acceptedBookings}
              updateBookingStatus={updateBookingStatus}
            />
          ) : (
            <HomeView setView={setView} />
          ))}
      </main>

      <footer className="mt-auto py-6 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} Les Chats de Rose. Fait avec ❤️ pour les
          félins.
        </p>
      </footer>
    </div>
  );
}
