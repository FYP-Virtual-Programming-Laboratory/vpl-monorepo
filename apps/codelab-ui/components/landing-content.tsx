"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Code, Users, UserCheck, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function LandingContent() {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showStudentJoin, setShowStudentJoin] = useState(false)
  const [showStudentLogin, setShowStudentLogin] = useState(false)
  const [matricNumber, setMatricNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [isCheckingStudent, setIsCheckingStudent] = useState(false)

  const handleAdminLogin = () => {
    // In a real app, you would validate credentials here
    setShowAdminLogin(false)
    router.push("/admin_dashboard")
  }

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!matricNumber || !password) {
      alert("Please enter your matric number and password to login.");
      return;
    }

    setIsCheckingStudent(true)
    // Simulate API call to validate student login
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsCheckingStudent(false)
    setShowStudentLogin(false)
    router.push(`/student_dashboard/sessions?matricNo=${encodeURIComponent(matricNumber)}`)
  }

  const handleStudentJoin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!matricNumber || !firstName || !lastName || !email || !password || !confirmPassword) {
      alert("Please fill in all registration fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    setIsCheckingStudent(true)
    // Simulate API call to register student
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock registration - in a real app, you would create the student account here
    console.log("Registering student:", { matricNumber, firstName, lastName, email })
    setIsCheckingStudent(false)

    setShowStudentJoin(false)
    router.push(`/student_dashboard/sessions?matricNo=${encodeURIComponent(matricNumber)}`)
  }

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
            Your collaborative coding environment for managing sessions, tracking progress, and building amazing
            projects together.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button
            onClick={() => setShowAdminLogin(true)}
            size="lg"
            className="bg-white text-emerald-800 hover:bg-white/90 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <UserCheck className="mr-3 h-6 w-6" />
            Login as Admin
          </Button>

          <Button
            onClick={() => setShowStudentJoin(true)}
            size="lg"
            className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-emerald-800 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Users className="mr-3 h-6 w-6" />
            Join as Student
          </Button>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6 text-emerald-900" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Collaborative Coding</h3>
              <p className="text-white/80 text-sm">
                Work together on coding projects with real-time collaboration and feedback.
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
                Create and manage coding sessions with easy student enrollment and tracking.
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
                Monitor student progress and provide personalized feedback and guidance.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Admin Login Modal */}
      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-emerald-800">Admin Login</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" type="email" placeholder="admin@codelab.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input id="admin-password" type="password" placeholder="••••••••" />
            </div>
            <Button onClick={handleAdminLogin} className="w-full bg-emerald-800 hover:bg-emerald-700 text-white mt-6">
              Login to Dashboard
            </Button>
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="text-emerald-600 hover:underline">
                Contact your administrator
              </a>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Join Modal (Registration) */}
      <Dialog
        open={showStudentJoin}
        onOpenChange={(open) => {
          setShowStudentJoin(open)
          if (!open) {
            // Reset form when dialog closes
            setMatricNumber("")
            setFirstName("")
            setLastName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setIsCheckingStudent(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-emerald-800">Student Registration</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStudentJoin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="matric-number">Your Matric Number</Label>
              <Input
                id="matric-number"
                type="text"
                placeholder="U12345678"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                id="last-name"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white mt-6"
              disabled={isCheckingStudent}
            >
              Register
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setShowStudentJoin(false)
                  setShowStudentLogin(true)
                }}
                className="text-emerald-600 hover:underline"
              >
                Login here
              </a>
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Student Login Modal */}
      <Dialog
        open={showStudentLogin}
        onOpenChange={(open) => {
          setShowStudentLogin(open)
          if (!open) {
            // Reset form when dialog closes
            setMatricNumber("")
            setPassword("")
            setIsCheckingStudent(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-emerald-800">Student Login</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStudentLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="matric-number-login">Your Matric Number</Label>
              <Input
                id="matric-number-login"
                type="text"
                placeholder="U12345678"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                required
                disabled={isCheckingStudent}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-password-login">Password</Label>
              <Input
                id="student-password-login"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isCheckingStudent}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white mt-6"
              disabled={isCheckingStudent}
            >
              {isCheckingStudent ? "Logging in..." : "Login"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setShowStudentLogin(false)
                  setShowStudentJoin(true)
                }}
                className="text-emerald-600 hover:underline"
              >
                Register here
              </a>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
