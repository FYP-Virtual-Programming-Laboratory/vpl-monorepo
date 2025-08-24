"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { adminLogin, studentLogin } from "@/paths";
import { Code, UserCheck, Users } from "lucide-react";
import Link from "next/link";

export function LandingContent() {
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo and Welcome */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Code className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            Welcome to <span className="text-emerald-200">CodeLab</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Your collaborative coding environment for managing sessions,
            tracking progress, and building amazing projects together.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button
            size="lg"
            className="bg-white text-emerald-800 hover:bg-white/90 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <Link href={adminLogin()}>
              <UserCheck className="mr-3 h-6 w-6" />
              Login as Admin
            </Link>
          </Button>

          <Button
            size="lg"
            className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-emerald-800 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <Link href={studentLogin()}>
              <Users className="mr-3 h-6 w-6" />
              Login as Student
            </Link>
          </Button>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6 text-emerald-900" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Collaborative Coding
              </h3>
              <p className="text-white/80 text-sm">
                Work together on coding projects with real-time collaboration
                and feedback.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-emerald-900" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Session Management</h3>
              <p className="text-white/80 text-sm">
                Create and manage coding sessions with easy student enrollment
                and tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-6 w-6 text-emerald-900" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
              <p className="text-white/80 text-sm">
                Monitor student progress and provide personalized feedback and
                guidance.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
