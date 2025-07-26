"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calculator, FlaskConical, Search, Triangle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getFormulas } from "../actions/formula";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Loading from "@/components/custom/utils/Loading";
import HomeTopBar from "@/components/custom/sandbox/navbars/HomeTopBar";

export default function FormulasPage() {
  const [allFormulas, setAllFormulas] = useState<any[]>([]);
  const [filteredFormulas, setFilteredFormulas] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [fuse, setFuse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    setLoading(true);
    Promise.all([import("fuse.js"), getFormulas()]).then(
      ([Fuse, formulas]: [any, any[]]) => {
        setAllFormulas(formulas);
        setFilteredFormulas(formulas);

        const fuseInstance = new Fuse.default(formulas, {
          keys: ["title", "description"],
          threshold: 0.3,
          includeScore: true,
        });
        setFuse(fuseInstance);
        setLoading(false);
      }
    ).catch(error => {
      console.error("Error loading formulas:", error);
      setLoading(false);
    });
  }, []);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    if (!searchTerm.trim()) {
      setFilteredFormulas(allFormulas);
      return;
    }

    if (fuse) {
      const results = fuse.search(searchTerm);
      setFilteredFormulas(results.map((result: any) => result.item));
    }
  };

  // Map of icon strings to Lucide icon components
  const iconMap: { [key: string]: any } = {
    Calculator,
    Triangle,
    FlaskConical,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen">
        <HomeTopBar />
        {loading ? (
          <div className="h-screen flex items-center justify-center">
            <Loading className="text-foreground" />
          </div>
        ) : (
          <div>
            {/* Hero Section */}
            <div className="max-w-[1400px] mx-auto pt-24 px-6">
              <div className="space-y-4 mb-1">
                <div className="flex justify-center items-end gap-1">
                  <div className="">
                    <h1 className="text-3xl font-bold tracking-tight text-adyen bg-clip-text bg-gradient-to-r from-foreground">
                      Lab
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--custom-accent)] text-primary">{" "} Formulas</span>
                    </h1>
                  </div>
                </div>

                <div className="space-y-4 text-center animate-fade-in">
                  <p className="text-[1rem] font-medium text-muted-foreground max-w-[900px] mx-auto">
                    Browse our collection of pre-built checkout integrations
                  </p>
                </div>

                <div className="relative w-full max-w-[95%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] mx-auto mt-12 animate-slide-in-from-bottom">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-hover:text-adyen z-10" />
                    <Input
                      className="rounded-lg pl-12 h-14 backdrop-blur-sm border-border/40 hover:border-adyen/40 focus:ring-adyen/20 transition-all duration-300 text-base"
                      placeholder="Search formulas..."
                      value={search}
                      onChange={handleSearch}
                      id="search"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    {!loading ? `${filteredFormulas.length} formulas available` : "Loading..."}
                  </p>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="container mx-auto px-4 pb-16">
                <div className="max-w-[1400px] mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFormulas.map((formula, index) => {
                      const IconComponent = iconMap[formula.icon] || Calculator;

                      return (
                        <Card
                          key={index}
                          className="group flex flex-col bg-card/50 backdrop-blur-sm border-border/40 hover:border-adyen/40 transition-all duration-300 shadow-lg hover:shadow-adyen/5"
                        >
                          <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                            <div className="flex items-start gap-4">
                              <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-adyen group-hover:scale-110 transition-transform duration-300">
                                <IconComponent className="h-6 w-6" />
                              </div>
                              <div className="space-y-1">
                                <CardTitle className="text-xl font-medium text-foreground">
                                  {formula.title}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {formula.integrationType}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={formula.integrationType === "advance" ? "secondary" : "default"}
                              className="ml-auto capitalize bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                            >
                              {formula.txVariant}
                            </Badge>
                          </CardHeader>

                          <CardContent className="flex-grow pt-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {formula.description}
                            </p>
                            <div className="flex items-center mt-6 pt-4 border-t border-border/20">
                              <span className="text-xs text-muted-foreground">Built by</span>
                              <span className="text-xs font-medium ml-1.5 text-foreground">
                                {formula.builtBy}
                              </span>
                            </div>
                          </CardContent>

                          <CardFooter className="pt-4">
                            <Link
                              className="w-full"
                              href={`/${formula.integrationType}/${formula.txVariant}?id=${formula._id}`}
                            >
                              <Button
                                className="w-full bg-primary hover:border-primary  hover:border-2 text-card hover:text-primary font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                variant="default"
                              >
                                <span className="flex items-center justify-center gap-2">
                                  Use Formula
                                  <ArrowRight className="h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                                </span>
                              </Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
