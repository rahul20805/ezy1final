import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Search, Star } from "lucide-react";
import { useState } from "react";
import Layout from "../components/Layout";
import { workers } from "../mock-data";

export default function HomeServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWorkers = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout>
      <div className="container py-8 max-w-5xl">
        <div className="mb-8">
          <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">
            Home Services
          </Badge>
          <h1 className="text-3xl font-display font-bold mb-4">
            Book Trusted Professionals
          </h1>

          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for plumber, electrician, maid..."
              className="pl-10 h-12 rounded-xl border-border bg-card shadow-subtle"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <Card
              key={worker.id}
              className="border-border hover:shadow-elevated transition-smooth"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary font-display font-bold text-lg">
                    {worker.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{worker.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {worker.category}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                      <span className="text-xs font-semibold">
                        {worker.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({worker.totalReviews})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      ₹{worker.pricePerHour}
                      <span className="text-xs font-normal text-muted-foreground">
                        /hr
                      </span>
                    </p>
                  </div>
                  {worker.isAvailable ? (
                    <Badge
                      variant="outline"
                      className="text-[10px] text-green-600 border-green-200 bg-green-50"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Available
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] text-red-600 border-red-200 bg-red-50"
                    >
                      Busy
                    </Badge>
                  )}
                </div>

                {worker.isAvailable ? (
                  <Link to="/dashboard/checkout">
                    <Button className="w-full">Book Now</Button>
                  </Link>
                ) : (
                  <Button className="w-full" disabled>
                    Currently Unavailable
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
