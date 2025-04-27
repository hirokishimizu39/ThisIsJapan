import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import AuthPage from "@/pages/auth-page";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackendSelector from "@/components/BackendSelector";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="*">
          <>
            <Header />
            <Switch>
              <ProtectedRoute path="/" component={Home} />
              <Route component={NotFound} />
            </Switch>
            <Footer />
            <BackendSelector />
          </>
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
