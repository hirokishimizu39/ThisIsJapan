import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  return (
    <header className="bg-white shadow-sm px-4 md:px-8 py-4 sticky top-0 z-30">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-serif font-bold text-primary cursor-pointer">
              <span className="inline-block mr-1">This is</span>
              <span className="inline-block">Japan</span>
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="default" 
            className="px-3 py-2 rounded-full hidden md:block bg-primary text-primary-foreground"
          >
            サインイン
          </Button>
          
          <Button 
            variant="outline" 
            className="px-3 py-2 rounded-full border border-primary text-primary hidden md:block"
          >
            新規登録
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-6">
                <Button variant="default" className="w-full">
                  サインイン
                </Button>
                <Button variant="outline" className="w-full">
                  新規登録
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
