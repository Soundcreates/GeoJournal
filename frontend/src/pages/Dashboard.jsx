import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Sparkles, Globe, Camera } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-primary p-4 rounded-full shadow-glow">
                <MapPin className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Journey,
              <br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                AI-Enhanced
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Capture your adventures with GeoJournal. Let AI transform your
              memories into beautiful stories while keeping track of every
              special place you visit.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                variant="hero"
                size="lg"
                className="text-lg px-8 py-6"
              >
                <Link to="/register">Start Your Journey</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-lg bg-card shadow-elegant border-0">
              <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 shadow-elegant">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                AI-Generated Captions
              </h3>
              <p className="text-muted-foreground">
                Transform your photos into compelling stories with intelligent,
                context-aware captions that capture the essence of your moments.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card shadow-elegant border-0">
              <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 shadow-elegant">
                <Globe className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Geotagged Memories
              </h3>
              <p className="text-muted-foreground">
                Never forget where magic happened. Every entry is automatically
                tagged with location data to create your personal travel map.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card shadow-elegant border-0">
              <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 shadow-elegant">
                <Camera className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Visual Timeline
              </h3>
              <p className="text-muted-foreground">
                Relive your adventures through an interactive timeline that
                showcases your journey in chronological order.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-center shadow-glow">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Document Your Adventures?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who are using AI to make their
              memories unforgettable.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
            >
              <Link to="/register">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
