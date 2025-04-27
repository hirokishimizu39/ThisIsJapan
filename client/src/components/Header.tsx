import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { LogOut, Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navigateToAuth = () => {
    navigate("/auth");
  };

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm px-4 md:px-8 py-4 sticky top-0 z-30">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-serif font-bold text-primary cursor-pointer">
              <span className="inline-block mr-1">This is</span>
              <span className="inline-block">Japan</span>
            </h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button 
                variant="default" 
                className="px-3 py-2 rounded-full hidden md:block bg-primary text-primary-foreground"
                onClick={() => navigateToAuth()}
              >
                サインイン
              </Button>
              
              <Button 
                variant="outline" 
                className="px-3 py-2 rounded-full border border-primary text-primary hidden md:block"
                onClick={() => navigateToAuth()}
              >
                新規登録
              </Button>
            </>
          )}
          
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              {user ? (
                <div className="flex flex-col gap-4 mt-6">
                  <div className="flex items-center space-x-2 p-2">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.isJapanese ? "Japanese User" : "Foreign User"}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    className="w-full mt-4"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 mt-6">
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => navigateToAuth()}
                  >
                    サインイン
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigateToAuth()}
                  >
                    新規登録
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
