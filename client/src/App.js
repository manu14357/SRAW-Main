import "@mui/material";
import "react-icons";
import "react-icons/bi";
import "react-icons/md";
import "react-icons/bs";
import "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
  useSearchParams,
} from "react-router-dom";
import theme from "./theme";

import PostView from "./components/views/PostView";
import CreatePostView from "./components/views/CreatePostView";
import ProfileView from "./components/views/ProfileView";
import LoginView from "./components/views/LoginView";
import SignupView from "./components/views/SignupView";
import ExploreView from "./components/views/ExploreView";
import PrivateRoute from "./components/PrivateRoute";
import SearchView from "./components/views/SearchView";
import MessengerView from "./components/views/MessengerView";
import { initiateSocketConnection, socket } from "./helpers/socketHelper";
import { useEffect } from "react";
import { BASE_URL } from "./config";
import { io } from "socket.io-client";
import Footer from './components/Footer';
import MapPage from "./components/MapPage";

import PrivacyPolicy from "./components/Legal/PrivacyPolicy";
import TermsOfService from "./components/Legal/TermsOfService";
import CookiePolicy from "./components/Legal/CookiePolicy";
import CopyrightPolicy from "./components/Legal/CopyrightPolicy";
import About from "./components/Legal/About";

import Notifications from "./components/views/Notifications";
import NotifyView from "./components/views/Notifyview";

import Help from "./components/Help";
import CommunityChat from "./components/CommunityChat";
import ChatPage from "./components/Legal/ChatPage";

function App() {
  initiateSocketConnection();

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<ExploreView />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route
            path="/posts/create"
            element={
              <PrivateRoute>
                <CreatePostView />
              </PrivateRoute>
            }
          />
          <Route
            path="/messenger"
            element={
              <PrivateRoute>
                <MessengerView />
              </PrivateRoute>
            }
          />
          <Route path="/search" element={<SearchView />} />
          <Route path="/users/:id" element={<ProfileView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/signup" element={<SignupView />} />

          <Route path="/About" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/copyright-policy" element={<CopyrightPolicy />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/NotifyView" element={<NotifyView />} />

          <Route path="/help" element={<Help />} />
          <Route path="/community-chat" element={<CommunityChat />} />
          <Route path="/ChatPage" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
