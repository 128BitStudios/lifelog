import Link from "next/link";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">LifeLog</h1>
        </Link>
        
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button asChild>
            <Link href="/auth/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}