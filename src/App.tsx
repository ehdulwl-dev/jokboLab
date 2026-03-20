import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import PhotosPage from "./pages/PhotosPage";
import NoticesPage from "./pages/NoticesPage";
import InquiryPage from "./pages/InquiryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/photos" element={<PhotosPage />} />
              <Route path="/notices" element={<NoticesPage />} />
              <Route path="/inquiry" element={<InquiryPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
