import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { Features } from './pages/Features';
import { HowItWorks } from './pages/HowItWorks';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { SymptomChecker } from './pages/SymptomChecker';
import { MedicalReportAnalyzer } from './pages/MedicalReportAnalyzer';
import { MedicationLookup } from './pages/MedicationLookup';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[var(--surface-background)]">
          <Header />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/features" element={<Features />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/symptoms" element={<SymptomChecker />} />
              <Route path="/report" element={<MedicalReportAnalyzer />} />
              <Route path="/medications" element={<MedicationLookup />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
