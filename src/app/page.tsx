import Link from "next/link";
import {
  GraduationCap,
  UserCog,
  BarChart3,
  FileText,
  ArrowRight,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-8 inline-flex items-center gap-2 px-4 py-2"
          >
            🚀 Assignment Analytics v1.0
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Assignment
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Analytics Platform
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Bridge instruction and evaluation.
            <span className="font-semibold text-blue-600">
              Track progress. Analyze performance. Drive results.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 h-14 group shadow-xl">
                <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Get Started
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="text-lg px-8 h-14">
                Create Account
              </Button>
            </Link>
          </div>

          {/* Role Preview Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="group hover:shadow-2xl border-0 bg-white/80 backdrop-blur-sm transition-all duration-500">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-all">
                  <UserCog className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">
                  📊 For Instructors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Real-time Analytics
                    </p>
                    <p className="text-sm text-gray-600">
                      Submission trends & performance insights
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl">
                  <FileText className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">AI Feedback</p>
                    <p className="text-sm text-gray-600">
                      Auto-generate constructive feedback
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl border-0 bg-white/80 backdrop-blur-sm transition-all duration-500">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-all">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">
                  🎯 For Students
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Easy Submission
                    </p>
                    <p className="text-sm text-gray-600">
                      Submit via live URL + notes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Track Progress
                    </p>
                    <p className="text-sm text-gray-600">
                      Real-time status & feedback
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 text-center bg-gradient-to-r from-slate-900 to-gray-900 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to level up your teaching?
          </h2>
          <p className="text-xl mb-12 opacity-90 leading-relaxed">
            Join instructors using analytics to transform student outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="text-lg px-10 h-14 bg-white text-gray-900 hover:bg-gray-100 shadow-2xl"
              >
                Start Free
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 h-14 border-white hover:bg-white/20"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
